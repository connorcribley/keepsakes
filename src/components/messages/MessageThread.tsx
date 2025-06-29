"use client";

import { useState, useRef, useEffect } from "react";
import { DirectMessage } from "@prisma/client";
import { sendMessage, deleteMessage, updateMessage } from "@/app/actions/messages";
import { Send, Trash2, Paperclip, X, FileText } from "lucide-react";
import WarningModal from "../floating/WarningModal";
import MessageBubble from "./MessageBubble";

interface MessageThreadProps {
    messages: DirectMessage[];
    userId: string;
    recipientId: string;
    conversationId: string | null;
}

const MessageThread = ({ messages, userId, recipientId, conversationId }: MessageThreadProps) => {
    const [newMessage, setNewMessage] = useState("");
    const [messageList, setMessageList] = useState(messages);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [showCancelEditModal, setShowCancelEditModal] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);


    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    const handleSend = async () => {
        const trimmed = newMessage.trim();
        if (!trimmed && attachments.length === 0) return;

        let attachmentUrls: string[] = [];

        if (attachments.length > 0) {
            const formData = new FormData();

            attachments.forEach((file) => {
                formData.append("attachments", file);
            });

            const res = await fetch("/api/attachments/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                console.error("Upload failed");
                return;
            }

            const data = await res.json();
            attachmentUrls = data.urls;
        }

        const newMsg = await sendMessage({
            content: trimmed || "[Attachment]",
            recipientId,
            conversationId,
            attachmentUrls,
        });

        if (newMsg) {
            setMessageList((prev) => [...prev, newMsg]);
            setNewMessage("");
            setAttachments([]);
        }
    };

    const handleEdit = async () => {
        if (!editId) return;
        const trimmed = newMessage.trim();
        if (!trimmed) return;


        const updatedMsg = await updateMessage(editId, trimmed);
        if (updatedMsg) {
            setMessageList((prev) =>
                prev.map((msg) => (msg.id === editId ? { ...msg, content: trimmed } : msg))
            );
            setNewMessage("");
            setEditId(null);
            setAttachments([]);
        }

    }

    const handleEditClick = (id: string) => {
        const msg = messageList.find((m) => m.id === id);
        if (!msg) return;

        setEditId(id);
        setNewMessage(msg.content);
        setActiveId(null);
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setNewMessage("");
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
                {messageList.map((msg, index) => {
                    const currentDate = new Date(msg.createdAt);
                    const previousDate = index > 0 ? new Date(messageList[index - 1].createdAt) : null;

                    const isNewDay =
                        !previousDate ||
                        currentDate.toDateString() !== previousDate.toDateString();

                    return (
                        <div key={msg.id}>
                            {isNewDay && (
                                <div className="text-center font-semibold text-gray-400 my-3">
                                    {currentDate.toLocaleDateString(undefined, {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            )}

                            <MessageBubble
                                key={msg.id}
                                id={msg.id}
                                content={msg.content}
                                isSender={msg.senderId === userId}
                                createdAt={msg.createdAt}
                                attachmentUrls={msg.attachmentUrls}
                                onEdit={handleEditClick}
                                onDelete={handleDelete}
                                activeId={activeId}
                                setActiveId={setActiveId}
                            />
                        </div>
                    )
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Fixed at Bottom */}
            <div className="p-2 border-t border-zinc-800 bg-zinc-900">
                {attachments.length > 0 && (
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold text-gray-300 mb-1">Attachments ({attachments.length}):</h2>
                        <div className="flex overflow-x-auto gap-2 mb-2 px-1">

                            {attachments.map((file, index) => (
                                <div key={index} className="relative w-16 h-16 flex-shrink-0 border rounded bg-zinc-700 p-1">
                                    {file.type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="object-cover w-full h-full rounded"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-xs text-white truncate">
                                            <FileText size={30} className="mt-1" />
                                            {file.name}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAttachments((prev) => prev.filter((_, i) => i !== index))
                                        }
                                        className="cursor-pointer absolute top-0 right-0 bg-black bg-opacity-60 text-white hover:text-orange-500 text-sm rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                )}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        editId ? handleEdit() : handleSend();
                    }}
                    className="flex gap-2"
                >

                    {editId && (
                        <button
                            type="button"
                            onClick={() => setShowCancelEditModal(true)}
                            aria-label="Cancel Edit"
                            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-full  w-12 h-12 md:w-15 md:h-15 flex justify-center items-center mt-1"
                        >
                            <Trash2 size={30} />
                        </button>
                    )}
                    <textarea
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value)

                            const textarea = e.target;
                            textarea.style.height = "auto"; // Reset height
                            textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
                        }}
                        placeholder={editId ? "Edit your message..." : "Type your message..."}
                        rows={1}
                        className="flex-1 resize-none bg-zinc-800 text-white rounded px-3 py-2 outline-none max-h-35"
                    />
                    <div className="flex flex-col gap-2 items-center justify-between min-h-[80px] py-1">
                        <div >
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                capture="environment"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const newFiles = Array.from(e.target.files);

                                        setAttachments((prev) => {
                                            const existingFileNames = new Set(prev.map((file) => file.name + file.lastModified));
                                            const uniqueNewFiles = newFiles.filter(
                                                (file) => !existingFileNames.has(file.name + file.lastModified)
                                            );

                                            return [...prev, ...uniqueNewFiles];
                                        });

                                        e.target.value = '';
                                    }
                                }}
                                className="hidden"
                                ref={fileInputRef}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer bg-blue-400 hover:bg-blue-500 text-white rounded-full w-12 h-12 md:w-15 md:h-15 flex justify-center items-center"
                            >
                                <Paperclip size={30} />
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white w-12 h-12 md:w-15 md:h-15 pr-1 pt-1 flex justify-center items-center rounded-full"
                        >
                            <Send size={30} />
                        </button>
                    </div>
                </form>
            </div>
            <WarningModal
                isOpen={showCancelEditModal}
                onClose={() => setShowCancelEditModal(false)}
                onConfirm={() => {
                    handleCancelEdit();
                    setShowCancelEditModal(false);
                }}
                title="Cancel Edit"
                content="Do you really want to cancel your edit?"
                closeText="Keep Editing"
                confirmText="Confirm Cancel"
            />
        </div>
    );
};

export default MessageThread;
