import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, MoveRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/srmcemlogo.png";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import { dashboardPathFor } from "../utils/auth";
import { errorText } from "../utils/data";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authNotice] = useState(() => {
    const notice = sessionStorage.getItem('srmcem-auth-notice') || '';
    sessionStorage.removeItem('srmcem-auth-notice');
    return notice;
  });
  const update = ({ target: { name, value } }) =>
    setForm((current) => ({ ...current, [name]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(form);
      navigate(dashboardPathFor(user.role), { replace: true });
    } catch (err) {
      setError(errorText(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-start bg-[#f6f7fb] px-4 py-5 sm:px-6 sm:py-6 lg:items-center lg:px-8">
      <div className="motion-enter mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[.85fr_1.15fr]">
        <aside className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-indigo-950 to-indigo-700 p-6 text-white sm:p-8 lg:flex lg:flex-col lg:justify-center lg:p-9">
          <div className="absolute -right-20 -top-16 size-72 rounded-full border border-white/10 bg-white/5" /><div className="absolute -bottom-28 -left-20 size-80 rounded-full border border-white/10 bg-white/5" />
          <div className="relative flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-white p-1"><img src={logo} alt="SRMCEM" className="size-full object-contain" /></span><span><span className="block text-sm font-bold">SRMCEM</span><span className="block text-xs text-indigo-200">Placement Portal</span></span></div>
          <div className="relative mt-6 lg:mt-9"><p className="text-xs font-bold tracking-[0.16em] text-indigo-200">ACCOUNT ACCESS</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back.</h1><p className="mt-3 max-w-sm text-sm leading-6 text-indigo-100">Sign in to continue to your placement workspace.</p>
          <div className="mt-5 hidden rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur lg:block"><p className="text-sm font-semibold">One workspace, focused tools</p><p className="mt-2 text-sm leading-6 text-slate-300">Pick up applications, recruiting, and placement operations right where you left them.</p></div></div>
        </aside>
        <div className="p-6 sm:p-8 lg:p-9">
          <p className="text-sm font-semibold text-emerald-700">
            Account access
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">Login</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the email and password registered with your account.
          </p>
          <div className="mt-4">
            <ErrorMessage message={error} />
            {authNotice && <p role="status" className="mt-3 text-sm text-amber-800">{authNotice}</p>}
            {location.state?.message && <p role="status" className="mt-3 text-sm text-emerald-800">{location.state.message}</p>}
          </div>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <span className="relative mt-2 block">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-3 pl-10 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </span>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <span className="relative mt-2 block">
                <LockKeyhole
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={update}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-11 pl-10 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 active:scale-[.99] disabled:bg-indigo-400"
            >
              {loading ? <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Logging in...</> : "Login"}{" "}
              {!loading && <MoveRight size={17} />}
            </button>
          </form>
          <p className="mt-4 text-right text-sm"><Link to="/forgot-password" className="font-semibold text-emerald-700">Forgot password?</Link></p>
          <p className="mt-7 text-center text-sm text-slate-600">
            New here?{" "}
            <Link to="/register" className="font-bold text-emerald-700">
              Create a Student or Recruiter account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
