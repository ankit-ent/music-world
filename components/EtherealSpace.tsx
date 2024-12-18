'use client';

import { useEffect, useState } from 'react';
import { EtherealPlayer } from '../app/lib/EtherealPlayer';
import '@/app/styles/slider.css';

export default function EtherealSpace() {
  const [player, setPlayer] = useState<EtherealPlayer | null>(null);
  const [tempoValue, setTempoValue] = useState(2.0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const newPlayer = new EtherealPlayer();
    newPlayer.setDiatonicMode(true);
    setPlayer(newPlayer);

    const handleResize = () => {
      newPlayer.updateRadii();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePlayToggle = () => {
    player?.togglePlay();
  };

  const handleRootChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!player) return;
    
    if (player.isPlaying) {
      setIsRefreshing(true);
      
      setTimeout(() => {
        player.setRoot(e.target.value);
        setTimeout(() => {
          setIsRefreshing(false);
        }, 1000);
      }, 500);
    } else {
      player.currentRoot = e.target.value;
      player.updateScale();
    }
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!player) return;
    
    if (player.isPlaying) {
      setIsRefreshing(true);
      
      setTimeout(() => {
        player.setMode(e.target.value);
        setTimeout(() => {
          setIsRefreshing(false);
        }, 1000);
      }, 500);
    } else {
      player.setMode(e.target.value);
    }
  };

  const handleDiatonicModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!player) return;
    player.setDiatonicMode(e.target.value === 'diatonic');
  };

  return (
    <div className="h-full w-full relative">
      <div
        id="space"
        className="h-full w-full relative bg-gradient-radial-custom from-stone-50 via-stone-200 via-50% to-stone-300 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 px-2 mt-20 flex-col gap-4 md:hidden z-20">
          <div className="flex justify-between items-start gap-2 bg-white/30 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
            <div className="flex flex-col gap-1.5 items-center relative">
              <label className="text-xs font-medium text-stone-600">Home Key</label>
              <select
                onChange={handleRootChange}
                value={player?.currentRoot || 'C'}
                className="w-[60px] text-xs bg-stone-600/10 px-1.5 py-1.5 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center relative z-30"
              >
                {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => (
                  <option key={note} value={note} className="bg-white text-stone-700 text-xs">
                    {note}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 items-center relative">
              <label className="text-xs font-medium text-stone-600">Mode</label>
              <select
                onChange={handleModeChange}
                value={player?.currentMode || 'Major'}
                className="w-[60px] text-xs bg-stone-600/10 px-1.5 py-1.5 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center relative z-30"
              >
                {['Major', 'Minor', 'Lydian'].map(mode => (
                  <option key={mode} value={mode} className="bg-white text-stone-700 text-xs">
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 items-center relative">
              <label className="text-xs font-medium text-stone-600">Notes</label>
              <select
                onChange={handleDiatonicModeChange}
                value={player?.playOnlyDiatonic ? 'diatonic' : 'all'}
                className="w-[60px] text-xs bg-stone-600/10 px-1.5 py-1.5 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center relative z-30"
              >
                <option value="all" className="bg-white text-stone-700 text-xs">All</option>
                <option value="diatonic" className="bg-white text-stone-700 text-xs">Scale</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 items-center relative">
              <label className="text-xs font-medium text-stone-600">Tempo</label>
              <div className="flex items-center gap-1 relative z-30">
                <button 
                  onClick={() => {
                    const newBps = Math.max(0.5, tempoValue - 0.1);
                    setTempoValue(newBps);
                    if (player) {
                      player.currentTempo = newBps;
                      player.updateTempo(newBps);
                    }
                  }}
                  className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
                
                <div className="text-xs font-medium text-stone-600 min-w-[32px] text-center">
                  {tempoValue.toFixed(1)}
                </div>
                
                <button 
                  onClick={() => {
                    const newBps = Math.min(3.0, tempoValue + 0.1);
                    setTempoValue(newBps);
                    if (player) {
                      player.currentTempo = newBps;
                      player.updateTempo(newBps);
                    }
                  }}
                  className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="absolute w-[195px] md:w-[300px] h-[195px] md:h-[300px] rounded-full bg-gradient-radial from-stone-50/50 via-stone-100/20 to-transparent" />
          
          <div className="absolute w-[135px] md:w-[200px] h-[135px] md:h-[200px] rounded-full border-[1px] border-stone-300/30 bg-gradient-radial from-transparent via-stone-200/30 to-stone-300/20 shadow-[0_0_40px_rgba(0,0,0,0.1)] backdrop-blur-[1px]" />
          
          <div className="absolute w-[120px] md:w-[180px] h-[120px] md:h-[180px] rounded-full bg-gradient-radial from-white/5 via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={handlePlayToggle}
            className="bg-white/20 px-8 py-3 rounded-lg text-stone-500 transition-all duration-300 backdrop-blur-[2px] text-base relative group overflow-hidden border-2 border-stone-300/30"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-stone-300/10 via-white/20 to-stone-300/10" />
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute inset-0 bg-white/20" />
              <div className="absolute inset-0 border-2 border-stone-400/40 rounded-lg transition-all duration-300" />
            </div>
            <span className="relative group-hover:text-stone-700 transition-colors duration-300">Start/Stop</span>
          </button>
        </div>

        {/* Desktop controls - left */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-5 rounded-2xl flex-col gap-12 items-center border border-white/20 w-[120px] hidden md:flex z-20">
          <div className="flex flex-col gap-3 w-full items-center">
            <label className="text-sm font-medium text-stone-600">Home Key</label>
            <select
              onChange={handleRootChange}
              value={player?.currentRoot || 'C'}
              className="w-[80px] bg-stone-600/10 px-2 py-2 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center"
            >
              {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => (
                <option key={note} value={note} className="bg-white text-stone-700">
                  {note}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3 items-center">
            <label className="text-sm font-medium text-stone-600">Tempo</label>
            <div className="flex flex-col items-center gap-3">
              <button 
                onClick={() => {
                  const newBps = Math.min(3.0, tempoValue + 0.1);
                  setTempoValue(newBps);
                  if (player) {
                    player.currentTempo = newBps;
                    player.updateTempo(newBps);
                  }
                }}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </button>
              
              <div className="text-base font-medium text-stone-600 min-w-[60px] text-center">
                {tempoValue.toFixed(1)}
              </div>
              
              <button 
                onClick={() => {
                  const newBps = Math.max(0.5, tempoValue - 0.1);
                  setTempoValue(newBps);
                  if (player) {
                    player.currentTempo = newBps;
                    player.updateTempo(newBps);
                  }
                }}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop controls - right */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-5 rounded-2xl flex-col gap-12 items-center border border-white/20 w-[120px] hidden md:flex z-20">
          <div className="flex flex-col gap-3 w-full items-center">
            <label className="text-sm font-medium text-stone-600">Mode</label>
            <select
              onChange={handleModeChange}
              value={player?.currentMode || 'Major'}
              className="w-[80px] bg-stone-600/10 px-2 py-2 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center"
            >
              {['Major', 'Minor', 'Lydian'].map(mode => (
                <option key={mode} value={mode} className="bg-white text-stone-700">
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3 w-full items-center">
            <label className="text-sm font-medium text-stone-600">Notes</label>
            <select
              onChange={handleDiatonicModeChange}
              value={player?.playOnlyDiatonic ? 'diatonic' : 'all'}
              className="w-[80px] bg-stone-600/10 px-2 py-2 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center"
            >
              <option value="all" className="bg-white text-stone-700">All</option>
              <option value="diatonic" className="bg-white text-stone-700">Scale</option>
            </select>
          </div>
        </div>
      </div>

      {isRefreshing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-lg border border-white/20 transition-opacity duration-1000">
            <span className="font-serif italic text-stone-500 text-base">
              Changing key...
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 