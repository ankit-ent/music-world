'use client';

import { EtherealPlayer } from '@/lib/EtherealPlayer';
import { type ChordMode } from '@/lib/ModeConfig';
import { HomeIcon, MusicalNoteIcon, SwatchIcon, ClockIcon } from '@heroicons/react/24/outline';

interface DesktopControlsProps {
  player: EtherealPlayer | null;
  tempoValue: number;
  currentRoot: string;
  currentMode: ChordMode;
  isDiatonic: boolean;
  isCustomMode?: boolean;
  onRootChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onModeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDiatonicModeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTempoChange: (value: number) => void;
}

export default function DesktopControls({
  player,
  tempoValue,
  currentRoot,
  currentMode,
  isDiatonic,
  isCustomMode = false,
  onRootChange,
  onModeChange,
  onDiatonicModeChange,
  onTempoChange
}: DesktopControlsProps) {
  return (
    <>
      {/* Desktop controls - left */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-5 rounded-2xl flex-col gap-12 items-center border border-white/20 w-[120px] hidden md:flex z-20">
        <div className="flex flex-col gap-3 w-full items-center">
          <label className="text-sm font-medium text-stone-600 flex flex-col items-center gap-2">
            <HomeIcon className="w-5 h-5 text-stone-500" />
            <span>Home Key</span>
          </label>
          <select
            onChange={onRootChange}
            value={currentRoot}
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
          <label className="text-sm font-medium text-stone-600 flex flex-col items-center gap-2">
            <ClockIcon className="w-5 h-5 text-stone-500" />
            <span>Tempo</span>
          </label>
          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={() => onTempoChange(Math.min(3.0, tempoValue + 0.1))}
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
              onClick={() => onTempoChange(Math.max(0.5, tempoValue - 0.1))}
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
          <label className="text-sm font-medium text-stone-600 flex flex-col items-center gap-2">
            <MusicalNoteIcon className="w-5 h-5 text-stone-500" />
            <span>Mode</span>
          </label>
          <select
            value={currentMode}
            onChange={onModeChange}
            className="w-[80px] bg-stone-600/10 px-2 py-2 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center"
          >
            {isCustomMode ? (
              <option value="Custom">Custom</option>
            ) : (
              <>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
                <option value="Lydian">Lydian</option>
              </>
            )}
          </select>
        </div>

        <div className="flex flex-col gap-3 w-full items-center">
          <label className="text-sm font-medium text-stone-600 flex flex-col items-center gap-2">
            <SwatchIcon className="w-5 h-5 text-stone-500" />
            <span className="text-center">More Colours?</span>
          </label>
          <select
            onChange={onDiatonicModeChange}
            value={isDiatonic ? 'diatonic' : 'all'}
            className="w-[80px] bg-stone-600/10 px-2 py-2 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center">
            <option value="all" className="bg-white text-stone-700">Yes</option>
            <option value="diatonic" className="bg-white text-stone-700">No</option>
          </select>
        </div>
      </div>
    </>
  );
} 