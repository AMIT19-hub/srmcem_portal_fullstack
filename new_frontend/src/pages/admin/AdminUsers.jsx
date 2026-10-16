import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../../components/ConfirmDialog';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../components/ToastContext';
import { getAdminUsers, setUserActive } from '../../services/adminService';
import { errorText } from '../../utils/data';
import { normalizeRole } from '../../utils/auth';

const pageSize = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyUserId, setBusyUserId] = useState(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null);
  const { showToast } = useToast();

  const reload = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError('');
    try {
      const data = await getAdminUsers();
      setUsers(data.filter((user) => ['STUDENT', 'RECRUITER'].includes(normalizeRole(user.role))));
    } catch (requestError) {
      setError(errorText(requestError, 'Unable to load users.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;
    getAdminUsers()
      .then((data) => { if (active) setUsers(data.filter((user) => ['STUDENT', 'RECRUITER'].includes(normalizeRole(user.role)))); })
      .catch((requestError) => { if (active) setError(errorText(requestError, 'Unable to load users.')); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filteredUsers = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return users.filter((user) => {
      const role = normalizeRole(user.role);
      const matchesQuery = !searchTerm || `${user.name || ''} ${user.email || ''}`.toLowerCase().includes(searchTerm);
      const matchesRole = roleFilter === 'ALL' || role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? user.active : !user.active);
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const visibleUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const toggle = async () => {
    if (!pending || busyUserId !== null) return;
    const { user, nextActive } = pending;
    setBusyUserId(user.id);
    setError('');
    try {
      await setUserActive(user.id, nextActive);
      setUsers((current) => current.map((item) => item.id === user.id ? { ...item, active: nextActive } : item));
      setPending(null);
      showToast(nextActive ? 'Account activated successfully.' : 'Account deactivated successfully.');
      await reload();
    } catch (requestError) {
      setError(errorText(requestError, 'Unable to update account status.'));
    } finally {
      setBusyUserId(null);
    }
  };

  if (loading) return <LoadingSpinner label="Loading users" />;

  return <section className="p-4 sm:p-6 lg:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-bold tracking-[0.14em] text-[#c6283d]">ADMINISTRATION</p><h1 className="mt-2 text-3xl font-bold text-[#102747]">User Management</h1><p className="mt-1 text-sm text-slate-600">Manage student and recruiter access to the portal.</p></div>
      <button type="button" onClick={() => reload(true)} disabled={refreshing || busyUserId !== null} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-[#102747] hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />{refreshing ? 'Refreshing…' : 'Refresh users'}</button>
    </div>
    <div className="mt-5"><ErrorMessage message={error} /></div>
    <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
      <label className="flex max-w-md flex-1 items-center gap-2 border border-slate-300 bg-white px-3 py-2 focus-within:border-[#102747]"><Search size={17} className="shrink-0 text-slate-400" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search name or email" className="min-w-0 flex-1 outline-none" /></label>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">Role<select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} className="border border-slate-300 bg-white px-3 py-2"><option value="ALL">All</option><option value="STUDENT">Students</option><option value="RECRUITER">Recruiters</option></select></label>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">Status<select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="border border-slate-300 bg-white px-3 py-2"><option value="ALL">All</option><option value="ACTIVE">Active</option><option value="DEACTIVATED">Deactivated</option></select></label>
    </div>
    {visibleUsers.length ? <div className="mt-5 overflow-x-auto border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold tracking-wide text-slate-600"><tr>{['User ID', 'Name', 'Email', 'Role', 'Account Status', 'Actions'].map((label) => <th key={label} className="px-4 py-4 sm:px-5">{label}</th>)}</tr></thead>
        <tbody>{visibleUsers.map((user) => {
          const role = normalizeRole(user.role);
          const profilePath = role === 'STUDENT' ? `/admin/students/${user.id}` : `/admin/recruiters/${user.id}`;
          const nextActive = !user.active;
          const isBusy = busyUserId === user.id;
          return <tr key={user.id} className="border-t border-slate-100">
            <td className="whitespace-nowrap px-4 py-4 text-slate-600 sm:px-5">{user.id}</td>
            <td className="min-w-36 px-4 py-4 font-semibold text-[#102747] sm:px-5">{user.name || 'Not available'}</td>
            <td className="px-4 py-4 text-slate-600 sm:px-5">{user.email}</td>
            <td className="whitespace-nowrap px-4 py-4 text-slate-600 sm:px-5">{role}</td>
            <td className="whitespace-nowrap px-4 py-4 sm:px-5"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{user.active ? 'ACTIVE' : 'DEACTIVATED'}</span></td>
            <td className="px-4 py-4 sm:px-5"><div className="flex flex-wrap items-center gap-2"><Link to={profilePath} className="rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-[#102747] hover:bg-slate-50">View Profile</Link><button type="button" disabled={busyUserId !== null} onClick={() => setPending({ user, nextActive })} className={`rounded px-2.5 py-1.5 text-xs font-bold disabled:cursor-wait disabled:opacity-50 ${nextActive ? 'bg-[#102747] text-white hover:bg-[#19385f]' : 'bg-[#c6283d] text-white hover:bg-[#a91f33]'}`}>{isBusy ? 'Updating…' : nextActive ? 'Activate' : 'Deactivate'}</button></div></td>
          </tr>;
        })}</tbody>
      </table>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600"><span>{filteredUsers.length} user{filteredUsers.length === 1 ? '' : 's'}</span>{pageCount > 1 && <div className="flex items-center gap-2"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded border px-3 py-1.5 font-semibold disabled:opacity-40">Previous</button><span>Page {page} of {pageCount}</span><button type="button" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)} className="rounded border px-3 py-1.5 font-semibold disabled:opacity-40">Next</button></div>}</div>
    </div> : <div className="mt-5 border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">{query || roleFilter !== 'ALL' || statusFilter !== 'ALL' ? 'No users match these filters.' : 'No student or recruiter accounts found.'}</div>}
    <ConfirmDialog open={Boolean(pending)} title={pending?.nextActive ? 'Activate account?' : 'Deactivate account?'} description={pending?.nextActive ? 'Are you sure you want to reactivate this account?' : 'Are you sure you want to deactivate this account? The user may lose access to the portal.'} confirmLabel={pending?.nextActive ? 'Activate' : 'Deactivate'} loading={busyUserId !== null} onClose={() => busyUserId === null && setPending(null)} onConfirm={toggle} />
  </section>;
}
