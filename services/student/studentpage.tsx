import axiosInstance from "@/utils/axiosInstance";

export const fetchStudentImg = async () => {
    try {
        const res = await axiosInstance.get(`/v1/student/image`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};