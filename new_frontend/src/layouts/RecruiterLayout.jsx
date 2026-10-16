import { BriefcaseBusiness, FileText, LayoutDashboard, PlusCircle } from 'lucide-react';
import DashboardShell from './DashboardShell';
const items = [{ to: '/recruiter', label: 'Dashboard', icon: LayoutDashboard }, { to: '/recruiter/jobs', label: 'My Jobs', icon: BriefcaseBusiness }, { to: '/recruiter/jobs/create', label: 'Create Job', icon: PlusCircle }, { to: '/recruiter/applications', label: 'Applications', icon: FileText }];
export default function RecruiterLayout() { return <DashboardShell label="Recruiter" items={items} />; }
