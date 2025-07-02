'use server';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

interface SendMessageProps {
    content: string;
    recipientId: string;
    conversationId: string | null;
    attachmentUrls?: string[];
}

const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "pdf"];
const MAX_MESSAGE_LENGTH = 1000;

function isValidAttachmentUrl(url: string): boolean {
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
    const match = url.match(/\/upload\/(?:v\d+\/)?([^.\s]+)\.[a-z]+$/i);
    return match ? match[1] : null;
}

export async function sendMessage({
    content,
    recipientId,
    conversationId,
    attachmentUrls = [],
}: SendMessageProps) {
    const session = await auth();

    if (!session?.user?.id) return null;
    const senderId = session.user.id;

    if (content.length > MAX_MESSAGE_LENGTH) {
        throw new Error("Message too long");
    }

    let convoId = conversationId;

    if (!convoId) {
        const existing = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { participant1Id: senderId, participant2Id: recipientId },
                    { participant1Id: recipientId, participant2Id: senderId },
                ],
            },
        });

        convoId = existing?.id ?? (
            await prisma.conversation.create({
                data: {
                    participant1Id: senderId,
                    participant2Id: recipientId,
                },
            })
        ).id;
    }

    const validAttachmentUrls = attachmentUrls.filter(isValidAttachmentUrl)

    const message = await prisma.directMessage.create({
        data: {
            content,
            attachmentUrls: validAttachmentUrls,
            senderId,
            recipientId,
            conversationId: convoId,
        },
    });

    await prisma.conversation.update({
        where: { id: convoId },
        data: { updatedAt: new Date() },
    });

    return message;
}

export async function deleteMessage(messageId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");


    const message = await prisma.directMessage.findUnique({
        where: { id: messageId },
    });

    if (!message || message.senderId !== session.user.id) {
        throw new Error("Forbidden");
    }

    // Step 1: Delete any Cloudinary attachments
    const attachmentUrls = message.attachmentUrls ?? [];

    await Promise.all(
        attachmentUrls.map(async (url) => {
            const publicId = getPublicIdFromUrl(url);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Error deleting Cloudinary file:", err);
                }
            }
        })
    );

    await prisma.directMessage.delete({
        where: { id: messageId },
    });
}



export async function updateMessage(
    messageId: string,
    messageContent: string,
    attachmentUrls: string[] = []
) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    
    if (messageContent.length > MAX_MESSAGE_LENGTH) {
        throw new Error("Message too long");
    }

    const message = await prisma.directMessage.findUnique({
        where: { id: messageId },
    });

    if (!message || message.senderId !== session.user.id) {
        throw new Error("Forbidden");
    }

    const validAttachmentUrls = attachmentUrls.filter(isValidAttachmentUrl)

    const removedUrls = message.attachmentUrls.filter(
        (oldUrl) => !validAttachmentUrls.includes(oldUrl)
    );

    await Promise.all(
        removedUrls.map(async (url) => {
            const publicId = getPublicIdFromUrl(url);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Error deleting from Cloudinary:", err);
                }
            }
        })
    );

    return await prisma.directMessage.update({
        where: { id: messageId },
        data: {
            content: messageContent,
            attachmentUrls: validAttachmentUrls,
        },
    });
}