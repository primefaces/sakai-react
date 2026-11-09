'use client';

import FacultyHeader, { FacultyEmpty, facultyCardClass } from '@/app/components/faculty/FacultyHeader';
import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { depCourseInfo } from '@/services/faculty';
import { fetchDepartamentSteps } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import { useParams } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { useContext, useEffect, useState } from 'react';
import { useLocalization } from '@/layout/context/localizationcontext';
import { fetchThemes } from '@/services/courses';

export default function LessonCheck() {
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const { translations } = useLocalization();
    const { id_kafedra, myedu_id, course_id } = useParams();

    const [themes, setThemes] = useState<themeType[]>([]);
    const [themesLoading, setThemesLoading] = useState(true);
    // шаги храним по id урока: при открытии другой темы не показываются данные предыдущей
    const [stepsByLesson, setStepsByLesson] = useState<Record<number, mainStepsType[]>>({});
    const [loadingLessons, setLoadingLessons] = useState<Record<number, boolean>>({});
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const [videoCall, setVideoCall] = useState(false);
    const [video_link, setVideoLink] = useState('');
    const [courseInfo, setCourseInfo] = useState({ title: '' });

    const handleCourseInfo = async () => {
        if (course_id) {
            const data = await depCourseInfo(Number(course_id), Number(id_kafedra));
            if (data?.success) {
                setCourseInfo({ title: data.course.title });
            }
        }
    };

    const handleFetchSteps = async (lesson_id: number) => {
        setLoadingLessons((prev) => ({ ...prev, [lesson_id]: true }));
        const data = await fetchDepartamentSteps(Number(lesson_id), Number(id_kafedra));
        if (data?.success) {
            setStepsByLesson((prev) => ({ ...prev, [lesson_id]: data.steps || [] }));
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setLoadingLessons((prev) => ({ ...prev, [lesson_id]: false }));
    };

    const handleVideoCall = (value: string | null) => {
        const showVideoError = () =>
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.videoProccessError, detail: '' }
            });

        if (!value) {
            showVideoError();
            return null;
        }

        let url: URL;
        try {
            url = new URL(value);
        } catch {
            showVideoError();
            return null;
        }

        let videoId = null;

        if (url.hostname === 'youtu.be') {
            // короткая ссылка, видео ID — в пути
            videoId = url.pathname.slice(1); // убираем первый слеш
        } else if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
            // стандартная ссылка, видео ID в параметре v
            videoId = url.searchParams.get('v');
        }

        if (!videoId) {
            showVideoError();
            return null; // не удалось получить ID
        }
        setVideoLink(`https://www.youtube.com/embed/${videoId}`);
        setVideoCall(true);
    };

    const handleFetchThemes = async () => {
        setThemesLoading(true);
        const data = await fetchThemes(Number(course_id) || null, id_kafedra ? Number(id_kafedra) : null);
        if (data) {
            setThemes(data?.lessons?.data || []);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: '' }
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
        setThemesLoading(false);
    };

    // ПРОСИМ КУРС ДЛЯ НАЗВАНИЯ И ТЕМЫ
    useEffect(() => {
        handleFetchThemes();
        handleCourseInfo();
        return () => {
            setThemes([]);
        };
    }, []);

    // шаги открытой темы (загружаем один раз, дальше берём из кэша)
    useEffect(() => {
        if (activeIndex === null) return;
        const lessonId = themes[activeIndex]?.id;
        if (lessonId && !stepsByLesson[lessonId] && !loadingLessons[lessonId]) {
            handleFetchSteps(lessonId);
        }
    }, [themes, activeIndex]);

    const lessonContent = (lessonId: number) => {
        const steps = stepsByLesson[lessonId];

        if (loadingLessons[lessonId] || (!steps && activeIndex !== null && themes[activeIndex]?.id === lessonId)) {
            return <GroupSkeleton count={3} size={{ width: '100%', height: '3.5rem' }} />;
        }

        const content = (steps || []).filter((step) => step.content != null);
        if (content.length === 0) {
            return (
                <div className="flex items-center gap-[8px] p-[12px] rounded-[12px] bg-[#f8fafc] text-[0.8125rem] text-[var(--text-color-secondary)]">
                    <i className="pi pi-info-circle text-[0.8125rem]"></i>
                    {translations.noData}
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-[8px]">
                {content.map((i, idx) => (
                    <div key={i.id} className="fade-up flex gap-[10px] p-[10px] sm:p-[12px] rounded-[12px] border border-[#eef2f6] bg-white hover:bg-[#f8fbfd] transition-colors" style={{ animationDelay: `${Math.min(idx, 12) * 35}ms` }}>
                        <span className="hidden sm:flex items-center justify-center shrink-0 self-start mt-[8px] w-[22px] h-[22px] rounded-full bg-[#f1f5f9] text-[0.6875rem] font-bold text-[var(--text-color-secondary)]">{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                            <LessonInfoCard
                                type={i.type.name}
                                icon={i.type.logo}
                                title={i.content?.title}
                                description={i.content?.description || ''}
                                documentUrl={{ document: i.content!.document, document_path: i.content!.document_path }}
                                video_link={i.content?.link}
                                link={i.content?.url}
                                test={{ content: i.content!.content, answers: i.content!.answers, score: i.content!.score }}
                                videoStart={handleVideoCall}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const themeHeader = (item: themeType, idx: number) => {
        const steps = stepsByLesson[item.id];
        const count = steps ? steps.filter((s) => s.content != null).length : null;

        return (
            <div className="flex items-center gap-[12px] w-full min-w-0">
                <span className="flex items-center justify-center shrink-0 w-[34px] h-[34px] rounded-[10px] bg-[#f1f5f9] text-[0.8125rem] font-bold text-[var(--bodyColor)]">{idx + 1}</span>
                <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                    <span className="text-[0.6875rem] uppercase tracking-[0.04em] font-semibold text-[var(--text-color-secondary)]">{translations.theme}</span>
                    <span className="text-[0.875rem] sm:text-[0.9375rem] font-semibold text-[var(--titleColor)] leading-snug break-words">{item.title}</span>
                </div>
                {count !== null && (
                    <span className="inline-flex items-center gap-[4px] shrink-0 px-[8px] py-[3px] rounded-full bg-[var(--mainColor)]/10 text-[0.6875rem] font-semibold text-[var(--mainColor)] whitespace-nowrap" title={translations.materials}>
                        <i className="pi pi-file text-[0.625rem]"></i>
                        {count}
                    </span>
                )}
            </div>
        );
    };

    const content = () => {
        if (themesLoading) return <GroupSkeleton count={5} size={{ width: '100%', height: '4rem' }} />;
        if (themes.length === 0) return <FacultyEmpty icon="pi pi-list" text={translations.themesNotAvailable} />;

        return (
            <div className={`${facultyCardClass} p-[10px] sm:p-[16px]`}>
                <Accordion className="modern-accordion" activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index as number | null)}>
                    {themes.map((item, idx) => (
                        <AccordionTab key={item.id} header={themeHeader(item, idx)}>
                            {lessonContent(item.id)}
                        </AccordionTab>
                    ))}
                </Accordion>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-[16px]">
            <Dialog header={courseInfo.title || ''} className="w-[95%] md:w-[80%]" contentClassName="p-[10px] sm:p-[16px]" visible={videoCall} onHide={() => setVideoCall(false)}>
                <div className="w-full aspect-video rounded-[12px] overflow-hidden bg-black">
                    <iframe
                        className="w-full h-full"
                        src={video_link}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </Dialog>

            <FacultyHeader
                icon="pi pi-folder-open"
                title={courseInfo.title || translations.courseName}
                subtitle={courseInfo.title ? translations.courseName : undefined}
                count={themes.length}
                backHref={`/faculty/${id_kafedra}/${myedu_id}`}
            />
            {content()}
        </div>
    );
}
