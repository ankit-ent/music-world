interface NoteProperties {
  isActive: boolean;
  volume: number;
  prob: number;
  color: string;
  intervals?: number[];
}

type ScaleConfig = NoteProperties[];

const MajorScale: ScaleConfig = [
  // Position:  0-Root  1-m2   2-M2   3-m3   4-M3   5-P4   6-Tri  7-P5   8-m6   9-M6   10-m7  11-M7
  { isActive: true,  volume: 1.0, prob: 0.20,  color: 'root-note',  intervals: [0, 4, 7] },  // Root
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-5'                      },  // m2
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 7] },  // M2
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-3'                      },  // m3
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 7] },  // M3
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 4, 7] },  // P4
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-2'                      },  // Tri
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 4, 7] },  // P5
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-1'                      },  // m6
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 7] },  // M6
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-4'                      },  // m7
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 6] }   // M7
];

const MinorScale: ScaleConfig = [
  // Position:  0-Root  1-m2   2-M2   3-m3   4-M3   5-P4   6-Tri  7-P5   8-m6   9-M6   10-m7  11-M7
  { isActive: true,  volume: 1.0, prob: 0.20,  color: 'root-note',  intervals: [0, 3, 7] },  // Root
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-5'                      },  // m2
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 6] },  // M2
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 4, 7] },  // m3
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-3'                      },  // M3
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 7] },  // P4
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-2'                      },  // Tri
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 7] },  // P5
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 4, 7] },  // m6
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-1'                      },  // M6
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 7] },  // m7
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-4'                      }   // M7
];

const LydianScale: ScaleConfig = [
  // Position:  0-Root  1-m2   2-M2   3-m3   4-M3   5-P4   6-Tri  7-P5   8-m6   9-M6   10-m7  11-M7
  { isActive: true,  volume: 1.0, prob: 0.20,  color: 'root-note',  intervals: [0, 4, 7] },  // Root
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-5'                      },  // m2
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 4, 7] },  // M2
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-3'                      },  // m3
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 7] },  // M3
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-2'                      },  // P4
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 6] },  // Tri (#4)
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 4, 7] },  // P5
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-1'                      },  // m6
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 7] },  // M6
  { isActive: false, volume: 1.0, prob: 0.012, color: 'chromatic-4'                      },  // m7
  { isActive: true,  volume: 1.0, prob: 0.133, color: 'root-note',  intervals: [0, 3, 7] }   // M7
];