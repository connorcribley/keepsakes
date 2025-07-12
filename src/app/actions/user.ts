// app/actions/user.ts
'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (bio && bio.length > 1000) {
    throw new Error("Bio must be 1000 characters or less");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      location,
      bio,
      image,
    },
  });

  revalidatePath(`/profile/${session.user.id}`);
}
