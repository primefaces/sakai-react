import axiosInstance from '@/utils/axiosInstance';

let url = '';

// streams
export const fetchStreams = async (id: number | null) => {
    console.log(id);
    
    try {
        const res = await axiosInstance.get(`v1/teacher/stream?course_id=${id}`);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
};

export const connectStreams = async (value) => {
    console.log(value);
    
    // const formData = new FormData();
    // formData.append('title', value.title);
    // formData.append('description', value.description);
    // if (value.image instanceof File) {
    //     formData.append('image', value.image);
    // }
    // formData.append('video_url', value.video_url);

    try {
        const res = await axiosInstance.post(`/v1/teacher/stream/store`, value);

        return res.data;
    } catch (err) {
        console.log('Ошибка при связке', err);
        return err;
    }
};

// students stream

export const fetchStreamStudents = async (connect_id: number | null, stream_id: number | null) => {    
    console.log(connect_id, stream_id);
    
    try {
        const res = await axiosInstance.get(`v1/teacher/stream/students?connect_id=${connect_id}&stream_id=${stream_id}`);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
};