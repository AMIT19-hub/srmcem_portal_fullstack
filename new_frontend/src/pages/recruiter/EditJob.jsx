import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import JobForm from '../../components/JobForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../components/ToastContext';
import { getJobById, updateJob } from '../../services/jobService';
import { errorText } from '../../utils/data';
export default function EditJob() { const { id } = useParams(); const navigate = useNavigate(); const { showToast } = useToast(); const [job, setJob] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); useEffect(() => { getJobById(id).then(setJob).catch((err) => setError(errorText(err, 'Unable to load this job.'))).finally(() => setLoading(false)); }, [id]); const submit = async (data) => { setSaving(true); setError(''); try { const response = await updateJob(id, data); showToast(response?.message || 'Job updated successfully.'); navigate('/recruiter/jobs'); } catch (err) { setError(errorText(err, 'Unable to update this job.')); } finally { setSaving(false); } }; if (loading) return <LoadingSpinner label="Loading job" />; return <section className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8"><p className="text-sm font-bold tracking-[0.14em] text-emerald-700">RECRUITER JOBS</p><h1 className="mt-2 text-3xl font-bold text-slate-950">Edit Job</h1><div className="mt-6"><ErrorMessage message={error} /></div>{job && <div className="mt-6 border border-slate-200 bg-white p-6 shadow-sm"><JobForm initialValues={job} onSubmit={submit} loading={saving} submitLabel="Update job" /></div>}</section>; }
