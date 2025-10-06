'use client';

import { useFlowStore } from '@/lib/store';
import { motion } from 'framer-motion';

export function Navigation() {
  const { currentView, setCurrentView } = useFlowStore();

  const navItems = [
    { id: 'stream' as const, label: 'Stream', emoji: '🌊' },
    { id: 'current' as const, label: 'Current', emoji: '🎯' },
    { id: 'flow-board' as const, label: 'Flow Board', emoji: '📋' },
    { id: 'focus' as const, label: 'Focus', emoji: '🎧' },
    { id: 'tide' as const, label: 'Tide', emoji: '🌙' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Flow-Lyfe
            </h1>
          </div>

          <div className="flex gap-1 bg-neutral-100 rounded-full p-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {currentView === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>{item.emoji}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
