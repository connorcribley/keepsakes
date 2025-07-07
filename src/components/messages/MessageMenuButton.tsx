"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { deleteConversation } from "@/app/actions/messages";
import { useRouter } from "next/navigation";
import WarningModal from "../floating/WarningModal";
import { blockUser, unblockUser } from "@/app/actions/block";

interface MessageMenuButtonProps {
    conversationId: string | null;
    recipientId: string;
    recipientName: string | null;
    isBlocked: boolean;
    onBlockChange: (blocked: boolean) => void;
}

const MessageMenuButton = ({ 
    conversationId, 
    recipientId, 
    recipientName, 
    isBlocked,
    onBlockChange 
}: MessageMenuButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showUnblockModal, setShowUnblockModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();

    const handleBlock = async () => {
        if (!recipientId) return alert("Could not find user");

        try {
            await blockUser(recipientId);
            onBlockChange(true);
            setShowBlockModal(false)
        } catch (err) {
            console.error("Block failed:", err);
            alert("Failed to block user.");
        }
        setIsOpen(false);
    }

    const handleUnblock = async () => {
        if (!recipientId) return alert("Could not find user");

        try {
            await unblockUser(recipientId);
            onBlockChange(false);
            setShowUnblockModal(false)
        } catch (err) {
            console.error("Unblock failed:", err);
            alert("Failed to unblock user.");
        }
        setIsOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                !buttonRef.current?.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen((prev) => !prev)}
                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-400 transition-colors"
                aria-label="More options"
            >
                <MoreHorizontal size={35} />
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className="absolute top-12 right-2 z-20 bg-zinc-900 text-white text-lg rounded-lg shadow-lg py-3 px-4 flex flex-col space-y-1"
                >
                    {isBlocked ? (
                        <button
                            onClick={() => {
                                setShowUnblockModal(true)
                            }}
                            className="hover:text-orange-400 text-left cursor-pointer"
                        >
                            Unblock User
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setShowBlockModal(true)
                            }}
                            className="hover:text-orange-400 text-left cursor-pointer"
                        >
                            Block User
                        </button>
                    )}
                    <button
                        onClick={async () => {
                            setShowDeleteModal(true)
                        }}
                        className="hover:text-red-500 text-left cursor-pointer"
                    >
                        Delete Conversation
                    </button>
                </div>
            )}

            
            {/* Block/Unblock User */}
            <WarningModal
                isOpen={isBlocked ? showUnblockModal : showBlockModal}
                onClose={() => { isBlocked ? setShowUnblockModal(false) : setShowBlockModal(false) }}
                onConfirm={async () => { isBlocked ? handleUnblock() : handleBlock() }}
                title={isBlocked ? "Unblock User" : "Block User"}
                content={
                    isBlocked ?
                        `Do you really want to unblock ${recipientName ?? "this user"}?`
                        : `Do you really want to block ${recipientName ?? "this user"}?`
                }
                closeText="Cancel"
                confirmText={isBlocked ? "Unblock" : "Block"}
            />
            {/* Delete Conversation */}
            <WarningModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={async () => {
                    if (!conversationId) return alert("No conversation to delete");

                    try {
                        await deleteConversation(conversationId);
                        router.push("/messages");
                    } catch (err) {
                        console.error("Error deleting conversation:", err);
                        alert("Failed to delete conversation.");
                    }
                    setIsOpen(false);
                }}
                title="Delete Conversation"
                content="Do you really want to delete this entire conversation?"
                closeText="Cancel"
                confirmText="Delete Conversation"
            />
        </>
    )
}

export default MessageMenuButton;