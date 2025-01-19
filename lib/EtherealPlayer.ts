import { OctaveConfig, octaveConfigs } from './OctaveConfig';
import { MajorScale, MinorScale, LydianScale, CustomScale, type ScaleConfig, type NoteProperties, type ChordMode } from './ModeConfig';

// Settings that can be changed during playback
interface PlayerSettings {
  root?: string;        // The root/home note (e.g., 'C', 'F#')
  mode?: ChordMode;     // The scale mode (Major/Minor/Lydian/Custom)
  isDiatonic?: boolean; // Whether to play only scale notes or include chromatic notes
}

export class EtherealPlayer {
  // Audio-related properties
  public mainGainNode: GainNode;        // Master volume control
  public audioContext: AudioContext;     // Web Audio API context
  isPlaying: boolean;                    // Current playback state
  noteInterval: NodeJS.Timeout | null;   // Timer for playing random notes

  // Musical properties
  chromaticOrder: string[];             // All 12 notes in order
  currentRoot: string;                  // Current root note
  homeNotes: string[];                  // Root notes in different octaves
  diatonicNotes: string[];             // Scale notes (excluding root)
  chromaticNotes: string[];            // Non-scale notes
  
  // Frequency and position mappings
  baseFrequencies: { [key: string]: number };  // Base frequencies for each note
  notePositions: { [key: string]: number };    // Angular positions for visual display
  
  // Playback properties
  currentTempo: number;                 // Speed of note generation
  
  // Scale configurations
  modes: { [key: string]: ScaleConfig } = {
    'Major': MajorScale,
    'Minor': MinorScale,
    'Lydian': LydianScale,
    'Custom': CustomScale
  };
  currentMode: ChordMode = 'Major';
  currentScale: ScaleConfig;
  playOnlyDiatonic: boolean = true;     // Whether to include chromatic notes
  
  // Active sound management
  private activeOscillators: OscillatorNode[] = [];  // Currently playing sounds
  private activeGainNodes: GainNode[] = [];          // Volume controls for active sounds
  private scaleTimeouts: NodeJS.Timeout[] = [];      // Timers for scale playback

  constructor() {
    // Initialize Web Audio API context
    interface WindowWithWebkit extends Window {
      webkitAudioContext: typeof AudioContext;
    }
    this.audioContext = new (window.AudioContext || 
      (window as unknown as WindowWithWebkit).webkitAudioContext)();
    
    // Initialize basic properties
    this.isPlaying = false;
    this.noteInterval = null;
    this.chromaticOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    this.currentRoot = 'C';
    this.currentScale = this.modes[this.currentMode];
    
    // Initialize note arrays
    this.homeNotes = [];
    this.diatonicNotes = [];
    this.chromaticNotes = [];
    
    // Set up frequency table (A4 = 440Hz as reference)
    this.baseFrequencies = {
      'C': 130.81, 'C#': 138.59, 'D': 146.83, 'D#': 155.56,
      'E': 164.81, 'F': 174.61, 'F#': 185.00, 'G': 196.00,
      'G#': 207.65, 'A': 220.00, 'A#': 233.08, 'B': 246.94
    };

    // Define visual positions in degrees (0-360)
    this.notePositions = {
      'C': 0, 'C#': 30, 'D': 60, 'D#': 90, 'E': 120, 'F': 150,
      'F#': 180, 'G': 210, 'G#': 240, 'A': 270, 'A#': 300, 'B': 330
    };

    this.currentTempo = 2.0;  // Notes per second

    // Generate initial scale notes
    this.updateScale();

    // Set up master volume
    this.mainGainNode = this.audioContext.createGain();
    this.mainGainNode.gain.value = 0.8;
    this.mainGainNode.connect(this.audioContext.destination);
  }

  // Updates the available notes based on current root and mode
  updateScale() {
    const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
    const activeOctaves = octaveConfigs.filter(config => config.isActive);
    
    // Generate root notes for each active octave
    this.homeNotes = activeOctaves.map(config => `${this.currentRoot}${config.number}`);
    
    this.diatonicNotes = [];
    this.chromaticNotes = [];
    
    // For each active octave, generate scale and non-scale notes
    activeOctaves.forEach(config => {
      // Add active scale notes (excluding root)
      this.currentScale.forEach((noteProps, index) => {
        if (noteProps.isActive && index !== 0) {
          const noteIndex = (rootIndex + index) % 12;
          const note = this.chromaticOrder[noteIndex];
          this.diatonicNotes.push(`${note}${config.number}`);
        }
      });

      // Add non-scale notes (chromatic notes)
      this.currentScale.forEach((noteProps, index) => {
        if (!noteProps.isActive) {
          const noteIndex = (rootIndex + index) % 12;
          const note = this.chromaticOrder[noteIndex];
          this.chromaticNotes.push(`${note}${config.number}`);
        }
      });
    });
  }

  // Selects a random note based on scale probabilities
  getRandomNote(): string {
    // Select an octave based on configured probabilities
    const activeOctaves = octaveConfigs.filter(config => config.isActive);
    const totalProb = activeOctaves.reduce((sum, config) => sum + config.probability, 0);
    const normalizedProbs = activeOctaves.map(config => config.probability / totalProb);
    
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

    // Select note based on mode (diatonic or chromatic)
    if (this.playOnlyDiatonic) {
      return this.getRandomDiatonicNote(selectedOctave);
    } else {
      return this.getRandomChromaticNote(selectedOctave);
    }
  }

  // Helper method for selecting diatonic notes
  private getRandomDiatonicNote(octave: OctaveConfig): string {
    const random = Math.random();
    let cumProb = 0;
    let totalProb = 0;
    
    // Calculate total probability for active notes only
    for (let i = 0; i < this.currentScale.length; i++) {
      const noteProps = this.currentScale[i];
      if (noteProps.isActive) {
        totalProb += noteProps.prob;
      }
    }
    
    // Use scale-defined probabilities for active notes only
    for (let i = 0; i < this.currentScale.length; i++) {
      const noteProps = this.currentScale[i];
      if (!noteProps.isActive) continue;
      
      cumProb += (noteProps.prob / totalProb);
      if (random <= cumProb) {
        const noteIndex = (this.chromaticOrder.indexOf(this.currentRoot) + i) % 12;
        const note = `${this.chromaticOrder[noteIndex]}${octave.number}`;
        
        // Maybe play a chord
        if (noteProps.intervals && Math.random() < 0.25) {
          this.playChord(noteIndex, noteProps.intervals, octave);
        }
        
        return note;
      }
    }
    
    // Fallback to root note
    return `${this.currentRoot}${octave.number}`;
  }

  // Helper method for selecting chromatic notes
  private getRandomChromaticNote(octave: OctaveConfig): string {
    const random = Math.random();
    let cumProb = 0;
    let totalProb = 0;
    
    // Calculate total probability for all notes
    for (const noteProps of this.currentScale) {
      totalProb += noteProps.prob;
    }
    
    const allNotes = this.currentScale.map((noteProps, index) => {
      const noteIndex = (this.chromaticOrder.indexOf(this.currentRoot) + index) % 12;
      return {
        note: this.chromaticOrder[noteIndex],
        props: noteProps
      };
    });
    
    for (const { note, props } of allNotes) {
      cumProb += (props.prob / totalProb);
      if (random <= cumProb) {
        const fullNote = `${note}${octave.number}`;
        
        // Maybe play a chord
        if (props.intervals && Math.random() < 0.25) {
          const noteIndex = this.chromaticOrder.indexOf(note);
          this.playChord(noteIndex, props.intervals, octave);
        }
        
        return fullNote;
      }
    }
    
    // Fallback to root note
    return `${this.currentRoot}${octave.number}`;
  }

  // Helper method for playing chords
  private playChord(rootIndex: number, intervals: number[], octave: OctaveConfig) {
    intervals.forEach((interval, idx) => {
      const noteIndex = (rootIndex + interval) % 12;
      const note = `${this.chromaticOrder[noteIndex]}${octave.number}`;
      setTimeout(() => this.playNote(note, 0.5, true), idx * 30);
    });
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
    
    // Get note properties from scale config
    const baseNote = note.replace(/[0-9]/g, '');
    const noteIndex = (12 + this.chromaticOrder.indexOf(baseNote) - this.chromaticOrder.indexOf(this.currentRoot)) % 12;
    const noteProps = this.currentScale[noteIndex];
    
    // Use config values for volume and envelope
    const tempoFactor = Math.max(0.3, 1.0 - (this.currentTempo - 1.0) * 0.2);
    const maxVolume = isChordNote 
      ? noteProps.volume * octaveConfig.volume * 0.05 * tempoFactor 
      : noteProps.volume * octaveConfig.volume * 0.3 * tempoFactor;
    
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
    this.createBubble(note, octaveConfig, noteProps);

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

  createBubble(note: string, octaveConfig: OctaveConfig, noteProps: NoteProperties) {
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
    
    // Add color class based on note properties
    bubble.classList.add(noteProps.color);
    
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
    if (this.noteInterval) {
      clearInterval(this.noteInterval);
    }
    
    const msPerBeat = 1000 / this.currentTempo;
    const playRandomNote = () => {
      const note = this.getRandomNote();
      this.playNote(note);
    };
    
    this.noteInterval = setInterval(playRandomNote, msPerBeat);
  }

  stop() {
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
    if (this.isPlaying) {
      this.startRandomNotes(); // This will clear the existing interval and start a new one
    }
  }

  playScale() {
    // Use middle octave from config
    const middleOctaveConfig = octaveConfigs.find(config => config.number === 4);
    if (!middleOctaveConfig?.isActive) return 0;  // Return if middle octave is inactive
    
    const scaleNotes = this.currentScale
      .map((noteProps, index) => {
        if (!noteProps.isActive) return null;
        const noteIndex = (this.chromaticOrder.indexOf(this.currentRoot) + index) % 12;
        return `${this.chromaticOrder[noteIndex]}${middleOctaveConfig.number}`;
      })
      .filter((note): note is string => note !== null);

    // Clear any existing timeouts first
    this.scaleTimeouts.forEach(timeout => clearTimeout(timeout));
    this.scaleTimeouts = [];

    scaleNotes.forEach((note: string, index: number) => {
      const timeout = setTimeout(() => {
        this.playNote(note, 0.5);
      }, index * 300);
      this.scaleTimeouts.push(timeout);
    });

    // Play root note chord at the end
    const chordDelay = scaleNotes.length * 300 + 200;
    const chordTimeout = setTimeout(() => {
      const rootIndex = this.chromaticOrder.indexOf(this.currentRoot);
      const rootNoteProps = this.currentScale[0];
      if (rootNoteProps.intervals) {
        rootNoteProps.intervals.forEach((interval, idx) => {
          const noteIndex = (rootIndex + interval) % 12;
          const note = `${this.chromaticOrder[noteIndex]}${middleOctaveConfig.number}`;
          setTimeout(() => this.playNote(note, 1.0, false), idx * 30);  // Play chord notes at normal volume and longer duration
        });
      }
    }, chordDelay);
    this.scaleTimeouts.push(chordTimeout);

    return chordDelay + 1500;  // Return total duration with a shorter delay
  }

  setMode(mode: ChordMode) {
    this.currentMode = mode;
    this.currentScale = this.modes[mode];
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

  checkAndApplyChanges(newSettings: PlayerSettings) {
    let hasChanges = false;
    
    if (newSettings.root && newSettings.root !== this.currentRoot) {
      this.currentRoot = newSettings.root;
      hasChanges = true;
    }
    
    if (newSettings.mode && newSettings.mode !== this.currentMode) {
      this.currentMode = newSettings.mode;
      this.currentScale = this.modes[newSettings.mode];
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


// let maxVolume = isChordNote ? 0.05 * tempoFactor : 0.3 * tempoFactor;
    
// // Reduce volume for higher octaves
// if (octave === 5) {
//   maxVolume *= 0.75;  // 75% volume for highest octave
// }

// // Faster attack and release for higher tempos
// const attackTime = Math.min(0.05, 0.1 / this.currentTempo);
// const releaseTime = Math.min(0.2, duration / this.currentTempo);