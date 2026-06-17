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
import { useLocalization } from '@/layout/context/localizationcontext';
import { useLocalizedData } from '@/hooks/useLocalizedData';
import MainTitle from '@/app/components/titles/MainTitle';

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

    // type HeaderTemplateOptions = Parameters<NonNullable<React.ComponentProps<typeof AccordionTab>['headerTemplate']>>[0];

    const { subject_id, id_edu_year } = useParams<{subject_id: string; id_edu_year: string}>();
    const params = new URLSearchParams();

    const { setMessage, setForumValues, contextLastStepVisit, setContextLastStepVisit, contextLastSubjectPageVisit, setContextLastSubjectPageVisit } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const { translations } = useLocalization();
    const { getLocalized } = useLocalizedData();

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
    const [mainProgressSpinner, setMainProgressSpinner] = useState(false);

    const handleMainLesson = async (lesson_id: number, stream_id: number) => {
        const data = await fetchMainLesson(lesson_id, stream_id);
        // Возвращаем данные или null/пустой массив
        if (data && data.length > 0) {
            return data;
        } else {
            if (data?.response?.data && data?.response?.status === '400') {
                setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: data?.response?.data?.message } });
            }
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
        if (sendActiveIndex) {
            setActiveIndexes((prev) => ({
                ...prev,
                [courseId]: e.index // e.index - это индекс темы (AccordionTab)
            }));
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
        const data = await fetchItemsLessons(id_edu_year ? Number(id_edu_year) : 0);
        if (data && data?.success) {
            // валидность проверить
            setLessons(data?.data);
            setHasLessons(false);
        } else {
            setHasLessons(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater }
            });
            if (data?.data?.response?.status) {
                showError(data?.data.response.status);
            }
        }
        setSkeleton(false);
    };

    // Запрос курса, типа уроков (лк,лб)
    const handleFetchSubject = async (subject: subjectType) => {
        setMainProgressSpinner(true);
        params.append('id_curricula', String(subject?.id_curricula));
        subject?.streams.forEach((i) => params.append('streams[]', String(i)));
        subject?.course_ids.forEach((i) => params.append('course_ids[]', String(i)));
        const data = await fetchSubjects(params);
        setSkeleton(true);
        if (data && Array.isArray(data)) {
            setCourses(data);
            if (data && data?.length > 0) {
                const courseId = data[0].id;
                if (courseId) {
                    // проверить контекст если у него есть значит забираем от него
                    if (contextLastStepVisit && contextLastStepVisit.course_id) {
                        handleTabChange(data, contextLastStepVisit.course_id, { index: contextLastStepVisit.index }, true);
                    } else if (data[0].lessons && data[0].lessons[0]?.active) {
                        handleTabChange(data, courseId, { index: 0 }, true);
                    }
                }
            }
            setHasThemes(false);
            setSkeleton(false);
        } else {
            setHasThemes(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            setSkeleton(false);
        }
        setMainProgressSpinner(false);
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
    }, [lessons, subject_id]);

    // НАХОДИМ ПО ИД КРУКЛА НУЖНЫЙ ЭЛЕМЕНТ МАССИВА И ПРИСВАИВАЕМ В main_id ОБЪЕКТ

    useEffect(() => {
        if (main_id && main_id != null) {
            const forSubject: subjectType = { id_curricula: main_id?.id_curricula, course_ids: main_id?.course_ids, streams: main_id?.streams.map((i: { id: number }) => i.id) };
            handleFetchSubject(forSubject);
        }
    }, [main_id]);

    if (mainProgressSpinner)
        return (
            <div className="main-bg flex justify-center items-center h-[100vh]">
                <ProgressSpinner style={{ width: '60px', height: '60px' }} />
            </div>
        );

    return (
        <div className="main-bg">
            {hasLessons ? (
                <NotFound titleMessage={translations.dataTemporarilyUnavailable} />
            ) : (
                <>
                    {/*<h1 className="text-xl sm:text-2xl shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] pb-1">{translations.courses}</h1>*/}
                    <MainTitle>{translations.courses}</MainTitle>

                    {skeleton ? (
                        <div className="w-full">
                            <GroupSkeleton count={1} size={{ width: '100%', height: '10rem' }} />
                        </div>
                    ) : hasThemes ? (
                        <NotFound titleMessage={translations.dataTemporarilyUnavailable} />
                    ) : (
                        Array.isArray(courses) &&
                        courses?.map((course) => {
                            return (
                                <div key={course.id} className="flex flex-col gap-4 shadow-sm rounded my-4 py-2 px-1">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="m-0  text-md break-words">
                                            <span className="text-[var(--mainColor)]">{translations.courseName}:</span> {getLocalized(course, 'title') || course?.title}
                                        </h3>
                                        <h3 className="m-0 text-md ">
                                            <span className="text-[var(--mainColor)]">{translations.teacher}:</span> {course?.user.last_name} {course?.user.name}{' '}
                                            {course?.user.father_name ? course?.user.father_name[0] && course?.user.father_name : ''}
                                        </h3>
                                        {course?.connections[0]?.subject_type && (
                                            <h3 className="m-0 text-md ">
                                                <span className="text-[var(--mainColor)]">{translations.studyType}:</span>{' '}
                                                {course?.connections[0]?.subject_type === 'Лк' ? 'Лекция' : course?.connections[0]?.subject_type === 'Лб' ? 'Лабораторные занятия' : ''}
                                            </h3>
                                        )}
                                    </div>
                                    <div>
                                        <Accordion
                                            key={`${course.id}`}
                                            activeIndex={activeIndexes[course.id]}
                                            className="my-accardion-icon"
                                            onTabChange={(e) => {
                                                setContextLastStepVisit({ course_id: course.id, index: e.index });
                                                handleTabChange(courses, course.id, e, true);
                                            }}
                                            multiple={false}
                                        >
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
                                                                <span>
                                                                    {idx + 1}. {translations.theme}: {lesson.title}
                                                                </span>
                                                                {!lesson?.active && (
                                                                    <div className="w-full flex justify-end items-center gap-1 mt-1 sm:m-o">
                                                                        <small>{translations.availableFrom}</small>
                                                                        <small>
                                                                            {lesson?.from} - {lesson?.to}
                                                                        </small>
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
                                                                                    fetchProp={() => {
                                                                                        handleTabChange(courses, course.id, accordionIndex, true);
                                                                                    }}
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
                                                                                    id_edu_year={id_edu_year}
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <p className="text-center text-sm">{translations.noData}</p>
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
