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

    const fieldWrap = (hasError: boolean) =>
        `group flex items-center gap-[10px] h-[50px] px-[14px] rounded-[12px] border bg-[#f8fafc] transition-all focus-within:bg-white focus-within:border-[var(--mainColor)] focus-within:shadow-[0_0_0_4px_rgba(8,169,230,0.12)] ${
            hasError ? 'border-[#f87171] bg-[#fff7f7]' : 'border-[#e5e9f0]'
        }`;
    const fieldInput = '!border-0 !shadow-none !bg-transparent !p-0 w-full h-full text-[0.9375rem] text-[var(--titleColor)] placeholder:text-[#9aa5b4] focus:!outline-none';
    const fieldIcon = 'text-[0.9375rem] text-[#9aa5b4] group-focus-within:text-[var(--mainColor)] transition-colors';
    const errorText = (msg?: string) =>
        msg ? (
            <span className="flex items-center gap-[4px] mt-[6px] ml-[4px] text-[0.75rem] font-medium text-[#ef4444]">
                <i className="pi pi-exclamation-circle text-[0.6875rem]"></i>
                {msg}
            </span>
        ) : null;

    return (
        <div className="min-h-[100dvh] w-full flex bg-[#f4f7fb]">
            {/* Подтверждение через Telegram */}
            <Dialog
                header={translations.confirmation}
                visible={visible}
                style={{ width: '380px' }}
                breakpoints={{ '480px': '92vw' }}
                onHide={() => setVisible(false)}
                draggable={false}
            >
                <div className="flex flex-col items-center gap-[14px] pt-[4px] pb-[8px]">
                    <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full bg-[var(--mainColor)]/10">
                        <span className="flex items-center justify-center w-[46px] h-[46px] rounded-full bg-[var(--mainColor)] text-white shadow-[0_8px_20px_-6px_rgba(8,169,230,0.6)]">
                            <i className="pi pi-telegram text-[1.375rem]"></i>
                        </span>
                    </div>
                    <p className="m-0 text-[0.9375rem] text-[var(--titleColor)] text-center font-semibold">{'Введите код с телеграмм'}</p>
                    <div className="inline-flex items-center gap-[6px] px-[12px] py-[5px] rounded-full bg-[#fef2f2] text-[0.8125rem] text-[#dc2626]">
                        <i className="pi pi-clock text-[0.75rem]"></i>
                        <span>{'Код действителен до'}:</span>
                        <b className="tabular-nums">
                            {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                        </b>
                    </div>
                    <InputText
                        type="number"
                        inputMode="numeric"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={'Введите код'}
                        className="w-full h-[52px] !rounded-[12px] text-center text-[1.25rem] font-semibold tracking-[0.3em]"
                    />
                    <Button label={'Подтвердить'} className={`w-full h-[48px] !rounded-[12px] ${verifyBtnDisabled ? 'opacity-50 pointer-events-none' : ''}`} onClick={handleVerifyClick} disabled={!code} />
                </div>
            </Dialog>

            {/* Левая бренд-панель (только ПК) */}
            <aside className="hidden lg:flex relative w-[46%] xl:w-[50%] overflow-hidden flex-col justify-between p-[48px] text-white bg-gradient-to-br from-[var(--mainColor)] via-[#2b6fc4] to-[var(--titleColor)]">
                <div className="absolute -top-[120px] -right-[120px] w-[380px] h-[380px] rounded-full bg-white/10 blur-[2px]"></div>
                <div className="absolute -bottom-[160px] -left-[100px] w-[420px] h-[420px] rounded-full bg-white/[0.07]"></div>
                <div className="absolute inset-0 login-bg opacity-[0.08]"></div>

                <Link href="/" className="relative z-[1] inline-flex items-center gap-[12px] self-start text-white">
                    <span className="flex items-center justify-center w-[64px] h-[64px] rounded-[18px] bg-white shadow-lg">
                        <img src="/layout/images/logo-remove.png" alt="logo" className="w-[48px] h-auto" />
                    </span>
                    <span className="text-[1.125rem] font-bold tracking-wide">Mooc ОшГУ</span>
                </Link>

                <div className="relative z-[1] flex flex-col gap-[16px] max-w-[460px]">
                    <h2 className="m-0 text-[2.25rem] xl:text-[2.625rem] leading-[1.15] font-bold">{translations.welcome}</h2>
                    <p className="m-0 text-[1.0625rem] leading-relaxed text-white">{translations.welcomeToDistanceLearningPortal}</p>
                </div>

                <span className="relative z-[1] text-[0.8 125rem] text-white/60">© {new Date().getFullYear()} ОшГУ</span>
            </aside>

            {/* Форма */}
            <main className="flex-1 flex items-center justify-center px-[16px] py-[32px] sm:px-[32px]">
                <div className="w-full max-w-[420px] flex flex-col gap-[24px]">
                    {/* логотип для мобильных/планшетов */}
                    <Link href="/" className="lg:hidden self-center">
                        <img src="/layout/images/logo-remove.png" alt="logo" className="w-[84px] sm:w-[96px] h-auto" />
                    </Link>

                    <div className="bg-white rounded-[20px] border border-[#eef2f6] shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)] p-[22px] sm:p-[32px] flex flex-col gap-[22px]">
                        <div className="flex flex-col gap-[6px]">
                            <h1 className="m-0 text-[1.625rem] sm:text-[1.875rem] font-bold text-[var(--titleColor)]">{translations.login}</h1>
                            <p className="m-0 text-[0.875rem] text-[var(--text-color-secondary)] lg:hidden">{translations.welcomeToDistanceLearningPortal}</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className="w-full flex flex-col gap-[16px]">
                            <div className="flex flex-col">
                                <label htmlFor="email1" className="mb-[6px] ml-[2px] text-[0.8125rem] font-semibold text-[var(--titleColor)]">
                                    Email
                                </label>
                                <div className={fieldWrap(!!errors.email)}>
                                    <i className={`pi pi-envelope ${fieldIcon}`}></i>
                                    <InputText {...register('email')} id="email1" type="text" autoComplete="username" placeholder="email@oshsu.kg" className={fieldInput} />
                                </div>
                                {errorText(errors.email?.message)}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="password1" className="mb-[6px] ml-[2px] text-[0.8125rem] font-semibold text-[var(--titleColor)]">
                                    Пароль
                                </label>
                                <Controller
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <div className={fieldWrap(!!errors.password)}>
                                            <i className={`pi pi-lock ${fieldIcon}`}></i>
                                            <InputText {...field} id="password1" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder={'Пароль'} className={fieldInput} />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                                                className="shrink-0 flex items-center justify-center w-[34px] h-[34px] -mr-[6px] rounded-[8px] text-[#9aa5b4] hover:text-[var(--mainColor)] hover:bg-[var(--mainColor)]/10 transition-colors"
                                            >
                                                <i className={showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}></i>
                                            </button>
                                        </div>
                                    )}
                                />
                                {errorText(errors.password?.message)}
                            </div>

                            <button
                                type="submit"
                                disabled={disabledState}
                                className="mt-[6px] flex items-center justify-center gap-[8px] h-[50px] rounded-[12px] bg-[var(--mainColor)] text-white text-[0.9375rem] font-semibold shadow-[0_10px_24px_-10px_rgba(8,169,230,0.7)] hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-60 disabled:pointer-events-none"
                            >
                                {disabledState ? <i className="pi pi-spin pi-spinner"></i> : <i className="pi pi-sign-in text-[0.875rem]"></i>}
                                {translations.login}
                            </button>
                        </form>

                        <div className="flex items-center gap-[12px] text-[0.75rem] text-[#9aa5b4]">
                            <span className="flex-1 h-px bg-[#eef2f6]"></span>
                            <span>или</span>
                            <span className="flex-1 h-px bg-[#eef2f6]"></span>
                        </div>

                        <Link
                            href={'/'}
                            className="flex items-center justify-center gap-[8px] h-[48px] rounded-[12px] border border-[#e5e9f0] bg-white text-[0.9375rem] font-semibold text-[var(--titleColor)] hover:border-[var(--mainColor)] hover:text-[var(--mainColor)] transition-colors"
                        >
                            <i className="pi pi-home text-[0.875rem]"></i>
                            {translations.mainPage}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
