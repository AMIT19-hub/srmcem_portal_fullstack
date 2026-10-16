import api from '../api/axios';

const toPortalApplication = (application) => {
  const job = application.job
    ? {
        ...application.job,
        title: application.job.title || application.job.jobTitle,
        company: application.job.company || application.job.companyName,
      }
    : null;

  return {
    ...application,
    job,
    jobId: application.jobId ?? job?.id,
    jobTitle: application.jobTitle || job?.title,
    company: application.company || job?.company,
    appliedDate: application.appliedDate || application.applicationDate || application.appliedAt,
    applicantName: application.applicantName || application.studentName || application.student?.name || application.student?.fullName,
    applicantEmail: application.applicantEmail || application.email || application.student?.email,
    status: String(application.status || '').toUpperCase(),
  };
};

export const applyForJob = (jobId) => api.post(`/applications/${jobId}`).then((response) => toPortalApplication(response.data));
export const getMyApplications = () => api.get('/applications/my').then((response) => response.data.map(toPortalApplication));
export const getJobApplications = (jobId) => api.get(`/applications/job/${jobId}`).then((response) => response.data.map(toPortalApplication));
export const getRecruiterApplications = () => api.get('/applications/recruiter/my').then((response) => response.data.map(toPortalApplication));
export const updateApplicationStatus = (applicationId, status) => api
  .put(`/applications/${applicationId}/status`, null, { params: { status } })
  .then((response) => toPortalApplication(response.data));
export const withdrawApplication = (applicationId) => api.delete(`/applications/${applicationId}`).then((response) => response.data);
export const downloadApplicantResume = (applicationId) => api.get(`/applications/${applicationId}/resume`, { responseType: 'blob' });
