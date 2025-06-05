/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import Tiered from '@/app/components/popUp/Tiered';
import FancyLinkBtn from '@/app/components/buttons/FancyLinkBtn';
import { classNames } from 'primereact/utils';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePathname } from 'next/navigation';
import { logout } from '@/utils/logout';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar, user, setUser, setGlobalLoading } = useContext(LayoutContext);

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

    const items = [
        {
            label: 'Ачык онлайн курстар',
            icon: 'pi pi-file',
            items: [],
            link: '/login'
        },
        {
            label: 'Бакалавриат',
            icon: 'pi pi-file',
            items: []
        },
        {
            label: 'Магистратура',
            icon: 'pi pi-file',
            items: []
        },
        {
            label: 'Кошумча билим берүү',
            icon: 'pi pi-file',
            items: []
        }
    ];

    const mobileMenu = [
        user
            ? {
                  label: 'Профиль',
                  icon: 'pi pi-user',
                  items: [
                      {
                          label: (
                              <div className="flex justify-center m-auto items-center flex-col gap-1 text-sm">
                                  <div className="flex gap-1">
                                      <span className="text-[var(--titleColor)]">{user?.last_name}</span>
                                      <span className="text-[var(--titleColor)]">{user?.name}</span>
                                  </div>
                                  <span className="text-gray-500 text-[12px]">{user?.email}</span>
                              </div>
                          ),
                      },
                      {
                          label: 'Чыгуу',
                          icon: 'pi pi-sign-out',
                          items: [],
                          command: () => {
                              logout({ setUser, setGlobalLoading });
                          }
                      }
                  ]
              }
            : {
                  label: 'Кирүү',
                  icon: 'pi pi-sign-in',
                  items: [],
                  link: '/auth/login'
              },
        {
            label: 'Каталог',
            icon: 'pi pi-list',
            items: [
                {
                    label: 'Ачык онлайн курстар',
                    icon: 'pi pi-file',
                    items: [],
                    link: '/login'
                },
                {
                    label: 'Бакалавриат',
                    icon: 'pi pi-file',
                    items: []
                },
                {
                    label: 'Магистратура',
                    icon: 'pi pi-file',
                    items: []
                },
                {
                    label: 'Кошумча билим берүү',
                    icon: 'pi pi-file',
                    items: []
                }
            ]
        },
        {
            label: 'Бакалавриат',
            icon: 'pi pi-file',
            items: []
        },
        {
            label: 'Магистратура',
            icon: 'pi pi-file',
            items: []
        },
        {
            label: 'Кошумча билим берүү',
            icon: 'pi pi-file',
            items: []
        },
        {
            label: 'Кошумча билим берүү',
            icon: 'pi pi-file',
            items: []
        },
        {
            label: 'КАТАЛОГ',
            icon: 'pi pi-list',
            items: [
                {
                    label: 'Ачык онлайн курстар',
                    icon: 'pi pi-file',
                    items: [],
                    link: '/login'
                },
                {
                    label: 'Бакалавриат',
                    icon: 'pi pi-file',
                    items: []
                },
                {
                    label: 'Магистратура',
                    icon: 'pi pi-file',
                    items: []
                },
                {
                    label: 'Кошумча билим берүү',
                    icon: 'pi pi-file',
                    items: []
                }
            ]
        }
    ];

    // profile
    const profileItems = [
        {
            label: (
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
            label: 'Чыгуу',
            icon: 'pi pi-sign-out',
            items: [],
            command: () => {
                logout({ setUser, setGlobalLoading });
            }
        }
    ];

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" /> */}
                <img src={`/layout/images/logo-remove.png`} className="w-[90px] sm:w-[100px]" alt="logo" />
                <h3 className="hidden sm:block text-[18px] md:text-[30px]">Цифровой кампус ОшГУ</h3>
            </Link>

            {pathName !== '/' ? (
                <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                    <i className="pi pi-bars text-[var(--mainColor)]" />
                </button>
            ) : (
                ''
            )}

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className="flex items-center gap-4">
                    {media ? (
                        <Tiered title={{ name: '', font: 'pi pi-ellipsis-v' }} insideColor={'--bodyColor'} items={mobileMenu} />
                    ) : (
                        <div className={`flex items-center gap-3 ${!media ? 'order-2' : 'order-3'} `}>
                            <Tiered title={{ name: 'Каталог', font: 'pi pi-list' }} insideColor={'--titleColor'} items={items} />
                            <Tiered
                                title={{ name: 'Окуялар', font: 'pi pi-calendar' }}
                                insideColor={'--titleColor'}
                                items={[
                                    {
                                        label: 'event',
                                        items: [],
                                        link: '/login'
                                    },
                                    {
                                        label: 'event details',
                                        items: [],
                                        link: '/login'
                                    }
                                ]}
                            />
                            <Link className="text-[var(--titleColor)] hover:text-[var(--mainColor)]" href={'https://www.oshsu.kg/ru'}>
                                ОшМУнун сайты
                            </Link>
                            <Link className="text-[var(--titleColor)] hover:text-[var(--mainColor)]" href={'#'}>
                                Байланыш
                            </Link>
                        </div>
                    )}

                    {user && user ? (
                        <div className={`hidden lg:block ${media ? 'order-1' : 'order-2'}`}>
                            <Tiered title={{ name: '', font: 'pi pi-user' }} items={profileItems} insideColor={'--titleColor'} />
                        </div>
                    ) : (
                        <div className={`hidden lg:block ${media ? 'order-1' : 'order-2'}`}>
                            <FancyLinkBtn btnWidth={'100px'} backround={'--redColor'} effectBg={'--mainColor'} title={'Кирүү'} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
