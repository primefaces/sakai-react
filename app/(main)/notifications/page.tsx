'use client';

import MyDateTime from '@/app/components/MyDateTime';
import { NotFound } from '@/app/components/NotFound';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useLocalization } from '@/layout/context/localizationcontext';
import { statusView } from '@/services/notifications';
import { mainNotification } from '@/types/mainNotification';
import { OptionsType } from '@/types/OptionsType';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import Link from 'next/link';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';

export default function MainNotificatoin() {
    const { user, setMessage, contextNotifications, setContextNotifications, handleNotifications } = useContext(LayoutContext);
    const { translations } = useLocalization();

    const [notification, setNotification] = useState<mainNotification[]>([]);

    const [searchSpinner, setSearchSpinner] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [search, setSearch] = useState<string | null>(null);
    const [pendingChanges, setPendingChanges] = useState<any>([]);

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24-С‡Р°СЃРѕРІРѕР№ С„РѕСЂРјР°С‚
    };

    const showError = useErrorMessage();

    const handleStatusView = async (notification_id: number | null) => {
        if (notification_id) {
            const data = await statusView(Number(notification_id));
            if (data?.success) {
                setMessage({
                    state: true,
                    value: { severity: 'success', summary: 'Успешно удалено!', detail: '' }
                });
            } else {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
                });
                if (data?.response?.status) {
                    showError(data.response.status);
                }
            }
            if (user?.is_working || user?.is_student) {
                handleNotifications();
            }
            // setContextNotificationId(null);
        }
    };

    const handleDeleteVisible = (id: number) => {
        const options = getConfirmOptions(Number(id), () => handleStatusView(id));
        confirmDialog(options);
    };

    const NotificationItem = ({ notificate }: { notificate: mainNotification }) => {
        let path = '';
        if (user?.is_working) {
            if (notificate?.type?.type === 'practical') {
                path = `/students/${notificate?.meta?.course_id}/${notificate?.meta?.connect_id}/${notificate?.meta?.stream_id}/${notificate?.meta?.student_id}/${notificate?.from_user?.id}/${notificate?.meta?.lesson_id}/${notificate?.meta?.step_id}`;
            } else if (notificate?.type?.type === 'view') {
                path = `/notifications`;
            }
        } else if (user?.is_student) {
            if (notificate?.type?.type === 'practical') {
                path = `/teaching/lessonView/${notificate?.meta?.lesson_id}/${notificate?.meta?.id_curricula}/${notificate?.meta?.stream_id}/${notificate?.meta?.step_id}`;
            }
        }
        return (
            <div className="w-full">
                <div className="w-full flex flex-col justify-center bg-white/70 backdrop-blur rounded-lg border border-[var(--surface-border)] shadow-sm p-3 sm:p-4 gap-2 sm:gap-3">
                    <div className="flex justify-between items-start gap-3">
                        {/* <div className="w-full flex justify-between">
                            <Link className="cursor-pointer hover:underline" href={'path'}>
                                <b className="text-[var(--mainColor)] ">{notificate?.title}</b>
                            </Link>
                        </div> */}
                        <Link href={''} className="hidden sm:flex items-center gap-1 hover:underline text-[13px] sm:text-[15px] text-[var(--text-color)]">
                            <b className="m-0">{notificate?.from_user?.last_name}</b>
                            <b className="m-0">{notificate?.from_user?.name}</b>
                            <b className="m-0">{notificate?.from_user?.father_name}</b>
                        </Link>
                        <Link href={''} className="flex sm:hidden items-center gap-1 hover:underline text-[14px] text-[var(--text-color)]">
                            <b className="m-0">{notificate?.from_user?.last_name}</b>
                            <b className="m-0">{notificate?.from_user?.name[0]}.</b>
                            <b className="m-0">{notificate?.from_user?.father_name && notificate?.from_user?.father_name[0] != ' ' ? notificate?.from_user?.father_name[0] + '.' : ''}</b>
                        </Link>
                        <div className="w-full relative flex flex-col items-end">
                            {/* <span className="absolute -top-4 text-sm w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-full bg-[var(--amberColor)]"></span> */}
                            <i className="cursor-pointer pi pi-trash text-white bg-[var(--redColor)] rounded-md text-xs sm:text-sm px-2 py-1 hover:opacity-90" onClick={() => handleDeleteVisible(notificate?.id)}></i>
                        </div>
                    </div>

                    {/* student message */}
                    <div className="flex items-center">
                        {/* <label className="custom-radio p-1">
                            <input
                                type="checkbox"
                                className={`customCheckbox`}
                                // checked={pendingChanges.some((s) => s.stream_id === rowData.stream_id)}

                                onChange={(e) => {
                                    // handleEdit(e.target, rowData);
                                }}
                            />
                            <span className="checkbox-mark"></span>
                        </label>
                        <i className="pi pi-star text-lg p-1"></i> */}
                        <div className="w-full flex gap-2 justify-between flex-col sm:flex-row items-start sm:items-center">
                            <div className="flex flex-col gap-2">
                                <span className="text-[14px] sm:text-[15px] font-medium max-w-[420px] text-nowrap overflow-hidden text-ellipsis">{notificate?.title}</span>
                                <div className="flex flex-col gap-2">
                                    {notificate?.meta?.title && (
                                        <>
                                            <span>{translations.reason}:</span>
                                            <ul className={`list-disc p-2 rounded-sm `}>
                                                <li className="ml-2 text-[13px] sm:text-[14px] text-[var(--mainColor)]">{notificate?.meta?.title}</li>
                                            </ul>

                                            <ul className={`list-disc p-2 rounded-sm`}>
                                                <li className="ml-2 text-[13px] sm:text-[14px] text-[var(--mainColor)]">{notificate?.meta?.description}</li>
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                            <small className="px-2 py-1 bg-[var(--redWeakColor)] rounded-md text-[11px] sm:text-[12px] whitespace-nowrap">{notificate?.type?.title}</small>
                        </div>
                    </div>
                    <p className="w-full text-[10px] sm:text-[11px] m-0 flex justify-end text-[var(--text-color-secondary)]">
                        <MyDateTime createdAt={notificate?.created_at} options={options} />
                    </p>
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (contextNotifications) {
            if (contextNotifications.length > 0) {
                setNotification(contextNotifications);
                setEmpty(false);
            } else {
                setEmpty(true);
            }
        }
    }, [contextNotifications]);

    useEffect(() => {
        if (user?.is_working || user?.is_student) {
            handleNotifications();
        }
    }, [user]);

    return (
        <div className="main-bg">
            <div className="w-full flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-color)] shadow-[var(--bottom-shadow)]">{translations.notifications}</h3>
            </div>

            {/* <div className="relative w-full flex justify-center sm:justify-start items-center gap-1 my-2">
                <InputText type="text" placeholder="РџРѕРёСЃРє..." value={search} className="w-full h-[48px]" onChange={(e) => setSearch(e.target.value)} />
                <div className="absolute right-2">{!searchSpinner && <i className="pi pi-search"></i>}</div>
                <div className="absolute right-2">{searchSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
            </div> */}
            {/* 
            <div className="flex items-center gap-2 my-2 px-2">
                <div className="flex items-center gap-1">
                    <span>РР·Р±СЂР°РЅРЅС‹Рµ</span>
                    <i className="pi pi-star-fill"></i>
                </div>
                <div className="flex items-center gap-1">
                    <span>РђСЂС…РёРІ</span>
                    <i className="pi pi-trash"></i>
                </div>
            </div> */}

            {/* main */}
            <div className="flex flex-col gap-2 sm:gap-3 mt-2">
                {empty ? (
                    <div className="flex justify-center">
                        <NotFound titleMessage={translations.noData} />
                    </div>
                ) : (
                    notification?.map((item) => {
                        return (
                            <div key={item?.id}>
                                <NotificationItem notificate={item} />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

