# 🌿 Leafstep — Track & Shrink Your Carbon Footprint

Leafstep helps individuals understand, track, and reduce their environmental impact through simple actions and personalized insights — no climate science degree required.

**Live app:** [https://leafstep-production.up.railway.app](https://leafstep-production.up.railway.app)

> Understand · Track · Reduce

---

## How it works

Three simple steps from awareness to action:

1. **Calculate** — Estimate your footprint in 4 quick steps
2. **Act** — Pick personalized actions that fit your life
3. **Track** — Log habits and watch your score improve

---

## Features

**Understand your impact**
A guided carbon calculator breaks down transport, diet, energy, and shopping into clear annual CO2 totals — with India-specific emission factors.

**Animated city dashboard**
A canvas-based skyline that visually responds to your commute choice. Pick car, bus, bike, walk, or EV and watch the smog clear (or thicken) in real time, alongside AQI, CO2-per-trip, and money saved.

**Simple, high-impact actions**
Personalized recommendations ranked by CO2 savings — from meat-free days to switching to LED bulbs — plus a carbon offset marketplace (tree planting, solar kits, biogas, clean water access).

**Build lasting habits**
Track daily eco habits with streaks, weekly progress, and visible CO2 avoided.

**Live air quality**
Real-time AQI for Indian cities via the WAQI API, with health guidance based on pollution level.

**Try before you sign up**
A no-account demo mode lets anyone explore the full dashboard before creating an account.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS 4 |
| Routing | TanStack Router (file-based, SSR via TanStack Start) |
| Data fetching | TanStack Query |
| Backend | Supabase (Auth, Postgres, Row Level Security) |
| Charts | Recharts |
| Icons | Lucide React |
| Hosting | Railway (Node.js server, Nitro node-server preset) |
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
│   ├── auth.tsx                    # Sign in / sign up (Google OAuth + email + demo)
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

Deployed on **Railway** using the Nitro `node-server` preset — TanStack Start's SSR output runs as a standard Node process.

Key config files:
- `railway.json` — build/start commands and Node 20 runtime
- `.nvmrc` — pins Node version for the build environment
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

Free forever · No credit card required · Works on mobile

© 2026 Leafstep · Built for a cooler planet 🌱