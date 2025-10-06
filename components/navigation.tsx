'use client';

import { useState } from 'react';
import { useFlowStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export function Navigation() {
  const { currentView, setCurrentView } = useFlowStore();
  const [showMenu, setShowMenu] = useState(false);

  const navItems = [
    { id: 'stream' as const, label: 'Stream', emoji: '🌊' },
    { id: 'lists' as const, label: 'Lists', emoji: '📋' },
    { id: 'focus' as const, label: 'Focus', emoji: '🎧' }
  ];

  const currentItem = navItems.find(item => item.id === currentView) || navItems[0];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 safe-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col items-center h-auto py-3 sm:py-4">
          {/* Centered Title */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl sm:text-3xl">🌊</span>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Flow-Lyfe
            </h1>
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
            >
              <span>{currentItem.emoji}</span>
              <span className="text-sm font-medium">{currentItem.label}</span>
              <span className="text-xs">▼</span>
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden min-w-[150px]"
                >
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 hover:bg-neutral-50 transition-colors ${
                        currentView === item.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
