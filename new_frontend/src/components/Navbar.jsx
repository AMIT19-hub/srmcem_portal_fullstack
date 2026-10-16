import { ChevronDown, LayoutDashboard, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/srmcemlogo.png';
import { useAuth } from '../context/AuthContext';
import { getRecruiterProfile, getStudentProfile, PROFILE_UPDATED_EVENT } from '../services/profileService';
import ProfileAvatar from './ProfileAvatar';

const dashboardPaths = {
  STUDENT: '/student',
  RECRUITER: '/recruiter',
  ADMIN: '/admin',
};

const profilePaths = { STUDENT: '/student/profile', RECRUITER: '/recruiter/profile', ADMIN: '/admin/profile' };
const navLinkClass = ({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`;

export default function Navbar() {
  const { isAuthenticated, role, user, logout, profileImageUrl, profileImageLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileState, setProfileState] = useState({ role: null, email: null, data: null });
  const [profileFetchState, setProfileFetchState] = useState({ role: null, email: null, done: false });
  const menuRef = useRef(null);
  const profileRevisionRef = useRef(0);
  const navigate = useNavigate();
  const dashboardPath = dashboardPaths[role];
  const profilePath = profilePaths[role];
  const profile = profileState.role === role && profileState.email === user?.email ? profileState.data : null;
  const profileLoading = isAuthenticated && ['STUDENT', 'RECRUITER'].includes(role)
    && !profile
    && !(profileFetchState.role === role && profileFetchState.email === user?.email && profileFetchState.done);
  const displayUser = { ...user, ...profile, name: profile?.name || (role === 'ADMIN' ? null : user?.name), email: profile?.email || user?.email };

  useEffect(() => {
    let active = true;
    const revisionAtRequest = profileRevisionRef.current;
    const load = role === 'STUDENT' ? getStudentProfile : role === 'RECRUITER' ? getRecruiterProfile : null;
    if (isAuthenticated && load) load().then((data) => {
      if (import.meta.env.DEV) console.debug('[profile] profile response received', { role, fields: Object.keys(data || {}), profileImagePath: data?.profileImagePath || null });
      if (active && profileRevisionRef.current === revisionAtRequest) {
        setProfileState((current) => ({ role, email: user?.email, data: current.role === role && current.email === user?.email ? { ...current.data, ...data } : data }));
      }
      if (active) setProfileFetchState({ role, email: user?.email, done: true });
    }).catch((error) => {
      if (import.meta.env.DEV) console.debug('[profile] profile request failed', { role, status: error?.response?.status || null });
      if (active) setProfileFetchState({ role, email: user?.email, done: true });
    });
    return () => { active = false; };
  }, [isAuthenticated, role, user?.email]);

  useEffect(() => {
    const onProfileUpdated = (event) => {
      const { role: updatedRole, profile: updatedProfile } = event.detail || {};
      if (updatedRole !== role || !updatedProfile) return;
      profileRevisionRef.current += 1;
      setProfileState((current) => {
        const updates = Object.fromEntries(Object.entries(updatedProfile).filter(([, value]) => value !== undefined && value !== null));
        const sameAccount = current.role === role && current.email === user?.email;
        return { role, email: user?.email, data: sameAccount ? { ...current.data, ...updates } : updates };
      });
    };
    window.addEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);
    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);
    };
  }, [role, user?.email]);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const onPointerDown = (event) => { if (!menuRef.current?.contains(event.target)) setProfileOpen(false); };
    const onKeyDown = (event) => { if (event.key === 'Escape') setProfileOpen(false); };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  }, [profileOpen]);

  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 text-slate-900 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3 text-slate-900">
          <img src={logo} alt="Shri Ramswaroop Memorial College of Management logo" className="size-10 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-0.5" />
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-wide">SRMCEM</span>
            <span className="block text-xs font-medium text-slate-500">Placement Portal</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="grid size-9 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          title={isOpen ? 'Close navigation' : 'Open navigation'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav
          className={`${isOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-16 flex-col gap-1 border-b border-slate-200 bg-white p-3 shadow-lg md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
          aria-label="Main navigation"
        >
          <NavLink to="/" onClick={closeMenu} className={navLinkClass} end>
            Home
          </NavLink>
          {isAuthenticated ? <>
            <NavLink to={dashboardPath} onClick={closeMenu} className={navLinkClass}><LayoutDashboard size={16} className="mr-1 inline" />Dashboard</NavLink>
          </> : (
            <>
              <NavLink to="/login" onClick={closeMenu} className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={closeMenu}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
        {isAuthenticated && <div className="relative shrink-0" ref={menuRef}>
          <button type="button" aria-label="Open account menu" aria-haspopup="true" aria-controls="account-menu" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 rounded-full p-1 pr-2 text-left hover:bg-slate-100">
            <ProfileAvatar name={displayUser.name} email={displayUser.email} image={displayUser.profileImagePath} imageUrl={profileImageUrl} loading={profileLoading || profileImageLoading} />
            <span className="hidden max-w-32 truncate text-sm font-semibold lg:inline">{displayUser.name || displayUser.email}</span><ChevronDown size={15} className="text-slate-500" />
          </button>
          {profileOpen && <div id="account-menu" className="menu-enter absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl">
            <div className="border-b border-slate-100 px-3 py-3"><p className="truncate text-sm font-bold text-[#102747]">{displayUser.name || 'Account'}</p><p className="truncate text-xs text-slate-500">{displayUser.email}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">{role}</p></div>
            <Link to={profilePath} onClick={() => { setProfileOpen(false); closeMenu(); }} className="mt-1 flex items-center gap-2 px-3 py-2.5 text-sm font-semibold hover:bg-slate-50"><UserRound size={16} />View Profile</Link>
            {role !== 'ADMIN' && <Link to={profilePath} onClick={() => { setProfileOpen(false); closeMenu(); }} className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold hover:bg-slate-50"><UserRound size={16} />Edit Profile</Link>}
            <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2.5 text-left text-sm font-semibold text-[#c6283d] hover:bg-rose-50"><LogOut size={16} />Logout</button>
          </div>}
        </div>}
      </div>
    </header>
  );
}
