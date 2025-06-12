let url = '';

export const fetchCourses = async (token) => {
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

export const addCourse = async (token, value) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + '/v1/teacher/courses/store';
    console.log(value);

    const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};
    
        console.log(value.title);
        
    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('image', value.image); 
    formData.append('video_url', value.video_url); 
    console.log('form data ', formData);
    

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

export const deleteCourse = async (token, id) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/courses/delete?course_id=${id}`;

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

export const updateCourse = async (token, id, value) => {
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
