import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BqtwNJfn.mjs";
import { a as getStoredActions, c as isDemoMode, l as setStoredActions } from "./demo-user-BPNeXgaL.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as useAuth } from "./use-auth-CLea-AkB.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as Check, S as Flame, T as Droplets, d as Sparkles, l as Sun, o as TrendingDown, s as TreePine } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-BuHqWOtG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ACTIONS = [
	{
		key: "ev_commute",
		title: "Switch to electric or shared commute",
		desc: "Swap your daily drive for transit, carpool or EV.",
		impact: "-1.4t CO₂/yr",
		savingTons: 1.4,
		difficulty: "Hard",
		emoji: "🚌"
	},
	{
		key: "plant_diet",
		title: "Eat plant-based 5 days a week",
		desc: "Cut red meat to slash diet emissions.",
		impact: "-0.8t CO₂/yr",
		savingTons: .8,
		difficulty: "Medium",
		emoji: "🥗"
	},
	{
		key: "heat_pump",
		title: "Lower thermostat by 2°C in winter",
		desc: "Small comfort tweak, big energy savings.",
		impact: "-0.6t CO₂/yr",
		savingTons: .6,
		difficulty: "Easy",
		emoji: "🌡️"
	},
	{
		key: "green_energy",
		title: "Switch to a renewable energy plan",
		desc: "Power your home with certified green electricity.",
		impact: "-1.1t CO₂/yr",
		savingTons: 1.1,
		difficulty: "Medium",
		emoji: "⚡"
	},
	{
		key: "less_flights",
		title: "Replace one flight with rail",
		desc: "Trade a short-haul flight for the train.",
		impact: "-0.5t CO₂/yr",
		savingTons: .5,
		difficulty: "Medium",
		emoji: "🚆"
	},
	{
		key: "secondhand",
		title: "Buy secondhand before new",
		desc: "Extend product life and skip manufacturing.",
		impact: "-0.3t CO₂/yr",
		savingTons: .3,
		difficulty: "Easy",
		emoji: "♻️"
	}
];
var OFFSETS = [
	{
		key: "trees",
		title: "Plant Trees",
		desc: "Native reforestation in degraded land.",
		price: "₹999 / mo",
		icon: TreePine,
		tint: "var(--color-chart-1)"
	},
	{
		key: "solar",
		title: "Solar Kits",
		desc: "Off-grid solar for rural homes.",
		price: "₹1499 / mo",
		icon: Sun,
		tint: "var(--color-chart-3)"
	},
	{
		key: "biogas",
		title: "Biogas Digesters",
		desc: "Turn farm waste into clean fuel.",
		price: "₹749 / mo",
		icon: Flame,
		tint: "var(--color-destructive)"
	},
	{
		key: "water",
		title: "Clean Water",
		desc: "Safe water cuts the need to boil.",
		price: "₹1249 / mo",
		icon: Droplets,
		tint: "var(--color-chart-2)"
	}
];
var DIFF_STYLE = {
	Easy: {
		badge: "bg-emerald-100 text-emerald-700",
		dot: "bg-emerald-400"
	},
	Medium: {
		badge: "bg-amber-100 text-amber-700",
		dot: "bg-amber-400"
	},
	Hard: {
		badge: "bg-rose-100 text-rose-700",
		dot: "bg-rose-400"
	}
};
function ConfettiBurst({ x, y }) {
	const colors = [
		"#1d9e75",
		"#f59e0b",
		"#3b82f6",
		"#a855f7",
		"#ef4444"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-0 z-50",
		children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "confetti-particle",
			style: {
				left: x + (Math.random() - .5) * 80,
				top: y + (Math.random() - .5) * 40,
				backgroundColor: colors[i % colors.length],
				animationDelay: `${i * .04}s`,
				transform: `rotate(${Math.random() * 360}deg)`
			}
		}, i))
	});
}
function ActionsPage() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const [confetti, setConfetti] = (0, import_react.useState)(null);
	const confettiId = (0, import_react.useRef)(0);
	const { data: completed = [] } = useQuery({
		queryKey: ["actions_completed", user?.id],
		enabled: !!user,
		queryFn: async () => {
			if (!user) return [];
			if (isDemoMode()) return getStoredActions(user.id);
			try {
				const { data, error } = await supabase.from("actions_completed").select("action_key").eq("user_id", user.id);
				if (error) throw error;
				return data.map((r) => r.action_key);
			} catch {
				return getStoredActions(user.id);
			}
		}
	});
	const toggle = useMutation({
		mutationFn: async ({ key, done }) => {
			if (!user) return;
			if (isDemoMode()) {
				const current = getStoredActions(user.id);
				const next = done ? current.filter((k) => k !== key) : [...current, key];
				setStoredActions(user.id, next);
				return;
			}
			try {
				if (done) {
					const { error } = await supabase.from("actions_completed").delete().eq("user_id", user.id).eq("action_key", key);
					if (error) throw error;
				} else {
					const { error } = await supabase.from("actions_completed").insert({
						user_id: user.id,
						action_key: key
					});
					if (error) throw error;
				}
			} catch {
				const current = getStoredActions(user.id);
				const next = done ? current.filter((k) => k !== key) : [...current, key];
				setStoredActions(user.id, next);
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["actions_completed", user?.id] }),
		onError: () => toast.error("Could not update. Try again.")
	});
	const doneCount = completed.length;
	const totalSaved = ACTIONS.filter((a) => completed.includes(a.key)).reduce((s, a) => s + a.savingTons, 0);
	const progressPct = Math.round(doneCount / ACTIONS.length * 100);
	function handleToggle(key, isDone, e) {
		if (!isDone) {
			const rect = e.currentTarget.getBoundingClientRect();
			confettiId.current++;
			setConfetti({
				x: rect.left + rect.width / 2,
				y: rect.top,
				id: confettiId.current
			});
			setTimeout(() => setConfetti(null), 900);
			toast.success("Action marked complete! 🌱");
		}
		toggle.mutate({
			key,
			done: isDone
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			confetti && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfettiBurst, {
				x: confetti.x,
				y: confetti.y
			}, confetti.id),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-slide-up",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold tracking-tight lg:text-3xl",
					children: "Eco Actions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground mt-0.5",
					children: [
						"Ranked by impact for you — ",
						doneCount,
						" of ",
						ACTIONS.length,
						" completed."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ls-card p-5 animate-slide-up stagger-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold",
								children: "Your Progress"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-bold text-primary",
							children: [progressPct, "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-3 w-full overflow-hidden rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary progress-fill",
							style: { width: `${progressPct}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								doneCount,
								"/",
								ACTIONS.length,
								" actions complete"
							]
						}), totalSaved > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-accent-foreground",
								children: [
									"-",
									totalSaved.toFixed(1),
									"t CO₂/yr saved"
								]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex flex-col gap-3",
				children: ACTIONS.map((a, i) => {
					const isDone = completed.includes(a.key);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `ls-card-hover flex items-center gap-4 p-4 animate-slide-up transition-all ${isDone ? "bg-primary-soft border-primary/20" : ""}`,
						style: { animationDelay: `${.1 + i * .06}s` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-lg",
								children: isDone ? "✅" : a.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `font-bold leading-snug ${isDone ? "line-through opacity-50" : ""}`,
										children: a.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-sm text-muted-foreground truncate",
										children: a.desc
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground",
											children: a.impact
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1 ${DIFF_STYLE[a.difficulty].badge}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${DIFF_STYLE[a.difficulty].dot}` }), a.difficulty]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: (e) => handleToggle(a.key, isDone, e),
								disabled: !user || toggle.isPending,
								className: `grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 disabled:opacity-50 ${isDone ? "border-primary bg-primary text-primary-foreground scale-100" : "border-border text-transparent hover:border-primary hover:bg-primary-soft hover:text-primary hover:scale-110"}`,
								"aria-label": isDone ? "Mark as not done" : "Mark as done",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-5 w-5" })
							})
						]
					}, a.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-2 animate-slide-up stagger-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-extrabold tracking-tight",
					children: "Offset Marketplace"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-0.5",
					children: "Fund verified projects to neutralize what you can't yet cut."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up stagger-5",
				children: OFFSETS.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ls-card-hover flex flex-col gap-3 p-5",
					style: { animationDelay: `${.5 + i * .07}s` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-12 w-12 place-items-center rounded-2xl",
							style: {
								backgroundColor: `color-mix(in oklab, ${o.tint} 16%, transparent)`,
								color: o.tint
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o.icon, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: o.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: o.desc
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold",
								children: o.price
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toast.success(`Thanks for supporting ${o.title}! 🌿`),
								className: "btn-glow rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground",
								children: "Offset"
							})]
						})
					]
				}, o.key))
			})
		]
	});
}
//#endregion
export { ActionsPage as component };
