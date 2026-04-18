"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full bg-cyan-500 shadow-lg/50 shadow-cyan-500/50 z-50 px-6 h-20">
        <div className="mx-auto flex h-full items-center justify-center gap-6">
          <div className="grid w-1/2 max-w-xl grid-cols-4 place-items-center gap-4">
            <Link href="/" className="w-full rounded-full border border-white/70 px-3 py-2 text-center text-white transition hover:bg-white/10 hover:text-white hover:scale-110">
              Home
            </Link>
            <Link href="/blog/" className="w-full rounded-full border border-white/70 px-3 py-2 text-center text-white transition hover:bg-white/10 hover:text-white hover:scale-110">
              Blog
            </Link>
            <Link href="/projects/" className="w-full rounded-full border border-white/70 px-3 py-2 text-center text-white transition hover:bg-white/10 hover:text-white hover:scale-110">
              Projects
            </Link>
            <Link href="/profile/" className="w-full rounded-full border border-white/70 px-3 py-2 text-center text-white transition hover:bg-white/10 hover:text-white hover:scale-110">
              Profile
            </Link>
          </div>
        </div>
    </nav>
  );
}
