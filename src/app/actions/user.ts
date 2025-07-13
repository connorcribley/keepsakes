// app/actions/user.ts
'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache"
import cloudinary from "@/lib/cloudinary";

const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function isValidImageUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        const pathname = parsed.pathname;
        const ext = pathname.split(".").pop()?.toLowerCase();
        return !!ext && allowedExtensions.includes(ext);
    } catch {
        return false;
    }
}

function getPublicIdFromUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        const path = parsed.pathname;

        // Strip version prefix (e.g., /v1751739552/)
        const versionRegex = /\/v\d+\//;
        const versionSplit = path.split(versionRegex);

        if (versionSplit.length < 2) return null;

        // Remove extension (.jpg, .pdf, etc.)
        const withFolders = versionSplit[1].replace(/\.[^.]+$/, ""); // removes extension

        return withFolders.startsWith("/") ? withFolders.slice(1) : withFolders;
    } catch {
        return null;
    }
}

async function uploadImageToCloudinary(base64Data: string): Promise<string> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            base64Data,
            {
                folder: "user_profiles",
                resource_type: "auto",
                type: "upload",
            },
            (err, result) => {
                if (err || !result) return reject(err);
                resolve(result.secure_url);
            }
        );
    });
}

export async function updateUserProfile({
  name,
  location,
  bio,
  image,
}: {
  name: string;
  location?: string;
  bio?: string;
  image?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!name || name.length > 50) throw new Error("Name must be between 1 and 50 characters");
  if (location && location.length > 100) throw new Error("Location must be fewer than 100 characters");
  if (bio && bio.length > 1000) throw new Error("Bio must be fewer than 1000 characters");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true }
  });

  let newImageUrl = user?.image;

  // Handle image upload if a new image is provided
  if (image && image !== user?.image) {
    // Validate if it's a base64 data URL
    if (image.startsWith('data:image/')) {
      // Extract file type and validate
      const match = image.match(/^data:image\/([a-zA-Z]+);base64,/);
      if (!match) {
        throw new Error("Invalid image format");
      }
      
      const fileType = match[1].toLowerCase();
      if (!allowedExtensions.includes(fileType)) {
        throw new Error("Unsupported image format. Please use JPG, PNG, WebP, or GIF.");
      }

      // Check file size (approximate for base64)
      const base64Data = image.split(',')[1];
      const fileSize = Math.ceil((base64Data.length * 3) / 4);
      if (fileSize > MAX_FILE_SIZE) {
        throw new Error("Image file size must be less than 5MB.");
      }

      try {
        // Upload new image to Cloudinary
        newImageUrl = await uploadImageToCloudinary(image);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Failed to upload image. Please try again.");
      }
    } else if (isValidImageUrl(image)) {
      // If it's already a valid Cloudinary URL, use it directly
      newImageUrl = image;
    } else {
      throw new Error("Invalid image format");
    }
  }

  // Delete old image from Cloudinary if it exists and is different from new image
  if (user?.image && user.image !== newImageUrl) {
    const publicId = getPublicIdFromUrl(user.image);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
          type: "upload",
        });
      } catch (err) {
        console.error("Error deleting old Cloudinary image:", err);
        // Don't throw error here as the update should still proceed
      }
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      location,
      bio,
      image: newImageUrl,
    },
  });

  revalidatePath(`/profile/${session.user.id}`);
}
