"use client";

import { useState, useRef, useEffect } from "react";
import { DirectMessage } from "@prisma/client";
import { sendMessage, deleteMessage, updateMessage } from "@/app/actions/messages";
import { Send, Trash2, Paperclip, X, FileText } from "lucide-react";
import WarningModal from "../floating/WarningModal";
import MessageBubble from "./MessageBubble";
import clsx from "clsx";

interface MessageThreadProps {
    messages: DirectMessage[];
    userId: string;
    recipientId: string;
    conversationId: string | null;
}

const MAX_MESSAGE_LENGTH = 1000;
const MAX_ATTACHMENTS = 5;
const MAX_FILE_SIZE_MB = 5;

const MessageThread = ({ messages, userId, recipientId, conversationId }: MessageThreadProps) => {
    const [newMessage, setNewMessage] = useState("");
    const [messageList, setMessageList] = useState(messages);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [showCancelEditModal, setShowCancelEditModal] = useState(false);

    const [attachments, setAttachments] = useState<File[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<string[]>([]); // ← NEW

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
        if (!trimmed && attachments.length === 0 && existingAttachments.length === 0) return;

        let uploadedUrls: string[] = [];

        if (attachments.length > 0) {
            const formData = new FormData();
            attachments.forEach((file) => formData.append("attachments", file));

            const res = await fetch("/api/attachments/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                console.error("Upload failed");
                return;
            }

            const data = await res.json();
            uploadedUrls = data.urls;
        }

        const updatedMsg = await updateMessage(editId, trimmed, [...existingAttachments, ...uploadedUrls]);

        if (updatedMsg) {
            setMessageList((prev) =>
                prev.map((msg) => (msg.id === editId ? { ...msg, content: trimmed, attachmentUrls: [...existingAttachments, ...uploadedUrls] } : msg))
            );
            setNewMessage("");
            setEditId(null);
            setAttachments([]);
            setExistingAttachments([]);
        }

    }

    const handleEditClick = (id: string) => {
        const msg = messageList.find((m) => m.id === id);
        if (!msg) return;

        setEditId(id);
        setNewMessage(msg.content);
        setExistingAttachments(msg.attachmentUrls || []);
        setAttachments([]);
        setActiveId(null);
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setNewMessage("");
        setAttachments([]);
        setExistingAttachments([]);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMessage(id); // your server action or API call
            setMessageList((prev) => prev.filter((msg) => msg.id !== id));
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    const messageTooLong = newMessage.length > MAX_MESSAGE_LENGTH;
    const totalAttachments = existingAttachments.length + attachments.length;
    const tooManyAttachments = totalAttachments > MAX_ATTACHMENTS;
    const oversizedFiles = attachments.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    const hasOversized = oversizedFiles.length > 0;
    const disableSend = messageTooLong || tooManyAttachments || hasOversized;

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
                {(existingAttachments.length > 0 || attachments.length > 0) && (
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold text-gray-300 mb-1">
                            Attachments (<span className={tooManyAttachments ? "text-red-500" : ""}>
                                {totalAttachments}
                            </span> of {MAX_ATTACHMENTS}):
                            {hasOversized && (
                                <span className="ml-2 text-red-500 font-semibold">
                                    [One or more attachments exceeds 5MB]
                                </span>
                            )}
                        </h2>
                        <div className="flex overflow-x-auto gap-2 mb-2 px-1">
                            {/* Existing attachments (Edit)*/}
                            {existingAttachments.map((url, index) => (
                                <div key={`existing-${index}`} className="relative w-16 h-16 flex-shrink-0 border rounded bg-zinc-700 p-1">
                                    {url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                                        <img src={url} alt="existing" className="object-cover w-full h-full rounded" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-xs text-white truncate">
                                            <FileText size={30} className="mt-1" />
                                            {url.split("/").pop()}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExistingAttachments((prev) => prev.filter((_, i) => i !== index))
                                        }
                                        className="cursor-pointer absolute top-0 right-0 bg-black bg-opacity-60 text-white hover:text-orange-500 text-sm rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                            {/* Added attachments (Send or Edit) */}
                            {attachments.map((file, index) => {
                                const isOversized = file.size > MAX_FILE_SIZE_MB * 1024 * 1024;
                                const isOverflow = totalAttachments > MAX_ATTACHMENTS && index + existingAttachments.length >= MAX_ATTACHMENTS;

                                return (<div
                                    key={index}
                                    className={clsx(
                                        "relative w-16 h-16 flex-shrink-0 border rounded bg-zinc-700 p-1",
                                        (isOversized || isOverflow) ? "border-red-500" : "border-white"
                                    )}
                                >
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
                                </div>)
                            })}
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
                    <div className="flex flex-col w-full bg-zinc-800 rounded max-h-30">
                        <textarea
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value)
                                const textarea = e.target;
                                textarea.style.height = "auto"; // Reset height
                                textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
                            }}
                            placeholder={editId ? "Edit your message..." : "Type your message..."}
                            // rows={1}
                            className="w-full h-full resize-none bg-transparent border-none text-white outline-none px-2 pt-2"
                        />
                        <div className="flex justify-end gap-2 items-center px-2 py-1">
                            <div>
                                <span className={messageTooLong ? "text-red-500 font-semibold" : "text-gray-400"}>
                                    {newMessage.length}
                                </span>
                                <span className="text-gray-400">
                                    /{MAX_MESSAGE_LENGTH}
                                </span>
                            </div>
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
                                    className="cursor-pointer text-blue-500 hover:text-blue-600"
                                >
                                    <Paperclip size={30} />
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={disableSend}
                                className={clsx(
                                    disableSend
                                        ? "text-gray-600 cursor-not-allowed"
                                        : "text-orange-500 hover:text-orange-600 cursor-pointer "
                                )}
                            >
                                <Send size={30} />
                            </button>
                        </div>
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
