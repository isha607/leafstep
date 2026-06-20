import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BqtwNJfn.mjs";
import { c as isDemoMode, n as DEMO_USER } from "./demo-user-BPNeXgaL.mjs";
import { o as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-CLea-AkB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useAuth() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [demo, setDemo] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDemo(isDemoMode());
		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			if (s?.user) {
				setSession(s);
				setUser(s.user);
				setDemo(false);
			} else if (isDemoMode()) {
				setSession(null);
				setUser(DEMO_USER);
				setDemo(true);
			} else {
				setSession(null);
				setUser(null);
				setDemo(false);
			}
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data }) => {
			if (data.session?.user) {
				setSession(data.session);
				setUser(data.session.user);
				setDemo(false);
			} else if (isDemoMode()) {
				setUser(DEMO_USER);
				setDemo(true);
			}
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return {
		session,
		user,
		loading,
		isDemo: demo
	};
}
//#endregion
export { useAuth as t };
