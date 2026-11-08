import React from 'react';
import { CheckCircle2, Flame, RotateCcw, Sparkles } from 'lucide-react';
import { formatFriendlyDate } from '../utils/dateUtils';

interface HeaderProps {
  totalHabits: number;
  completedTodayCount: number;
  onResetToSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalHabits,
  completedTodayCount,
  onResetToSample,
}) => {
  const percentage = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;
  const isAllComplete = totalHabits > 0 && completedTodayCount === totalHabits;

  return (
    <header className="pt-6 pb-4">
      {/* Top brand & utilities */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
              HabitFlow
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {formatFriendlyDate()}
            </p>
          </div>
        </div>

        <button
          onClick={onResetToSample}
          type="button"
          title="Reset sample data"
          className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset demo</span>
        </button>
      </div>

      {/* Daily Progress Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Today's Progress
            </span>
            <div className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
              <span>
                {completedTodayCount} of {totalHabits} completed
              </span>
              {isAllComplete && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-emerald-500" /> All done!
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              isAllComplete
                ? 'bg-emerald-500'
                : percentage > 50
                ? 'bg-emerald-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </header>
  );
};
