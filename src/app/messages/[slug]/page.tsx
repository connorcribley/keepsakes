import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import MessageThread from "@/components/messages/MessageThread";

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
        <div className="relative flex flex-col h-[calc(100dvh-106px)] w-full max-w-2xl mx-auto overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-zinc-800 bg-zinc-900">
                <h1 className="text-lg font-semibold text-white">
                    Chat with {recipient.name}
                </h1>
            </div>
            <div className="flex-1 overflow-hidden">
                <MessageThread
                    messages={conversation?.messages ?? []}
                    userId={sender.id}
                    conversationId={conversation?.id ?? null}
                    recipientId={recipient.id}
                />
            </div>
        </div>
    );
};

export default MessagePage;
