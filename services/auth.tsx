let url = '';

//      const params = new URLSearchParams({
//     category_id: String(id),
//     active: '' + param.active,
//     ending: '' + param.ending,
// });

export const login = async (value) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + '/login?';
    console.log(url);

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(value)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Ошибка при авторизации', err);
        return [];
    }
};

export const getUser = async (token) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + '/v1/user';
    
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
        console.log('Ошибка при получении пользователя', err);
        return [];
    }
};
