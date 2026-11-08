/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Habit } from './types';
import { getSampleHabits } from './data/sampleHabits';
import { getTodayDateString } from './utils/dateUtils';
import { Header } from './components/Header';
import { AddHabitForm } from './components/AddHabitForm';
import { HabitCard } from './components/HabitCard';
import { CheckCircle2, ListFilter, Sparkles, PlusCircle } from 'lucide-react';

const STORAGE_KEY = 'simple_daily_habits_v1';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse habits from localStorage:', e);
    }
    return getSampleHabits();
  });

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Synchronize to localStorage whenever habits change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
      console.warn('Failed to save habits to localStorage:', e);
    }
  }, [habits]);

  const todayStr = getTodayDateString();

  // Completed habits count today
  const completedTodayCount = useMemo(() => {
    return habits.filter((h) => h.completedDates.includes(todayStr)).length;
  }, [habits, todayStr]);

  // Show temporary feedback toast
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((curr) => (curr === message ? null : curr));
    }, 2800);
  };

  // Add new habit
  const handleAddHabit = (name: string) => {
    const newHabit: Habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      createdAt: todayStr,
      completedDates: [],
    };
    setHabits((prev) => [newHabit, ...prev]);
    showToast(`Added "${name}"`);
  };

  // Toggle today's status for a habit
  const handleToggleToday = (habitId: string) => {
    setHabits((prev) => {
      const updated = prev.map((h) => {
        if (h.id !== habitId) return h;
        const isDone = h.completedDates.includes(todayStr);
        const nextDates = isDone
          ? h.completedDates.filter((d) => d !== todayStr)
          : [...h.completedDates, todayStr];
        return { ...h, completedDates: nextDates };
      });

      // Check if all are now completed
      const allDone =
        updated.length > 0 &&
        updated.every((h) => h.completedDates.includes(todayStr));
      
      const targetHabit = prev.find((h) => h.id === habitId);
      const wasDone = targetHabit?.completedDates.includes(todayStr);

      if (!wasDone && allDone) {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#34d399', '#6ee7b7', '#f59e0b'],
        });
        showToast('All habits completed for today! 🎉');
      } else if (!wasDone) {
        showToast(`Completed "${targetHabit?.name}"`);
      }

      return updated;
    });
  };

  // Toggle specific historical date
  const handleToggleDate = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completedDates.includes(dateStr);
        const nextDates = exists
          ? h.completedDates.filter((d) => d !== dateStr)
          : [...h.completedDates, dateStr];
        return { ...h, completedDates: nextDates };
      })
    );
  };

  // Delete habit
  const handleDelete = (habitId: string) => {
    const habitToDelete = habits.find((h) => h.id === habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    if (habitToDelete) {
      showToast(`Deleted "${habitToDelete.name}"`);
    }
  };

  // Reset to default sample habits
  const handleResetToSample = () => {
    const samples = getSampleHabits();
    setHabits(samples);
    showToast('Reset to sample habits');
  };

  // Filtered habits
  const filteredHabits = useMemo(() => {
    return habits.filter((h) => {
      const isDone = h.completedDates.includes(todayStr);
      if (filter === 'pending') return !isDone;
      if (filter === 'completed') return isDone;
      return true;
    });
  }, [habits, filter, todayStr]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all">
          <div className="bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Main Container - Centered and mobile-optimized */}
      <main className="max-w-xl mx-auto px-4 sm:px-6">
        {/* Header with date, progress, and reset */}
        <Header
          totalHabits={habits.length}
          completedTodayCount={completedTodayCount}
          onResetToSample={handleResetToSample}
        />

        {/* 1) Text Box & Add button */}
        <AddHabitForm onAddHabit={handleAddHabit} />

        {/* Filter controls */}
        {habits.length > 0 && (
          <div className="flex items-center justify-between gap-2 mb-3.5 px-0.5">
            <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`min-h-[32px] px-3 rounded-lg transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({habits.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`min-h-[32px] px-3 rounded-lg transition-all cursor-pointer ${
                  filter === 'pending'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                To Do ({habits.length - completedTodayCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`min-h-[32px] px-3 rounded-lg transition-all cursor-pointer ${
                  filter === 'completed'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Done ({completedTodayCount})
              </button>
            </div>

            <div className="text-xs text-slate-400 font-medium hidden sm:block">
              Auto-saved in browser
            </div>
          </div>
        )}

        {/* Habit Cards List */}
        <div className="space-y-3">
          {filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleToday={handleToggleToday}
                onToggleDate={handleToggleDate}
                onDelete={handleDelete}
              />
            ))
          ) : habits.length === 0 ? (
            /* Empty State when no habits exist */
            <div className="text-center py-12 px-4 bg-white border border-dashed border-slate-300 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                No habits yet
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                Start tracking a daily routine by typing a habit above, or reload the sample habits to test it out.
              </p>
              <button
                type="button"
                onClick={handleResetToSample}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Load sample habits
              </button>
            </div>
          ) : (
            /* Filter empty state */
            <div className="text-center py-10 px-4 bg-white border border-slate-200/80 rounded-2xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <h2 className="text-sm font-semibold text-slate-900 mb-0.5">
                {filter === 'pending'
                  ? 'All habits completed for today!'
                  : 'No completed habits yet'}
              </h2>
              <p className="text-xs text-slate-500">
                {filter === 'pending'
                  ? 'Fantastic consistency today. Keep up the great work!'
                  : 'Check off a habit above to mark it done.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <footer className="mt-12 text-center text-xs text-slate-400">
          <p>Data is stored locally in your browser and persists across reloads.</p>
        </footer>
      </main>
    </div>
  );
}
