import axiosInstance from '@/utils/axiosInstance';

export const fetchFaculty = async () => {
    try {
        const res = await axiosInstance.get(`/open/faculty`, {
            baseURL: process.env.NEXT_PUBLIC_FACULTY_API
        });
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchKafedra = async (id_faculty: number | null) => {
    try {
        const res = await axiosInstance.get(`/open/kafedra?id_faculty=${id_faculty}`, {
            baseURL: process.env.NEXT_PUBLIC_FACULTY_API
        });
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchDepartament = async (id_kafedra: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/controls/department?id_kafedra=${id_kafedra}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const depCourseInfo = async (course_id:number | null, id_kafedra: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/controls/department/course?course_id=${course_id}&id_kafedra=${id_kafedra}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};