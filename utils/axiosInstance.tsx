import axios from 'axios';
import { getToken } from './auth';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 30000
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
        if (status === 401) {
            console.warn('Неавторизован. Удаляю токен...');
            if (typeof window !== 'undefined') {
                console.log(window.location.pathname != '/auth/login');
                if(window.location.pathname != '/auth/login') window.location.href = '/auth/login';
                localStorage.removeItem('userVisit');
            }
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        }

        if (status === 403) {
            console.warn('Не имеет доступ. Перенаправляю...');
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }

        if (status === 404) {
            console.warn('404 - Перенаправляю...');
            if (typeof window !== 'undefined') {
                window.location.href = '/pages/notfound';
                localStorage.removeItem('userVisit');
            }
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
