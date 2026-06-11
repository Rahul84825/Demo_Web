import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser as registerApi, getApiErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Sparkles } from "lucide-react";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const data = await registerApi(form);

      if (data?.token && data?.user) {
        if (data.user?.isAdmin !== true) {
          localStorage.setItem("productworld_login_popup_shown", "true");
        }
        login(data.user, data.token);
        navigate(data.user?.isAdmin === true ? "/admin" : "/", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (submitError) {
      console.error("Registration failed:", submitError);
      setError(getApiErrorMessage(submitError, "Unable to create account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter min-h-screen flex bg-white">
      
      {/* Left Visual Side (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/40 to-blue-900/40 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        
        <div className="relative z-20 text-center px-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-8 border border-cyan-500/30">
             <Sparkles size={32} />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Elevate your <br/> everyday lifestyle.
          </h2>
          <p className="text-lg text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
            Create an account today to enjoy personalized recommendations and faster checkouts.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[440px]">
          
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Create account
            </h1>
            <p className="text-slate-500 font-medium">
              Join DemoMart in just a few clicks
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">
                Name
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">
                Email
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">
                Password
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Choose a strong password"
                autoComplete="new-password"
              />
            </div>

            <button
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all duration-200 disabled:opacity-50 shadow-lg shadow-blue-500/30 active:scale-[0.98]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="text-center text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors bg-none border-none cursor-pointer p-0 inline"
            >
              Sign in
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Register;