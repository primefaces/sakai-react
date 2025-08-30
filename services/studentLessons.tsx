import axiosInstance from '@/utils/axiosInstance';

let url = '';

export const fetchDocuments = async (lesson_id: number | null) => {
    try {
        const res = await axiosInstance.get(`v1/student/course/lesson/documents?lesson_id=${lesson_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchLinks = async (lesson_id: number | null) => {
    try {
        const res = await axiosInstance.get(`v1/student/course/lesson/links?lesson_id=${lesson_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

