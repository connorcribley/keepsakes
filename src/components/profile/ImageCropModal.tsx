"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface ImageCropModalProps {
  imageFile: File;
  onCropComplete: (croppedImageDataUrl: string) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  size: number;
}

const ImageCropModal = ({ imageFile, onCropComplete, onCancel }: ImageCropModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, size: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageData, setImageData] = useState<ImageData | null>(null);

  // Load image and initialize canvas
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to fit image while maintaining aspect ratio
      const maxSize = 500;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      const width = img.width * scale;
      const height = img.height * scale;

      canvas.width = width;
      canvas.height = height;

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Store image data for cropping
      setImageData(ctx.getImageData(0, 0, width, height));

      // Initialize crop area to center with reasonable size
      const cropSize = Math.min(width, height) * 0.8;
      setCropArea({
        x: (width - cropSize) / 2,
        y: (height - cropSize) / 2,
        size: cropSize
      });

      setImageLoaded(true);
    };
    img.src = URL.createObjectURL(imageFile);
  }, [imageFile]);

  // Draw canvas with crop overlay
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image first
    ctx.putImageData(imageData, 0, 0);

    // --- DRAW semi-transparent overlay with cut-out crop area ---
    ctx.save();

    // Create a path that covers everything
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);

    // Subtract the crop area from the path
    ctx.moveTo(cropArea.x, cropArea.y);
    ctx.rect(cropArea.x, cropArea.y, cropArea.size, cropArea.size);

    // Use even-odd fill rule to cut out the crop square
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fill('evenodd');

    ctx.restore();

    // --- DRAW black border behind orange crop border ---
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#111';
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.size, cropArea.size);

    // Then draw orange border on top
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#f97316'; // orange-500
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.size, cropArea.size);

    // --- DRAW circular corner handles with black border ---
    const handleRadius = 10;
    ctx.fillStyle = '#f97316';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;

    const drawCircle = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, handleRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };

    drawCircle(cropArea.x, cropArea.y); // top-left
    drawCircle(cropArea.x + cropArea.size, cropArea.y); // top-right
    drawCircle(cropArea.x, cropArea.y + cropArea.size); // bottom-left
    drawCircle(cropArea.x + cropArea.size, cropArea.y + cropArea.size); // bottom-right
  }, [imageData, cropArea]);


  // Redraw canvas when crop area changes
  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [cropArea, imageLoaded, drawCanvas]);

  // Handle mouse/touch events
  const getEventCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
  
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  
    // Compute scale between CSS pixels and canvas pixels
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
  
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };
  

  const getCorner = (x: number, y: number): string | null => {
    const handleSize = 10;
    const corners = {
      'top-left': { x: cropArea.x - handleSize / 2, y: cropArea.y - handleSize / 2 },
      'top-right': { x: cropArea.x + cropArea.size - handleSize / 2, y: cropArea.y - handleSize / 2 },
      'bottom-left': { x: cropArea.x - handleSize / 2, y: cropArea.y + cropArea.size - handleSize / 2 },
      'bottom-right': { x: cropArea.x + cropArea.size - handleSize / 2, y: cropArea.y + cropArea.size - handleSize / 2 },
    };

    for (const [cornerName, cornerPos] of Object.entries(corners)) {
      if (
        x >= cornerPos.x && x <= cornerPos.x + handleSize &&
        y >= cornerPos.y && y <= cornerPos.y + handleSize
      ) {
        return cornerName;
      }
    }

    return null;
  };

  const isInCropArea = (x: number, y: number) => {
    return x >= cropArea.x && x <= cropArea.x + cropArea.size &&
      y >= cropArea.y && y <= cropArea.y + cropArea.size;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const coords = getEventCoordinates(e);

    const corner = getCorner(coords.x, coords.y);
    if (corner) {
      setDragType(corner); // e.g., 'top-left', 'bottom-right'
    } else if (isInCropArea(coords.x, coords.y)) {
      setDragType('move');
    } else {
      return;
    }

    setIsDragging(true);
    setDragStart({ x: coords.x - cropArea.x, y: coords.y - cropArea.y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const coords = getEventCoordinates(e);

    const corner = getCorner(coords.x, coords.y);
    if (corner) {
      setDragType(corner); // e.g., 'top-left', 'bottom-right'
    } else if (isInCropArea(coords.x, coords.y)) {
      setDragType('move');
    } else {
      return;
    }

    setIsDragging(true);
    setDragStart({ x: coords.x - cropArea.x, y: coords.y - cropArea.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const coords = getEventCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (dragType === 'move') {
      const newX = Math.max(0, Math.min(canvas.width - cropArea.size, coords.x - dragStart.x));
      const newY = Math.max(0, Math.min(canvas.height - cropArea.size, coords.y - dragStart.y));
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (
      dragType === 'top-left' ||
      dragType === 'top-right' ||
      dragType === 'bottom-left' ||
      dragType === 'bottom-right'
    ) {
      let newX = cropArea.x;
      let newY = cropArea.y;
      let newSize = cropArea.size;

      if (dragType === 'bottom-right') {
        const delta = Math.max(coords.x - cropArea.x, coords.y - cropArea.y);
        newSize = Math.max(50, Math.min(
          Math.min(canvas.width - cropArea.x, canvas.height - cropArea.y),
          delta
        ));
      }

      else if (dragType === 'top-left') {
        const delta = Math.max(cropArea.x + cropArea.size - coords.x, cropArea.y + cropArea.size - coords.y);
        newSize = Math.max(50, Math.min(delta, cropArea.x + cropArea.size, cropArea.y + cropArea.size));
        newX = cropArea.x + cropArea.size - newSize;
        newY = cropArea.y + cropArea.size - newSize;
      }

      else if (dragType === 'top-right') {
        const delta = Math.max(coords.x - cropArea.x, cropArea.y + cropArea.size - coords.y);
        newSize = Math.max(50, Math.min(delta, canvas.width - cropArea.x, cropArea.y + cropArea.size));
        newY = cropArea.y + cropArea.size - newSize;
      }

      else if (dragType === 'bottom-left') {
        const delta = Math.max(cropArea.x + cropArea.size - coords.x, coords.y - cropArea.y);
        newSize = Math.max(50, Math.min(delta, cropArea.x + cropArea.size, canvas.height - cropArea.y));
        newX = cropArea.x + cropArea.size - newSize;
      }

      // Clamp if necessary
      newX = Math.max(0, Math.min(canvas.width - newSize, newX));
      newY = Math.max(0, Math.min(canvas.height - newSize, newY));

      setCropArea({ x: newX, y: newY, size: newSize });
    }

  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const coords = getEventCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (dragType === 'move') {
      const newX = Math.max(0, Math.min(canvas.width - cropArea.size, coords.x - dragStart.x));
      const newY = Math.max(0, Math.min(canvas.height - cropArea.size, coords.y - dragStart.y));
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (dragType === 'resize') {
      const deltaX = coords.x - (cropArea.x + cropArea.size);
      const deltaY = coords.y - (cropArea.y + cropArea.size);
      const delta = Math.max(deltaX, deltaY);

      const newSize = Math.max(50, Math.min(
        Math.min(canvas.width - cropArea.x, canvas.height - cropArea.y),
        cropArea.size + delta
      ));

      setCropArea(prev => ({ ...prev, size: newSize }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragType(null);
  };

  const handleApplyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      const exportSize = 512; // Or 1024 for HD export
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d');
      if (!offscreenCtx) return;

      offscreenCanvas.width = exportSize;
      offscreenCanvas.height = exportSize;

      // Calculate scale between original image and visible canvas
      const scaleX = img.width / canvas.width;
      const scaleY = img.height / canvas.height;

      // Scale crop area back to original image dimensions
      const sx = cropArea.x * scaleX;
      const sy = cropArea.y * scaleY;
      const sSize = cropArea.size * scaleX; // Assume scaleX ≈ scaleY for 1:1

      // Draw cropped area from original image, scaled to export size
      offscreenCtx.drawImage(
        img,
        sx, sy, sSize, sSize,
        0, 0, exportSize, exportSize
      );

      const croppedImageDataUrl = offscreenCanvas.toDataURL('image/jpeg', 0.9);
      onCropComplete(croppedImageDataUrl);
    };

    // Load from original file
    img.src = URL.createObjectURL(imageFile);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4 sm:px-0">
      <div className="bg-zinc-900 w-full sm:max-w-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto p-6 text-gray-100 flex flex-col">
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-2xl font-semibold">Crop Image</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-400">
              Selected file: {imageFile.name}
            </p>

            {/* Crop Canvas */}
            <div className="flex justify-center w-full overflow-x-auto">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto border border-gray-600 rounded-lg cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'none' }}
              />
            </div>

            <p className="text-sm text-gray-400">
              Drag the orange square to move it, drag corners to resize
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onCancel}
                className="cursor-pointer px-4 py-2 rounded-md bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCrop}
                className="cursor-pointer px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageCropModal;