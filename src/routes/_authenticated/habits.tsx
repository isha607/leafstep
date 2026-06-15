import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  getStoredHabits,
  isDemoMode,
  setStoredHabits,
} from "@/lib/leafstep-storage";
import { Bike, Recycle, Beef, Plug, ShoppingBag, Flame, Star, TrendingDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/habits")({
  component: HabitsPage,
});

const HABITS = [
  { key: "bike",     label: "Bike or walk",     icon: Bike,        saved: 0.6,  color: "#1d9e75" },
  { key: "recycle",  label: "Recycle waste",     icon: Recycle,     saved: 0.2,  color: "#38bdf8" },
  { key: "meatfree", label: "Meat-free meal",    icon: Beef,        saved: 0.5,  color: "#f59e0b" },
  { key: "unplug",   label: "Unplug devices",    icon: Plug,        saved: 0.1,  color: "#a855f7" },
  { key: "reusable", label: "Reusable bag/cup",  icon: ShoppingBag, saved: 0.15, color: "#e0533d" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

/* Weekly activity ring — shows % of habit×day slots completed */
function WeeklyRing({ pct }: { pct: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color = pct >= 70 ? "#1d9e75" : pct >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-secondary)" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold" style={{ color }}>{Math.round(pct)}%</span>
        <span className="text-[9px] font-semibold text-muted-foreground">this week</span>
      </div>
    </div>
  );
}

function HabitsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const dates = weekDates();
  const [bouncing, setBouncing] = useState<string | null>(null);

  const { data: logs = [] } = useQuery({
    queryKey: ["habits", user?.id, dates[0]],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      if (isDemoMode()) return getStoredHabits(user.id);
      try {
        const { data, error } = await supabase
          .from("habits")
          .select("habit_key, day")
          .eq("user_id", user!.id)
          .gte("day", dates[0])
          .lte("day", dates[6]);
        if (error) throw error;
        return data;
      } catch {
        return getStoredHabits(user.id);
      }
    },
  });

  const logged = new Set(logs.map((l) => `${l.habit_key}|${l.day}`));

  const toggle = useMutation({
    mutationFn: async ({ key, day, on }: { key: string; day: string; on: boolean }) => {
      if (!user) return;
      if (isDemoMode()) {
        const current = getStoredHabits(user.id);
        const next = on
          ? current.filter((l) => !(l.habit_key === key && l.day === day))
          : [...current, { habit_key: key, day }];
        setStoredHabits(user.id, next);
        return;
      }
      try {
        if (on) {
          const { error } = await supabase
            .from("habits")
            .delete()
            .eq("user_id", user!.id)
            .eq("habit_key", key)
            .eq("day", day);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("habits")
            .insert({ user_id: user!.id, habit_key: key, day });
          if (error) throw error;
        }
      } catch {
        const current = getStoredHabits(user.id);
        const next = on
          ? current.filter((l) => !(l.habit_key === key && l.day === day))
          : [...current, { habit_key: key, day }];
        setStoredHabits(user.id, next);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits", user?.id, dates[0]] }),
    onError: () => toast.error("Could not log habit."),
  });

  function handleToggle(key: string, day: string, on: boolean) {
    const id = `${key}|${day}`;
    setBouncing(id);
    setTimeout(() => setBouncing(null), 400);
    if (!on) toast.success("Habit logged! 🌱", { duration: 1500 });
    toggle.mutate({ key, day, on });
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayIdx = dates.indexOf(todayIso);

  const weeklySaved = HABITS.reduce((sum, h) => {
    const count = dates.filter((d) => logged.has(`${h.key}|${d}`)).length;
    return sum + count * h.saved;
  }, 0);

  // streak: consecutive days up to today where at least one habit logged
  let streak = 0;
  for (let i = todayIdx === -1 ? 6 : todayIdx; i >= 0; i--) {
    const any = HABITS.some((h) => logged.has(`${h.key}|${dates[i]}`));
    if (any) streak++;
    else break;
  }

  // Weekly completion %
  const totalSlots = HABITS.length * 7;
  const completedSlots = [...logged].length;
  const weeklyPct = Math.round((completedSlots / totalSlots) * 100);

  // Best habit this week
  const bestHabit = HABITS.reduce((best, h) => {
    const count = dates.filter((d) => logged.has(`${h.key}|${d}`)).length;
    const bestCount = dates.filter((d) => logged.has(`${best.key}|${d}`)).length;
    return count > bestCount ? h : best;
  }, HABITS[0]);
  const bestCount = dates.filter((d) => logged.has(`${bestHabit.key}|${d}`)).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Habits Tracker</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Tap a dot to log a habit for that day.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3 animate-slide-up stagger-1">
        {/* Streak */}
        <div className="ls-card flex items-center gap-4 p-5">
          <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 ${streak >= 3 ? "animate-fire-pulse" : ""}`}>
            <Flame className={`h-6 w-6 ${streak >= 3 ? "text-amber-500" : "text-muted-foreground"}`} />
          </span>
          <div>
            <p className="text-2xl font-extrabold">{streak} day{streak === 1 ? "" : "s"}</p>
            <p className="text-sm text-muted-foreground">Current streak</p>
          </div>
        </div>

        {/* Weekly ring */}
        <div className="ls-card flex items-center gap-4 p-5">
          <WeeklyRing pct={weeklyPct} />
          <div>
            <p className="text-sm font-bold">Weekly activity</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedSlots} of {totalSlots} slots logged
            </p>
          </div>
        </div>

        {/* CO2 saved */}
        <div className="ls-card flex items-center gap-4 p-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground text-sm font-extrabold">
            CO₂
          </span>
          <div>
            <p className="text-2xl font-extrabold">{(weeklySaved * 1000).toFixed(0)} g</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-primary" />
              Saved this week
            </p>
          </div>
        </div>
      </div>

      {/* Best habit insight */}
      {bestCount > 0 && (
        <div className="ls-card flex items-center gap-4 p-4 border-primary/20 bg-primary-soft animate-slide-up stagger-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white">
            <Star className="h-5 w-5 text-amber-500" />
          </span>
          <div>
            <p className="text-sm font-bold text-accent-foreground">
              Best habit this week: <span className="text-primary">{bestHabit.label}</span>
            </p>
            <p className="text-xs text-accent-foreground/70 mt-0.5">
              Logged {bestCount}/{dates.length} days · saves {(bestHabit.saved * 1000 * bestCount).toFixed(0)} g CO₂
            </p>
          </div>
        </div>
      )}

      {/* Habit grid */}
      <section className="ls-card overflow-x-auto p-5 animate-slide-up stagger-3">
        <div className="min-w-[480px]">
          {/* Day headers */}
          <div className="mb-4 grid grid-cols-[1fr_repeat(7,2.5rem)] items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Habit</span>
            {DAYS.map((d, i) => (
              <span
                key={d}
                className={`text-center text-xs font-bold ${
                  i === todayIdx
                    ? "text-primary bg-primary-soft rounded-lg py-1"
                    : "text-muted-foreground"
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Habit rows */}
          <div className="flex flex-col gap-4">
            {HABITS.map((h, hi) => (
              <div
                key={h.key}
                className="grid grid-cols-[1fr_repeat(7,2.5rem)] items-center gap-2 animate-slide-in-left"
                style={{ animationDelay: `${0.3 + hi * 0.06}s` }}
              >
                {/* Label */}
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                    style={{ background: `${h.color}18`, color: h.color }}
                  >
                    <h.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">{h.label}</span>
                </div>

                {/* Day dots */}
                {dates.map((day, i) => {
                  const on = logged.has(`${h.key}|${day}`);
                  const id = `${h.key}|${day}`;
                  return (
                    <button
                      key={day}
                      onClick={() => handleToggle(h.key, day, on)}
                      disabled={!user || toggle.isPending}
                      className={`mx-auto h-8 w-8 rounded-full border-2 transition-all duration-300 disabled:opacity-50 ${
                        bouncing === id ? "dot-bounce" : ""
                      } ${
                        on
                          ? "border-transparent text-white shadow-sm"
                          : i === todayIdx
                          ? "border-primary/40 bg-transparent hover:bg-primary-soft hover:border-primary hover:scale-110"
                          : "border-border bg-transparent hover:border-muted-foreground/40 hover:scale-105"
                      }`}
                      style={on ? { backgroundColor: h.color, boxShadow: `0 0 8px ${h.color}60` } : {}}
                      aria-label={`${h.label} ${day}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly tip */}
      <div className="ls-card p-4 border-l-4 border-l-primary animate-slide-up stagger-5">
        <p className="text-sm font-bold text-foreground">💡 Pro tip</p>
        <p className="text-sm text-muted-foreground mt-1">
          Logging habits in the morning sets a positive intention. Try enabling browser notifications to remind you each day at 8 AM.
        </p>
      </div>
    </div>
  );
}
