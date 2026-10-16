import AdminDataPage from './AdminDataPage';
import { getAdminApplications } from '../../services/adminService';

export default function AdminApplications() { return <AdminDataPage title="Applications" fetchItems={getAdminApplications} emptyMessage="No applications found." searchFields={['studentName', 'studentEmail', 'jobTitle', 'company', 'recruiterName', 'status']} columns={[{ label: 'Application ID', key: 'id' }, { label: 'Student', key: 'studentName' }, { label: 'Student Email', key: 'studentEmail' }, { label: 'Job', key: 'jobTitle' }, { label: 'Company', key: 'company' }, { label: 'Recruiter', key: 'recruiterName' }, { label: 'Applied Date', key: 'applicationDate', type: 'date' }, { label: 'Status', key: 'status', type: 'status' }]} />; }
