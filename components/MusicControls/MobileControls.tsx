'use client';

interface MobileControlsProps {
  player: any;
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
  player,
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
    <div className="absolute top-0 left-0 right-0 px-2 mt-20 flex-col gap-4 md:hidden z-20">
      <div className="flex justify-between items-start gap-2 bg-white/30 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
        {/* Home Key */}
        <div className="flex flex-col gap-1.5 items-center relative">
          <label className="text-xs font-medium text-stone-600">Home Key</label>
          <select
            onChange={onRootChange}
            value={currentRoot}
            className="w-[60px] text-xs bg-stone-600/10 px-1.5 py-1.5 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center relative z-30"
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
          <label className="text-xs font-medium text-stone-600">Mode</label>
          <select
            onChange={onModeChange}
            value={currentMode}
            className="w-[60px] text-xs bg-stone-600/10 px-1.5 py-1.5 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center relative z-30"
          >
            {['Major', 'Minor', 'Lydian'].map(mode => (
              <option key={mode} value={mode} className="bg-white text-stone-700 text-xs">
                {mode}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5 items-center relative">
          <label className="text-xs font-medium text-stone-600 text-center">
            Add more<br />Colours?
          </label>
          <select
            onChange={onDiatonicModeChange}
            value={isDiatonic ? 'diatonic' : 'all'}
            className="w-[60px] text-xs bg-stone-600/10 px-1.5 py-1.5 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center relative z-30"
          >
            <option value="all" className="bg-white text-stone-700 text-xs">Yes</option>
            <option value="diatonic" className="bg-white text-stone-700 text-xs">No</option>
          </select>
        </div>

        {/* Tempo */}
        <div className="flex flex-col gap-1.5 items-center relative">
          <label className="text-xs font-medium text-stone-600">Tempo</label>
          <div className="flex items-center gap-1 relative z-30">
            <button 
              onClick={() => onTempoChange(Math.max(0.5, tempoValue - 0.1))}
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
              onClick={() => onTempoChange(Math.min(3.0, tempoValue + 0.1))}
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
  );
} 