'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { FlowItem } from '@/lib/types';
import { format } from 'date-fns';
import { updateItemStatus } from '@/lib/utils/capture';

export function StreamView() {
  const items = useLiveQuery(
    () => db.items.where('status').equals('stream').reverse().sortBy('createdAt')
  );

  if (!items) return <div className="text-center py-12">Loading your stream...</div>;
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p className="text-lg">Your stream is empty</p>
        <p className="text-sm mt-2">Start capturing your thoughts above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {items.map((item, index) => (
        <StreamItem key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

function StreamItem({ item, index }: { item: FlowItem; index: number }) {
  const handleSwipe = async (direction: 'left' | 'right') => {
    if (direction === 'left') {
      await updateItemStatus(item.id, 'archived');
    } else {
      await updateItemStatus(item.id, 'current');
    }
  };

  const energyColors = {
    high: 'border-l-yellow-400',
    medium: 'border-l-blue-400',
    low: 'border-l-purple-400'
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 bg-white rounded-lg border-l-4 ${energyColors[item.energy || 'medium']}
                  shadow-sm hover:shadow-md transition-shadow group`}
    >
      <p className="text-neutral-800">{item.content}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-neutral-500">
          {format(item.createdAt, 'h:mm a')}
          {item.clusterId && <span className="ml-2">🌊 Clustered</span>}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleSwipe('right')}
            className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
          >
            → Flow
          </button>
          <button
            onClick={() => handleSwipe('left')}
            className="text-xs px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200"
          >
            Archive
          </button>
        </div>
      </div>
    </motion.div>
  );
}
