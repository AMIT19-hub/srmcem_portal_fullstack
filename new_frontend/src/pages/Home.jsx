import {
  ArrowRight,
  BadgeCheck,
  Building2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import background from "../assets/bg.webp";
import { useAuth } from "../context/AuthContext";
import { dashboardPathFor } from "../utils/auth";

const portals = [
  {
    role: "STUDENT",
    icon: GraduationCap,
    title: "Student Portal",
    text: "Discover opportunities, apply for jobs, and track your career journey.",
    action: "Explore Student Portal",
    colors: "from-indigo-700 to-blue-600",
    iconColor: "text-indigo-700",
    iconBg: "bg-indigo-50",
    hover: "hover:border-indigo-200",
    route: "/student",
  },
  {
    role: "RECRUITER",
    icon: Building2,
    title: "Recruiter Portal",
    text: "Post opportunities, discover talent, and manage applications.",
    action: "Access Recruiter Portal",
    colors: "from-[#047857] to-[#10B981]",
    iconColor: "text-[#047857]",
    iconBg: "bg-[#ecfdf5]",
    hover: "hover:border-[#a7f3d0]",
    route: "/recruiter",
  },
  {
    role: "ADMIN",
    icon: ShieldCheck,
    title: "Admin Portal",
    text: "Manage users, monitor recruitment activities, and oversee placements.",
    action: "Access Admin Portal",
    colors: "from-violet-700 to-purple-500",
    iconColor: "text-violet-700",
    iconBg: "bg-violet-50",
    hover: "hover:border-violet-200",
    route: "/admin",
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const dashboardPath = dashboardPathFor(user?.role);
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#111827] text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${background})` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#111827] via-[#111827]/95 to-indigo-950/75" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-24">
          <div className="motion-enter">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/25 bg-indigo-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-indigo-200">
              <span className="size-1.5 rounded-full bg-cyan-300" /> SRMCEM
              Career Services
            </span>
            {isAuthenticated ? (
              <>
                <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                  .
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                  Your placement workspace is ready when you are. Pick up where
                  you left off.
                </p>
                <Link
                  to={dashboardPath}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:bg-indigo-400"
                >
                  Open dashboard <ArrowRight size={17} />
                </Link>
              </>
            ) : (
              <>
                <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Turn your next step into a{" "}
                  <span className="text-indigo-300">career move.</span>
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                  One connected placement workspace for SRMCEM students,
                  recruiting teams, and college administration.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:bg-indigo-400"
                  >
                    Get started <ArrowRight size={17} />
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Sign in
                  </Link>
                </div>
              </>
            )}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck size={17} className="text-cyan-300" /> Role-based
                access
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} className="text-cyan-300" /> Secure
                account flows
              </span>
            </div>
          </div>
          <div className="motion-enter motion-delay-1 relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-500/30 to-cyan-300/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-white/15 bg-white/5 p-2 shadow-2xl shadow-black/30 backdrop-blur-sm">
              <img
                src={background}
                alt="SRMCEM campus"
                className="h-72 w-full rounded-[1.2rem] object-cover sm:h-96"
              />
              <div className="absolute inset-x-2 bottom-2 rounded-b-[1.2rem] bg-gradient-to-t from-[#111827]/95 via-[#111827]/70 to-transparent px-6 pb-6 pt-20">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-200">
                  Learn / Connect / Launch
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  Campus talent, connected to opportunity.
                </p>
              </div>
            </div>
            <div className="absolute -left-3 top-7 hidden rounded-2xl border border-white/15 bg-[#1f2937]/90 px-4 py-3 shadow-xl backdrop-blur sm:block">
              <p className="text-xs font-medium text-slate-400">
                A workspace for
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                your career journey
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[.15em] text-indigo-600">
            Choose your workspace
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            One portal, built for every role.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Focused tools for students, recruiters, and the administrators
            supporting campus placements.
          </p>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {portals.map(
            (
              {
                role,
                icon: Icon,
                title,
                text,
                action,
                colors,
                iconColor,
                iconBg,
                hover,
                route,
              },
              index,
            ) => {
              const destination = isAuthenticated
                ? user?.role === role
                  ? dashboardPath
                  : "/unauthorized"
                : route;
              return (
                <article
                  key={role}
                  className={`motion-enter motion-delay-${index} group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${hover}`}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colors}`}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`grid size-12 place-items-center rounded-xl ${iconBg} ${iconColor} transition duration-300 group-hover:scale-105`}
                    >
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <span className="mt-1 size-2 rounded-full bg-current opacity-30" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                    {text}
                  </p>
                  <Link
                    to={destination}
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-bold ${iconColor} transition group-hover:gap-3`}
                    aria-label={`${action} - ${title}`}
                  >
                    {action}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </article>
              );
            },
          )}
        </div>
      </section>
      {!isAuthenticated && (
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:items-center lg:px-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.15em] text-indigo-600">
                Get started
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Your placement journey starts with one account.
              </h2>
            </div>
            <div className="space-y-4">
              {[
                "Create a student or recruiter account",
                "Sign in to your role-specific workspace",
                "Explore opportunities and manage next steps",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-xl bg-[#f6f7fb] p-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    0{index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {!isAuthenticated && (
        <section className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.15em] text-indigo-600">
              Ready when you are
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Take the next step with SRMCEM.
            </h2>
          </div>
          <Link
            to="/register"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#111827] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Create account <ArrowRight size={17} />
          </Link>
        </section>
      )}
    </>
  );
}
