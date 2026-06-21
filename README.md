# 🌿 Leafstep — Carbon Footprint Tracker

A personal carbon footprint tracker built for individuals to understand, track, and reduce their environmental impact through simple actions and personalized insights.

**Live app:** [https://leafstep-production.up.railway.app](https://leafstep-production.up.railway.app)

---

## What it does

Leafstep helps people answer one question: *how much CO₂ am I actually responsible for, and what can I do about it?*

- **Carbon Calculator** — a 4-step questionnaire covering transport, diet, home energy, and shopping habits that estimates annual CO₂ emissions in tonnes
- **Dashboard** — an animated city skyline that visually responds to your commute choice (car, bus, bike, walk, EV), showing smog clear up as you choose greener transport, alongside a CO₂ score ring, category breakdown, and 6-month trend
- **Actions** — ranked, high-impact recommendations tailored to the user's footprint, plus a carbon offset marketplace (tree planting, solar kits, biogas, clean water access)
- **Habits Tracker** — a weekly habit grid for logging daily eco-actions, with streaks and CO₂ saved
- **Live Air Quality** — real-time AQI data for Indian cities via the WAQI API, with health guidance based on pollution level

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS 4 |
| Routing | TanStack Router (file-based, with SSR via TanStack Start) |
| Data fetching | TanStack Query |
| Backend | Supabase (Auth, Postgres, Row Level Security) |
| Charts | Recharts |
| Icons | Lucide React |
| Hosting | Railway (Node.js server) |
| Live data | WAQI (World Air Quality Index) API |

---

## Project structure

```
src/
├── components/
│   ├── hero/AnimatedCityHero.tsx   # Canvas-based animated skyline + smog system
│   ├── AirQualityWidget.tsx        # Live AQI widget with India city presets
│   ├── CarbonCalculator.tsx        # 4-step footprint calculator
│   ├── InsightBanner.tsx           # Rotating personalized insight cards
│   └── AppShell.tsx                # Navigation shell (sidebar + mobile nav)
├── routes/
│   ├── auth.tsx                    # Sign in / sign up (Google OAuth + email)
│   └── _authenticated/
│       ├── route.tsx                # Auth guard
│       ├── dashboard.tsx            # Main dashboard (empty state + full view)
│       ├── calculator.tsx           # Standalone calculator page
│       ├── actions.tsx              # Action recommendations + offsets
│       └── habits.tsx               # Habit tracker
├── hooks/use-auth.ts                # Supabase auth state hook
├── integrations/supabase/           # Supabase client (browser + server)
└── lib/leafstep-storage.ts          # LocalStorage fallback for demo mode
```

---

## Local development

```bash
git clone https://github.com/isha607/leafstep.git
cd leafstep
npm install
```

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_WAQI_TOKEN=your-waqi-token
```

Get a free WAQI token at [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token).

Run the dev server:

```bash
npm run dev
```

---

## Database schema

Run `supabase-schema.sql` in the Supabase SQL Editor to create the required tables: `profiles`, `footprint_logs`, `habits`, `actions_completed` — all with Row Level Security enabled so users can only access their own data.

---

## Deployment

Deployed on **Railway** using the Nitro `node-server` preset (TanStack Start's SSR output runs as a standard Node process rather than a serverless function).

Key config files:
- `railway.json` — build/start commands and Node 20 runtime
- `vite.config.ts` — Nitro preset configuration

Required environment variables on the host:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_WAQI_TOKEN
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

## Roadmap

- Community leaderboard and group challenges
- Push notifications for habit reminders
- Shareable carbon "report card"
- Employer/school group accounts

---

## Built with

Scaffolded in [Lovable](https://lovable.dev), customized in VS Code, and deployed on [Railway](https://railway.app).
