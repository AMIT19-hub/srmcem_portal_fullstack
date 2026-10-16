import AdminProfileDetails from './AdminProfileDetails';
import { getAdminRecruiter } from '../../services/adminService';

const fields = [['id', 'User ID'], ['name', 'Name'], ['email', 'Email'], ['active', 'Account status'], ['companyName', 'Company name'], ['designation', 'Designation'], ['mobileNumber', 'Mobile number'], ['profileImagePath', 'Profile image']];

export default function AdminRecruiterProfile() {
  return <AdminProfileDetails title="Recruiter" fields={fields} fetchProfile={getAdminRecruiter} />;
}
