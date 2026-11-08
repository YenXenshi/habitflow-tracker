# Build notes: HabitFlow

A habit tracker with streaks. Built in Google AI Studio's Build mode (React + Vite + TypeScript). No login, no database, no server. This is project 1 of 5 in my [AI Studio build notes](https://github.com/YenXenshi/ai-studio-build-notes), where the full write-up lives.

This is an independent project, not made or endorsed by Google. Notes are from 2026-11-04 and 2026-11-07.

## What I'm working on here
Seeing how far one plain-language description gets me with no login, database or AI.

## What I tested
- Add a habit, tick it, streak 3 to 4 and progress bar updates.
- Reload keeps everything. Delete with the Confirm step works.
- Fresh clone from GitHub: typecheck and build pass; add, tick and reload persistence work.

## What I ran into
- The Confirm step dismisses itself if you wait, so a slow second click ticked the box instead.
- The sample habits come with fake streak history.

## What I learned
Start simple. A no-login, no-database app built in one shot and gave me a baseline for "working".

## NOT tested
A real phone, streaks across real days, a missed day, and whether a deletion survives a reload.

## Running it
`npm install --legacy-peer-deps`, then `npm run dev`. Plain `npm install` fails with a dependency conflict (tested on Node 22).
