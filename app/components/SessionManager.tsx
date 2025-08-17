'use client';

import { getToken, isTokenExpired } from '@/utils/auth';
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { getUser, login } from '@/services/auth';

const SessionManager = () => {
    const [checkUser, setCheckUser] = useState(getToken('access_token'));
    const { user, setUser } = useContext(LayoutContext);

    useEffect(() => {
        console.log('Пользователь ', user);
    }, [user]);

    useEffect(() => {
        console.log('Роутинг!');

        const init = async () => {
            const token = getToken('access_token');
            if (token) {
                const res = await getUser(token);
                // loading = true

                if (res?.success) {
                    console.log('Данные успешно пришли ', res);
                    const userVisit = localStorage.getItem('userVisit');
                    if(!userVisit){
                        // messege - Успех! 
                        localStorage.setItem('userVisit', JSON.stringify(true));
                    }
                    setUser(res.user);
                } else {
                    // messege - Ошибка при авторизации
                    // loading = false
                    localStorage.removeItem('userVisit');
                    console.log('Ошибка при получении пользователя');
                }
            }
        };
        init();
    }, []);

    useEffect(() => {
        const checkToken = () => {
            const token = getToken('access_token');

            if (!token) {
                console.log('Токен отсутствует - завершаем сессию');
               // messege - Время сесси завершилось
               
                setUser(null);
                localStorage.removeItem('userVisit');
                document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                // loading = false

                return false; // сигнал для остановки интервала
            }
            return true;
        };

        // немедленная проверка
        if (!checkToken()) return;

        const interval = setInterval(() => {
            if (!checkToken()) {
                clearInterval(interval);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return null;
};

export default SessionManager;
