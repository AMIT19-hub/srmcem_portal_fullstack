import api from '../api/axios';

export const PROFILE_UPDATED_EVENT = 'srmcem:profile-updated';

export const publishProfileUpdate = (role, profile) => {
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: { role, profile } }));
};

export const getMyProfileImage = () => api.get('/profile/image', { responseType: 'blob' });

export const getStudentProfile = () => api.get('/student/profile').then(({ data }) => data);
export const updateStudentProfile = (payload) => api.put('/student/profile', payload).then(({ data }) => data);
export const getProfileCompletion = () => api.get('/student/profile-completion').then(({ data }) => data);
export const uploadStudentFile = (endpoint, file, onUploadProgress) => {
  const body = new FormData();
  body.append('file', file);
  return api.post(endpoint, body, { onUploadProgress }).then(({ data }) => data);
};
export const getRecruiterProfile = () => api.get('/recruiter/profile').then(({ data }) => data);
export const updateRecruiterProfile = (payload) => api.put('/recruiter/profile', payload).then(({ data }) => data);
