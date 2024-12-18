import EtherealSpace from '@/components/EtherealSpace';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative w-full">
      <section className="h-screen bg-gradient-to-b from-stone-900 to-stone-800">
        <EtherealSpace />
      </section>

      <section className="relative min-h-screen py-32 bg-gradient-to-b from-stone-100 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_65%)] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-8">
          <h2 className="text-5xl font-serif mb-16 text-stone-800 opacity-90">What is Music?</h2>
          
          <div className="space-y-24 pb-16">
            {/* Basic Definition */}
            <div className="space-y-8">
              <p className="text-lg leading-relaxed text-stone-600">
                Music is the <span className="font-medium text-stone-800">arrangement of sounds in time</span>. It is a universal language, made from 
                <span className="relative inline-block px-1">
                  <span className="absolute inset-0 bg-yellow-100/50 rounded" style={{ transform: 'rotate(-2deg)' }} />
                  <span className="relative">rhythm (time)</span>
                </span>, 
                <span className="relative inline-block px-1">
                  <span className="absolute inset-0 bg-blue-100/50 rounded" style={{ transform: 'rotate(1deg)' }} />
                  <span className="relative">melody (like words or sentences)</span>
                </span>, and 
                <span className="relative inline-block px-1">
                  <span className="absolute inset-0 bg-rose-100/50 rounded" style={{ transform: 'rotate(-1deg)' }} />
                  <span className="relative">harmony (feelings)</span>
                </span>.
              </p>
            </div>

            {/* Home Key Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-serif mb-6 text-stone-700">Why am I learning alphabets again? And what is this Home key?</h3>
              <div className="space-y-4">
                <p className="text-stone-600 font-semibold text-lg">Alphabets</p>
                
                {/* Sound Wave Illustration */}
                <div className="pl-4 border-l-2 border-stone-300 bg-white/50 backdrop-blur-sm p-4 rounded-r-lg">
                  <p className="text-stone-600">
                    There are <span className="italic">infinite sounds</span> in the world. But to make life easier, there are <span className="font-semibold text-stone-700">12 standardized sounds</span>, which are represented by alphabets, 
                    A through G (there are some with # or b, but essentially they are just a weird way of naming these sounds).
                  </p>
                  <br />
                  <p className="text-stone-600">
                    Rest of the sounds are just derivatives of these 12 sounds, or sounds that lie in between them.
                  </p>
                  {/* Notes Display */}
                  <div className="flex items-center justify-center p-6 bg-white/70 rounded-lg backdrop-blur-sm shadow-sm">
                    <div className="grid grid-cols-4 gap-x-8 gap-y-6 font-['Caveat'] text-2xl">
                      {[
                        ['C', 'G', 'D', 'A'],
                        ['E', 'B', 'F#', 'C#'],
                        ['F', 'A#', 'D#', 'G#']
                      ].map((row) => (
                        row.map((note) => (
                          <div key={note} className="flex flex-col items-center">
                            <span className={`${note.includes('#') ? 'text-stone-500 text-xl' : 'text-stone-800'}`}>
                              {note}
                            </span>
                            {!note.includes('#') && (
                              <svg className="w-12 h-6 text-stone-400/50" viewBox="0 0 100 30">
                                <path 
                                  d="M 0 15 Q 25 0, 50 15 Q 75 30, 100 15" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2"
                                />
                              </svg>
                            )}
                          </div>
                        ))
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <svg className="w-24 h-12 text-stone-600" viewBox="0 0 100 40">
                      <path 
                        d="M 0 20 Q 12.5 0, 25 20 Q 37.5 40, 50 20 Q 62.5 0, 75 20 Q 87.5 40, 100 20" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="font-['Caveat'] text-2xl text-stone-700">A = 440 Hz</span>
                </div>

                <p className="text-stone-600 font-semibold text-lg">Home Key/Note</p>
                <p className="pl-4 border-l-2 border-stone-300 text-stone-600 bg-white/50 backdrop-blur-sm p-4 rounded-r-lg shadow-sm">
                  It&apos;s the note that gives you the most <span className="font-medium text-stone-800">comfort</span>, and the most sense of 
                  <span className="relative inline-block px-1">
                    <span className="absolute inset-0 bg-amber-100/50 rounded" style={{ transform: 'rotate(-1deg)' }} />
                    <span className="relative">home</span>
                  </span>.
                </p>
                <p>
                  So when you select a particular home key, you are essentially saying that I want this sound to be the most stable note in this music. Many other sounds will be played as well, but whenever this home note is played, your brain will feel the most at ease.
                </p>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent my-12" />

            {/* Scales Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-serif mb-4 text-stone-700">Alright. But where did major, minor come from?</h3>
              <div className="space-y-4">
                <p className="text-stone-600">
                  Music is the arrangement of sounds in time. So, the arrangement part comes from the 
                  <span className="relative inline-block px-1">
                    <span className="absolute inset-0 bg-purple-100/50 rounded" style={{ transform: 'rotate(-1deg)' }} />
                    <span className="relative">scale</span>
                  </span>
                  (major, minor, pentatonic, etc). Different arrangements of sounds evoke different  
                  <span className="font-medium text-stone-800"> emotions</span>.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div className="bg-white/80 p-6 rounded-lg backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200">
                    <h4 className="text-lg font-medium text-stone-700 mb-2">Major Scale</h4>
                    <p className="text-stone-600">Usually bright and happy sounding.</p>
                  </div>
                  <div className="bg-white/80 p-6 rounded-lg backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200">
                    <h4 className="text-lg font-medium text-stone-700 mb-2">Minor Scale</h4>
                    <p className="text-stone-600">More melancholic or mysterious sounding. Think of dramatic movie themes.</p>
                  </div>
                  <div className="bg-white/80 p-6 rounded-lg backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200">
                    <h4 className="text-lg font-medium text-stone-700 mb-2">Lydian Scale</h4>
                    <p className="text-stone-600">Dreamy and floating feeling. Often used in fantasy or sci-fi music.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent my-12" />

            {/* Notes Selection Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-serif mb-4 text-stone-700">Choosing Notes</h3>
              <div className="space-y-4">
                <p className="pl-4 border-l-2 border-stone-300 text-stone-600 bg-white/50 backdrop-blur-sm p-4 rounded-r-lg shadow-sm">
                  If you choose &quot;All&quot;, some notes which don&apos;t belong to the scale/arrangement you have chosen, 
                  will still be played, though less frequently. These might sound weird, dissonant, or even 
                  unpleasant. But they add some spice, and make your music more interesting.
                </p>
                <p className="text-stone-600">
                  After all, life isn&apos;t always upbeat and happy. There are some weird, haunting, or even 
                  unpleasant moments too. And adding these weird notes creates the same effect.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating orbs decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-stone-100/40 to-transparent rounded-full animate-float-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-radial from-stone-100/30 to-transparent rounded-full animate-float-slower" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-radial from-stone-100/20 to-transparent rounded-full animate-float" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
