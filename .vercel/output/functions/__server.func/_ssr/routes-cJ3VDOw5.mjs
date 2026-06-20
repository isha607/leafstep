import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as ArrowRight, M as Calculator, b as Leaf, d as Sparkles, i as Users, j as CalendarCheck, k as ChartColumn, o as TrendingDown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-cJ3VDOw5.js
var import_jsx_runtime = require_jsx_runtime();
var FEATURES = [
	{
		icon: Calculator,
		title: "Understand your impact",
		desc: "A guided carbon calculator breaks down transport, diet, energy, and shopping into clear annual totals.",
		color: "#1d9e75"
	},
	{
		icon: Sparkles,
		title: "Simple high-impact actions",
		desc: "Personalized recommendations ranked by CO₂ savings — from meat-free days to renewable energy switches.",
		color: "#38bdf8"
	},
	{
		icon: CalendarCheck,
		title: "Build lasting habits",
		desc: "Track daily eco habits with streaks, weekly progress rings, and visible grams of CO₂ avoided.",
		color: "#f59e0b"
	},
	{
		icon: Users,
		title: "Community challenges",
		desc: "Join group challenges and climb the leaderboard — accountability makes change stick.",
		color: "#a855f7"
	}
];
var STEPS = [
	{
		n: "1",
		label: "Calculate",
		desc: "Estimate your footprint in 4 quick steps"
	},
	{
		n: "2",
		label: "Act",
		desc: "Pick personalized actions that fit your life"
	},
	{
		n: "3",
		label: "Track",
		desc: "Log habits and watch your score improve"
	}
];
function LandingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-extrabold tracking-tight",
							children: "Leafstep"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground",
							children: "Sign in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							className: "btn-glow rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground",
							children: "Get started"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -top-24 left-1/4 h-96 w-96 rounded-full opacity-20",
						style: { background: "radial-gradient(circle, #1d9e75, transparent 70%)" }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-1/2 -right-32 h-80 w-80 rounded-full opacity-15",
						style: { background: "radial-gradient(circle, #38bdf8, transparent 70%)" }
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-3xl text-center animate-slide-up",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-4 py-1.5 text-xs font-bold text-accent-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5" }), "Understand · Track · Reduce"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-6 text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl",
								children: [
									"Shrink your carbon footprint,",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "one step at a time"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-lg text-muted-foreground leading-relaxed",
								children: "Leafstep helps individuals understand, track, and reduce their environmental impact through simple actions and personalized insights — no climate science degree required."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/dashboard",
									className: "btn-glow flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground sm:w-auto",
									children: ["Try free demo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									className: "flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold transition-colors hover:bg-secondary sm:w-auto",
									children: "Create account"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-xs text-muted-foreground",
								children: "Free forever · No credit card · Works on mobile"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4 animate-slide-up stagger-2",
						children: [
							{
								val: "8.6t",
								lbl: "Avg. footprint tracked",
								icon: ChartColumn
							},
							{
								val: "6",
								lbl: "High-impact actions",
								icon: Sparkles
							},
							{
								val: "5",
								lbl: "Daily habit trackers",
								icon: CalendarCheck
							},
							{
								val: "5,680+",
								lbl: "Community members",
								icon: Users
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ls-card flex flex-col items-center gap-2 p-5 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-extrabold",
									children: s.val
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: s.lbl
								})
							]
						}, s.lbl))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border bg-card/50 py-16 lg:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-center text-2xl font-extrabold lg:text-3xl",
							children: "How Leafstep works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground",
							children: "Three simple steps from awareness to action."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid gap-6 md:grid-cols-3",
							children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ls-card relative p-6 animate-slide-up",
								style: { animationDelay: `${.1 + i * .08}s` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground",
										children: s.n
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 text-lg font-bold",
										children: s.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: s.desc
									})
								]
							}, s.n))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-16 lg:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-center text-2xl font-extrabold lg:text-3xl",
						children: "Everything you need to make a difference"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-6 sm:grid-cols-2",
						children: FEATURES.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ls-card-hover flex gap-4 p-6 animate-slide-up",
							style: { animationDelay: `${.15 + i * .06}s` },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
								style: {
									background: `${f.color}18`,
									color: f.color
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold",
								children: f.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground leading-relaxed",
								children: f.desc
							})] })]
						}, f.title))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border bg-navy py-16 text-navy-foreground lg:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl px-4 text-center lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "mx-auto h-10 w-10 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-2xl font-extrabold lg:text-3xl",
							children: "Ready to take your first leaf step?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-navy-foreground/70 leading-relaxed",
							children: "Join thousands tracking their footprint and building greener habits every day."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard",
							className: "btn-glow mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground",
							children: ["Start tracking free", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border py-8 text-center text-xs text-muted-foreground",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Leafstep · Built for a cooler planet 🌱"
				]
			})
		]
	});
}
//#endregion
export { LandingPage as component };
