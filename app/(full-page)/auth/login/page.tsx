/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';

import { useForm } from 'react-hook-form';
import { schema } from '@/schemas/authSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller } from 'react-hook-form';
import { getState, getUser, login, send, verifyTelegram } from '@/services/auth';
import FancyLinkBtn from '@/app/components/buttons/FancyLinkBtn';
import { LoginType } from '@/types/login';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { getToken } from '@/utils/auth';
import { ProgressSpinner } from 'primereact/progressspinner';

import { useLocalization } from '../../../../layout/context/localizationcontext';
import { useSearchParams } from 'next/navigation';
import { Dialog } from 'primereact/dialog';

interface State {
    status: number;
    message: string;
}

const LoginPage = () => {
    const params = useSearchParams();
    const backRedirect = params.get('redirect');
    const { translations } = useLocalization();
    const { setUser, setMessage, setDepartament } = useContext(LayoutContext);
    const [showPassword, setShowPassword] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [disabledState, setDisabledState] = useState(false);
    const [visible, setVisible] = useState(false);
    const [code, setCode] = useState('');
    const [expiresAt, setExpiresAt] = useState<string | null>('');
    const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
    const [token, setToken] = useState<string | null>('');
    const [verifyBtnDisabled, setVerifyBtnDisabled] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    const handleGetState = async () => {
        const data: State = await getState();
        return data;
    };

    const handleSend = async () => {
        const data: State = await send();
        return data;
    };

    const handleConfirm = () => {
        setVisible(true);
    };

    const handleVerifyClick = () => {
        handleVerify(code);
    };

    const handleVerify = async (enteredCode: string) => {
        const data = await verifyTelegram(enteredCode);
        setCode('');
        if (data?.status) {
            setCode('');
            setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка при подтверждение кода', detail: 'Проверьте правильность ввода и срок действия кода' } });
        } else {
            setVisible(false);
            userGetSection(null);
        }
    };

    const userGetSection = async (tokenParam: string | null) => {
        const localToken = tokenParam ? tokenParam : token;
        if (localToken) {
            console.log('ready');
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
                                let safeRedirect = '/dashboard';
                                if (backRedirect && backRedirect.startsWith('/')) {
                                    safeRedirect = backRedirect;
                                }

                                window.location.href = safeRedirect;
                            } else {
                                let safeRedirect = '/dashboard';
                                if (backRedirect && backRedirect.startsWith('/')) {
                                    safeRedirect = backRedirect;
                                }

                                window.location.href = safeRedirect;
                            }
                        }
                        if (res?.user.is_student) {
                            let safeRedirect = '/studentHome';
                            if (backRedirect && backRedirect.startsWith('/')) {
                                safeRedirect = backRedirect;
                            }
                            window.location.href = safeRedirect;
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
        } else {
            console.log('stop');
        }
    };

    const getRemainingTime = (expiresAt: string) => {
        const now = Date.now();
        const expire = new Date(expiresAt).getTime();

        const diff = expire - now;

        if (diff <= 0) {
            return { minutes: 0, seconds: 0 };
        }

        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return { minutes, seconds };
    };

    const formatTime = (value: number) => {
        return value < 10 ? `0${value}` : value;
    };

    const onSubmit = async (value: LoginType) => {
        try {
            setDisabledState(true);
            const user = await login(value);
            if (user && user?.success) {
                document.cookie = `access_token=${user.token.access_token}; path=/; Secure; SameSite=Strict; expires=${user.token.expires_at}`;
                const token = user.token.access_token;
                setToken(token);
                const state: any = await handleGetState();
                const fa = '2fa';
                // console.log(state);
                // console.log(fa);
                // console.log(state[fa]);
                if (state[fa]) {
                    userGetSection(token);
                } else if (state && state?.sendCode) {
                    const send: any = await handleSend();
                    if (send && send?.token) {
                        setExpiresAt(send?.expired);
                        handleConfirm();
                    } else {
                        setMessage({
                            state: true,
                            value: { severity: 'error', summary: 'Ошибка при авторизации', detail: 'Повторите позже' }
                        });
                    }
                } else {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка при авторизации', detail: 'Повторите позже' }
                    });
                }
            } else {
                if (user?.status === 401 && user?.response?.data?.redirect_url) {
                    window.location.href = user?.response?.data?.redirect_url;
                }
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
            // window.location.href = '/';
            setProgressSpinner(false);
        } else {
            setProgressSpinner(false);
        }
    }, []);

    useEffect(() => {
        if (!visible || !expiresAt) return;

        const interval = setInterval(() => {
            const remaining = getRemainingTime(expiresAt);
            setTimeLeft(remaining);

            if (remaining.minutes === 0 && remaining.seconds === 0) {
                clearInterval(interval);
                setVisible(false); // 👈 закрываем окно
                setExpiresAt(null); // очищаем
                setCode(''); // очищаем код
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [visible, expiresAt]);

    useEffect(() => {
        if (code?.length > 5) setVerifyBtnDisabled(false);
        else setVerifyBtnDisabled(true);
    }, [code]);

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
                <Dialog header={translations.confirmation} visible={visible} style={{ width: '350px' }} onHide={() => setVisible(false)}>
                    <div className="flex flex-col items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full text-white shadow-lg">
                            <i className="pi pi-telegram text-[var(--mainColor)] text-3xl"></i>
                        </div>
                        <p className="text-md text-gray-700 text-center font-medium">{'Введите код с телеграмм'}</p>
                        <div className="text-center text-sm font-medium text-gray-500">
                            <span className="text-[red] font-bold">{'Код действителен до'}:</span>{' '}
                            <span className="font-bold text-red-500">
                                {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                            </span>
                        </div>
                        <InputText type="number" value={code} onChange={(e) => setCode(e.target.value)} placeholder={'Введите код'} className="w-full p-inputtext-md text-center" />

                        <Button label={'Подтвердить'} size={'small'} className={`w-full ${verifyBtnDisabled ? 'opacity-50 pointer-events-none' : ''}`} onClick={handleVerifyClick} disabled={!code} />
                    </div>
                </Dialog>
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
                                        <InputText {...field} type={showPassword ? 'text' : 'password'} placeholder={'Пароль'} className="w-full p-2 sm:p-3" />
                                        <Button type="button" icon={showPassword ? 'pi pi-eye-slash text-white' : 'pi pi-eye text-white'} onClick={() => setShowPassword((prev) => !prev)} className="p-button-text" />
                                    </div>
                                )}
                            />
                            {errors.password && <b className="text-[red] text-[12px] ml-2">{errors.password.message}</b>}
                        </div>

                        <div className={`${disabledState ? 'opacity-50 pointer-events-none' : ''} `}>
                            <FancyLinkBtn btnWidth={'100%'} backround={'--mainColor'} effectBg={'--titleColor'} title={translations.login} btnType={true} />
                        </div>
                    </form>
                    <Link href={'/'} className="mt-2 w-full">
                        <FancyLinkBtn btnWidth={'100%'} backround={'--mainColor'} effectBg={'--titleColor'} title={translations.mainPage} btnType={false} />
                    </Link>
                </div>
            </div>
            {/*<BottomNav/>*/}
        </div>
    );
};

export default LoginPage;
