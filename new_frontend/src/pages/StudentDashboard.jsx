import { GraduationCap } from "lucide-react";

export default function StudentDashboard() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-l-4 border-emerald-600 bg-white p-8 shadow-sm">
        <GraduationCap size={34} className="text-emerald-700" />
        <h1 className="mt-5 text-3xl font-bold text-slate-950">
          Welcome to Student Dashboard
        </h1>
      </div>
    </section>
  );
}
