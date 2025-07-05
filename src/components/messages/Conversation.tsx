"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

type ConversationProps = {
    conversation: {
        id: string;
        lastMessage: {
            content: string;
            readAt: Date | null;
            createdAt: Date;
        } | null;
        otherUser: {
            name: string;
            slug: string;
            image: string | null;
        };
    },
};

const Conversation = ({ conversation, }: ConversationProps) => {
    const { otherUser, lastMessage } = conversation;

    return (
        <Link
            href={`/messages/${otherUser.slug}`}
            className="flex flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-zinc-700 hover:bg-zinc-600 transition shadow-xl hover:shadow-x2l"
        >
            {/* Avatar */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border border-gray-500">
                <Image
                    src={otherUser.image || "/default-avatar.png"}
                    alt={otherUser.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center w-full">
                    <p className="font-semibold text-white text-sm truncate">
                        {otherUser.name}
                    </p>
                    {lastMessage?.createdAt && (
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(lastMessage.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-400 truncate max-w-[90%]">
                        {lastMessage?.content ?? (
                            <span className="italic text-gray-500">No messages yet</span>
                        )}
                    </p>
                </div>
            </div>
        </Link>
    )
};

export default Conversation
