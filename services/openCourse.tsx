import axiosInstance from '@/utils/axiosInstance';

export const fetchOpenCourses = async (page: number, audence_type_id: number | string, search: string) => {
    try {
        const res = await axiosInstance.get(`/open/courses?course_audience_type_id=${audence_type_id}&${search?.length > 0 ? `search=${search}` : 'search='}&page=${page}&limit=1`);
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
