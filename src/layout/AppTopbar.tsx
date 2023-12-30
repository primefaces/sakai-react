/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import { AppTopbarRef } from '../service/types/types';
import { LayoutContext } from './context/layoutcontext';
import {useUser} from "./context/usercontext";
import {redirect, useRouter} from "next/navigation";
import {Company} from "../service/types/company/Company";
import {CompanyService} from "../service/CompanyService";
import {useTranslation} from "react-i18next";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const user = useUser();
    const {t} = useTranslation();

    useEffect(() => {
        if(!user.loadingUser){
            if(user.current == null){
                redirect('/landing')
            }
        }
    }, [user.loadingUser]);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    function getSign() {
        if(user.current == null){
            return <Link href="/auth/login">
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-sign-in"></i>
                    <span>{t('topbar.signIn')}</span>
                </button>
            </Link>
        }else{
            return <button type="button" className="p-link layout-topbar-button" onClick={() => user.logout()}>
                <i className="pi pi-sign-out"></i>
                <span>{t('topbar.signOut')}</span>
            </button>
        }
    }

    function getCompany() {
        if(user.company != null){
            return <button type="button" className="p-link" disabled={true} >
                {user.company.name}
            </button>;
        }
    }

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`}
                     width="47.22px" height={'35px'} alt="logo"/>
                <span>UyCe Finance</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button"
                    onClick={onMenuToggle}>
                <i className="pi pi-bars"/>
            </button>

            <button ref={topbarmenubuttonRef} type="button"
                    className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v"/>
            </button>

            <div ref={topbarmenuRef}
                 className={classNames('layout-topbar-menu', {'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible})}>
                {getCompany()}
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>{t('topbar.profile')}</span>
                </button>

                {getSign()}
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
