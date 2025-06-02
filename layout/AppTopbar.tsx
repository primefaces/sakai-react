/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import Tiered from '@/app/components/popUp/Tiered';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FancyLinkBtn from '@/app/components/buttons/FancyLinkBtn';
import { usePathname } from 'next/navigation';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
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

    const items =  [
        {
                label: 'Ачык онлайн курстар',
                icon: 'pi pi-file',
                items: [],
                link:'/login'
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
        ];

    const mobileMenu = [
      {
            label: 'КАТАЛОГ',
            icon: 'pi pi-list',
            items:  [
                {
                        label: 'Ачык онлайн курстар',
                        icon: 'pi pi-file',
                        items: [],
                        link:'/login'
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
                ],
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
            items:  [
                {
                        label: 'Ачык онлайн курстар',
                        icon: 'pi pi-file',
                        items: [],
                        link:'/login'
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
                ],
      },
    ];

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" /> */}
                <img src={`/layout/images/logo-remove.png`} className='w-[100px]' alt="logo" />
                <h3 className="hidden sm:block text-[18px] md:text-[30px]">Цифровой кампус ОшГУ</h3>
            </Link>

            {pathName !== '/' ? 
                <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                    <i className="pi pi-bars text-[var(--mainColor)]" />
                </button> : ''
            }

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
             <div className="flex items-center gap-4">
                        {media ?
                                <Tiered title={{name:'', font:'faEllipsisVertical'}} insideColor={'--bodyColor'} items={mobileMenu}/> 
                                    : <div className={`flex items-center gap-3 ${!media ? 'order-2' : 'order-3'} `}>

                                <Tiered title={{name:'КАТАЛОГ', font:''}} insideColor={'--titleColor'} items={items}/>
                                <Tiered title={{name:'Окуялар', font:''}} insideColor={'--titleColor'} items={[
                                    {
                                            label: 'event',
                                            items: [],
                                            link:'/login'
                                    },
                                    {
                                            label: 'event details',
                                            items: [],
                                            link:'/login'
                                    }
                                ]}/>
                                <Link className="text-[var(--titleColor)] hover:text-[var(--mainColor)]" href={'https://www.oshsu.kg/ru'}>ОшМУнун сайты</Link>
                                <Link className="text-[var(--titleColor)] hover:text-[var(--mainColor)]" href={'#'}>Байланыш</Link>
                            </div>
                        }

                    <div className={`hidden lg:block ${media ? 'order-1' : 'order-2'}`}><FancyLinkBtn backround={'--redColor'} effectBackround={'--mainColor'} title={'Кирүү'}/></div>
             </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
