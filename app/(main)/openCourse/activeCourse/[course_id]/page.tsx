'use client';

import ActiveStepCard from '@/app/components/lessons/ActiveStepCard';
import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import StudentInfoCard from '@/app/components/lessons/StudentInfoCard';
import { NotFound } from '@/app/components/NotFound';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { courseOpen, fetchActiveSteps } from '@/services/openCourse';
import { lessonStateType } from '@/types/lessonStateType';
import { mainStepsType } from '@/types/mainStepType';
import { myMainCourseType } from '@/types/myMainCourseType';
import { useParams } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useContext, useEffect, useState } from 'react';

export default function ActiveCourseDetail() {
    const { course_id } = useParams();

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const [mainCourse, setMainCourses] = useState<myMainCourseType | null>(null);
    const [lessons, setLessonsValue] = useState<lessonStateType[]>([]);
    const [emptyCourse, setEmptyCourse] = useState(false);
    const [hasCourses, setHasCourses] = useState(false);
    const [themeShow, setThemeShow] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [hasSteps, setHasSteps] = useState(false);
    const [steps, setSteps] = useState<mainStepsType[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | number[]>(0);

    const handleCourseOpen = async () => {
        setSkeleton(true);
        const data = await courseOpen(course_id ? Number(course_id) : null);
        console.log(data);

        if (data?.success) {
            setHasCourses(false);
            if (data?.courses?.length < 1) {
                setEmptyCourse(true);
            } else {
                setEmptyCourse(false);
            }
            setMainCourses(data.course);
            setLessonsValue(data.course?.lessons);
        } else {
            setHasCourses(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setSkeleton(false);
    };

    const handleSteps = async (lesson_id: number | null) => {
        setSkeleton(true);
        const data = await fetchActiveSteps(course_id ? Number(course_id) : null, lesson_id);
        console.log(data);

        if (data?.success) {
            setHasSteps(false);
            // if (data?.courses?.length < 1) {
            //     setEmptyCourse(true);
            // } else {
            //     setEmptyCourse(false);
            // }
            setSteps(data?.steps);
        } else {
            setHasSteps(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setSkeleton(false);
    };

    useEffect(() => {
        handleCourseOpen();
    }, []);

    useEffect(() => {
        if (lessons?.length > 0 && [activeIndex as number]) {
            const lessonId = lessons[activeIndex as number]?.id;
            if (lessonId) {
                handleSteps(lessonId);
            }
        }
    }, [lessons, activeIndex]);

    return (
        <div className="main-bg">
            {themeShow ? (
                <NotFound titleMessage="Темы отсуствуют или временно не доступны" />
            ) : (
                <div>
                    <h3 className="text-lg pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                        <span className="text-[var(--mainColor)]">Название курса:</span> {mainCourse?.title}
                    </h3>
                    <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        {lessons?.map((item) => {
                            const content = steps.filter((j) => {
                                return j.content != null;
                            });

                            return (
                                <AccordionTab header={'Тема: ' + item.title} key={item?.id} className="w-full p-accordion" style={{ width: '100%' }}>
                                    <div className="flex flex-col gap-2">
                                        {hasSteps ? (
                                            <p className="text-center text-sm">Данных нет</p>
                                        ) : content?.length > 0 ? (
                                            content.map((i, idx) => {
                                                if (i.content) {
                                                    return (
                                                        <div className={`${idx !== 0 && idx !== content?.length ? 'border-t-1 border-[gray]' : ''}`} key={i.id}>
                                                            {
                                                                <ActiveStepCard
                                                                    type={i.type.name}
                                                                    icon={i.type.logo}
                                                                    title={i.content?.title}
                                                                    course_id={Number(course_id)}
                                                                    stepId={i.id}
                                                                    
                                                                    // chills={i?.chills}
                                                                    // fetchProp={() => handleTabChange(courses, course.id, accordionIndex)}
                                                                    fetchProp={() => {}}
                                                                    // contentId={i?.content?.id}
                                                                    // id_parent={i?.id_parent || null}
                                                                    // forumValueAdd={() => {
                                                                    //     setForumValues({ description: i?.content.title || '', userInfo: { userName: course?.user?.name, userLastName: course?.user?.last_name } });
                                                                    //     localStorage.setItem(
                                                                    //         'forumValues',
                                                                    //         JSON.stringify({ description: i?.content.title || '', userInfo: { userName: course?.user?.name, userLastName: course?.user?.last_name } })
                                                                    //     );
                                                                    // }
                                                                    lessonItem={item}
                                                                    stepItem={i}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                }
                                            })
                                        ) : (
                                            <p className="text-center text-sm">Данных нет</p>
                                        )}
                                    </div>
                                </AccordionTab>
                            );
                        })}
                    </Accordion>
                </div>
            )}
        </div>
    );
}
