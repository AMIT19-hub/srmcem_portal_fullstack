import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getJobById } from '../../services/jobService';
import { errorText, formatDate } from '../../utils/data';

export default function RecruiterJobDetails() {
  const { id } = useParams(); const [job, setJob] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { let active = true; getJobById(id).then(data => active && setJob(data)).catch(e => active && setError(errorText(e, 'Unable to load this job.'))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [id]);
  if (loading) return <LoadingSpinner label="Loading job details" />;
  if (!job) return <section className="p-6"><ErrorMessage message={error || 'Job not found.'} /></section>;
  return <section className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8"><Link to="/recruiter/jobs" className="inline-flex items-center gap-2 font-bold text-emerald-700"><ArrowLeft size={17} />Back to my jobs</Link><article className="mt-5 border bg-white p-6 sm:p-8"><p className="font-bold text-emerald-700">{job.company}</p><h1 className="mt-2 text-3xl font-bold">{job.title}</h1><div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-600"><span className="inline-flex items-center gap-2"><MapPin size={17} />{job.location}</span><span className="inline-flex items-center gap-2"><CalendarDays size={17} />Deadline: {formatDate(job.applicationDeadline)}</span></div><div className="mt-7 grid gap-7 border-t pt-7 md:grid-cols-2"><div><h2 className="font-bold">Description</h2><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{job.description}</p></div><dl className="space-y-4 text-sm"><div><dt className="font-bold">Salary (LPA)</dt><dd>{job.salary || 'Not available'}</dd></div><div><dt className="font-bold">Eligibility</dt><dd>{job.eligibility || 'Not available'}</dd></div><div><dt className="font-bold">Required skills</dt><dd>{job.skills || 'Not available'}</dd></div></dl></div><div className="mt-7 flex gap-3"><Link to={`/recruiter/jobs/edit/${job.id}`} className="rounded bg-emerald-700 px-4 py-3 font-bold text-white">Edit job</Link><Link to={`/recruiter/jobs/${job.id}/applicants`} className="rounded border px-4 py-3 font-bold">View applicants</Link></div></article></section>;
}
