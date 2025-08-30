'use client';
import React, { useState, createContext, useEffect } from 'react';
import { LayoutState, ChildContainerProps, LayoutConfig, LayoutContextProps } from '@/types';
import SessionManager from '@/app/components/SessionManager';
import GlobalLoading from '@/app/components/loading/GlobalLoading';
import Message from '@/app/components/messages/Message';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { User } from '@/types/user';
import { MessageType } from '@/types/messageType';
import { fetchCourses, fetchThemes } from '@/services/courses';
import { fetchStudentThemes } from '@/services/studentMain';
import { myMainCourseType } from '@/types/myMainCourseType';

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
    const [globalLoading, setGlobalLoading] = useState<boolean>(false);

    // Сообщение об ошибке/успехе
    const [message, setMessage] = useState<MessageType>({ state: false, value: {} });

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

    // fetch course
    const [course, setCourses] = useState<{ current_page: number; total: number; per_page: number; data:myMainCourseType[]  }>({ current_page: 1, total: 0, per_page: 10, data: []  });

    const contextFetchCourse = async (page: number) => {
        const data = await fetchCourses(page, 0);
        console.log(data.courses);

        if (data?.courses) {
            // setCourses(data.courses.data);
            setCourses(data.courses);
        }
    };

    // fetch themes
    const [contextThemes, setContextThemes] = useState([]);
    const contextFetchThemes = async (id: number | null) => {
        const data = await fetchThemes(Number(id) || null);

        setContextThemes(data);
    };

    useEffect(() => {
        console.log('course ', course);
    }, [course]);

    // fetch themes for student
    const [contextStudentThemes, setContextStudentThemes] = useState([]);
    const contextFetchStudentThemes = async (id: number) => {
        const data = await fetchStudentThemes(id);

        setContextStudentThemes(data);
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
        setMessage,

        contextFetchCourse,
        course,
        setCourses,

        contextFetchThemes,
        contextThemes,
        setContextThemes,

        contextFetchStudentThemes,
        contextStudentThemes,
        setContextStudentThemes
    };

    return (
        <LayoutContext.Provider value={value}>
            <SessionManager />
            <GlobalLoading />
            <ConfirmDialog />
            {message.state && <Message />}
            {children}
        </LayoutContext.Provider>
    );
};
