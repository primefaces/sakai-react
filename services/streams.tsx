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

export const connectStreams = async (value: { stream: streamsType[] }) => {
    // export const connectStreams = async (value: { course_id: number | null; id_stream: number | null }) => {
    try {
        const res = await axiosInstance.post(`/v1/teacher/stream/store`, value);

        return res.data;
    } catch (err) {
        console.log('Ошибка при связке', err);
        return err;
    }
};

export const newConnectStreams = async (value: { course_id: number | null; id_stream: number | null; active: boolean }) => {
    try {
        const res = await axiosInstance.post(`/v1/teacher/stream/connect/course`, value);

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

// student detail

export const fetchStudentDetail = async (lesson_id: number | null, connect_id: number | null, stream_id: number | null, student_id: number | null, step_id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/stream/student/details?lesson_id=${lesson_id}&connect_id=${connect_id}&id_stream=${stream_id}&id_student=${student_id}&step_id=${step_id}`);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
};

// student calendar contribution
export const fetchStudentCalendar = async (connect_id: number | null, stream_id: number | null, student_id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/stream/student/calendar/movements?connect_id=${connect_id}&id_stream=${stream_id}&id_student=${student_id}`);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
};

export const pacticaScoreAdd = async (connect_id: number | null, stream_id: number | null, student_id: number | null, step_id: number, score: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/stream/student/step/record/score?connect_id=${connect_id}&id_stream=${stream_id}&id_student=${student_id}&step_id=${step_id}&score=${score}`);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return error;
    }
};

export const pacticaDisannul = async (id_curricula: number | null, course_id: number | null, stream_id: number | null, student_id: number | null, step_id: number, message: string) => {
    const value = {
        id_student: student_id,
        step_id: step_id,
        stream_id: stream_id,
        course_id: course_id,
        id_curricula: id_curricula,
        message: message
    };

    try {
        const res = await axiosInstance.post(`/v1/teacher/stream/disannul/steps`, value);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return error;
    }
};

// myedu score info fetch
export const fetchScoreValues = async (stream_id: number | null, student_id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/export/info?id_stream=${stream_id}&id_student=${student_id}`);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return error;
    }
};

// myedu score send
export const sendMyeduScore = async (id_stream: number | null, id_student: number | null, point: number | null) => {
    const value = {
        id_student,
        id_stream,
        point
    };

    try {
        const res = await axiosInstance.post(`/v1/teacher/export/score`, value);
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return error;
    }
};
