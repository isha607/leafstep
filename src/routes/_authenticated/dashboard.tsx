import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, XAxis, YAxis, Tooltip,
  CartesianGrid, Area, AreaChart,
} from "recharts";
import {
  Target, Calculator, ChevronDown, ChevronUp,
  Sparkles, TrendingDown, Award, Leaf, ArrowRight,
} from "lucide-react";
import AnimatedCityHero, { type TransportMode } from "@/components/hero/AnimatedCityHero";
import { CarbonCalculator } from "@/components/CarbonCalculator";
import { InsightBanner } from "@/components/InsightBanner";
import { AirQualityWidget } from "@/components/AirQualityWidget";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_FOOTPRINT, getStoredFootprint, getStoredActions,
  getStoredHabits, isDemoMode, setStoredFootprint, type StoredFootprint,
} from "@/lib/leafstep-storage";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const CATEGORIES_META = [
  { key: "transport" as const, label: "Transport",   color: "#ef4444", max: 5 },
  { key: "diet"      as const, label: "Diet",        color: "#f59e0b", max: 5 },
  { key: "energy"    as const, label: "Home Energy", color: "#3b82f6", max: 5 },
  { key: "shopping"  as const, label: "Shopping",    color: "#a855f7", max: 5 },
];

const GOAL_TONNES = 7.0;

const EMPTY_FEATURES = [
  { icon: "📊", title: "Track your footprint",  desc: "See exactly where your CO₂ comes from." },
  { icon: "⚡", title: "Get personal actions",   desc: "Recommendations based on YOUR lifestyle." },
  { icon: "📅", title: "Build green habits",     desc: "Log habits and watch your footprint shrink." },
  { icon: "👥", title: "Community challenges",   desc: "Join thousands of Indians going green." },
];

function buildTrend(total: number) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  if (total === 0) return months.map((month) => ({ month, co2: 0 }));
  return months.map((month, i) => ({
    month,
    co2: +(total + (months.length - 1 - i) * 0.45).toFixed(1),
  }));
}

function weekDates(): string[] {
  const now = new Date();
  const dow = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function computeStreak(dates: string[], logged: Set<string>): number {
  const todayIso = new Date().toISOString().slice(0, 10);
  const todayIdx = dates.indexOf(todayIso);
  const habitKeys = ["bike", "recycle", "meatfree", "unplug", "reusable"];
  let streak = 0;
  for (let i = todayIdx === -1 ? 6 : todayIdx; i >= 0; i--) {
    const any = habitKeys.some((k) => logged.has(`${k}|${dates[i]}`));
    if (any) streak++;
    else break;
  }
  return streak;
}

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    function step(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal((target) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

function ScoreRing({ score }: { score: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const animatedScore = useCountUp(score);
  const color = score >= 70 ? "var(--color-primary)" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--color-secondary)" strokeWidth="14" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="14"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1), stroke 0.5s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold" style={{ color }}>{Math.round(animatedScore)}</span>
        <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Eco Score</span>
      </div>
    </div>
  );
}

function GoalProgress({ current, start, goal }: { current: number; start: number; goal: number }) {
  const pct = Math.max(0, Math.min(100, ((start - current) / (start - goal)) * 100));
  return (
    <div className="mt-auto flex flex-col gap-2">
      <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="font-semibold text-primary">{Math.round(pct)}% to goal</span>
        <span>{current.toFixed(1)}t / {goal.toFixed(1)}t</span>
      </div>
    </div>
  );
}

function StatBadge({ label, value, icon: Icon, color }: {
  label: string; value: string; icon: typeof Target; color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 animate-slide-up">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: `${color}20`, color }}>
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-extrabold">{value}</p>
      </div>
    </div>
  );
}

// ── Empty state shown when user has no footprint data ──────────────────────────
function EmptyState({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Hero */}
      <div className="ls-card relative overflow-hidden p-8 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #1d9e75, transparent 70%)" }} />
        </div>
        <div className="relative">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary/20 border border-primary/30">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
            Welcome to Leafstep 🌱
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your personal carbon footprint tracker. Find out how much CO₂ you produce
            and get a step-by-step plan to reduce it.
          </p>
          <button
            onClick={onGetStarted}
            className="btn-glow mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg hover:scale-105 transition-all"
          >
            <Calculator className="h-5 w-5" />
            Calculate My Carbon Footprint
          </button>
          <p className="mt-3 text-xs text-muted-foreground">Takes 2 minutes • Free forever</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { val: "10t",  lbl: "Global avg CO₂/person" },
          { val: "1.9t", lbl: "India avg CO₂/person"  },
          { val: "0.5t", lbl: "Climate target 2050"   },
        ].map(s => (
          <div key={s.lbl} className="ls-card p-4 text-center">
            <div className="text-xl font-extrabold text-primary">{s.val}</div>
            <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="ls-card p-6">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">What you'll get</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {EMPTY_FEATURES.map(f => (
            <div key={f.title} className="flex gap-3">
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="ls-card p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div>
          <div className="font-bold text-sm">Ready to see your footprint?</div>
          <div className="text-xs text-muted-foreground mt-0.5">Join thousands of Indians tracking their impact 🇮🇳</div>
        </div>
        <button
          onClick={onGetStarted}
          className="btn-glow flex-shrink-0 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          Get Started <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* City hero still visible */}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
function Dashboard() {
  const { user } = useAuth();
  const [mode, setMode] = useState<TransportMode>("car");
  const [showCalc, setShowCalc] = useState(false);
  const [footprint, setFootprint] = useState<StoredFootprint>(() =>
    user ? getStoredFootprint(user.id) ?? DEFAULT_FOOTPRINT : DEFAULT_FOOTPRINT,
  );

  useEffect(() => {
    if (user) setFootprint(getStoredFootprint(user.id) ?? DEFAULT_FOOTPRINT);
  }, [user?.id]);

  const hasData = footprint.total > 0;

  const { data: completedActions = [] } = useQuery({
    queryKey: ["actions_completed", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      if (isDemoMode()) return getStoredActions(user.id);
      try {
        const { data, error } = await supabase.from("actions_completed").select("action_key").eq("user_id", user.id);
        if (error) throw error;
        return data.map((r) => r.action_key);
      } catch { return getStoredActions(user.id); }
    },
  });

  const dates = weekDates();
  const { data: habitLogs = [] } = useQuery({
    queryKey: ["habits", user?.id, dates[0]],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      if (isDemoMode()) return getStoredHabits(user.id);
      try {
        const { data, error } = await supabase.from("habits").select("habit_key, day")
          .eq("user_id", user.id).gte("day", dates[0]).lte("day", dates[6]);
        if (error) throw error;
        return data;
      } catch { return getStoredHabits(user.id); }
    },
  });

  const loggedHabits = new Set(habitLogs.map((l) => `${l.habit_key}|${l.day}`));
  const streak = computeStreak(dates, loggedHabits);
  const weeklySavedKg = habitLogs.length * 120;

  const categories = useMemo(() =>
    CATEGORIES_META.map((c) => ({ ...c, value: footprint[c.key] })),
    [footprint],
  );

  const total = footprint.total;
  const score = total > 0 ? Math.round(Math.max(0, Math.min(100, (1 - total / 16) * 100))) : 0;
  const topCat = categories.reduce((a, b) => (a.value > b.value ? a : b)).label;
  const trend = useMemo(() => buildTrend(total), [total]);
  const trendChange = total > 0
    ? Math.round(((trend[0].co2 - trend[trend.length - 1].co2) / trend[0].co2) * 100)
    : 0;

  function handleCalcComplete(result: { transport: number; diet: number; energy: number; shopping: number; total: number }) {
    if (!user) return;
    setStoredFootprint(user.id, result);
    setFootprint({ ...result, updatedAt: new Date().toISOString() });
    setShowCalc(false);
    toast.success("Footprint saved to your dashboard! 🌱");
  }

  // ── If no data → show empty state ─────────────────────────────────────────
  if (!hasData && !showCalc) {
    return <EmptyState onGetStarted={() => setShowCalc(true)} />;
  }

  // ── Calculator open fullscreen ─────────────────────────────────────────────
  if (showCalc) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between animate-slide-up">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Carbon Calculator</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Tell us about your lifestyle</p>
          </div>
          {hasData && (
            <button
              onClick={() => setShowCalc(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
            >
              ← Back to Dashboard
            </button>
          )}
        </div>
        <CarbonCalculator onClose={hasData ? () => setShowCalc(false) : undefined} onComplete={handleCalcComplete} />
      </div>
    );
  }

  // ── Full dashboard (has data) ──────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Your Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Pick how you commute and watch the city breathe.</p>
          </div>
          <button
            onClick={() => setShowCalc(true)}
            className="btn-glow hidden sm:flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
          >
            <Calculator className="h-4 w-4" />
            Recalculate
          </button>
        </div>
      </div>

      {/* Insight banner */}
      <div className="relative animate-slide-up stagger-1">
        <InsightBanner
          totalTons={total} topCategory={topCat}
          actionsCompleted={completedActions.length} totalActions={6}
          streak={streak} weeklySavedKg={weeklySavedKg}
        />
      </div>

      {/* Mobile recalc button */}
      <button
        onClick={() => setShowCalc(true)}
        className="btn-glow flex sm:hidden items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground animate-slide-up stagger-1"
      >
        <Calculator className="h-4 w-4" />
        Recalculate My Footprint
      </button>

      {/* Animated city hero */}
      <section className="animate-slide-up stagger-2">
        <AnimatedCityHero mode={mode} onModeChange={setMode} />
      </section>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-slide-up stagger-2">
        <StatBadge label="Total CO₂ / year" value={`${total.toFixed(1)}t`}    icon={Target}      color="#1d9e75" />
        <StatBadge label="vs Last Month"    value={`-${trendChange}% 📉`}      icon={TrendingDown} color="#3b82f6" />
        <StatBadge label="Eco Score"        value={`${score} / 100`}           icon={Award}       color="#a855f7" />
        <StatBadge label="Top Emitter"      value={topCat}                     icon={Sparkles}    color="#f59e0b" />
      </div>

      {/* Score ring + category breakdown */}
      <div className="grid gap-6 lg:grid-cols-3 animate-slide-up stagger-3">
        <section className="ls-card flex flex-col items-center justify-center gap-3 p-6">
          <h2 className="self-start text-sm font-bold text-muted-foreground">CO₂ Score</h2>
          <ScoreRing score={score} />
          <p className="text-center text-sm text-muted-foreground">
            Est. <span className="font-bold text-foreground">{total.toFixed(1)}t</span> CO₂ / year
          </p>
          <Link to="/actions"
            className="btn-glow w-full rounded-xl bg-primary-soft py-2 text-center text-xs font-bold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
            See recommended actions →
          </Link>
        </section>

        <section className="ls-card flex flex-col gap-4 p-6 lg:col-span-2">
          <h2 className="text-sm font-bold text-muted-foreground">Category Breakdown</h2>
          <div className="flex flex-col gap-4">
            {categories.map((c, i) => (
              <div key={c.label} className="animate-slide-up" style={{ animationDelay: `${0.35 + i * 0.07}s` }}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-semibold flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.label}
                  </span>
                  <span className="text-muted-foreground">{c.value.toFixed(1)}t</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full progress-fill"
                    style={{ width: `${(c.value / c.max) * 100}%`, backgroundColor: c.color, animationDelay: `${0.4 + i * 0.1}s` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted-foreground border-t border-border pt-3">
            💡 <b>Tip:</b> Your <b>{topCat}</b> emissions are highest. Explore targeted actions to reduce them.
          </p>
        </section>
      </div>

      {/* Trend + Goal */}
      <div className="grid gap-6 lg:grid-cols-3 animate-slide-up stagger-4">
        <section className="ls-card flex flex-col gap-4 p-6 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-muted-foreground">6-Month Trend</h2>
              <p className="text-xs text-muted-foreground">Monthly footprint</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-accent-foreground">
              <TrendingDown className="h-3 w-3" />↓ {trendChange}% improvement
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 13 }}
                  formatter={(v: number) => [`${v}t CO₂`, "Footprint"]}
                />
                <Area type="monotone" dataKey="co2" stroke="var(--color-primary)" strokeWidth={3}
                  fill="url(#co2Gradient)"
                  dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "var(--color-primary)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="ls-card flex flex-col gap-4 p-6 flex-1">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-muted-foreground">2026 Goal</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Cut your annual footprint to <span className="font-bold text-foreground">{GOAL_TONNES.toFixed(1)}t</span>
            </p>
            <GoalProgress current={total} start={trend[0].co2} goal={GOAL_TONNES} />
            <div className="mt-auto rounded-xl bg-primary-soft p-3">
              <p className="text-xs font-semibold text-accent-foreground">
                🌱 At your current pace, you'll hit your goal by <b>September 2026</b>. You're {trendChange}% of the way there!
              </p>
            </div>
            <Link to="/habits"
              className="btn-glow rounded-xl border border-primary py-2.5 text-center text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground mt-4">
              Build daily habits →
            </Link>
          </section>
          <AirQualityWidget />
        </div>
      </div>
    </div>
  );
}
