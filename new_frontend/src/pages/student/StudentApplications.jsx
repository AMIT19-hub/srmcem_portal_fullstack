import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/ConfirmDialog';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../components/ToastContext';
import { getMyApplications, withdrawApplication } from '../../services/applicationService';
import { asList, errorText, formatDate, statusClass } from '../../utils/data';

export default function StudentApplications() {
  const [items, setItems] = useState([]);
  const [target, setTarget] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const withdrawalInFlight = useRef(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    getMyApplications()
      .then((data) => setItems(asList(data)))
      .catch((err) => setError(errorText(err, 'Unable to load your applications.')))
      .finally(() => setLoading(false));
  }, []);

  const withdraw = async () => {
    if (!target || String(target.status || '').toUpperCase() !== 'APPLIED' || withdrawalInFlight.current) return;
    withdrawalInFlight.current = true;
    setWithdrawing(true);
    setError('');
    try {
      await withdrawApplication(target.id);
      setItems((current) => current.filter((item) => item.id !== target.id));
      setTarget(null);
      showToast('Application withdrawn successfully.');
    } catch (err) {
      setError(errorText(err, 'Unable to withdraw this application.'));
      if (err.response?.status === 409) {
        setTarget(null);
        getMyApplications().then((data) => setItems(asList(data))).catch(() => {});
      }
    } finally {
      withdrawalInFlight.current = false;
      setWithdrawing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading applications" />;

  return <section className="p-4 sm:p-6 lg:p-8">
    <p className="text-sm font-bold tracking-[0.14em] text-emerald-700">APPLICATIONS</p>
    <h1 className="mt-2 text-3xl font-bold text-slate-950">My Applications</h1>
    <div className="mt-6"><ErrorMessage message={error} /></div>
    {items.length ? <div className="mt-6 overflow-x-auto border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold tracking-wide text-slate-500"><tr><th className="px-5 py-4">Job</th><th className="px-5 py-4">Company</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Applied Date</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Action</th></tr></thead>
        <tbody>{items.map((item) => {
          const canWithdraw = String(item.status || '').toUpperCase() === 'APPLIED';
          return <tr key={item.id} className="border-t border-slate-100">
            <td className="px-5 py-4 font-semibold text-slate-900">{item.jobTitle || item.job?.jobTitle || item.job?.title || 'Not available'}</td>
            <td className="px-5 py-4 text-slate-600">{item.company || item.job?.companyName || item.job?.company || 'Not available'}</td>
            <td className="px-5 py-4 text-slate-600">{item.job?.location || 'Not available'}</td>
            <td className="px-5 py-4 text-slate-600">{formatDate(item.appliedDate || item.applicationDate)}</td>
            <td className="px-5 py-4"><span className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(item.status)}`}>{item.status || 'UNKNOWN'}</span></td>
            <td className="px-5 py-4">{canWithdraw && <button type="button" onClick={() => setTarget(item)} className="text-sm font-bold text-rose-700 hover:text-rose-900">Withdraw Application</button>}</td>
          </tr>;
        })}</tbody>
      </table>
    </div> : <div className="mt-6 border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">You haven't applied for any jobs yet. <button onClick={() => navigate('/jobs')} className="ml-1 font-bold text-emerald-700">Browse jobs</button></div>}
    <ConfirmDialog open={Boolean(target)} title="Withdraw this application?" description="Are you sure you want to withdraw this application? This action cannot be undone." confirmLabel="Withdraw Application" loading={withdrawing} onClose={() => !withdrawing && setTarget(null)} onConfirm={withdraw} />
  </section>;
}
