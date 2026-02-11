/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';

import { useForm } from 'react-hook-form';
import { schema } from '@/schemas/authSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller } from 'react-hook-form';
import { getUser, login } from '@/services/auth';
import FancyLinkBtn from '@/app/components/buttons/FancyLinkBtn';
import { LoginType } from '@/types/login';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { getToken } from '@/utils/auth';
import { ProgressSpinner } from 'primereact/progressspinner';

import { useLocalization } from '../../../../layout/context/localizationcontext';

const LoginPage = () => {
    const { translations } = useLocalization();
    const { setUser, setMessage, setDepartament, departament } = useContext(LayoutContext);
    // const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const [showPassword, setShowPassword] = useState(false);
    // const [progressSpinner, setProgressSpinner] = useState(true);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [disabledState, setDisabledState] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    const onSubmit = async (value: LoginType) => {
        try {
            setDisabledState(true);
            const user = await login(value);
            if (user && user.success) {
                document.cookie = `access_token=${user.token.access_token}; path=/; Secure; SameSite=Strict; expires=${user.token.expires_at}`;
                const token = user.token.access_token;

                if (token) {
                    const res = await getUser();
                    try {
                        if (res?.success) {
                            if (!res?.user.is_working && !res?.user.is_student) {
                                setMessage({
                                    state: true,
                                    value: {
                                        severity: 'error',
                                        summary: 'Не удалось определить ваш статус пользователя.',
                                        detail: (
                                            <div>
                                                <span>Обратитесь в службу поддержки, указав необходимые данные</span> <small className="text-[var(--mainColor)] underline">{res?.user?.myedu_id}</small>
                                            </div>
                                        )
                                    }
                                });
                                document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                            } else {
                                if (res?.user.is_working) {
                                    if (res.roles && res.roles.length > 0) {
                                        const roleCheck = res.roles.find((i: { id_role: number }) => i.id_role);
                                        if (roleCheck) {
                                            setDepartament({ info: roleCheck.roles_name.info_ru, last_name: res.user?.last_name, name: res?.user.name, father_name: res.user?.father_name });
                                        }
                                        window.location.href = '/dashboard';
                                    } else {
                                        window.location.href = '/dashboard';
                                    }
                                }
                                if (res?.user.is_student) {
                                    window.location.href = '/studentHome';
                                }
                            }
                        } else {
                            setMessage({
                                state: true,
                                value: { severity: 'error', summary: 'Ошибка при авторизации', detail: 'Повторите позже' }
                            }); // messege - Ошибка при авторизации, повторите позже
                            setUser(null);
                            localStorage.removeItem('userVisit');
                            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                            console.log('Ошибка при получении пользователя');
                        }
                    } catch (error) {
                        setMessage({
                            state: true,
                            value: { severity: 'error', summary: 'Ошибка при авторизации', detail: 'Повторите позже' }
                        }); // messege - Ошибка при авторизации, повторите позже

                        setUser(null);
                        localStorage.removeItem('userVisit');
                        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                        console.log('Ошибка при получении пользователя');
                    }
                }
            } else {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка при авторизации', detail: 'Повторите позже' }
                }); // messege - Ошибка при авторизации при авторизации
            }
        } catch (err) {
            console.error('Критическая ошибка в onSubmit:', err);
        } finally {
            setTimeout(() => {
                setDisabledState(false);
            }, 2000);
        }
    };

    const onError = (errors: any) => {
        console.log('Ошибки формы:', errors);
        setMessage({
            state: true,
            value: { severity: 'error', summary: 'Ошибка при авторизации', detail: 'Введите корректные данные' }
        });
    };

    useEffect(() => {
        const token = getToken('access_token');
        if (token) {
            window.location.href = '/';
            setProgressSpinner(false);
        } else {
            setProgressSpinner(false);
        }
    }, []);

    if (progressSpinner)
        return (
            <div className="flex justify-center items-center h-[100vh]">
                <ProgressSpinner style={{ width: '100px', height: '100px' }} />
            </div>
        );

    return (
        <div className={`flex flex-col gap-4 pt-6 h-[100vh] login-bg`}>
            {/* <div className={`flex flex-col gap-4 pt-4 h-[100vh] ${!media && 'login-bg'}`}> */}
            {/* <InfoBanner title="Кирүү" titleSize={{ default: '30px', sm: '40px' }} /> */}
            <div className="flex gap-4 flex-column lg:flex-row items-center justify-evenly px-4 mb-8">
                <div className={`w-[90%] sm:w-[500px] shadow-2xl bg-white py-6 px-3 md:py-8 sm:px-4 md:px-8 rounded`}>
                    <h1 className="text-3xl sm:text-4xl font-bold inline-block border-b-2 pb-1 border-[var(--mainColor)]">{translations.login}</h1>
                    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className="w-full flex flex-col gap-4">
                        <div className="flex flex-col">
                            <InputText {...register('email')} id="email1" type="text" placeholder="email@oshsu.kg" className="w-[100%] p-2 sm:p-3" />
                            {errors.email && <b className="text-[red] text-[12px] ml-2">{errors.email.message}</b>}
                        </div>
                        <div className="flex flex-col">
                            {/* <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Password {...field} toggleMask placeholder='Пароль' className={`w-[100%]`} inputClassName="w-[90%] p-2 sm:p-3" inputStyle={{ marginRight: '8px' }} feedback={false} />}
                            /> */}
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <div className="p-inputgroup flex-1">
                                        <InputText {...field} type={showPassword ? 'text' : 'password'} placeholder="Пароль" className="w-full p-2 sm:p-3" />
                                        <Button type="button" icon={showPassword ? 'pi pi-eye-slash text-white' : 'pi pi-eye text-white'} onClick={() => setShowPassword((prev) => !prev)} className="p-button-text" />
                                    </div>
                                )}
                            />
                            {errors.password && <b className="text-[red] text-[12px] ml-2">{errors.password.message}</b>}
                        </div>

                        <div className={`${disabledState ? 'opacity-50 pointer-events-none' : ''} `}>
                            <FancyLinkBtn btnWidth={'100%'} backround={'--mainColor'} effectBg={'--titleColor'} title={translations.login} btnType={true}/>
                        </div>
                    </form>
                    <Link href={'/'} className="mt-2 w-full">
                        <FancyLinkBtn btnWidth={'100%'} backround={'--mainColor'} effectBg={'--titleColor'} title={translations.mainPage} btnType={false}/>
                    </Link> 
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
