export default function GuidePage() {
  return (
    <main className="bg-gradient-to-b from-stone-100 to-white overflow-auto">
      <div className="px-8 max-w-4xl mx-auto text-stone-800 py-16">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-stone-900">The Musical Space</h2>
          <ul className="list-disc list-inside space-y-4">
            <li>
              <strong className="text-stone-900">Notes Position:</strong> Notes are arranged in a circle, like a clock:
              <ul className="list-none ml-6 mt-2">
                <li>C at 12 o'clock</li>
                <li>F at 3 o'clock</li>
                <li>A at 9 o'clock</li>
              </ul>
            </li>
            <li>
              <strong className="text-stone-900">Distance from Center:</strong> Shows how high or low the note is:
              <ul className="list-none ml-6 mt-2">
                <li>Closer to center = lower notes</li>
                <li>Further from center = higher notes</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Playing Modes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Diatonic Mode (Simple)</h3>
              <p className="text-stone-500">Only plays notes that sound good together in the chosen key.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">All Notes (Advanced)</h3>
              <p className="text-stone-500">Adds more colour to the music.Plays all possible notes, including ones that might create tension or dissonance.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Musical Scales</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Major Scale</h3>
              <p className="text-stone-500">Bright and happy sounding.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Minor Scale</h3>
              <p className="text-stone-500">More melancholic or mysterious sounding. Think of dramatic movie themes.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Lydian Scale</h3>
              <p className="text-stone-500">Dreamy and floating feeling. Often used in fantasy or sci-fi music.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Chords</h2>
          <p className="mb-4 text-stone-500">
            Sometimes you'll hear multiple notes played together (chords). These create richer harmonies
            and help establish the musical mood. Each scale has its own set of chords that sound
            particularly good together.
          </p>
        </section>
      </div>
    </main>
  );
} 