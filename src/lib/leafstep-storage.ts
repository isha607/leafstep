/** Local persistence for demo mode and offline fallback */

export const DEMO_USER_ID = "demo-user-leafstep";
export const DEMO_FLAG = "leafstep_demo";

export interface StoredFootprint {
  transport: number;
  diet: number;
  energy: number;
  shopping: number;
  total: number;
  updatedAt: string;
}

export interface HabitLog {
  habit_key: string;
  day: string;
}

function key(suffix: string, userId: string) {
  return `leafstep_${suffix}_${userId}`;
}

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_FLAG) === "true";
}

export function enableDemoMode() {
  localStorage.setItem(DEMO_FLAG, "true");
}

export function disableDemoMode() {
  localStorage.removeItem(DEMO_FLAG);
}

export function getStoredActions(userId: string): string[] {
  try {
    const raw = localStorage.getItem(key("actions", userId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setStoredActions(userId: string, keys: string[]) {
  localStorage.setItem(key("actions", userId), JSON.stringify(keys));
}

export function getStoredHabits(userId: string): HabitLog[] {
  try {
    const raw = localStorage.getItem(key("habits", userId));
    return raw ? (JSON.parse(raw) as HabitLog[]) : [];
  } catch {
    return [];
  }
}

export function setStoredHabits(userId: string, logs: HabitLog[]) {
  localStorage.setItem(key("habits", userId), JSON.stringify(logs));
}

export function getStoredFootprint(userId: string): StoredFootprint | null {
  try {
    const raw = localStorage.getItem(key("footprint", userId));
    return raw ? (JSON.parse(raw) as StoredFootprint) : null;
  } catch {
    return null;
  }
}

export function setStoredFootprint(userId: string, fp: Omit<StoredFootprint, "updatedAt">) {
  localStorage.setItem(
    key("footprint", userId),
    JSON.stringify({ ...fp, updatedAt: new Date().toISOString() }),
  );
}

export const DEFAULT_FOOTPRINT: StoredFootprint = {
  transport: 3.1,
  diet: 2.4,
  energy: 1.8,
  shopping: 1.3,
  total: 8.6,
  updatedAt: new Date().toISOString(),
};
