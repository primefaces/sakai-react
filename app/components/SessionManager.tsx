'use client';

import { getToken } from '@/utils/auth';
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { getUser } from '@/services/auth';
import { logout } from '@/utils/logout';
import { usePathname } from 'next/navigation';

const SessionManager = () => {
    const { user, setMessage, setGlobalLoading, setUser, departament, setDepartament } = useContext(LayoutContext);

    const pathname = usePathname();

    useEffect(() => {
        const init = async () => {
            console.log('проверяем токен...');
            const token = getToken('access_token');
            if (token) {
                const res = await getUser();
                setGlobalLoading(true);
                try {
                    if (res?.success) {
                        setTimeout(() => {
                            setGlobalLoading(false);
                        }, 1000);
                        // console.log('Данные пользователя успешно пришли ', res);
                        if (res.roles && res.roles.length > 0) {
                            const roleCheck = res.roles.find((i: { id_role: number }) => i.id_role);
                            if (roleCheck) {
                                setDepartament({ info: roleCheck.roles_name.info_ru, last_name: res.user?.last_name, name: res?.user.name, father_name: res.user?.father_name });
                            }
                        }
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
                        setGlobalLoading(false);
                        setMessage({
                            state: true,
                            value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при авторизации' }
                        }); // messege - Ошибка при авторизации
                        console.log('Ошибка при получении пользователя');
                    }
                } catch (error) {
                    logout({ setUser, setGlobalLoading });
                    setGlobalLoading(false);
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при авторизации' }
                    }); // messege - Ошибка при авторизации
                    console.log('Ошибка при получении пользователя');
                }
                setGlobalLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!pathname.startsWith('/teaching/lesson/') && !pathname.startsWith('/course/')) {
            // setGlobalLoading(true);
        }

        const token = getToken('access_token');

        if (!token && pathname !== '/' && pathname !== '/auth/login') {
            console.log('Перенеправляю в login');

            logout({ setUser, setGlobalLoading });
            window.location.href = '/auth/login';
            return;
        }
        // setTimeout(() => {
        //     setGlobalLoading(false);
        // }, 900);
    }, [pathname]);

    return null;
};

export default SessionManager;
