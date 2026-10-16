import { BriefcaseBusiness, FileText, LayoutDashboard, UsersRound, UserRound } from 'lucide-react';
import DashboardShell from './DashboardShell';
const items = [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard }, { to: '/admin/users', label: 'Users', icon: UserRound }, { to: '/admin/recruiters', label: 'Recruiters', icon: UsersRound }, { to: '/admin/students', label: 'Students', icon: UsersRound }, { to: '/admin/jobs', label: 'Jobs', icon: BriefcaseBusiness }, { to: '/admin/applications', label: 'Applications', icon: FileText }];
export default function AdminLayout() { return <DashboardShell label="Administration" items={items} />; }
