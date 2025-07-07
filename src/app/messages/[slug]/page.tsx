import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import MessageClient from "@/components/messages/MessageClient";

interface Props {
    params: {
        slug: string;
    };
}

const MessagePage = async ({ params }: Props) => {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { slug } = await params;

    const sender = await prisma.user.findUnique({
        where: { id: session.user.id },
    });
    if (!sender) redirect("/login");

    const recipient = await prisma.user.findUnique({
        where: { slug },
    });
    if (!recipient || recipient.id === sender.id) notFound();

    const isBlocked = await prisma.userBlock.findFirst({
        where: {
            OR: [
                { blockerId: sender.id, blockedId: recipient.id },
                { blockerId: recipient.id, blockedId: sender.id },
            ],
        },
    });

    const conversation = await prisma.conversation.findFirst({
        where: {
            OR: [
                { participant1Id: sender.id, participant2Id: recipient.id },
                { participant1Id: recipient.id, participant2Id: sender.id },
            ],
        },
        include: {
            messages: {
                orderBy: { createdAt: "asc" },
                include: {
                    sender: true,
                    recipient: true,
                },
            },
        },
    });

    return (
        <MessageClient
            messages={conversation?.messages ?? []}
            userId={sender.id}
            conversationId={conversation?.id ?? null}
            recipientId={recipient.id}
            recipientName={recipient.name}
            recipientImage={recipient.image || "/default-avatar.png"}
            recipientSlug={recipient.slug}
            isBlocked={!!isBlocked}
        />
    );
};

export default MessagePage;
