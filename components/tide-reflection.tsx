'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';
import { Reflection } from '@/lib/types';
import { format } from 'date-fns';

export function TideReflection() {
  const [reflection, setReflection] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);

  const recentReflections = useLiveQuery(
    () => db.reflections.reverse().limit(5).toArray()
  );

  const streamCount = useLiveQuery(
    () => db.items.where('status').equals('stream').count()
  );

  const anchorCount = useLiveQuery(
    () => db.items.where('isAnchor').equals(1).count()
  );

  const completedCount = useLiveQuery(
    () => db.items.where('status').equals('archived').count()
  );

  const handleReflect = async () => {
    if (!reflection.trim()) return;

    const newReflection: Reflection = {
      id: nanoid(),
      date: new Date(),
      content: reflection.trim(),
      itemsProcessed: streamCount || 0,
      itemsCompleted: completedCount || 0,
      anchorsIdentified: []
    };

    await db.reflections.add(newReflection);
    setReflection('');
    setIsReflecting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Daily Stats */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-3 gap-4"
      >
        <StatCard
          label="Stream Items"
          value={streamCount || 0}
          emoji="🌊"
          color="blue"
        />
        <StatCard
          label="Anchor Points"
          value={anchorCount || 0}
          emoji="⚓"
          color="amber"
        />
        <StatCard
          label="Completed"
          value={completedCount || 0}
          emoji="✓"
          color="green"
        />
      </motion.div>

      {/* Reflection Input */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">🌙 Tide Reflection</h2>
        <p className="text-sm text-neutral-600 mb-4">
          Take a moment to reflect on your day. What patterns did you notice? What flowed well?
        </p>

        {!isReflecting ? (
          <button
            onClick={() => setIsReflecting(true)}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Start Reflection
          </button>
        ) : (
          <div className="space-y-4">
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you notice today? What wants to become an anchor?"
              className="w-full h-32 p-4 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleReflect}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Save Reflection
              </button>
              <button
                onClick={() => {
                  setIsReflecting(false);
                  setReflection('');
                }}
                className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Recent Reflections */}
      {recentReflections && recentReflections.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Reflections</h3>
          <div className="space-y-3">
            {recentReflections.map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg border border-neutral-200"
              >
                <p className="text-neutral-800">{r.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                  <span>{format(r.date, 'MMM d, yyyy')}</span>
                  <span>{r.itemsProcessed} processed</span>
                  <span>{r.itemsCompleted} completed</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  emoji,
  color
}: {
  label: string;
  value: number;
  emoji: string;
  color: 'blue' | 'amber' | 'green';
}) {
  const colorClasses = {
    blue: 'from-blue-50 to-cyan-50 border-blue-200',
    amber: 'from-amber-50 to-orange-50 border-amber-200',
    green: 'from-green-50 to-emerald-50 border-green-200'
  };

  return (
    <div className={`p-4 rounded-xl border bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="text-3xl mb-1">{emoji}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-neutral-600">{label}</div>
    </div>
  );
}
