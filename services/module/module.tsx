import axiosInstance from '@/utils/axiosInstance';
import { Nullable } from 'primereact/ts-helpers';

export const fetchModuleShedule = async (id_specialities: number[], period: number | null, semester: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/schedule/module`, {
            params: {
                id_specialities: id_specialities,
                id_period: period ? period : null,
                id_semester: semester
            }
        });
        return res.data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

export const fetchSemestr = async () => {
    try {
        const res = await axiosInstance.get('/open/semester', {
            baseURL: process.env.NEXT_PUBLIC_FACULTY_API
        });
        return res.data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

export const sheduleSave = async (from: Nullable<Date>, to: Nullable<Date>, id_period: number | null, id_semester: number | null, id_specialities: number[] | null, id_streams: number[] | null) => {
    const uniq = new Set(id_streams);
    const id_streamsUniq = Array.from(uniq);
    const payload = {
        from: from,
        id_period: id_period,
        id_semester: id_semester,
        id_specialities: id_specialities,
        id_streams: id_streamsUniq,
        to: to
    };
    try {
        const res = await axiosInstance.post('/v1/schedule/module/adjusting', payload);
        return res.data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

export const sheduleDiactivate = async (id_period: number | null, id_semester: number | null, id_speciality: number | null, id_stream: number | null) => {
    const payload = {
        id_period: id_period,
        id_semester: id_semester,
        id_speciality: id_speciality,
        id_stream: id_stream
    };

    console.log(payload);

    try {
        const res = await axiosInstance.post('/v1/schedule/module/deactivate', payload);
        return res.data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

// update date
export const dateUpdate = async (from: Nullable<Date>, to: Nullable<Date>, id_period: number | null, id_semester: number | null, id_streamParam: number | null, id_specialityParam: number | null) => {
    const id_speciality = id_specialityParam;
    const id_stream = id_streamParam;
    let payload = null;
    if(id_speciality){
        payload = { from: from, id_period: id_period, id_semester: id_semester, id_speciality, to: to };
    } else if(id_stream){
        payload = { from: from, id_period: id_period, id_semester: id_semester, id_stream, to: to };
    }

    console.log(payload);

    try {
        const res = await axiosInstance.post('/v1/schedule/module/change-data', payload);
        return res.data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};
