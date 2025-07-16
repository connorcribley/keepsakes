"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import WarningModal from "../floating/WarningModal";
import { blockUser, unblockUser } from "@/app/actions/block";
import Link from "next/link";

import { useProfileBlock } from "@/context/ProfileBlockContext";

interface ProfileMenuButtonProps {
    userSlug: string | null;
    userId: string;
    userName: string | null;
}

const ProfileMenuButton = ({
    userSlug,
    userId,
    userName,
}: ProfileMenuButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showUnblockModal, setShowUnblockModal] = useState(false);

    const { hasBlocked, setHasBlocked } = useProfileBlock();

    const didBlock = hasBlocked;

    const handleBlock = async () => {
        if (!userId) return alert("Could not find user");
        try {
            await blockUser(userId);
            setHasBlocked(true); // you blocked them
            setShowBlockModal(false);
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
            setHasBlocked(false);
            setShowUnblockModal(false);
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
                    {didBlock ? (
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
                isOpen={hasBlocked ? showUnblockModal : showBlockModal}
                onClose={() => { hasBlocked ? setShowUnblockModal(false) : setShowBlockModal(false) }}
                onConfirm={async () => { hasBlocked ? handleUnblock() : handleBlock() }}
                title={hasBlocked ? "Unblock User" : "Block User"}
                content={
                    hasBlocked ?
                        `Do you really want to unblock ${userName ?? "this user"}?`
                        : `Do you really want to block ${userName ?? "this user"}?`
                }
                closeText="Cancel"
                confirmText={hasBlocked ? "Unblock" : "Block"}
            />
        </>
    )
}

export default ProfileMenuButton;