import axios from 'axios';
import { getValidAccessToken, clearTokens } from '@/entities/session/model/authStorage';
import { runUnauthorizedHandler } from './unauthorized';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20_000,
});

httpClient.interceptors.request.use((config) => {
  const token = getValidAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearTokens();         // access-only logout
      runUnauthorizedHandler(); // редирект на /login + очистка react-query кэша
    }
    return Promise.reject(err);
  },
);
