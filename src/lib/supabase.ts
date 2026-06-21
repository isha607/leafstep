import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL) as string;
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY
) as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types matching your Supabase tables ─────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  annual_goal_tonnes: number;
  created_at: string;
}

export interface FootprintLog {
  id: string;
  user_id: string;
  date: string;            // ISO date "YYYY-MM-DD"
  transport_kg: number;
  diet_kg: number;
  energy_kg: number;
  shopping_kg: number;
  total_kg: number;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  week_start: string;      // ISO date of Monday
  habit_name: string;
  days_completed: boolean[]; // [Mon,Tue,Wed,Thu,Fri,Sat,Sun]
  streak_days: number;
  created_at: string;
}

export interface ActionCompleted {
  id: string;
  user_id: string;
  action_id: string;
  completed_at: string;
}
