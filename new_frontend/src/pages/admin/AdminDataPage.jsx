import { RefreshCw, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { errorText, formatDate, statusClass } from '../../utils/data';

const adminErrorText = (error, fallback) => {
  const status = error.response?.status;
  if (status === 403) return 'You do not have permission to access this admin data.';
  if (status === 404) return 'Admin data not found.';
  if (status === 500) return 'Unable to load admin data. Please try again.';
  return errorText(error, fallback);
};

const displayValue = (item, column) => {
  const value = item[column.key];
  if (column.type === 'date') return formatDate(value);
  if (column.type === 'status') return <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(value)}`}>{value || 'UNKNOWN'}</span>;
  return value ?? 'Not available';
};

export default function AdminDataPage({ title, fetchItems, columns, emptyMessage, searchFields }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadItems = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError('');
    try {
      setItems(await fetchItems());
    } catch (requestError) {
      console.error(requestError.response?.data || requestError.message);
      setError(adminErrorText(requestError, `Unable to load ${title.toLowerCase()}.`));
    } finally {
      setRefreshing(false);
    }
  }, [fetchItems, title]);

  useEffect(() => {
    let active = true;
    fetchItems()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((requestError) => {
        console.error(requestError.response?.data || requestError.message);
        if (active) setError(adminErrorText(requestError, `Unable to load ${title.toLowerCase()}.`));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchItems, title]);

  const filteredItems = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return items;
    return items.filter((item) => searchFields.some((field) => String(item[field] || '').toLowerCase().includes(searchTerm)));
  }, [items, query, searchFields]);

  if (loading) return <LoadingSpinner label={`Loading ${title.toLowerCase()}`} />;

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-bold tracking-[0.14em] text-emerald-700">ADMINISTRATION</p><h1 className="mt-2 text-3xl font-bold text-slate-950">{title}</h1></div>
        <button type="button" onClick={() => loadItems(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"><RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />{refreshing ? 'Refreshing...' : 'Refresh'}</button>
      </div>
      <div className="mt-6"><ErrorMessage message={error} /></div>
      <div className="mt-6 flex max-w-md items-center gap-2 border border-slate-300 bg-white px-3 py-2 focus-within:border-emerald-600 focus-within:ring-3 focus-within:ring-emerald-100"><Search size={18} className="shrink-0 text-slate-400" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" /></div>
      {filteredItems.length ? (
        <div className="mt-5 overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold tracking-wide text-slate-500"><tr>{columns.map((column) => <th key={column.key} className="px-5 py-4">{column.label}</th>)}</tr></thead>
            <tbody>{filteredItems.map((item, index) => <tr key={item.id || index} className="border-t border-slate-100">{columns.map((column) => <td key={column.key} className="px-5 py-4 text-slate-700">{displayValue(item, column)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : <div className="mt-5 border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">{query ? `No ${title.toLowerCase()} match your search.` : emptyMessage}</div>}
    </section>
  );
}
