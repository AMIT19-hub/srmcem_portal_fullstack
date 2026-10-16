import { BriefcaseBusiness, FileText, PlusCircle, UsersRound, ArrowUpRight, Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { getRecruiterApplications } from '../../services/applicationService';
import { getMyJobs } from '../../services/jobService';
import { asList, errorText } from '../../utils/data';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    Promise.all([getMyJobs(), getRecruiterApplications()]).then(([jobData, appData]) => {
      if (active) { setJobs(asList(jobData)); setApplications(asList(appData)); }
    }).catch((err) => { if (active) setError(errorText(err, 'Unable to load the recruiter dashboard.')); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  if (loading) return <LoadingSpinner label="Loading recruiter dashboard" />;
  const cards = [
    { label: 'Jobs posted', value: jobs.length, icon: BriefcaseBusiness, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Applications received', value: applications.length, icon: FileText, color: 'text-violet-600 bg-violet-50' },
    { label: 'Awaiting review', value: applications.filter((item) => item.status === 'APPLIED').length, icon: Clock3, color: 'text-amber-700 bg-amber-50' },
  ];
  return <section className="p-4 sm:p-6 lg:p-8">
    <div className="motion-enter flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Recruiter workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ' back'}</h1><p className="mt-2 text-sm text-slate-600">Manage your openings and keep candidate reviews moving.</p></div><Link to="/recruiter/jobs/create" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"><PlusCircle size={17} /> Post a job</Link></div>
    <div className="mt-6"><ErrorMessage message={error} /></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-3">{cards.map(({ label, value, icon: Icon, color }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`grid size-10 place-items-center rounded-xl ${color}`}><Icon size={20} /></span><p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-sm font-medium text-slate-500">{label}</p></article>)}</div>
    <div className="mt-10 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-indigo-600">Candidate activity</p><h2 className="mt-1 text-lg font-bold text-slate-950">Recent applications</h2></div><Link to="/recruiter/applications" className="text-sm font-bold text-indigo-700 hover:text-indigo-900">View all <ArrowUpRight size={15} className="inline" /></Link></div>
      {applications.length ? <div className="divide-y divide-slate-100">{applications.slice(0, 5).map((application) => <div key={application.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{application.applicantName || application.applicantEmail || 'Applicant'}</p><p className="mt-1 truncate text-xs text-slate-500">{application.jobTitle || 'Application'}{application.appliedDate ? ` � ${application.appliedDate}` : ''}</p></div><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">{application.status || 'APPLIED'}</span></div>)}</div> : <div className="px-5 py-10 text-center"><UsersRound className="mx-auto text-slate-400" /><p className="mt-3 text-sm font-semibold text-slate-800">No applications yet</p><p className="mt-1 text-sm text-slate-500">Applications will appear here when candidates apply.</p></div>}</section>
      <div className="space-y-4"><Link to="/recruiter/jobs" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"><span><span className="block text-xs font-bold uppercase tracking-[.13em] text-slate-500">Workspace</span><span className="mt-1 block font-bold text-slate-900">Manage your jobs</span></span><BriefcaseBusiness className="text-indigo-600" /></Link><Link to="/recruiter/applications" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"><span><span className="block text-xs font-bold uppercase tracking-[.13em] text-slate-500">Review</span><span className="mt-1 block font-bold text-slate-900">All applications</span></span><FileText className="text-indigo-600" /></Link><div className="rounded-2xl bg-gradient-to-br from-[#111827] to-indigo-800 p-5 text-white"><p className="text-sm font-semibold">Your openings</p><p className="mt-2 text-3xl font-bold">{jobs.length}</p><p className="mt-1 text-sm text-indigo-100">roles in your workspace</p><Link to="/recruiter/jobs/create" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-indigo-200">Add another role <PlusCircle size={16} /></Link></div></div>
    </div>
  </section>;
}
