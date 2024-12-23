'use client'

import EtherealSpace from '@/components/EtherealSpace';
import Footer from '@/components/Footer';

export default function RecordPage() {
  return (
    <main className="relative w-full">
      <section className="h-screen bg-gradient-to-b from-stone-900 to-stone-800">
        <EtherealSpace showRecordingControls={true} />
      </section>

      <Footer />
    </main>
  );
} 