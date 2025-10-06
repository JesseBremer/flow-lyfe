'use client';

import { useFlowStore } from '@/lib/store';
import { Navigation } from '@/components/navigation';
import { CaptureBar } from '@/components/capture-bar';
import { StreamView } from '@/components/stream-view';
import { CurrentView } from '@/components/current-view';
import { FlowBoard } from '@/components/flow-board';
import { FocusMode } from '@/components/focus-mode';
import { TideReflection } from '@/components/tide-reflection';

export default function Home() {
  const { currentView } = useFlowStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Capture Bar - Always visible except in Focus mode */}
        {currentView !== 'focus' && (
          <div className="mb-12">
            <CaptureBar />
          </div>
        )}

        {/* Dynamic Content Based on View */}
        <div className="animate-in fade-in duration-300">
          {currentView === 'stream' && <StreamView />}
          {currentView === 'current' && <CurrentView />}
          {currentView === 'flow-board' && <FlowBoard />}
          {currentView === 'focus' && <FocusMode />}
          {currentView === 'tide' && <TideReflection />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-sm text-neutral-500">
        <p>Flow-Lyfe • Stop planning. Start flowing.</p>
      </footer>
    </div>
  );
}
