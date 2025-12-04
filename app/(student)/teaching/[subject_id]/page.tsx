'use client';

import StudentInfoCard from '@/app/components/lessons/StudentInfoCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsLessons, fetchMainLesson, fetchSubjects } from '@/services/studentMain';
import { lessonType } from '@/types/lessonType';
import { useParams } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useContext, useEffect, useState } from 'react';

export default function StudentLesson() {
    // types
    interface subjectType {
        id_curricula: number;
        course_ids: number[];
        streams: number[];
    }

    interface CourseType {
        id: number;
        connections: { subject_type: string; id: number; user_id: number | null; id_stream: number }[];
        title: string;
        description: string;
        user: { last_name: string; name: string; father_name: string };
        lessons: lessonType[];
    }
    [];

    // type HeaderTemplateOptions = Parameters<NonNullable<React.ComponentProps<typeof AccordionTab>['headerTemplate']>>[0];

    const { subject_id } = useParams();
    const params = new URLSearchParams();

    const { setMessage, setForumValues } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [main_id, setMain_id] = useState<predmetType | null>(null);

    const [skeleton, setSkeleton] = useState(false);
    const [hasLessons, setHasLessons] = useState(false);
    const [lessons, setLessons] = useState<Record<number, { semester: { name_kg: string } } | predmetType>>({
        1: { semester: { name_kg: '' } }
    });
    const [courses, setCourses] = useState<CourseType[]>([]);
    const [hasThemes, setHasThemes] = useState(false);
    const [activeIndexes, setActiveIndexes] = useState<Record<number, number | null>>({});
    const [accordionIndex, setAccordionIndex] = useState({ index: null });

    // types
    // old mainlesson
    // const handleMainLesson = async (lesson_id: number, stream_id: number) => {
    //     const data = await fetchMainLesson(lesson_id, stream_id);

    //     if (data) {
    //         if (data.length > 0) {
    //             setHasSteps(false);
    //             setMainSteps(data);
    //         } else {
    //             setHasSteps(true);
    //         }
    //     } else {
    //         setHasSteps(true);
    //     }
    // };

    const handleMainLesson = async (lesson_id: number, stream_id: number) => {
        const data = await fetchMainLesson(lesson_id, stream_id);
        console.log(data);

        // Возвращаем данные или null/пустой массив
        if (data && data.length > 0) {
            return data;
        } else {
            if (data?.response?.data && data?.response?.status === '400') {
                setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message } });
            }
            setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
        }
        return [];
    };

    // Вам понадобится эта функция для получения ID урока
    const getLessonIdByCourseAndIndex = (course: any, index: number) => {
        // Убедитесь, что lessonType включает поле steps: any[]
        return course.lessons[index]?.id;
    };

    const handleTabChange = async (courseInside: CourseType[], courseId: number, e: any, sendActiveIndex: boolean) => {
        // 1. Обновление активного индекса (ОК)
        if(sendActiveIndex) {
            setActiveIndexes((prev) => ({
                ...prev,
                [courseId]: e.index // e.index - это индекс темы (AccordionTab)
            }))
            setAccordionIndex({ index: e.index });
        }

        const course = courseInside.find((c) => c.id === courseId);

        // Если вкладка закрывается (e.index == null или -1),
        // нет необходимости в загрузке данных
        if (course && e.index !== null && e.index >= 0) {
            const lessonId = getLessonIdByCourseAndIndex(course, e.index);
            const stream = course.connections[0];

            // 2. Вызываем новую handleMainLesson и получаем данные
            if (lessonId && stream) {
                // 1. Устанавливаем статус загрузки для конкретного урока
                setCourses((prevCourses) =>
                    prevCourses.map((c) => {
                        if (c.id === courseId) {
                            return {
                                ...c,
                                lessons: c.lessons.map(
                                    (l) => (l.id === lessonId ? { ...l, isLoadingSteps: true } : l) // 💡 ВКЛЮЧАЕМ
                                )
                            };
                        }
                        return c;
                    })
                );

                const newSteps = await handleMainLesson(lessonId, stream.id_stream);
                if (newSteps) {
                    // 3. Обновляем состояние courses: добавляем steps к нужному уроку
                    setCourses((prevCourses) =>
                        prevCourses.map((c) => {
                            // Находим нужный курс
                            if (c.id === courseId) {
                                return {
                                    ...c,
                                    lessons: c.lessons.map((l) =>
                                        // Находим нужный урок и обновляем его шаги
                                        l.id === lessonId ? { ...l, steps: newSteps, isLoadingSteps: false } : l
                                    )
                                };
                            }
                            return c;
                        })
                    );
                }
            }
        }
    };

    // fetch lessons
    const handleFetchLessons = async () => {
        setSkeleton(true);
        const data = await fetchItemsLessons();
        if (data) {
            // валидность проверить
            setLessons(data);
            setHasLessons(false);
            setSkeleton(false);
        } else {
            setHasLessons(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            setSkeleton(false);
        }
    };

    // Запрос курса, типа уроков (лк,лб)
    const handleFetchSubject = async (subject: subjectType) => {
        params.append('id_curricula', String(subject?.id_curricula));
        subject?.streams.forEach((i) => params.append('streams[]', String(i)));
        subject?.course_ids.forEach((i) => params.append('course_ids[]', String(i)));
        const data = await fetchSubjects(params);
        console.log(data);
        setSkeleton(true);
        
        if (data && Array.isArray(data)) {
            setCourses(data);
            if (data && data?.length > 0) {
                const courseId = data[0].id;
                if (courseId) {
                    console.log(data[0].lessons[0]);
                    if(data[0].lessons && data[0].lessons[0]?.active){
                        handleTabChange(data, courseId, { index: 0 }, true);
                    } else {
                        // handleTabChange(data, courseId, { index: 0 }, false);   
                    }
                }
            }
            setHasThemes(false);
            setSkeleton(false);
        } else {
            setHasThemes(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            setSkeleton(false);
        }
    };

    // НАХОДИМ ПО ИД КРУКЛА НУЖНЫЙ ЭЛЕМЕНТ МАССИВА И ПРИСВАИВАЕМ В main_id ОБЪЕКТ

    // Просим предметы для получения конкретного из них
    useEffect(() => {
        handleFetchLessons();
    }, []);

    // Из предметов получаю выбранный курс в main_id
    useEffect(() => {
        const lessonArray = Object.values(lessons);
        // console.log(lessonArray)
        let search_id: predmetType | null = null;
        if (lessonArray && Array.isArray(lessonArray)) {
            for (let i = 0; i < lessonArray?.length; i++) {
                const lessonItemArray = Object.values(lessonArray[i]);
                // console.log(lessonItemArray);

                search_id = lessonItemArray.find((item: any) => item?.id_curricula == subject_id);
                if (search_id && search_id != null) {
                    break;
                }
            }
            if (search_id) {
                setMain_id(search_id);
            }
        }
    }, [lessons]);

    // НАХОДИМ ПО ИД КРУКЛА НУЖНЫЙ ЭЛЕМЕНТ МАССИВА И ПРИСВАИВАЕМ В main_id ОБЪЕКТ

    useEffect(() => {
        if (main_id && main_id != null) {
            const forSubject: subjectType = { id_curricula: main_id?.id_curricula, course_ids: main_id?.course_ids, streams: main_id?.streams.map((i: { id: number }) => i.id) };
            handleFetchSubject(forSubject);
        }
    }, [main_id]);

    return (
        <div className="main-bg">
            {hasLessons ? (
                <NotFound titleMessage="Данные не доступны" />
            ) : (
                <>
                    <h1 className="text-xl sm:text-2xl shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] pb-1">Список курсов</h1>

                    {skeleton ? (
                        <div className="w-full">
                            <GroupSkeleton count={1} size={{ width: '100%', height: '10rem' }} />
                        </div>
                    ) : hasThemes ? (
                        <NotFound titleMessage="Данные не доступны" />
                    ) : (
                        Array.isArray(courses) &&
                        courses?.map((course) => {
                            return (
                                <div key={course.id} className="flex flex-col gap-4 shadow-sm rounded my-4 py-2 px-1">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="m-0  text-md break-words">
                                            <span className="text-[var(--mainColor)]">Название курса:</span> {course?.title}
                                        </h3>
                                        <h3 className="m-0 text-md ">
                                            <span className="text-[var(--mainColor)]">Преподаватель:</span> {course?.user.last_name} {course?.user.name}
                                        </h3>
                                        {course?.connections[0]?.subject_type && (
                                            <h3 className="m-0 text-md ">
                                                <span className="text-[var(--mainColor)]">Тип обучения:</span> {course?.connections[0]?.subject_type === 'Лк' ? 'Лекция' : course?.connections[0]?.subject_type === 'Лб' ? 'Лабораторные занятия' : ''}
                                            </h3>
                                        )}
                                    </div>
                                    <div>
                                        <Accordion key={`${course.id}`} activeIndex={activeIndexes[course.id]} className="my-accardion-icon" onTabChange={(e) => handleTabChange(courses, course.id, e, true)} multiple={false}>
                                            {course?.lessons.map((lesson, idx) => {
                                                const contentPresence = lesson?.steps?.filter((content) => content.content);
                                                const sortedSteps = contentPresence?.sort((a, b) => {
                                                    const isAForum = a?.type?.name === 'forum';
                                                    const isBForum = b?.type?.name === 'forum';

                                                    if (isAForum && !isBForum) {
                                                        return 1; // 'a' (форум) идет после 'b'
                                                    }
                                                    if (!isAForum && isBForum) {
                                                        return -1; // 'b' (форум) идет после 'a'
                                                    }
                                                    return 0; // Сохраняем относительный порядок
                                                });

                                                return (
                                                    <AccordionTab
                                                        header={
                                                            <>
                                                                <span>{idx + 1}. Тема: {lesson.title}</span>
                                                                {!lesson?.active && (
                                                                    <div className='w-full flex justify-end items-center gap-1 mt-1 sm:m-o'>
                                                                        <small>Доступен с:</small>
                                                                        <small>{lesson?.from} - {lesson?.to}</small>
                                                                    </div>
                                                                )}
                                                            </>
                                                        }
                                                        key={lesson.id}
                                                        className={`w-full p-accordion my-accardion-icon ${!lesson?.active ? 'opacity-50 pointer-events-none' : ''}`}
                                                        style={{ width: '100%', backgroundColor: 'white' }}
                                                    >
                                                        <div className="flex flex-col gap-2">
                                                            {/* Используем lesson.steps, который был обновлен в handleTabChange */}
                                                            {lesson?.isLoadingSteps ? (
                                                                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                                                            ) : sortedSteps && sortedSteps?.length > 0 ? (
                                                                sortedSteps.map(
                                                                    (
                                                                        item: {
                                                                            id: number;
                                                                            chills: boolean;
                                                                            type: { name: string; logo: string };
                                                                            content: { id: number; title: string; description: string; url: string; document: string; document_path: string };
                                                                            id_parent?: number | null;
                                                                            score: number;
                                                                            my_score: number | null;
                                                                        },
                                                                        idx
                                                                    ) => {
                                                                        if (item.content == null) {
                                                                            return null;
                                                                        }

                                                                        return (
                                                                            <div key={item.id} className={`${idx > 0 ? 'my-border-top' : ''}`}>
                                                                                <StudentInfoCard
                                                                                    type={item.type.name}
                                                                                    icon={item.type.logo}
                                                                                    title={item.content?.title}
                                                                                    description={item.content?.description || ''}
                                                                                    documentUrl={{ document: item.content?.document, document_path: item.content?.document_path }}
                                                                                    link={item.content?.url}
                                                                                    stepId={item.id}
                                                                                    streams={course}
                                                                                    lesson={lesson.id}
                                                                                    subjectId={String(subject_id)}
                                                                                    chills={item?.chills}
                                                                                    fetchProp={() => handleTabChange(courses, course.id, accordionIndex, true)}
                                                                                    contentId={item?.content?.id}
                                                                                    id_parent={item?.id_parent || null}
                                                                                    forumValueAdd={() => {
                                                                                        setForumValues({ description: item?.content.title || '', userInfo: { userName: course?.user?.name, userLastName: course?.user?.last_name } });
                                                                                        localStorage.setItem(
                                                                                            'forumValues',
                                                                                            JSON.stringify({ description: item?.content.title || '', userInfo: { userName: course?.user?.name, userLastName: course?.user?.last_name } })
                                                                                        );
                                                                                    }}
                                                                                    lessonItem={item}
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <p className="text-center text-sm">Данных нет</p>
                                                            )}
                                                        </div>
                                                    </AccordionTab>
                                                );
                                            })}
                                        </Accordion>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </>
            )}
        </div>
    );
}
