export interface OctaveConfig {
  number: number;          // The octave number (3, 4, or 5)
  isActive: boolean;       // Whether this octave should be played
  volume: number;          // Volume multiplier for this octave
  radius: number;          // Base radius from center (will be adjusted for mobile)
  mobileRadius: number;    // Radius for mobile screens
  noteDelay: number;       // Optional delay before playing notes in this octave
  probability: number;     // Probability of this octave being chosen when playing random notes
  bubbleSize: number;      // Size of the visual bubble for notes in this octave
  bubbleOpacity: number;   // Opacity of bubbles in this octave
  rippleEffect: boolean;   // Whether to show ripple effect for notes in this octave
  attack: number;          // How quickly the note reaches full volume (in seconds)
  release: number;         // How quickly the note fades out (in seconds)
}

export const octaveConfigs: OctaveConfig[] = [
  {
    number: 3,
    isActive: true,
    volume: 1.0,
    radius: 150,
    mobileRadius: 120,
    noteDelay: 0,
    probability: 0.33,
    bubbleSize: 32,
    bubbleOpacity: 0.8,
    rippleEffect: true,
    attack: 0.02,         // Slower attack for bass notes
    release: 0.1          // Longer release for bass notes
  },
  {
    number: 4,
    isActive: true,
    volume: 0.9,
    radius: 250,
    mobileRadius: 180,
    noteDelay: 0,
    probability: 0.33,
    bubbleSize: 32,
    bubbleOpacity: 0.8,
    rippleEffect: true,
    attack: 0.03,         // Medium attack for middle octave
    release: 0.1         // Medium release for middle octave
  },
  {
    number: 5,
    isActive: true,
    volume: 0.5,
    radius: 350,
    mobileRadius: 240,
    noteDelay: 0,
    probability: 0.33,
    bubbleSize: 32,
    bubbleOpacity: 0.8,
    rippleEffect: true,
    attack: 0.02,         // Faster attack for higher notes
    release: 0.1          // Shorter release for higher notes
  }
]; 