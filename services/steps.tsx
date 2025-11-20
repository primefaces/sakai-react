import axiosInstance from '@/utils/axiosInstance';

let url = '';

export const fetchTypes = async () => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/courses/content/types`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchSteps = async (lesson_id: number) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/lessons/step?lesson_id=${lesson_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const addLesson = async (value: { lesson_id: number; type_id: number }, step: number | null) => {
    const formData = new FormData();
    formData.append('lesson_id', String(value.lesson_id));
    formData.append('type_id', String(value.type_id));
    formData.append('step', String(step));

    try {
        const res = await axiosInstance.post(`/v1/teacher/lessons/step?lesson_id=${value.lesson_id}&type_id=${value.type_id}&step=${step}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

// fetch steps content

export const fetchElement = async (lesson_id: number, step_id: number) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/lessons/step/content?lesson_id=${lesson_id}&step_id=${step_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const addDocument = async (value: { file: File | null; title: string; description: string }, lesson_id: number, type_id: number, step_id: number) => {
    const formData = new FormData();
    formData.append('lesson_id', String(lesson_id));
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    if (value.file) {
        formData.append('document', value.file && value.file);
    }
    formData.append('title', String(value.title));
    formData.append('description', String(value?.description));

    try {
        const res = await axiosInstance.post(`/v1/teacher/document/store`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

export const deleteDocument = async (lesson_id: number, content_id: number) => {
    try {
        const res = await axiosInstance.delete(`/v1/teacher/document/delete?lesson_id=${lesson_id}&document_id=${content_id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

export const updateDocument = async (token: string | null, lesson_id: number | null, contentId: number | null, type_id: number, step_id: number, value: any) => {
    console.log(contentId, value);
    let headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    let formData = new FormData();
    let url = `/v1/teacher/document/update?lesson_id=${lesson_id}&document_id=${contentId}&document=${value.file}`;

    formData.append('lesson_id', String(lesson_id));
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('lesson_id', String(lesson_id));
    if (value.file) {
        formData.append('document', value.file);
    } else {
        formData.append('document', '');
    }
    formData.append('document_id', String(contentId));
    formData.append('title', String(value.title));
    formData.append('description', String(value.description));

    try {
        const res = await axiosInstance.post(url, formData, {
            headers
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении урока', err);
        return err;
    }
};

// video

export const addVideo = async (value: { file: File | null; title: string; description: string; video_link: string; cover: File | null }, lesson_id: number, videoType: number, type_id: number, step_id: number) => {
    const formData = new FormData();
    url = `v1/teacher/video/store?lesson_id=${lesson_id}&title=${value.title}&description=${value.description}&video_link=${value.video_link}&video_type_id=${videoType}`;
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('lesson_id', String(lesson_id));
    formData.append('video_link', String(value?.video_link));
    formData.append('title', String(value?.title));
    formData.append('description', String(value?.description));
    if (value.cover) {
        formData.append('cover', value?.cover && value?.cover);
    }
    try {
        const res = await axiosInstance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

export const deleteVideo = async (lesson_id: number, content_id: number) => {
    console.log(lesson_id, content_id);

    try {
        const res = await axiosInstance.delete(`/v1/teacher/video/delete?lesson_id=${lesson_id}&video_id=${content_id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

export const updateVideo = async (
    token: string | null,
    value: { title: string; description: string | null; video_link: string; cover: File | null; video_type_id: number } | null,
    lesson_id: number | null,
    contentId: number,
    videoType: number,
    type_id: number,
    step_id: number
) => {
    let headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    let formData = new FormData();
    url = `/v1/teacher/video/update?lesson_id=${lesson_id}&title=${value?.title}&description=${value?.description}&video_link=${value?.video_link}&video_type_id=${value?.video_type_id}&video_id=${contentId}`;
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('lesson_id', String(lesson_id));
    formData.append('video_link', value?.video_link || '');
    formData.append('video_type_id', String(value?.video_type_id));
    formData.append('video_id', String(contentId));
    formData.append('title', String(value?.title));
    formData.append('description', String(value?.description));

    try {
        const res = await axiosInstance.post(url, formData, {
            headers
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении урока', err);
        return err;
    }
};

export const deleteStep = async (lesson_id: number, step_id: number) => {
    console.log(lesson_id, step_id);

    try {
        const res = await axiosInstance.delete(`/v1/teacher/lessons/step/delete?lesson_id=${lesson_id}&step_id=${step_id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

// test
export const addTest = async (answers: { text: string; is_correct: boolean }[], title: string, lesson_id: number, type_id: number, step_id: number, score: number, is_ai: boolean, is_doc: boolean) => {
    const payload = {
        lesson_id,
        type_id,
        step_id,
        answers, // массив уходит как есть
        content: title,
        img: null, // если файла нет, можно null или пустую строку
        score,
        is_ai,
        is_doc
    };

    try {
        const res = await axiosInstance.post(`/v1/teacher/test/store`, payload);

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении теста', err);
        return err;
    }
};

export const updateTest = async (answers: { text: string; is_correct: boolean }[], title: string, lesson_id: number, test_id: number, type_id: number, step_id: number, score: number) => {
    url = `/v1/teacher/test/update`;

    const payload = {
        lesson_id,
        test_id,
        type_id,
        step_id,
        answers, // массив уходит как есть
        content: title,
        img: null, // если файла нет, можно null или пустую строку
        score
    };

    try {
        const res = await axiosInstance.post(url, payload);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении урока', err);
        return err;
    }
};

export const deleteTest = async (lesson_id: number, test_id: number, type_id: number, step_id: number) => {
    console.log(lesson_id, test_id, type_id, step_id);

    try {
        const res = await axiosInstance.delete(`/v1/teacher/test/delete?lesson_id=${lesson_id}&test_id=${test_id}&type_id=${type_id}&step_id=${step_id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

// practica
export const addPractica = async (value: { url: string | null; title: string; description: string | null; document: File | null; score: number | null }, lesson_id: number, type_id: number, step_id: number) => {
    console.log(value);

    const formData = new FormData();
    url = `/v1/teacher/practice-lesson/store?lesson_id=${lesson_id}&title=${value.title}&description=${value.description}&url=${value.url}&document=${value.document}&score=${value.score}&video_type_id=${type_id}&step_id=${step_id}`;
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('lesson_id', String(lesson_id));
    formData.append('url', String(value?.url));
    formData.append('title', String(value?.title));
    formData.append('description', String(value?.description));
    formData.append('score', String(value?.score));
    if (value.document) formData.append('document', value?.document && value?.document);
    else formData.append('document', '');

    try {
        const res = await axiosInstance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

export const updatePractica = async (value: { url: string | null; title: string; description: string | null; document: File | null; score: number | null }, lesson_id: number | null, practice_id: number, type_id: number, step_id: number) => {
    let formData = new FormData();
    url = `/v1/teacher/practice-lesson/update?lesson_id=${lesson_id}&title=${value.title}&description=${value.description}&url=${value.url}&document=${value.document}&score=${value.score}&practice_id=${practice_id}&video_type_id=${type_id}&step_id=${step_id}`;
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('lesson_id', String(lesson_id));
    formData.append('practice_id', String(practice_id));
    formData.append('url', value?.url || '');
    formData.append('title', String(value?.title));
    formData.append('description', String(value?.description));
    formData.append('score', String(value?.score));
    if (value.document) formData.append('document', value?.document && value?.document);
    else formData.append('document', '');

    try {
        const res = await axiosInstance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении урока', err);
        return err;
    }
};

export const deletePractica = async (lesson_id: number, practice_id: number, type_id: number, step_id: number) => {
    console.log(lesson_id, practice_id);

    try {
        const res = await axiosInstance.delete(`/v1/teacher/practice-lesson/delete?lesson_id=${lesson_id}&practice_id=${practice_id}&step_id=${step_id}&type_id=${type_id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

export const addLink = async (value: { url: string; title: string; description: string }, lesson_id: number, type_id: number, step_id: number) => {
    const formData = new FormData();
    formData.append('lesson_id', String(lesson_id));
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('url', String(value.url));
    formData.append('title', String(value.title));
    formData.append('description', String(value?.description));

    try {
        const res = await axiosInstance.post(`/v1/teacher/usefullinks/store`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

export const deleteLink = async (lesson_id: number, link_id: number, type_id: number, step_id: number) => {
    try {
        const res = await axiosInstance.delete(`/v1/teacher/usefullinks/delete?lesson_id=${lesson_id}&link_id=${link_id}&step_id=${step_id}&type_id=${type_id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

export const updateLink = async (value: { url: string | null; title: string; description: string | null }, lesson_id: number | null, link_id: number, type_id: number, step_id: number) => {
    let formData = new FormData();
    url = `/v1/teacher/usefullinks/update?lesson_id=${lesson_id}&title=${value.title}&description=${value.description}&url=${value.url}&link_id=${link_id}&type_id=${type_id}&step_id=${step_id}`;
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('lesson_id', String(lesson_id));
    formData.append('link_id', String(link_id));
    formData.append('url', String(value.url));
    formData.append('title', String(value?.title));
    formData.append('description', String(value?.description));

    try {
        const res = await axiosInstance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении урока', err);
        return err;
    }
};

export const addForum = async (title: string, lesson_id: number, type_id: number, step_id: number) => {
    const formData = new FormData();
    formData.append('lesson_id', String(lesson_id));
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('title', String(title));

    try {
        const res = await axiosInstance.post(`/v1/teacher/forum/store`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

export const updateForum = async (title: string, lesson_id: number | null, forum_id: number, type_id: number, step_id: number) => {
    let formData = new FormData();
    url = `/v1/teacher/forum/update?lesson_id=${lesson_id}&title=${title}&forum_id=${forum_id}&type_id=${type_id}&step_id=${step_id}`;
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('lesson_id', String(lesson_id));
    formData.append('forum_id', String(forum_id));
    formData.append('title', String(title));

    try {
        const res = await axiosInstance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении форума', err);
        return err;
    }
};

export const deleteForum = async (lesson_id: number, forum_d: number, type_id: number, step_id: number) => {
    try {
        const res = await axiosInstance.delete(`/v1/teacher/forum/destroy?lesson_id=${lesson_id}&forum_id=${forum_d}&step_id=${step_id}&type_id=${type_id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

export const fetchDepartamentSteps = async (lesson_id: number, id_kafedra: number) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/controls/department/course/views?lesson_id=${lesson_id}&id_kafedra=${id_kafedra}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchDepartamenCourses = async (id_kafedra: number, myedu_id: number) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/controls/department/courses?id_kafedra=${id_kafedra}&myedu_id=${myedu_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const stepSequenceUpdate = async (lesson_id: number | null, steps: { id: number | null; step: number | null }[]) => {
    const body = {
        lesson_id: lesson_id,
        steps: steps
    };

    console.log(body);

    try {
        const res = await axiosInstance.post(`/v1/teacher/lessons/step/sequence`, body);

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

export const generateQuiz = async (lesson_id: number, step_id: number | string) => {
    console.log(step_id);
    
    try {
        const res = await axiosInstance.get(`/v1/teacher/lessons/generate-quiz?lesson_id=${lesson_id}&step_id=${step_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const generateDoc = async (doc_file: File | null) => { 
    const formData = new FormData();
    if(doc_file){
        formData.append('doc_file', doc_file);
    }

    try {
        const res = await axiosInstance.post(`/test-doc`, formData);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};
