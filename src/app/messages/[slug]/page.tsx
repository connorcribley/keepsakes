import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import MessageMenuButton from "@/components/messages/MessageMenuButton";
import MessageThread from "@/components/messages/MessageThread";
import Link from "next/link";

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
        <div className="relative flex flex-col h-[calc(100dvh-106px)] w-full mx-auto overflow-hidden">
            <div className="relative flex justify-center p-4 border-b border-zinc-800 bg-zinc-900">
                <Link
                    href="/messages"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-400 transition-colors"
                    aria-label="Back to messages"
                >
                    <ArrowLeft size={35} />
                </Link>
                <Link
                    href={`/user/${recipient.slug}`}
                    className="inline-flex items-center gap-3 group"
                    aria-label={`View ${recipient.name}'s profile`}
                >
                    <img
                        src={recipient.image || "/default-avatar.png"} // fallback if no image
                        alt={recipient.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white group-hover:border-orange-500"
                    />
                    <h1 className="text-lg font-semibold group-hover:underline group-hover:text-orange-400 text-white">
                        {recipient.name}
                    </h1>
                </Link>
                    <MessageMenuButton conversationId={conversation?.id ?? null} />
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
