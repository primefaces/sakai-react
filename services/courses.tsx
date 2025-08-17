import { CourseCreateType } from '@/types/courseCreateType';
import { lessonStateType } from '@/types/lessonStateType';
import axiosInstance from '@/utils/axiosInstance';

let url = '';

export const fetchCourses = async (token: string | null, page: number | null, limit: number | null) => {
    try {
        console.log('Номер запрашиваемой страницы ', page);

        const res = await axiosInstance.get(`/v1/teacher/courses?page=${Number(page)}&limit=${''}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
};

export const addCourse = async (token: string | null, value: CourseCreateType) => {
    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('image', String(value.image));
    formData.append('video_url', value.video_url);

    try {
        const res = await axiosInstance.post(`/v1/teacher/courses/store`, formData, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('Урок: ', res.data);

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

export const deleteCourse = async (token: string | null, id: number) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/courses/delete?course_id=${id}`;

    try {
        const res = await axiosInstance.delete(`/v1/teacher/courses/delete?course_id=${id}`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(res.data);
        return res.data;
    } catch (err) {
        console.log('Ошибка при удалении курса', err);
        return err;
    }
};

export const updateCourse = async (token: string | null, id: number | null, value: CourseCreateType) => {
    console.log(value);

    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/courses/update?course_id=${id}`;

    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    if (value.image instanceof File) {
        formData.append('image', value.image);
    }
    formData.append('video_url', value.video_url);

    try {
        const res = await axiosInstance.post(`/v1/teacher/courses/update?course_id=${id}`, formData, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении курса', err);
        return err;
    }
};

// Themes

export const fetchCourseInfo = async (token: string | null, id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/courses/show?course_id=${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении темы', err);
        return err;
    }
};

export const addThemes = async (token: string | null, id: number, value: string) => {
    const formData = new FormData();
    formData.append('title', value);

    try {
        const res = await axiosInstance.post(`/v1/teacher/lessons/store?course_id=${id}&title=${value}`, formData, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при добавлении темы', err);
        return err;
    }
};

export const fetchThemes = async (token: string | null, id: number) => {
    try {
        const res = await axiosInstance(`/v1/teacher/lessons?course_id=${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении темы', err);
        return err;
    }
};

export const updateTheme = async (token: string | null, course_id: number | null, theme_id: number | null, value: CourseCreateType) => {
    const formData = new FormData();
    formData.append('title', value.title);

    try {
        const res = await axiosInstance.post(`/v1/teacher/lessons/update?course_id=${course_id}&title=${value}&lesson_id=${theme_id}`, formData, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении темы', err);
        return err;
    }
};

export const deleteTheme = async (token: string | null, id: number) => {
    try {
        const res = await axiosInstance.delete(`/v1/teacher/lessons/delete?lesson_id=${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

// Lessons

export const addLesson = async (
    type: string, 
    token: string | null, 
    courseId: number | null, 
    lessonId: number | null, 
    value: lessonStateType | string, 
    title: lessonStateType | string) => {

    let formData = new FormData();
    console.log(value, title);
    let headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    let url = '';
    let body: lessonStateType | string | FormData = value;

    if (type === 'text') {
        url = `/v1/teacher/textcontent/store?course_id=${courseId}&lesson_id=${lessonId}&content=${value}`;
        headers['Content-Type'] = 'application/json';
        body = value;
    } else if(type === 'doc' && (typeof value === 'object') && value !== null){
        url = `/v1/teacher/document/store?lesson_id=${lessonId}`;
        formData.append('lesson_id', String(lessonId));
        if(value.file){
            formData.append('document', value.file && value.file);
        }
        formData.append('title', String(title)); 
        formData.append('description', String(value?.description)); 
        body = formData;
    } else if(type === 'url' && typeof value === 'object' && value !== null){
        url = `v1/teacher/usefullinks/store?lesson_id=${lessonId}&title=${title}&description=${value.description}&url=${value.url}`;
        formData.append('lesson_id', String(lessonId));
        formData.append('document', String(value?.url)); 
        formData.append('title', String(title)); 
        formData.append('description', String(value?.description)); 
        body = formData;
    } 

    try {
        const res = await axiosInstance.post(url, body, {
            headers
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при добавлении урока', err);
        return err;
    }
};

export const fetchLesson = async (type: string, token: string | null, courseId: number | null, lessonId: number | null) => {
    let url = '';
    let formData = new FormData();

    if (type === 'text') {
        url = `/v1/teacher/textcontent?course_id=${courseId}&lesson_id=${lessonId}`;
    } else if (type === 'doc') {
        url = `/v1/teacher/document?lesson_id=${lessonId}`
        // formData.append('title', value.title);   
        // formData.append('description', value.description);
    }

    try {
        const res = await axiosInstance.get(
            url,

            {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }
        );

        // const data = await res();
        console.log('Урок: ', res.data);

        return res.data;
    } catch (err) {
        console.log('Ошибка при получении урока', err);
        return err;
    }
};

export const deleteLesson = async (type:string, token: string | null, courseId: number | null, lesson_id: number | null, content_id: number | null) => {
    let url = '';
    // console.log('content id: ', content_id);
    
    if (type === 'text') {
        url = `/v1/teacher/textcontent/delete?course_id=${courseId}&lesson_id=${lesson_id}&content_id=${content_id}`;
    } else if(type === 'doc'){
        url = `/v1/teacher/document/delete?lesson_id=${lesson_id}&document_id=${content_id}`;
    } else if(type === 'url'){
        url = `/v1/teacher/document/delete?lesson_id=${lesson_id}&document_id=${content_id}`;
    } 
    
    try {
        const res = await axiosInstance.delete(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении урока', err);
        return err;
    }
};

export const updateLesson = async (type: string, token: string | null, course_id: number | null, lesson_id: number | null, contentId: number | null, value: any) => {
    console.log(contentId, value);
    let headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    let formData = new FormData();
    let url = '';

    let body = value;
    if (type === 'text') {
        url = `/v1/teacher/textcontent/update?course_id=${course_id}&lesson_id=${lesson_id}&content_id=${contentId}&content=${value}`;
        headers['Content-Type'] = 'application/json';
    } else if(type === 'doc'){
        url = `/v1/teacher/document/update?lesson_id=${lesson_id}&document_id=${contentId}&document=${value.file}`;
        formData.append('lesson_id', String(lesson_id));
        formData.append('document', value.file);
        formData.append('document_id', String(contentId));
        formData.append('title', String(value.title)); 
        formData.append('description', String(value.description)); 
        body = formData;
    } else if(type === 'url'){
        url = `/v1/teacher/document/update?lesson_id=${lesson_id}&document_id=${contentId}&document=${value.file}`;
        formData.append('lesson_id', String(lesson_id));
        formData.append('url?', value.file);
        formData.append('url_id?', String(contentId));
        formData.append('title', String(value.title)); 
        formData.append('description', String(value.description)); 
        body = formData;
    }

    try {
        const res = await axiosInstance.post(url, body, {
            // headers: token ? { Authorization: `Bearer ${token}` } : {}
            headers
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении урока', err);
        return err;
    }
};