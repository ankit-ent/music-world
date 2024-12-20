'use client'

import ExplanationBox from '@/components/ExplanationBox';
import Footer from '@/components/Footer';

export default function GuidePage() {
  return (
    <main className="relative min-h-screen py-32 bg-gradient-to-b from-stone-100 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_65%)] pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-8">
        <h2 className="text-5xl font-serif mb-16 text-stone-800 opacity-90">Visualization Guide</h2>
        
        <div className="space-y-24 pb-16">
          {/* Musical Space Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif mb-4 text-stone-700">The Musical Space</h3>
            <ExplanationBox>
              <h4 className="text-lg font-medium text-stone-700 mb-2">Notes Position</h4>
              <div className="flex justify-center mb-4">
                <div className="relative w-64 h-64">
                  {/* Clock-like circle */}
                  <div className="absolute inset-0 border-2 border-stone-200 rounded-full" />
                  
                  {/* Notes */}
                  {[
                    'C', 'C#', 'D', 'D#', 'E', 'F',
                    'F#', 'G', 'G#', 'A', 'A#', 'B'
                  ].map((note, i) => {
                    const angle = (i * 360 / 12) - 90; // Start at 12 o'clock
                    const radius = 95;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    
                    return (
                      <div
                        key={note}
                        className={`absolute font-['Caveat'] ${
                          note.includes('#') 
                            ? 'text-lg text-stone-500' 
                            : 'text-2xl text-stone-600'
                        }`}
                        style={{
                          transform: `translate(-50%, -50%)`,
                          left: `${x + 128}px`, // Half of container width (64px)
                          top: `${y + 128}px`,  // Half of container height (64px)
                        }}
                      >
                        {note}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-stone-600">
                Notes are arranged in a circle, like a clock. After G# comes A again - just like how a clock goes from 12 back to 1. 
                The difference is that the new A vibrates exactly twice as fast as the previous A (880 Hz vs 440 Hz). 
                This is called an octave.
              </p>
            </ExplanationBox>

            <ExplanationBox>
              <h4 className="text-lg font-medium text-stone-700 mb-2">Distance from Center</h4>
              <p className="text-stone-600">
                Think of the visualization as a spiral going outward. Each ring represents a different octave:<br />
                • Inner rings play lower notes (slower vibrations)<br />
                • Middle rings play middle-range notes<br />
                • Outer rings play higher notes (faster vibrations)<br /><br />
                For example, an A note might appear in multiple rings - the same note, just at different heights (octaves).
              </p>
            </ExplanationBox>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-stone-300 my-12" />

          {/* Playing Modes Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif mb-4 text-stone-700">Playing Modes</h3>
            <ExplanationBox>
              <h4 className="text-lg font-medium text-stone-700 mb-2">Diatonic Mode (Simple)</h4>
              <p className="text-stone-600">Only plays notes that sound good together in the chosen key.</p>
            </ExplanationBox>

            <ExplanationBox>
              <h4 className="text-lg font-medium text-stone-700 mb-2">All Notes (Advanced)</h4>
              <p className="text-stone-600">Adds more colour to the music. Plays all possible notes, including ones that might create tension or dissonance.</p>
            </ExplanationBox>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-stone-300 my-12" />

          {/* Musical Scales Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif mb-4 text-stone-700">Musical Scales</h3>
            <ExplanationBox>
              <h4 className="text-lg font-medium text-stone-700 mb-2">Major Scale</h4>
              <p className="text-stone-600">Bright and happy sounding.</p>
            </ExplanationBox>

            <ExplanationBox>
              <h4 className="text-lg font-medium text-stone-700 mb-2">Minor Scale</h4>
              <p className="text-stone-600">More melancholic or mysterious sounding. Think of dramatic movie themes.</p>
            </ExplanationBox>

            <ExplanationBox>
              <h4 className="text-lg font-medium text-stone-700 mb-2">Lydian Scale</h4>
              <p className="text-stone-600">Dreamy and floating feeling. Often used in fantasy or sci-fi music.</p>
            </ExplanationBox>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-stone-300 my-12" />

          {/* Chords Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif mb-4 text-stone-700">Chords</h3>
            <ExplanationBox>
              <p className="text-stone-600">
                Sometimes you&apos;ll hear multiple notes played together (chords). These create richer harmonies
                and help establish the musical mood. Each scale has its own set of chords that sound
                particularly good together.
              </p>
            </ExplanationBox>
          </div>

          {/* Adding Colors Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif mb-4 text-stone-700">Adding Colors</h3>
            <ExplanationBox>
              <h4 className="text-lg font-medium text-stone-700 mb-2">Simple Mode (No)</h4>
              <p className="text-stone-600">
                Only plays notes that belong to your chosen scale. These notes always sound pleasant together, 
                creating harmonious and predictable music. All bubbles will be white.
              </p>
            </ExplanationBox>

            <ExplanationBox>
              <h4 className="text-lg font-medium text-stone-700 mb-2">Colorful Mode (Yes)</h4>
              <p className="text-stone-600">
                Adds notes that don&apos;t belong to your scale, shown as colored bubbles. These notes can create 
                tension, surprise, or add spice to the music. Like adding a dash of chili to a sweet dish - 
                it might be unexpected, but it makes things interesting!
              </p>
            </ExplanationBox>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-serif mb-4 text-stone-700">Tempo</h3>
            <ExplanationBox>
              <h4 className="text-lg font-medium text-stone-700 mb-2">Speed of Music</h4>
              <p className="text-stone-600">
                Tempo controls how fast the notes play:<br />
                • 1.0 = Normal speed<br />
                • Below 1.0 = Slower, more relaxed feel<br />
                • Above 1.0 = Faster, more energetic feel<br /><br />
                Try different speeds to change the character of the music - slower for a dreamy feel, 
                faster for an exciting mood!
              </p>
            </ExplanationBox>
          </div>
        </div>
      </div>

      {/* Floating orbs decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-stone-100/40 to-transparent rounded-full animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-radial from-stone-100/30 to-transparent rounded-full animate-float-slower" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-radial from-stone-100/20 to-transparent rounded-full animate-float" />
      </div>

      <Footer />
    </main>
  );
} 