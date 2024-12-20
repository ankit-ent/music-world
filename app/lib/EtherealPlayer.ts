interface PlayerSettings {
  root?: string;
  mode?: string;
  isDiatonic?: boolean;
}

export class EtherealPlayer {
  audioContext: AudioContext;
  isPlaying: boolean;
  noteInterval: NodeJS.Timeout | null;
  chromaticOrder: string[];
  majorScaleSteps: number[];
  currentRoot: string;
  homeNotes: string[];
  diatonicNotes: string[];
  chromaticNotes: string[];
  baseFrequencies: { [key: string]: number };
  notePositions: { [key: string]: number };
  octaveRadii: { [key: number]: number };
  currentTempo: number;
  modes: { [key: string]: number[] } = {
    'Major': [0, 2, 4, 5, 7, 9, 11],
    'Minor': [0, 2, 3, 5, 7, 8, 10],
    'Lydian': [0, 2, 4, 6, 7, 9, 11]
  };
  currentMode: string = 'Major';
  chordTypes: { [key: string]: { [key: number]: number[] } } = {
    'Major': {
      0: [0, 4, 7],     // I:   root, 3rd, 5th
      1: [2, 5, 9],     // ii:  2nd, 4th, 6th
      2: [4, 7, 11],    // iii: 3rd, 5th, 7th
      3: [5, 9, 12],    // IV:  4th, 6th, root
      4: [7, 11, 14],   // V:   5th, 7th, 2nd
      5: [9, 12, 16],   // vi:  6th, root, 3rd
      6: [11, 14, 17]   // vii°: 7th, 2nd, 4th
    },
    'Minor': {
      0: [0, 3, 7],     // i:   root, ♭3rd, 5th
      1: [2, 5, 8],     // ii°: 2nd, 4th, ♭6th
      2: [3, 7, 10],    // III: ♭3rd, 5th, ♭7th
      3: [5, 8, 12],    // iv:  4th, ♭6th, root
      4: [7, 10, 14],   // v:   5th, ♭7th, 2nd
      5: [8, 12, 15],   // VI:  ♭6th, root, ♭3rd
      6: [10, 14, 17]   // VII: ♭7th, 2nd, 4th
    },
    'Lydian': {
      0: [0, 4, 7],     // I:   root, 3rd, 5th
      1: [2, 6, 9],     // II:  2nd, #4th, 6th
      2: [4, 7, 11],    // iii: 3rd, 5th, 7th
      3: [6, 9, 13],    // iv°: #4th, 6th, root
      4: [7, 11, 14],   // V:   5th, 7th, 2nd
      5: [9, 12, 16],   // vi:  6th, root, 3rd
      6: [11, 14, 18]   // vii: 7th, 2nd, 4th
    }
  };
  playOnlyDiatonic: boolean = true;
  private activeOscillators: OscillatorNode[] = [];
  private activeGainNodes: GainNode[] = [];
  private scaleTimeouts: NodeJS.Timeout[] = [];

  constructor() {
    interface WindowWithWebkit extends Window {
      webkitAudioContext: typeof AudioContext;
    }

    this.audioContext = new (window.AudioContext || 
      (window as unknown as WindowWithWebkit).webkitAudioContext)();
    this.isPlaying = false;
    this.noteInterval = null;
    
    this.chromaticOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    this.majorScaleSteps = this.modes['Major'];
    this.currentRoot = 'C';
    
    this.homeNotes = [];
    this.diatonicNotes = [];
    this.chromaticNotes = [];
    
    this.baseFrequencies = {
      'C': 130.81, 'C#': 138.59, 'D': 146.83, 'D#': 155.56,
      'E': 164.81, 'F': 174.61, 'F#': 185.00, 'G': 196.00,
      'G#': 207.65, 'A': 220.00, 'A#': 233.08, 'B': 246.94
    };

    this.notePositions = {
      'C': 0, 'C#': 30, 'D': 60, 'D#': 90, 'E': 120, 'F': 150,
      'F#': 180, 'G': 210, 'G#': 240, 'A': 270, 'A#': 300, 'B': 330
    };

    this.octaveRadii = {
      3: window.innerWidth < 768 ? 100 : 150,
      4: window.innerWidth < 768 ? 160 : 250,
      5: window.innerWidth < 768 ? 220 : 350
    };

    this.currentTempo = 2.0;

    this.updateScale();
  }

  updateScale() {
    const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
    
    // Generate scale notes for all octaves
    this.homeNotes = [3, 4, 5].map(octave => `${this.currentRoot}${octave}`);
    
    this.diatonicNotes = [];
    this.chromaticNotes = [];
    
    [3, 4, 5].forEach(octave => {
      // Generate diatonic notes (notes in the scale)
      this.majorScaleSteps.forEach(step => {
        const noteIndex = (rootIndex + step) % 12;
        const note = this.chromaticOrder[noteIndex];
        if (note !== this.currentRoot) {  // Skip root note as it's in homeNotes
          this.diatonicNotes.push(`${note}${octave}`);
        }
      });

      // Generate chromatic notes (notes not in the scale)
      this.chromaticOrder.forEach((note, index) => {
        if (!this.majorScaleSteps.includes((12 + index - rootIndex) % 12)) {
          this.chromaticNotes.push(`${note}${octave}`);
        }
      });
    });
  }

  setRoot(newRoot: string) {
    // Store current playing state
    const wasPlaying = this.isPlaying;
    
    // Temporarily pause random notes
    if (this.noteInterval) {
      clearInterval(this.noteInterval);
    }
    
    this.currentRoot = newRoot;
    this.updateScale();
    
    // Only play scale and continue with random notes if we were playing
    if (wasPlaying) {
      // Add a pause before playing the scale
      setTimeout(() => {
        const scaleDuration = this.playScale();
        setTimeout(() => {
          this.startRandomNotes();
        }, scaleDuration + 500);
      }, 1000); // 1 second pause before scale starts
    }
  }

  getRandomNote(): string {
    if (this.playOnlyDiatonic) {
      const random = Math.random() * 100;
      
      if (random < 20) {  // 20% chance for root note/chord
        const playChord = Math.random() < 0.25;
        if (playChord) {
          const octave = Math.floor(Math.random() * 3) + 3;
          const rootNote = `${this.currentRoot}${octave}`;
          const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
          const intervals = this.chordTypes[this.currentMode][0];
          
          const chordNotes = intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            return `${this.chromaticOrder[noteIndex]}${octave}`;
          });
          
          chordNotes.forEach((note, i) => {
            setTimeout(() => this.playNote(note), i * 30);
          });
          return rootNote;
        }
        return this.homeNotes[Math.floor(Math.random() * this.homeNotes.length)];
      } else {  // 80% chance for other diatonic notes
        const scaleDegree = 1 + Math.floor(Math.random() * (this.majorScaleSteps.length - 1));
        const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
        const noteIndex = (rootIndex + this.majorScaleSteps[scaleDegree]) % 12;
        const octave = 3 + Math.floor(Math.random() * 3);
        const note = `${this.chromaticOrder[noteIndex]}${octave}`;
        
        if (Math.random() < 0.25) {
          const intervals = this.chordTypes[this.currentMode][scaleDegree];
          const chordNotes = intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            return `${this.chromaticOrder[noteIndex]}${octave}`;
          });
          
          chordNotes.forEach((note, i) => {
            setTimeout(() => this.playNote(note, 0.5, true), i * 30);
          });
        }
        return note;
      }
    } else {  // Non-diatonic mode
      const random = Math.random() * 100;
      
      if (random < 20) {  // 20% chance for root note/chord
        const playChord = Math.random() < 0.25;
        if (playChord) {
          const octave = Math.floor(Math.random() * 3) + 3;
          const rootNote = `${this.currentRoot}${octave}`;
          const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
          const intervals = this.chordTypes[this.currentMode][0];
          
          const chordNotes = intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            return `${this.chromaticOrder[noteIndex]}${octave}`;
          });
          
          chordNotes.forEach((note, i) => {
            setTimeout(() => this.playNote(note, 0.5, true), i * 30);
          });
          return rootNote;
        }
        return this.homeNotes[Math.floor(Math.random() * this.homeNotes.length)];
      } else if (random < 95) {  // 75% chance for diatonic notes
        const note = this.diatonicNotes[Math.floor(Math.random() * this.diatonicNotes.length)];
        
        // Add chord playing for diatonic notes
        if (Math.random() < 0.25) {
          const baseNote = note.replace(/[0-9]/g, '');
          const octave = parseInt(note.match(/\d+/)?.[0] || '4');
          const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
          const noteIndex = this.chromaticOrder.indexOf(baseNote);
          
          // Find scale degree
          const scaleDegree = this.majorScaleSteps.findIndex(step => 
            (rootIndex + step) % 12 === noteIndex
          );
          
          if (scaleDegree !== -1) {
            const intervals = this.chordTypes[this.currentMode][scaleDegree];
            const chordNotes = intervals.map(interval => {
              const chordNoteIndex = (rootIndex + interval) % 12;
              return `${this.chromaticOrder[chordNoteIndex]}${octave}`;
            });
            
            chordNotes.forEach((note, i) => {
              setTimeout(() => this.playNote(note, 0.5, true), i * 15);
            });
          }
        }
        return note;
      } else {  // 5% chance for chromatic notes
        return this.chromaticNotes[Math.floor(Math.random() * this.chromaticNotes.length)];
      }
    }
  }

  getFrequency(note: string): number {
    const baseNote = note.replace(/[0-9]/g, '');
    const octave = parseInt(note.match(/\d+/)?.[0] || '4');
    return this.baseFrequencies[baseNote] * Math.pow(2, octave - 3);
  }

  playNote(note: string, duration = 4, isChordNote = false) {
    if (!this.isPlaying) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const now = this.audioContext.currentTime;
    
    oscillator.type = 'sine';
    oscillator.frequency.value = this.getFrequency(note);
    
    // Reduce volume more at higher tempos
    const tempoFactor = Math.max(0.3, 1.0 - (this.currentTempo - 1.0) * 0.2);
    const maxVolume = isChordNote ? 0.05 * tempoFactor : 0.3 * tempoFactor;
    
    // Faster attack and release for higher tempos
    const attackTime = Math.min(0.05, 0.1 / this.currentTempo);
    const releaseTime = Math.min(0.2, duration / this.currentTempo);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(maxVolume, now + attackTime);
    gainNode.gain.linearRampToValueAtTime(0.001, now + duration - releaseTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    this.activeOscillators.push(oscillator);
    this.activeGainNodes.push(gainNode);
    
    oscillator.start(now);
    oscillator.stop(now + duration);

    // Create the visual bubble
    this.createBubble(note);

    // Clean up after the note is done
    setTimeout(() => {
      const index = this.activeOscillators.indexOf(oscillator);
      if (index > -1) {
        this.activeOscillators.splice(index, 1);
        this.activeGainNodes.splice(index, 1);
      }
    }, duration * 1000);
  }

  createRipple(x: number, y: number) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    document.getElementById('space')?.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }

  createBubble(note: string) {
    const spaceElement = document.getElementById('space');
    if (!spaceElement) return;

    // Get container boundaries
    const bounds = spaceElement.getBoundingClientRect();
    
    // Get base note and octave
    const baseNote = note.replace(/[0-9]/g, '');
    const octave = parseInt(note.match(/\d+/)?.[0] || '4');
    const angle = this.notePositions[baseNote];
    
    // Calculate position on the circle
    const baseRadius = this.octaveRadii[octave];
    const radiusVariation = (Math.random() - 0.5) * 40;
    const radius = baseRadius + radiusVariation;
    
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    
    const radian = (angle - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(radian);
    const y = centerY + radius * Math.sin(radian);
    
    // Calculate bubble size
    const baseSize = window.innerWidth < 768 ? 24 : 32;
    const sizeMultiplier = 1 - ((octave - 3) * 0.1);
    const size = baseSize * sizeMultiplier;
    
    // Check if bubble would be visible
    if (
      x - size/2 < 0 || 
      x + size/2 > bounds.width || 
      y - size/2 < 0 || 
      y + size/2 > bounds.height
    ) {
      return; // Skip creating bubble if it would be outside bounds
    }
    
    // Create bubble if it would be visible
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Create ripple effect at the star's position
    this.createRipple(x, y);
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${x - size/2}px`;
    bubble.style.top = `${y - size/2}px`;
    
    spaceElement.appendChild(bubble);
    
    bubble.addEventListener('animationend', () => {
      bubble.remove();
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      // Set isPlaying to false before stopping
      this.isPlaying = false;
      // Wait a tiny bit to ensure no new notes start
      setTimeout(() => {
        this.stop();
      }, 10);
    } else {
      this.start();
    }
  }

  start(immediate = true) {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    this.isPlaying = true;

    if (immediate) {
      const scaleDuration = this.playScale();
      setTimeout(() => {
        this.startRandomNotes();
      }, scaleDuration + 500);
    } else {
      this.startRandomNotes();
    }
  }

  startRandomNotes() {
    this.updateTempo(this.currentTempo);
  }

  stop() {
    // Don't set isPlaying here anymore since we set it in togglePlay
    
    // Cancel all scheduled tasks first
    this.scaleTimeouts.forEach(timeout => clearTimeout(timeout));
    this.scaleTimeouts = [];

    if (this.noteInterval) {
      clearInterval(this.noteInterval);
      this.noteInterval = null;
    }

    // Stop and disconnect all active sounds
    this.activeOscillators.forEach(osc => {
      try {
        osc.disconnect();
        osc.stop(this.audioContext.currentTime);
      } catch {
        // Ignore errors if oscillator already stopped
      }
    });

    this.activeGainNodes.forEach(gain => {
      try {
        gain.disconnect();
      } catch {
        // Ignore errors
      }
    });

    // Clear the arrays
    this.activeOscillators = [];
    this.activeGainNodes = [];
  }

  updateTempo(bps: number) {
    this.currentTempo = bps;
    if (this.noteInterval) {
      clearInterval(this.noteInterval);
    }
    
    const msPerBeat = 1000 / bps;
    const playRandomNote = () => {
      const note = this.getRandomNote();
      this.playNote(note);
    };
    
    this.noteInterval = setInterval(playRandomNote, msPerBeat);
  }

  playScale() {
    const octave = 4;
    const scaleNotes = this.majorScaleSteps.map(step => {
      const noteIndex = (this.chromaticOrder.indexOf(this.currentRoot) + step) % 12;
      return `${this.chromaticOrder[noteIndex]}${octave}`;
    });

    // Clear any existing timeouts first
    this.scaleTimeouts.forEach(timeout => clearTimeout(timeout));
    this.scaleTimeouts = [];

    scaleNotes.forEach((note, index) => {
      const timeout = setTimeout(() => {
        this.playNote(note, 0.5);
      }, index * 300);
      this.scaleTimeouts.push(timeout);
    });

    const chordDelay = scaleNotes.length * 300 + 200;
    const chordTimeout = setTimeout(() => {
      const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
      const intervals = this.chordTypes[this.currentMode][0];
      const chordNotes = intervals.map(interval => {
        const noteIndex = (rootIndex + interval) % 12;
        return `${this.chromaticOrder[noteIndex]}${octave}`;
      });
      
      chordNotes.forEach(note => {
        this.playNote(note, 2);
      });
    }, chordDelay);
    this.scaleTimeouts.push(chordTimeout);

    return chordDelay + 2000;
  }

  setMode(mode: string) {
    this.currentMode = mode;
    this.majorScaleSteps = this.modes[mode];
    this.updateScale();
  }

  setDiatonicMode(onlyDiatonic: boolean) {
    this.playOnlyDiatonic = onlyDiatonic;
  }

  updateRadii() {
    this.octaveRadii = {
      3: window.innerWidth < 768 ? 100 : 150,
      4: window.innerWidth < 768 ? 160 : 250,
      5: window.innerWidth < 768 ? 220 : 350
    };
  }

  checkAndApplyChanges(newSettings: PlayerSettings) {
    let hasChanges = false;
    
    if (newSettings.root && newSettings.root !== this.currentRoot) {
      this.currentRoot = newSettings.root;
      hasChanges = true;
    }
    
    if (newSettings.mode && newSettings.mode !== this.currentMode) {
      this.currentMode = newSettings.mode;
      this.majorScaleSteps = this.modes[newSettings.mode];
      hasChanges = true;
    }
    
    if (newSettings.isDiatonic !== undefined && newSettings.isDiatonic !== this.playOnlyDiatonic) {
      this.playOnlyDiatonic = newSettings.isDiatonic;
      hasChanges = true;
    }

    if (hasChanges) {
      const wasPlaying = this.isPlaying;
      if (wasPlaying) {
        this.stop();
        this.updateScale();
        const scaleDuration = this.playScale();  // Play scale first
        setTimeout(() => {
          this.start(false);  // Then start random notes
        }, scaleDuration + 500);
      } else {
        this.updateScale();
      }
    }
  }
} 