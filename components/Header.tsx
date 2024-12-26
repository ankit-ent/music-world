'use client'

import Link from 'next/link';
import { useState } from 'react';

const WaveLogo = () => (
  <div className="flex items-center gap-2">
    <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M2 12C5 12 3 8 6 8S9 16 12 16S15 8 18 8S21 16 24 16" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
    <span className="font-serif text-xl">Wavy Lines</span>
  </div>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 px-6 py-4 flex justify-between items-center z-50 border-b border-white/80">
      <Link href="/" className="text-stone-700 hover:text-stone-900">
        <WaveLogo />
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex gap-6 text-sm text-stone-500">
        <Link href="/#what-is-music" className="hover:text-stone-800">Guide</Link>
      </nav>

      {/* Mobile menu button */}
      <button 
        className="md:hidden text-stone-500"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg border-b border-stone-200 md:hidden">
          <div className="flex flex-col py-6 px-8 gap-6 text-base text-stone-600">
            <Link 
              href="/#what-is-music" 
              className="hover:text-stone-900 transition-colors" 
              onClick={() => setIsMenuOpen(false)}
            >
              Guide
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
