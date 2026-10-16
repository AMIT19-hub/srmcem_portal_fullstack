import { useEffect, useState } from 'react';
import { Download, Save } from 'lucide-react';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../components/ToastContext';
import { downloadApplicantResume, getRecruiterApplications, updateApplicationStatus } from '../../services/applicationService';
import { asList, errorText, formatDate, statusClass } from '../../utils/data';

const statusOptions = ['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED'];
const statusLabel = (status) => `${status.slice(0, 1)}${status.slice(1).toLowerCase()}`;

const updateErrorText = (error) => {
  const status = error.response?.status;
  if (status === 403) return 'You do not have permission to update this application.';
  if (status === 404) return 'Application not found.';
  if (status === 500) return 'Unable to update application status. Please try again.';
  return errorText(error, 'Unable to update application status. Please try again.');
};

export default function RecruiterApplications() {
  const [items, setItems] = useState([]);
  const [statusValues, setStatusValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    getRecruiterApplications()
      .then((data) => {
        if (active) setItems(asList(data));
      })
      .catch((requestError) => {
        if (active) setError(errorText(requestError, 'Unable to load applications for your jobs.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = (applicationId, status) => {
    setStatusValues((previous) => ({ ...previous, [applicationId]: status }));
  };

  const handleUpdateStatus = async (application) => {
    const applicationId = application.id;
    const currentStatus = String(application.status || 'APPLIED').toUpperCase();
    const nextStatus = statusValues[applicationId] || currentStatus;

    if (nextStatus === currentStatus) {
      showToast('No status change detected.', 'warning');
      return;
    }

    setUpdatingId(applicationId);
    setError('');
    try {
      const updatedApplication = await updateApplicationStatus(applicationId, nextStatus);
      setItems((previous) => previous.map((item) => item.id === applicationId
        ? { ...item, ...updatedApplication, job: updatedApplication.job || item.job, status: updatedApplication.status || nextStatus }
        : item));
      setStatusValues((previous) => {
        const nextValues = { ...previous };
        delete nextValues[applicationId];
        return nextValues;
      });
      showToast('Application status updated successfully.');
    } catch (requestError) {
      setError(updateErrorText(requestError));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownload = async (application) => {
    setDownloadingId(application.id); setError('');
    try {
      const response = await downloadApplicantResume(application.id);
      if (response.data.type && !response.data.type.includes('pdf')) throw new Error('The server did not return a PDF resume.');
      const url = URL.createObjectURL(response.data); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `applicant-${application.id}-resume.pdf`; document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (requestError) { setError(errorText(requestError, 'Unable to download this applicant resume.')); }
    finally { setDownloadingId(null); }
  };

  if (loading) return <LoadingSpinner label="Loading recruiter applications" />;

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <p className="text-sm font-bold tracking-[0.14em] text-emerald-700">RECRUITER APPLICATIONS</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">Applications</h1>
      <div className="mt-6"><ErrorMessage message={error} /></div>
      {items.length ? (
        <div className="mt-6 overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-[950px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Applicant</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Job</th>
                <th className="px-5 py-4">Applied Date</th>
                <th className="px-5 py-4">Current Status</th>
                <th className="px-5 py-4">Update Status</th>
                <th className="px-5 py-4">Resume</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const currentStatus = String(item.status || 'APPLIED').toUpperCase();
                const selectedStatus = statusValues[item.id] || currentStatus;
                const isUpdating = updatingId === item.id;

                return (
                  <tr key={item.id} className="border-t border-slate-100 align-middle">
                    <td className="px-5 py-4 font-semibold text-slate-900">{item.applicantName || item.studentName || 'Not available'}</td>
                    <td className="px-5 py-4 text-slate-600">{item.applicantEmail || item.email || 'Not available'}</td>
                    <td className="px-5 py-4 text-slate-600">{item.job?.title || item.jobTitle || 'Not available'}</td>
                    <td className="px-5 py-4 text-slate-600">{formatDate(item.appliedDate || item.applicationDate)}</td>
                    <td className="px-5 py-4"><span className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(currentStatus)}`}>{statusLabel(currentStatus)}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedStatus}
                          onChange={(event) => handleStatusChange(item.id, event.target.value)}
                          disabled={isUpdating}
                          aria-label={`Status for ${item.applicantName || 'application'}`}
                          className="min-w-32 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                        >
                          {statusOptions.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(item)}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
                        >
                          <Save size={16} />
                          {isUpdating ? 'Updating...' : 'Update'}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4"><button type="button" onClick={() => handleDownload(item)} disabled={downloadingId === item.id} className="inline-flex items-center gap-2 rounded border border-slate-300 px-3 py-2 font-semibold disabled:opacity-50"><Download size={15} />{downloadingId === item.id ? 'Downloading…' : 'Download PDF'}</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : <div className="mt-6 border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">No applications found.</div>}
    </section>
  );
}
