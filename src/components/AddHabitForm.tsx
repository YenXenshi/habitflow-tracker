import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { HABIT_SUGGESTIONS } from '../data/sampleHabits';

interface AddHabitFormProps {
  onAddHabit: (name: string) => void;
}

export const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAddHabit }) => {
  const [habitName, setHabitName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = habitName.trim();
    if (!trimmed) return;
    onAddHabit(trimmed);
    setHabitName('');
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onAddHabit(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="Add a habit (e.g. Drink water)..."
            className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-xs"
            maxLength={60}
          />
        </div>

        <button
          type="submit"
          disabled={!habitName.trim()}
          className="h-12 px-5 rounded-xl bg-slate-900 text-white font-medium text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Suggestion toggler and chips */}
      <div className="mt-2.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowSuggestions((prev) => !prev)}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 py-1"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{showSuggestions ? 'Hide quick suggestions' : 'Quick suggestions'}</span>
          </button>
        </div>

        {showSuggestions && (
          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-100">
            {HABIT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
