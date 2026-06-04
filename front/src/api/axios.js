import axios from 'axios';

const normalizeApiUrl = (url) => {
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
  baseURL: normalizeApiUrl(process.env.REACT_APP_API_URL || 'http://localhost:5000/api'),
  withCredentials: true,
});

export default api;
