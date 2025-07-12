"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { SquarePen } from "lucide-react";
import { updateUserProfile } from "@/app/actions/user"; // adjust path as needed

interface EditProfileModalProps {
  image: string | null;
  name: string;
  location: string | null;
  bio: string | null;
}

const EditProfileModal = ({ image, name, location, bio }: EditProfileModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");


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
                <div className="text-sm text-gray-400 text-right">
                  {form.name.length}/50
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
                <div className="text-sm text-gray-400 text-right">
                  {form.location.length}/100
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
                <div className="text-sm text-gray-400 text-right">
                  {form.bio.length}/1000
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
                  className="cursor-pointer px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                  onClick={handleSubmit}
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
