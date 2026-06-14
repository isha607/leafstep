import { type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Sparkles, CalendarCheck, Users, Leaf, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/actions", label: "Actions", icon: Sparkles },
  { to: "/habits", label: "Habits", icon: CalendarCheck },
  { to: "/community", label: "Community", icon: Users },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card px-4 py-6">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 pb-8">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">Leafstep</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-primary-soft text-accent-foreground" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary"
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={signOut}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </aside>

      <div className="flex-1 lg:pl-64">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-extrabold">Leafstep</span>
          </Link>
          <button onClick={signOut} className="text-muted-foreground">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 lg:px-8 lg:py-8">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-card lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-primary" }}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
