import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Leaf, TrendingDown, Flame, ChevronRight, X } from "lucide-react";

interface Insight {
  id: string;
  icon: typeof Leaf;
  iconColor: string;
  iconBg: string;
  headline: string;
  body: string;
  cta?: string;
  ctaTo?: "/actions" | "/habits" | "/dashboard" | "/calculator";
}

interface InsightBannerProps {
  totalTons?: number;
  streak?: number;
  topCategory?: string;
  actionsCompleted?: number;
  totalActions?: number;
  weeklySavedKg?: number;
}

function getInsights({ totalTons = 0, streak = 0, topCategory = "Transport", actionsCompleted = 0, totalActions = 6, weeklySavedKg = 0 }: InsightBannerProps): Insight[] {
  const list: Insight[] = [];
  if (totalTons === 0) {
    list.push({ id: "no-data", icon: Leaf, iconColor: "text-primary", iconBg: "bg-primary-soft", headline: "Calculate your footprint to get started!", body: "Answer 4 quick questions to see your personal CO2 breakdown and get actionable tips.", cta: "Calculate now", ctaTo: "/calculator" });
    return list;
  }
  if (totalTons > 7) {
    list.push({ id: "footprint-high", icon: TrendingDown, iconColor: "text-rose-400", iconBg: "bg-secondary", headline: `Your ${topCategory} emissions are your biggest opportunity`, body: `At ${totalTons.toFixed(1)}t/year you're above the 7t target. Small ${topCategory.toLowerCase()} changes can make a big dent.`, cta: "See actions", ctaTo: "/actions" });
  } else {
    list.push({ id: "footprint-good", icon: Leaf, iconColor: "text-primary", iconBg: "bg-primary-soft", headline: "You're tracking below the climate target!", body: `${totalTons.toFixed(1)}t/year is under the 7t target. Keep your habits up!`, cta: "Build habits", ctaTo: "/habits" });
  }
  if (streak >= 3) {
    list.push({ id: "streak", icon: Flame, iconColor: "text-amber-400", iconBg: "bg-secondary", headline: `${streak}-day streak - you're on fire!`, body: "Consistent daily habits are the most powerful way to shrink your footprint long-term." });
  } else {
    list.push({ id: "start-streak", icon: Flame, iconColor: "text-amber-400", iconBg: "bg-secondary", headline: "Start a habit streak today", body: "Log just one eco habit today - bike, recycle, or skip meat. Streaks build momentum.", cta: "Go to Habits", ctaTo: "/habits" });
  }
  if (actionsCompleted < totalActions) {
    list.push({ id: "actions", icon: Leaf, iconColor: "text-primary", iconBg: "bg-primary-soft", headline: `${totalActions - actionsCompleted} high-impact actions left`, body: `You've completed ${actionsCompleted} of ${totalActions} recommended eco actions.`, cta: "View actions", ctaTo: "/actions" });
  }
  if (weeklySavedKg > 0) {
    list.push({ id: "weekly-saved", icon: TrendingDown, iconColor: "text-primary", iconBg: "bg-primary-soft", headline: `You saved ${weeklySavedKg.toFixed(1)} kg CO2 this week!`, body: "Small daily choices, big annual impact." });
  }
  return list;
}

export function InsightBanner(props: InsightBannerProps) {
  const insights = getInsights(props);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [animating, setAnimating] = useState(false);
  const visible = insights.filter((i) => !dismissed.has(i.id));
  if (visible.length === 0) return null;
  const idx = current % visible.length;
  const insight = visible[idx];
  function goNext() {
    setAnimating(true);
    setTimeout(() => { setCurrent((c) => (c + 1) % visible.length); setAnimating(false); }, 200);
  }
  function dismiss() {
    setDismissed((d) => new Set([...d, insight.id]));
    setCurrent((c) => Math.max(0, c - 1));
  }
  const IconComp = insight.icon;
  return (
    <div className={`ls-card relative flex items-start gap-4 p-4 pb-6 transition-all duration-300 ${animating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}>
      <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${insight.iconBg}`}>
        <IconComp className={`h-5 w-5 ${insight.iconColor}`} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm leading-snug text-foreground">{insight.headline}</p>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{insight.body}</p>
        {insight.cta && insight.ctaTo && (
          <Link to={insight.ctaTo} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
            {insight.cta}<ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <button onClick={dismiss} className="grid h-6 w-6 place-items-center rounded-lg text-muted-foreground hover:bg-secondary" aria-label="Dismiss">
          <X className="h-3.5 w-3.5" />
        </button>
        {visible.length > 1 && (
          <button onClick={goNext} className="grid h-6 w-6 place-items-center rounded-lg text-muted-foreground hover:bg-secondary" aria-label="Next">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {visible.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {visible.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-4 bg-primary" : "w-1.5 bg-border"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
