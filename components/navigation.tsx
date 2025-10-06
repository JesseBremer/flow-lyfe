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
    <nav className="sticky top-0 z-50 bg-amber-50/80 backdrop-blur-xl border-b border-amber-200/40 safe-top">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center py-6">
          {/* Centered Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="text-4xl">🌊</span>
            <h1 className="text-3xl font-extralight tracking-wider bg-gradient-to-r from-amber-800 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              flow
            </h1>
          </motion.div>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-6 py-2 bg-amber-100/50 backdrop-blur-sm rounded-full
                         border border-amber-200/50 hover:bg-amber-100/70 hover:shadow-md active:scale-95
                         transition-all duration-300"
            >
              <span className="text-lg">{currentItem.emoji}</span>
              <span className="text-sm font-light tracking-wide text-amber-800">{currentItem.label}</span>
              <span className="text-xs text-amber-600">▼</span>
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-amber-50/95 backdrop-blur-xl
                             rounded-2xl shadow-2xl border border-amber-200/50 overflow-hidden min-w-[160px]"
                >
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-6 py-3.5 hover:bg-amber-100/40 transition-all ${
                        currentView === item.id ? 'bg-gradient-to-r from-amber-100/60 to-orange-100/50' : ''
                      }`}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-sm font-light tracking-wide text-amber-800">{item.label}</span>
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
