const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('taskTrackToken');

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
