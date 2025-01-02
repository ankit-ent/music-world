'use client'

import { useCallback } from 'react';

const notes = [
  { note: 'C', frequency: 261.63 },
  { note: 'D', frequency: 293.66 },
  { note: 'E', frequency: 329.63 },
  { note: 'F', frequency: 349.23 },
  { note: 'G', frequency: 392.00 },
  { note: 'A', frequency: 440.00 },
  { note: 'B', frequency: 493.88 }
];

export default function ScaleVisualizer() {
  const playNote = useCallback((frequency: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  }, []);

  return (
    <div className="my-8">
      <div className="flex justify-center gap-4 mb-6">
        {notes.map(({ note, frequency }, index) => (
          <button
            key={index}
            onClick={() => playNote(frequency)}
            className={`
              w-12 h-12 rounded-full 
              ${index === 0
                ? 'bg-amber-100 hover:bg-amber-200 border-2 border-amber-300' 
                : 'bg-stone-100 hover:bg-stone-200 border-2 border-stone-300'
              }
              transition-colors duration-200
              flex items-center justify-center
              text-stone-700 font-['Caveat'] text-xl
            `}
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
} 