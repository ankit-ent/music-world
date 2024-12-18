export class EtherealPlayer {
  audioContext: AudioContext;
  isPlaying: boolean;
  noteInterval: NodeJS.Timeout | null;
  tempoChangeTimeout: NodeJS.Timeout | null;
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
  chordIntervals: { [key: string]: number[] } = {
    'Major': [0, 4, 7],  // Major chord: root, major third, perfect fifth
    'Minor': [0, 3, 7],  // Minor chord: root, minor third, perfect fifth
    'Lydian': [0, 4, 7]  // Lydian uses major chord
  };
  playOnlyDiatonic: boolean = false;
  audioBuffers: { [key: string]: { [key: string]: AudioBuffer } } = {
    'piano': {},
    'guitar': {}
  };
  currentInstrument: string = 'piano';

  constructor() {
    interface WindowWithWebkit extends Window {
      webkitAudioContext: typeof AudioContext;
    }

    this.audioContext = new (window.AudioContext || 
      (window as unknown as WindowWithWebkit).webkitAudioContext)();
    this.isPlaying = false;
    this.noteInterval = null;
    this.tempoChangeTimeout = null;
    
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
      3: 150,
      4: 250,
      5: 350
    };

    this.currentTempo = 1.2; // Default tempo

    this.updateScale();
    this.loadSamples();
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
      
      if (random < 20) {  // 20% chance for root note
        const playChord = Math.random() < 0.25;
        if (playChord) {
          const octave = Math.floor(Math.random() * 3) + 3;
          const rootNote = `${this.currentRoot}${octave}`;
          
          const intervals = this.chordIntervals[this.currentMode];
          const chordNotes = intervals.map(interval => {
            const noteIndex = (this.chromaticOrder.indexOf(this.currentRoot) + interval) % 12;
            return `${this.chromaticOrder[noteIndex]}${octave}`;
          });
          
          chordNotes.forEach((note, i) => {
            setTimeout(() => this.playNote(note), i * 30);
          });
          
          return rootNote;
        } else {
          return this.homeNotes[Math.floor(Math.random() * this.homeNotes.length)];
        }
      } else {  // 80% chance for other diatonic notes
        return this.diatonicNotes[Math.floor(Math.random() * this.diatonicNotes.length)];
      }
    } else {
      const random = Math.random() * 100;
      
      if (random < 20) {  // 20% chance for home note
        const playChord = Math.random() < 0.25;  // 25% of 20% = 5% overall
        if (playChord) {
          const octave = Math.floor(Math.random() * 3) + 3;
          const rootNote = `${this.currentRoot}${octave}`;
          
          // Get chord notes based on current mode
          const intervals = this.chordIntervals[this.currentMode];
          const chordNotes = intervals.map(interval => {
            const noteIndex = (this.chromaticOrder.indexOf(this.currentRoot) + interval) % 12;
            return `${this.chromaticOrder[noteIndex]}${octave}`;
          });
          
          // Play the chord
          chordNotes.forEach((note, i) => {
            setTimeout(() => this.playNote(note), i * 30);
          });
          
          return rootNote;
        } else {
          return this.homeNotes[Math.floor(Math.random() * this.homeNotes.length)];
        }
      } else if (random < 95) {  // 75% chance for diatonic notes (95-20)
        return this.diatonicNotes[Math.floor(Math.random() * this.diatonicNotes.length)];
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

  playNote(note: string, duration = 4) {
    const baseNote = note.replace(/[0-9]/g, '');
    const octave = parseInt(note.match(/\d+/)?.[0] || '4');
    const sampleOctave = 4;
    const sampleNote = `${baseNote}${sampleOctave}`;
    
    // Create buffer source
    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioBuffers[this.currentInstrument][sampleNote];
    
    // Calculate pitch shift for different octaves
    const semitoneShift = (octave - sampleOctave) * 12;
    source.playbackRate.value = Math.pow(2, semitoneShift / 12);

    // Create gain node for envelope
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start();
    source.stop(this.audioContext.currentTime + duration);

    this.createBubble(note);
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
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Get base note and octave
    const baseNote = note.replace(/[0-9]/g, '');
    const octave = parseInt(note.match(/\d+/)?.[0] || '4');
    const angle = this.notePositions[baseNote];
    
    // Calculate position on the circle
    const baseRadius = this.octaveRadii[octave];
    const radiusVariation = (Math.random() - 0.5) * 40;
    const radius = baseRadius + radiusVariation;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const radian = (angle - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(radian);
    const y = centerY + radius * Math.sin(radian);
    
    // Create ripple effect at the star's position
    this.createRipple(x, y);
    
    // Adjust star size based on octave (higher octave = slightly smaller)
    const baseSize = 32;
    const sizeMultiplier = 1 - ((octave - 3) * 0.1);
    const size = baseSize * sizeMultiplier;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${x - size/2}px`;
    bubble.style.top = `${y - size/2}px`;
    
    document.getElementById('space')?.appendChild(bubble);
    
    bubble.addEventListener('animationend', () => {
      bubble.remove();
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
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
    this.isPlaying = false;
    if (this.noteInterval) {
      clearInterval(this.noteInterval);
    }
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

    scaleNotes.forEach((note, index) => {
      setTimeout(() => {
        this.playNote(note, 0.5);
      }, index * 300);
    });

    // Play mode-appropriate chord after scale
    const chordDelay = scaleNotes.length * 300 + 200;
    setTimeout(() => {
      const intervals = this.chordIntervals[this.currentMode];
      const chordNotes = intervals.map(interval => {
        const noteIndex = (this.chromaticOrder.indexOf(this.currentRoot) + interval) % 12;
        return `${this.chromaticOrder[noteIndex]}${octave}`;
      });
      
      chordNotes.forEach(note => {
        this.playNote(note, 2);
      });
    }, chordDelay);

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

  async loadSamples() {
    const instruments = ['piano', 'guitar'];
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = 4; // We'll use one octave of samples and pitch-shift for other octaves

    for (const instrument of instruments) {
      for (const note of notes) {
        const response = await fetch(`/samples/${instrument}/${note}${octave}.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioBuffers[instrument][`${note}${octave}`] = audioBuffer;
      }
    }
  }

  setInstrument(instrument: string) {
    this.currentInstrument = instrument;
  }
} 