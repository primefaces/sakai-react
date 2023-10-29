/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/', badge: 'NEW'}]
        },
        {
            label: 'SAKAI Template',
            items: [
                {
                    label: 'Home',
                    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/sakai/' }]
                },
                {
                    label: 'UI Components',
                    items: [
                        { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/sakai/uikit/formlayout' },
                        { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/sakai/uikit/input' },
                        { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/sakai/uikit/floatlabel' },
                        { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/sakai/uikit/invalidstate' },
                        { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/sakai/uikit/button', class: 'rotated-icon' },
                        { label: 'Table', icon: 'pi pi-fw pi-table', to: '/sakai/uikit/table' },
                        { label: 'List', icon: 'pi pi-fw pi-list', to: '/sakai/uikit/list' },
                        { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/sakai/uikit/tree' },
                        { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/sakai/uikit/panel' },
                        { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/sakai/uikit/overlay' },
                        { label: 'Media', icon: 'pi pi-fw pi-image', to: '/sakai/uikit/media' },
                        { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/sakai/uikit/menu', preventExact: true },
                        { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/sakai/uikit/message' },
                        { label: 'File', icon: 'pi pi-fw pi-file', to: '/sakai/uikit/file' },
                        { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/sakai/uikit/charts' },
                        { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/sakai/uikit/misc' }
                    ]
                },
                {
                    label: 'Prime Blocks',
                    items: [
                        { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/sakai/blocks', badge: 'NEW' },
                        { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://blocks.primereact.org', target: '_blank' }
                    ]
                },
                {
                    label: 'Utilities',
                    items: [
                        { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/sakai/utilities/icons' },
                        { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://primeflex.org/', target: '_blank' }
                    ]
                },
                {
                    label: 'Pages',
                    icon: 'pi pi-fw pi-briefcase',
                    to: '/pages',
                    items: [
                        {
                            label: 'Landing',
                            icon: 'pi pi-fw pi-globe',
                            to: '/sakai/landing'
                        },
                        {
                            label: 'Auth',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Login',
                                    icon: 'pi pi-fw pi-sign-in',
                                    to: '/sakai/auth/login'
                                },
                                {
                                    label: 'Error',
                                    icon: 'pi pi-fw pi-times-circle',
                                    to: '/sakai/auth/error'
                                },
                                {
                                    label: 'Access Denied',
                                    icon: 'pi pi-fw pi-lock',
                                    to: '/sakai/auth/access'
                                }
                            ]
                        },
                        {
                            label: 'Crud',
                            icon: 'pi pi-fw pi-pencil',
                            to: '/sakai/pages/crud'
                        },
                        {
                            label: 'Timeline',
                            icon: 'pi pi-fw pi-calendar',
                            to: '/sakai/pages/timeline'
                        },
                        {
                            label: 'Not Found',
                            icon: 'pi pi-fw pi-exclamation-circle',
                            to: '/sakai/pages/notfound'
                        },
                        {
                            label: 'Empty',
                            icon: 'pi pi-fw pi-circle-off',
                            to: '/sakai/pages/empty'
                        }
                    ]
                },
                {
                    label: 'Hierarchy',
                    items: [
                        {
                            label: 'Submenu 1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'Submenu 1.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                        { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                        { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                    ]
                                },
                                {
                                    label: 'Submenu 1.2',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                                }
                            ]
                        },
                        {
                            label: 'Submenu 2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'Submenu 2.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                        { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                    ]
                                },
                                {
                                    label: 'Submenu 2.2',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Get Started',
                    items: [
                        {
                            label: 'Documentation',
                            icon: 'pi pi-fw pi-question',
                            to: '/sakai/documentation'
                        },
                        {
                            label: 'View Source',
                            icon: 'pi pi-fw pi-search',
                            url: 'https://github.com/primefaces/sakai-react',
                            target: '_blank'
                        }
                    ]
                }
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
