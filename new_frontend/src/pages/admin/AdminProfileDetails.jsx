import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { errorText } from '../../utils/data';

export default function AdminProfileDetails({ title, fields, fetchProfile }) {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchProfile(userId)
      .then((data) => { if (active) setProfile(data); })
      .catch((requestError) => { if (active) setError(errorText(requestError, `Unable to load this ${title.toLowerCase()} profile.`)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fetchProfile, title, userId]);

  if (loading) return <LoadingSpinner label={`Loading ${title.toLowerCase()} profile`} />;
  return <section className="p-4 sm:p-6 lg:p-8">
    <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"><ArrowLeft size={17} />Back to users</Link>
    <p className="mt-5 text-sm font-bold tracking-wide text-emerald-700">ADMINISTRATION</p>
    <h1 className="mt-2 text-3xl font-bold">{title} Profile</h1>
    <div className="mt-5"><ErrorMessage message={error} /></div>
    {profile && <div className="mt-5 max-w-3xl border border-slate-200 bg-white p-6 shadow-sm"><dl className="grid gap-5 sm:grid-cols-2">{fields.map(([key, label]) => <div key={key}><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt>{key === 'active' ? <dd className="mt-1"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${profile.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{profile.active ? 'ACTIVE' : 'DEACTIVATED'}</span></dd> : <dd className="mt-1 break-words font-semibold text-slate-900">{profile[key] === null || profile[key] === undefined || profile[key] === '' ? 'Not available' : String(profile[key])}</dd>}</div>)}</dl></div>}
  </section>;
}
