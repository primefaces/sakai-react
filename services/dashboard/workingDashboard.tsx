import axiosInstance from "@/utils/axiosInstance";

export const fetchTeacherDashboard = async () => {
    
    try {
        const res = await axiosInstance.get('/v1/teacher/dashboard');
        
        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return [];
    }
};