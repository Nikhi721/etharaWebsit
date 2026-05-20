const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_COOKIE_NAME = 'taskTrackToken';
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const getCookieValue = (name) =>
  document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');

const getToken = () => getCookieValue(TOKEN_COOKIE_NAME);

export const saveAuthToken = (token) => {
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${TOKEN_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secureFlag}`;
  localStorage.removeItem(TOKEN_COOKIE_NAME);
};

export const clearAuthToken = () => {
  document.cookie = `${TOKEN_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
  localStorage.removeItem(TOKEN_COOKIE_NAME);
};

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),
  getStaff: () => request('/staff'),
  createStaff: (payload) => request('/staff', { method: 'POST', body: JSON.stringify(payload) }),
  deleteStaff: (id) => request(`/staff/${id}`, { method: 'DELETE' }),
  getProjects: () => request('/projects'),
  createProject: (payload) => request('/projects', { method: 'POST', body: JSON.stringify(payload) }),
  createTask: (payload) => request('/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  getTasks: () => request('/tasks/me')
};
