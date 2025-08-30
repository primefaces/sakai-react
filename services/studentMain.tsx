import axiosInstance from '@/utils/axiosInstance';

export const fetchItemsLessons = async () => {
    try {
        const res = await axiosInstance.get(`v1/student/streams`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchItemsConnect = async () => {
    try {
        const res = await axiosInstance.get(`v1/student/stream/connect`);
        const data = await res.data;
        console.log(data);
        
        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const itemsCourseInfo = async (course_id: number | null, stream_id: number | null ) => {

    try {
        const res = await axiosInstance.get(`v1/student/course?course_id=${course_id}&stream_id=${stream_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
}

// student theme fetch
export const fetchStudentThemes = async (course_id: number) => {    
    try {
        const res = await axiosInstance.get(`v1/student/course/lessons?course_id=${course_id}`);
        const data = await res.data;
        
        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

// fetch student lesson main info
export const fetchMainLesson = async (lesson_id: number | null) => {    
    console.log(lesson_id);
    
    try {
        const res = await axiosInstance.get(`v1/student/course/lesson/show?lesson_id=${lesson_id}`);
        const data = await res.data;
        
        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};


// export const addCourse = async (value: CourseCreateType) => {
//     const formData = new FormData();
//     formData.append('title', value.title);
//     formData.append('description', value.description);
//     if (value.image instanceof File) {
//         formData.append('image', value.image);
//     }
//     formData.append('video_url', value.video_url);
    
//     try {
//         const res = await axiosInstance.post(`/v1/teacher/courses/store`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });

//         return res.data;
//     } catch (err) {
//         console.log('Ошибка при добавлении курса', err);
//         return err;
//     }
// };

// export const deleteCourse = async (id: number) => {
//     url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/courses/delete?course_id=${id}`;

//     try {
//         const res = await axiosInstance.delete(`/v1/teacher/courses/delete?course_id=${id}`, {
//             headers: {'Content-Type': 'multipart/form-data'}
//         });

//         console.log(res.data);
//         return res.data;
//     } catch (err) {
//         console.log('Ошибка при удалении курса', err);
//         return err;
//     }
// };

// export const updateCourse = async (id: number | null, value: CourseCreateType) => {
//     console.log(value);

//     url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/courses/update?course_id=${id}`;

//     const formData = new FormData();
//     formData.append('title', value.title);
//     formData.append('description', value.description);
//     if (value.image instanceof File) {
//         formData.append('image', value.image);
//     }
//     formData.append('video_url', value.video_url);

//     try {
//         const res = await axiosInstance.post(`/v1/teacher/courses/update?course_id=${id}`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });

//         const data = await res.data;
//         return data;
//     } catch (err) {
//         console.log('Ошибка при обновлении курса', err);
//         return err;
//     }
// };