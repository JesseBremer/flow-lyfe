'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { db } from '@/lib/db';
import { FlowItem } from '@/lib/types';
import { updateItemStatus } from '@/lib/utils/capture';
import { format } from 'date-fns';

export function CurrentView() {
  const items = useLiveQuery(
    () => db.items.where('status').equals('current').reverse().sortBy('lastSurfaced')
  );

  const anchors = useLiveQuery(
    () => db.items.where('isAnchor').equals(1).toArray()
  );

  if (!items) return <div className="text-center py-12">Loading current items...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Anchors - Items that keep resurfacing */}
      {anchors && anchors.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            ⚓ Anchor Points
            <span className="text-sm font-normal text-neutral-500">
              ({anchors.length})
            </span>
          </h2>
          <div className="grid gap-3">
            {anchors.map((item) => (
              <CurrentItem key={item.id} item={item} isAnchor />
            ))}
          </div>
        </div>
      )}

      {/* Current surfaced items */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          🌊 Current Flow ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">
            No items in your current flow. They'll surface when ready.
          </p>
        ) : (
          <div className="grid gap-3">
            {items.map((item) => (
              <CurrentItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CurrentItem({ item, isAnchor }: { item: FlowItem; isAnchor?: boolean }) {
  const handleAction = async (action: 'flow' | 'drift' | 'release') => {
    if (action === 'flow') {
      await updateItemStatus(item.id, 'flow');
    } else if (action === 'drift') {
      await updateItemStatus(item.id, 'stream');
    } else {
      await updateItemStatus(item.id, 'archived');
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`p-5 bg-gradient-to-br ${
        isAnchor ? 'from-amber-50 to-orange-50 border-amber-200' : 'from-blue-50 to-cyan-50 border-blue-200'
      } border rounded-xl group`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-neutral-800 text-lg">{item.content}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-600">
            <span>{format(item.createdAt, 'MMM d, h:mm a')}</span>
            {item.surfaceCount && item.surfaceCount > 1 && (
              <span className="px-2 py-0.5 bg-white/60 rounded-full">
                Surfaced {item.surfaceCount}x
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => handleAction('flow')}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          🌊 Flow with it
        </button>
        <button
          onClick={() => handleAction('drift')}
          className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
        >
          💨 Let it drift
        </button>
        <button
          onClick={() => handleAction('release')}
          className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  );
}
