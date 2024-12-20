'use client';

interface ExplanationBoxProps {
  children: React.ReactNode;
}

export default function ExplanationBox({ children }: ExplanationBoxProps) {
  return (
    <div className="bg-white/95 p-4 rounded-lg shadow-[inset_-1px_-1px_0px_rgba(0,0,0,0.2)] border border-stone-100">
      {children}
    </div>
  );
} 