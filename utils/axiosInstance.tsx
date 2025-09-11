import axios from 'axios';
import { getToken } from './auth';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 30000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        
        const status = error.response?.status;
        console.log('Ошибка из axiosInstance ', error);

        if (status === 401) {
            console.warn('Неавторизован. Удаляю токен...');
            window.location.href = '/auth/login';
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            localStorage.removeItem('userVisit');
        }

        if (status === 403) {
            window.location.href = '/';
            console.warn('Не имеет доступ. Перенаправляю...');
        }
        
        if (status === 404) {
            console.warn('404 - Перенаправляю...');
            window.location.href = '/pages/notfound';
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            localStorage.removeItem('userVisit');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
