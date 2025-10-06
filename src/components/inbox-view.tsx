'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/db';
import { FlowItem, ItemCategory, ItemStatus } from '@/lib/types';
import { format } from 'date-fns';
import { CategoryPicker } from './category-picker';
import { exportToVCard, exportToGoogleCalendar, getGoogleCalendarUrl } from '@/lib/utils/exports';

export function InboxView() {
  const inboxItems = useLiveQuery(
    () => db.items.where('status').equals('inbox').reverse().sortBy('createdAt')
  );

  if (!inboxItems) return <div className="text-center py-8">Loading stream...</div>;

  // Show only last 5 items for quick visual confirmation
  const recentItems = inboxItems.slice(0, 5);

  return (
    <div className="w-full max-w-3xl mx-auto pb-4">
      {/* Recent Entries - Stack layout, newest on top */}
      {recentItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-light tracking-wide text-amber-400">breathe in...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 text-center text-sm font-light tracking-widest text-amber-600/70 uppercase">
            Recent ({inboxItems.length})
          </div>
          {/* Reversed stack - newest item appears on top, covering older ones slightly */}
          <div className="relative space-y-[-50px]">
            {[...recentItems].reverse().map((item, index) => (
              <StreamItem
                key={item.id}
                item={item}
                index={recentItems.length - 1 - index}
                stackPosition={index}
                totalItems={recentItems.length}
              />
            ))}
          </div>
          {inboxItems.length > 5 && (
            <div className="mt-16 text-center text-sm font-light tracking-wide text-amber-600/60">
              + {inboxItems.length - 5} more flowing...
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StreamItem({
  item,
  index,
  stackPosition = 0,
  totalItems = 1
}: {
  item: FlowItem;
  index: number;
  stackPosition?: number;
  totalItems?: number;
}) {
  const [showActions, setShowActions] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const energyColors = {
    high: 'border-l-amber-300/60',
    medium: 'border-l-sky-300/60',
    low: 'border-l-violet-300/60'
  };

  // Calculate z-index and transform based on stack position
  const zIndex = totalItems - stackPosition;
  const isTopCard = stackPosition === totalItems - 1;

  const handleQuickAction = async (action: 'today' | 'someday' | 'done') => {
    const updates: Partial<FlowItem> = {
      status: action === 'done' ? 'archived' : action,
      updatedAt: new Date()
    };

    // Smart categorization - guess based on content
    if (item.category === 'uncategorized') {
      const content = item.content.toLowerCase();
      if (content.includes('@') || content.includes('email') || content.includes('call') || content.includes('contact')) {
        updates.category = 'contact';
      } else if (content.includes('pay') || content.includes('bill') || content.includes('$')) {
        updates.category = 'bill';
      } else if (content.includes('meeting') || content.includes('event') || /\d{1,2}(am|pm|:)/i.test(content)) {
        updates.category = 'event';
      } else if (content.includes('?') || content.includes('idea') || content.includes('think')) {
        updates.category = 'thought';
      } else {
        updates.category = 'todo';
      }
    }

    await db.items.update(item.id, updates);
  };

  const handleCategorySelect = async (category: ItemCategory) => {
    await db.items.update(item.id, {
      category,
      updatedAt: new Date()
    });
    setShowCategoryPicker(false);
  };

  const handleExport = () => {
    if (item.category === 'contact') {
      exportToVCard(item);
    } else if (item.category === 'event') {
      const url = getGoogleCalendarUrl(item);
      if (url) window.open(url, '_blank');
    }
  };

  // Smart category hint
  const getSmartHint = () => {
    const content = item.content.toLowerCase();
    if (content.includes('@') || content.includes('email')) return '👤 Contact?';
    if (content.includes('pay') || content.includes('bill') || content.includes('$')) return '💰 Bill?';
    if (content.includes('meeting') || /\d{1,2}(am|pm|:)/i.test(content)) return '📅 Event?';
    if (content.includes('?') || content.includes('idea')) return '💭 Thought?';
    return null;
  };

  const smartHint = getSmartHint();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{
        y: 0,
        opacity: isTopCard ? 1 : 0.6,
        scale: isTopCard ? 1 : 0.95 - (stackPosition * 0.02)
      }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => setShowActions(!showActions)}
      style={{ zIndex }}
      className={`p-6 bg-amber-50/90 backdrop-blur-sm rounded-2xl border-l-[6px] ${energyColors[item.energy || 'medium']}
                  shadow-lg hover:shadow-xl active:shadow-xl transition-all duration-300 group relative touch-manipulation
                  hover:bg-amber-50/95 ${!isTopCard ? 'pointer-events-none' : ''}`}
    >
      <p className="text-amber-900 text-lg font-light leading-relaxed">{item.content}</p>

      {/* Smart hint badge */}
      {smartHint && item.category === 'uncategorized' && (
        <span className="absolute top-3 right-3 text-xs px-3 py-1 bg-amber-200/80 text-amber-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-light">
          {smartHint}
        </span>
      )}

      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-3 text-sm text-amber-700/60">
          <span className="font-light">{format(item.createdAt, 'h:mm a')}</span>
          {item.clusterId && <span className="text-base">🌊</span>}
          {item.category !== 'uncategorized' && (
            <span className="px-3 py-1 bg-amber-200/40 rounded-full text-xs font-light tracking-wide">
              {item.category === 'thought' && '💭'}
              {item.category === 'idea' && '💡'}
              {item.category === 'todo' && '✓'}
              {item.category === 'contact' && '👤'}
              {item.category === 'event' && '📅'}
              {item.category === 'bill' && '💰'}
              {item.category}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-2 flex-wrap sm:flex-nowrap"
            >
              <button
                onClick={() => handleQuickAction('today')}
                className="px-3 py-1.5 text-xs font-light tracking-wide bg-blue-100/60 text-blue-600 rounded-full
                           hover:bg-blue-100 active:bg-blue-200 transition-all touch-manipulation"
                title="Add to Today"
              >
                today
              </button>
              <button
                onClick={() => handleQuickAction('someday')}
                className="px-3 py-1.5 text-xs font-light tracking-wide bg-purple-100/60 text-purple-600 rounded-full
                           hover:bg-purple-100 active:bg-purple-200 transition-all touch-manipulation"
                title="Add to Someday"
              >
                later
              </button>
              <button
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="px-2.5 py-1.5 text-sm bg-slate-100/60 rounded-full
                           hover:bg-slate-100 active:bg-slate-200 transition-all touch-manipulation"
                title="Categorize"
              >
                🏷️
              </button>
              {(item.category === 'contact' || item.category === 'event') && (
                <button
                  onClick={handleExport}
                  className="px-2.5 py-1.5 text-sm bg-emerald-100/60 rounded-full
                             hover:bg-emerald-100 active:bg-emerald-200 transition-all touch-manipulation"
                  title="Export"
                >
                  📤
                </button>
              )}
              <button
                onClick={() => handleQuickAction('done')}
                className="px-2.5 py-1.5 text-sm bg-slate-100/60 rounded-full
                           hover:bg-slate-100 active:bg-slate-200 transition-all touch-manipulation"
                title="Archive"
              >
                ✓
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Inline Category Picker */}
      {showCategoryPicker && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <CategoryPicker
            onSelect={handleCategorySelect}
            currentCategory={item.category}
          />
        </div>
      )}
    </motion.div>
  );
}
