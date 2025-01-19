# Music Player Structure

## Core Components

1. **Scale Configuration** (`ModeConfig.ts`)
   - Defines properties for each note in a scale (Major, Minor, Lydian)
   - Properties include: activation, volume, probability, color, chord intervals
   - Each scale has 12 notes (root note + 11 others)

2. **Octave Configuration** (`OctaveConfig.ts`)
   - Defines properties for different octaves (low, middle, high)
   - Controls radius, volume, delay, and visual effects for each octave level

3. **Player Engine** (`EtherealPlayer.ts`)
   - Handles audio generation and visual representation
   - Manages note selection and playback
   - Controls timing and tempo

## How It Works

1. **Note Selection**
   - Root note (home note) is selected as the base
   - Scale notes are selected based on:
     - Whether they are active in the scale
     - Their probability settings
     - Current mode (Major/Minor/Lydian)
   - Optional chromatic (non-scale) notes add color

2. **Sound Generation**
   - Uses Web Audio API for sound synthesis
   - Each note is a sine wave oscillator
   - Volume envelope controls attack and release
   - Multiple octaves can play simultaneously

3. **Visual Representation**
   - Notes appear as bubbles in circular arrangement
   - Colors indicate note type:
     - White: Root note
     - Grey: Scale notes
     - Colored: Chromatic notes
   - Distance from center indicates octave
   - Optional ripple effects for emphasis

## Controls

1. **Basic Controls**
   - Play/Pause
   - Tempo adjustment
   - Root note selection
   - Scale/mode selection

2. **Advanced Settings**
   - Diatonic/Chromatic mode toggle
   - Volume control
   - Visual effects toggle

## Technical Implementation

1. **Audio**
   - AudioContext for sound generation
   - GainNodes for volume control
   - Oscillators for tone generation
   - Envelope shaping for natural sound

2. **Visual**
   - CSS animations for bubbles
   - Dynamic positioning based on note properties
   - Responsive design for different screen sizes

3. **State Management**
   - Tracks current playing state
   - Manages active notes and oscillators
   - Handles mode and scale changes 