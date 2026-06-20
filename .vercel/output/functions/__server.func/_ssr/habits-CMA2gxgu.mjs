import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BqtwNJfn.mjs";
import { c as isDemoMode, d as setStoredHabits, s as getStoredHabits } from "./demo-user-BPNeXgaL.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as useAuth } from "./use-auth-CLea-AkB.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { N as Bike, P as Beef, S as Flame, g as Plug, h as Recycle, o as TrendingDown, p as ShoppingBag, u as Star } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/habits-CMA2gxgu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HABITS = [
	{
		key: "bike",
		label: "Bike or walk",
		icon: Bike,
		saved: .6,
		color: "#1d9e75"
	},
	{
		key: "recycle",
		label: "Recycle waste",
		icon: Recycle,
		saved: .2,
		color: "#38bdf8"
	},
	{
		key: "meatfree",
		label: "Meat-free meal",
		icon: Beef,
		saved: .5,
		color: "#f59e0b"
	},
	{
		key: "unplug",
		label: "Unplug devices",
		icon: Plug,
		saved: .1,
		color: "#a855f7"
	},
	{
		key: "reusable",
		label: "Reusable bag/cup",
		icon: ShoppingBag,
		saved: .15,
		color: "#e0533d"
	}
];
var DAYS = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
];
function weekDates() {
	const now = /* @__PURE__ */ new Date();
	const dow = (now.getDay() + 6) % 7;
	const monday = new Date(now);
	monday.setDate(now.getDate() - dow);
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		return d.toISOString().slice(0, 10);
	});
}
function WeeklyRing({ pct }) {
	const r = 38;
	const c = 2 * Math.PI * r;
	const offset = c - pct / 100 * c;
	const color = pct >= 70 ? "#1d9e75" : pct >= 40 ? "#f59e0b" : "#ef4444";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-24 w-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			className: "h-full w-full -rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r,
				fill: "none",
				stroke: "var(--color-secondary)",
				strokeWidth: "10"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r,
				fill: "none",
				stroke: color,
				strokeWidth: "10",
				strokeLinecap: "round",
				strokeDasharray: c,
				strokeDashoffset: offset,
				style: { transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)" }
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xl font-extrabold",
				style: { color },
				children: [Math.round(pct), "%"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[9px] font-semibold text-muted-foreground",
				children: "this week"
			})]
		})]
	});
}
function HabitsPage() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const dates = weekDates();
	const [bouncing, setBouncing] = (0, import_react.useState)(null);
	const { data: logs = [] } = useQuery({
		queryKey: [
			"habits",
			user?.id,
			dates[0]
		],
		enabled: !!user,
		queryFn: async () => {
			if (!user) return [];
			if (isDemoMode()) return getStoredHabits(user.id);
			try {
				const { data, error } = await supabase.from("habits").select("habit_key, day").eq("user_id", user.id).gte("day", dates[0]).lte("day", dates[6]);
				if (error) throw error;
				return data;
			} catch {
				return getStoredHabits(user.id);
			}
		}
	});
	const logged = new Set(logs.map((l) => `${l.habit_key}|${l.day}`));
	const toggle = useMutation({
		mutationFn: async ({ key, day, on }) => {
			if (!user) return;
			if (isDemoMode()) {
				const current = getStoredHabits(user.id);
				const next = on ? current.filter((l) => !(l.habit_key === key && l.day === day)) : [...current, {
					habit_key: key,
					day
				}];
				setStoredHabits(user.id, next);
				return;
			}
			try {
				if (on) {
					const { error } = await supabase.from("habits").delete().eq("user_id", user.id).eq("habit_key", key).eq("day", day);
					if (error) throw error;
				} else {
					const { error } = await supabase.from("habits").insert({
						user_id: user.id,
						habit_key: key,
						day
					});
					if (error) throw error;
				}
			} catch {
				const current = getStoredHabits(user.id);
				const next = on ? current.filter((l) => !(l.habit_key === key && l.day === day)) : [...current, {
					habit_key: key,
					day
				}];
				setStoredHabits(user.id, next);
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: [
			"habits",
			user?.id,
			dates[0]
		] }),
		onError: () => toast.error("Could not log habit.")
	});
	function handleToggle(key, day, on) {
		setBouncing(`${key}|${day}`);
		setTimeout(() => setBouncing(null), 400);
		if (!on) toast.success("Habit logged! 🌱", { duration: 1500 });
		toggle.mutate({
			key,
			day,
			on
		});
	}
	const todayIso = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const todayIdx = dates.indexOf(todayIso);
	const weeklySaved = HABITS.reduce((sum, h) => {
		return sum + dates.filter((d) => logged.has(`${h.key}|${d}`)).length * h.saved;
	}, 0);
	let streak = 0;
	for (let i = todayIdx === -1 ? 6 : todayIdx; i >= 0; i--) if (HABITS.some((h) => logged.has(`${h.key}|${dates[i]}`))) streak++;
	else break;
	const totalSlots = HABITS.length * 7;
	const completedSlots = [...logged].length;
	const weeklyPct = Math.round(completedSlots / totalSlots * 100);
	const bestHabit = HABITS.reduce((best, h) => {
		return dates.filter((d) => logged.has(`${h.key}|${d}`)).length > dates.filter((d) => logged.has(`${best.key}|${d}`)).length ? h : best;
	}, HABITS[0]);
	const bestCount = dates.filter((d) => logged.has(`${bestHabit.key}|${d}`)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-slide-up",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold tracking-tight lg:text-3xl",
					children: "Habits Tracker"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-0.5",
					children: "Tap a dot to log a habit for that day."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3 animate-slide-up stagger-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ls-card flex items-center gap-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 ${streak >= 3 ? "animate-fire-pulse" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: `h-6 w-6 ${streak >= 3 ? "text-amber-500" : "text-muted-foreground"}` })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-2xl font-extrabold",
							children: [
								streak,
								" day",
								streak === 1 ? "" : "s"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Current streak"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ls-card flex items-center gap-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeeklyRing, { pct: weeklyPct }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold",
							children: "Weekly activity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: [
								completedSlots,
								" of ",
								totalSlots,
								" slots logged"
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ls-card flex items-center gap-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground text-sm font-extrabold",
							children: "CO₂"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-2xl font-extrabold",
							children: [(weeklySaved * 1e3).toFixed(0), " g"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3 text-primary" }), "Saved this week"]
						})] })]
					})
				]
			}),
			bestCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ls-card flex items-center gap-4 p-4 border-primary/20 bg-primary-soft animate-slide-up stagger-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 text-amber-500" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-bold text-accent-foreground",
					children: ["Best habit this week: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: bestHabit.label
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-accent-foreground/70 mt-0.5",
					children: [
						"Logged ",
						bestCount,
						"/",
						dates.length,
						" days · saves ",
						(bestHabit.saved * 1e3 * bestCount).toFixed(0),
						" g CO₂"
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "ls-card overflow-x-auto p-5 animate-slide-up stagger-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-[480px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 grid grid-cols-[1fr_repeat(7,2.5rem)] items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
							children: "Habit"
						}), DAYS.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-center text-xs font-bold ${i === todayIdx ? "text-primary bg-primary-soft rounded-lg py-1" : "text-muted-foreground"}`,
							children: d
						}, d))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-4",
						children: HABITS.map((h, hi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[1fr_repeat(7,2.5rem)] items-center gap-2 animate-slide-in-left",
							style: { animationDelay: `${.3 + hi * .06}s` },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
									style: {
										background: `${h.color}18`,
										color: h.color
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(h.icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: h.label
								})]
							}), dates.map((day, i) => {
								const on = logged.has(`${h.key}|${day}`);
								const id = `${h.key}|${day}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleToggle(h.key, day, on),
									disabled: !user || toggle.isPending,
									className: `mx-auto h-8 w-8 rounded-full border-2 transition-all duration-300 disabled:opacity-50 ${bouncing === id ? "dot-bounce" : ""} ${on ? "border-transparent text-white shadow-sm" : i === todayIdx ? "border-primary/40 bg-transparent hover:bg-primary-soft hover:border-primary hover:scale-110" : "border-border bg-transparent hover:border-muted-foreground/40 hover:scale-105"}`,
									style: on ? {
										backgroundColor: h.color,
										boxShadow: `0 0 8px ${h.color}60`
									} : {},
									"aria-label": `${h.label} ${day}`
								}, day);
							})]
						}, h.key))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ls-card p-4 border-l-4 border-l-primary animate-slide-up stagger-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold text-foreground",
					children: "💡 Pro tip"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Logging habits in the morning sets a positive intention. Try enabling browser notifications to remind you each day at 8 AM."
				})]
			})
		]
	});
}
//#endregion
export { HabitsPage as component };
