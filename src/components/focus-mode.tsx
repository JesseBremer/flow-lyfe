'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { FocusSession } from '@/lib/types';
import { useFlowStore } from '@/lib/store';

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

export function FocusMode() {
  const { activeFocusSession, setActiveFocusSession } = useFlowStore();
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'flow'>('pomodoro');

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          completeSession();
          return mode === 'pomodoro' ? POMODORO_DURATION : 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const startSession = async () => {
    const session: FocusSession = {
      id: nanoid(),
      duration: mode === 'pomodoro' ? 25 : 0,
      startedAt: new Date(),
      type: mode
    };

    await db.focusSessions.add(session);
    setActiveFocusSession(session);
    setIsRunning(true);
  };

  const completeSession = async () => {
    if (activeFocusSession) {
      await db.focusSessions.update(activeFocusSession.id, {
        completedAt: new Date()
      });
      setActiveFocusSession(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        {/* Mode Selection */}
        <div className="flex gap-2 justify-center mb-8">
          <button
            onClick={() => {
              setMode('pomodoro');
              setTimeLeft(POMODORO_DURATION);
              setIsRunning(false);
            }}
            className={`px-6 py-2 rounded-full transition-all ${
              mode === 'pomodoro'
                ? 'bg-red-500 text-white'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            }`}
          >
            🍅 Pomodoro
          </button>
          <button
            onClick={() => {
              setMode('flow');
              setTimeLeft(0);
              setIsRunning(false);
            }}
            className={`px-6 py-2 rounded-full transition-all ${
              mode === 'flow'
                ? 'bg-blue-500 text-white'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            }`}
          >
            🌊 Flow Mode
          </button>
        </div>

        {/* Timer Display */}
        <motion.div
          className={`w-64 h-64 mx-auto rounded-full flex items-center justify-center ${
            isRunning ? 'bg-gradient-to-br from-blue-400 to-purple-500' : 'bg-neutral-200'
          } transition-all duration-500`}
          animate={{
            scale: isRunning ? [1, 1.05, 1] : 1
          }}
          transition={{
            repeat: isRunning ? Infinity : 0,
            duration: 2
          }}
        >
          <div className="text-white">
            <div className="text-6xl font-bold">
              {mode === 'pomodoro' ? formatTime(timeLeft) : '∞'}
            </div>
            <div className="text-sm mt-2 opacity-80">
              {mode === 'pomodoro' ? 'Deep Focus' : 'Unlimited Flow'}
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="mt-8 space-x-4">
          {!isRunning ? (
            <button
              onClick={startSession}
              className="px-8 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Start Session
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsRunning(false)}
                className="px-8 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
              >
                Pause
              </button>
              <button
                onClick={completeSession}
                className="px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                End Session
              </button>
            </>
          )}
        </div>

        <p className="mt-8 text-sm text-neutral-600 max-w-md">
          {mode === 'pomodoro'
            ? 'Focus for 25 minutes on a single task. Take a 5-minute break when done.'
            : 'Enter unlimited flow state. Work as long as the momentum carries you.'}
        </p>
      </motion.div>
    </div>
  );
}
