import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Conversation from "@/components/messages/Conversation";
import { redirect } from "next/navigation";

const ConversationsPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) redirect("/login");

    // Get conversations where the user is a participant
    const conversations = await prisma.conversation.findMany({
        where: {
            OR: [
                { participant1Id: userId },
                { participant2Id: userId },
            ],
        },
        include: {
            participant1: true,
            participant2: true,
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1, // Only fetch the last message
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    const formattedConversations = conversations.map((conversation) => {
        const otherUser =
            conversation.participant1Id === userId
                ? conversation.participant2
                : conversation.participant1;

        const lastMessage = conversation.messages[0] ?? null;

        return {
            id: conversation.id,
            otherUser: {
                name: otherUser.name,
                slug: otherUser.slug!,
                image: otherUser.image,
            },
            lastMessage: lastMessage
                ? {
                    content: lastMessage.content || "[Attachments]",
                    createdAt: lastMessage.createdAt,
                    readAt: lastMessage.readAt,
                }
                : null,
        };
    });

    return (
        <main className="max-w-3xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-white mb-4">
                Your Conversations
            </h1>

            {formattedConversations.length === 0 ? (
                <p className="text-gray-400 text-sm">
                    You have no conversations yet. Start chatting with sellers or buyers!
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {formattedConversations.map((conversation) => (
                        <Conversation
                            key={conversation.id}
                            conversation={conversation}
                        />
                    ))}
                </div>
            )}
        </main>
    )
};

export default ConversationsPage
