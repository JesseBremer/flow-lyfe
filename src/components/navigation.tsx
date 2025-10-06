'use client';

import { useState } from 'react';
import { useFlowStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export function Navigation() {
  const { currentView, setCurrentView } = useFlowStore();
  const [showBubbles, setShowBubbles] = useState(false);

  const navItems = [
    { id: 'stream' as const, label: 'Stream', emoji: '🌊' },
    { id: 'lists' as const, label: 'Lists', emoji: '📋' },
    { id: 'focus' as const, label: 'Focus', emoji: '🎧' }
  ];

  const currentItem = navItems.find(item => item.id === currentView) || navItems[0];

  return (
    <div className="flex justify-center items-center relative">
      {/* Main navigation bubble */}
      <motion.button
        onClick={() => setShowBubbles(!showBubbles)}
        className="w-16 h-16 rounded-full bg-amber-100/80 backdrop-blur-sm border-2 border-amber-300/50
                   flex items-center justify-center text-2xl shadow-lg hover:shadow-xl hover:scale-110
                   active:scale-95 transition-all duration-300"
        whileTap={{ scale: 0.9 }}
      >
        {currentItem.emoji}
      </motion.button>

      {/* Other navigation bubbles - appear around main bubble */}
      <AnimatePresence>
        {showBubbles && (
          <>
            {navItems
              .filter(item => item.id !== currentView)
              .map((item, index) => {
                const angle = (index * 120) - 60; // Spread bubbles in an arc
                const radius = 80;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                    animate={{ scale: 1, x, y, opacity: 1 }}
                    exit={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => {
                      setCurrentView(item.id);
                      setShowBubbles(false);
                    }}
                    className="absolute w-14 h-14 rounded-full bg-amber-50/90 backdrop-blur-sm border-2 border-amber-200/50
                               flex items-center justify-center text-xl shadow-lg hover:shadow-xl hover:scale-110
                               active:scale-95 transition-all duration-200"
                    style={{ left: '50%', top: '50%', marginLeft: '-28px', marginTop: '-28px' }}
                  >
                    {item.emoji}
                  </motion.button>
                );
              })}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
