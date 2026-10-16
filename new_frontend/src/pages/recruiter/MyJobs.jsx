import { useCallback, useEffect, useState } from 'react';
import { BriefcaseBusiness, CalendarDays, Eye, MapPin, Pencil, PlusCircle, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../../components/ConfirmDialog';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../components/ToastContext';
import { getRecruiterApplications } from '../../services/applicationService';
import { closeJob, getMyJobs } from '../../services/jobService';
import { asList, errorText, formatDate } from '../../utils/data';

const jobStatus = (job) => String(job.status || 'OPEN').toUpperCase();

export default function MyJobs() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [applicationCounts, setApplicationCounts] = useState({});
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    const [jobResult, applicationResult] = await Promise.allSettled([getMyJobs(), getRecruiterApplications()]);
    if (jobResult.status === 'rejected') throw jobResult.reason;
    setJobs(asList(jobResult.value));
    if (applicationResult.status === 'fulfilled') {
      setApplicationCounts(asList(applicationResult.value).reduce((counts, application) => {
        const jobId = application.jobId ?? application.job?.id;
        if (jobId !== undefined && jobId !== null) counts[jobId] = (counts[jobId] || 0) + 1;
        return counts;
      }, {}));
    } else {
      setApplicationCounts({});
      setError(errorText(applicationResult.reason, 'Unable to load application counts.'));
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getMyJobs(), getRecruiterApplications()])
      .then(([jobResult, applicationResult]) => {
        if (!active) return;
        if (jobResult.status === 'rejected') throw jobResult.reason;
        setJobs(asList(jobResult.value));
        if (applicationResult.status === 'rejected') {
          setError(errorText(applicationResult.reason, 'Unable to load application counts.'));
          return;
        }
        setApplicationCounts(asList(applicationResult.value).reduce((counts, application) => {
          const jobId = application.jobId ?? application.job?.id;
          if (jobId !== undefined && jobId !== null) counts[jobId] = (counts[jobId] || 0) + 1;
          return counts;
        }, {}));
      })
      .catch((requestError) => { if (active) setError(errorText(requestError, 'Unable to load your jobs.')); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const closeSelectedJob = async () => {
    if (!target) return;
    setClosing(true);
    setError('');
    try {
      await closeJob(target.id);
      setJobs((current) => current.map((job) => job.id === target.id ? { ...job, status: 'CLOSED' } : job));
      setTarget(null);
      showToast('Job closed. Existing applications have been preserved.');
      try {
        await refresh();
      } catch (requestError) {
        setError(errorText(requestError, 'The job was closed, but the job list could not be refreshed.'));
      }
    } catch (requestError) {
      setError(errorText(requestError, 'Unable to close this job.'));
    } finally {
      setClosing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading recruiter jobs" />;

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.14em] text-emerald-700">RECRUITER JOBS</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">My Jobs</h1>
          <p className="mt-2 text-sm text-slate-600">All your openings, including closed jobs and their application history.</p>
        </div>
        <Link to="/recruiter/jobs/create" className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800">
          <PlusCircle size={17} />Create job
        </Link>
      </div>
      <div className="mt-6"><ErrorMessage message={error} /></div>
      {jobs.length ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {jobs.map((job) => {
            const status = jobStatus(job);
            const isOpen = status === 'OPEN';
            return (
              <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-950">{job.title}</h2>
                    <p className="mt-1 text-sm font-medium text-indigo-700">{job.company}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                    {isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="flex items-start gap-2 text-slate-600"><MapPin size={16} className="mt-0.5 shrink-0" /><span><dt className="font-semibold text-slate-800">Location</dt><dd>{job.location || 'Not available'}</dd></span></div>
                  <div className="flex items-start gap-2 text-slate-600"><BriefcaseBusiness size={16} className="mt-0.5 shrink-0" /><span><dt className="font-semibold text-slate-800">Salary</dt><dd>{job.salary ? `${job.salary} LPA` : 'Not available'}</dd></span></div>
                  <div className="flex items-start gap-2 text-slate-600"><CalendarDays size={16} className="mt-0.5 shrink-0" /><span><dt className="font-semibold text-slate-800">Application deadline</dt><dd>{formatDate(job.applicationDeadline)}</dd></span></div>
                  <div className="flex items-start gap-2 text-slate-600"><UsersRound size={16} className="mt-0.5 shrink-0" /><span><dt className="font-semibold text-slate-800">Applications</dt><dd>{applicationCounts[job.id] || 0}</dd></span></div>
                </dl>
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                  <Link to={`/recruiter/jobs/${job.id}`} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Eye size={16} />View job</Link>
                  <Link to={`/recruiter/jobs/${job.id}/applicants`} className="inline-flex items-center gap-2 rounded-md border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50"><UsersRound size={16} />Applications</Link>
                  {isOpen && <Link to={`/recruiter/jobs/edit/${job.id}`} className="inline-flex items-center gap-2 rounded-md border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"><Pencil size={16} />Edit</Link>}
                  {isOpen && <button type="button" onClick={() => setTarget(job)} className="ml-auto rounded-md bg-rose-700 px-3 py-2 text-sm font-bold text-white hover:bg-rose-800">Close Job</button>}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">No jobs posted yet.</div>
      )}
      <ConfirmDialog
        open={Boolean(target)}
        title="Close this job?"
        description="Do you really want to close this job? Once closed, you can't reopen it."
        confirmLabel="OK, close job"
        loadingLabel="Closing..."
        loading={closing}
        onClose={() => !closing && setTarget(null)}
        onConfirm={closeSelectedJob}
      />
    </section>
  );
}
