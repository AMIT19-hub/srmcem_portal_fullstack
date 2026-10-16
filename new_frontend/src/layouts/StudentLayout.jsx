import { BriefcaseBusiness, FileText, GraduationCap } from 'lucide-react';
import DashboardShell from './DashboardShell';
const items = [{ to: '/student', label: 'Home', icon: GraduationCap }, { to: '/jobs', label: 'Jobs', icon: BriefcaseBusiness }, { to: '/student/applications', label: 'My Applications', icon: FileText }];
export default function StudentLayout() { return <DashboardShell label="Student" items={items} />; }
