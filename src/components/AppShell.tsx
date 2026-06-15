import { type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Sparkles, CalendarCheck, Users, Leaf, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { disableDemoMode } from "@/lib/leafstep-storage";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/actions",   label: "Actions",   icon: Sparkles },
  { to: "/habits",    label: "Habits",    icon: CalendarCheck },
  { to: "/community", label: "Community", icon: Users },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const { isDemo } = useAuth();
  const currentPath = routerState.location.pathname;

  async function signOut() {
    disableDemoMode();
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card px-4 py-6 z-30">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 px-2 pb-8 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground animate-leaf-spin">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">Leafstep</span>
        </Link>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const isActive = currentPath === item.to || currentPath.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary-soft text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary group-hover:bg-primary-soft"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="flex flex-col gap-2 border-t border-border pt-4 mt-2">
          {/* Eco tip */}
          <div className="rounded-xl bg-primary-soft px-3 py-2.5 mb-1">
            <p className="text-[11px] font-bold text-accent-foreground">🌱 Daily tip</p>
            <p className="text-[11px] text-accent-foreground/70 mt-0.5 leading-relaxed">
              Unplug chargers when not in use — standby power adds up to 10% of your electricity bill.
            </p>
          </div>

          <button
            onClick={signOut}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary">
              <LogOut className="h-4 w-4" />
            </span>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────── */}
      <div className="flex-1 lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 py-3 lg:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground animate-leaf-spin">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-extrabold tracking-tight">Leafstep</span>
          </Link>
          <button
            onClick={signOut}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 lg:px-8 lg:py-8">
          {isDemo && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary-soft px-4 py-2.5 animate-slide-up">
              <p className="text-xs font-semibold text-accent-foreground">
                🌱 Demo mode — data saved locally on this device
              </p>
              <Link
                to="/auth"
                className="shrink-0 text-xs font-bold text-primary hover:underline"
              >
                Create account
              </Link>
            </div>
          )}
          {children}
        </main>

        {/* ── Mobile bottom nav ──────────────────────────── */}
        <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
          <div className="flex">
            {NAV.map((item) => {
              const isActive = currentPath === item.to || currentPath.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-all duration-200 relative",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <span className="absolute top-0 inset-x-3 h-0.5 rounded-b-full bg-primary animate-scale-in" />
                  )}
                  {/* Icon pill */}
                  <span
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-xl transition-all duration-200",
                      isActive ? "bg-primary-soft scale-110" : "scale-100"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
