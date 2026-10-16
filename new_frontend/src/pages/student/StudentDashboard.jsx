import { BriefcaseBusiness, CheckCircle2, Clock3, FileText, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications } from '../../services/applicationService';
import { getJobs } from '../../services/jobService';
import { asList, errorText } from '../../utils/data';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    Promise.all([getJobs(), getMyApplications()]).then(([jobData, appData]) => {
      if (active) { setJobs(asList(jobData)); setApps(asList(appData)); }
    }).catch((err) => { if (active) setError(errorText(err, 'Unable to load your dashboard.')); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  if (loading) return <LoadingSpinner label="Loading student dashboard" />;
  const cards = [
    { label: 'Available jobs', value: jobs.length, icon: BriefcaseBusiness, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'My applications', value: apps.length, icon: FileText, color: 'text-violet-600 bg-violet-50' },
    { label: 'In progress', value: apps.filter((item) => ['APPLIED', 'SHORTLISTED'].includes(item.status)).length, icon: Clock3, color: 'text-cyan-700 bg-cyan-50' },
    { label: 'Selected', value: apps.filter((item) => item.status === 'SELECTED').length, icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50' },
  ];
  return <section className="p-4 sm:p-6 lg:p-8">
    <div className="motion-enter flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Student workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ' back'}</h1><p className="mt-2 text-sm text-slate-600">Keep your placement activity in view and find your next opportunity.</p></div><Link to="/student/profile" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-700"><UserRound size={17} /> Your profile</Link></div>
    <div className="mt-6"><ErrorMessage message={error} /></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, color }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`grid size-10 place-items-center rounded-xl ${color}`}><Icon size={20} /></span><p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-sm font-medium text-slate-500">{label}</p></article>)}</div>
    <div className="mt-10 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-indigo-600">Explore roles</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Opportunities for you</h2></div><Link to="/jobs" className="text-sm font-bold text-indigo-700 hover:text-indigo-900">Browse all jobs ?</Link></div>
    {jobs.length ? <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{jobs.slice(0, 3).map((job) => <JobCard key={job.id} job={job} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><BriefcaseBusiness className="mx-auto text-slate-400" /><p className="mt-3 font-semibold text-slate-800">No opportunities to show right now</p><p className="mt-1 text-sm text-slate-500">Check back soon for new roles.</p></div>}
    <div className="mt-8 grid gap-4 sm:grid-cols-2"><Link to="/student/applications" className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"><span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><FileText size={20} /></span><p className="mt-4 font-bold text-slate-900">Track applications</p><p className="mt-1 text-sm text-slate-500">Review progress and current status.</p></Link><Link to="/jobs" className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"><span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-600"><BriefcaseBusiness size={20} /></span><p className="mt-4 font-bold text-slate-900">Find your next role</p><p className="mt-1 text-sm text-slate-500">Explore current openings across the portal.</p></Link></div>
  </section>;
}
