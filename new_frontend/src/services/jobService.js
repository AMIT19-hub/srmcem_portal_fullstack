import api from "../api/axios";

const toPortalJob = (job) => ({
  ...job,
  title: job.jobTitle || job.title,
  company: job.companyName || job.company,
  applicationDeadline: job.lastDate || job.applicationDeadline,
  status: String(job.status || '').toUpperCase(),
});

const toJobRequest = (job) => ({
  jobTitle: job.jobTitle || job.title,
  companyName: job.companyName || job.company,
  description: job.description,
  location: job.location,
  salary: job.salary,
  eligibility: job.eligibility,
  skills: job.skills,
  lastDate: job.lastDate || job.applicationDeadline,
});

export const getJobs = () =>
  api.get("/jobs").then((response) => response.data.map(toPortalJob).filter((job) => job.status === 'OPEN'));
export const getMyJobs = () => api.get('/jobs/my').then((response) => response.data.map(toPortalJob));
export const getJobById = (id) =>
  api.get(`/jobs/${id}`).then((response) => toPortalJob(response.data));
export const createJob = (data) =>
  api
    .post("/jobs", toJobRequest(data))
    .then((response) => toPortalJob(response.data));
export const updateJob = (id, data) =>
  api
    .put(`/jobs/${id}`, toJobRequest(data))
    .then((response) => toPortalJob(response.data));
// The existing backend DELETE mapping is a soft close: it sets status=CLOSED and preserves applications.
export const closeJob = (id) =>
  api.delete(`/jobs/${id}`).then((response) => response.data);
