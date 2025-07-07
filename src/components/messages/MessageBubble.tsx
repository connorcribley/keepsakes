"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { MoreHorizontal } from "lucide-react";
import WarningModal from "../floating/WarningModal";
import ErrorModal from "../floating/ErrorModal";
import { FileText } from "lucide-react";
import ClickableImage from "../ClickableImage";


interface MessageBubbleProps {
    id: string;
    content: string;
    isSender: boolean;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt?: Date;
    attachmentUrls?: string[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

const MessageBubble = ({
    id,
    content,
    isSender,
    isBlocked,
    createdAt,
    updatedAt,
    attachmentUrls = [],
    onEdit,
    onDelete,
    activeId,
    setActiveId,
}: MessageBubbleProps) => {
    const isActive = activeId === id;
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBlockedEditModal, setShowBlockedEditModal] = useState(false);
    

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setActiveId(null);
            }
        };

        if (isActive) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isActive, setActiveId]);


    return (
        <>
            {attachmentUrls && attachmentUrls.length > 0 && attachmentUrls.map((url, index) => {
                const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                // const isPDF = url.endsWith(".pdf");
                // const fileName = decodeURIComponent(url.split("/").pop() || "file");

                return (
                    <div
                        key={`${id}-attachment-${index}`}
                        className={clsx("flex mb-1", isSender ? "justify-end" : "justify-start")}
                    >
                        {isImage && (
                            <ClickableImage
                                src={url}
                                alt={`attachment-${index}`}
                                className="max-w-xs rounded-lg shadow"
                            />
                        )}
                    </div>
                );
            })}

            <div
                ref={containerRef}
                className={clsx("relative flex", isSender ? "justify-end" : "justify-start")}
            >
                <div
                    className={clsx(
                        "flex flex-col rounded-xl px-4 py-2 max-w-[75%] md:max-w-[50%] xl:max-w-[35%] text-sm shadow break-words whitespace-pre-wrap overflow-x-hidden",
                        isSender ? "bg-orange-500 text-white" : "bg-zinc-800 text-gray-200"
                    )}
                >
                    {/* Timestamp and Ellipses */}
                    {isSender && (
                        <div className="flex justify-between space-x-2 my-1 mr-1">
                            <span className="text-[13px] block text-right opacity-60">
                                {new Date(createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                            <button
                                aria-label="More options"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveId(isActive ? null : id);
                                }}
                                className="text-white hover:text-gray-300 focus:outline-none cursor-pointer"
                            >
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    )}
                    {/* Floating menu */}
                    {isSender && isActive && (
                        <div
                            ref={menuRef}
                            className="absolute bottom-8 right-11 z-20 bg-zinc-900 text-white text-lg rounded-lg shadow-lg py-3 px-4 flex flex-col space-y-1"
                        >
                            <button
                                onClick={() => isBlocked ? setShowBlockedEditModal(true) : onEdit(id)}
                                className="hover:text-orange-400 text-left cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(true)
                                }}
                                className="hover:text-red-500 text-left cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    )}

                    {/* Attachment Count Label */}
                    {attachmentUrls.length > 0 && (
                        <span className="text-xs font-semibold text-gray-300 mb-1">
                            [{attachmentUrls.length} Attachment{attachmentUrls.length > 1 ? "s" : ""}]
                        </span>
                    )}

                    {/* Message Content */}
                    {content && (
                        <p className="my-1">{content}</p>
                    )}

                    
                    {updatedAt && createdAt.getTime() !== updatedAt.getTime() && (
                        <span className="text-[13px] block text-left opacity-60">
                            edited {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {updatedAt.toLocaleDateString([], { month: "2-digit", day: "2-digit", year: "2-digit" })}
                        </span>
                    )}


                    <ErrorModal 
                        isOpen={showBlockedEditModal}
                        onClose={() => setShowBlockedEditModal(false)}
                        title="Blocked User"
                        content="You cannot edit messages in a conversation with a blocked user."
                        closeText="Close"
                    />
                    <WarningModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={async () => {
                            await onDelete(id);          // ← Call parent delete handler
                            setShowDeleteModal(false); // Close modal
                            setActiveId(null);         // Close menu
                        }}
                        title="Delete Message"
                        content="Do you really want to delete this message?"
                        closeText="Cancel"
                        confirmText="Delete"
                    />
                </div>
            </div>
        </>
    )
};

export default MessageBubble
