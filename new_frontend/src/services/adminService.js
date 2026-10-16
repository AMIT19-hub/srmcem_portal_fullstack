import api from '../api/axios';

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
};

const getAdminList = (endpoint) => api.get(endpoint).then((response) => extractList(response.data));
const toAdminJob = (job) => ({
  ...job,
  title: job.jobTitle || job.title,
  company: job.companyName || job.company,
  recruiterName: job.recruiter?.name || job.recruiterName,
});

const toAdminApplication = (application) => ({
  ...application,
  studentName: application.student?.name || application.studentName,
  studentEmail: application.student?.email || application.studentEmail,
  jobTitle: application.job?.jobTitle || application.job?.title || application.jobTitle,
  company: application.job?.companyName || application.job?.company || application.company,
  recruiterName: application.job?.recruiter?.name || application.recruiterName,
  applicationDate: application.appliedAt || application.applicationDate,
  status: String(application.status || '').toUpperCase(),
});

export const getAdminUsers = () => getAdminList('/admin/users');
export const getAdminStudents = () => getAdminUsers().then((users) => users.filter((user) => String(user.role).toUpperCase() === 'STUDENT'));
export const getAdminRecruiters = () => getAdminUsers().then((users) => users
  .filter((user) => String(user.role).toUpperCase() === 'RECRUITER')
  .map((user) => ({ ...user, company: user.company || user.name })));
export const getAdminApplications = () => getAdminList('/admin/applications').then((applications) => applications.map(toAdminApplication));
export const getAdminJobs = () => getAdminList('/admin/jobs').then((jobs) => jobs.map(toAdminJob));
export const getAdminStudent = (userId) => api.get(`/admin/students/${userId}`).then((response) => response.data);
export const getAdminRecruiter = (userId) => api.get(`/admin/recruiters/${userId}`).then((response) => response.data);
export const setUserActive = (userId, active) => api.put(`/admin/users/${userId}/${active ? 'activate' : 'deactivate'}`).then((response) => response.data);
