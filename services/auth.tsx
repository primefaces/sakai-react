import axiosInstance from '@/utils/axiosInstance';
import { LoginType } from "@/types/login";

let url = '';

//      const params = new URLSearchParams({
//     category_id: String(id),
//     active: '' + param.active,
//     ending: '' + param.ending,
// });

export const login = async (value:LoginType) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + '/login?';
    
    try {
        const res = await axiosInstance.post('/login?', value);
        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при авторизации', err);
        return [];
    }
};

export const getUser = async () => {
    url = process.env.NEXT_PUBLIC_BASE_URL + '/v1/user';
    
    try {
        const res = await axiosInstance.get(url);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении пользователя', err);
        return [];
    }
};
