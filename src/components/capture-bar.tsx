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
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <form onSubmit={handleCapture} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 rounded-full blur-xl group-focus-within:blur-2xl transition-all duration-500"></div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="let it flow..."
          disabled={isCapturing}
          className="relative w-full px-8 py-6 text-2xl text-center bg-amber-50/90 backdrop-blur-sm border border-amber-200/50 rounded-full
                     focus:outline-none focus:border-amber-300 focus:bg-amber-50/95
                     disabled:opacity-50 transition-all duration-300 shadow-xl
                     placeholder:text-amber-400 placeholder:font-light placeholder:tracking-wider text-amber-900"
          autoFocus
        />
        {input && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            type="submit"
            disabled={isCapturing}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center
                       bg-gradient-to-br from-amber-600 to-orange-700 text-white text-xl
                       rounded-full hover:shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          >
            ✓
          </motion.button>
        )}
      </form>
    </motion.div>
  );
}
