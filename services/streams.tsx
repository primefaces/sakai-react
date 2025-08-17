import axiosInstance from '@/utils/axiosInstance';

let url = '';

// streams
export const fetchStreams = async () => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/courses?page=${Number()}&limit=${''}`);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
};

export const connectStreams = async (value) => {
    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    if (value.image instanceof File) {
        formData.append('image', value.image);
    }
    formData.append('video_url', value.video_url);

    try {
        const res = await axiosInstance.post(`/v1/teacher/courses/store`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return res.data;
    } catch (err) {
        console.log('Ошибка при связке', err);
        return err;
    }
};
