import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Car, Bus, Bike, Footprints, Target } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

type Mode = "car" | "bus" | "bike" | "walk";

const MODES: { key: Mode; label: string; icon: typeof Car; smog: number }[] = [
  { key: "car", label: "Car", icon: Car, smog: 1 },
  { key: "bus", label: "Transit", icon: Bus, smog: 0.55 },
  { key: "bike", label: "Bike", icon: Bike, smog: 0.18 },
  { key: "walk", label: "Walk", icon: Footprints, smog: 0 },
];

const CATEGORIES = [
  { label: "Transport", value: 3.1, max: 5, color: "var(--color-chart-1)" },
  { label: "Diet", value: 2.4, max: 5, color: "var(--color-chart-2)" },
  { label: "Home Energy", value: 1.8, max: 5, color: "var(--color-chart-3)" },
  { label: "Shopping", value: 1.3, max: 5, color: "var(--color-chart-4)" },
];

const TREND = [
  { month: "Jan", co2: 11.2 },
  { month: "Feb", co2: 10.6 },
  { month: "Mar", co2: 10.9 },
  { month: "Apr", co2: 9.7 },
  { month: "May", co2: 9.1 },
  { month: "Jun", co2: 8.6 },
];

function Dashboard() {
  const [mode, setMode] = useState<Mode>("car");
  const smog = MODES.find((m) => m.key === mode)!.smog;

  const total = useMemo(
    () => CATEGORIES.reduce((s, c) => s + c.value, 0),
    [],
  );
  // score: lower footprint => higher score. Baseline 16t = 0, 0t = 100
  const score = Math.round(Math.max(0, Math.min(100, (1 - total / 16) * 100)));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Your Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Pick how you commute and watch the city breathe.
        </p>
      </div>

      {/* Hero skyline */}
      <section className="ls-card overflow-hidden border-none bg-navy text-navy-foreground">
        <div className="relative">
          <Skyline smog={smog} />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 lg:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-foreground/50">
                Air quality if everyone commutes by
              </p>
              <p className="text-2xl font-extrabold capitalize lg:text-3xl">
                {MODES.find((m) => m.key === mode)!.label}
              </p>
            </div>
            <div className="flex gap-2">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    mode === m.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/10 text-navy-foreground/80 hover:bg-white/20"
                  }`}
                >
                  <m.icon className="h-5 w-5" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score ring */}
        <section className="ls-card flex flex-col items-center justify-center gap-3 p-6">
          <h2 className="self-start text-sm font-bold text-muted-foreground">CO₂ Score</h2>
          <ScoreRing score={score} />
          <p className="text-center text-sm text-muted-foreground">
            Est. <span className="font-bold text-foreground">{total.toFixed(1)}t</span> CO₂ / year
          </p>
        </section>

        {/* Category breakdown */}
        <section className="ls-card flex flex-col gap-4 p-6 lg:col-span-2">
          <h2 className="text-sm font-bold text-muted-foreground">Category Breakdown</h2>
          <div className="flex flex-col gap-4">
            {CATEGORIES.map((c) => (
              <div key={c.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-semibold">{c.label}</span>
                  <span className="text-muted-foreground">{c.value.toFixed(1)}t</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(c.value / c.max) * 100}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend */}
        <section className="ls-card flex flex-col gap-4 p-6 lg:col-span-2">
          <div>
            <h2 className="text-sm font-bold text-muted-foreground">6-Month Trend</h2>
            <p className="text-xs text-muted-foreground">Monthly footprint, trending down 23%</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    fontSize: 13,
                  }}
                  formatter={(v: number) => [`${v}t CO₂`, "Footprint"]}
                />
                <Line
                  type="monotone"
                  dataKey="co2"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--color-primary)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Goal */}
        <section className="ls-card flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-muted-foreground">2026 Goal</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Cut your annual footprint to <span className="font-bold text-foreground">7.0t</span>
          </p>
          <GoalProgress current={total} start={11.2} goal={7.0} />
        </section>
      </div>
    </div>
  );
}

function Skyline({ smog }: { smog: number }) {
  return (
    <svg viewBox="0 0 800 320" className="h-56 w-full lg:h-72" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e1a" />
          <stop offset="100%" stopColor="#13203a" />
        </linearGradient>
        <linearGradient id="smog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a8c5e" stopOpacity="0" />
          <stop offset="100%" stopColor="#b6a36a" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#sky)" />

      {/* sun / moon glow that brightens as smog clears */}
      <circle cx="640" cy="80" r="42" fill="#1d9e75" opacity={0.15 + (1 - smog) * 0.5} />
      <circle cx="640" cy="80" r="24" fill="#7be0bd" opacity={0.3 + (1 - smog) * 0.6} />

      {/* buildings */}
      <g fill="#1c2840">
        <rect x="20" y="190" width="60" height="130" rx="3" />
        <rect x="95" y="150" width="50" height="170" rx="3" />
        <rect x="160" y="210" width="55" height="110" rx="3" />
        <rect x="230" y="120" width="58" height="200" rx="3" />
        <rect x="305" y="170" width="48" height="150" rx="3" />
        <rect x="370" y="95" width="62" height="225" rx="3" />
        <rect x="450" y="160" width="52" height="160" rx="3" />
        <rect x="520" y="200" width="56" height="120" rx="3" />
        <rect x="592" y="140" width="50" height="180" rx="3" />
        <rect x="660" y="185" width="58" height="135" rx="3" />
        <rect x="730" y="160" width="50" height="160" rx="3" />
      </g>
      {/* windows light up as air clears */}
      <g fill="#7be0bd" opacity={0.25 + (1 - smog) * 0.7}>
        {[
          [38, 210], [58, 210], [38, 240], [58, 270],
          [110, 170], [128, 170], [110, 200], [128, 230],
          [248, 145], [268, 145], [248, 180], [268, 215], [248, 250],
          [388, 120], [410, 120], [388, 160], [410, 200], [388, 240],
          [608, 165], [626, 165], [608, 205], [626, 245],
          [678, 210], [696, 210], [678, 250],
          [746, 185], [764, 185], [746, 225],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="9" height="12" rx="1.5" />
        ))}
      </g>

      {/* drifting clouds of smog */}
      <g opacity={smog} style={{ animation: "float-cloud 9s ease-in-out infinite" }}>
        <ellipse cx="200" cy="110" rx="120" ry="34" fill="#8a7c54" opacity="0.5" />
        <ellipse cx="520" cy="80" rx="150" ry="40" fill="#8a7c54" opacity="0.45" />
      </g>

      {/* ground smog haze */}
      <rect x="0" y="120" width="800" height="200" fill="url(#smog)" opacity={smog} />
    </svg>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--color-secondary)" strokeWidth="14" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold">{score}</span>
        <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function GoalProgress({ current, start, goal }: { current: number; start: number; goal: number }) {
  const pct = Math.max(0, Math.min(100, ((start - current) / (start - goal)) * 100));
  return (
    <div className="mt-auto flex flex-col gap-2">
      <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{Math.round(pct)}% to goal</span>
        <span>{current.toFixed(1)}t / {goal.toFixed(1)}t</span>
      </div>
    </div>
  );
}
