/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Tiered from '@/app/components/popUp/Tiered';
import FancyLinkBtn from '@/app/components/buttons/FancyLinkBtn';
import { classNames } from 'primereact/utils';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import useMediaQuery from '@/hooks/useMediaQuery';
import { usePathname } from 'next/navigation';
import { logout } from '@/utils/logout';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import { mainNotification } from '@/types/mainNotification';
import { TieredMenu } from 'primereact/tieredmenu';
import type { TieredMenu as TieredMenuRef } from 'primereact/tieredmenu';
import { OptionsType } from '@/types/OptionsType';
import MyDateTime from '@/app/components/MyDateTime';
import Notificatoin from '@/app/components/notification/Notification';
import Notification from '@/app/components/notification/Notification';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutState, onMenuToggle, user, setUser, setGlobalLoading, setContextNotificationId, contextNotifications, handleNotifications } = useContext(LayoutContext);

    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const pathName = usePathname();
    const media = useMediaQuery('(max-width: 1000px)');
    const menu = useRef<TieredMenuRef>(null);

    const [skeleton, setSkeleton] = useState(true);
    const [notification, setNotification] = useState<mainNotification[]>([]);
    // const [groupNotifications, setGroupNotifications] = useState<NotificationGroupUi[]>([]);
    const [copyClickState, setHandleCopyClick] = useState(false);
    const [groupNotificationVisible, setGroupNotificationVisible] = useState(false);

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24-часовой формат
    };

    const copyBtnClassName = `text-white bg-[var(--greenColor)]`;

    // const Notificatoin = () => {
    //     const stop = (e: any) => {
    //         e.stopPropagation();
    //         e.preventDefault();
    //     };

    //     // Получаем массив разных типов
    //     const typeArr: NotificationGroupUi[] = [];
    //     if (notification?.length > 0) {
    //         for (let i = 0; i < notification.length; i++) {
    //             const checkType = typeArr.some((item) => item.type.type === notification[i].type.type);
    //             if (!checkType) {
    //                 typeArr.push(notification[i]);
    //             }
    //         }
    //     }
    //     // console.log('Массив типов ', typeArr);
    //     return (
    //         <div className={`flex flex-col justify-center p-2 gap-1`}>
    //             {groupNotificationVisible ? <i className="cursor-pointer pi pi-times flex justify-end" onClick={() => setGroupNotificationVisible(false)}></i> : ''}
    //             {/* <span onClick={stop} onMouseDown={stop}>stop</span> */}
                
    //             {/* Отображаем уже сгруппированные например только практические  */}
    //             {/* {groupNotificationVisible && groupNotifications?.length > 0
    //                 ? groupNotifications?.map((item) => {
    //                       let path = '';
    //                       if (user?.is_working && item?.type?.type === 'practical') {
    //                           path = `/students/${item?.meta?.course_id}/${item?.meta?.connect_id}/${item?.meta?.stream_id}/${item?.meta?.student_id}/${item?.from_user?.id}/${item?.meta?.lesson_id}/${item?.meta?.step_id}`;
    //                       } else if (user?.is_student && item?.type?.type === 'practical') {
    //                           path = `/teaching/lessonView/${item?.meta?.lesson_id}/${item?.meta?.id_curricula}/${item?.meta?.stream_id}/${item?.meta?.step_id}`;
    //                       }

    //                       return (
    //                           <div key={item?.id} className={`w-full flex flex-col justify-center shadow p-2 gap-1 sm:gap-2`}>
    //                               <div className="w-full flex justify-between">
    //                                   <Link onClick={() => setContextNotificationId(item?.id)} className="cursor-pointer hover:underline" href={path}>
    //                                       <b className="text-[var(--mainColor)] text-[12px] sm:text-[14px]">{item?.type?.title}</b>
    //                                   </Link>
    //                                   <span className="text-sm w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-full bg-[var(--amberColor)]"></span>
    //                               </div>

    //                               {user?.is_student && item?.type?.type === 'practical' && (
    //                                   <b className="text-[13px] max-w-[350px] text-nowrap overflow-hidden text-ellipsis" title={item?.title}>
    //                                       {item?.title}
    //                                   </b>
    //                               )}
    //                               <p className="m-0 text-[11px] sm:text-[12px]">
    //                                   {item?.from_user?.last_name} {item?.from_user?.name}
    //                               </p>
    //                               <div className="w-full relative flex">
    //                                   <p className="absolute right-0 -top-1 sm:-top-3 text-[9px] sm:text-[10px] m-0">
    //                                       <MyDateTime createdAt={item?.created_at} options={options} />
    //                                   </p>
    //                               </div>
    //                           </div>
    //                       );
    //                   })
    //                 : ''} */}

    //             {!groupNotificationVisible ? (
    //                 typeArr?.length > 2 ? (
    //                     typeArr.map((el: any) => {
    //                         return (
    //                             <div className="flex gap-1 items-center">
    //                                 <span>Список сообщений </span>
    //                                 <b className="cursor-pointer text-[var(--mainColor)] hover:underline" onClick={() => notificationTypeGrouping(el.type.type)}>
    //                                     {el.type.type}
    //                                 </b>
    //                             </div>
    //                         );
    //                     })
    //                 ) : notification?.length > 0 ? (
    //                     notification?.map((item) => {
    //                         let path = '';
    //                         if (user?.is_working) {
    //                             if (item?.type?.type === 'practical') {
    //                                 path = `/students/${item?.meta?.course_id}/${item?.meta?.connect_id}/${item?.meta?.stream_id}/${item?.meta?.student_id}/${item?.from_user?.id}/${item?.meta?.lesson_id}/${item?.meta?.step_id}`;
    //                             } else if (item?.type?.type === 'view'){
    //                                 path = `/notifications`;
    //                             }
    //                         } else if (user?.is_student ) {
    //                             if(item?.type?.type === 'practical') {
    //                                 path = `/teaching/lessonView/${item?.meta?.lesson_id}/${item?.meta?.id_curricula}/${item?.meta?.stream_id}/${item?.meta?.step_id}`;
    //                             }
    //                         }

    //                         return (
    //                             <div key={item?.id} className={`w-full flex flex-col justify-center shadow p-2 gap-1 sm:gap-2`}>
    //                                 <div className="w-full flex justify-between">
    //                                     <Link onClick={() => setContextNotificationId(item?.id)} className="cursor-pointer hover:underline" href={path}>
    //                                         <b className="text-[var(--mainColor)] text-[12px] sm:text-[14px]">{item?.type?.title}</b>
    //                                     </Link>
    //                                     <span className="text-sm w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-full bg-[var(--amberColor)]"></span>
    //                                 </div>

    //                                 {/* student message */}
    //                                 {user?.is_student && item?.type?.type === 'practical' && (
    //                                     <b className="text-[13px] max-w-[350px] text-nowrap overflow-hidden text-ellipsis" title={item?.title}>
    //                                         {item?.title}
    //                                     </b>
    //                                 )}
    //                                 <p className="m-0 text-[11px] sm:text-[12px]">
    //                                     {item?.from_user?.last_name} {item?.from_user?.name}
    //                                 </p>
    //                                 <div className="w-full relative flex">
    //                                     <p className="absolute right-0 -top-1 sm:-top-3 text-[9px] sm:text-[10px] m-0">
    //                                         <MyDateTime createdAt={item?.created_at} options={options} />
    //                                     </p>
    //                                 </div>
    //                             </div>
    //                         );
    //                     })
    //                 ) : (
    //                     <p className="text-center text-[13px]">Сообщений нет</p>
    //                 )
    //             ) : (
    //                 ''
    //             )}
    //         </div>
    //     );
    // };

    const working_notification = [
        {
            label: '',
            template: <Notification notification={notification} />
        }
    ];

    const mobileMenu = [
        user
            ? {
                  label: 'Профиль',
                  icon: 'pi pi-user',
                  items: [
                      {
                          label: '',
                          template: (
                              <div className="flex items-center gap-2 text-sm ml-4 mr-1 flex-wrap">
                                  <div className="flex gap-1">
                                      <span className="text-[var(--titleColor)] text-[13px]">{user?.last_name}</span>
                                      <span className="text-[var(--titleColor)] text-[13px]">{user?.name}</span>
                                  </div>
                                  {user?.myedu_id && (
                                      <small onClick={() => handleCopyClick(String(user.myedu_id))} className={`cursor-pointer p-1 rounded ${copyClickState ? copyBtnClassName : 'bg-[var(--mainBgColor)]'}`}>
                                          {!copyClickState ? <span>ID: {user.myedu_id}</span> : <span className="min-w-[60px]">ID: Copy</span>}
                                      </small>
                                  )}
                              </div>
                          )
                      },
                      {
                          label: 'Выход',
                          icon: 'pi pi-sign-out',
                          items: [],
                          command: () => {
                              window.location.href = '/auth/login';
                              logout({ setUser, setGlobalLoading });
                          }
                      }
                  ]
              }
            : {
                  label: 'Вход',
                  icon: 'pi pi-sign-in',
                  items: [],
                  //   url: '/auth/login'
                  command: () => {
                      // router.push('/auth/login');
                      window.location.href = '/auth/login';
                  }
              },
        {
            label: 'Уведомление',
            icon: (
                <div className="p-overlay-badge">
                    <i className="pi pi-bell p-menuitem-icon" style={{ fontSize: '1.5rem' }}></i>
                    {/* Условное отображение красного кружка (бэйджа) */}
                    {notification?.length > 0 && (
                        // <div className='w-full relative'>
                        <span className="absolute w-[10px] h-[10px] right-[10px] top-[5px] bg-[var(--amberColor)] rounded-full "></span>
                        // </div>
                    )}
                </div>
            ),
            items: [
                {
                    label: '',
                    template: (
                        <div className="max-h-[200px] overflow-y-auto">
                            <Notification notification={notification} />
                        </div>
                    )
                }
            ]
        },
        {
            // label: 'Старый Mooc',
            icon: '',
            items: [],
            template: (
                <div>
                    <Link href={'https://oldmooc.oshsu.kg/'} target="_blank" className="flex text-[12px] text-[var(--bodyColor)]! py-1 hover:text-white! justify-center">
                        Старый MOOC
                    </Link>
                </div>
            ),
            url: 'https://oldmooc.oshsu.kg/'
        }
    ];

    const mobileStudentMenu = [
        user
            ? {
                  label: 'Профиль',
                  icon: 'pi pi-user',
                  items: [
                      {
                          label: '',
                          template: (
                              <div className="flex items-center gap-2 text-sm ml-4 mr-1 flex-wrap">
                                  <div className="flex gap-1">
                                      <span className="text-[var(--titleColor)] text-[13px]">{user?.last_name}</span>
                                      <span className="text-[var(--titleColor)] text-[13px]">{user?.name}</span>
                                  </div>
                                  {user?.myedu_id && (
                                      <small onClick={() => handleCopyClick(String(user.myedu_id))} className={`cursor-pointer p-1 rounded ${copyClickState ? copyBtnClassName : 'bg-[var(--mainBgColor)]'}`}>
                                          {!copyClickState ? <span>ID: {user.myedu_id}</span> : <span className="min-w-[60px]">ID: Copy</span>}
                                      </small>
                                  )}
                              </div>
                          )
                      },
                      {
                          label: 'Выход',
                          icon: 'pi pi-sign-out',
                          items: [],
                          command: () => {
                              window.location.href = '/auth/login';
                              logout({ setUser, setGlobalLoading });
                          }
                      }
                  ]
              }
            : {
                  label: 'Вход',
                  icon: 'pi pi-sign-in',
                  items: [],
                  command: () => {
                      window.location.href = '/auth/login';
                  }
              },

        {
            label: 'Уведомление',
            icon: (
                <div className="p-overlay-badge">
                    <i className="pi pi-bell p-menuitem-icon" style={{ fontSize: '1.5rem' }}></i>
                    {/* Условное отображение красного кружка (бэйджа) */}
                    {notification?.length > 0 && <span className="absolute w-[10px] h-[10px] right-[10px] top-[5px] bg-[var(--amberColor)] rounded-full "></span>}
                </div>
            ),
            items: [
                {
                    label: '',
                    template: (
                        <div className="max-h-[200px] overflow-y-auto">
                            <Notification notification={notification} />
                        </div>
                    )
                }
            ]
        },

        {
            // label: 'Старый Mooc',
            icon: '',
            items: [],
            template: (
                <div>
                    <Link href={'https://oldmooc.oshsu.kg/'} target="_blank" className="flex text-[12px] text-[var(--bodyColor)]! py-1 hover:text-white! justify-center">
                        Старый MOOC
                    </Link>
                </div>
            ),
            url: 'https://oldmooc.oshsu.kg/'
        }
    ];

    // profile
    const profileItems = [
        {
            label: '',
            template: (
                <div className="flex items-center flex-col gap-1 text-sm">
                    <div className="flex gap-1">
                        <span className="text-[var(--titleColor)]">{user?.last_name}</span>
                        <span className="text-[var(--titleColor)]">{user?.name}</span>
                    </div>
                    <span className="text-gray-500 text-[12px]">{user?.email}</span>
                </div>
            )
        },
        {
            label: 'Выход',
            icon: 'pi pi-sign-out',
            items: [],
            command: () => {
                window.location.href = '/auth/login';
                logout({ setUser, setGlobalLoading });
            }
        }
    ];

    const student_notification = [
        {
            label: '',
            template: <Notification notification={notification} />
        }
    ];

    const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        menu.current?.toggle(e);
        // setMobile(prev => !prev);
    };

    const handleCopyClick = async (id: string) => {
        const textToCopy = id;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setHandleCopyClick(true);
            setTimeout(() => {
                setHandleCopyClick(false);
            }, 2000);
        } catch (err) {
            console.error('Не удалось скопировать текст: ', err);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (user?.is_working || user?.is_student) {
            handleNotifications();
        }
    }, [user]);

    useEffect(() => {
        if (contextNotifications) {
            setNotification(contextNotifications);
        }
    }, [contextNotifications]);

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" /> */}
                <img src={`/layout/images/logo-remove.png`} className="w-[90px] sm:w-[100px]" alt="logo" />
                <h3 className="hidden sm:block text-[18px] md:text-[30px]">Цифровой кампус ОшГУ</h3>
            </Link>

            {pathName !== '/' ? (
                // departament.name.length > 0 ? (
                !pathName.startsWith('/pdf') && !pathName.startsWith('/videoInstruct') ? (
                    <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                        <i className="pi pi-bars text-[var(--mainColor)]" />
                    </button>
                ) : (
                    ''
                )
            ) : (
                // )
                // : pathName !== '/course' ? (
                //     <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                //         <i className="pi pi-bars text-[var(--mainColor)]" />
                //     </button>
                // )
                // : (
                //     ''
                // )
                ''
            )}

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className="flex items-center gap-4">
                    {media ? (
                        <div className="relative">
                            <div className="absolute w-[10px] h-[10px] right-[10px] top-[5px] bg-[var(--amberColor)] rounded-full"></div>
                            <div className="max-h-[100px] overflow-hidden">
                                <Tiered
                                    title={{ name: '', font: 'pi pi-ellipsis-v' }}
                                    insideColor={'--bodyColor'}
                                    items={
                                        !user
                                            ? [
                                                  {
                                                      label: 'Вход',
                                                      icon: 'pi pi-sign-in',
                                                      items: [],
                                                      command: () => {
                                                          window.location.href = '/auth/login';
                                                      }
                                                  }
                                              ]
                                            : user?.is_student
                                            ? mobileStudentMenu
                                            : user?.is_working
                                            ? mobileMenu
                                            : []
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={`flex items-center gap-3 ${!media ? 'order-2' : 'order-3'} `}>
                            <Link className="text-[var(--titleColor)] text-sm hover:text-[var(--mainColor)]" href={'https://oldmooc.oshsu.kg/'} target="_blank">
                                Старый Mooc
                            </Link>
                        </div>
                    )}

                    {skeleton ? (
                        <div className="w-[150px]">
                            <GroupSkeleton count={1} size={{ width: '100%', height: '3rem' }} />
                        </div>
                    ) : user ? (
                        <div className={`hidden lg:flex items-center gap-3 ${media ? 'order-1' : 'order-2'} `}>
                            {user?.is_working ? (
                                // <Tiered title={{ name: '', font: 'pi pi-bell' }} items={user?.is_working ? working_notification : user?.is_student ? student_notification : []} insideColor={'--titleColor'} />
                                <div className="px-3 border-x-1 border-[var(--borderBottomColor)]">
                                    <div className="relative">
                                        {notification?.length > 0 ? <div className={`absolute -right-1 -top-1 px-1 bg-[var(--amberColor)] rounded text-white text-[11px]`}>{notification.length}</div> : ''}
                                        <button
                                            // icon={title.font}
                                            onClick={(e) => toggleMenu(e)}
                                            style={{ color: 'black', fontSize: media ? '16px' : '20px' }}
                                            className={`cursor-pointer flex gap-2 items-center px-0 bg-white text-blue-300 p-2 pi pi-bell font-bold`}
                                        />
                                    </div>
                                    <TieredMenu
                                        model={working_notification}
                                        popup
                                        ref={menu}
                                        breakpoint="1000px"
                                        // style={{ maxWidth: media ? '300px' : '500px', left: '10px' }}
                                        style={{ maxWidth: '600px', left: '8px' }}
                                        className={`${notification?.length < 1 ? 'min-w-[280px]' : 'min-w-[380px]'} max-h-[370px] mt-4 overflow-y-scroll`}
                                        pt={{
                                            root: { className: `bg-white border w-[500px] border-gray-300 rounded-md shadow-md` },
                                            menu: { className: 'transition-all' },
                                            menuitem: { className: 'text-[var(--titleColor)] text-[14px] py-1 hover:shadow-xl border-gray-200' },
                                            action: { className: `flex justify-center items-center gap-2` }, // для иконки + текста не работает :)
                                            icon: { className: 'text-[var(--titleColor)] mx-1' }
                                            // submenuIcon: { className: 'text-gray-400 ml-auto' }
                                        }}
                                    />
                                </div>
                            ) : user?.is_student ? (
                                <div className="px-3 border-x-1 border-[var(--borderBottomColor)]">
                                    <div className="relative">
                                        {notification?.length > 0 ? <div className={`absolute -right-1 -top-1 px-1 bg-[var(--amberColor)] rounded text-white text-[11px]`}>{notification.length}</div> : ''}
                                        <button
                                            // icon={title.font}
                                            onClick={(e) => toggleMenu(e)}
                                            style={{ color: 'black', fontSize: media ? '16px' : '20px' }}
                                            className={`cursor-pointer flex gap-2 items-center px-0 bg-white text-blue-300 p-2 pi pi-bell font-bold`}
                                        />
                                    </div>
                                    <TieredMenu
                                        model={student_notification}
                                        popup
                                        ref={menu}
                                        breakpoint="1000px"
                                        // style={{ maxWidth: media ? '300px' : '500px', left: '10px' }}
                                        style={{ maxWidth: '600px', left: '8px' }}
                                        className={`${notification?.length < 1 ? 'min-w-[280px]' : 'min-w-[380px]'} max-h-[370px] mt-4 overflow-y-scroll`}
                                        pt={{
                                            root: { className: `bg-white border w-[500px] border-gray-300 rounded-md shadow-md` },
                                            menu: { className: 'transition-all' },
                                            menuitem: { className: 'text-[var(--titleColor)] text-[14px] py-1 hover:shadow-xl border-gray-200' },
                                            action: { className: `flex justify-center items-center gap-2` }, // для иконки + текста не работает :)
                                            icon: { className: 'text-[var(--titleColor)] mx-1' }
                                            // submenuIcon: { className: 'text-gray-400 ml-auto' }
                                        }}
                                    />
                                </div>
                            ) : (
                                ''
                            )}
                            {/* <Tiered title={{ name: '', font: 'pi pi-user' }} items={profileItems} insideColor={'--titleColor'} /> */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <span>
                                        {user?.last_name} {user?.name && user?.name[0] + '.'} {user?.father_name && user?.father_name.length > 1 && user?.father_name[0] + '.'}
                                    </span>
                                    {user?.myedu_id && (
                                        <small onClick={() => handleCopyClick(String(user.myedu_id))} className={`cursor-pointer p-1 rounded ${copyClickState ? copyBtnClassName : 'bg-[var(--mainBgColor)]'}`}>
                                            {!copyClickState ? <span>ID: {user.myedu_id}</span> : <span className="min-w-[60px]">ID: Copy</span>}
                                        </small>
                                    )}
                                </div>
                                <button
                                    className="cursor-pointer"
                                    onClick={() => {
                                        window.location.href = '/auth/login';
                                        logout({ setUser, setGlobalLoading });
                                    }}
                                >
                                    <i className="pi pi-sign-out text-xl rounded-full p-2 hover:text-white hover:bg-[var(--mainColor)]"></i>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={`hidden lg:block ${media ? 'order-1' : 'order-2'}`}>
                            <Link href={'/auth/login'}>
                                <FancyLinkBtn btnWidth={'100px'} backround={'--redColor'} effectBg={'--mainColor'} title={'Вход'} btnType={false} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* {media && mobileMenu} */}
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
