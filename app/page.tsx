'use client'

import EtherealSpace from '@/components/EtherealSpace';
import Footer from '@/components/Footer';
import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

const CollapsibleInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mt-6">
      <div className="bg-stone-600/90 backdrop-blur-sm rounded-lg shadow-lg">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left p-4 flex items-center justify-between"
        >
          <p className="text-stone-100 font-medium pr-4">
            Wait. Does that mean different songs have different home notes? And how does our brain even know what the home note is for that particular song?
          </p>
          <svg 
            className={`w-5 h-5 text-stone-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
          <div className="p-4 pt-0 text-stone-300">
            Okay, this is where it gets a bit crazy. Our brain only needs to hear a few notes, or a couple of seconds (sometimes even milliseconds) of a song and it just <em>immediately</em> knows what the home note is.
            It just automatically establishes what the most stable sound in that music would be. All in a split of a second.
            Our brain is simply <strong>too good</strong> at pattern recognition. You don&apos;t even have to know music theory or know anything about music in general, our brain does it subconciously.
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="relative w-full">
      <section className="h-screen bg-gradient-to-b from-stone-900 to-stone-800">
        <EtherealSpace />
      </section>

      <section className="relative min-h-screen py-32 bg-gradient-to-b from-stone-100 to-white" id="what-is-music">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_65%)] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-8">
          <h2 className="text-5xl font-serif mb-16 text-stone-800 opacity-90">What is Music?</h2>
          
          <div className="space-y-24 pb-16">
            {/* Basic Definition */}
            <div className="space-y-8">
              <p className="text leading-relaxed text-stone-600">
                While a more poetic definition might be that music is the language of emotion, 
                the simplest scientific definition I could find was: <strong>"Music is the arrangement of sounds in time" </strong>
                <br /><br />
                And the controls in the above visualization control exactly these three things; <strong>arrangement</strong>, <strong>sounds</strong>, and <strong>time</strong>. 
                <br /><br />
                {/* Apart from this, music is composed of three pillars: 
                <span className="relative inline-block px-1">
                  <span className="absolute inset-0 bg-yellow-100/50 rounded" style={{ transform: 'rotate(-2deg)' }} />
                  <span className="relative">rhythm (time)</span>
                </span>, 
                <span className="relative inline-block px-1">
                  <span className="absolute inset-0 bg-blue-100/50 rounded" style={{ transform: 'rotate(1deg)' }} />
                  <span className="relative">melody (words or sentences of music)</span>
                </span>, and 
                <span className="relative inline-block px-1">
                  <span className="absolute inset-0 bg-rose-100/50 rounded" style={{ transform: 'rotate(-1deg)' }} />
                  <span className="relative">harmony (feelings)</span>
                </span>. */}
                Here's a <a 
                  href="https://www.youtube.com/watch?v=_S6Z31v9XNQ" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >link of Jacob Collier explaining what music is</a> (in just 2 min) better than I ever could.
              </p>
            </div>

            {/* Add divider */}
            <div className="w-full h-px bg-stone-300 my-12" />

            {/* Home Key Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-serif mb-6 text-stone-700">Why am I learning alphabets again? And what is this Home key?</h3>
              <div className="space-y-4">
                <p className="text-stone-600 font-semibold text-lg">Alphabets</p>
                
                {/* Sound Wave Illustration */}
                <ExplanationBox>
                  <p className="text-stone-600">
                    Well, in all truthfulness, there are infinite sounds, each having their own wave frequencies. A lot of sounds aren&apos;t even audible to the human ear. But to make life easier, many cultures have standardized <span className="font-semibold text-stone-700">12 sounds</span> for music, which are represented by alphabets, 
                    A through G (there are some with # or b, but essentially they are just a weird way of naming these sounds).
                  </p>
                  <br />
                  <p className="text-stone-600">
                    For the purpose of creating music, rest of the sounds are just derivatives of these 12 sounds, or sounds that lie in between them.
                  </p>
                </ExplanationBox>

                <div className="space-y-4">
                  {/* Notes display */}
                  <div className="flex items-center justify-center p-6 bg-white/70 rounded-lg backdrop-blur-sm shadow-sm">
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-x-4 md:gap-x-8 gap-y-6 font-['Caveat'] text-2xl">
                      {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((note) => (
                        <div key={note} className="flex flex-col items-center">
                          <span className={`${note.includes('#') ? 'text-stone-500 text-xl' : 'text-stone-800'}`}>
                            {note}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wave illustrations */}
                  <div className="flex items-center justify-center p-6 bg-white/70 rounded-lg backdrop-blur-sm shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-4 justify-center">
                        <div className="flex-shrink-0">
                          <svg className="w-24 h-12 text-stone-600" viewBox="0 0 100 40">
                            <path d="M 0 20 Q 12.5 0, 25 20 Q 37.5 40, 50 20 Q 62.5 0, 75 20 Q 87.5 40, 100 20" fill="none" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-['Caveat'] text-2xl text-stone-700">A = 440 Hz</span>
                          <span className="text-sm text-stone-500">(440 vibrations/second)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 justify-center">
                        <div className="flex-shrink-0">
                          <svg className="w-24 h-12 text-stone-600" viewBox="0 0 100 40">
                            <path d="M 0 20 Q 10 0, 20 20 Q 30 40, 40 20 Q 50 0, 60 20 Q 70 40, 80 20 Q 90 0, 100 20" fill="none" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-['Caveat'] text-2xl text-stone-700">A# = 466.2 Hz</span>
                          <span className="text-sm text-stone-500">(faster vibrations)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 justify-center">
                        <div className="flex-shrink-0">
                          <svg className="w-24 h-12 text-stone-600" viewBox="0 0 100 40">
                            <path d="M 0 20 Q 8 0, 16 20 Q 24 40, 32 20 Q 40 0, 48 20 Q 56 40, 64 20 Q 72 0, 80 20 Q 88 40, 96 20" fill="none" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-['Caveat'] text-2xl text-stone-700">B = 493.9 Hz</span>
                          <span className="text-sm text-stone-500">(even faster vibrations)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <br />
                <p className="text-stone-600 font-semibold text-lg">Home Key/Note</p>
                <ExplanationBox>
                  <p className="text-stone-600">
                    Majority of music (I am pretty sure over 99%) has an affinity to one sound. Could be A, B, or any other non standardized sound.
                    But this is the sound which any particular music wants to resolve to. The sound at which our brains feel the most at ease, and comfortable.
                    And this note (for that particular music) is called the 
                    <span className="relative inline-block px-1">
                      <span className="absolute inset-0 bg-amber-100/50 rounded" style={{ transform: 'rotate(-1deg)' }} />
                      <span className="relative">home note</span>
                    </span>.
                  </p>
                </ExplanationBox>
                <p>
                  So when you select a particular home key, you are essentially saying that I want this sound to be the most stable note in this music. 
                  Many other sounds will be played as well, but whenever this home note is played, your brain will feel the most at peace.
                </p>
              </div>
              <CollapsibleInfo />
            </div>

            {/* Decorative divider */}
            <div className="w-full h-px bg-stone-300 my-12" />

            {/* Scales Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-serif mb-4 text-stone-700">Alright. But where did major, minor come from?</h3>
              <div className="space-y-4">
                <p className="text-stone-600">
                  Music is the arrangement of sounds in time. So, the arrangement (and also picking the notes to play) part comes from the 
                  <span className="relative inline-block px-1">
                    <span className="absolute inset-0 bg-purple-100/50 rounded" style={{ transform: 'rotate(-1deg)' }} />
                    <span className="relative">scale</span>
                  </span>
                  . Major, minor, lydian (there are a lot more) are types of scales, having their own set of rules to arranging sounds. Different arrangements of sounds evoke different  
                  <span className="font-medium text-stone-800"> emotions</span>.
                </p>
                <div className="mt-6 space-y-4">
                  <ExplanationBox>
                    <h4 className="text-lg font-medium text-stone-700 mb-2">Major Scale</h4>
                    <p className="text-stone-600">Usually bright and happy sounding.</p>
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
              </div>
            </div>

            {/* Decorative divider */}
            <div className="w-full h-px bg-stone-300 my-12" />

            {/* Notes Selection Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-serif mb-4 text-stone-700">Adding Colours</h3>
              <div className="space-y-4">
                <ExplanationBox>
                  <p className="text-stone-600">
                    If you choose a particular scale, you are already choosing which notes to play (and they are chosen in such a way that they sound well together).
                    But you don&apos;t have to always obey the rules of the scale. You can choose other sounds too that don&apos;t belong to this scale. 
                    Now, they may sound a bit weird at times, and unpleasant. But they add more colour and spice to the music. Makes it interesting and adds a whole different dimension to songs.
                    After all, life isn&apos;t always upbeat, happy or unidirectional. There are some weird, haunting, or even 
                    unpleasant moments too. And adding these weird notes creates the same effect.
                  </p>
                </ExplanationBox>
              </div>
              <p className="text-stone-600">
                In the above visualization, these out of place notes show up as differently coloured bubbles.
                (Only when you choose "Yes" for adding more colours. Otherwise they aren&apos;t played at all)
              </p>
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
