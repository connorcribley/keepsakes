"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import WarningModal from "../floating/WarningModal";
import { blockUser, unblockUser } from "@/app/actions/block";
import Link from "next/link";

interface ProfileMenuButtonProps {
    userSlug: string | null;
    userId: string;
    userName: string | null;
    isBlocked: boolean;
}

const ProfileMenuButton = ({
    userSlug,
    userId,
    userName,
    isBlocked,
}: ProfileMenuButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showUnblockModal, setShowUnblockModal] = useState(false);

    const handleBlock = async () => {
        if (!userId) return alert("Could not find user");

        try {
            await blockUser(userId);
            alert("User has been blocked")
            setShowBlockModal(false)
        } catch (err) {
            console.error("Block failed:", err);
            alert("Failed to block user.");
        }
        setIsOpen(false);
    }

    const handleUnblock = async () => {
        if (!userId) return alert("Could not find user");

        try {
            await unblockUser(userId);
            alert("User has been unblocked")
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
                className="cursor-pointer mr-1 text-gray-100 hover:text-orange-400 transition"
                aria-label="More options"
            >
                <MoreHorizontal size={35} />
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className="absolute w-44 top-8 right-0 z-20 border border-zinc-800 bg-zinc-900 text-white text-lg rounded-lg shadow-lg py-3 px-4 flex flex-col space-y-1"
                >
                    <Link
                        href={`/messages/${userSlug}`}
                        title="Send Direct Message"
                        className="hover:text-orange-400 text-left cursor-pointer"
                    >
                        Send Message
                    </Link>
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
                        `Do you really want to unblock ${userName ?? "this user"}?`
                        : `Do you really want to block ${userName ?? "this user"}?`
                }
                closeText="Cancel"
                confirmText={isBlocked ? "Unblock" : "Block"}
            />
        </>
    )
}

export default ProfileMenuButton;