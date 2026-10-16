import AdminDataPage from './AdminDataPage';
import { getAdminRecruiters } from '../../services/adminService';

export default function AdminRecruiters() { return <AdminDataPage title="Recruiters" fetchItems={getAdminRecruiters} emptyMessage="No recruiters found." searchFields={['name', 'email', 'company']} columns={[{ label: 'Recruiter ID', key: 'id' }, { label: 'Company', key: 'company' }, { label: 'Email', key: 'email' }]} />; }
