'use client';

import ActivityPage from '@/app/components/Contribution';
import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchCourseInfo } from '@/services/courses';
import { statusView } from '@/services/notifications';
import { fetchElement } from '@/services/steps';
import { fetchStudentCalendar, fetchStudentDetail, pacticaDisannul, pacticaScoreAdd } from '@/services/streams';
import { ContributionDay } from '@/types/ContributionDay';
import { CourseType } from '@/types/courseType';
import { lessonType } from '@/types/lessonType';
import { mainStepsType } from '@/types/mainStepType';
import { User } from '@/types/user';
import { useParams } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useContext, useEffect, useState } from 'react';

export default function OpenCourseStudentCheck() {
    const { course_id, id } = useParams();
    // const params = useParams();
    // console.log(params, cource_id, connect_id, stream_id, student_id, lesson_id, step_id);

    const { setMessage, contextNotificationId, setContextNotificationId } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [mainSkeleton, mainSetSkeleton] = useState(false);
    // const [lessons, setLessons] = useState<lessonType[] | null>([
    //     {
    //         id: 92,
    //         user_id: 12,
    //         course_id: 189,
    //         title: 'fjsdl',
    //         is_deleted: false,
    //         is_published: true,
    //         steps: [
    //             {
    //                 ListAnswer: {},
    //                 active: false,
    //                 created_at: '2025-10-20T10:42:55.000000Z',
    //                 id: 71,
    //                 id_parent: 9,
    //                 is_opened: false,
    //                 lesson_id: 92,
    //                 score: 30,
    //                 step: 1,
    //                 type: { title: 'Тест', modelName: 'Test', logo: 'pi pi-list-check', name: 'test', active: true },
    //                 type_id: 4,
    //                 updated_at: '2025-10-20T10:43:04.000000Z',
    //                 user_id: 12
    //             }
    //         ]
    //     }
    // ]);
    const [student, setStudent] = useState<User | null>(null);
    const [courseShow, setCourseShow] = useState<CourseType | null>(null);
    const [hasSteps, setHasSteps] = useState(false);
    const [element, setElement] = useState<{ content: any | null; step: mainStepsType } | null>(null);
    const [contribution, setContribution] = useState<ContributionDay[] | null>(null);
    const [skeleton, setSkeleton] = useState(false);
    const [totalScore, setTotalScore] = useState(0);

    const [activeIndex, setActiveIndex] = useState<number | number[]>(0);

    const handleCourseShow = async () => {
        mainSetSkeleton(true);
        const data = await fetchCourseInfo(course_id ? Number(course_id) : null);
        console.log(data);

        if (data?.success) {
            setCourseShow(data?.course);
        }
        mainSetSkeleton(false);
    };

    const handleStatusView = async (notification_id: number | null) => {
        if (notification_id) {
            const data = await statusView(Number(notification_id));
            setContextNotificationId(null);
        }
    };

    const handleFetchElement = async (lesson_id: number, stepId: number) => {
        if (lesson_id) {
            setSkeleton(true);
            const data = await fetchElement(Number(lesson_id), stepId);
            console.log(data);
            
            if (data.success) {
                setSkeleton(false);
                setElement({ content: data.content, step: data.step });
            } else {
                setSkeleton(false);
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
                });
                if (data?.response?.status) {
                    showError(data.response.status);
                }
            }
        }
    };

    // const handleFetchCalendar = async () => {
    //     mainSetSkeleton(true);
    //     const data = await fetchStudentCalendar(connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null, student_id ? Number(student_id) : null);

    //     if (data && Array.isArray(data)) {
    //         setContribution(data);
    //     } else {
    //         setMessage({
    //             state: true,
    //             value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
    //         });
    //         if (data?.response?.status) {
    //             showError(data.response.status);
    //         }
    //     }
    // };

    // const handlePracticaScoreAdd = async (stepId: number, score: number) => {
    //     const data = await pacticaScoreAdd(connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null, student_id ? Number(student_id) : null, stepId, score);

    //     if (data?.success) {
    //         setMessage({
    //             state: true,
    //             value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
    //         });
    //         handleFetchStreams();
    //     } else {
    //         setMessage({
    //             state: true,
    //             value: { severity: 'error', summary: 'Ошибка при добавлении!', detail: '' }
    //         });
    //         if (data?.response?.status) {
    //             if (data?.response?.status == '400') {
    //                 setMessage({
    //                     state: true,
    //                     value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
    //                 });
    //             } else {
    //                 showError(data.response.status);
    //             }
    //         }
    //     }
    // };

    const handlePracticaDisannul = async (id_curricula: number, course_id: number, id_stream: number, id: number, steps_id: number, message: string) => {
        const data = await pacticaDisannul(id_curricula, course_id, id_stream, Number(id), steps_id, message);

        if (data?.success) {
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
            // handleFetchStreams();
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при добавлении!', detail: '' }
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
    };

    useEffect(() => {
        handleCourseShow();
        // handleFetchCalendar();

        if (contextNotificationId && contextNotificationId != null) {
            handleStatusView(contextNotificationId);
        }
    }, []);

    // useEffect(() => {
    //     if (lessons && lessons?.length) {
    //         lessons.forEach((item, idx) => {
    //             if (item?.is_opened) {
    //                 setActiveIndex(idx);
    //                 return null;
    //             }
    //         });

    //         // Вычисляем сумму баллов студента
    //         let total = 0;
    //         for (let i = 0; i < lessons.length; i++) {
    //             for (let j = 0; j < lessons[i]?.steps?.length; j++) {
    //                 const step = lessons[i].steps[j];
    //                 if (step.id_parent && step.ListAnswer) {
    //                     total += step.ListAnswer.score;
    //                 }
    //             }
    //         }
    //         if (total) {
    //             setTotalScore(total);
    //         }
    //     }
    // }, [lessons]);

    return (
        <div className="main-bg">
            {mainSkeleton ? (
                <div className="w-full">
                    <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} /> <GroupSkeleton count={1} size={{ width: '100%', height: '10rem' }} />
                </div>
            ) : (
                <div>
                    {courseShow && courseShow?.title ? <h1 className="text-2xl bg-[var(--titleColor)] text-white text-center p-3">{courseShow?.title}</h1> : ''}

                    {/* <ActivityPage value={contribution} recipient="Активность студента" userInfo={student} /> */}
                    <h3 className="text-lg pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">{/* <span className="text-[var(--mainColor)]">Название курса:</span> {courseInfo.title} */}</h3>
                    <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        {/* {lessons?.map((item) => {
                            const content = item?.steps?.filter((j) => {
                                return j?.id_parent != null;
                            });

                            return (
                                <AccordionTab header={'Тема: ' + item.title} key={item.id} className="w-full p-accordion" style={{ width: '100%' }}>
                                    <div className="flex flex-col gap-2">
                                        {content?.length < 1 || hasSteps ? (
                                            <p className="text-center text-sm">Данных нет</p>
                                        ) : (
                                            content?.map((i, idx) => {
                                                if (i.id_parent) {
                                                    return (
                                                        <div className={`${idx !== 0 && idx !== content?.length ? 'border-t-1 border-[gray]' : ''}`} key={i.id}>
                                                            {
                                                                <LessonInfoCard
                                                                    contentType={'check'}
                                                                    totalScore={i?.score}
                                                                    type={i.type.name}
                                                                    icon={i.type.logo}
                                                                    title={element?.content?.title}
                                                                    checkTitle={i?.type?.title}
                                                                    description={element?.content?.description || ''}
                                                                    documentUrl={{ document: element?.content?.document, document_path: element?.content?.document_path }}
                                                                    video_link={element?.content?.link}
                                                                    link={element?.content?.url}
                                                                    test={{ content: element?.content.content, answers: element?.content.answers, score: element?.content.score }}
                                                                    answerList={i?.ListAnswer}
                                                                    videoStart={() => {}}
                                                                    skeleton={skeleton}
                                                                    getValues={() => handleFetchElement(i?.lesson_id, i?.id)}
                                                                    addPracticaScore={(score) => {}}
                                                                    // addPracticaScore={(score) => handlePracticaScoreAdd(i?.id, score)}
                                                                    addPracticaDisannul={(id_curricula: number, course_id: number, id_stream: number, id: number, steps_id: number, message: string) =>
                                                                        handlePracticaDisannul(id_curricula, course_id, id_stream, id, steps_id, message)
                                                                    }
                                                                    isOpened={i?.is_opened || false}
                                                                    item={i}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                }
                                            })
                                        )}
                                    </div>
                                </AccordionTab>
                            );
                        })} */}
                    </Accordion>
                    <div className="flex justify-end gap-1 p-1">
                        <b>Балл студента: </b>
                        <b className="text-[var(--mainColor)]"> {totalScore}</b>
                    </div>
                </div>
            )}
        </div>
    );
}
