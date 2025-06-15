'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PianoKeyboard from '@/components/PianoKeyboard';

export default function SoundscapesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto mt-16 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif text-stone-800 mb-6">Soundscapes</h1>
          <p className="text-stone-600 mb-10">
            Create musical patterns with this interactive keyboard. The layout always follows a consistent 
            pattern based on scale degrees, regardless of which root note you select.
          </p>
          
          {/* Piano keyboard */}
          <div className="mb-10 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
            <PianoKeyboard className="mb-4" />
            
            <div className="text-sm text-stone-500 mt-4">
              <p>Use your keyboard to play notes: A-L for white keys, W-E-T-Y-U for black keys.</p>
              <p>Click the &quot;Show Keyboard Map&quot; button to see all key mappings.</p>
            </div>
          </div>
          
          <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
            <h2 className="text-xl font-serif text-stone-800 mb-4">Scale Degree Keyboard</h2>
            <ul className="list-disc pl-5 text-stone-600 space-y-2">
              <li>This keyboard is designed to visualize scale degrees rather than fixed notes.</li>
              <li>Changing the root note transposes all keys but keeps the same relative pattern.</li>
              <li>White keys represent major/perfect intervals (major 2nd, major 3rd, perfect 5th, etc.)</li>
              <li>Black keys represent minor/diminished intervals (minor 2nd, minor 3rd, tritone, etc.)</li>
              <li>The A key always plays the root note of whatever scale you&apos;ve selected.</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 