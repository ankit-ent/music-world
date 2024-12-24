'use client';

import { useEffect, useState } from 'react';
import { EtherealPlayer } from '../lib/EtherealPlayer';
import '@/app/styles/slider.css';
import MobileControls from './MusicControls/MobileControls';
import DesktopControls from './MusicControls/DesktopControls';

interface EtherealSpaceProps {
  showRecordingControls?: boolean;
}

export default function EtherealSpace({ showRecordingControls = false }: EtherealSpaceProps) {
  const [player, setPlayer] = useState<EtherealPlayer | null>(null);
  const [tempoValue, setTempoValue] = useState(2.0);
  const [isRefreshing] = useState(false);
  const [currentRoot, setCurrentRoot] = useState('C');
  const [currentMode, setCurrentMode] = useState('Major');
  const [isDiatonic, setIsDiatonic] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

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

  const startRecording = async () => {
    try {
      if (!player) return;
      await player.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!player) return;
      const recordedBlob = await player.stopRecording();
      setRecordedAudio(recordedBlob);
      setIsRecording(false);
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleDownload = () => {
    if (recordedAudio) {
      const url = URL.createObjectURL(recordedAudio);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
          currentRoot={currentRoot}
          currentMode={currentMode}
          isDiatonic={isDiatonic}
          onRootChange={handleRootChange}
          onModeChange={handleModeChange}
          onDiatonicModeChange={handleDiatonicModeChange}
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

        <div className="absolute bottom-20 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2 md:translate-y-0 translate-y-16">
            <div className="flex gap-4">
              <button
                onClick={handlePlayToggle}
                className="bg-white/20 px-8 py-3 rounded-lg md:text-stone-500 text-stone-700 transition-all duration-300 backdrop-blur-[2px] text-base relative group overflow-hidden border-2 border-stone-300/30"
              >
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-300/10 via-white/20 to-stone-300/10" />
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute inset-0 bg-white/20" />
                  <div className="absolute inset-0 border-2 border-stone-400/40 rounded-lg transition-all duration-300" />
                </div>
                <span className="relative md:group-hover:text-stone-700 group-hover:text-stone-800 transition-colors duration-300">Start/Stop</span>
              </button>

              {showRecordingControls && (
                <>
                  <button
                    onClick={handleRecordToggle}
                    className={`bg-white/20 px-8 py-3 rounded-lg transition-all duration-300 backdrop-blur-[2px] text-base relative group overflow-hidden border-2 ${
                      isRecording ? 'border-red-400/50 text-red-500' : 'border-stone-300/30 text-stone-500'
                    }`}
                  >
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-stone-300/10 via-white/20 to-stone-300/10" />
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute inset-0 bg-white/20" />
                      <div className={`absolute inset-0 border-2 rounded-lg transition-all duration-300 ${
                        isRecording ? 'border-red-500/40' : 'border-stone-400/40'
                      }`} />
                    </div>
                    <span className="relative group-hover:text-stone-700 transition-colors duration-300">
                      {isRecording ? 'Stop Recording' : 'Record'}
                    </span>
                  </button>

                  {recordedAudio && !isRecording && (
                    <button
                      onClick={handleDownload}
                      className="bg-white/20 px-8 py-3 rounded-lg text-stone-500 transition-all duration-300 backdrop-blur-[2px] text-base relative group overflow-hidden border-2 border-stone-300/30"
                    >
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-300/10 via-white/20 to-stone-300/10" />
                      </div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute inset-0 bg-white/20" />
                        <div className="absolute inset-0 border-2 border-stone-400/40 rounded-lg transition-all duration-300" />
                      </div>
                      <span className="relative group-hover:text-stone-700 transition-colors duration-300">
                        Download
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Mobile tempo controls */}
            <div className="flex items-center justify-center gap-4 md:hidden mt-2">
              <button 
                onClick={() => handleTempoChange(Math.max(0.5, tempoValue - 0.1))}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              
              <div className="flex flex-col items-center min-w-[50px]">
                <div className="text-base font-medium text-stone-500">
                  {tempoValue.toFixed(1)}
                </div>
                <div className="text-[10px] text-stone-500 -mt-0.5">beats/s</div>
              </div>
              
              <button 
                onClick={() => handleTempoChange(Math.min(3.0, tempoValue + 0.1))}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
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