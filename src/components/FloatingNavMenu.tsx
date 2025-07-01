"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, UserCircle2 } from 'lucide-react';

type Props = {
    isLoggedIn: boolean;
    userSlug?: string | null;
    userImage?: string | null;
    logoutButton?: React.ReactNode;
}

const FloatingNavMenu = ({ isLoggedIn, userSlug, userImage, logoutButton }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) setIsOpen(false);

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isLoggedIn]);

    if (isLoggedIn && userSlug) return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle user menu" className='flex items-center justify-center'>
                {userImage ? (
                    <img
                        src={userImage}
                        alt="Profile Picture"
                        width={40}
                        height={40}
                        className="cursor-pointer rounded-full border-2 border-gray-200 hover:border-orange-400 transition"
                    />
                ) : (
                    <UserCircle2 size={40} />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 text-white rounded-md shadow-lg z-50 font-medium flex flex-col overflow-hidden">
                    <Link
                        href={`/user/${userSlug}`}
                        className="px-4 py-2 hover:bg-orange-500"
                        onClick={() => setIsOpen(false)}
                    >
                        Profile
                    </Link>
                    <Link
                        href="/messages"
                        className="px-4 py-2 hover:bg-orange-500"
                        onClick={() => setIsOpen(false)}
                    >
                        Messages
                    </Link>
                    {logoutButton}
                </div>
            )}
        </div>


    );

    return (
        <>
            <div className="hidden md:flex space-x-6 font-medium">
                <Link href="/login" className="hover:text-orange-400 transition">
                    Login
                </Link>
                <Link href="/signup" className="hover:text-orange-400 transition">
                    Signup
                </Link>
            </div>
            <div className="md:hidden " ref={menuRef}>
                <button
                    className="cursor-pointer flex items-center justify-center"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ?
                        <X size={24} /> :
                        <div className="rounded border border-gray-300 hover:text-orange-400 hover:border-orange-400 p-1">
                            <Menu size={24} />
                        </div>
                    }
                </button>

                {isOpen && (
                    <div
                        className="absolute right-0 mt-2 w-48 bg-zinc-900 text-white rounded-md shadow-lg z-50 font-medium flex flex-col overflow-hidden"
                    >
                        <Link
                            href="/login"
                            className="px-4 py-2 hover:bg-orange-500"
                            onClick={() => setIsOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-2 hover:bg-orange-500"
                            onClick={() => setIsOpen(false)}
                        >
                            Signup
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
};

export default FloatingNavMenu
