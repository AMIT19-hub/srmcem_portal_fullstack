import AdminDataPage from './AdminDataPage';
import { getAdminStudents } from '../../services/adminService';

export default function AdminStudents() { return <AdminDataPage title="Students" fetchItems={getAdminStudents} emptyMessage="No students found." searchFields={['name', 'email']} columns={[{ label: 'Student ID', key: 'id' }, { label: 'Student Name', key: 'name' }, { label: 'Email', key: 'email' }]} />; }
