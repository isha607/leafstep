import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BqtwNJfn.mjs";
import { i as enableDemoMode, r as disableDemoMode } from "./demo-user-BPNeXgaL.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as useAuth } from "./use-auth-CLea-AkB.mjs";
import { _ as useNavigate, v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Eye, b as Leaf, d as Sparkles, w as EyeOff, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BGa5JuE3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function AuthPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/auth" });
	const { user, loading } = useAuth();
	const [mode, setMode] = (0, import_react.useState)(search.mode === "signup" ? "signup" : "signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [showPw, setShowPw] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		if (!search.demo) disableDemoMode();
	}, [search.demo]);
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({
			to: "/dashboard",
			replace: true
		});
	}, [
		user,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (search.demo && !loading && !user) startDemo();
	}, [
		search.demo,
		loading,
		user
	]);
	function startDemo() {
		enableDemoMode();
		toast.success("Welcome to the Leafstep demo! 🌱");
		navigate({
			to: "/dashboard",
			replace: true
		});
	}
	async function handleEmail(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { full_name: name || email.split("@")[0] }
					}
				});
				if (error) throw error;
				toast.success("Account created! You're all set. 🌱");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
			navigate({
				to: "/dashboard",
				replace: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	async function handleGoogle() {
		setBusy(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: `${window.location.origin}/auth` }
			});
			if (error) throw error;
		} catch (err) {
			console.warn("Native Supabase Google OAuth failed, trying Lovable fallback:", err);
			const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
			if (result.error) {
				toast.error("Google sign-in failed. Please try again.");
				setBusy(false);
				return;
			}
			if (result.redirected) return;
			navigate({
				to: "/dashboard",
				replace: true
			});
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-navy text-navy-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -top-32 -left-32 h-80 w-80 rounded-full opacity-20",
					style: {
						background: "radial-gradient(circle, #1d9e75, transparent 70%)",
						animation: "float-cloud 8s ease-in-out infinite"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-1/2 -right-40 h-96 w-96 rounded-full opacity-15",
					style: {
						background: "radial-gradient(circle, #38bdf8, transparent 70%)",
						animation: "float-cloud 11s ease-in-out infinite reverse"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -bottom-20 left-1/3 h-64 w-64 rounded-full opacity-10",
					style: {
						background: "radial-gradient(circle, #a855f7, transparent 70%)",
						animation: "float-cloud 9s ease-in-out infinite 2s"
					}
				}),
				mounted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: [
					{
						top: "12%",
						left: "8%",
						delay: "0s",
						size: 18,
						opacity: .12
					},
					{
						top: "25%",
						left: "88%",
						delay: "1.5s",
						size: 14,
						opacity: .1
					},
					{
						top: "55%",
						left: "5%",
						delay: "3s",
						size: 22,
						opacity: .08
					},
					{
						top: "70%",
						left: "92%",
						delay: "2s",
						size: 16,
						opacity: .12
					},
					{
						top: "85%",
						left: "20%",
						delay: "0.8s",
						size: 12,
						opacity: .1
					},
					{
						top: "40%",
						left: "78%",
						delay: "2.5s",
						size: 20,
						opacity: .09
					}
				].map((leaf, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute text-primary",
					style: {
						top: leaf.top,
						left: leaf.left,
						opacity: leaf.opacity,
						fontSize: leaf.size,
						animation: `float-cloud ${6 + i}s ease-in-out infinite ${leaf.delay}`
					},
					children: "🍃"
				}, i)) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 opacity-[0.03]",
					style: {
						backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
						backgroundSize: "48px 48px"
					}
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl animate-scale-in",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground ls-glow animate-leaf-spin",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-2xl font-extrabold tracking-tight",
							children: "Leafstep"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-navy-foreground/50",
							children: "Carbon Footprint Tracker"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-extrabold leading-tight",
						children: mode === "signin" ? "Welcome back 👋" : "Start your climate journey 🌱"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-navy-foreground/60",
						children: "Track, reduce, and offset your carbon footprint — one step at a time."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleGoogle,
						disabled: busy,
						className: "mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold transition-all hover:bg-white/10 hover:border-white/25 hover:scale-[1.01] disabled:opacity-50 disabled:scale-100",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, {}), "Continue with Google"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: startDemo,
						disabled: busy,
						className: "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/20 disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), "Try demo — no account needed"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 flex items-center gap-4 text-xs text-navy-foreground/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-white/10" }),
							"or with email",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-white/10" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleEmail,
						className: "flex flex-col gap-3",
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative animate-slide-down",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "Display name",
									className: "input-glow w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder:text-navy-foreground/40 transition-all"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "Email",
								className: "input-glow w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder:text-navy-foreground/40 transition-all"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: showPw ? "text" : "password",
									required: true,
									minLength: 6,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "Password (min 6 chars)",
									className: "input-glow w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-11 text-sm placeholder:text-navy-foreground/40 transition-all"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowPw((v) => !v),
									className: "absolute right-3 top-1/2 -translate-y-1/2 text-navy-foreground/40 hover:text-navy-foreground/70 transition-colors",
									tabIndex: -1,
									"aria-label": "Toggle password visibility",
									children: showPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "btn-glow mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all disabled:opacity-50",
								children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), mode === "signin" ? "Signing in…" : "Creating account…"] }) : mode === "signin" ? "Sign in" : "Create account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-navy-foreground/60",
						children: [
							mode === "signin" ? "New to Leafstep?" : "Already have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setMode(mode === "signin" ? "signup" : "signin");
									setEmail("");
									setPassword("");
									setName("");
								},
								className: "font-semibold text-primary hover:underline transition-colors",
								children: mode === "signin" ? "Create an account" : "Sign in"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-navy-foreground/40",
						children: [
							"🌿 Carbon tracking",
							"📊 Insights",
							"🏆 Challenges",
							"💚 Free forever"
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f }, f))
					})
				]
			})
		})]
	});
}
function GoogleIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "h-5 w-5",
		viewBox: "0 0 24 24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4285F4",
				d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
			})
		]
	});
}
//#endregion
export { AuthPage as component };
