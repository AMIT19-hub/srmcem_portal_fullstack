import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../components/ToastContext';
import { applyForJob, getMyApplications } from '../../services/applicationService';
import { getProfileCompletion } from '../../services/profileService';
import { getJobById } from '../../services/jobService';
import { asList, errorText, formatDate, isDeadlinePassed } from '../../utils/data';

const CLOSED_JOB_MESSAGE = 'This job is closed and no longer accepts applications.';
const DEADLINE_MESSAGE = 'The application deadline has passed.';
const DUPLICATE_MESSAGE = 'You have already applied for this job.';

const applicationError = (error) => {
  const rawMessage = errorText(error, 'Unable to submit your application. Please try again.');
  const message = rawMessage.toLowerCase();
  if (message.includes('closed') || message.includes('no longer accepts')) return CLOSED_JOB_MESSAGE;
  if (message.includes('deadline') || message.includes('application deadline')) return DEADLINE_MESSAGE;
  if (message.includes('already applied') || message.includes('duplicate')) return DUPLICATE_MESSAGE;
  return rawMessage;
};

export default function StudentJobDetails() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getJobById(id), getMyApplications()])
      .then(([jobData, applications]) => {
        if (!active) return;
        setJob(jobData);
        setApplied(asList(applications).some((application) => String(application.jobId ?? application.job?.id) === String(id)));
      })
      .catch((requestError) => { if (active) setError(errorText(requestError, 'Unable to load this job.')); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const apply = async () => {
    if (!job || submitting) return;
    if (String(job.status || '').toUpperCase() !== 'OPEN') {
      setError(CLOSED_JOB_MESSAGE);
      return;
    }
    if (isDeadlinePassed(job.applicationDeadline)) {
      setError(DEADLINE_MESSAGE);
      return;
    }
    setSubmitting(true);
    setError('');
    setProfileIncomplete(false);
    try {
      const completion = await getProfileCompletion();
      if (!completion.eligibleToApply) {
        setError(`Complete your profile before applying: ${(completion.missingFields || []).join(', ') || 'Required profile information is missing.'}`);
        setProfileIncomplete(true);
        return;
      }
      const response = await applyForJob(id);
      setApplied(true);
      showToast(response?.message || 'Application submitted successfully.');
    } catch (requestError) {
      const message = applicationError(requestError);
      setError(message);
      if (/profile|complete.*information|missing.*field/i.test(message)) setProfileIncomplete(true);
      showToast(message, 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading job details" />;
  if (!job) return <section className="p-8"><ErrorMessage message={error || 'Job not found.'} /></section>;

  const isOpen = String(job.status || '').toUpperCase() === 'OPEN';
  const deadlinePassed = isDeadlinePassed(job.applicationDeadline);
  const canApply = isOpen && !deadlinePassed && !applied && !submitting;

  return (
    <section className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"><ArrowLeft size={17} />Back to jobs</Link>
      <div className="mt-5 border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="text-sm font-bold text-emerald-700">{job.company}</p><h1 className="mt-2 text-3xl font-bold text-slate-950">{job.title}</h1></div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{isOpen ? 'OPEN' : 'CLOSED'}</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-600">
          <span className="flex items-center gap-2"><MapPin size={17} />{job.location}</span>
          <span className="flex items-center gap-2"><CalendarDays size={17} />Deadline: {formatDate(job.applicationDeadline)}</span>
        </div>
        <div className="mt-7">
          <ErrorMessage message={error || (!isOpen ? CLOSED_JOB_MESSAGE : '')} />
          {profileIncomplete && <Link to="/student/profile" className="mt-2 inline-block text-sm font-bold text-emerald-700 underline">Complete your student profile</Link>}
          {applied && <p className="mt-2 text-sm font-semibold text-emerald-800">{DUPLICATE_MESSAGE}</p>}
          {deadlinePassed && isOpen && <p className="mt-2 text-sm font-semibold text-rose-700">{DEADLINE_MESSAGE}</p>}
        </div>
        <div className="mt-7 grid gap-7 border-t border-slate-200 pt-7 md:grid-cols-2">
          <div><h2 className="font-bold text-slate-950">Description</h2><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{job.description}</p></div>
          <dl className="space-y-4 text-sm">
            <div><dt className="font-bold text-slate-950">Salary (LPA)</dt><dd className="mt-1 text-slate-600">{job.salary}</dd></div>
            <div><dt className="font-bold text-slate-950">Required skills</dt><dd className="mt-1 text-slate-600">{job.skills}</dd></div>
            <div><dt className="font-bold text-slate-950">Eligibility</dt><dd className="mt-1 text-slate-600">{job.eligibility}</dd></div>
          </dl>
        </div>
        <button type="button" onClick={apply} disabled={!canApply} className={`mt-8 inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-bold ${applied ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-700 text-white hover:bg-emerald-800'} disabled:cursor-not-allowed disabled:opacity-60`}>
          {applied && <CheckCircle2 size={17} />}
          {submitting ? 'Submitting...' : applied ? 'Applied' : !isOpen ? 'Job closed' : deadlinePassed ? 'Deadline passed' : 'Apply Now'}
        </button>
      </div>
    </section>
  );
}