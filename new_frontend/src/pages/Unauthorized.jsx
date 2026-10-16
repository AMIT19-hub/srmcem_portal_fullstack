import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const dashboardPaths = { STUDENT: '/student', RECRUITER: '/recruiter', ADMIN: '/admin' };

export default function Unauthorized() {
  const { isAuthenticated, role } = useAuth();
  const returnPath = isAuthenticated ? dashboardPaths[role] : '/login';

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-xl border-l-4 border-amber-400 bg-white p-8 shadow-sm">
        <ShieldAlert size={34} className="text-amber-600" />
        <h1 className="mt-5 text-3xl font-bold text-slate-950">Access restricted</h1>
        <p className="mt-3 text-slate-600">You do not have permission to access this resource.</p>
        <Link to={returnPath} className="mt-7 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800">
          <ArrowLeft size={17} />
          {isAuthenticated ? 'Return to dashboard' : 'Go to login'}
        </Link>
      </div>
    </section>
  );
}
