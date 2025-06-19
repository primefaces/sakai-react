'use client';
import React, { useState, createContext, useEffect } from 'react';
import { LayoutState, ChildContainerProps, LayoutConfig, LayoutContextProps } from '@/types';
import SessionManager from '@/app/components/SessionManager';
import GlobalLoading from '@/app/components/loading/GlobalLoading';
import Message from '@/app/components/messages/Message';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { User } from '@/types/user';
import { MessageType } from '@/types/messageType';

export const LayoutContext = createContext({} as LayoutContextProps);

export const LayoutProvider = ({ children }: ChildContainerProps) => {
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14
    });

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    });

        // 👇 Добавляем пользователя
    const [user, setUser] = useState<User | null>(null);

        // Глобальная загрузка
    const [globalLoading, setGlobalLoading] = useState<boolean>(true);

        // Сообщение об ошибке/успехе
    const [message, setMessage] = useState<MessageType>({state:false, value:{}});
    
    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: !prevLayoutState.overlayMenuActive }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive }));
        } else {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: !prevLayoutState.profileSidebarVisible }));
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };

    const value: LayoutContextProps = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showProfileSidebar,
        user,
        setUser,
        globalLoading,
        setGlobalLoading,
        message,
        setMessage
    };

    return <LayoutContext.Provider value={value}>
            <SessionManager/>
            <GlobalLoading/>
            <ConfirmDialog />    
            {message.state && <Message/>}
            {children}
        </LayoutContext.Provider>;
};
