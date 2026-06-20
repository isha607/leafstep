import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { I as ArrowUp, S as Flame, _ as Medal, a as Trophy, b as Leaf, c as Target, i as Users, u as Star } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community-BCqAu1yR.js
var import_jsx_runtime = require_jsx_runtime();
var LEADERBOARD = [
	{
		rank: 1,
		name: "Priya S.",
		city: "Bengaluru",
		score: 94,
		saved: 3.2,
		badge: "🌳 Carbon Hero"
	},
	{
		rank: 2,
		name: "Arjun M.",
		city: "Pune",
		score: 88,
		saved: 2.8,
		badge: "🌿 Eco Champion"
	},
	{
		rank: 3,
		name: "Sneha R.",
		city: "Mumbai",
		score: 82,
		saved: 2.4,
		badge: "♻️ Green Warrior"
	},
	{
		rank: 4,
		name: "Vikram P.",
		city: "Hyderabad",
		score: 79,
		saved: 2.1,
		badge: "🚴 Clean Commuter"
	},
	{
		rank: 5,
		name: "Anjali K.",
		city: "New Delhi",
		score: 75,
		saved: 1.9,
		badge: "🌱 Leaf Starter"
	},
	{
		rank: 6,
		name: "Rahul D.",
		city: "Chennai",
		score: 71,
		saved: 1.7,
		badge: "🌱 Leaf Starter"
	},
	{
		rank: 7,
		name: "Meera T.",
		city: "Kolkata",
		score: 68,
		saved: 1.5,
		badge: "🌱 Leaf Starter"
	},
	{
		rank: 8,
		name: "Rohan B.",
		city: "Ahmedabad",
		score: 65,
		saved: 1.3,
		badge: "🌱 Leaf Starter"
	}
];
var CHALLENGES = [
	{
		id: "meat-free-week",
		title: "Meat-Free Week 🥦",
		desc: "Go meat-free for 7 days and save up to 25 kg CO₂.",
		participants: 1240,
		daysLeft: 5,
		progress: 68,
		color: "#1d9e75",
		icon: "🥗"
	},
	{
		id: "bike-commute",
		title: "Bike Commute Month 🚴",
		desc: "Cycle or walk instead of driving for 30 days.",
		participants: 876,
		daysLeft: 18,
		progress: 42,
		color: "#38bdf8",
		icon: "🚴"
	},
	{
		id: "zero-plastic",
		title: "Zero-Plastic July ♻️",
		desc: "Refuse single-use plastics for the entire month.",
		participants: 2103,
		daysLeft: 11,
		progress: 55,
		color: "#a855f7",
		icon: "♻️"
	},
	{
		id: "energy-saver",
		title: "Energy Saver Sprint ⚡",
		desc: "Cut home energy use by 20% for two weeks.",
		participants: 652,
		daysLeft: 3,
		progress: 81,
		color: "#f59e0b",
		icon: "⚡"
	}
];
var STATS = [
	{
		val: "5,680+",
		lbl: "Community members",
		icon: Users,
		color: "#1d9e75"
	},
	{
		val: "12.4t",
		lbl: "CO₂ saved this month",
		icon: Leaf,
		color: "#38bdf8"
	},
	{
		val: "4",
		lbl: "Active challenges",
		icon: Flame,
		color: "#f59e0b"
	},
	{
		val: "94",
		lbl: "Highest eco score",
		icon: Trophy,
		color: "#a855f7"
	}
];
function RankBadge({ rank }) {
	if (rank === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-2xl",
		children: "🥇"
	});
	if (rank === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-2xl",
		children: "🥈"
	});
	if (rank === 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-2xl",
		children: "🥉"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-muted-foreground",
		children: rank
	});
}
function CommunityPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-slide-up",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold tracking-tight lg:text-3xl",
					children: "Community"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-0.5",
					children: "Join challenges, climb the leaderboard, and inspire others. 🌍"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4 animate-slide-up stagger-1",
				children: STATS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ls-card p-4 flex flex-col items-center gap-2 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-xl",
							style: {
								background: `${s.color}20`,
								color: s.color
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-extrabold",
							children: s.val
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground leading-snug",
							children: s.lbl
						})
					]
				}, s.lbl))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "animate-slide-up stagger-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-muted-foreground uppercase tracking-wider",
						children: "Active Challenges"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] text-muted-foreground bg-secondary rounded-full px-2.5 py-1 font-semibold",
						children: [CHALLENGES.length, " running"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: CHALLENGES.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ls-card-hover flex flex-col gap-3 p-5 animate-slide-up",
						style: { animationDelay: `${.1 + i * .06}s` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl",
										children: c.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-sm",
										children: c.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground mt-0.5 leading-snug",
										children: c.desc
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 text-[10px] font-bold rounded-full px-2 py-1",
									style: {
										background: `${c.color}20`,
										color: c.color
									},
									children: [c.daysLeft, "d left"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "inline h-3 w-3 mr-1" }),
											c.participants.toLocaleString(),
											" participants"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold",
										style: { color: c.color },
										children: [c.progress, "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 w-full rounded-full bg-secondary overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full progress-fill",
										style: {
											width: `${c.progress}%`,
											backgroundColor: c.color
										}
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-glow w-full rounded-xl py-2.5 text-xs font-bold transition-all",
								style: {
									background: `${c.color}20`,
									color: c.color,
									border: `1px solid ${c.color}30`
								},
								children: "Join Challenge →"
							})
						]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "ls-card p-6 animate-slide-up stagger-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-bold text-muted-foreground uppercase tracking-wider",
								children: "Monthly Leaderboard"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: "June 2026"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: LEADERBOARD.map((member, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all animate-slide-in-left ${member.rank <= 3 ? "bg-primary-soft/60" : "hover:bg-secondary/50"}`,
							style: { animationDelay: `${.35 + i * .05}s` },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankBadge, { rank: member.rank }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-sm",
											children: member.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground hidden sm:inline",
											children: member.city
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: member.badge
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-extrabold text-primary",
										children: member.score
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-2.5 w-2.5 text-primary" }),
											member.saved,
											"t saved"
										]
									})]
								})
							]
						}, member.rank))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 rounded-xl bg-secondary/40 p-3 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "inline h-3.5 w-3.5 text-primary mr-1" }), "Complete your carbon calculation and log habits to appear on the leaderboard!"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ls-card p-5 flex flex-col sm:flex-row items-center gap-4 justify-between animate-slide-up stagger-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-bold text-sm flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 text-primary" }), "Want to climb the ranks?"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Log daily habits and complete your carbon footprint to earn points."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 flex-shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/habits",
						className: "btn-glow flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5" }), "Log Habits"]
					})
				})]
			})
		]
	});
}
//#endregion
export { CommunityPage as component };
