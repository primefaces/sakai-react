import { streamsType } from '@/types/streamType';
import axiosInstance from '@/utils/axiosInstance';

// streams
export const fetchStreams = async (id: number | null) => {
    try {
        const res = await axiosInstance.get(`v1/teacher/stream?course_id=${id}`);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
};

// export const connectStreams = async (value: {stream: streamsType[]}) => {
export const connectStreams = async (value: {course_id: number | null, stream: streamsType[]}) => {
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
    try {
        const res = await axiosInstance.get(`v1/teacher/stream/students?connect_id=${connect_id}&stream_id=${stream_id}`);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
};