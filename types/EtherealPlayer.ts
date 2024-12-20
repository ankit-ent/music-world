export interface EtherealPlayerType {
  isPlaying: boolean;
  currentRoot: string;
  currentTempo: number;
  stop: () => void;
  start: (playScale: boolean) => void;
  updateScale: () => void;
  setMode: (mode: string) => void;
  setDiatonicMode: (isDiatonic: boolean) => void;
  updateTempo: (tempo: number) => void;
} 