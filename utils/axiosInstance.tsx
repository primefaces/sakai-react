import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 10000,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        
        const status = error.response?.status;
        console.log(error);

        if (status === 401) {
            console.warn('Неавторизован. Удаляю токен...');
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            localStorage.removeItem('userVisit');
            window.location.href = '/auth/login';
        }

        if (status === 403) {
            console.warn('Не имеет доступ. Перенаправляю...');
            window.location.href = '/';
        }
        
        if (status === 404) {
            console.warn('404 - Перенаправляю...');
            // document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            // localStorage.removeItem('userVisit');
            // window.location.href = '/pages/notfound';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
