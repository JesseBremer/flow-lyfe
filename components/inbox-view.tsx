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
    <div className="w-full max-w-2xl mx-auto pb-8">
      {/* Recent Entries - Immediate feedback */}
      {recentItems.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          <p className="text-base">Start capturing...</p>
        </div>
      ) : (
        <>
          <div className="mb-3 text-center text-xs text-neutral-400">
            Recent ({inboxItems.length} total)
          </div>
          <div className="space-y-2">
            {recentItems.map((item, index) => (
              <StreamItem key={item.id} item={item} index={index} />
            ))}
          </div>
          {inboxItems.length > 5 && (
            <div className="mt-4 text-center text-xs text-neutral-400">
              + {inboxItems.length - 5} more items
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StreamItem({ item, index }: { item: FlowItem; index: number }) {
  const [showActions, setShowActions] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const energyColors = {
    high: 'border-l-yellow-400',
    medium: 'border-l-blue-400',
    low: 'border-l-purple-400'
  };

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
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => setShowActions(!showActions)}
      className={`p-3 sm:p-4 bg-white rounded-lg border-l-4 ${energyColors[item.energy || 'medium']}
                  shadow-sm active:shadow-md sm:hover:shadow-md transition-all group relative touch-manipulation`}
    >
      <p className="text-neutral-800 text-base">{item.content}</p>

      {/* Smart hint badge */}
      {smartHint && item.category === 'uncategorized' && (
        <span className="absolute top-2 right-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {smartHint}
        </span>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>{format(item.createdAt, 'h:mm a')}</span>
          {item.clusterId && <span>🌊</span>}
          {item.category !== 'uncategorized' && (
            <span className="px-2 py-0.5 bg-neutral-100 rounded-full">
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
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex gap-1 flex-wrap sm:flex-nowrap"
            >
              <button
                onClick={() => handleQuickAction('today')}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded active:bg-blue-200 sm:hover:bg-blue-200 transition-colors touch-manipulation"
                title="Add to Today"
              >
                Today
              </button>
              <button
                onClick={() => handleQuickAction('someday')}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-purple-100 text-purple-700 rounded active:bg-purple-200 sm:hover:bg-purple-200 transition-colors touch-manipulation"
                title="Add to Someday"
              >
                Later
              </button>
              <button
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="px-2 py-1 text-xs sm:text-sm bg-neutral-100 text-neutral-700 rounded active:bg-neutral-200 sm:hover:bg-neutral-200 transition-colors touch-manipulation"
                title="Categorize"
              >
                🏷️
              </button>
              {(item.category === 'contact' || item.category === 'event') && (
                <button
                  onClick={handleExport}
                  className="px-2 py-1 text-xs sm:text-sm bg-green-100 text-green-700 rounded active:bg-green-200 sm:hover:bg-green-200 transition-colors touch-manipulation"
                  title="Export"
                >
                  📤
                </button>
              )}
              <button
                onClick={() => handleQuickAction('done')}
                className="px-2 py-1 text-xs sm:text-sm bg-neutral-100 text-neutral-700 rounded active:bg-neutral-200 sm:hover:bg-neutral-200 transition-colors touch-manipulation"
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
