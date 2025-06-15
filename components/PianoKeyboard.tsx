'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Keyboard component props
interface PianoKeyboardProps {
  className?: string;
  rootNote?: string;
}

// Define all possible scale degrees
type ScaleDegree = 'root' | 'min2' | 'maj2' | 'min3' | 'maj3' | 'per4' | 'tri' | 
  'per5' | 'min6' | 'maj6' | 'min7' | 'maj7' | 'oct' | 'min9' | 'maj9';

// Scale degree names to make UI clearer
const scaleDegreeNames: Record<ScaleDegree, string> = {
  'root': 'Root',
  'min2': 'm2',
  'maj2': 'M2',
  'min3': 'm3',
  'maj3': 'M3',
  'per4': 'P4',
  'tri': 'Tri',
  'per5': 'P5',
  'min6': 'm6',
  'maj6': 'M6',
  'min7': 'm7',
  'maj7': 'M7',
  'oct': 'Oct',
  'min9': 'm9',
  'maj9': 'M9',
};

// All chromatic notes (repeating for 4 octaves)
const allNotesWithOctaves = [
  'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4',
  'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5',
  'A5', 'A#5', 'B5', 'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6',
  'A6', 'A#6', 'B6', 'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7'
];

// Just the note names without octaves for the UI dropdown
const chromaticNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

export default function PianoKeyboard({ className = '', rootNote = 'C' }: PianoKeyboardProps) {
  // Audio context for generating sounds
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [mainGainNode, setMainGainNode] = useState<GainNode | null>(null);
  const [selectedRoot, setSelectedRoot] = useState<string>(rootNote);
  const [showKeyMap, setShowKeyMap] = useState<boolean>(false);
  
  // Track which keys are currently pressed
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  
  // Refs for tracking active sounds to prevent memory leaks
  const oscillatorsRef = useRef<Record<string, OscillatorNode>>({});
  const gainNodesRef = useRef<Record<string, GainNode>>({});
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Map of currently active oscillators (for UI updates)
  const [activeNotes, setActiveNotes] = useState<Record<string, boolean>>({});
  
  // Cleanup all active sounds
  const cleanupAllSounds = useCallback(() => {
    // Stop all oscillators and disconnect nodes
    Object.entries(oscillatorsRef.current).forEach(([_, osc]) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore disconnection errors
      }
    });
    
    // Clear all gain nodes
    Object.values(gainNodesRef.current).forEach(gainNode => {
      try {
        gainNode.disconnect();
      } catch {
        // Ignore disconnection errors
      }
    });
    
    // Clear all timeout references
    Object.values(timeoutsRef.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    
    // Reset refs
    oscillatorsRef.current = {};
    gainNodesRef.current = {};
    timeoutsRef.current = {};
    
    // Reset active notes for UI
    setActiveNotes({});
  }, []);
  
  // Scale degree to semitone mapping (relative to root)
  // This maps each scale degree to the number of semitones from the root
  const scaleDegreeSemitones = useMemo(() => ({
    'root': 0,    // Root note
    'min2': 1,    // Minor second
    'maj2': 2,    // Major second
    'min3': 3,    // Minor third
    'maj3': 4,    // Major third
    'per4': 5,    // Perfect fourth
    'tri': 6,     // Tritone
    'per5': 7,    // Perfect fifth
    'min6': 8,    // Minor sixth
    'maj6': 9,    // Major sixth
    'min7': 10,   // Minor seventh
    'maj7': 11,   // Major seventh
    'oct': 12,    // Octave
    'min9': 13,   // Minor ninth
    'maj9': 14,   // Major ninth
  }), []);
  
  // Define which scale degrees are white vs black keys on our keyboard
  const whiteKeyScaleDegrees: ScaleDegree[] = ['root', 'maj2', 'maj3', 'per4', 'per5', 'maj6', 'maj7', 'oct', 'maj9'];
  const blackKeyScaleDegrees: ScaleDegree[] = ['min2', 'min3', 'tri', 'min6', 'min7'];
  
  // Map keyboard keys to scale degrees
  const keyboardMapping = useMemo(() => ({
    'a': 'root',    // Root note
    's': 'maj2',    // Major second
    'd': 'maj3',    // Major third
    'f': 'per4',    // Perfect fourth
    'g': 'per5',    // Perfect fifth
    'h': 'maj6',    // Major sixth
    'j': 'maj7',    // Major seventh
    'k': 'oct',     // Octave
    'l': 'maj9',    // Major ninth
    
    'w': 'min2',    // Minor second
    'e': 'min3',    // Minor third
    't': 'tri',     // Tritone
    'y': 'min6',    // Minor sixth
    'u': 'min7',    // Minor seventh
  } as Record<string, ScaleDegree>), []);
  
  // Function to get the actual note based on scale degree and root
  const getNoteFromScaleDegree = useCallback((scaleDegree: ScaleDegree): string => {
    // Map the root note from the dropdown to its position in the 48-note array
    // Root notes in dropdown are assumed to be from octave 3 (indices 0-11)
    const rootNoteName = selectedRoot;
    const rootIndex = chromaticNotes.indexOf(rootNoteName); // Start at A3
    
    // Get the semitone offset for this scale degree
    const semitones = scaleDegreeSemitones[scaleDegree] || 0;
    
    // Calculate the absolute index in our 48-note array
    const noteIndex = rootIndex + semitones;
    
    // Ensure we're within the bounds of our array (0-47)
    const boundedIndex = Math.min(Math.max(noteIndex, 0), 47);
    
    // Return the note at this position in our array
    return allNotesWithOctaves[boundedIndex];
  }, [selectedRoot, scaleDegreeSemitones]);
  
  // Note frequencies based on equal temperament (A4=440Hz as reference)
  const calculateFrequency = useCallback((note: string): number => {
    // Extract octave and note name
    const octaveStr = note.slice(-1);
    const noteName = note.slice(0, -1);
    const octave = parseInt(octaveStr, 10);
    
    // Note indices with A at 9, matching standard MIDI numbering
    const noteMap: Record<string, number> = {
      'A': 9, 'A#': 10, 'B': 11, 'C': 0, 'C#': 1, 'D': 2,
      'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8
    };
    
    const baseNoteIndex = noteMap[noteName] || 0; // Default to 0 (C) if not found
    
    // A4 is at index 9 in octave 4, which is 440Hz
    const stepsFromA4 = (octave - 4) * 12 + baseNoteIndex - 9;
    return 440 * Math.pow(2, stepsFromA4 / 12);
  }, []);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use a lazy initialization approach to ensure we only create the
      // audio context after a user interaction (to comply with autoplay policies)
      const initAudio = () => {
        if (audioContext) return; // Already initialized
        
        try {
          const AudioContextClass = window.AudioContext || 
            ((window as unknown) as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const newAudioContext = new AudioContextClass();
          
          const newGainNode = newAudioContext.createGain();
          newGainNode.gain.value = 0.5;
          newGainNode.connect(newAudioContext.destination);
          
          setAudioContext(newAudioContext);
          setMainGainNode(newGainNode);
              } catch (error) {
        console.error('Failed to initialize audio context', error);
        }
      };

      // Initialize on first user interaction
      window.addEventListener('mousedown', initAudio, { once: true });
      window.addEventListener('keydown', initAudio, { once: true });
      window.addEventListener('touchstart', initAudio, { once: true });
      
      return () => {
        // Clean up
        window.removeEventListener('mousedown', initAudio);
        window.removeEventListener('keydown', initAudio);
        window.removeEventListener('touchstart', initAudio);
        
        // Clean up all active sounds and the audio context
        cleanupAllSounds();
        
        if (audioContext) {
          audioContext.close().catch(console.error);
        }
      };
    }
  }, [audioContext, cleanupAllSounds]);

  // Helper function to clean up a single note
  const cleanupNote = useCallback((scaleDegree: ScaleDegree) => {
    // Clear any existing timeout for this note
    if (timeoutsRef.current[scaleDegree]) {
      clearTimeout(timeoutsRef.current[scaleDegree]);
      delete timeoutsRef.current[scaleDegree];
    }
    
    const oscillator = oscillatorsRef.current[scaleDegree];
    const gainNode = gainNodesRef.current[scaleDegree];
    
    if (oscillator && gainNode) {
      try {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
      
      // Remove from refs
      delete oscillatorsRef.current[scaleDegree];
      delete gainNodesRef.current[scaleDegree];
      
      // Update UI state
      setActiveNotes(prev => {
        const newState = { ...prev };
        delete newState[scaleDegree];
        return newState;
      });
    }
  }, []);

  // Play a note based on scale degree
  const playNote = useCallback((scaleDegree: ScaleDegree) => {
    if (!audioContext || !mainGainNode) return;
    
    // Get the actual note based on scale degree and root
    const note = getNoteFromScaleDegree(scaleDegree);
    
    // Stop any existing oscillator for this scale degree
    if (oscillatorsRef.current[scaleDegree]) {
      cleanupNote(scaleDegree);
    }
    
    try {
      // Create oscillator for the note
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = calculateFrequency(note);
      
      // Create volume envelope for the note
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0;
      
      // Connect the nodes
      oscillator.connect(gainNode);
      gainNode.connect(mainGainNode);
      
      // Start the oscillator
      oscillator.start();
      
      // Quick fade-in
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.02);
      
      // Store references to active nodes
      oscillatorsRef.current[scaleDegree] = oscillator;
      gainNodesRef.current[scaleDegree] = gainNode;
      
      // Update the UI state
      setActiveNotes(prev => ({ ...prev, [scaleDegree]: true }));
    } catch (error) {
      console.error('Error playing note:', error);
    }
    
  }, [audioContext, mainGainNode, calculateFrequency, getNoteFromScaleDegree, cleanupNote]);

  // Stop a note
  const stopNote = useCallback((scaleDegree: ScaleDegree) => {
    if (!audioContext) return;
    
    // Clear any existing timeout for this note
    if (timeoutsRef.current[scaleDegree]) {
      clearTimeout(timeoutsRef.current[scaleDegree]);
      delete timeoutsRef.current[scaleDegree];
    }
    
    const oscillator = oscillatorsRef.current[scaleDegree];
    const gainNode = gainNodesRef.current[scaleDegree];
    
    if (oscillator && gainNode) {
      try {
        // Fade out
        const currentTime = audioContext.currentTime;
        gainNode.gain.cancelScheduledValues(currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
        gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.05);
        
        // Update UI state immediately
        setActiveNotes(prev => {
          const newState = { ...prev };
          delete newState[scaleDegree];
          return newState;
        });
        
        // Stop oscillator after fade-out
        const timeout = setTimeout(() => {
          cleanupNote(scaleDegree);
        }, 60);
        
        // Store timeout reference for cleanup
        timeoutsRef.current[scaleDegree] = timeout;
      } catch (error) {
        console.error('Error stopping note:', error);
        
        // Force cleanup in case of error
        cleanupNote(scaleDegree);
      }
    }
  }, [audioContext, cleanupNote]);

  // Handle keyboard events
  useEffect(() => {
    if (!audioContext) return; // Don't set up listeners until audio is initialized
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Get lowercase key
      const key = e.key.toLowerCase();
      
      // Check if this key maps to a note
      if (keyboardMapping[key]) {
        // Prevent repeated key events while key is held down
        if (pressedKeys[key]) return;
        
        // Mark this key as pressed
        setPressedKeys(prev => ({ ...prev, [key]: true }));
        
        // Play the note
        playNote(keyboardMapping[key]);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (keyboardMapping[key]) {
        // Mark key as released
        setPressedKeys(prev => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
        
        // Stop the note
        stopNote(keyboardMapping[key]);
      }
    };
    
    // Handle case where user switches tabs/windows
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // If page is hidden, stop all sounds and reset pressed keys
        Object.entries(keyboardMapping).forEach(([key, degree]) => {
          if (pressedKeys[key]) {
            stopNote(degree);
          }
        });
        
        // Reset all pressed keys when page becomes hidden
        setPressedKeys({});
      }
    };
    
    // Handle case where user leaves the page or window loses focus
    const handleBeforeUnload = () => {
      cleanupAllSounds();
    };
    
    const handleBlur = () => {
      // Stop all notes when window loses focus
      Object.entries(keyboardMapping).forEach(([key, degree]) => {
        if (pressedKeys[key]) {
          stopNote(degree);
        }
      });
      
      // Reset pressed keys
      setPressedKeys({});
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleBlur);
    };
  }, [audioContext, keyboardMapping, playNote, stopNote, pressedKeys, cleanupAllSounds]);

  // Handle mouse/touch interactions for visual keyboard
  const handleNoteOn = useCallback((degree: ScaleDegree) => {
    playNote(degree);
  }, [playNote]);
  
  const handleNoteOff = useCallback((degree: ScaleDegree) => {
    stopNote(degree);
  }, [stopNote]);

  // Get white and black keys for rendering
  const whiteKeys = Object.entries(keyboardMapping)
    .filter(([_, degree]) => whiteKeyScaleDegrees.includes(degree))
    .sort((a, b) => {
      return whiteKeyScaleDegrees.indexOf(a[1]) - whiteKeyScaleDegrees.indexOf(b[1]);
    });
    
  const blackKeys = Object.entries(keyboardMapping)
    .filter(([_, degree]) => blackKeyScaleDegrees.includes(degree))
    .sort((a, b) => {
      return blackKeyScaleDegrees.indexOf(a[1]) - blackKeyScaleDegrees.indexOf(b[1]);
    });

  return (
    <div className={`${className}`}>
      {/* Root note selector */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <label htmlFor="rootNote" className="text-sm font-medium text-stone-600 mr-2">
            Root Note:
          </label>
          <select
            id="rootNote"
            value={selectedRoot}
            onChange={(e) => setSelectedRoot(e.target.value)}
            className="bg-stone-600/10 px-2 py-1 rounded-lg text-stone-700 cursor-pointer outline-none hover:bg-stone-600/20 transition-colors text-center"
          >
            {chromaticNotes.map(note => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </div>
        
        <div>
          <button
            type="button"
            className="text-sm bg-stone-600/10 px-3 py-1 rounded-lg text-stone-700 hover:bg-stone-600/20 transition-colors flex items-center"
            onClick={() => setShowKeyMap(!showKeyMap)}
          >
            {showKeyMap ? 'Hide Keyboard Map' : 'Show Keyboard Map'}
          </button>
        </div>
      </div>
      
      {/* Keyboard mapping tooltip */}
      {showKeyMap && (
        <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-stone-700">Current Root: {selectedRoot}3</h3>
              <p className="text-xs text-stone-500">Notes follow standard octave progression (C4-B4, C5-B5, etc.)</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-stone-700 mb-1">White Keys (Major/Perfect Intervals)</h3>
                <div className="grid grid-cols-3 gap-1">
                  {whiteKeys.map(([key, degree]) => (
                    <div key={key} className="flex items-center">
                      <span className="inline-block w-6 h-6 bg-stone-200 rounded flex items-center justify-center mr-1 text-xs">
                        {key.toUpperCase()}
                      </span>
                      <span className="text-stone-600">
                        {scaleDegreeNames[degree]} ({getNoteFromScaleDegree(degree)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-stone-700 mb-1">Black Keys (Minor/Diminished Intervals)</h3>
                <div className="grid grid-cols-3 gap-1">
                  {blackKeys.map(([key, degree]) => (
                    <div key={key} className="flex items-center">
                      <span className="inline-block w-6 h-6 bg-stone-800 text-white rounded flex items-center justify-center mr-1 text-xs">
                        {key.toUpperCase()}
                      </span>
                      <span className="text-stone-600">
                        {scaleDegreeNames[degree]} ({getNoteFromScaleDegree(degree)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Piano keyboard */}
      <div className="mb-10 relative overflow-hidden">
        <div className="flex justify-center items-start h-60 relative">
          {/* White keys */}
          {whiteKeys.map(([key, degree]) => (
            <div 
              key={key}
              className={`w-14 h-52 bg-white border border-stone-300 rounded-b-lg flex items-end justify-center pb-2 relative ${
                activeNotes[degree] ? 'bg-stone-100' : 'bg-white'
              }`}
              onMouseDown={() => handleNoteOn(degree)}
              onMouseUp={() => handleNoteOff(degree)}
              onMouseLeave={() => activeNotes[degree] && handleNoteOff(degree)}
              onTouchStart={(e) => { e.preventDefault(); handleNoteOn(degree); }}
              onTouchEnd={(e) => { e.preventDefault(); handleNoteOff(degree); }}
            >
              <div className="flex flex-col items-center">
                <span className="text-stone-600 uppercase">{key}</span>
                <span className="text-xs text-stone-400 mt-1">{scaleDegreeNames[degree]}</span>
                <span className="text-[10px] text-stone-400/70 mt-0.5">{getNoteFromScaleDegree(degree)}</span>
              </div>
            </div>
          ))}
          
          {/* Black keys (overlay) - positioned between white keys */}
          <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none">
            {blackKeys.map(([key, degree]) => {
              // Calculate position based on the specific scale degree
              let position = 0;
              
              // Calculate white key width
              const whiteKeyWidth = 56; // 14*4 = 56px (width of white key)
              
              // Position black keys based on their musical position
              // The positions where black keys go in a major scale layout
              switch(degree) {
                case 'min2': // Between root and maj2
                  position = whiteKeyWidth * 0.7;
                  break;
                case 'min3': // Between maj2 and maj3
                  position = whiteKeyWidth * 1.7;
                  break;
                case 'tri': // Between per4 and per5
                  position = whiteKeyWidth * 3.7;
                  break;
                case 'min6': // Between per5 and maj6
                  position = whiteKeyWidth * 4.7;
                  break;
                case 'min7': // Between maj6 and maj7
                  position = whiteKeyWidth * 5.7;
                  break;
                default: // Fallback
                  position = 0;
              }
              
              return (
                <div 
                  key={key}
                  className={`w-10 h-32 bg-stone-900 border border-stone-800 rounded-b-lg absolute flex flex-col items-center justify-end pb-2 z-10 pointer-events-auto ${
                    activeNotes[degree] ? 'bg-stone-700' : 'bg-stone-900'
                  }`}
                  style={{ left: `calc(50% - ${whiteKeys.length * whiteKeyWidth / 2}px + ${position}px)` }}
                  onMouseDown={() => handleNoteOn(degree)}
                  onMouseUp={() => handleNoteOff(degree)}
                  onMouseLeave={() => activeNotes[degree] && handleNoteOff(degree)}
                  onTouchStart={(e) => { e.preventDefault(); handleNoteOn(degree); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleNoteOff(degree); }}
                >
                  <span className="text-stone-300 uppercase">{key}</span>
                  <span className="text-xs text-stone-400/80 mt-1">{scaleDegreeNames[degree]}</span>
                  <span className="text-[10px] text-stone-400/60 mt-0.5">{getNoteFromScaleDegree(degree)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 