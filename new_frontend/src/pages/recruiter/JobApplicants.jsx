import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getJobApplications } from '../../services/applicationService';
import { errorText, formatDate, statusClass } from '../../utils/data';

export default function JobApplicants() {
  const { id } = useParams(); const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { let active = true; getJobApplications(id).then(data => active && setItems(data)).catch(e => active && setError(errorText(e, 'Unable to load applicants.'))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [id]);
  if (loading) return <LoadingSpinner label="Loading applicants" />;
  return <section className="p-4 sm:p-6 lg:p-8"><p className="text-sm font-bold tracking-wide text-emerald-700">RECRUITER JOBS</p><h1 className="mt-2 text-3xl font-bold">Applicants</h1><div className="mt-5"><ErrorMessage message={error} /></div>{items.length ? <div className="mt-5 overflow-x-auto border bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50"><tr>{['Student', 'Email', 'Applied', 'Status'].map(x => <th key={x} className="px-4 py-3">{x}</th>)}</tr></thead><tbody>{items.map(app => <tr key={app.id} className="border-t"><td className="px-4 py-3">{app.student?.name || app.applicantName || 'Not available'}</td><td className="px-4 py-3">{app.student?.email || app.applicantEmail || 'Not available'}</td><td className="px-4 py-3">{formatDate(app.appliedDate || app.appliedAt)}</td><td className="px-4 py-3"><span className={`rounded px-2 py-1 text-xs font-bold ${statusClass(app.status)}`}>{app.status || 'UNKNOWN'}</span></td></tr>)}</tbody></table></div> : <p className="mt-5 border border-dashed p-8 text-center text-slate-600">No applicants for this job.</p>}</section>;
}
