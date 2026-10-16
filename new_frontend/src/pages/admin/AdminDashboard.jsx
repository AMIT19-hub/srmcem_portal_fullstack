import { BriefcaseBusiness, FileText, GraduationCap, RefreshCw, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAdminApplications, getAdminJobs, getAdminUsers } from '../../services/adminService';
import { errorText } from '../../utils/data';

const dashboardErrorText = (error) => {
  if (error.response?.status === 403) return 'You do not have permission to access this admin data.';
  if (error.response?.status === 404) return 'Admin data not found.';
  if (error.response?.status === 500) return 'Unable to load admin data. Please try again.';
  return errorText(error, 'Unable to load admin data. Please try again.');
};

const countUsersByRole = (users, role) => users.filter((user) => String(user.role).toUpperCase() === role).length;

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ users: 0, students: 0, recruiters: 0, applications: 0, jobs: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setRefreshing(true);
    setError('');
    try {
      const [users, applications, jobs] = await Promise.all([getAdminUsers(), getAdminApplications(), getAdminJobs()]);
      setSummary({ users: users.length, students: countUsersByRole(users, 'STUDENT'), recruiters: countUsersByRole(users, 'RECRUITER'), applications: applications.length, jobs: jobs.length });
    } catch (requestError) {
      console.error(requestError.response?.data || requestError.message);
      setError(dashboardErrorText(requestError));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([getAdminUsers(), getAdminApplications(), getAdminJobs()])
      .then(([users, applications, jobs]) => {
        if (active) setSummary({ users: users.length, students: countUsersByRole(users, 'STUDENT'), recruiters: countUsersByRole(users, 'RECRUITER'), applications: applications.length, jobs: jobs.length });
      })
      .catch((requestError) => {
        console.error(requestError.response?.data || requestError.message);
        if (active) setError(dashboardErrorText(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <LoadingSpinner label="Loading admin dashboard" />;

  const cards = [
    { label: 'Total Users', value: summary.users, icon: UsersRound },
    { label: 'Total Students', value: summary.students, icon: GraduationCap },
    { label: 'Total Recruiters', value: summary.recruiters, icon: UsersRound },
    { label: 'Total Jobs', value: summary.jobs, icon: BriefcaseBusiness },
    { label: 'Total Applications', value: summary.applications, icon: FileText },
  ];

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="motion-enter flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Administration</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Admin dashboard</h1><p className="mt-2 text-sm text-slate-600">Placement portal oversight at a glance.</p></div><button type="button" onClick={loadDashboard} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"><RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />{refreshing ? 'Refreshing...' : 'Refresh data'}</button></div>
      <div className="mt-6"><ErrorMessage message={error} /></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ label, value, icon: Icon }, index) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`grid size-10 place-items-center rounded-xl ${['bg-indigo-50 text-indigo-600', 'bg-violet-50 text-violet-600', 'bg-cyan-50 text-cyan-700', 'bg-amber-50 text-amber-700', 'bg-rose-50 text-rose-600'][index]}`}><Icon size={20} /></span><p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-sm font-medium text-slate-500">{label}</p></article>)}</div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{[['Manage users', '/admin/users'], ['Review jobs', '/admin/jobs'], ['View applications', '/admin/applications']].map(([label, to]) => <Link key={to} to={to} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">{label}<span className="mt-2 block text-xs font-medium text-slate-500">Open administration workspace →</span></Link>)}</div>
    </section>
  );
}
