import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_USER } from "@/lib/demo-user";
import { isDemoMode } from "@/lib/leafstep-storage";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const demoActive = isDemoMode();
    setDemo(demoActive);

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s?.user) {
        setSession(s);
        setUser(s.user);
        setDemo(false);
      } else if (isDemoMode()) {
        setSession(null);
        setUser(DEMO_USER);
        setDemo(true);
      } else {
        setSession(null);
        setUser(null);
        setDemo(false);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setSession(data.session);
        setUser(data.session.user);
        setDemo(false);
      } else if (isDemoMode()) {
        setUser(DEMO_USER);
        setDemo(true);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, loading, isDemo: demo };
}
