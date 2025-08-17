'use client';

import { getToken } from '@/utils/auth';
import { useContext, useEffect } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { getUser } from '@/services/auth';
import { logout } from '@/utils/logout';
import { usePathname } from 'next/navigation';

const SessionManager = () => {
    const { setMessage } = useContext(LayoutContext);
    const { user, setUser } = useContext(LayoutContext);
    const { setGlobalLoading } = useContext(LayoutContext);

    const pathname = usePathname();

    useEffect(() => {
        console.log('Пользователь ', user);
    }, [user]);

    useEffect(() => {
        console.log('Роутинг');
        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 2000);

        const init = async () => {
            console.log('проверяем токен...');
            const token = getToken('access_token');
            if (token) {
                const res = await getUser(token);
                setGlobalLoading(true);
                try {
                    if (res?.success) {
                        setGlobalLoading(false);
                        console.log('Данные пользователя успешно пришли ', res);

                        const userVisit = localStorage.getItem('userVisit');
                        if (!userVisit) {
                            localStorage.setItem('userVisit', JSON.stringify(true));

                            setMessage({
                                state: true,
                                value: { severity: 'success', summary: 'Успешная авторизация!', detail: '' }
                            }); // messege - Успех!
                        }
                        setUser(res.user);
                    } else {
                        logout({ setUser, setGlobalLoading });
                        setMessage({
                            state: true,
                            value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при авторизации' }
                        }); // messege - Ошибка при авторизации
                        console.log('Ошибка при получении пользователя');
                    }
                } catch (error) {
                    logout({ setUser, setGlobalLoading });
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при авторизации' }
                    }); // messege - Ошибка при авторизации
                    console.log('Ошибка при получении пользователя');
                }
            }
        };
        init();
    }, []);

    useEffect(() => {
        setGlobalLoading(true);
        console.log('Переход в', pathname);
        const token = getToken('access_token');

        if (!token && pathname !== '/' && pathname !== '/auth/login') {
            console.log('Перенеправляю в login');

            // logout({ setUser, setGlobalLoading });
            // window.location.href = '/auth/login';
            setTimeout(() => {
                setGlobalLoading(false);
            }, 1000);

            return;
        }
        setTimeout(() => {
            setGlobalLoading(false);
        }, 1000);
    }, [pathname]);

    // useEffect(() => {
    //     const checkToken = () => {
    //         const token = getToken('access_token');

    //         if (!token) {
    //             const userVisit = localStorage.getItem('userVisit');
    //             if(userVisit){
    //                 setMessage({
    //                     state: true,
    //                     value: { severity: 'error', summary: 'Сессия завершилось', detail: 'Войдите заново' }
    //                 }); // messege - Время сесси завершилось
    //             }
    //             logout({setUser, setGlobalLoading});
    //             console.log('Токен отсутствует - завершаем сессию');
    //             return false; // сигнал для остановки интервала
    //         }
    //         return true;
    //     };

    //     // немедленная проверка
    //     if (!checkToken()) return;

    //     const interval = setInterval(() => {
    //         if (!checkToken()) {
    //             clearInterval(interval);
    //         }
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, []);

    return null;
};

export default SessionManager;
