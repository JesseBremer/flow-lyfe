'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { captureItem } from '@/lib/utils/capture';
import { autoCluster } from '@/lib/utils/clustering';

export function CaptureBar() {
  const [input, setInput] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsCapturing(true);
    try {
      const item = await captureItem(input.trim());
      await autoCluster(item.id);
      setInput('');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full"
    >
      <form onSubmit={handleCapture} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's on your mind?"
          disabled={isCapturing}
          className="w-full px-6 sm:px-8 py-5 sm:py-6 text-lg sm:text-2xl text-center bg-white border-2 border-blue-200 rounded-3xl
                     focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100
                     disabled:opacity-50 transition-all shadow-lg placeholder:text-center"
          autoFocus
        />
        {input && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            type="submit"
            disabled={isCapturing}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-3 sm:py-4 bg-blue-500 text-white text-lg sm:text-xl
                       rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
          >
            ✓
          </motion.button>
        )}
      </form>
    </motion.div>
  );
}
