import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_USER } from "@/lib/demo-user";
import { enableDemoMode } from "@/lib/leafstep-storage";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      return { user: data.session.user };
    }
    if (typeof window !== "undefined") {
      enableDemoMode();
      return { user: DEMO_USER };
    }
    throw redirect({ to: "/auth" });
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
