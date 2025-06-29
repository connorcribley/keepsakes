'use server';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface SendMessageProps {
    content: string;
    recipientId: string;
    conversationId: string | null;
}

export async function sendMessage({ content, recipientId, conversationId }: SendMessageProps) {
    const session = await auth();

    if (!session?.user?.id) return null;
    const senderId = session.user.id;

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

        if (existing) {
            convoId = existing.id;
        } else {
            const newConversation = await prisma.conversation.create({
                data: {
                    participant1Id: senderId,
                    participant2Id: recipientId,
                },
            });

            convoId = newConversation.id;
        }
    }

    const message = await prisma.directMessage.create({
        data: {
            content,
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

    await prisma.directMessage.delete({
        where: { id: messageId },
    });
}

export async function updateMessage(messageId: string, messageContent: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const message = await prisma.directMessage.findUnique({
        where: { id: messageId },
    });

    if (!message || message.senderId !== session.user.id) {
        throw new Error("Forbidden");
    }

    return await prisma.directMessage.update({
        where: { id: messageId },
        data: { content: messageContent },
    });
}