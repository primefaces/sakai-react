'use client';

import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import { NotFound } from '@/app/components/NotFound';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchCourseInfo } from '@/services/courses';
import { depCourseInfo } from '@/services/faculty';
import { depExamination, depExaminationSteps } from '@/services/roles/roles';
import { mainStepsType } from '@/types/mainStepType';
import { useSearchParams } from 'next/navigation'
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';

export default function DepartamentChecking() {
    const searchParams = useSearchParams();
    const course_id = searchParams.get('course_id');

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [courseInfo, setCourseInfo] = useState<{ title: string } | null>(null);
    const [themes, setThemes] = useState<themeType[]>([]);
    const [themeShow, setThemeShow] = useState(false);
    const [hasSteps, setHasSteps] = useState(false);
    const [steps, setSteps] = useState<mainStepsType[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | number[]>(0);
    const [videoCall, setVideoCall] = useState(false);
    const [video_link, setVideoLink] = useState('');
    const [stepsSkeleton, setStepsSkeleton] = useState(false);
    const [totalScore, setTotalScore] = useState(0);

    const handleFetchLessons = async () => {
        const data = await depExamination(Number(course_id));

        if (data && data?.lessons) {
            setThemeShow(false);
            if (data.lessons?.length < 1) {
                // setHasSteps(true);
            } else {
                // setHasSteps(false);
                setThemes(data.lessons);
                setCourseInfo({ title: data?.course?.title });
                setTotalScore(data?.max_sum_score);
            }
        } else {
            setThemeShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторит позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleFetchSteps = async (lesson_id: number) => {
        setStepsSkeleton(true);
        const data = await depExaminationSteps(Number(lesson_id));
        if (data.success) {
            if (data.steps?.length < 1) {
                setHasSteps(true);
            } else {
                setHasSteps(false);
                setSteps(data.steps);
            }
        } else {
            setHasSteps(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setStepsSkeleton(false);
    };

    const handleVideoCall = (value: string | null) => {
        if (!value) {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при обработке видео', detail: '' }
            });
        }

        const url = new URL(typeof value === 'string' ? value : '');
        let videoId = null;

        if (url.hostname === 'youtu.be') {
            // короткая ссылка, видео ID — в пути
            videoId = url.pathname.slice(1); // убираем первый слеш
        } else if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
            // стандартная ссылка, видео ID в параметре v
            videoId = url.searchParams.get('v');
        }

        if (!videoId) {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при обработке видео', detail: '' }
            });
            return null; // не удалось получить ID
        }
        // return `https://www.youtube.com/embed/${videoId}`;
        setVideoLink(`https://www.youtube.com/embed/${videoId}`);
        setVideoCall(true);
    };

    // ПРОСИМ КУРС ДЛЯ НАЗВАНИЯ И ТЕМЫ
    useEffect(() => {
        handleFetchLessons();
    }, []);

    // просто посмотреть пока
    useEffect(() => {
        if (themes?.length > 0 && [activeIndex as number]) {
            const lessonId = themes[activeIndex as number]?.id;
            if (lessonId) {
                handleFetchSteps(lessonId);
            }
        }
    }, [themes, activeIndex]);

    return (
        <div className="main-bg">
            <Dialog
                header={''}
                className="w-[80%] h-[300px] md:h-[500px]"
                visible={videoCall}
                onHide={() => {
                    if (!videoCall) return;
                    setVideoCall(false);
                }}
            >
                <div className="flex justify-center items-center">
                    <iframe
                        className="w-full h-[200px] md:h-[400px]"
                        // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        src={video_link}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </Dialog>
            {themeShow ? (
                <NotFound titleMessage="Темы отсуствуют или временно не доступны" />
            ) : (
                <div className=''>
                    <div>
                        <h3 className="text-lg pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]"><span className='text-[var(--mainColor)]'>Название курса:</span> {courseInfo?.title}</h3>
                        <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                            {themes.map((item) => {
                                const content = steps.filter((j) => {
                                    return j.content != null;
                                });

                                return (
                                    <AccordionTab header={'Тема: ' + item.title} key={item.id} className="w-full p-accordion" style={{ width: '100%' }}>
                                        <div className="flex flex-col gap-2">
                                            {stepsSkeleton ? <ProgressSpinner style={{ width: '30px', height: '30px' }} animationDuration=".5s" />
                                                : hasSteps ? (
                                                    <p className="text-center text-sm">Данных нет</p>
                                                ) : content?.length > 0 ? (
                                                    content.map((i, idx) => {
                                                        if (i.content) {
                                                            return (
                                                                <div className={`${idx !== 0 && idx !== content?.length ? 'border-t-1 border-[gray]' : ''}`} key={i.id}>
                                                                    {
                                                                        <LessonInfoCard
                                                                            type={i.type.name}
                                                                            icon={i.type.logo}
                                                                            title={i.content?.title}
                                                                            description={i.content?.description || ''}
                                                                            documentUrl={{ document: i.content?.document, document_path: i.content?.document_path }}
                                                                            video_link={i.content?.link}
                                                                            link={i.content?.url}
                                                                            test={{ content: i.content.content, answers: i.content.answers, score: i.content.score }}
                                                                            videoStart={handleVideoCall}
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
                    <div className="flex justify-end gap-1 p-1">
                        <b>Общий балл: </b>
                        <b className="text-[var(--mainColor)]"> {totalScore}</b>
                    </div>
                </div>
            )}
        </div>
    );
}