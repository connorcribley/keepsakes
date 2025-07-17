"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function blockUser(blockedUserId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const blockerId = session.user.id;
    if (!blockerId) throw new Error("Unauthorized");

    if (blockerId === blockedUserId) {
        throw new Error("You can't block yourself");
    }

    // Avoid duplicates
    const existing = await prisma.userBlock.findUnique({
        where: {
            blockerId_blockedId: {
                blockerId,
                blockedId: blockedUserId,
            },
        },
    });

    if (existing) {
        console.log("Block already exists");
        return;
    };

    await prisma.userBlock.create({
        data: {
            blockerId,
            blockedId: blockedUserId,
        },
    });
}

export async function unblockUser(unblockedUserId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const blockerId = session.user.id;
    if (!blockerId) throw new Error("Unauthorized");

    if (blockerId === unblockedUserId) {
        throw new Error("You can't unblock yourself");
    }

    // Find and delete the existing block
    await prisma.userBlock.deleteMany({
        where: {
            blockerId,
            blockedId: unblockedUserId,
        },
    });
}