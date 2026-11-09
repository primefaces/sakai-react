'use client';

import ActivityPage from '@/app/components/Contribution';
import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useLocalization } from '@/layout/context/localizationcontext';
import { fetchCourseInfo } from '@/services/courses';
import { statusView } from '@/services/notifications';
import { fetchElement } from '@/services/steps';
import { fetchStudentCalendar, fetchStudentDetail, pacticaDisannul, pacticaScoreAdd } from '@/services/streams';
import { ContributionDay } from '@/types/ContributionDay';
import { CourseType } from '@/types/courseType';
import { lessonType } from '@/types/lessonType';
import { mainStepsType } from '@/types/mainStepType';
import { User } from '@/types/user';
import { useParams, useSearchParams } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useContext, useEffect, useState } from 'react';

export default function StudentCheck() {
    const { cource_id, connect_id, stream_id, student_id, from_student, lesson_id, step_id } = useParams();

    const { user, setMessage, contextNotificationId, setContextNotificationId, handleNotifications, contextFetchVerifed } = useContext(LayoutContext);
    const { translations } = useLocalization();
    const showError = useErrorMessage();

    const [mainSkeleton, mainSetSkeleton] = useState(false);
    const [lessons, setLessons] = useState<lessonType[] | null>(null);
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
        const data = await fetchCourseInfo(cource_id ? Number(cource_id) : null);
        if (data?.success) {
            setCourseShow(data?.course);
        }
        mainSetSkeleton(false);
    };

    const handleFetchStreams = async () => {
        mainSetSkeleton(true);
        const data = await fetchStudentDetail(lesson_id ? Number(lesson_id) : null, connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null, student_id ? Number(student_id) : null, step_id ? Number(step_id) : null);
        if (data?.success) {
            // handleStatusView();
            setHasSteps(false);
            mainSetSkeleton(false);
            setLessons(data?.lessons);
            setStudent(data?.student);
        } else {
            mainSetSkeleton(false);
            setHasSteps(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleStatusView = async (notification_id: number | null) => {
        if (notification_id) {
            const data = await statusView(Number(notification_id));
            if (user?.is_working || user?.is_student) {
                handleNotifications();
            }
            setContextNotificationId(null);
        }
    };

    const handleFetchElement = async (lesson_id: number, stepId: number) => {
        if (lesson_id) {
            setSkeleton(true);
            const data = await fetchElement(Number(lesson_id), stepId);
            if (data.success) {
                setSkeleton(false);
                setElement({ content: data.content, step: data.step });
            } else {
                setSkeleton(false);
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
                });
                if (data?.response?.status) {
                    showError(data.response.status);
                }
            }
        }
    };

    const handleFetchCalendar = async () => {
        mainSetSkeleton(true);
        const data = await fetchStudentCalendar(connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null, student_id ? Number(student_id) : null);

        if (data && Array.isArray(data)) {
            setContribution(data);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handlePracticaScoreAdd = async (stepId: number, score: number) => {
        const data = await pacticaScoreAdd(connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null, student_id ? Number(student_id) : null, stepId, score);

        if (data?.success) {
            contextFetchVerifed();
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.successAdd, detail: '' }
            });
            handleFetchStreams();
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.addError, detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    const handlePracticaDisannul = async (id_curricula: number, course_id: number, id_stream: number, id: number, steps_id: number, message: string) => {
        const data = await pacticaDisannul(id_curricula, course_id, id_stream, Number(student_id), steps_id, message);

        if (data?.success) {
            contextFetchVerifed();
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.successAdd, detail: '' }
            });
            handleFetchStreams();
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.addError, detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    useEffect(() => {
        handleCourseShow();
        handleFetchCalendar();
        handleFetchStreams();

        if (contextNotificationId && contextNotificationId != null) {
            handleStatusView(contextNotificationId);
        }
    }, []);

    useEffect(() => {
        if (lessons && lessons?.length) {
            lessons.forEach((item, idx) => {
                if (item?.is_opened) {
                    setActiveIndex(idx);
                    return null;
                }
            });

            // Вычисляем сумму баллов студента
            let total = 0;
            for (let i = 0; i < lessons.length; i++) {
                for (let j = 0; j < lessons[i]?.steps?.length; j++) {
                    const step = lessons[i].steps[j];
                    if (step.id_parent && step.ListAnswer) {
                        total += step.ListAnswer.score;
                    }
                }
            }
            if (total) {
                setTotalScore(total);
            }
        }
    }, [lessons]);

    // UI: статистика по студенту (только отображение)
    const allChecked = (lessons || []).flatMap((l) => (l?.steps || []).filter((s) => s?.id_parent != null));
    const answeredCount = allChecked.filter((s) => s?.ListAnswer).length;
    const activeDays = (contribution || []).filter((d: any) => d?.count && d.count > 0).length;

    const statCard = (icon: string, label: string, value: React.ReactNode, tone: string) => (
        <div className="flex items-center gap-[12px] p-[12px] rounded-[14px] border border-[#eef2f6] bg-white min-w-[150px] flex-1">
            <span className={`flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-[12px] ${tone}`}>
                <i className={`pi ${icon} text-[1rem]`}></i>
            </span>
            <div className="flex flex-col leading-tight">
                <span className="text-[1.25rem] font-bold text-[var(--titleColor)]">{value}</span>
                <span className="text-[0.75rem] text-[var(--text-color-secondary)]">{label}</span>
            </div>
        </div>
    );

    return (
        <div className="main-bg">
            {mainSkeleton ? (
                <div className="w-full flex flex-col gap-[12px]">
                    <GroupSkeleton count={1} size={{ width: '100%', height: '7rem' }} /> <GroupSkeleton count={1} size={{ width: '100%', height: '10rem' }} />
                </div>
            ) : (
                <div className="flex flex-col gap-[16px]">
                    {/* info section */}
                    <div className="relative overflow-hidden rounded-[16px] bg-[var(--titleColor)] bg-gradient-to-br from-[var(--titleColor)] to-[var(--mainColor)] text-white p-[20px] md:p-[28px]">
                        <i className="pi pi-user absolute -right-[10px] -bottom-[20px] text-[120px] text-white/10 pointer-events-none"></i>
                        <div className="relative flex flex-col sm:flex-row sm:items-center gap-[16px]">
                            <span className="flex shrink-0 items-center justify-center w-[64px] h-[64px] rounded-full bg-white/15 border-2 border-white/30 text-[1.375rem] font-bold uppercase">
                                {student ? (
                                    <>
                                        {student?.last_name?.[0]}
                                        {student?.name?.[0]}
                                    </>
                                ) : (
                                    <i className="pi pi-user text-[1.5rem]"></i>
                                )}
                            </span>
                            <div className="flex flex-col gap-[6px] min-w-0">
                                <span className="inline-flex items-center gap-[6px] text-[0.75rem] font-semibold uppercase tracking-wide text-white/80">
                                    <i className="pi pi-chart-line text-[0.6875rem]"></i>
                                    {translations.activity}
                                </span>
                                {student && (
                                    <h1 className="m-0 flex flex-wrap gap-[6px] items-center text-[1.25rem] md:text-[1.5rem] font-bold leading-tight" style={{ color: 'white' }}>
                                        <span>{student?.last_name}</span>
                                        <span>{student?.name && student?.name[0] + '.'}</span>
                                        <span>{student?.father_name && student?.father_name[0] + '.'}</span>
                                    </h1>
                                )}
                                {courseShow && courseShow?.title ? (
                                    <span className="inline-flex items-center gap-[6px] self-start px-[10px] py-[4px] rounded-full bg-white/15 text-white text-[0.75rem] break-words">
                                        <i className="pi pi-book text-[0.6875rem]"></i>
                                        {courseShow?.title}
                                    </span>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>

                    {/* stats */}
                    <div className="flex flex-wrap gap-[10px]">
                        {statCard('pi-star', translations.yourScore, totalScore, 'bg-[var(--mainColor)]/10 text-[var(--mainColor)]')}
                        {statCard('pi-list', translations.theme, lessons?.length || 0, 'bg-[#eef2ff] text-[#4f46e5]')}
                        {statCard('pi-check-square', translations.completedActions, `${answeredCount} / ${allChecked.length}`, 'bg-[#dcfce7] text-[#16a34a]')}
                        {statCard('pi-calendar', translations.activity, activeDays, 'bg-[#fef3c7] text-[#d97706]')}
                    </div>

                    {/* activity calendar */}
                    <div className="rounded-[14px] border border-[#eef2f6] bg-white p-[14px] overflow-x-auto">
                        <div className="flex items-center gap-[8px] mb-[10px]">
                            <i className="pi pi-calendar text-[0.875rem] text-[var(--mainColor)]"></i>
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-color-secondary)]">{translations.activity}</span>
                        </div>
                        <ActivityPage value={contribution} />
                    </div>

                    <h3 className="hidden">{/* <span className="text-[var(--mainColor)]">Название курса:</span> {courseInfo.title} */}</h3>
                    <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="modern-accordion">
                        {lessons?.map((item, lessonIdx) => {
                            const content = item?.steps?.filter((j) => {
                                return j?.id_parent != null;
                            });
                            const lessonAnswered = content?.filter((s) => s?.ListAnswer).length || 0;
                            const lessonScore = content?.reduce((sum, s) => sum + (s?.ListAnswer?.score || 0), 0) || 0;

                            return (
                                <AccordionTab
                                    header={
                                        <div className="flex items-center justify-between gap-[10px] w-full min-w-0">
                                            <div className="flex items-center gap-[10px] min-w-0">
                                                <span className="flex shrink-0 items-center justify-center w-[32px] h-[32px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.8125rem] font-bold">{lessonIdx + 1}</span>
                                                <div className="flex flex-col min-w-0 leading-tight">
                                                    <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-color-secondary)]">{translations.theme}</span>
                                                    <span className="font-semibold text-[var(--titleColor)] break-words">{item.title}</span>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-[6px]">
                                                <span className="hidden sm:inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-[#f1f5f9] text-[0.6875rem] font-semibold text-[var(--text-color-secondary)]">
                                                    <i className="pi pi-check-square text-[0.625rem]"></i>
                                                    {lessonAnswered} / {content?.length || 0}
                                                </span>
                                                <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.6875rem] font-bold">
                                                    <i className="pi pi-star text-[0.625rem]"></i>
                                                    {lessonScore}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                    key={item.id}
                                    className="w-full p-accordion"
                                    style={{ width: '100%' }}
                                >
                                    <div className="flex flex-col gap-[10px]">
                                        {content?.length < 1 || hasSteps ? (
                                            <div className="flex flex-col items-center justify-center gap-[8px] py-[24px] rounded-[12px] border border-dashed border-[#dbe3ea] bg-[#fbfdfe]">
                                                <i className="pi pi-inbox text-[1.25rem] text-[var(--mainColor)]"></i>
                                                <p className="m-0 text-center text-sm font-semibold text-[var(--titleColor)]">{translations.noData}</p>
                                            </div>
                                        ) : (
                                            content?.map((i, idx) => {
                                                if (i.id_parent) {
                                                    return (
                                                        <div className="rounded-[12px] border border-[#eef2f6] bg-white transition hover:border-[var(--mainColor)]/40" key={i.id}>
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
                                                                    addPracticaScore={(score) => handlePracticaScoreAdd(i?.id, score)}
                                                                    addPracticaDisannul={(id_curricula: number, course_id: number, id_stream: number, id: number, steps_id: number, message: string) =>
                                                                        handlePracticaDisannul(id_curricula, course_id, id_stream, id, steps_id, message)
                                                                    }

                                                                    isOpened={i?.is_opened || false}
                                                                    // item={i}
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
                        })}
                    </Accordion>
                    <div className="flex justify-end">
                        <div className="inline-flex items-center gap-[10px] px-[14px] py-[10px] rounded-[14px] border border-[#eef2f6] bg-white shadow-[0_6px_14px_-10px_rgba(8,169,230,0.6)]">
                            <i className="pi pi-star text-[var(--mainColor)]"></i>
                            <b className="text-[var(--text-color-secondary)] text-[0.875rem]">{translations.yourScore}: </b>
                            <b className="inline-flex items-center justify-center min-w-[40px] px-[8px] py-[3px] rounded-[8px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[1rem]"> {totalScore}</b>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
