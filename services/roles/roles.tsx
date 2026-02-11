import axiosInstance from '@/utils/axiosInstance';
import { create } from 'node:domain';
let url = '';

export const fetchRolesList = async () => {
    url = process.env.NEXT_PUBLIC_BASE_URL + '/roles/list';

    try {
        const res = await axiosInstance.get(url);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении пользователя', err);
        return err;
    }
};

export const fetchRolesUsers = async (page: number, search: string | null, myedu_id: string | null, role_id: number | null, active: boolean | null) => {
    try {
        const res = await axiosInstance.get(
            `/roles/users?search=${search}&myedu_id=${myedu_id ? Number(myedu_id) : 0}&${role_id ? `role_id=${role_id}` : 'role_id='}${role_id ? `${active ? `&active=${active ? 1 : 0}` : '&active='}` : '&active='}${!search ? `&page=${page}` : ''}`
        );

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении пользователя', err);
        return err;
    }
};

export const controlRolesUsers = async (worker_id: number | null, role_id: number | null, active: boolean | null, roleState: { create: boolean; update: boolean; delete: boolean; show: boolean }) => {
    const hasAnyRole = roleState.create || roleState.update || roleState.delete || roleState.show;

    // Итоговое значение (принудительно приводим к Boolean через !!)
    let processingActive = !!hasAnyRole;

    const payload = {
        worker_id,
        role_id,
        active: processingActive,
        create: roleState.create,
        update: roleState.update,
        delete: roleState.delete,
        read: roleState.show
    };

    try {
        const res = await axiosInstance.post(`/roles/control`, payload);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при изменении роля', err);
        return err;
    }
};

export const fetchRolesDepartment = async (page: number, search: string | null, myedu_id: string | null, course_audience_type_id: number | null, active: boolean | null) => {
    try {
        const res = await axiosInstance.get(
            `/roles/department/public?search=${search}&myedu_id=${myedu_id ? Number(myedu_id) : ''}&${course_audience_type_id ? `course_audience_type_id=${Number(course_audience_type_id)}` : 'course_audience_type_id='}${
                course_audience_type_id ? `${active ? `&active=${active ? 1 : 0}` : '&active='}` : '&active='
            }${!search ? `&page=${page}` : ''}`
        );

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении пользователя', err);
        return err;
    }
};

export const controlDepartamentUsers = async (worker_id: number | null, course_audience_type_id: number | null, active: boolean | null) => {
    const payload = {
        worker_id,
        course_audience_type_id,
        active
    };

    try {
        const res = await axiosInstance.post(`/roles/department/public/control`, payload);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при изменении роля', err);
        return err;
    }
};

// teacher checking

export const fetchTeacherCheck = async (page: number | null, search: string | null, myedu_id: string | null, course_audience_type_id: number | null) => {
    try {
        const res = await axiosInstance.get(
            `/v1/teacher/controls/public?search=${search}&${myedu_id ? `myedu_id=${myedu_id}` : 'myedu_id='}&${course_audience_type_id ? `course_audience_type_id=${Number(course_audience_type_id)}` : 'course_audience_type_id='}&page=${page}`
        );

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении пользователей', err);
        return err;
    }
};

// teacher checking pubclic
export const teacherCoursePublic = async (course_id: number | null, publicStatus: number | null, comment: string | null, course_category_id: number | null, language_id: number | null, is_featured: boolean) => {
    const payload = {
        course_id,
        public: publicStatus,
        comment,
        course_category_id: course_category_id,
        language_id: language_id,
        is_featured: is_featured
    };

    try {
        const res = await axiosInstance.post(`/v1/teacher/controls/public`, payload);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при публикации открытого урока', err);
        return err;
    }
};

// departament categoryes
export const depCategoryFetch = async () => {
    try {
        const res = await axiosInstance.get(`/open/course/category`);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

// add
export const depCategoryAdd = async (title: string, description: string) => {
    const payload = {
        title,
        description
    };

    try {
        const res = await axiosInstance.post(`/v1/course/category`, payload);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при создании', err);
        return err;
    }
};

// delete
export const depCategoryDelete = async (id: number | null) => {
    try {
        const res = await axiosInstance.delete(`/v1/course/category/${id}`);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении', err);
        return err;
    }
};

// update
export const depCategoryUpdate = async (id: number | null, title: string, description: string) => {
    const updateData = {
        title: title,
        description: description
    };

    try {
        const res = await axiosInstance.post(`/v1/course/category/${id}`, updateData);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка', err);
        return err;
    }
};

// show
export const depCategoryShow = async (id: number | null) => {
    try {
        const res = await axiosInstance.get(`/open/course/category/show/${id}`);
        // const res = await axiosInstance.get(`/open/course/category/show?id=${id}`);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка', err);
        return err;
    }
};

// departament lang
export const depLangFetch = async () => {
    try {
        const res = await axiosInstance.get(`/open/languages`);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

// departament course check
export const depExamination = async (course_id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/examination/lessons?course_id=${course_id}`);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

// departament course check
export const depExaminationSteps = async (lesson_id: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/examination/lessons/show?lesson_id=${lesson_id}`);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

// reductor fetch
export const fethcReductor = async (page: number, search: string | null, specialityId: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/reducer/student-task?${search ? `&search=${search}` : `page=${page}`}${specialityId ? `&speciality_id=${specialityId}` : ''}`);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

export const fetchStudentData = async (id_student: number) => {    
    try {
        const res = await axiosInstance.get(`/v1/reducer/student-task/info?id_student=${id_student}`);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

export const studentCancel = async (all: boolean, course_id: number , title: string, answer_ids: any, id_student: number, description: string) => {        
    const payload = {
        all,
        course_id,
        title,
        answer_ids,
        id_student,
        description
    };

    try {
        const res = await axiosInstance.post(`/v1/reducer/student-task/cancel`, payload);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};