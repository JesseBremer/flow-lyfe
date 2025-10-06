'use client';

import { useEffect } from 'react';
import { useFlowStore } from '@/lib/store';
import { Navigation } from '@/components/navigation';
import { CaptureBar } from '@/components/capture-bar';
import { InboxView } from '@/components/inbox-view';
import { ListsView } from '@/components/lists-view';
import { FocusMode } from '@/components/focus-mode';
import { RegisterSW } from '@/app/register-sw';

export default function Home() {
  const { currentView, setCurrentView } = useFlowStore();

  // Listen for navigation events
  useEffect(() => {
    const handleNavigate = () => setCurrentView('process');
    window.addEventListener('navigate-to-process', handleNavigate);
    return () => window.removeEventListener('navigate-to-process', handleNavigate);
  }, [setCurrentView]);

  return (
    <>
      <RegisterSW />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />

      <main className="flex flex-col items-center justify-start min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8">
        {/* Capture Bar - Always at top except in Focus mode */}
        {currentView !== 'focus' && (
          <div className="py-6 sm:py-8 w-full max-w-4xl">
            <CaptureBar />
          </div>
        )}

        {/* Dynamic Content Based on View */}
        <div className="animate-in fade-in duration-300 w-full flex justify-center">
          {currentView === 'stream' && <InboxView />}
          {currentView === 'lists' && <ListsView />}
          {currentView === 'focus' && <FocusMode />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-sm text-neutral-500">
        <p>Flow-Lyfe • Capture. Process. Flow.</p>
      </footer>
      </div>
    </>
  );
}
