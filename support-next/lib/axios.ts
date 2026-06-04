import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear token and redirect — works anywhere in the app
      document.cookie = 'auth_token=; path=/; max-age=0';
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Cookie helper
function getTokenFromCookie(): string | undefined {
  return document.cookie
    .split(';')
    .find((c) => c.trim().startsWith('auth_token='))
    ?.split('=')[1];
}
