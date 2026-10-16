export const asList = (value) => Array.isArray(value) ? value : [];
const statusMessages = {
  400: 'Please check the information you entered and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested record could not be found.',
  409: 'This record already exists or conflicts with an existing record.',
  422: 'Some information is invalid. Please review the form and try again.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Something went wrong on the server. Please try again shortly.',
  502: 'The server is temporarily unavailable. Please try again shortly.',
  503: 'The service is temporarily unavailable. Please try again shortly.',
};

const isGenericMessage = (message) => /^(request failed with status code \d+|bad request|unauthorized|forbidden|not found|internal server error)$/i.test(String(message || '').trim());

export const errorText = (error, fallback) => {
  const responseData = error.response?.data;
  const backendMessage = typeof responseData === 'string'
    ? responseData
    : responseData?.message || responseData?.error;

  if (typeof backendMessage === 'string' && backendMessage && !isGenericMessage(backendMessage)) return backendMessage;

  const status = error.response?.status;
  if (status && statusMessages[status]) return statusMessages[status];
  if (status) return `Unable to complete the request (error ${status}). Please try again.`;

  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') return 'Unable to reach the server. Please check your connection and try again.';
  if (error.message && !isGenericMessage(error.message)) return error.message;
  return fallback;
};
export const statusClass = (status) => ({ APPLIED: 'bg-sky-100 text-sky-800', SHORTLISTED: 'bg-amber-100 text-amber-800', REJECTED: 'bg-rose-100 text-rose-800', SELECTED: 'bg-green-100 text-green-800' }[status] || 'bg-slate-100 text-slate-700');
export const formatDate = (value) => value ? String(value).split('T')[0] : 'Not available';
export const isDeadlinePassed = (value) => {
  const deadline = String(value || '').split('T')[0];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return false;
  const today = new Date();
  const todayLocal = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return deadline < todayLocal;
};
