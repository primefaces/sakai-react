import axiosInstance from '@/utils/axiosInstance';

export const fetchOpenCourses = async (page: number, audence_type_id: number | string, search: string, categoryId: number | null, language_id  : number | null) => {
    
    try {
        const res = await axiosInstance.get(`/open/courses?course_audience_type_id=${audence_type_id}&${search?.length > 0 ? `search=${search}` : 'search='}&${categoryId ? `course_category_id=${categoryId}` : 'course_category_id='}&${language_id ? `language_id=${language_id}` : 'language_id='}&page=${page}&limit=`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const openCourseShow = async (course_id: number) => {
    try {
        const res = await axiosInstance.get(`/open/course/show?course_id=${course_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const openCourseSignup = async (course_id: number) => {
    try {
        const res = await axiosInstance.post(`/v1/course/signup`, { course_id: course_id });
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const signupList = async (params: URLSearchParams) => {
    try {
        const res = await axiosInstance.get(`/v1/course/sign/have?${params}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

// active courses

export const fetchActiveCourses = async () => {
    try {
        const res = await axiosInstance.get(`/v1/course/list`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const courseOpen = async (course_id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/course/open?course_id=${course_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchActiveSteps = async (course_id: number | null, lesson_id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/course/open/lesson/show?course_id=${course_id}&lesson_id=${lesson_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchActiveStepsDetail = async (course_id: number | null, step_id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/course/open/step/show?course_id=${course_id}&step_id=${step_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const openCourseTestAdd = async (course_id: number, step_id: number, answers_id: number | null) => {
    const payload = {
        course_id,
        step_id,
        answers_id
    }

    try {
        const res = await axiosInstance.post(`/v1/course/open/step/answer/store`, payload);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const openCoursePracticAdd = async (course_id: number, step_id: number, file: File | null) => {
    const formData = new FormData();
    formData.append('course_id', String(course_id));
    formData.append('step_id', String(step_id));
    if(file){
        formData.append('file', file);
    }
    
    try {
        const res = await axiosInstance.post(`/v1/course/open/step/answer/practical/store`, formData);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const openChillsUpdate = async (course_id: number | null, step_id: number | null, chills: boolean) => {
    let formData = new FormData();
    const forChills = chills ? 1 : 0;
    formData.append('step_id', String(step_id));
    formData.append('course_id', String(course_id));
    formData.append('chills', String(forChills));
    
    try {
        const res = await axiosInstance.post('/v1/course/open/step/chills', formData);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при добавлении урока', err);
        return err;
    }
};

export const fetchOpenStudents = async (course_id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/courses/students?course_id=${course_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchWeeks = async (params: URLSearchParams ) => {
    try {   
        const res = await axiosInstance.get(`/v1/teacher/courses/students/was/wasnt?${params}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

// main page open courses
export const fetchOpenCoursesMainPage = async () => {
    try {
        const res = await axiosInstance.get(`/open/courses/for/main`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};