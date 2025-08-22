/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { useParams, usePathname } from 'next/navigation';

const AppMenu = () => {
    const { layoutConfig, user, course, contextFetchCourse, contextFetchThemes, contextThemes, setContextThemes, contextFetchStudentThemes, contextStudentThemes } = useContext(LayoutContext);

    const location = usePathname();
    const pathname = location;
    const { studentThemeCourse } = useParams();

    const [courseList, setCourseList] = useState([]);
    const [clickedCourseId, setClickedCourseId] = useState<number | null>(null);

    const [themesStudentList, setThemesStudentList] = useState([]);
        
    const byStatus = user?.is_working
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
              pathname.startsWith('/teaching/') && { label: 'Темалар', icon: 'pi pi-fw pi-calendar-lessons', items: themesStudentList || [] }
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
            contextFetchCourse();
        }
        if (user?.is_student) {            
            const isTopicsChildPage = pathname.startsWith('/teaching/');
            if (isTopicsChildPage) {
                console.log('Вызов функции тем студента');
                contextFetchStudentThemes(studentThemeCourse);
            }
        }
    }, [user]);

    useEffect(() => {
        if (course) {
            const forCourse = [{ label: 'Курс', id: 0, to: '/course' }];
            course.data?.map((item: any) =>
                forCourse.push({
                    label: item.title,
                    id: item.id,
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
                command: () => {
                    console.log('clicked theme', item.id);
                }
            }));
            console.log(newThemes);

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
        
        if(contextStudentThemes?.lessons){
            const forThemes = [];
            contextStudentThemes.lessons.data?.map((item: any) =>
                forThemes.push({
                    label: item.title,
                    id: item.id,
                    to: '/teaching/ ? ',
                })
            );

            setThemesStudentList(forThemes || []);
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
