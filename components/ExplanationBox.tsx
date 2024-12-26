'use client';

interface ExplanationBoxProps {
  children: React.ReactNode;
}

export default function ExplanationBox({ children }: ExplanationBoxProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {children}
    </div>
  );
} 