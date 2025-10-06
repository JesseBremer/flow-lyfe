'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/db';
import { FlowItem, ItemCategory, ItemStatus } from '@/lib/types';
import { CategoryPicker } from './category-picker';
import { format } from 'date-fns';

export function ProcessView() {
  const inboxItems = useLiveQuery(
    () => db.items.where('status').equals('inbox').reverse().sortBy('createdAt')
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!inboxItems || inboxItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-2xl font-bold mb-2">Inbox Zero!</h2>
        <p className="text-neutral-600">
          All items processed. Capture more thoughts to process them here.
        </p>
      </div>
    );
  }

  const currentItem = inboxItems[currentIndex];
  const progress = ((currentIndex + 1) / inboxItems.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-neutral-600 mb-2">
          <span>Processing Inbox</span>
          <span>{currentIndex + 1} of {inboxItems.length}</span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Current Item Card */}
      <AnimatePresence mode="wait">
        {currentItem && (
          <ProcessCard
            key={currentItem.id}
            item={currentItem}
            onProcessed={() => {
              if (currentIndex < inboxItems.length - 1) {
                setCurrentIndex(currentIndex + 1);
              } else {
                setCurrentIndex(0); // Reset or show completion
              }
            }}
            onSkip={() => {
              if (currentIndex < inboxItems.length - 1) {
                setCurrentIndex(currentIndex + 1);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-6 text-center text-sm text-neutral-500">
        <p>💡 Quick keys: 1-6 for categories, Enter to save, Space to skip</p>
      </div>
    </div>
  );
}

function ProcessCard({
  item,
  onProcessed,
  onSkip
}: {
  item: FlowItem;
  onProcessed: () => void;
  onSkip: () => void;
}) {
  const [category, setCategory] = useState<ItemCategory>(item.category || 'uncategorized');
  const [targetList, setTargetList] = useState<ItemStatus>('today');
  const [showDetails, setShowDetails] = useState(false);

  // Category-specific fields
  const [contactName, setContactName] = useState(item.contactName || '');
  const [contactPhone, setContactPhone] = useState(item.contactPhone || '');
  const [contactEmail, setContactEmail] = useState(item.contactEmail || '');

  const [eventDate, setEventDate] = useState(
    item.eventDate ? format(item.eventDate, 'yyyy-MM-dd\'T\'HH:mm') : ''
  );
  const [eventLocation, setEventLocation] = useState(item.eventLocation || '');

  const [awaitingFrom, setAwaitingFrom] = useState(item.awaitingFrom || '');
  const [awaitingNote, setAwaitingNote] = useState(item.awaitingNote || '');

  const [billAmount, setBillAmount] = useState(item.billAmount?.toString() || '');
  const [billDueDate, setBillDueDate] = useState(
    item.billDueDate ? format(item.billDueDate, 'yyyy-MM-dd') : ''
  );

  const handleProcess = async () => {
    const updates: Partial<FlowItem> = {
      category,
      status: category === 'thought' || category === 'idea' ? 'archived' : targetList,
      updatedAt: new Date()
    };

    // Add category-specific data
    if (category === 'contact') {
      updates.contactName = contactName;
      updates.contactPhone = contactPhone;
      updates.contactEmail = contactEmail;
    } else if (category === 'event') {
      updates.eventDate = eventDate ? new Date(eventDate) : undefined;
      updates.eventLocation = eventLocation;
    } else if (category === 'bill') {
      updates.billAmount = billAmount ? parseFloat(billAmount) : undefined;
      updates.billDueDate = billDueDate ? new Date(billDueDate) : undefined;
    }

    if (targetList === 'awaiting') {
      updates.awaitingFrom = awaitingFrom;
      updates.awaitingNote = awaitingNote;
    }

    await db.items.update(item.id, updates);
    onProcessed();
  };

  // Auto-expand details for certain categories
  const needsDetails = ['contact', 'event', 'bill'].includes(category) || targetList === 'awaiting';

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6"
    >
      {/* Item Content */}
      <div className="mb-6">
        <div className="text-sm text-neutral-500 mb-2">
          {format(item.createdAt, 'MMM d, h:mm a')}
          {item.energy && (
            <span className="ml-2 px-2 py-0.5 bg-neutral-100 rounded-full text-xs">
              {item.energy} energy
            </span>
          )}
        </div>
        <p className="text-xl text-neutral-800">{item.content}</p>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          What is this?
        </label>
        <CategoryPicker onSelect={setCategory} currentCategory={category} />
      </div>

      {/* List Selection (for todos) */}
      {category === 'todo' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            When to do it?
          </label>
          <div className="flex gap-2">
            {[
              { value: 'today' as const, label: 'Today', emoji: '🎯' },
              { value: 'someday' as const, label: 'Someday', emoji: '🌤️' },
              { value: 'awaiting' as const, label: 'Awaiting', emoji: '⏳' }
            ].map((list) => (
              <button
                key={list.value}
                onClick={() => setTargetList(list.value)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  targetList === list.value
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="text-xl mb-1">{list.emoji}</div>
                <div className="text-sm font-medium">{list.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Details Section */}
      {(needsDetails || showDetails) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mb-6 p-4 bg-neutral-50 rounded-lg space-y-3"
        >
          {category === 'contact' && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}

          {category === 'event' && (
            <>
              <input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}

          {category === 'bill' && (
            <>
              <input
                type="number"
                placeholder="Amount"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="date"
                value={billDueDate}
                onChange={(e) => setBillDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}

          {targetList === 'awaiting' && (
            <>
              <input
                type="text"
                placeholder="Waiting for (person/company)"
                value={awaitingFrom}
                onChange={(e) => setAwaitingFrom(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                placeholder="What are you waiting for?"
                value={awaitingNote}
                onChange={(e) => setAwaitingNote(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                rows={2}
              />
            </>
          )}
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleProcess}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          ✓ Process
        </button>
        <button
          onClick={onSkip}
          className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Skip →
        </button>
      </div>
    </motion.div>
  );
}
