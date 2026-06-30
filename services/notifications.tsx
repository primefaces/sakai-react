import axiosInstance from '@/utils/axiosInstance';

export const getNotifications = async () => {
    try {
        const res = await axiosInstance.get(`/v1/notifications`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const statusView = async (notification_id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/notifications/setStatusView?id=${notification_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

// un verifed tasks

export const unVerifedSteps = async () => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/stream/unverified/practical/steps`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};