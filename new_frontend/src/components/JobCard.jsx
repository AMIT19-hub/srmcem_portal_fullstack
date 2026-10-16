import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  IndianRupee,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
export default function JobCard({ job, actions }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">{job.title}</h2>
          <p className="mt-1 text-sm font-medium text-indigo-700">
            {job.company}
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <BriefcaseBusiness size={20} />
        </span>
      </div>
      <dl className="mt-5 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          {job.location}
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee size={16} />
          {job.salary} LPA
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          Deadline: {job.applicationDeadline}
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2">
        {String(job.skills || "")
          .split(",")
          .filter(Boolean)
          .slice(0, 4)
          .map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
            >
              {skill.trim()}
            </span>
          ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="text-xs font-bold tracking-wide text-slate-500">
          {job.jobType}
        </span>
        {actions || (
          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-700 hover:text-indigo-900"
          >
            View details <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </article>
  );
}
