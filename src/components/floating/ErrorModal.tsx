"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string | null;
    content: string | null;
    closeText: string | null;
}

const ErrorModal = ({
    isOpen,
    onClose,
    title,
    content,
    closeText,
}: ErrorModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        }

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div
                ref={modalRef}
                className="bg-zinc-900 text-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
            >
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="mb-6">{content}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                    >
                        {closeText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ErrorModal;