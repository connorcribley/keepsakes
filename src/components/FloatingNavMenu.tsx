"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

type Props = {
    isLoggedIn: boolean;
}

const FloatingNavMenu = ({ isLoggedIn }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    if (isLoggedIn) return null; // Hide if logged in

    return (
        <div className="">
            <button
                className="md:hidden cursor-pointer"
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
                    className="absolute md:hidden right-6 top-full mt-2 w-40 bg-zinc-900 text-white rounded-md shadow-lg flex flex-col font-medium z-50"
                >
                    <Link
                        href="/login"
                        className="px-4 py-2 hover:bg-orange-500 rounded"
                        onClick={() => setIsOpen(false)}
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="px-4 py-2 hover:bg-orange-500 rounded"
                        onClick={() => setIsOpen(false)}
                    >
                        Signup
                    </Link>
                </div>
            )}
        </div>

    )
};

export default FloatingNavMenu
