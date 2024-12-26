import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-6 px-8 text-center bg-white/50 backdrop-blur-sm border-t border-stone-200">
      <span className="text-xs text-stone-500">
        Made with ♪ by{' '}
        <Link 
          href="/profile" 
          className="underline hover:text-stone-800 transition-colors"
        >
          Ankit Sharma
        </Link>
      </span>
    </footer>
  );
}