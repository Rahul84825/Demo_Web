import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle, getApiErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";
import { Sparkles } from "lucide-react";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, isAuthenticated, isAdmin, authReady } = useAuth();

  const destination = location.state?.from || (isAdmin === true ? "/admin" : "/");

  useEffect(() => {
    if (authReady && isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [authReady, destination, isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      logout({ redirectToLogin: false });
      const data = await loginUser(form);

      if (data?.token && data?.user && login(data.user, data.token)) {
        if (data.user?.isAdmin !== true) {
          localStorage.setItem("productworld_login_popup_shown", "true");
        }
        navigate(data.user?.isAdmin === true ? "/admin" : "/", { replace: true });
      }
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter min-h-screen flex bg-white">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[440px]">
          
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 font-medium">
              Sign in to your DemoMart account to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 block mb-2">
                Email
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 block mb-2">
                Password
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Quick Login Helpers */}
          <div className="mb-6 p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block mb-2.5">
              ⚡ Demo Auto-fill Accounts
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ email: "admin@demo.com", password: "demo1234" })}
                className="p-2.5 rounded-lg border border-indigo-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/50 text-left transition-all duration-200 focus:outline-none"
              >
                <div className="text-xs font-semibold text-indigo-950">Store Admin</div>
                <div className="text-[10px] text-slate-500 truncate">admin@demo.com</div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ email: "john@demo.com", password: "demo1234" })}
                className="p-2.5 rounded-lg border border-indigo-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/50 text-left transition-all duration-200 focus:outline-none"
              >
                <div className="text-xs font-semibold text-indigo-950">Test Customer</div>
                <div className="text-[10px] text-slate-500 truncate">john@demo.com</div>
              </button>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="flex justify-center mb-6">
            <GoogleLoginButton
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              onCredential={async (response) => {
                if (!response?.credential) return;
                try {
                  setGoogleLoading(true);
                  setError("");
                  logout({ redirectToLogin: false });
                  const data = await loginWithGoogle({ idToken: response.credential });
                  if (data?.token && data?.user && login(data.user, data.token)) {
                    if (data.user?.isAdmin !== true) {
                      localStorage.setItem("productworld_login_popup_shown", "true");
                    }
                    navigate(data.user?.isAdmin === true ? "/admin" : "/", { replace: true });
                  }
                } catch (googleError) {
                  setError(getApiErrorMessage(googleError, "Google login failed."));
                } finally {
                  setGoogleLoading(false);
                }
              }}
            />
          </div>
          
          {googleLoading && (
            <div className="text-center text-sm font-medium text-slate-500 mb-6">
              Checking Google account...
            </div>
          )}

          <div className="text-center text-sm font-medium text-slate-500">
            New customer?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors bg-none border-none cursor-pointer p-0 inline"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>

      {/* Right Visual Side (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        
        <div className="relative z-20 text-center px-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-8 border border-indigo-500/30">
             <Sparkles size={32} />
          </div>
          <h2 className="text-4xl font-semibold text-white mb-6 leading-tight">
            Discover the future <br/> of online shopping.
          </h2>
          <p className="text-lg text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
            Join DemoMart to access exclusive collections, fast shipping, and seamless checkout experiences.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;