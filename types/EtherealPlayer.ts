export interface EtherealPlayerType {
  isPlaying: boolean;
  currentRoot: string;
  currentTempo: number;
  audioContext: AudioContext;
  mainGainNode: GainNode;
  stop: () => void;
  start: (playScale: boolean) => void;
  updateScale: () => void;
  setMode: (mode: string) => void;
  setDiatonicMode: (isDiatonic: boolean) => void;
  updateTempo: (tempo: number) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob>;
} 