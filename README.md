# BiriVibe OS - Technical Documentation

## 1. Vision
BiriVibe OS is a centralized "Life Operating System" designed to aggregate health, habits, productivity, and finance into a single, friction-less dashboard. It uses AI (Douglas) to eliminate the burden of manual logging.

## 2. Technical Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database:** SQLite (local) / Cloudflare D1 (production)
- **ORM:** Prisma
- **AI Engine:** Google Gemini 2.5 Flash Lite
- **Deployment:** Cloudflare Pages

## 3. Data Architecture (Master Schema)
The system is built around a multi-user schema:
- **Rotina:** `Habit` & `HabitLog` (checks and metrics).
- **Performance:** `Workout` & `ExerciseLog` (weight/volume tracking).
- **Vitality:** `SleepLog` & `MoodLog` (energy/quality correlation).
- **Capital:** `Transaction` (quick finance logging).
- **Body:** `BodyMetric` (weight/fat evolution).

## 4. AI Ingestion Engine (The BiriBrain)
Located at `/api/ingest`, the engine takes raw text (The Daily Dump) and:
1. Maps it to existing user activities.
2. Extracts numerical values (counts/weights).
3. Identifies intent (habit completion vs mood check-in).
4. Saves data to specific tables in the database.
5. Returns a sarcastic, personalized commentary (Douglas persona).

## 5. UI/UX Principles
- **OLED Black:** Background #000 for maximum focus and energy saving on mobile.
- **TDAH-Friendly:** Density over whitespace. Minimal clicks. Fast feedback.
- **Terminal Aesthetics:** Monospace fonts and system-like logs for transparency.

## 6. How to Deploy (Planned)
1. Initialize Cloudflare D1.
2. Configure `wrangler.toml`.
3. Set environment variables (GEMINI_API_KEY, NEXTAUTH_SECRET).
4. Run `npx prisma db push` targeting the D1 adapter.

---
*Created: 2026-01-31*
