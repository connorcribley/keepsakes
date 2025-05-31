'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, MapPinned, List } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky relative top-0 bg-black text-white px-6 py-2 shadow-md z-50">
      <div className="flex justify-between items-center">

        {/* Left: Logo and Menu */}
        <Link href="/" className="flex items-center space-x-3 hover:text-orange-400">
          <Image
            src="/keepsakes_logo.svg"
            alt="Logo"
            width={50}
            height={50}
            className="cursor-pointer"
          />
          <span className="text-xl font-bold hidden md:inline">Keepsakes</span>
        </Link>

        {/* Center: Listings / Map */}
        <div className="flex-grow flex justify-center items-center space-x-3">
          <Link href="/index" className="flex items-center space-x-1 hover:text-orange-400 transition">
            <List size={24} />
            <span className="hidden md:inline">Listings</span>
          </Link>
          <span className="text-gray-500">/</span>
          <Link href="/map" className="flex items-center space-x-1 hover:text-orange-400 transition">
            <MapPinned size={24} />
            <span className="hidden md:inline">Map</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 font-medium">
          <Link href="/login" className="hover:text-orange-400 transition">
            Login
          </Link>
          <Link href="/signup" className="hover:text-orange-400 transition">
            Signup
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
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
      </div>

      {/* Mobile Floating Menu */}
      {isOpen && (
        <div
          className="absolute md:hidden right-6 top-full mt-2 w-40 bg-zinc-900 text-white rounded-md shadow-lg flex flex-col font-medium z-50"
        >
          <Link
            href="/index"
            className="px-4 py-2 hover:bg-orange-500 rounded"
            onClick={() => setIsOpen(false)}
          >
            Menu
          </Link>
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
    </nav>
  );
};

export default Navbar;
