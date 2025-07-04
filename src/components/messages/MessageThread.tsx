"use client";

import { useState, useRef, useEffect } from "react";
import { DirectMessage } from "@prisma/client";
import { sendMessage, deleteMessage, updateMessage } from "@/app/actions/messages";
import { Send, Paperclip, X, FileText, SquarePen } from "lucide-react";
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
const VALID_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];


const MessageThread = ({ messages, userId, recipientId, conversationId }: MessageThreadProps) => {
    const [newMessage, setNewMessage] = useState("");
    const [messageList, setMessageList] = useState(messages);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [showCancelEditModal, setShowCancelEditModal] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);


    const [attachments, setAttachments] = useState<File[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<string[]>([]); // ← NEW

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [editId, newMessage]);


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
            content: trimmed || "",
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
                prev.map((msg) => (msg.id === editId ? updatedMsg : msg))

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
        setNewMessage(msg.content ?? "");
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
    const invalidFiles = attachments.filter(file => !VALID_FILE_TYPES.includes(file.type));
    const hasInvalidType = invalidFiles.length > 0;
    const disableSend = messageTooLong || tooManyAttachments || hasOversized || hasInvalidType;

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
                                content={msg.content ?? ""}
                                isSender={msg.senderId === userId}
                                createdAt={msg.createdAt}
                                updatedAt={msg.updatedAt} // ← Add this line
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
                {/* Editing Banner */}
                {editId && (() => {
                    const editedMsg = messageList.find((msg) => msg.id === editId);
                    if (!editedMsg) return null;

                    const dateStr = editedMsg.createdAt.toLocaleDateString(undefined, {
                        year: "numeric", month: "long", day: "numeric"
                    });
                    const timeStr = editedMsg.createdAt.toLocaleTimeString([], {
                        hour: "2-digit", minute: "2-digit"
                    });

                    return (
                        <div className="flex justify-between items-center text-xs md:text-sm text-orange-300 bg-orange-900 bg-opacity-20 border border-orange-500 rounded-md px-4 py-2 mb-1">
                            <span>Editing message from {timeStr} on {dateStr}</span>
                            <button
                                type="button"
                                onClick={() => setShowCancelEditModal(true)}
                                className="cursor-pointer ml-2 text-orange-400 hover:text-orange-500"
                                aria-label="Cancel edit"
                            >
                                Cancel
                            </button>
                        </div>
                    );
                })()}

                {(existingAttachments.length > 0 || attachments.length > 0) && (
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold text-gray-300 mb-1">
                            Attachments (<span className={tooManyAttachments ? "text-red-500" : ""}>
                                {totalAttachments}
                            </span> of {MAX_ATTACHMENTS}):
                            {(hasOversized || hasInvalidType) && (
                                <span className="ml-2 text-red-500 font-semibold">
                                    [File exceeds 5MB/Wrong file type]
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
                                const isInvalidType = !VALID_FILE_TYPES.includes(file.type)

                                return (
                                    <div
                                        key={index}
                                        className={clsx(
                                            "relative w-16 h-16 flex-shrink-0 border rounded bg-zinc-700 p-1",
                                            (isOversized || isOverflow || isInvalidType) ? "border-red-500" : "border-white"
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
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                )}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        editId ? handleEdit() : handleSend();
                    }}
                >
                    <div className="flex flex-col w-full bg-zinc-800 rounded-4xl overflow-hidden">
                        <textarea
                            ref={textareaRef}
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value)
                                if (textareaRef.current) {
                                    textareaRef.current.style.height = "auto";
                                    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                                }
                            }}
                            placeholder={editId ? "Edit your message..." : "Type your message..."}
                            rows={1}
                            className="w-full h-full resize-none bg-transparent border-none text-white outline-none px-4 pt-4 pb-2 max-h-40 overflow-y-auto scrollbar-hide"
                        />
                        <div className="flex justify-between mx-2 mb-1">
                            <div className="flex justify-start gap-2 items-center ml-2">
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
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
                            </div>
                            <div className="flex justify-end gap-2 items-center mr-2">

                                <div>
                                    <span className={messageTooLong ? "text-red-500 font-semibold" : "text-gray-400"}>
                                        {newMessage.length}
                                    </span>
                                    <span className="text-gray-400">
                                        /{MAX_MESSAGE_LENGTH}
                                    </span>
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
                                    {editId ? <SquarePen size={30} /> : <Send size={30} />}
                                </button>
                            </div>
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
