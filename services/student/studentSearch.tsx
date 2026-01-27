import axiosInstance from '@/utils/axiosInstance';

export const fetchStudentsForTeacher = async (search: string) => {
    try {
        const res = await axiosInstance.get(`/v1/search/students?search=${search}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchStudentSearchDetail = async (id_student: number) => {
    try {
        const res = await axiosInstance.get(`/v1/search/studentInfo?id_student=${id_student}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchStudentSearchImg = async (id_student: number) => {
    try {
        const res = await axiosInstance.get(`/v1/search/studentImage?id_student=${id_student}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

//
export const fetchSpeciality = async (id: number | null) => {
    try {
        const res = await axiosInstance.get(`/open/getspecialitywithidfaculty?id_faculty=${id}`, {
            baseURL: process.env.NEXT_PUBLIC_FACULTY_API
        });
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};
