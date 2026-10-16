import axiosInstance from '@/utils/axiosInstance';

export const forumDetails = async (forum_id: number | null, currentPage: number | null) => {
    const current_page = currentPage != null ? currentPage + 1 : null;
    
    try {
        const res = await axiosInstance.get(`/v1/student/forum-details?forum_id=${forum_id}&page=${current_page}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const addForumMessage = async (step_id : number, parent_id : number | null, description: string) => {
    const value = {
        'step_id': step_id,
        'description': description,
        'parent_id': parent_id,
    }

    try {
        const res = await axiosInstance.post(`/v1/student/forum-details`, value);

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении', err);
        return err;
    }
};

export const forumDetailsShow = async (id: number | null) => {
    
    try {
        const res = await axiosInstance.get(`/v1/student/forum-details/show?id=${id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const updateMessageForum = async (id : number | null, description: string) => {
    console.log('ehalllo');
    
    const value = {
        'id': id,
        'description': description,
    }

    try {
        const res = await axiosInstance.put(`/v1/student/forum-details/update`, value);

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении', err);
        return err;
    }
};

export const deleteMessageForum = async (id: number) => {
    try {
        const res = await axiosInstance.delete(`/v1/student/forum-details/destroy?id=${id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении', err);
        return err;
    }
};