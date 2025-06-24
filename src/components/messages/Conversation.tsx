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

const Conversation = ({ conversation,}: ConversationProps) => {
    const { otherUser, lastMessage } = conversation;

    return (
        <Link
            href={`/messages/${otherUser.slug}`}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition"
        >
            {/* Avatar */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border border-gray-500">
                {otherUser.image ? (
                    <Image
                        src={otherUser.image}
                        alt={otherUser.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="bg-gray-700 w-full h-full flex items-center justify-center text-white font-bold text-xl">
                        {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                )}
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
                    {!lastMessage?.readAt && lastMessage?.content && (
                        <span className="w-2 h-2 rounded-full bg-orange-400 ml-2 shrink-0" />
                    )}
                </div>
            </div>
        </Link>
    )
};

export default Conversation
