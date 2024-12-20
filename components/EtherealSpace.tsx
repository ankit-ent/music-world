'use client';

import { useEffect, useState } from 'react';
import { EtherealPlayer } from '../app/lib/EtherealPlayer';
import '@/app/styles/slider.css';
import MobileControls from './MusicControls/MobileControls';
import DesktopControls from './MusicControls/DesktopControls';

export default function EtherealSpace() {
  const [player, setPlayer] = useState<EtherealPlayer | null>(null);
  const [tempoValue, setTempoValue] = useState(2.0);
  const [isRefreshing] = useState(false);
  const [currentRoot, setCurrentRoot] = useState('C');
  const [currentMode, setCurrentMode] = useState('Major');
  const [isDiatonic, setIsDiatonic] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    const newRoot = e.target.value;
    setCurrentRoot(newRoot);
    
    const wasPlaying = player.isPlaying;
    if (wasPlaying) {
      player.stop();
      setIsTransitioning(true);
      setTimeout(() => {
        player.currentRoot = newRoot;
        player.updateScale();
        player.isPlaying = true;
        const scaleDuration = player.playScale();
        setTimeout(() => {
          setIsTransitioning(false);
          player.start(false);
        }, scaleDuration);
      }, 2000);
    } else {
      player.currentRoot = newRoot;
      player.updateScale();
    }
    setPlayer(player);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!player) return;
    const newMode = e.target.value;
    setCurrentMode(newMode);
    
    const wasPlaying = player.isPlaying;
    if (wasPlaying) {
      player.stop();
      setIsTransitioning(true);
      setTimeout(() => {
        player.setMode(newMode);
        player.isPlaying = true;
        const scaleDuration = player.playScale();
        setTimeout(() => {
          setIsTransitioning(false);
          player.start(false);
        }, scaleDuration);
      }, 2000);
    } else {
      player.setMode(newMode);
    }
    setPlayer(player);
  };

  const handleDiatonicModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!player) return;
    const newIsDiatonic = e.target.value === 'diatonic';
    setIsDiatonic(newIsDiatonic);
    
    const wasPlaying = player.isPlaying;
    if (wasPlaying) {
      player.stop();
      player.setDiatonicMode(newIsDiatonic);
      player.start(false);
    } else {
      player.setDiatonicMode(newIsDiatonic);
    }
    setPlayer(player);
  };

  const handleTempoChange = (newTempo: number) => {
    setTempoValue(newTempo);
    if (player) {
      player.currentTempo = newTempo;
      player.updateTempo(newTempo);
    }
  };

  return (
    <div className="h-full w-full relative">
      <div
        id="space"
        className="h-full w-full relative bg-gradient-radial-custom from-stone-50 via-stone-200 via-50% to-stone-300 overflow-hidden"
      >
        <MobileControls
          player={player}
          tempoValue={tempoValue}
          currentRoot={currentRoot}
          currentMode={currentMode}
          isDiatonic={isDiatonic}
          onRootChange={handleRootChange}
          onModeChange={handleModeChange}
          onDiatonicModeChange={handleDiatonicModeChange}
          onTempoChange={handleTempoChange}
        />

        <DesktopControls
          player={player}
          tempoValue={tempoValue}
          currentRoot={currentRoot}
          currentMode={currentMode}
          isDiatonic={isDiatonic}
          onRootChange={handleRootChange}
          onModeChange={handleModeChange}
          onDiatonicModeChange={handleDiatonicModeChange}
          onTempoChange={handleTempoChange}
        />

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="absolute w-[195px] md:w-[300px] h-[195px] md:h-[300px] rounded-full bg-gradient-radial from-stone-50/50 via-stone-100/20 to-transparent" />
          
          <div className="absolute w-[135px] md:w-[200px] h-[135px] md:h-[200px] rounded-full border-[1px] border-stone-300/30 bg-gradient-radial from-transparent via-stone-200/30 to-stone-300/20 shadow-[0_0_40px_rgba(0,0,0,0.1)] backdrop-blur-[1px]" />
          
          <div className="absolute w-[120px] md:w-[180px] h-[120px] md:h-[180px] rounded-full bg-gradient-radial from-white/5 via-transparent to-transparent" />
          
          <div className={`absolute transition-opacity duration-1000 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
            <span className="font-playfair text-stone-300 text-xl italic">
              Transitioning
            </span>
          </div>
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