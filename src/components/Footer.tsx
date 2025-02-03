'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-semibold"> Task Manager</h2>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <nav className="mb-4 md:mb-0 flex flex-wrap justify-center gap-4 md:gap-6">
          <Link href="/about" className="text-gray-300 hover:text-white transition">About</Link>
          <Link href="/services" className="text-gray-300 hover:text-white transition">Services</Link>
          <Link href="/contact" className="text-gray-300 hover:text-white transition">Contact</Link>
          <Link href="/privacy" className="text-gray-300 hover:text-white transition">Privacy</Link>
        </nav>

        <div className="flex gap-4">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Facebook size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Twitter size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Instagram size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Linkedin size={20} />
          </Button>
        </div>
      </div>
    </footer>
  );
}
