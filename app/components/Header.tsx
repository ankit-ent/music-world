export default function Header() {
  return (
    <header className="fixed top-0 w-full px-6 py-4 flex justify-between items-center bg-white/30 backdrop-blur-sm border-b border-white/20 z-50">
      <div className="font-serif text-xl text-stone-700">Ethereal Space</div>
      <nav className="flex gap-6 text-sm text-stone-500">
        <a href="#" className="hover:text-stone-800">About</a>
        <a href="#" className="hover:text-stone-800">Guide</a>
      </nav>
    </header>
  );
} 