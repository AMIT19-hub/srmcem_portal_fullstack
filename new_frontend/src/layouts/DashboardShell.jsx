import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) => `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-indigo-500/15 text-white before:absolute before:top-2 before:bottom-2 before:left-0 before:w-1 before:rounded-full before:bg-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`;

export default function DashboardShell({ label, items }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const handleLogout = () => { logout(); close(); navigate('/login'); };
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f7fb] lg:flex">
      <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden"><button type="button" onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100" aria-label="Toggle dashboard navigation" aria-expanded={open}><Menu size={18} /> {label}</button></div>
      <aside className={`${open ? 'block' : 'hidden'} fixed inset-x-0 top-16 z-20 border-b border-white/10 bg-[#111827] shadow-lg lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0 lg:shadow-none`}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5"><div><p className="text-xs font-bold tracking-[0.14em] text-indigo-300">{label.toUpperCase()}</p><p className="mt-1 truncate text-sm font-semibold text-white">{user?.name || user?.email}</p></div><button type="button" onClick={close} className="grid size-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close dashboard navigation"><X size={18} /></button></div>
        <nav className="space-y-1 p-3" aria-label={`${label} navigation`}>{items.map(({ to, label: itemLabel, icon: Icon }) => <NavLink key={to} to={to} end={to === items[0].to} onClick={close} className={linkClass}><Icon size={18} />{itemLabel}</NavLink>)}<button type="button" onClick={handleLogout} className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-200 hover:bg-rose-500/15 hover:text-white"><LogOut size={18} />Logout</button></nav>
      </aside>
      <div className="dashboard-enter min-w-0 flex-1"><Outlet /></div>
    </div>
  );
}
