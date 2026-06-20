import { t as supabase } from "./client-BqtwNJfn.mjs";
import { r as disableDemoMode } from "./demo-user-BPNeXgaL.mjs";
import { a as require_jsx_runtime, i as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { t as useAuth } from "./use-auth-CLea-AkB.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as Calculator, b as Leaf, d as Sparkles, j as CalendarCheck, v as LogOut, x as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-Bg6vKkR8.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var NAV = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/actions",
		label: "Actions",
		icon: Sparkles
	},
	{
		to: "/habits",
		label: "Habits",
		icon: CalendarCheck
	},
	{
		to: "/calculator",
		label: "Calculator",
		icon: Calculator
	}
];
var DAILY_TIPS = [
	"Unplug chargers when not in use — standby power adds up to 10% of your electricity bill.",
	"Carry a reusable bag — plastic bags take 1000 years to decompose.",
	"A 2-minute shorter shower saves ~10 litres of water per day.",
	"Eating plant-based once a week saves ~0.5t CO₂ per year.",
	"Turn off lights when leaving a room — simple but adds up!"
];
var tip = DAILY_TIPS[(/* @__PURE__ */ new Date()).getDay() % DAILY_TIPS.length];
function AppShell({ children }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const routerState = useRouterState();
	const { isDemo } = useAuth();
	const currentPath = routerState.location.pathname;
	async function signOut() {
		const wasDemo = isDemo;
		disableDemoMode();
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: wasDemo ? "/" : "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background lg:flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card px-4 py-6 z-30",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard",
					className: "flex items-center gap-2.5 px-2 pb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground animate-leaf-spin",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-extrabold tracking-tight",
						children: "Leafstep"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 flex-col gap-1",
					children: NAV.map((item) => {
						const isActive = currentPath === item.to || currentPath.startsWith(item.to + "/");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200", isActive ? "bg-primary-soft text-accent-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("grid h-7 w-7 place-items-center rounded-lg transition-all duration-200", isActive ? "bg-primary text-primary-foreground" : "bg-secondary"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" })
								}),
								item.label,
								isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-primary" })
							]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 border-t border-border pt-4 mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-primary-soft px-3 py-2.5 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-bold text-accent-foreground",
							children: "🌱 Daily tip"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-accent-foreground/70 mt-0.5 leading-relaxed",
							children: tip
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: signOut,
							className: "flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-7 w-7 place-items-center rounded-lg bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
							}), isDemo ? "Sign in / Register" : "Sign out"]
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 lg:pl-64",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 py-3 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground animate-leaf-spin",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-extrabold tracking-tight",
							children: "Leafstep"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: signOut,
							className: "grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary",
							"aria-label": isDemo ? "Sign in" : "Sign out",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "mx-auto w-full max-w-6xl px-4 py-6 pb-28 lg:px-8 lg:py-8",
					children: [isDemo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary-soft px-4 py-2.5 animate-slide-up",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-accent-foreground",
							children: "🌱 Demo mode — data saved locally on this device"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "shrink-0 text-xs font-bold text-primary hover:underline",
							children: "Create account"
						})]
					}), children]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur-md lg:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex",
						children: NAV.map((item) => {
							const isActive = currentPath === item.to || currentPath.startsWith(item.to + "/");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-all duration-200 relative", isActive ? "text-primary" : "text-muted-foreground"),
								children: [
									isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0 inset-x-3 h-0.5 rounded-b-full bg-primary animate-scale-in" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("grid h-7 w-7 place-items-center rounded-xl transition-all duration-200", isActive ? "bg-primary-soft scale-110" : "scale-100"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: cn("h-4 w-4", isActive && "text-primary") })
									}),
									item.label
								]
							}, item.to);
						})
					})
				})
			]
		})]
	});
}
function AuthenticatedLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AuthenticatedLayout as component };
