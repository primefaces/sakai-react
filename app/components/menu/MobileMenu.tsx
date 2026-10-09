'use client';

import React, { useContext, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutContext } from '@/layout/context/layoutcontext';
import Notification from '@/app/components/notification/Notification';
import { TieredMenu } from 'primereact/tieredmenu';
import type { TieredMenu as TieredMenuRef } from 'primereact/tieredmenu';
import { useLocalization } from '@/layout/context/localizationcontext';

export const BottomNav = () => {
    const pathname = usePathname();
    const { contextNotifications } = useContext(LayoutContext);
    const { translations } = useLocalization();
    const menu = useRef<TieredMenuRef>(null);
    const student_notification = [
        {
            label: '',
            template: <Notification notification={contextNotifications} />
        }
    ];

    const toggleMenu = (e: any) => {
        menu.current?.toggle(e);
        // setMobile(prev => !prev);
    };

    const stop = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const navItems = [
        { label: translations.mainPageLink, icon: 'pi-home', href: '/' },
        { label: translations.panelPage, icon: 'pi-th-large', href: '/studentHome' },
        { label: translations.learnPage, icon: 'pi-graduation-cap', href: '/teaching' },
        { label: translations.notifications, icon: 'pi-bell', href: '/notifications' }
    ];

    return (
        <div className="w-full sticky bottom-0 left-0 right-0 z-50 flex justify-center">
            <nav className="flex items-center justify-between w-full bg-white/50 backdrop-blur-md border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const isNotificate = item?.icon === 'pi-bell';

                    return (
                        <Link
                            onClick={(e) => {
                                if(isNotificate) {
                                    toggleMenu(e);
                                    stop(e);
                                }
                            }}
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center flex-1 group py-1 text-gray-500 group-hover:text-gray-700"
                        >
                            {/* Индикатор уведомлений */}
                            {item?.icon === 'pi-bell' && contextNotifications?.length > 0 && (
                                <div className="absolute top-0 right-3 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-red-500 rounded-full text-white text-[10px] font-bold shadow-sm z-20 animate-pulse">
                                    {contextNotifications.length}
                                </div>
                            )}

                            {/* Контейнер иконки с анимацией */}
                            <div className={`relative px-2 pt-2 rounded-xl transition-all duration-300 ease-out ${isActive ? 'bg-[var(--mainColor)]/10 translate-y-[-4px]' : 'hover:bg-gray-100'}`}>
                                <i
                                    className={`pi ${item.icon} transition-all duration-300 ${isActive ? 'text-[var(--mainColor)] scale-110' : 'text-gray-500 group-hover:text-gray-700'}`}
                                    style={{ fontSize: '1rem' }}
                                />
                            </div>

                            {/* Текст */}
                            <span className={`text-[0.625rem] font-medium transition-all duration-300 ${isActive ? 'text-[var(--mainColor)] font-bold translate-y-[-2px]' : 'text-gray-500 group-hover:text-gray-700'}`}>
                                {item.label}
                            </span>

                            {/* Активная точка */}
                            <div className={`absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--mainColor)] transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />

                            {/* Меню уведомлений (скрыто, логика сохранена) */}
                            {isNotificate && (
                                <TieredMenu
                                    model={student_notification}
                                    popup
                                    ref={menu}
                                    breakpoint="1000px"
                                    style={{ maxWidth: '500px', left: '8px' }}
                                    className={`${contextNotifications?.length < 1 ? 'min-w-[250px]' : 'min-w-[310px]'} max-h-[370px] mt-4 overflow-y-scroll`}
                                    pt={{
                                        root: { className: 'bg-white border border-gray-300 rounded-xl shadow-xl translate-y-[-100%]' },
                                        menu: { className: 'p-1' },
                                        menuitem: { className: 'text-[var(--titleColor)] text-[0.875rem] py-1 hover:bg-gray-50 rounded-lg transition-colors' },
                                        action: { className: `flex justify-center items-center gap-2 px-3 py-2` },
                                        icon: { className: 'text-[var(--titleColor)] mx-1' }
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
