/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../service/types/types';
import {useTranslation} from "react-i18next";

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { t } = useTranslation();

    const model: AppMenuItem[] = [
        {
            label: t('menu.home'),
            items: [
                { label: t('menu.dashboard'), icon: 'pi pi-fw pi-home', to: '/', badge: 'NEW'},
            ]
        },
        {
            label: t('menu.company.information'),
            items: [
                { label: t('menu.company'), icon: 'pi pi-fw pi-briefcase', to: '/companies'},
                { label: t('menu.partnerships'), icon: 'pi pi-fw pi-percentage', to: '/partnerships'},
                { label: t('menu.financials'), icon: 'pi pi-fw pi-money-bill', to: '/financials'}
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
