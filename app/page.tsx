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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50/40 to-orange-50/30 relative overflow-hidden">
        {/* Subtle tea-stain texture overlay */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-orange-100/20"></div>

        {/* Ambient background elements - muted earth tones */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          {/* Simplified top header - just the logo */}
          <nav className="sticky top-0 z-50 bg-amber-50/80 backdrop-blur-xl border-b border-amber-200/40 safe-top">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex justify-center items-center">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌊</span>
                  <h1 className="text-2xl font-extralight tracking-wider bg-gradient-to-r from-amber-800 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                    flow
                  </h1>
                </div>
              </div>
            </div>
          </nav>

          <main className="flex flex-col h-[calc(100vh-100px)] relative">
            {/* Dynamic Content Based on View - fills space above input */}
            <div className="flex-1 w-full flex justify-center items-start pt-8 px-6 sm:px-8 overflow-auto pb-32">
              {currentView === 'stream' && <InboxView />}
              {currentView === 'lists' && <ListsView />}
              {currentView === 'focus' && <FocusMode />}
            </div>

            {/* Capture Bar + Navigation Bubbles - Fixed at 1/3 from bottom */}
            {currentView !== 'focus' && (
              <div className="absolute bottom-[33vh] left-0 right-0 w-full px-6 sm:px-8 py-4 bg-gradient-to-b from-transparent via-amber-50/95 to-amber-50">
                <div className="max-w-3xl mx-auto space-y-4">
                  <CaptureBar />
                  <Navigation />
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="py-6 text-center text-sm text-amber-700/60">
            <p className="font-light tracking-wide">flow • breathe • emerge</p>
          </footer>
        </div>
      </div>
    </>
  );
}
