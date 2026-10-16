import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getJobs } from '../../services/jobService';
import { asList, errorText } from '../../utils/data';

const isOpenJob = (job) => String(job.status || '').toUpperCase() === 'OPEN';

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getJobs()
      .then((data) => { if (active) setJobs(asList(data).filter(isOpenJob)); })
      .catch((requestError) => { if (active) setError(errorText(requestError, 'Unable to load available jobs.')); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const types = [...new Set(jobs.map((job) => job.jobType).filter(Boolean))];
  const visible = useMemo(() => jobs.filter((job) => (
    isOpenJob(job)
    && `${job.title} ${job.company} ${job.location} ${job.skills}`.toLowerCase().includes(search.toLowerCase())
    && (!type || job.jobType === type)
  )), [jobs, search, type]);

  if (loading) return <LoadingSpinner label="Loading jobs" />;

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <p className="text-sm font-bold tracking-[0.14em] text-emerald-700">OPPORTUNITIES</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">Browse Jobs</h1>
      <div className="mt-6"><ErrorMessage message={error} /></div>
      <div className="mt-6 grid gap-3 border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by role, company, skill, or location" className="w-full rounded-md border border-slate-300 py-3 pr-3 pl-10 outline-none focus:border-emerald-600" />
        </label>
        <label className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <select value={type} onChange={(event) => setType(event.target.value)} className="w-full appearance-none rounded-md border border-slate-300 bg-white py-3 pr-3 pl-10 outline-none focus:border-emerald-600">
            <option value="">All job types</option>
            {types.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      {visible.length ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((job) => <JobCard key={job.id} job={job} />)}</div>
      ) : (
        <div className="mt-6 border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
          {jobs.length ? 'No open jobs match your search.' : 'No open jobs are available right now.'}
        </div>
      )}
    </section>
  );
}