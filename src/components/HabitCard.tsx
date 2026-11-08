import React, { useState } from 'react';
import { Check, Flame, Trash2, AlertCircle } from 'lucide-react';
import { Habit } from '../types';
import { calculateStreak, getLastNDays, getTodayDateString } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onToggleToday: (habitId: string) => void;
  onToggleDate: (habitId: string, dateStr: string) => void;
  onDelete: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggleToday,
  onToggleDate,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const todayStr = getTodayDateString();
  const streakStats = calculateStreak(habit.completedDates);
  const isDoneToday = streakStats.completedToday;
  const recentDays = getLastNDays(7);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(habit.id);
    } else {
      setConfirmDelete(true);
      // Auto-revert confirmation after 4 seconds
      setTimeout(() => {
        setConfirmDelete(false);
      }, 4000);
    }
  };

  return (
    <div
      className={`relative bg-white border rounded-2xl p-4 transition-all shadow-xs ${
        isDoneToday
          ? 'border-emerald-200/80 bg-emerald-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Main Row */}
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox and Title */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Checkbox for today */}
          <button
            type="button"
            role="checkbox"
            aria-checked={isDoneToday}
            aria-label={`Mark "${habit.name}" as completed for today`}
            onClick={() => onToggleToday(habit.id)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -m-2 cursor-pointer group focus:outline-none"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all ${
                isDoneToday
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs scale-105'
                  : 'bg-white border-slate-300 group-hover:border-slate-400 group-hover:scale-105'
              }`}
            >
              {isDoneToday && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </button>

          {/* Habit Details */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h3
              onClick={() => onToggleToday(habit.id)}
              className={`text-base font-semibold leading-snug cursor-pointer select-none transition-colors truncate ${
                isDoneToday
                  ? 'text-slate-500 line-through decoration-slate-300'
                  : 'text-slate-900'
              }`}
            >
              {habit.name}
            </h3>

            {/* Streak & Status info */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs">
              {/* Streak Counter */}
              <div
                className={`inline-flex items-center gap-1 font-semibold ${
                  streakStats.currentStreak > 0
                    ? 'text-amber-600'
                    : 'text-slate-400'
                }`}
                title={`Best streak: ${streakStats.bestStreak} days`}
              >
                <Flame
                  className={`w-3.5 h-3.5 ${
                    streakStats.currentStreak > 0
                      ? 'fill-amber-500 text-amber-500 animate-pulse'
                      : 'text-slate-300'
                  }`}
                />
                <span className="tabular-nums">
                  {streakStats.currentStreak}{' '}
                  {streakStats.currentStreak === 1 ? 'day' : 'days'}
                </span>
              </div>

              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>

              {/* Status explanation */}
              <span className="text-slate-500">
                {isDoneToday
                  ? 'Completed today'
                  : streakStats.completedYesterday
                  ? 'Streak active · Tap to check in'
                  : 'Pending today'}
              </span>

              {habit.category && (
                <>
                  <span className="text-slate-300" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-slate-400">{habit.category}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <div className="shrink-0 -mr-1 -mt-1">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5 animate-fadeIn">
              <button
                type="button"
                onClick={handleDelete}
                className="min-h-[44px] px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="min-h-[44px] px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Delete habit "${habit.name}"`}
              title="Delete habit"
              onClick={handleDelete}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mini 7-day visual history track */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          Last 7 days
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {recentDays.map((day) => {
            const isCompleted = habit.completedDates.includes(day.dateStr);
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => onToggleDate(habit.id, day.dateStr)}
                title={`${day.dateStr}: ${
                  isCompleted ? 'Completed' : 'Not completed'
                } (Tap to toggle)`}
                className={`flex flex-col items-center justify-center w-6 h-8 sm:w-7 sm:h-9 rounded-md text-[10px] transition-all cursor-pointer ${
                  day.isToday
                    ? 'ring-1 ring-slate-400 font-bold'
                    : 'font-medium'
                } ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <span className="text-[9px] opacity-75">{day.dayLabel}</span>
                <span className="tabular-nums font-semibold leading-none mt-0.5">
                  {day.dayNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
