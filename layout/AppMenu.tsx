/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { useParams, usePathname } from 'next/navigation';

const AppMenu = () => {
    const { layoutConfig, user, course, contextFetchCourse, contextFetchThemes, contextThemes, setContextThemes, contextFetchStudentThemes, contextStudentThemes } = useContext(LayoutContext);
    interface test {
        label: string;
        id: number;
        to?: string;
        items?: [];
        command?: () => void;
    }

    const location = usePathname();
    const pathname = location;
    const { studentThemeCourse } = useParams();

    const [courseList, setCourseList] = useState<test[]>([]);
    const [clickedCourseId, setClickedCourseId] = useState<number | null>(null);

    const [themesStudentList, setThemesStudentList] = useState<{ label: string; id: number; to: string; items?: AppMenuItem[] }[]>([]);

    const byStatus: AppMenuItem[] = user?.is_working
        ? [
              {
                  label: 'Курстар',
                  icon: 'pi pi-fw pi-calendar-clock',
                  items: courseList?.length > 0 ? courseList : []
              }
          ]
        : user?.is_student
        ? [
              { label: 'Окуу планы', icon: 'pi pi-fw pi-calendar-clock', to: '/teaching' },
              pathname.startsWith('/teaching/lesson/') ? { label: 'Темалар', icon: 'pi pi-fw pi-book', items: themesStudentList?.length > 0 ? themesStudentList : [] } : { label: '' }
          ] 
        : [];

    const model: AppMenuItem[] = [
        {
            label: 'Баракчалар',
            items: [{ label: 'Башкы баракча', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: '',
            items: byStatus
        }
    ];

    useEffect(() => {
        if (user?.is_working) {
            contextFetchCourse(1);
        }
        if (user?.is_student) {
            const isTopicsChildPage = pathname.startsWith('/teaching/');
            if (isTopicsChildPage) {
                console.log('Вызов функции тем студента');
                if (studentThemeCourse) {
                    console.log(studentThemeCourse);
                    contextFetchStudentThemes(1);
                }
            }
        }
    }, [user, studentThemeCourse]);

    useEffect(() => {
        if (course) {
            const forCourse: test[] = [{ label: 'Курс', id: 0, to: '/course' }];
            course.data?.map((item) =>
                forCourse.push({
                    label: item.title,
                    id: item.id,
                    to: `/course/${clickedCourseId}`,
                    items: [], // пока пусто
                    command: () => {
                        contextFetchThemes(item.id);                        
                        setClickedCourseId(item.id);
                    }
                })
            );
            setCourseList(forCourse);
        }
    }, [course]);

    useEffect(() => {
        if (contextThemes && contextThemes.lessons) {
            const newThemes = contextThemes.lessons.data.map((item: any) => ({
                label: item.title,
                id: item.id,
                to: `/course/${clickedCourseId}/${item.id}`,
            }));

            setCourseList((prev) =>
                prev.map((course) =>
                    course.id === clickedCourseId
                        ? { ...course, items: newThemes } // добавляем темы
                        : course
                )
            );
        }
    }, [contextThemes]);

    useEffect(() => {
        console.log('Обновился и готов');

        if (contextStudentThemes?.lessons) {
            const forThemes: any = [];
            contextStudentThemes.lessons.data?.map((item: any) =>
                forThemes.push({
                    label: item.title,
                    id: item.id,
                    to: `/teaching/${studentThemeCourse}/${item.id}`
                })
            );
            if (forThemes.length > 0) {
                setThemesStudentList(forThemes || []);
            }
        }
    }, [contextStudentThemes, pathname]);

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
