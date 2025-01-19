'use client'

import EtherealSpace from '@/components/EtherealSpace';

export default function CustomPlayerPage() {
  return (
    <main className="h-screen w-screen bg-gradient-radial-custom from-stone-50 via-stone-200 via-50% to-stone-300">
      <EtherealSpace isCustomMode={true} />
    </main>
  );
} 