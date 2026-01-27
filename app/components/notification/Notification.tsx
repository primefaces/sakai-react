'uce slient';

import { LayoutContext } from "@/layout/context/layoutcontext";
import { mainNotification } from "@/types/mainNotification";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import MyDateTime from "../MyDateTime";
import { OptionsType } from "@/types/OptionsType";

export default function Notification({ notification }: { notification: mainNotification[] }) {
    // types
    interface NotificationGroupUi {
        title: string;
        type: { type: string; title: string };
        created_at: string;
        from_user: { last_name: string; name: string };
    }

    interface NotificationGroup {
        id: number;
        meta: { course_id: number; connect_id: number; stream_id: number; student_id: number; lesson_id: number; step_id: number };
    }

    const { user, setContextNotificationId } = useContext(LayoutContext);

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24-часовой формат
    };

    // const notificationTypeGrouping = (type: string) => {
    //     setGroupNotificationVisible(true);
    //     const forGroup = testNotification.filter((item) => item.type.type === type);
    //     setGroupNotifications(forGroup);
    // };

    // Получаем массив разных типов
    const typeArr: NotificationGroupUi[] = [];
    if (notification?.length > 0) {
        for (let i = 0; i < notification.length; i++) {
            const checkType = typeArr.some((item) => item.type.type === notification[i].type.type);
            if (!checkType) {
                typeArr.push(notification[i]);
            }
        }
    }

    const stop = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const findPath = (item: mainNotification) => {
        let findPathResult = '';
        if (user?.is_working) {
            if (item?.type?.type === 'practical') {
                findPathResult = `/students/${item?.meta?.course_id}/${item?.meta?.connect_id}/${item?.meta?.stream_id}/${item?.meta?.student_id}/${item?.from_user?.id}/${item?.meta?.lesson_id}/${item?.meta?.step_id}`
            } else if (item?.type?.type === 'view') {
                findPathResult = `/notifications`
            }
        } else if (user?.is_student) {
            if (item?.type?.type === 'practical') {
                findPathResult = `/teaching/lessonView/${item?.meta?.lesson_id}/${item?.meta?.id_curricula}/${item?.meta?.stream_id}/${item?.meta?.step_id}`
            }
        }
        return findPathResult;
    }

    // console.log('Массив типов ', typeArr);
    return (
        <div className={`flex flex-col justify-center p-2 gap-1`}>
            {/* {groupNotificationVisible ? <i className="cursor-pointer pi pi-times flex justify-end" onClick={() => setGroupNotificationVisible(false)}></i> : ''} */}
            {/* <span onClick={stop} onMouseDown={stop}>stop</span> */}

            {/* Отображаем уже сгруппированные например только практические  */}
            {/* {groupNotificationVisible && groupNotifications?.length > 0
                    ? groupNotifications?.map((item) => {
                          let path = '';
                          if (user?.is_working && item?.type?.type === 'practical') {
                              path = `/students/${item?.meta?.course_id}/${item?.meta?.connect_id}/${item?.meta?.stream_id}/${item?.meta?.student_id}/${item?.from_user?.id}/${item?.meta?.lesson_id}/${item?.meta?.step_id}`;
                          } else if (user?.is_student && item?.type?.type === 'practical') {
                              path = `/teaching/lessonView/${item?.meta?.lesson_id}/${item?.meta?.id_curricula}/${item?.meta?.stream_id}/${item?.meta?.step_id}`;
                          }

                          return (
                              <div key={item?.id} className={`w-full flex flex-col justify-center shadow p-2 gap-1 sm:gap-2`}>
                                  <div className="w-full flex justify-between">
                                      <Link onClick={() => setContextNotificationId(item?.id)} className="cursor-pointer hover:underline" href={path}>
                                          <b className="text-[var(--mainColor)] text-[12px] sm:text-[14px]">{item?.type?.title}</b>
                                      </Link>
                                      <span className="text-sm w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-full bg-[var(--amberColor)]"></span>
                                  </div>

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
                    : ''} */}

            {/* {!groupNotificationVisible ? (
                typeArr?.length > 2 ? (
                    typeArr.map((el: any) => {
                        return (
                            <div className="flex gap-1 items-center">
                                <span>Список сообщений </span>
                                <b className="cursor-pointer text-[var(--mainColor)] hover:underline" onClick={() => notificationTypeGrouping(el.type.type)}>
                                    {el.type.type}
                                </b>
                            </div>
                        );
                    })
                ) : */}
            {notification?.length > 0 ? (
                notification?.map((item) => {
                    const path = findPath(item);
                    return (
                        <div key={item?.id} className={`w-full flex flex-col justify-center shadow p-2 gap-1 sm:gap-2`}>
                            <div className="w-full flex justify-between">
                                <Link onClick={() => setContextNotificationId(item?.id)} className="cursor-pointer hover:underline" href={path}>
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
};