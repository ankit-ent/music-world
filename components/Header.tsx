import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 px-6 py-4 flex justify-between items-center z-50 border-b border-white/80">
      <Link href="/" className="font-serif text-xl text-stone-700 hover:text-stone-900">
        Music Space
      </Link>
      <nav className="flex gap-6 text-sm text-stone-500">
        <a href="#" className="hover:text-stone-800">About</a>
        <Link href="/guide" className="hover:text-stone-800">Guide</Link>
      </nav>
    </header>
  );
} 