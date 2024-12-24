import { OctaveConfig, octaveConfigs } from './OctaveConfig';

interface PlayerSettings {
  root?: string;
  mode?: string;
  isDiatonic?: boolean;
}

export class EtherealPlayer {
  public mainGainNode: GainNode;
  public audioContext: AudioContext;
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
  private audioProcessor: ScriptProcessorNode | null = null;
  private recordingBuffer: Float32Array[] = [];

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

    this.currentTempo = 2.0;

    this.updateScale();

    this.mainGainNode = this.audioContext.createGain();
    this.mainGainNode.gain.value = 0.8;
    this.mainGainNode.connect(this.audioContext.destination);
  }

  updateScale() {
    const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
    
    // Only use active octaves from config
    const activeOctaves = octaveConfigs.filter(config => config.isActive);
    
    // Generate scale notes for active octaves
    this.homeNotes = activeOctaves.map(config => `${this.currentRoot}${config.number}`);
    
    this.diatonicNotes = [];
    this.chromaticNotes = [];
    
    activeOctaves.forEach(config => {
      // Generate diatonic notes (notes in the scale)
      this.majorScaleSteps.forEach(step => {
        const noteIndex = (rootIndex + step) % 12;
        const note = this.chromaticOrder[noteIndex];
        if (note !== this.currentRoot) {
          this.diatonicNotes.push(`${note}${config.number}`);
        }
      });

      // Generate chromatic notes
      this.chromaticOrder.forEach((note, index) => {
        if (!this.majorScaleSteps.includes((12 + index - rootIndex) % 12)) {
          this.chromaticNotes.push(`${note}${config.number}`);
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
    // Get active octaves and their probabilities
    const activeOctaves = octaveConfigs.filter(config => config.isActive);
    
    // Normalize probabilities to sum to 1
    const totalProb = activeOctaves.reduce((sum, config) => sum + config.probability, 0);
    const normalizedProbs = activeOctaves.map(config => config.probability / totalProb);
    
    // Select an octave based on probability
    const rand = Math.random();
    let cumProb = 0;
    let selectedOctave = activeOctaves[0];
    
    for (let i = 0; i < normalizedProbs.length; i++) {
      cumProb += normalizedProbs[i];
      if (rand <= cumProb) {
        selectedOctave = activeOctaves[i];
        break;
      }
    }

    if (this.playOnlyDiatonic) {
      const random = Math.random() * 100;
      
      if (random < 20) {  // 20% chance for root note/chord
        const playChord = Math.random() < 0.25;
        if (playChord) {
          const rootNote = `${this.currentRoot}${selectedOctave.number}`;
          const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
          const intervals = this.chordTypes[this.currentMode][0];
          
          const chordNotes = intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            return `${this.chromaticOrder[noteIndex]}${selectedOctave.number}`;
          });
          
          chordNotes.forEach((note, i) => {
            setTimeout(() => this.playNote(note, 0.5, true), i * 30);
          });
          return rootNote;
        }
        return this.homeNotes[Math.floor(Math.random() * this.homeNotes.length)];
      } else {  // 80% chance for other diatonic notes
        const scaleDegree = 1 + Math.floor(Math.random() * (this.majorScaleSteps.length - 1));
        const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
        const noteIndex = (rootIndex + this.majorScaleSteps[scaleDegree]) % 12;
        const note = `${this.chromaticOrder[noteIndex]}${selectedOctave.number}`;
        
        if (Math.random() < 0.25) {
          const intervals = this.chordTypes[this.currentMode][scaleDegree];
          const chordNotes = intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            return `${this.chromaticOrder[noteIndex]}${selectedOctave.number}`;
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
          const rootNote = `${this.currentRoot}${selectedOctave.number}`;
          const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
          const intervals = this.chordTypes[this.currentMode][0];
          
          const chordNotes = intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            return `${this.chromaticOrder[noteIndex]}${selectedOctave.number}`;
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
              return `${this.chromaticOrder[chordNoteIndex]}${selectedOctave.number}`;
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
    
    // Get octave config for this note
    const octave = parseInt(note.match(/\d+/)?.[0] || '4');
    const octaveConfig = octaveConfigs.find(config => config.number === octave);
    
    if (!octaveConfig?.isActive) return;  // Don't play inactive octaves
    
    // Use config values for volume and envelope
    const tempoFactor = Math.max(0.3, 1.0 - (this.currentTempo - 1.0) * 0.2);
    const maxVolume = isChordNote 
      ? octaveConfig.volume * 0.05 * tempoFactor 
      : octaveConfig.volume * 0.3 * tempoFactor;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(maxVolume, now + octaveConfig.attack);
    gainNode.gain.linearRampToValueAtTime(0.001, now + duration - octaveConfig.release);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.mainGainNode);
    
    // Add delay if specified
    const startTime = now + (octaveConfig.noteDelay || 0);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    this.activeOscillators.push(oscillator);
    this.activeGainNodes.push(gainNode);

    // Create the visual bubble with config values
    this.createBubble(note, octaveConfig);

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

  createBubble(note: string, octaveConfig: OctaveConfig) {
    const spaceElement = document.getElementById('space');
    if (!spaceElement) return;

    const bounds = spaceElement.getBoundingClientRect();
    const baseNote = note.slice(0, -1);  // Remove octave number
    
    const angle = this.notePositions[baseNote];
    const radius = window.innerWidth < 768 ? octaveConfig.mobileRadius : octaveConfig.radius;
    
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    
    const radian = (angle - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(radian);
    const y = centerY + radius * Math.sin(radian);
    
    const size = octaveConfig.bubbleSize;
    
    if (
      x - size/2 < 0 || 
      x + size/2 > bounds.width || 
      y - size/2 < 0 || 
      y + size/2 > bounds.height
    ) {
      return; // Skip creating bubble if it would be outside bounds
    }
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.opacity = octaveConfig.bubbleOpacity.toString();
    
    if (baseNote === this.currentRoot) {
      bubble.classList.add('root-note');
    } else if (this.chromaticNotes.includes(note)) {
      const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
      const noteIndex = this.chromaticOrder.indexOf(baseNote);
      const semitones = (12 + noteIndex - rootIndex) % 12;
      
      // Map semitone positions to color indices for each mode
      const colorMaps = {
        'Major': {
          1: 5,  // Minor second - Purple
          3: 3,  // Minor third - Green
          6: 2,  // Tritone - Red
          8: 1,  // Minor sixth - Yellow
          10: 4, // Minor seventh - Blue
        },
        'Minor': {
          2: 5,  // Major second - Purple
          4: 3,  // Major third - Green
          7: 2,  // Augmented fifth - Red
          9: 1,  // Major sixth - Yellow
          11: 4, // Major seventh - Blue
        },
        'Lydian': {
          1: 5,  // Minor second - Purple
          3: 3,  // Minor third - Green
          5: 2,  // Perfect fourth - Red
          8: 1,  // Minor sixth - Yellow
          10: 4, // Minor seventh - Blue
        }
      };
      
      const colorMap = colorMaps[this.currentMode as keyof typeof colorMaps];
      const colorIndex = colorMap[semitones as keyof typeof colorMap];
      if (colorIndex) {
        bubble.classList.add(`chromatic-${colorIndex}`);
      }
    }
    
    if (octaveConfig.rippleEffect) {
      this.createRipple(x, y);
    }
    
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
    // Use middle octave from config
    const middleOctaveConfig = octaveConfigs.find(config => config.number === 4);
    if (!middleOctaveConfig?.isActive) return 0;  // Return if middle octave is inactive
    
    const scaleNotes = this.majorScaleSteps.map(step => {
      const noteIndex = (this.chromaticOrder.indexOf(this.currentRoot) + step) % 12;
      return `${this.chromaticOrder[noteIndex]}${middleOctaveConfig.number}`;
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
        return `${this.chromaticOrder[noteIndex]}${middleOctaveConfig.number}`;
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
    // Update radii based on window size
    octaveConfigs.forEach(config => {
      config.radius = window.innerWidth < 768 ? config.mobileRadius : config.radius;
    });
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

  async startRecording(): Promise<void> {
    try {
      this.recordingBuffer = [];
      
      // Create a separate recording path
      const recordingDestination = this.audioContext.createMediaStreamDestination();
      this.audioProcessor = this.audioContext.createScriptProcessor(4096, 2, 2);
      
      // Create a separate gain node for recording
      const recordingGain = this.audioContext.createGain();
      recordingGain.gain.value = 1.0;

      // Create two paths:
      // 1. Main path for live playback
      this.mainGainNode.connect(this.audioContext.destination);
      
      // 2. Recording path
      this.mainGainNode.connect(recordingGain);
      recordingGain.connect(this.audioProcessor);
      this.audioProcessor.connect(recordingDestination);

      // Capture audio data
      this.audioProcessor.onaudioprocess = (e) => {
        const left = e.inputBuffer.getChannelData(0);
        const right = e.inputBuffer.getChannelData(1);
        
        // Store exact copies
        this.recordingBuffer.push(
          new Float32Array(left),
          new Float32Array(right)
        );
      };

    } catch (err) {
      console.error('Error starting recording:', err);
      throw err;
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.audioProcessor) return;

      // Remove the audio processing event handler
      this.audioProcessor.onaudioprocess = null;

      try {
        // Disconnect nodes
        this.audioProcessor.disconnect();
      } catch (e) {
        console.warn('Error disconnecting processor:', e);
      }

      // Convert buffer to WAV
      const wavData = this.encodeWAV(this.recordingBuffer);
      const blob = new Blob([wavData], { type: 'audio/wav' });
      this.recordingBuffer = [];
      
      // Clear processor reference
      this.audioProcessor = null;
      
      resolve(blob);
    });
  }

  private encodeWAV(buffers: Float32Array[]): ArrayBuffer {
    const length = buffers.reduce((acc, buf) => acc + buf.length, 0);
    const sampleRate = this.audioContext.sampleRate;
    const channels = 2;
    
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);

    // Write WAV header
    const writeString = (view: DataView, offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length * 2, true);

    // Write audio data
    let offset = 44;
    for (let i = 0; i < buffers.length; i++) {
      for (let j = 0; j < buffers[i].length; j++) {
        const sample = Math.max(-1, Math.min(1, buffers[i][j]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return buffer;
  }
}


// let maxVolume = isChordNote ? 0.05 * tempoFactor : 0.3 * tempoFactor;
    
// // Reduce volume for higher octaves
// if (octave === 5) {
//   maxVolume *= 0.75;  // 75% volume for highest octave
// }

// // Faster attack and release for higher tempos
// const attackTime = Math.min(0.05, 0.1 / this.currentTempo);
// const releaseTime = Math.min(0.2, duration / this.currentTempo);