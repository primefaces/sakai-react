'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { mainNotification } from '@/types/mainNotification';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import MyDateTime from '../MyDateTime';
import { OptionsType } from '@/types/OptionsType';

// types
interface NotificationGroupUi {
    id: number;
    title: string;
    type: { type: string; title: string };
    created_at: string;
    from_user: { last_name: string; name: string };
}

export default function Notification({ notification }: { notification: mainNotification[] }) {
    const { user, setContextNotificationId } = useContext(LayoutContext);

    const [mainNotification, setMainNotification] = useState<mainNotification[]>([]);
    const [groupNotificationVisible, setGroupNotificationVisible] = useState(false);
    const [groupNotifications, setGroupNotifications] = useState<NotificationGroupUi[]>([]);
    const [groupingFl, setGroupingFl] = useState(false);

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24-часовой формат
    };

    const notificationTypeGrouping = (type: string) => {
        setGroupNotificationVisible(false);
        const forGroup = notification.filter((item) => item.type.type === type);
        return forGroup;
    };

    const stop = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const findPath = (item: mainNotification) => {
        let findPathResult = '';
        if (user?.is_working) {
            if (item?.type?.type === 'practical') {
                findPathResult = `/students/${item?.meta?.course_id}/${item?.meta?.connect_id}/${item?.meta?.stream_id}/${item?.meta?.student_id}/${item?.from_user?.id}/${item?.meta?.lesson_id}/${item?.meta?.step_id}`;
            } else if (item?.type?.type === 'view') {
                findPathResult = `/notifications`;
            }
        } else if (user?.is_student) {
            if (item?.type?.type === 'practical') {
                findPathResult = `/teaching/lessonView/${item?.meta?.lesson_id}/${item?.meta?.id_curricula}/${item?.meta?.stream_id}/${item?.meta?.step_id}`;
            } else if (item?.type?.type === 'view') {
                findPathResult = `/notifications`;
            }
        }
        return findPathResult;
    };

    const typeIcon = (type?: string) => (type === 'practical' ? 'pi pi-file-edit' : type === 'view' ? 'pi pi-eye' : 'pi pi-bell');

    const groupingSection = (item: NotificationGroupUi) => {
        return (
            <div
                key={item?.id}
                className="cursor-pointer flex items-center gap-3 px-3 py-[10px] rounded-xl hover:bg-[#f1f9fd] transition-colors"
                onMouseDown={stop}
                onClick={(e) => {
                    stop(e);
                    const forNotification = notificationTypeGrouping(item?.type?.type);
                    setMainNotification(forNotification);
                    setGroupingFl(true);
                }}
            >
                <span className="shrink-0 w-[32px] h-[32px] rounded-lg bg-[var(--mainColor)]/10 text-[var(--mainColor)] flex items-center justify-center">
                    <i className={typeIcon(item?.type?.type)} style={{ fontSize: '14px' }}></i>
                </span>
                <b className="flex-1 text-[0.85rem] font-semibold text-[var(--titleColor)]">{item?.type?.title}</b>
                <span className="text-[11px] font-semibold text-[var(--mainColor)] bg-[var(--mainColor)]/10 rounded-full px-2 py-[1px]">{notification.filter((n) => n?.type?.type === item?.type?.type).length}</span>
                <i className="pi pi-angle-right text-slate-400" style={{ fontSize: '12px' }}></i>
            </div>
        );
    };

    useEffect(() => {
        setMainNotification(notification);
    }, [notification]);

    // Получаем массив разных типов
    useEffect(() => {
        const typeArr: NotificationGroupUi[] = [];
        if (notification?.length > 0) {
            for (let i = 0; i < notification.length; i++) {
                const checkType = typeArr.some((item) => item.type.type === notification[i].type.type);
                if (!checkType) {
                    typeArr.push(notification[i]);
                }
            }
            if (typeArr.length > 0) {
                if (typeArr.length > 1) {
                    setGroupNotificationVisible(true);
                }
                setGroupNotifications(typeArr);
            }
        }
    }, []);

    const allBtn = (onClick: (e: any) => void) => (
        <button
            type="button"
            onMouseDown={stop}
            onClick={onClick}
            className="cursor-pointer flex items-center gap-1 text-[0.75rem] font-medium text-[var(--mainColor)] bg-[var(--mainColor)]/10 hover:bg-[var(--mainColor)]/20 rounded-full px-[10px] py-[3px] transition-colors"
        >
            <i className="pi pi-list" style={{ fontSize: '0.65rem' }}></i>
            <span>Все</span>
        </button>
    );

    return (
        <div className="flex flex-col gap-1 p-1">
            {groupNotificationVisible ? (
                <div className="flex items-center justify-between gap-2 px-2 pt-1 pb-2 border-b border-slate-100 mb-1">
                    <h3 className="m-0 p-0 font-bold text-[0.85rem] text-[var(--titleColor)]">Список сообщений</h3>
                    {allBtn((e) => {
                        stop(e);
                        setGroupNotificationVisible(false);
                    })}
                </div>
            ) : (
                ''
            )}

            {groupingFl && (
                <div className="flex items-center justify-end px-1 pb-1">
                    {allBtn((e) => {
                        stop(e);
                        setMainNotification(notification);
                        setGroupingFl(false);
                    })}
                </div>
            )}

            {groupNotificationVisible ? (
                groupNotifications?.map((item) => groupingSection(item))
            ) : mainNotification?.length > 0 ? (
                mainNotification?.map((item) => {
                    const path = findPath(item);
                    return (
                        <Link
                            key={item?.id}
                            href={path}
                            onClick={() => setContextNotificationId(item?.id)}
                            className="group relative w-full flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-[var(--mainBorder)] hover:bg-[#f7fcfe] transition-colors"
                        >
                            <span className="shrink-0 w-[34px] h-[34px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] flex items-center justify-center">
                                <i className={typeIcon(item?.type?.type)} style={{ fontSize: '14px' }}></i>
                            </span>

                            <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                                <div className="flex items-center justify-between gap-2">
                                    <b className="text-[var(--titleColor)] group-hover:text-[var(--mainColor)] text-[0.82rem] sm:text-[0.875rem] font-semibold truncate transition-colors">{item?.type?.title}</b>
                                    <span className="shrink-0 w-[8px] h-[8px] rounded-full bg-[var(--amberColor)]"></span>
                                </div>

                                {/* student message */}
                                {user?.is_student && item?.type?.type === 'practical' && (
                                    <span className="text-[0.8rem] text-[var(--bodyColor)] truncate" title={item?.title}>
                                        {item?.title}
                                    </span>
                                )}

                                <div className="flex items-center justify-between gap-2 mt-[2px]">
                                    <span className="flex items-center gap-1 text-[0.72rem] text-slate-500 truncate">
                                        <i className="pi pi-user" style={{ fontSize: '0.65rem' }}></i>
                                        {item?.from_user?.last_name} {item?.from_user?.name}
                                    </span>
                                    <span className="shrink-0 text-[10px] text-slate-400">
                                        <MyDateTime createdAt={item?.created_at} options={options} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <div className="flex flex-col items-center gap-2 py-5 text-slate-400">
                    <span className="w-[44px] h-[44px] rounded-full bg-slate-100 flex items-center justify-center">
                        <i className="pi pi-bell-slash" style={{ fontSize: '18px' }}></i>
                    </span>
                    <p className="m-0 text-[0.813rem]">Сообщений нет</p>
                </div>
            )}
        </div>
    );
}
