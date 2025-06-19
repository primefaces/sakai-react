import { AuthBaseType } from "@/types/authBaseType";
import { CourseCreateType } from "@/types/courseCreateType";

let url = '';

type OnlyTitle = Pick<CourseCreateType, 'title'>;

export const fetchCourses = async (token:string | null) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + '/v1/teacher/courses';

    const headers: HeadersInit = token
        ? {
              Authorization: `Bearer ${token}`
          }
        : {};

    try {
        const res = await fetch(url, {
            headers
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Ошибка при получении курсов', err);
        return [];
    }
};

export const addCourse = async (token:string | null, value:CourseCreateType) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + '/v1/teacher/courses/store';
    console.log(value);

    const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};
    
        console.log(value);
        
    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('image', value.image); 
    formData.append('video_url', value.video_url);     

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return [];
    }
};

export const deleteCourse = async (token:string | null, id:number) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/courses/delete?course_id=${id}`;
    console.log(id);
    
    const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Ошибка при удалении курса', err);
        return [];
    }
};

export const updateCourse = async (token: string | null, id:number | null, value) => {
    console.log(value);
    
    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/courses/update?course_id=${id}`;

    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    if (value.image instanceof File) {
        formData.append('image', value.image);
    }
    formData.append('video_url', value.video_url); 
    
    const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении курса', err);
        return [];
    }
};

// Themes 

export const fetchCourseInfo = async (token:AuthBaseType, id:AuthBaseType) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/courses/show?course_id=${id}`;

    const headers: HeadersInit = token
        ? {
              Authorization: `Bearer ${token}`
          }
        : {};

    try {
        const res = await fetch(url, {
            headers
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Ошибка при получении темы', err);
        return [];
    }
};

export const addThemes = async (token:string | null, id:number, value:OnlyTitle) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/lessons/store?course_id=${id}&title=${value}`;
    console.log(value);

    const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};
        
    const formData = new FormData();
    formData.append('title', value);
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Ошибка при добавлении темы', err);
        return [];
    }
};

export const fetchThemes = async (token:string | null, id:number) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/lessons?course_id=${id}`;

    const headers: HeadersInit = token
        ? {
              Authorization: `Bearer ${token}`
          }
        : {};

    try {
        const res = await fetch(url, {
            headers
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Ошибка при получении темы', err);
        return [];
    }
};

export const updateThems = async (token: string | null, course_id:number | null, theme_id: number, value:CourseCreateType) => {
    console.log(value);
    
    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/lessons/update?course_id=${course_id}&title=${value}&lesson_id=${theme_id}`;

    const formData = new FormData();
    formData.append('title', value.title);
    
    const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении темы', err);
        return [];
    }
};

export const deleteTheme = async (token:string | null, id:number) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/lessons/delete?lesson_id=${id}`;
    console.log(id);
    
    const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return [];
    }
};