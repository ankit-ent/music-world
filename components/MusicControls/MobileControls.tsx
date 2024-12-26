'use client';

import { EtherealPlayerType } from '@/types/EtherealPlayer';
import { HomeIcon, MusicalNoteIcon, SwatchIcon } from '@heroicons/react/24/outline';

interface MobileControlsProps {
  player: EtherealPlayerType | null;
  tempoValue: number;
  currentRoot: string;
  currentMode: string;
  isDiatonic: boolean;
  onRootChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onModeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDiatonicModeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTempoChange: (newTempo: number) => void;
}

export default function MobileControls({
  tempoValue,
  currentRoot,
  currentMode,
  isDiatonic,
  onRootChange,
  onModeChange,
  onDiatonicModeChange,
  onTempoChange,
}: MobileControlsProps) {
  return (
    <div className="absolute top-0 left-0 right-0 px-2 mt-24 flex-col gap-3 md:hidden z-20">
      {/* Main controls card */}
      <div className="flex justify-between items-start gap-2 bg-white/30 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
        {/* Home Key */}
        <div className="flex flex-col gap-1.5 items-center relative">
          <label className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
            <HomeIcon className="w-4 h-4 text-stone-500" />
            <span>Home Key</span>
          </label>
          <select
            onChange={onRootChange}
            value={currentRoot}
            className="w-[70px] text-xs bg-stone-600/10 px-1.5 py-1.5 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center relative z-30"
          >
            {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => (
              <option key={note} value={note} className="bg-white text-stone-700 text-xs">
                {note}
              </option>
            ))}
          </select>
        </div>

        {/* Mode */}
        <div className="flex flex-col gap-1.5 items-center relative">
          <label className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
            <MusicalNoteIcon className="w-4 h-4 text-stone-500" />
            <span>Mode</span>
          </label>
          <select
            onChange={onModeChange}
            value={currentMode}
            className="w-[70px] text-xs bg-stone-600/10 px-1.5 py-1.5 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center relative z-30"
          >
            {['Major', 'Minor', 'Lydian'].map(mode => (
              <option key={mode} value={mode} className="bg-white text-stone-700 text-xs">
                {mode}
              </option>
            ))}
          </select>
        </div>

        {/* Colors */}
        <div className="flex flex-col gap-1.5 items-center relative">
          <label className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
            <SwatchIcon className="w-4 h-4 text-stone-500" />
            <span>Add Colours?</span>
          </label>
          <select
            onChange={onDiatonicModeChange}
            value={isDiatonic ? 'diatonic' : 'all'}
            className="w-[70px] text-xs bg-stone-600/10 px-1.5 py-1.5 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center relative z-30"
          >
            <option value="all" className="bg-white text-stone-700 text-xs">Yes</option>
            <option value="diatonic" className="bg-white text-stone-700 text-xs">No</option>
          </select>
        </div>
      </div>
    </div>
  );
} 