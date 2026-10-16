import AdminProfileDetails from './AdminProfileDetails';
import { getAdminStudent } from '../../services/adminService';

const fields = [['id', 'User ID'], ['name', 'Name'], ['email', 'Email'], ['active', 'Account status'], ['course', 'Course'], ['rollNo', 'Roll number'], ['admissionYear', 'Admission year'], ['mobileNumber', 'Mobile number'], ['skills', 'Skills'], ['resumePath', 'Resume'], ['profileImagePath', 'Profile image']];

export default function AdminStudentProfile() {
  return <AdminProfileDetails title="Student" fields={fields} fetchProfile={getAdminStudent} />;
}
