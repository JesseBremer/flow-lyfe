'use client';

import { useFlowStore } from '@/lib/store';
import { motion } from 'framer-motion';

export function Navigation() {
  const { currentView, setCurrentView } = useFlowStore();

  const navItems = [
    { id: 'stream' as const, label: 'Stream', emoji: '🌊' },
    { id: 'lists' as const, label: 'Lists', emoji: '📋' },
    { id: 'focus' as const, label: 'Focus', emoji: '🎧' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 safe-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🌊</span>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Flow-Lyfe
            </h1>
          </div>

          <div className="flex gap-1 bg-neutral-100 rounded-full p-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'text-white'
                    : 'text-neutral-600 active:text-neutral-900'
                }`}
              >
                {currentView === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span>{item.emoji}</span>
                  <span className="hidden xs:inline">{item.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
