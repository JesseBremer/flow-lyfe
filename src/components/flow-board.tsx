'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { db } from '@/lib/db';
import { FlowItem } from '@/lib/types';
import { updateItemStatus } from '@/lib/utils/capture';

export function FlowBoard() {
  const flowItems = useLiveQuery(() => db.items.where('status').equals('flow').toArray());
  const somedayItems = useLiveQuery(() => db.items.where('status').equals('someday').toArray());

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <FlowColumn
        title="Today's Flow"
        items={flowItems?.slice(0, 5) || []}
        emptyMessage="Add items from Current to start your flow"
        color="blue"
      />
      <FlowColumn
        title="Next Up"
        items={flowItems?.slice(5) || []}
        emptyMessage="Items will flow here when ready"
        color="cyan"
      />
      <FlowColumn
        title="Someday / Maybe"
        items={somedayItems || []}
        emptyMessage="Ideas for the future"
        color="purple"
      />
    </div>
  );
}

function FlowColumn({
  title,
  items,
  emptyMessage,
  color
}: {
  title: string;
  items: FlowItem[];
  emptyMessage: string;
  color: 'blue' | 'cyan' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    cyan: 'bg-cyan-50 border-cyan-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]} min-h-[400px]`}>
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">{emptyMessage}</p>
        ) : (
          items.map((item, index) => (
            <BoardItem key={item.id} item={item} index={index} />
          ))
        )}
      </div>
    </div>
  );
}

function BoardItem({ item, index }: { item: FlowItem; index: number }) {
  const handleComplete = async () => {
    await updateItemStatus(item.id, 'archived');
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="p-3 bg-white rounded-lg shadow-sm group"
    >
      <p className="text-sm text-neutral-800">{item.content}</p>
      <button
        onClick={handleComplete}
        className="mt-2 text-xs text-green-600 hover:text-green-700 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ✓ Complete
      </button>
    </motion.div>
  );
}
