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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-stone-50 to-neutral-100 relative overflow-hidden">
        {/* Ambient background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          <Navigation />

          <main className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6 sm:px-8">
            {/* Capture Bar - Always at top except in Focus mode */}
            {currentView !== 'focus' && (
              <div className="w-full max-w-3xl mb-12">
                <CaptureBar />
              </div>
            )}

            {/* Dynamic Content Based on View */}
            <div className="w-full flex justify-center">
              {currentView === 'stream' && <InboxView />}
              {currentView === 'lists' && <ListsView />}
              {currentView === 'focus' && <FocusMode />}
            </div>
          </main>

          {/* Footer */}
          <footer className="py-6 text-center text-sm text-slate-400">
            <p className="font-light tracking-wide">Flow • Breathe • Emerge</p>
          </footer>
        </div>
      </div>
    </>
  );
}
