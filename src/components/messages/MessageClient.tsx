"use client";

import { useState, useRef, useEffect } from "react";
import { DirectMessage } from "@prisma/client";
import { sendMessage, deleteMessage, updateMessage } from "@/app/actions/messages";
import { Send, ImagePlus, X, SquarePen } from "lucide-react";
import { ArrowLeft,} from "lucide-react";
import MessageMenuButton from "@/components/messages/MessageMenuButton";
import WarningModal from "../floating/WarningModal";
import MessageBubble from "./MessageBubble";
import Link from "next/link";
import clsx from "clsx";

interface MessageClientProps {
    messages: DirectMessage[];
    userId: string;
    conversationId: string | null;
    recipientId: string;
    recipientName: string | null;
    recipientImage: string | null;
    recipientSlug: string | null;
    isBlocked: boolean;
}

const MAX_MESSAGE_LENGTH = 1000;
const MAX_ATTACHMENTS = 5;
const MAX_FILE_SIZE_MB = 5;
const VALID_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];


const MessageClient = ({
    messages,
    userId,
    conversationId,
    recipientId,
    recipientName,
    recipientImage,
    recipientSlug,
    isBlocked
}: MessageClientProps) => {
    const [newMessage, setNewMessage] = useState("");
    const [messageList, setMessageList] = useState(messages);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [showCancelEditModal, setShowCancelEditModal] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [blocked, setBlocked] = useState(isBlocked);


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
            setEditId(null);
            setExistingAttachments([]);
            setActiveId(null);
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
        <>
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
                        href={`/user/${recipientSlug}`}
                        className="inline-flex items-center gap-3 group"
                        aria-label={`View ${recipientName}'s profile`}
                    >
                        <img
                            src={recipientImage || "/default-avatar.png"} // fallback if no image
                            alt={recipientName || "User Avatar"}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white group-hover:border-orange-500"
                        />
                        <h1 className="text-lg font-semibold group-hover:underline group-hover:text-orange-400 text-white">
                            {recipientName}
                        </h1>
                    </Link>
                    <MessageMenuButton
                        conversationId={conversationId ?? null}
                        recipientId={recipientId}
                        recipientName={recipientName}
                        isBlocked={blocked}
                        onBlockChange={setBlocked}
                    />
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className="flex flex-col h-full">
                        {/* Scrollable Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 ">
                            {messageList.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <div className="text-center">
                                        <p className="text-lg font-medium">No messages yet</p>
                                        <p className="text-sm mt-1">Start a conversation by sending a message</p>
                                    </div>
                                </div>
                            )}
                            
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
                                            isBlocked={blocked}
                                            createdAt={msg.createdAt}
                                            updatedAt={msg.updatedAt}
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
                            {blocked ? (
                                <h2 className="text-center text-gray-400 text-lg my-1">
                                    You are not allowed to send messages to this user.
                                </h2>
                            ) : (
                                <div className="max-w-2xl my-auto mx-auto flex flex-col gap-2">
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

                                            </h2>
                                            <div className="flex justify-start space-x-1 mb-1 text-red-500 font-semibold text-sm">
                                                {hasOversized && (
                                                    <span>
                                                        [File exceeds 5MB limit]
                                                    </span>
                                                )}
                                                {hasInvalidType && (
                                                    <span>
                                                        [File must be an image (jpg, png, webp, gif)]
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex overflow-x-auto gap-2 mb-2 px-1">
                                                {/* Existing attachments (Edit)*/}
                                                {existingAttachments.map((url, index) => (
                                                    <div key={`existing-${index}`} className="relative w-16 h-16 flex-shrink-0 border rounded bg-zinc-700 p-1">
                                                        {url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                                                            <img src={url} alt="existing" className="object-cover w-full h-full rounded" />
                                                        ) : null}
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
                                                            ) : null}
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
                                        <div
                                            className="cursor-text flex flex-col w-full bg-zinc-800 rounded-4xl overflow-hidden"
                                            onClick={(e) => {
                                                // Only focus the textarea if the user didn't click on a button or input
                                                if (!(e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement)) {
                                                    textareaRef.current?.focus();
                                                }
                                            }}
                                        >
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
                                                            accept="image/*"
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
                                                            <ImagePlus size={30} />
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
                            )}
                        </div>
                    </div>
                </div>
            </div >
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
        </>
    );
};

export default MessageClient;
