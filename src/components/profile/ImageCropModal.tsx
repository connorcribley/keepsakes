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
  const [dragType, setDragType] = useState<'move' | 'resize' | null>(null);
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

    // Draw image
    ctx.putImageData(imageData, 0, 0);

    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(cropArea.x, cropArea.y, cropArea.size, cropArea.size);
    ctx.globalCompositeOperation = 'source-over';

    // Draw crop border
    ctx.strokeStyle = '#f97316'; // orange-500
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.size, cropArea.size);

    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = '#f97316';
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x + cropArea.size - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y + cropArea.size - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x + cropArea.size - handleSize/2, cropArea.y + cropArea.size - handleSize/2, handleSize, handleSize);
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

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const isInCorner = (x: number, y: number) => {
    const handleSize = 8;
    const corners = [
      { x: cropArea.x - handleSize/2, y: cropArea.y - handleSize/2 },
      { x: cropArea.x + cropArea.size - handleSize/2, y: cropArea.y - handleSize/2 },
      { x: cropArea.x - handleSize/2, y: cropArea.y + cropArea.size - handleSize/2 },
      { x: cropArea.x + cropArea.size - handleSize/2, y: cropArea.y + cropArea.size - handleSize/2 }
    ];

    return corners.some(corner => 
      x >= corner.x && x <= corner.x + handleSize && 
      y >= corner.y && y <= corner.y + handleSize
    );
  };

  const isInCropArea = (x: number, y: number) => {
    return x >= cropArea.x && x <= cropArea.x + cropArea.size &&
           y >= cropArea.y && y <= cropArea.y + cropArea.size;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const coords = getEventCoordinates(e);
    
    if (isInCorner(coords.x, coords.y)) {
      setDragType('resize');
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
    
    if (isInCorner(coords.x, coords.y)) {
      setDragType('resize');
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
    if (!canvas || !imageData) return;

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    // Set crop canvas size to the crop area size
    cropCanvas.width = cropArea.size;
    cropCanvas.height = cropArea.size;

    // Draw the cropped portion
    cropCtx.drawImage(
      canvas,
      cropArea.x, cropArea.y, cropArea.size, cropArea.size,
      0, 0, cropArea.size, cropArea.size
    );

    // Convert to data URL
    const croppedImageDataUrl = cropCanvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedImageDataUrl);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4 sm:px-0">
      <div className="bg-zinc-900 w-full sm:max-w-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto p-6 text-gray-100 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Crop Image</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-400">
              Selected file: {imageFile.name}
            </p>
            
            {/* Crop Canvas */}
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="border border-gray-600 rounded-lg cursor-crosshair"
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
                className="px-4 py-2 rounded-md bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCrop}
                className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
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