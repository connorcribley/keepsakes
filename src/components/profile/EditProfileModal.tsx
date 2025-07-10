"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { SquarePen, X } from "lucide-react";
import ClickableImage from "@/components/ClickableImage";

interface EditProfileModalProps {
  image: string | null;
  name: string;
  location: string | null;
  bio: string | null;
}

const EditProfileModal = ({ image, name, location, bio }: EditProfileModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    image,
    name,
    location: location || "",
    bio: bio || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

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
          <div className="relative bg-zinc-900 w-full sm:max-w-lg sm:rounded-xl max-h-[90vh] overflow-y-auto p-6 text-gray-100 flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

            <div className="flex flex-col gap-4">
              {/* Profile Picture */}
              <div className="relative w-30 h-30 mx-auto">
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
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="bg-zinc-800 rounded-md px-3 py-2 text-gray-100 placeholder-gray-400 border border-zinc-700 focus:outline-none focus:border-orange-400"
              />

              {/* Location */}
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Your location"
                className="bg-zinc-800 rounded-md px-3 py-2 text-gray-100 placeholder-gray-400 border border-zinc-700 focus:outline-none focus:border-orange-400"
              />

              {/* Bio */}
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Write something about yourself..."
                className="bg-zinc-800 rounded-md px-3 py-2 text-gray-100 placeholder-gray-400 border border-zinc-700 focus:outline-none focus:border-orange-400 min-h-[100px]"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  className="px-4 py-2 rounded-md bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                  onClick={() => {
                    // Submit logic goes here
                    console.log("Form submitted:", form);
                    setIsOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default EditProfileModal;
