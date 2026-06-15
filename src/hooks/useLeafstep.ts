import { useEffect, useState } from "react";
import { supabase, FootprintLog, Habit, ActionCompleted } from "../lib/supabase";

// ─── Auth ──────────────────────────────────────────────────────────────────────
export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

// ─── Footprint logs (last 6 months) ───────────────────────────────────────────
export function useFootprintLogs(userId: string | undefined) {
  const [logs, setLogs]       = useState<FootprintLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    supabase
      .from("footprint_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("date", sixMonthsAgo.toISOString().slice(0, 10))
      .order("date", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setLogs(data);
        setLoading(false);
      });
  }, [userId]);

  // Today's total in tonnes
  const todayLog  = logs[logs.length - 1];
  const todayTons = todayLog ? todayLog.total_kg / 1000 : 0;

  // Monthly aggregated for chart
  const monthly = logs.reduce<Record<string, number>>((acc, l) => {
    const month = l.date.slice(0, 7); // "YYYY-MM"
    acc[month] = (acc[month] ?? 0) + l.total_kg / 1000;
    return acc;
  }, {});

  return { logs, loading, todayTons, monthly };
}

// ─── Habits (current week) ────────────────────────────────────────────────────
export function useHabits(userId: string | undefined) {
  const [habits, setHabits]   = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Monday of current week
  const weekStart = (() => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.toISOString().slice(0, 10);
  })();

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("week_start", weekStart)
      .then(({ data, error }) => {
        if (!error && data) setHabits(data);
        setLoading(false);
      });
  }, [userId, weekStart]);

  async function toggleDay(habitId: string, dayIndex: number) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    const newDays = [...habit.days_completed];
    newDays[dayIndex] = !newDays[dayIndex];
    const streak = newDays.filter(Boolean).length;

    const { data, error } = await supabase
      .from("habits")
      .update({ days_completed: newDays, streak_days: streak })
      .eq("id", habitId)
      .select()
      .single();

    if (!error && data) {
      setHabits(prev => prev.map(h => h.id === habitId ? data : h));
    }
  }

  async function createDefaultHabits() {
    if (!userId) return;
    const defaults = [
      "Walk/cycle to work",
      "Vegetarian meal",
      "No single-use plastic",
      "Hang dry clothes",
      "Reusable bag shopping",
    ];
    const rows = defaults.map(name => ({
      user_id: userId,
      week_start: weekStart,
      habit_name: name,
      days_completed: [false,false,false,false,false,false,false],
      streak_days: 0,
    }));
    const { data, error } = await supabase.from("habits").insert(rows).select();
    if (!error && data) setHabits(data);
  }

  return { habits, loading, toggleDay, createDefaultHabits, weekStart };
}

// ─── Actions completed ─────────────────────────────────────────────────────────
export function useActions(userId: string | undefined) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("actions_completed")
      .select("action_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (data) setCompleted(new Set(data.map((r: ActionCompleted) => r.action_id)));
      });
  }, [userId]);

  async function toggleAction(actionId: string) {
    if (!userId) return;
    if (completed.has(actionId)) {
      await supabase.from("actions_completed").delete().eq("user_id", userId).eq("action_id", actionId);
      setCompleted(prev => { const n = new Set(prev); n.delete(actionId); return n; });
    } else {
      await supabase.from("actions_completed").insert({ user_id: userId, action_id: actionId });
      setCompleted(prev => new Set([...prev, actionId]));
    }
  }

  return { completed, toggleAction };
}

// ─── Log today's footprint ─────────────────────────────────────────────────────
export async function logFootprint(userId: string, data: {
  transport_kg: number; diet_kg: number; energy_kg: number; shopping_kg: number;
}) {
  const total_kg = data.transport_kg + data.diet_kg + data.energy_kg + data.shopping_kg;
  const today = new Date().toISOString().slice(0, 10);

  return supabase.from("footprint_logs").upsert({
    user_id: userId, date: today, ...data, total_kg,
  }, { onConflict: "user_id,date" });
}
