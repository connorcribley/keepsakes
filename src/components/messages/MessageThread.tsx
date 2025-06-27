"use client";

import { useState, useRef, useEffect } from "react";
import { DirectMessage } from "@prisma/client";
import { sendMessage } from "@/app/actions/messages";
import MessageBubble from "./MessageBubble";
import { deleteMessage } from "@/app/actions/messages";

interface MessageThreadProps {
    messages: DirectMessage[];
    userId: string;
    recipientId: string;
    conversationId: string | null;
}

const MessageThread = ({ messages, userId, recipientId, conversationId }: MessageThreadProps) => {
    const [newMessage, setNewMessage] = useState("");
    const [messageList, setMessageList] = useState(messages);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    const handleSend = async () => {
        const trimmed = newMessage.trim();
        if (!trimmed) return;

        const newMsg = await sendMessage({
            content: trimmed,
            recipientId,
            conversationId,
        });

        if (newMsg) {
            setMessageList((prev) => [...prev, newMsg]);
            setNewMessage("");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMessage(id); // your server action or API call
            setMessageList((prev) => prev.filter((msg) => msg.id !== id));
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Scrollable Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                {messageList.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        id={msg.id}
                        content={msg.content}
                        isSender={msg.senderId === userId}
                        createdAt={msg.createdAt}
                        onEdit={(id) => console.log("Edit", id)}
                        onDelete={handleDelete}
                        activeId={activeId}
                        setActiveId={setActiveId}
                    />
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input Fixed at Bottom */}
            <div className="p-2 border-t border-zinc-800 bg-zinc-900">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex gap-2"
                >
                    <textarea
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value)

                            const textarea = e.target;
                            textarea.style.height = "auto"; // Reset height
                            textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
                        }}
                        placeholder="Type your message..."
                        rows={1}
                        className="flex-1 resize-none overflow-hidden bg-zinc-800 text-white rounded px-3 py-2 outline-none max-h-40"
                    />
                    <button
                        type="submit"
                        className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MessageThread;
