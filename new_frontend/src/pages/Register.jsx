import { useRef, useState } from "react";
import {
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  MoveRight,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/srmcemlogo.png";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import { errorText } from "../utils/data";

const roles = [
  { value: "STUDENT", label: "Student", icon: GraduationCap },
  { value: "RECRUITER", label: "Recruiter", icon: Building2 },
];
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    course: "",
    rollNo: "",
    companyName: "",
    designation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submitting = useRef(false);
  const update = ({ target: { name, value } }) =>
    setForm((current) => ({ ...current, [name]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current || loading || success) return;
    setError("");
    if (!form.name.trim()) return setError('Name is required.');
    if (form.name.trim().length > 100) return setError('Name cannot exceed 100 characters.');
    if (form.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 8 || form.password.length > 72)
      return setError("Password must contain between 8 and 72 characters.");
    if (form.role === 'STUDENT' && !/^\d{13}$/.test(form.rollNo)) return setError('Roll number must contain exactly 13 digits.');
    if (form.role === 'STUDENT' && !form.course.trim()) return setError('Course is required.');
    if (form.role === 'RECRUITER' && !form.companyName.trim()) return setError('Company name is required.');
    if (form.password !== form.confirmPassword)
      return setError("Password confirmation does not match.");
    submitting.current = true;
    setLoading(true);
    try {
      const response = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        ...(form.role === 'STUDENT' ? { course: form.course.trim(), rollNo: form.rollNo } : { companyName: form.companyName.trim(), ...(form.designation.trim() ? { designation: form.designation.trim() } : {}) }),
      });
      const email = form.email.trim();
      setSuccess(typeof response.data === 'string' ? response.data : response.data?.message || 'OTP sent. Verify your email to complete registration.');
      window.setTimeout(() => navigate('/verify-otp', { state: { email } }), 500);
    } catch (err) {
      setError(errorText(err, "Registration failed. Please review your details."));
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-start bg-[#f6f7fb] px-3 py-4 sm:px-5 sm:py-6 lg:items-center lg:px-8">
      <div className="motion-enter mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[.72fr_1.28fr]">
        <aside className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-indigo-950 to-indigo-700 px-5 py-5 text-white sm:px-7 lg:flex lg:flex-col lg:justify-center lg:p-8">
          <div className="absolute -right-16 -top-24 size-56 rounded-full border border-white/10 bg-white/5" />
          <div className="relative flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-white p-1"><img src={logo} alt="SRMCEM" className="size-full object-contain" /></span><span><span className="block text-sm font-bold">SRMCEM</span><span className="block text-xs text-indigo-200">Placement Portal</span></span></div>
          <div className="relative mt-4 lg:mt-8"><p className="text-xs font-bold uppercase tracking-[.15em] text-indigo-200">Start your career journey</p><h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">Build your next opportunity.</h2><p className="mt-2 max-w-sm text-sm leading-6 text-indigo-100">Create a student or recruiter account to continue to the placement workspace.</p></div>
          <div className="relative mt-5 hidden rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-slate-200 backdrop-blur lg:block">A clear place to connect campus talent with career opportunities.</div>
        </aside>
        <div className="p-5 sm:p-7 lg:p-7">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-indigo-600">Get started</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-x-3 gap-y-1"><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Create your account</h1><p className="text-xs text-slate-500">Administrator accounts are managed separately.</p></div>
          <div className="mt-2 space-y-2"><ErrorMessage message={error} />{success && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</div>}</div>
          <form onSubmit={submit} className="mt-2 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
            <fieldset className="sm:col-span-2"><legend className="text-xs font-semibold text-slate-700">I am registering as</legend><div className="mt-1 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1">{roles.map(({ value, label, icon: Icon }) => <label key={value} className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold transition ${form.role === value ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}><input type="radio" name="role" value={value} checked={form.role === value} onChange={update} className="sr-only" /><Icon size={16} aria-hidden="true" />{label}</label>)}</div></fieldset>
            <label className="block text-xs font-semibold text-slate-700">{form.role === 'STUDENT' ? 'Full name' : 'Recruiter name'}<span className="relative mt-1 block"><UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" name="name" value={form.name} onChange={update} placeholder="Your name" autoComplete="name" required maxLength={100} className="w-full rounded-xl border border-slate-200 py-2 pr-3 pl-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></span></label>
            <label className="block text-xs font-semibold text-slate-700">Email<span className="relative mt-1 block"><Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" required maxLength={254} className="w-full rounded-xl border border-slate-200 py-2 pr-3 pl-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></span></label>
            {form.role === 'STUDENT' ? <><label className="block text-xs font-semibold text-slate-700">Course<input name="course" value={form.course} onChange={update} required placeholder="e.g. B.Tech" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label><label className="block text-xs font-semibold text-slate-700">13 digit roll number<input name="rollNo" inputMode="numeric" maxLength={13} value={form.rollNo} onChange={update} required placeholder="Enter roll number" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label></> : <><label className="block text-xs font-semibold text-slate-700">Company name<input name="companyName" maxLength={100} value={form.companyName} onChange={update} required placeholder="Company" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label><label className="block text-xs font-semibold text-slate-700">Designation <span className="font-normal text-slate-400">(optional)</span><input name="designation" maxLength={100} value={form.designation} onChange={update} placeholder="Your role" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label></>}
            {["password", "confirmPassword"].map((name) => <label key={name} className="block text-xs font-semibold text-slate-700">{name === 'password' ? 'Password' : 'Confirm password'}<span className="relative mt-1 block"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type={showPassword ? 'text' : 'password'} name={name} value={form[name]} onChange={update} placeholder={name === 'password' ? 'At least 8 characters' : 'Repeat password'} autoComplete="new-password" required minLength={name === 'password' ? 8 : undefined} maxLength={name === 'password' ? 72 : undefined} className="w-full rounded-xl border border-slate-200 py-2.5 pr-10 pl-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />{name === 'password' && <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>}</span></label>)}
            <button type="submit" disabled={loading || Boolean(success)} className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 active:scale-[.99] disabled:bg-indigo-400 sm:col-span-2">{loading ? <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Registering...</> : 'Create account'}{!loading && !success && <MoveRight size={17} />}</button>
          </form>
          <p className="mt-3 text-center text-sm text-slate-600">Already registered? <Link to="/login" className="font-bold text-indigo-700 hover:text-indigo-900">Login</Link></p>
        </div>
      </div>
    </section>
  );
}
