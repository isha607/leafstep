import type { User } from "@supabase/supabase-js";
import { DEMO_USER_ID } from "./leafstep-storage";

export const DEMO_USER = {
  id: DEMO_USER_ID,
  email: "demo@leafstep.app",
  app_metadata: {},
  user_metadata: { full_name: "Demo User" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
} as User;
