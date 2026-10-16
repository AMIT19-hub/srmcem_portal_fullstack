import AdminDataPage from './AdminDataPage';
import { getAdminJobs } from '../../services/adminService';

export default function AdminJobs() { return <AdminDataPage title="Jobs" fetchItems={getAdminJobs} emptyMessage="No jobs available." searchFields={['title', 'company', 'recruiterName', 'location']} columns={[{ label: 'Job ID', key: 'id' }, { label: 'Job Title', key: 'title' }, { label: 'Company', key: 'company' }, { label: 'Recruiter', key: 'recruiterName' }, { label: 'Location', key: 'location' }]} />; }
