'uce slient';

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

    const groupingSection = (item: NotificationGroupUi) => {
        return (
            <div key={item?.id} className="flex gap-1 items-center px-2 py-1">
                <b
                    className="cursor-pointer text-[var(--mainColor)] hover:underline"
                    onMouseDown={stop}
                    onClick={(e) => {
                        stop(e);
                        const forNotification = notificationTypeGrouping(item?.type?.type);
                        setMainNotification(forNotification);
                        setGroupingFl(true);
                    }}
                >
                    {item?.type?.title}
                </b>
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

    return (
        <div className={`flex flex-col justify-center p-2 gap-1`}>
            {groupNotificationVisible ? (
                <div className="flex items-center gap-1 justify-between p-2">
                    <h3 className="m-0 p-0 font-bold text-[13px] sm:text-[17px]">Список сообщений </h3>
                    <div className="cursor-pointer flex items-center gap-1 justify-between text-[12px] sm:text-[14px]">
                        <i
                            className="pi pi-times flex justify-end"
                            style={{ fontSize: '12px' }}
                            onClick={(e) => {
                                stop(e);
                                setGroupNotificationVisible(false);
                            }}
                        ></i>
                        <span>Все</span>
                    </div>
                </div>
            ) : (
                ''
            )}

            {groupingFl && (
                <div
                    className="cursor-pointer flex items-center justify-end gap-1 text-[12px] sm:text-[14px]"
                    onClick={(e) => {
                        stop(e);
                        setMainNotification(notification);
                        setGroupingFl(false);
                    }}
                >
                    <i className="pi pi-times flex justify-end" style={{ fontSize: '12px' }}></i>
                    <span>Все</span>
                </div>
            )}

            {groupNotificationVisible ? (
                groupNotifications?.map((item) => groupingSection(item))
            ) : mainNotification?.length > 0 ? (
                mainNotification?.map((item) => {
                    const path = findPath(item);
                    return (
                        <div key={item?.id} className={`w-full flex flex-col justify-center shadow p-2 gap-1 sm:gap-2`}>
                            <div className="w-full flex justify-between">
                                <Link onClick={() => setContextNotificationId(item?.id)} className="cursor-pointer underline" href={path}>
                                    <b className="text-[var(--mainColor)] text-[12px] sm:text-[14px]">{item?.type?.title}</b>
                                </Link>
                                <span className="text-sm w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-full bg-[var(--amberColor)]"></span>
                            </div>

                            {/* student message */}
                            {user?.is_student && item?.type?.type === 'practical' && (
                                <b className="text-[13px] max-w-[350px] text-nowrap overflow-hidden text-ellipsis" title={item?.title}>
                                    {item?.title}
                                </b>
                            )}
                            <p className="m-0 text-[11px] sm:text-[12px]">
                                {item?.from_user?.last_name} {item?.from_user?.name}
                            </p>
                            <div className="w-full relative flex">
                                <p className="absolute right-0 -top-1 sm:-top-3 text-[9px] sm:text-[10px] m-0">
                                    <MyDateTime createdAt={item?.created_at} options={options} />
                                </p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-[13px]">Сообщений нет</p>
            )}
        </div>
    );
}
