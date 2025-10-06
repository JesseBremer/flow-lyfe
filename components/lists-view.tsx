'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { db } from '@/lib/db';
import { FlowItem } from '@/lib/types';
import { format } from 'date-fns';
import { exportToVCard, exportToGoogleCalendar, getGoogleCalendarUrl } from '@/lib/utils/exports';

export function ListsView() {
  const todayItems = useLiveQuery(() => db.items.where('status').equals('today').toArray());
  const somedayItems = useLiveQuery(() => db.items.where('status').equals('someday').toArray());
  const awaitingItems = useLiveQuery(() => db.items.where('status').equals('awaiting').toArray());

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today List */}
        <ListColumn
          title="Today"
          emoji="🎯"
          items={todayItems || []}
          emptyMessage="No tasks for today"
          color="blue"
        />

        {/* Someday List */}
        <ListColumn
          title="Someday"
          emoji="🌤️"
          items={somedayItems || []}
          emptyMessage="No someday items"
          color="purple"
        />

        {/* Awaiting List */}
        <ListColumn
          title="Awaiting"
          emoji="⏳"
          items={awaitingItems || []}
          emptyMessage="Nothing waiting"
          color="amber"
        />
      </div>

      {/* Thoughts & Ideas Archive */}
      <ThoughtsArchive />
    </div>
  );
}

function ListColumn({
  title,
  emoji,
  items,
  emptyMessage,
  color
}: {
  title: string;
  emoji: string;
  items: FlowItem[];
  emptyMessage: string;
  color: 'blue' | 'purple' | 'amber';
}) {
  const colorClasses = {
    blue: 'from-blue-50 to-cyan-50 border-blue-200',
    purple: 'from-purple-50 to-pink-50 border-purple-200',
    amber: 'from-amber-50 to-orange-50 border-amber-200'
  };

  // Group by category
  const todos = items.filter(i => i.category === 'todo');
  const contacts = items.filter(i => i.category === 'contact');
  const events = items.filter(i => i.category === 'event');
  const bills = items.filter(i => i.category === 'bill');

  return (
    <div className={`p-4 rounded-xl border bg-gradient-to-br ${colorClasses[color]} min-h-[400px]`}>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>{emoji}</span>
        <span>{title}</span>
        <span className="text-sm font-normal text-neutral-500">({items.length})</span>
      </h2>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">{emptyMessage}</p>
        ) : (
          <>
            {todos.length > 0 && (
              <CategorySection title="To-Dos" items={todos} />
            )}
            {contacts.length > 0 && (
              <CategorySection title="Contacts" items={contacts} />
            )}
            {events.length > 0 && (
              <CategorySection title="Events" items={events} />
            )}
            {bills.length > 0 && (
              <CategorySection title="Bills" items={bills} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CategorySection({ title, items }: { title: string; items: FlowItem[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-neutral-600 uppercase mb-2">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <ListItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

function ListItem({ item, index }: { item: FlowItem; index: number }) {
  const handleComplete = async () => {
    await db.items.update(item.id, {
      status: 'archived',
      updatedAt: new Date()
    });
  };

  const handleMoveToToday = async () => {
    await db.items.update(item.id, {
      status: 'today',
      updatedAt: new Date()
    });
  };

  const getCategoryIcon = () => {
    switch (item.category) {
      case 'todo': return '✓';
      case 'contact': return '👤';
      case 'event': return '📅';
      case 'bill': return '💰';
      default: return '•';
    }
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="p-3 bg-white rounded-lg shadow-sm group relative"
    >
      <div className="flex items-start gap-2">
        <span className="text-lg mt-0.5">{getCategoryIcon()}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neutral-800">{item.content}</p>

          {/* Category-specific details */}
          {item.category === 'contact' && item.contactPhone && (
            <div className="mt-2 text-xs text-neutral-600 space-y-1">
              {item.contactName && <div>👤 {item.contactName}</div>}
              {item.contactPhone && <div>📱 {item.contactPhone}</div>}
              {item.contactEmail && <div>📧 {item.contactEmail}</div>}
            </div>
          )}

          {item.category === 'event' && item.eventDate && (
            <div className="mt-2 text-xs text-neutral-600">
              📅 {format(item.eventDate, 'MMM d, h:mm a')}
              {item.eventLocation && <div>📍 {item.eventLocation}</div>}
            </div>
          )}

          {item.category === 'bill' && (
            <div className="mt-2 text-xs text-neutral-600">
              {item.billAmount && <div>💵 ${item.billAmount}</div>}
              {item.billDueDate && <div>📅 Due: {format(item.billDueDate, 'MMM d')}</div>}
            </div>
          )}

          {item.status === 'awaiting' && (
            <div className="mt-2 text-xs text-neutral-600">
              {item.awaitingFrom && <div>⏳ Waiting for: {item.awaitingFrom}</div>}
              {item.awaitingNote && <div className="text-neutral-500">{item.awaitingNote}</div>}
            </div>
          )}

          {/* Actions */}
          <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.category === 'todo' && (
              <button
                onClick={handleComplete}
                className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                ✓ Complete
              </button>
            )}

            {item.category === 'contact' && (
              <button
                onClick={() => exportToVCard(item)}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                📥 Export vCard
              </button>
            )}

            {item.category === 'event' && (
              <>
                <button
                  onClick={() => exportToGoogleCalendar(item)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  📥 Download .ics
                </button>
                <a
                  href={getGoogleCalendarUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  📆 Add to Google
                </a>
              </>
            )}

            {item.status === 'someday' && (
              <button
                onClick={handleMoveToToday}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                → Today
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ThoughtsArchive() {
  const thoughts = useLiveQuery(
    () => db.items
      .where('category')
      .anyOf(['thought', 'idea'])
      .reverse()
      .limit(10)
      .toArray()
  );

  if (!thoughts || thoughts.length === 0) return null;

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>💭</span>
        <span>Recent Thoughts & Ideas</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {thoughts.map((thought, i) => (
          <motion.div
            key={thought.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 bg-white rounded-lg text-sm text-neutral-700"
          >
            <div className="flex items-start gap-2">
              <span>{thought.category === 'idea' ? '💡' : '💭'}</span>
              <div className="flex-1">
                <p>{thought.content}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {format(thought.createdAt, 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
