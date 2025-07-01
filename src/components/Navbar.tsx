import Link from 'next/link';
import Image from '@/components/Image';
import { MapPinned, List, UserCircle2 } from 'lucide-react';
import FloatingNavMenu from './FloatingNavMenu';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import LogOut from './auth/LogOut';
import { userAgent } from 'next/server';

const Navbar = async () => {
  const session = await auth();

  let user: { slug: string | null; image: string | null } | null = null;
  if (session?.user?.id) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { slug: true, image: true },
    });
  }

  return (
    <nav className="sticky relative top-0 bg-black text-white px-6 py-2 shadow-md z-50">
      <div className="flex justify-between items-center">

        {/* Left: Logo and Menu */}
        <Link href="/" className="flex items-center space-x-3 hover:text-orange-400 transition">
          <Image
            src="/keepsakes_logo_stksga"
            alt="Logo"
            width={50}
            height={50}
            className="cursor-pointer"
          />
          <span className="text-xl font-bold hidden md:inline">Keepsakes</span>
        </Link>

        {/* Center: Listings / Map */}
        <div className="flex-grow flex justify-center items-center space-x-3">
          <Link href="/listings" className="flex items-center space-x-1 hover:text-orange-400 transition">
            <List size={24} />
            <span className="hidden md:inline">Listings</span>
          </Link>
          <span className="text-gray-500">/</span>
          <Link href="/map" className="flex items-center space-x-1 hover:text-orange-400 transition">
            <MapPinned size={24} />
            <span className="hidden md:inline">Map</span>
          </Link>
        </div>

        {/* Mobile Floating Menu */}
        <FloatingNavMenu
          isLoggedIn={!!session}
          userSlug={user?.slug}
          userImage={user?.image ?? session?.user?.image ?? null}
          logoutButton={<LogOut />}
        />
      </div>
    </nav>
  );
};

export default Navbar;
