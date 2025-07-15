"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { SquarePen } from "lucide-react";
import { updateUserProfile } from "@/app/actions/user"; // adjust path as needed
import ImageCropModal from "./ImageCropModal";

interface EditProfileModalProps {
  image: string | null;
  name: string;
  location: string | null;
  bio: string | null;
}

const EditProfileModal = ({ image, name, location, bio }: EditProfileModalProps) => {
  const MAX_NAME_LENGTH = 50;
  const MAX_LOCATION_LENGTH = 100;
  const MAX_BIO_LENGTH = 1000;
  const [isOpen, setIsOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    image,
    name,
    location: location || "",
    bio: bio || "",
  });

  const isNameTooLong = form.name.length > MAX_NAME_LENGTH;
  const isLocationTooLong = form.location.length > MAX_LOCATION_LENGTH;
  const isBioTooLong = form.bio.length > MAX_BIO_LENGTH;

  const isFormValid = !isNameTooLong && !isLocationTooLong && !isBioTooLong;

  // Image validation constants
  const ACCEPTED_IMAGE_TYPES = ["jpg", "jpeg", "png", "webp", "gif"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !ACCEPTED_IMAGE_TYPES.includes(fileExtension)) {
      return {
        isValid: false,
        error: `Invalid file type. Please select a ${ACCEPTED_IMAGE_TYPES.join(', ')} file.`
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: "File size must be under 5MB."
      };
    }

    return { isValid: true };
  };

  const checkImageAspectRatio = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const isSquare = Math.abs(aspectRatio - 1) < 0.1; // Allow small tolerance
        resolve(isSquare);
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError("");

    // Validate file type and size
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    // Check aspect ratio
    const isSquare = await checkImageAspectRatio(file);

    if (isSquare) {
      // Image is already 1:1, set it directly
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      // Image needs cropping, open crop modal
      setSelectedImageFile(file);
      setIsCropModalOpen(true);
    }
  };

  const handleCropComplete = (croppedImageDataUrl: string) => {
    setForm((prev) => ({ ...prev, image: croppedImageDataUrl }));
    setIsCropModalOpen(false);
    setSelectedImageFile(null);
  };

  const handleCropCancel = () => {
    setIsCropModalOpen(false);
    setSelectedImageFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError(""); // clear previous error
      await updateUserProfile({
        name: form.name,
        location: form.location || undefined,
        bio: form.bio || undefined,
        image: form.image || undefined,
      });
      setIsOpen(false);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <>
      <button
        className="cursor-pointer mr-1 ml-auto text-gray-100 hover:text-orange-400 transition"
        onClick={() => setIsOpen(true)}
      >
        <SquarePen size={35} />
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4 sm:px-0">
          <div className="bg-zinc-900 w-full sm:max-w-lg sm:rounded-xl max-h-[90vh] overflow-y-auto p-6 text-gray-100 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

            <div className="flex flex-col">
              {/* Profile Picture */}
              <div className="relative w-30 h-30 mx-auto mb-2">
                <img
                  src={form.image || "/default-pfp.svg"}
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover border-2 border-white"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black opacity-50 flex items-center justify-center rounded-full cursor-pointer"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer text-white hover:opacity-60"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <SquarePen size={35} />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-1 ml-1">Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="text-sm text-right">
                  <span className={`${isNameTooLong ? 'text-red-500' : 'text-gray-400'}`}>{form.name.length}</span>
                  <span className="text-gray-400">/{MAX_NAME_LENGTH}</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm text-gray-300 mb-1 ml-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Your location"
                  className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="text-sm text-right">
                  <span className={`${isLocationTooLong ? 'text-red-500' : 'text-gray-400'}`}>{form.location.length}</span>
                  <span className="text-gray-400">/{MAX_LOCATION_LENGTH}</span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm text-gray-300 mb-1 ml-1">Profile Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Write something about yourself..."
                  className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[100px]"
                />
                <div className="text-sm text-right">
                  <span className={`${isBioTooLong ? 'text-red-500' : 'text-gray-400'}`}>{form.bio.length}</span>
                  <span className="text-gray-400">/{MAX_BIO_LENGTH}</span>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center mb-1">{error}</p>}

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  className="cursor-pointer px-4 py-2 rounded-md bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-white transition ${isFormValid
                      ? 'cursor-pointer bg-orange-500 hover:bg-orange-600'
                      : 'bg-zinc-700 opacity-50 cursor-not-allowed'
                    }`}
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Image Crop Modal */}
      {isCropModalOpen && selectedImageFile && (
        <ImageCropModal
          imageFile={selectedImageFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
};

export default EditProfileModal;
