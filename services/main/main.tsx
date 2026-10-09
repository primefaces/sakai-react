import axiosInstance from '@/utils/axiosInstance';

export const mainPageStatistics = async () => {
    
    try {
        const res = await axiosInstance.get(`/open/main/page/details`);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении статистики', err);
        return err;
    }
};
