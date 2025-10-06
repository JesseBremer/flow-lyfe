'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemCategory } from '@/lib/types';

interface CategoryPickerProps {
  onSelect: (category: ItemCategory) => void;
  currentCategory?: ItemCategory;
}

const categories = [
  { id: 'thought' as const, label: 'Thought', emoji: '💭', desc: 'Random idea or musing' },
  { id: 'idea' as const, label: 'Idea', emoji: '💡', desc: 'Actionable concept' },
  { id: 'todo' as const, label: 'To-Do', emoji: '✓', desc: 'Task to complete' },
  { id: 'contact' as const, label: 'Contact', emoji: '👤', desc: 'Person to save' },
  { id: 'event' as const, label: 'Event', emoji: '📅', desc: 'Calendar item' },
  { id: 'bill' as const, label: 'Bill', emoji: '💰', desc: 'Payment reminder' },
];

export function CategoryPicker({ onSelect, currentCategory }: CategoryPickerProps) {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="relative">
      {!showAll ? (
        <button
          onClick={() => setShowAll(true)}
          className="px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2"
        >
          {currentCategory && currentCategory !== 'uncategorized' ? (
            <>
              <span>{categories.find(c => c.id === currentCategory)?.emoji}</span>
              <span>{categories.find(c => c.id === currentCategory)?.label}</span>
            </>
          ) : (
            <>
              <span>🏷️</span>
              <span>Categorize</span>
            </>
          )}
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-10 top-0 left-0 bg-white rounded-xl shadow-lg border border-neutral-200 p-2 min-w-[280px]"
          >
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelect(cat.id);
                    setShowAll(false);
                  }}
                  className={`p-3 rounded-lg text-left transition-all ${
                    currentCategory === cat.id
                      ? 'bg-blue-100 border-2 border-blue-400'
                      : 'bg-neutral-50 hover:bg-neutral-100 border-2 border-transparent'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="font-medium text-sm">{cat.label}</div>
                  <div className="text-xs text-neutral-500">{cat.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAll(false)}
              className="w-full mt-2 py-2 text-sm text-neutral-600 hover:text-neutral-800"
            >
              Cancel
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export function QuickCategoryButtons({ onSelect }: { onSelect: (category: ItemCategory) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="px-3 py-1.5 text-sm bg-white hover:bg-neutral-50 border border-neutral-200 rounded-full transition-all hover:border-blue-400 hover:shadow-sm"
          title={cat.desc}
        >
          <span className="mr-1">{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
