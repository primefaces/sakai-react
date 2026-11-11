'use client';

import StudentInfoCard from '@/app/components/lessons/StudentInfoCard';
import FacultyHeader, { FacultyEmpty, facultyCardClass } from '@/app/components/faculty/FacultyHeader';
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

    const studyTypeLabel = (type?: string) => (type === 'Лк' ? 'Лекция' : type === 'Лб' ? 'Лабораторные занятия' : '');

    // шаги урока: форум всегда в конце
    const sortSteps = (steps: lessonType['steps']) =>
        steps
            ?.filter((step) => step.content)
            .sort((a, b) => {
                const isAForum = a?.type?.name === 'forum';
                const isBForum = b?.type?.name === 'forum';
                if (isAForum && !isBForum) return 1;
                if (!isAForum && isBForum) return -1;
                return 0;
            });

    const themeHeader = (lesson: lessonType, idx: number) => {
        const count = lesson?.steps ? lesson.steps.filter((s) => s.content).length : null;

        return (
            <div className="flex items-center gap-[12px] w-full min-w-0">
                <span className="flex items-center justify-center shrink-0 w-[34px] h-[34px] rounded-[10px] bg-[#f1f5f9] text-[0.8125rem] font-bold text-[var(--bodyColor)]">
                    {lesson?.active ? idx + 1 : <i className="pi pi-lock text-[0.75rem]"></i>}
                </span>
                <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                    <span className="text-[0.6875rem] uppercase tracking-[0.04em] font-semibold text-[var(--text-color-secondary)]">
                        {translations.theme} {idx + 1}
                    </span>
                    <span className="text-[0.875rem] sm:text-[0.9375rem] font-semibold text-[var(--titleColor)] leading-snug break-words">{lesson.title}</span>
                    {!lesson?.active && (
                        <span className="inline-flex flex-wrap items-center gap-[4px] text-[0.75rem] text-[var(--text-color-secondary)]">
                            <i className="pi pi-calendar text-[0.6875rem]"></i>
                            {translations.availableFrom} {lesson?.from} - {lesson?.to}
                        </span>
                    )}
                </div>
                {count !== null && count > 0 && (
                    <span
                        className="inline-flex items-center gap-[4px] shrink-0 px-[8px] py-[3px] rounded-full bg-[var(--mainColor)]/10 text-[0.6875rem] font-semibold text-[var(--mainColor)] whitespace-nowrap"
                        title={translations.materials}
                    >
                        <i className="pi pi-file text-[0.625rem]"></i>
                        {count}
                    </span>
                )}
            </div>
        );
    };

    const lessonContent = (course: CourseType, lesson: lessonType) => {
        if (lesson?.isLoadingSteps) {
            return <GroupSkeleton count={3} size={{ width: '100%', height: '3.5rem' }} />;
        }

        const sortedSteps = sortSteps(lesson?.steps);
        if (!sortedSteps || sortedSteps.length === 0) {
            return (
                <div className="flex items-center gap-[8px] p-[12px] rounded-[12px] bg-[#f8fafc] text-[0.8125rem] text-[var(--text-color-secondary)]">
                    <i className="pi pi-info-circle text-[0.8125rem]"></i>
                    {translations.noData}
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-[8px]">
                {sortedSteps.map(
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
                        idx: number
                    ) => (
                        <div
                            key={item.id}
                            className="fade-up px-[10px] py-[8px] sm:px-[12px] sm:py-[8px] rounded-[12px] border border-[#eef2f6] bg-white hover:bg-[#f8fbfd] transition-colors"
                            style={{ animationDelay: `${Math.min(idx, 12) * 35}ms` }}
                        >
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
                                    const forumValues = { description: item?.content.title || '', userInfo: { userName: course?.user?.name, userLastName: course?.user?.last_name } };
                                    setForumValues(forumValues);
                                    localStorage.setItem('forumValues', JSON.stringify(forumValues));
                                }}
                                lessonItem={item}
                                id_edu_year={id_edu_year}
                            />
                        </div>
                    )
                )}
            </div>
        );
    };

    const courseCard = (course: CourseType) => {
        const studyType = studyTypeLabel(course?.connections[0]?.subject_type);
        const teacher = [course?.user?.last_name, course?.user?.name, course?.user?.father_name].filter(Boolean).join(' ');

        return (
            <div key={course.id} className={`${facultyCardClass} p-[10px] sm:p-[16px] flex flex-col gap-[12px]`}>
                <div className="flex items-start gap-[12px] px-[2px]">
                    <span className="hidden sm:flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                        <i className="pi pi-book text-[1.125rem]"></i>
                    </span>
                    <div className="flex flex-col gap-[6px] min-w-0">
                        <span className="text-[0.6875rem] uppercase tracking-[0.04em] font-semibold text-[var(--text-color-secondary)]">{translations.courseName}</span>
                        <h3 className="text-[1rem] sm:text-[1.125rem] leading-snug font-bold text-[var(--titleColor)] m-0 break-words">{getLocalized(course, 'title') || course?.title}</h3>
                        <div className="flex flex-wrap items-center gap-[6px]">
                            {teacher && (
                                <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-[#f1f5f9] text-[0.75rem] text-[var(--bodyColor)]" title={translations.teacher}>
                                    <i className="pi pi-user text-[0.6875rem]"></i>
                                    {teacher}
                                </span>
                            )}
                            {studyType && (
                                <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-[var(--mainColor)]/10 text-[0.75rem] font-semibold text-[var(--mainColor)]" title={translations.studyType}>
                                    <i className="pi pi-tag text-[0.6875rem]"></i>
                                    {studyType}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <Accordion
                    className="modern-accordion"
                    activeIndex={activeIndexes[course.id]}
                    onTabChange={(e) => {
                        setContextLastStepVisit({ course_id: course.id, index: e.index });
                        handleTabChange(courses, course.id, e, true);
                    }}
                    multiple={false}
                >
                    {course?.lessons.map((lesson, idx) => (
                        <AccordionTab key={lesson.id} header={themeHeader(lesson, idx)} disabled={!lesson?.active} className={!lesson?.active ? 'opacity-60' : ''}>
                            {lessonContent(course, lesson)}
                        </AccordionTab>
                    ))}
                </Accordion>
            </div>
        );
    };

    if (mainProgressSpinner)
        return (
            <div className="main-bg flex justify-center items-center h-[100vh]">
                <ProgressSpinner style={{ width: '60px', height: '60px' }} />
            </div>
        );

    return (
        <div className="flex flex-col gap-[12px] sm:gap-[16px]">
            <FacultyHeader icon="pi pi-book" title={translations.courses} count={courses?.length} backHref="/teaching" />

            {hasLessons || hasThemes ? (
                <FacultyEmpty icon="pi pi-exclamation-circle" text={translations.dataTemporarilyUnavailable} />
            ) : skeleton ? (
                <GroupSkeleton count={2} size={{ width: '100%', height: '10rem' }} />
            ) : Array.isArray(courses) && courses.length > 0 ? (
                courses.map((course) => courseCard(course))
            ) : (
                <FacultyEmpty icon="pi pi-inbox" text={translations.noData} />
            )}
        </div>
    );
}
