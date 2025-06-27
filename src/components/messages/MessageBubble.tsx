"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { MoreHorizontal } from "lucide-react";
import MessageDeleteModal from "./MessageDeleteModal";


interface MessageBubbleProps {
    id: string;
    content: string;
    isSender: boolean;
    createdAt: Date;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

const MessageBubble = ({
    id,
    content,
    isSender,
    createdAt,
    onEdit,
    onDelete,
    activeId,
    setActiveId,
}: MessageBubbleProps) => {
    const isActive = activeId === id;
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // ← Modal state

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
        <div
            ref={containerRef}
            className={clsx("relative flex", isSender ? "justify-end" : "justify-start")}
        >
            <div
                className={clsx(
                    "flex flex-col rounded-xl px-4 py-2 max-w-[75%] text-sm shadow",
                    isSender ? "bg-orange-500 text-white" : "bg-zinc-800 text-gray-200"
                )}
            >
                {/* Ellipses */}
                {isSender && (
                    <div className="flex justify-end my-1 mr-1">
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
                        className="absolute top-8 right-2 z-20 bg-zinc-900 text-white text-lg rounded-lg shadow-lg py-3 px-4 flex flex-col space-y-1"
                    >
                        <button
                            onClick={() => onEdit(id)}
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

                {/* Content and Date */}
                <p>{content}</p>
                <span className="text-[10px] block text-right opacity-60 mt-1">
                    {new Date(createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>

                <MessageDeleteModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={async () => {
                        await onDelete(id);          // ← Call parent delete handler
                        setShowDeleteModal(false); // Close modal
                        setActiveId(null);         // Close menu
                    }}
                />
            </div>
        </div>
    )
};

export default MessageBubble
