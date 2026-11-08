import { Habit } from '../types';
import { getOffsetDateString, getTodayDateString } from '../utils/dateUtils';

export function getSampleHabits(): Habit[] {
  const today = getTodayDateString();
  const day1 = getOffsetDateString(-1);
  const day2 = getOffsetDateString(-2);
  const day3 = getOffsetDateString(-3);
  const day4 = getOffsetDateString(-4);
  const day5 = getOffsetDateString(-5);
  const day6 = getOffsetDateString(-6);

  return [
    {
      id: 'sample-1',
      name: 'Drink 8 glasses of water',
      createdAt: getOffsetDateString(-30),
      category: 'Health',
      color: 'sky',
      completedDates: [day6, day5, day4, day3, day2, day1, today], // 7-day streak, completed today
    },
    {
      id: 'sample-2',
      name: '15-minute brisk walk',
      createdAt: getOffsetDateString(-20),
      category: 'Fitness',
      color: 'emerald',
      completedDates: [day3, day2, day1], // 3-day streak from yesterday, pending today!
    },
    {
      id: 'sample-3',
      name: 'Read 10 pages of a book',
      createdAt: getOffsetDateString(-15),
      category: 'Mindset',
      color: 'violet',
      completedDates: [day4, day3, day2, day1, today], // 5-day streak, completed today
    },
    {
      id: 'sample-4',
      name: 'Floss teeth before bed',
      createdAt: getOffsetDateString(-10),
      category: 'Routine',
      color: 'amber',
      completedDates: [day3], // Missed yesterday and today, streak is 0
    },
  ];
}

export const HABIT_SUGGESTIONS = [
  'Drink 8 glasses of water',
  'Morning 10-minute stretch',
  'Read 10 pages',
  'Take daily vitamins',
  'Walk 5,000 steps',
  'Meditate for 5 minutes',
  'Write in gratitude journal',
  'No screens after 10 PM',
  'Floss teeth',
  'Eat a serving of fruit',
];
