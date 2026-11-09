'use client';

import dynamic from 'next/dynamic';

const PDFreader = dynamic(() => import('@/app/components/pdfComponents/PDFreader'), { ssr: false });

import { FacultyEmpty, facultyCardClass } from '@/app/components/faculty/FacultyHeader';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { statusView } from '@/services/notifications';
import { chillsUpdate, fetchItemsLessons, fetchMainLesson, fetchStudentSteps, fetchSubjects, stepPractica, stepTest } from '@/services/studentMain';
import { docValueType } from '@/types/docValueType';
import { lessonType } from '@/types/lessonType';
import { mainStepsType } from '@/types/mainStepType';
import { useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StepApi } from '@/types/Step/StepApi/StepApi';
import Link from 'next/link';
import AnswersTable from '@/app/components/tables/AnswersTable';
import { useLocalization } from '@/layout/context/localizationcontext';
import { useLocalizedData } from '@/hooks/useLocalizedData';

// NOTE: primeflex подключён глобально с !important (w-9, w-12, grid и т.п. конфликтуют с Tailwind),
// поэтому для размеров/отступов здесь используются произвольные значения Tailwind.

const MAX_TEST_ATTEMPTS = 3;

export default function LessonTest() {
    // types
    interface subjectType {
        id_curricula: number;
        course_ids: number[];
        streams: number[];
    }

    interface LessonNavigationUi {
        lesson: lessonType;
        lessons: lessonType[];
    }

    interface StepNavigationUi {
        stepsLength: number;
        currentStepPos: number;
        nextStep: StepApi;
        prevStep: StepApi;
    }

    interface ReportStep extends mainStepsType {
        my_score?: number | null;
        details: { is_correct: boolean }[];
    }

    // шаг темы для верхнего степпера
    interface LessonStepUi {
        id: number;
        done: boolean;
        type?: { logo?: string; title?: string; name?: string };
    }

    const { lesson_id, subject_id, stream_id, id, id_edu_year } = useParams();
    const params = new URLSearchParams();

    const router = useRouter();
    const showError = useErrorMessage();
    const { user, setMessage, contextNotificationId, setContextNotificationId, handleNotifications } = useContext(LayoutContext);
    const { translations } = useLocalization();
    const { getLocalized } = useLocalizedData();

    const [steps, setMainSteps] = useState<ReportStep | null>(null);
    const [hasSteps, setHasSteps] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [mainProgressSpinner, setMainProgressSpinner] = useState(false);
    const [type, setType] = useState('');
    const [practica, setPractica] = useState<{
        content?: { document: string; document_path: string; description: string | null; title: string; link: string; url: string; content: string; answers: [{ text: string; is_correct: boolean; id: number | null }]; score: number };
    } | null>(null);
    const [test, setTests] = useState<mainStepsType | null>(null);
    const [answer, setAnswer] = useState<{ id: number | null; text: string; is_correct: boolean }[] | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState(false);
    const [answerCheck, setAnswerCheck] = useState(false);
    // индекс варианта, выбранного студентом (только для отображения)
    const [pickedIndex, setPickedIndex] = useState<number | null>(null);
    const [lessons, setLessons] = useState<Record<number, { semester: { name_kg: string } } | predmetType>>({
        1: { semester: { name_kg: '' } }
    });
    const [lessonName, setLessonName] = useState('');
    const [lessonNavigation, setLessonNavigation] = useState<LessonNavigationUi | null>(null);
    const [stepNavigation, setStepNavigation] = useState<StepNavigationUi | null>(null);
    const [lessonSteps, setLessonSteps] = useState<LessonStepUi[]>([]);
    const [nextLesson, setNextLesson] = useState<lessonType | null>(null);
    const [prevLesson, setPrevLesson] = useState<lessonType | null>(null);
    const [navigationStepId, setNavigationStepId] = useState<number | null>(null);
    const [courseInfo, setCoursesInfo] = useState<{ title: string; description: string; image: string } | null>(null);
    const [main_id, setMain_id] = useState<predmetType | null>(null);
    const [courses, setCourses] = useState<
        {
            id: number;
            connections: { subject_type: string; id: number; user_id: number | null; id_stream: number }[];
            title: string;
            description: string;
            image: string;
            user: { last_name: string; name: string; father_name: string };
            lessons: lessonType[];
        }[]
    >([]);
    const [docValue, setDocValue] = useState<docValueType>({
        title: '',
        description: '',
        file: null
    });
    const [chillsLoading, setChillsLoading] = useState(false);

    const stepperRef = useRef<HTMLDivElement>(null);

    // document
    const [document, setDocument] = useState<mainStepsType | null>(null);

    // link
    const [link, setLink] = useState<mainStepsType | null>(null);

    // video
    const [video, setVideo] = useState<mainStepsType | null>(null);
    const [preview, setPreview] = useState(false);
    const [videoLink, setVideoLink] = useState('');

    // fetch lessons
    const handleFetchLessons = async () => {
        setMainProgressSpinner(true);
        const data = await fetchItemsLessons(Number(id_edu_year));
        if (data && data?.success) {
            // валидность проверить
            setLessons(data?.data);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater }
            });
            if (data?.data?.response?.status) {
                showError(data?.data.response.status);
            }
        }
        setMainProgressSpinner(false);
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

    const handleStep = async () => {
        const data = await fetchStudentSteps(Number(id), Number(stream_id));
        if (data?.success) {
            if (!data?.step?.content || data?.step?.content == null) {
                setHasSteps(true);
            } else {
                setHasSteps(false);
                setMainSteps(data.step);
            }
        } else {
            setHasSteps(true);
        }
    };

    // Запрос курса, типа уроков (лк,лб)
    const handleFetchSubject = async (subject: subjectType) => {
        params.append('id_curricula', String(subject.id_curricula));
        subject.streams.forEach((i) => params.append('streams[]', String(i)));
        subject.course_ids.forEach((i) => params.append('course_ids[]', String(i)));

        const data = await fetchSubjects(params);
        if (data) {
            setCourses(data);
            // setHasThemes(false);
        } else {
            // setHasThemes(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleVideoCall = (value: string | null) => {
        setPreview(true);

        if (!value) {
            setPreview(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: '' }
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
            setPreview(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: '' }
            });
            return null; // не удалось получить ID
        }
        // return `https://www.youtube.com/embed/${videoId}`;
        setVideoLink(`https://www.youtube.com/embed/${videoId}`);
        setPreview(false);
        // setVisisble(true);
    };

    const handleAddTest = async () => {
        setProgressSpinner(true);
        const isCorrect = answer?.filter((item) => item.is_correct);
        const data = await stepTest(steps && steps?.id, steps?.connections?.id_stream, (isCorrect && isCorrect[0]?.id) || null);

        if (data?.success) {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'success', summary: '', detail: data?.message }
            });
            handleStep();
        } else {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: '' }
            });
            handleStep();
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.error, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    const handleAddPractica = async () => {
        setProgressSpinner(true);
        const data = await stepPractica(steps && steps?.id, steps?.connections?.id_stream, docValue.file);
        if (data?.success) {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'success', summary: '', detail: data?.message }
            });
            handleStep();
        } else {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.error, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    // Отметка "выполнено" для материалов (документ, ссылка, видео) — тот же запрос, что и в списке тем
    const handleChills = async () => {
        if (!steps) return;
        setChillsLoading(true);
        const data = await chillsUpdate(steps.id, steps?.connections?.id_stream ?? Number(stream_id), !steps.chills);
        if (data?.success) {
            setMessage({
                state: true,
                value: { severity: 'success', summary: '', detail: data?.message }
            });
            await handleStep();
        } else if (data?.response?.status) {
            if (data?.response?.status == '400') {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: data?.response?.data?.message, detail: '' }
                });
            } else {
                showError(data.response.status);
            }
        }
        setChillsLoading(false);
    };

    // Вызываем список шагов
    const handleMainLesson = async (lesson_id: number, stream_id: number) => {
        const data = await fetchMainLesson(lesson_id, stream_id);
        // Возвращаем данные или null/пустой массив
        if (data && data.length > 0) {
            return data;
        } else {
            setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.dataTemporarilyUnavailable } });
            return [];
        }
    };

    // Вызываем список шагов для prev , next темы
    const handleLessonRouterPush = async (lesson_id: number, stream_id: number) => {
        const data: any = await handleMainLesson(lesson_id, stream_id);
        const validSteps = data?.filter((item: { id_parent: number | null }) => item?.id_parent);
        if (validSteps && validSteps.length > 0) {
            // пока состояние не используется
            setNavigationStepId(validSteps[0]?.id);
            if (validSteps[0]?.id) router.push(`/teaching/lessonView/${lesson_id}/${subject_id}/${stream_id}/${validSteps[0].id}/${id_edu_year}`);
        } else {
            setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.noData } });
        }
    };

    useEffect(() => {
        if (steps?.type.name === 'document') {
            setType(steps?.type.name);
            setDocument(steps);
        } else if (steps?.type.name === 'link') {
            setType(steps?.type.name);
            setLink(steps);
        } else if (steps?.type.name === 'practical') {
            setType(steps?.type.name);
            setPractica(steps);
        } else if (steps?.type.name === 'test') {
            setType(steps?.type.name);
            setTests(steps);
            setAnswer(steps?.content?.answers || []);
        } else if (steps?.type.name === 'video') {
            setType(steps?.type.name);
            setVideo(steps);
        }

        setPickedIndex(null);
        // синхронизируем отметку текущего шага в степпере после ответа/отметки
        if (steps) {
            const done = !!steps.chills || (steps.type?.name === 'test' && (steps.count_attempt || 0) >= MAX_TEST_ATTEMPTS);
            setLessonSteps((prev) => prev.map((s) => (s.id === steps.id ? { ...s, done } : s)));
        }
    }, [steps]);

    // Из предметов получаю выбранный курс в main_id
    useEffect(() => {
        const lessonArray = Object.values(lessons);
        // console.log(lessonArray)
        let search_id: predmetType | null = null;
        if (lessonArray && Array.isArray(lessonArray)) {
            for (let i = 0; i < lessonArray.length; i++) {
                const lessonItemArray = Object.values(lessonArray[i]);
                // console.log(lessonItemArray);

                search_id = lessonItemArray.find((item: any) => item.id_curricula == subject_id);
                if (search_id && search_id != null) {
                    break;
                }
            }
            if (search_id) {
                setMain_id(search_id);
            }
        }
    }, [lessons]);

    useEffect(() => {
        if (main_id && main_id != null) {
            const forSubject: subjectType = { id_curricula: main_id?.id_curricula, course_ids: main_id?.course_ids, streams: main_id?.streams.map((i: { id: number }) => i.id) };
            handleFetchSubject(forSubject);
        }
    }, [main_id]);

    useEffect(() => {
        if (video?.content?.link) {
            handleVideoCall(video.content.link);
        }
    }, [video]);

    useEffect(() => {
        if (lesson_id) {
            const forLesson = courses?.find((item) => {
                return item?.lessons.find((j) => {
                    if (j?.id === Number(lesson_id)) {
                        setLessonName(j?.title || '');
                        setLessonNavigation({ lessons: item.lessons, lesson: j });
                    }
                    return j?.id === Number(lesson_id);
                });
            });
            // if (forLesson && forLesson?.lessons) {
            //     setContextNewStudentThemes(forLesson?.lessons);
            // }

            setCoursesInfo(forLesson || null);
        }
    }, [courses]);

    useEffect(() => {
        const check = answer?.find((item) => item?.is_correct);
        if (check) {
            setAnswerCheck(true);
        } else {
            setAnswerCheck(false);
        }
    }, [answer]);

    useEffect(() => {
        if (test?.answer_id && test?.answer_id != null) {
            setSelectedAnswer(true);
        } else {
            setSelectedAnswer(false);
        }
    }, [test]);

    useEffect(() => {
        if (lessonNavigation) {
            for (let i = 0; i < lessonNavigation?.lessons?.length; i++) {
                const el: lessonType = lessonNavigation?.lessons[i];
                if (el?.id === lessonNavigation?.lesson?.id) {
                    if (lessonNavigation?.lessons[i + 1]) {
                        setNextLesson(lessonNavigation.lessons[i + 1]);
                    } else {
                        setNextLesson(null);
                    }

                    if (lessonNavigation?.lessons[i - 1]) {
                        setPrevLesson(lessonNavigation.lessons[i - 1]);
                    } else {
                        setPrevLesson(null);
                    }
                }
            }
        }
    }, [lessonNavigation]);

    useEffect(() => {
        handleFetchLessons();
        handleStep();

        if (contextNotificationId && contextNotificationId != null) {
            handleStatusView(contextNotificationId);
        }

        const stepSend = async () => {
            if (lesson_id && stream_id) {
                const data = await handleMainLesson(Number(lesson_id), Number(stream_id)); // steps
                // console.log(data);
                if (data) {
                    const validSteps = data?.filter((item: StepApi) => item?.id_parent);
                    setLessonSteps(
                        (validSteps || []).map((s: StepApi) => ({
                            id: s.id,
                            done: !!s.chills || (s.type?.name === 'test' && (Number(s.count_attempt) || 0) >= MAX_TEST_ATTEMPTS),
                            type: s.type
                        }))
                    );
                    for (let i = 0; i < validSteps?.length; i++) {
                        const step: StepApi = validSteps[i];
                        if (step.id_parent && step?.id === Number(id)) {
                            if (validSteps) {
                                const stepsLength = validSteps.length;
                                const currentStepPos = i + 1;
                                const nextStep = validSteps[i + 1] || null;
                                const prevStep = validSteps[i - 1] || null;

                                setStepNavigation((prev) => {
                                    // Если prev — null, создаем новое состояние.
                                    // Если prev существует, используем его для объединения.
                                    return {
                                        ...(prev || {}), // Используем существующее или пустой объект
                                        stepsLength,
                                        currentStepPos,
                                        nextStep,
                                        prevStep
                                    };
                                });
                            }
                        }
                    }
                }
            }
        };
        stepSend();
    }, []);

    // прокручиваем степпер к текущему шагу (на мобильных он не помещается целиком)
    useEffect(() => {
        const container = stepperRef.current;
        const current = container?.querySelector<HTMLElement>('[data-current="true"]');
        if (container && current) {
            container.scrollLeft = current.offsetLeft - container.clientWidth / 2 + current.clientWidth / 2;
        }
    }, [lessonSteps, id]);

    // ---------- вычисляемые значения для UI ----------
    const stepUrl = (stepId: number) => `/teaching/lessonView/${lesson_id}/${subject_id}/${stream_id}/${stepId}/${id_edu_year}`;
    const backHref = `/teaching/${subject_id}/${id_edu_year}`;
    const lessonIndex = lessonNavigation ? lessonNavigation.lessons.findIndex((l) => l.id === lessonNavigation.lesson.id) : -1;
    const doneCount = lessonSteps.filter((s) => s.done).length;
    const progressPct = lessonSteps.length ? Math.round((doneCount / lessonSteps.length) * 100) : 0;
    const attemptsUsed = steps?.count_attempt || 0;
    const isTestLocked = attemptsUsed >= MAX_TEST_ATTEMPTS;
    const isMaterial = type === 'document' || type === 'link' || type === 'video';
    const isStepDone = !!steps?.chills || (type === 'test' && isTestLocked);

    // ---------- общие элементы ----------
    const chip = (icon: string, content: ReactNode, tone: 'main' | 'green' | 'gray' = 'gray') => {
        const tones = {
            main: 'bg-[var(--mainColor)]/10 text-[var(--mainColor)]',
            green: 'bg-[#effaf0] text-[var(--greenColor)]',
            gray: 'bg-[#f1f5f9] text-[var(--bodyColor)]'
        };
        return (
            <span className={`inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-[0.75rem] font-semibold whitespace-nowrap ${tones[tone]}`}>
                <i className={`${icon} text-[0.6875rem]`}></i>
                {content}
            </span>
        );
    };

    const sectionHeader = (title?: string, withScore = false) => (
        <div className="flex items-start gap-[12px]">
            <span className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                <i className={`${steps?.type?.logo} text-[1.125rem]`}></i>
            </span>
            <div className="flex flex-col gap-[6px] min-w-0 flex-1">
                <span className="text-[0.6875rem] uppercase tracking-[0.04em] font-semibold text-[var(--text-color-secondary)]">{steps?.type?.title}</span>
                {title && <h2 className="text-[1rem] sm:text-[1.25rem] leading-snug font-bold text-[var(--titleColor)] m-0 break-words">{title}</h2>}
                {(withScore || isStepDone) && (
                    <div className="flex flex-wrap items-center gap-[6px]">
                        {withScore && steps?.score != null && chip('pi pi-star', `${translations.score}: ${steps.score}`, 'main')}
                        {isStepDone && chip('pi pi-check', translations.completed, 'green')}
                    </div>
                )}
            </div>
        </div>
    );

    const descriptionBlock = (text?: string | null) =>
        text ? <div className="text-[0.9375rem] text-[var(--bodyColor)] leading-relaxed break-words whitespace-pre-line p-[12px] rounded-[12px] bg-[#f8fafc]">{text}</div> : null;

    // кнопка "Отметить как выполненный" для материалов
    const chillsFooter = isMaterial && (
        <div className="flex items-center justify-end pt-[12px] border-t border-[#f1f5f9]">
            <Button
                label={steps?.chills ? translations.completed : translations.markAsCompleted}
                icon={steps?.chills ? 'pi pi-check' : 'pi pi-check-circle'}
                size="small"
                loading={chillsLoading}
                disabled={chillsLoading}
                onClick={handleChills}
                className={`w-full sm:w-auto ${steps?.chills ? 'success-button' : ''}`}
            />
        </div>
    );

    const cardClass = `${facultyCardClass} p-[12px] sm:p-[20px] flex flex-col gap-[14px]`;

    // ---------- секции по типу шага ----------
    const docSection = (
        <div className={cardClass}>
            {sectionHeader(document?.content?.title)}
            {descriptionBlock(document?.content?.description)}
            {document?.content?.document_path && (
                <div className="flex flex-wrap items-center gap-[8px]">
                    <a
                        href={document?.content?.document_path}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-[8px] px-[14px] h-[40px] rounded-[10px] border border-[#e5e7eb] bg-white text-[0.875rem] font-semibold text-[var(--titleColor)] hover:border-[var(--mainColor)] hover:text-[var(--mainColor)] transition-colors"
                    >
                        <i className="pi pi-external-link text-[0.8125rem]"></i>
                        {translations.openSeparately}
                    </a>
                </div>
            )}
            <div className="w-full overflow-hidden rounded-[12px]">
                <PDFreader url={document?.content?.document || ''} />
            </div>
            {chillsFooter}
        </div>
    );

    const linkSection = (
        <div className={cardClass}>
            {sectionHeader(link?.content?.title)}
            {descriptionBlock(link?.content?.description)}
            {link?.content?.url && (
                <div className="flex flex-col gap-[8px] p-[12px] rounded-[12px] border border-[#eef2f6]">
                    <a
                        href={String(link?.content?.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-[8px] self-stretch sm:self-start px-[16px] h-[44px] rounded-[10px] bg-[var(--mainColor)] text-white text-[0.9375rem] font-semibold hover:opacity-90 transition-opacity"
                    >
                        <i className="pi pi-external-link"></i>
                        {translations.openLink}
                    </a>
                    <span className="text-[0.75rem] text-[var(--text-color-secondary)] break-all">{link?.content?.url}</span>
                </div>
            )}
            {chillsFooter}
        </div>
    );

    const videoSection = (
        <div className={cardClass}>
            {sectionHeader(video?.content?.title)}
            {descriptionBlock(video?.content?.description)}
            <div className="relative w-full aspect-video rounded-[12px] overflow-hidden bg-black">
                {preview ? (
                    <>
                        <img src={video?.content?.cover_url || '/layout/images/no-image.png'} className="w-full h-full object-cover opacity-60" alt={video?.content?.title || ''} />
                        <div className="absolute inset-0 flex justify-center items-center">
                            <ProgressSpinner style={{ width: '60px', height: '60px' }} />
                        </div>
                    </>
                ) : (
                    <iframe
                        className="w-full h-full"
                        src={videoLink}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
            {chillsFooter}
        </div>
    );

    const practicaSection = (
        <div className={cardClass}>
            {sectionHeader(practica?.content?.title, true)}

            {(practica?.content?.description || practica?.content?.document_path || practica?.content?.url) && (
                <div className="flex flex-col gap-[12px] p-[12px] rounded-[12px] bg-[#f8fafc]">
                    {practica?.content?.description && (
                        <div className="text-[0.9375rem] text-[var(--bodyColor)] leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: practica?.content?.description }} />
                    )}
                    {((practica?.content?.document_path && practica?.content.document_path.toLowerCase().includes('pdf')) || practica?.content?.url) && (
                        <div className="flex flex-wrap items-center gap-[8px]">
                            {practica?.content?.document_path && practica?.content.document_path.toLowerCase().includes('pdf') && (
                                <a
                                    href={practica?.content.document_path}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-[8px] px-[12px] h-[38px] rounded-[10px] bg-white border border-[#e5e7eb] text-[0.8125rem] font-semibold text-[var(--titleColor)] hover:border-[var(--mainColor)] transition-colors"
                                >
                                    <i className="pi pi-file-pdf text-[var(--redColor)]"></i>
                                    {translations.downloadFile}
                                </a>
                            )}
                            {practica?.content?.url && (
                                <a
                                    href={practica?.content.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-[8px] px-[12px] h-[38px] max-w-full rounded-[10px] bg-white border border-[#e5e7eb] text-[0.8125rem] font-semibold text-[var(--mainColor)] hover:border-[var(--mainColor)] transition-colors"
                                >
                                    <i className="pi pi-link shrink-0"></i>
                                    <span className="truncate">{translations.linkLabel}</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            )}

            {steps?.chills ? (
                <div className="flex items-center gap-[10px] p-[12px] rounded-[12px] bg-[#effaf0] text-[var(--greenColor)] font-semibold">
                    <i className="pi pi-check-circle text-[1.25rem]"></i>
                    {translations.taskCompleted}
                </div>
            ) : (
                <div className="flex flex-col gap-[10px] p-[12px] sm:p-[14px] rounded-[14px] border border-[#e6f4fb] bg-[#f7fcff]">
                    <div className="flex items-start gap-[10px]">
                        <span className="flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-full bg-[var(--mainColor)] text-white">
                            <i className="pi pi-upload text-[0.75rem]"></i>
                        </span>
                        <span className="text-[0.8125rem] sm:text-[0.875rem] leading-snug text-[var(--bodyColor)] pt-[4px]">{translations.taskInstruction}</span>
                    </div>
                    <label
                        className={`flex items-center gap-[12px] p-[12px] sm:p-[14px] rounded-[12px] border-2 border-dashed cursor-pointer transition-colors active:scale-[0.99] ${
                            docValue.file ? 'border-[var(--greenColor)] bg-[#effaf0]' : 'border-[#cfe3ee] bg-white hover:border-[var(--mainColor)]'
                        }`}
                    >
                        <span
                            className={`flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[10px] ${
                                docValue.file ? 'bg-[var(--greenColor)] text-white' : 'bg-[var(--mainColor)]/10 text-[var(--mainColor)]'
                            }`}
                        >
                            <i className={docValue.file ? 'pi pi-file-pdf' : 'pi pi-cloud-upload'}></i>
                        </span>
                        <span className="flex flex-col min-w-0 flex-1">
                            <span className="text-[0.875rem] font-semibold text-[var(--titleColor)] truncate">{docValue.file ? docValue.file.name : translations.choosePdfFile}</span>
                            <span className="text-[0.75rem] text-[var(--text-color-secondary)]">PDF · {translations.maxFileSize10mb}</span>
                        </span>
                        {docValue.file && <i className="pi pi-check-circle shrink-0 text-[var(--greenColor)]"></i>}
                        <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const maxSize = 10 * 1024 * 1024;

                                    if (file.size > maxSize) {
                                        setMessage({
                                            state: true,
                                            value: { severity: 'error', summary: translations.fileTooLarge, detail: translations.maxFileSize10mb }
                                        });
                                    } else {
                                        setDocValue((prev) => ({
                                            ...prev,
                                            file: file
                                        }));
                                    }
                                }
                            }}
                        />
                    </label>
                    <Button
                        label={translations.send}
                        icon="pi pi-send"
                        loading={progressSpinner}
                        disabled={progressSpinner || !docValue.file}
                        className={`w-full sm:w-auto sm:self-start h-[44px] !rounded-[10px] ${!docValue.file ? '!bg-[#e2e8f0] !border-[#e2e8f0] !text-[#94a3b8] !opacity-100' : ''}`}
                        onClick={() => {
                            handleAddPractica();
                        }}
                    />
                </div>
            )}
            <div className="overflow-x-auto -mx-[2px] px-[2px]">
                <AnswersTable report={steps} />
            </div>
        </div>
    );

    const testSection = (
        <div className={`${cardClass} relative`}>
            {progressSpinner && (
                <div className="z-10 absolute inset-0 rounded-[16px] bg-white/70 flex justify-center items-center">
                    <ProgressSpinner style={{ width: '60px', height: '60px' }} />
                </div>
            )}
            {sectionHeader(undefined, true)}

            <div className="flex flex-col gap-[10px]">
                <p className="m-0 text-[1rem] sm:text-[1.125rem] font-semibold text-[var(--titleColor)] leading-snug break-words">{test?.content?.content}</p>
                {!isTestLocked && (
                    <span className="text-[0.75rem] text-[var(--text-color-secondary)]">
                        {translations.attemptsLeft}: <b>{MAX_TEST_ATTEMPTS - attemptsUsed}</b> / {MAX_TEST_ATTEMPTS}
                    </span>
                )}
                <div className="flex flex-col gap-[8px]">
                    {test?.content?.answers.map((item, index) => {
                        const checked = selectedAnswer ? item.id == test?.answer_id : pickedIndex === index;
                        return (
                            <label
                                key={index}
                                className={`flex items-center gap-[10px] p-[12px] rounded-[12px] border transition-colors ${
                                    checked ? 'border-[var(--mainColor)] bg-[#f0faff]' : 'border-[#e5e7eb] bg-white'
                                } ${isTestLocked ? 'cursor-default opacity-70' : 'cursor-pointer hover:border-[var(--mainColor)]'}`}
                            >
                                <span className="custom-radio !p-0 shrink-0">
                                    <input
                                        type="radio"
                                        name="testRadio"
                                        checked={checked}
                                        disabled={isTestLocked}
                                        onChange={() => {
                                            setSelectedAnswer(false);
                                            setPickedIndex(index);
                                            setAnswer((prev) => prev && prev.map((ans, i) => (i === index ? { ...ans, is_correct: true } : { ...ans, is_correct: false })));
                                        }}
                                    />
                                    <span className="radio-mark min-w-[18px]"></span>
                                </span>
                                <span className="flex-1 min-w-0 text-[0.9375rem] text-[var(--titleColor)] break-words">{item.text}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {isTestLocked ? (
                <div className="flex items-center gap-[10px] p-[12px] rounded-[12px] bg-[#effaf0] text-[var(--greenColor)] font-semibold">
                    <i className="pi pi-check-circle text-[1.25rem]"></i>
                    {translations.taskCompleted}
                </div>
            ) : (
                <Button
                    label={translations.send}
                    icon="pi pi-send"
                    disabled={progressSpinner || !answer || !answerCheck}
                    className="w-full sm:w-auto sm:self-start"
                    onClick={() => {
                        handleAddTest();
                    }}
                />
            )}

            {/* История ответов */}
            {steps?.details && steps.details.length > 0 && (
                <div className="flex flex-col gap-[8px] pt-[12px] border-t border-[#f1f5f9]">
                    <div className="flex items-center justify-between gap-[8px] flex-wrap">
                        <h3 className="text-[0.9375rem] font-bold text-[var(--titleColor)] m-0">{translations.answerHistory}</h3>
                        {steps?.my_score != null && chip('pi pi-star', `${translations.yourTotalScore}: ${steps.my_score}`, 'main')}
                    </div>
                    {(steps.details as any[]).map((attempt, index) => (
                        <div
                            key={index}
                            className={`flex flex-col gap-[4px] p-[10px] rounded-[10px] border-l-4 bg-[#f8fafc] ${attempt.is_correct ? 'border-[var(--greenColor)]' : 'border-[var(--redColor)]'}`}
                        >
                            <div className="flex items-center justify-between gap-[8px]">
                                <span className="text-[0.8125rem] text-[var(--bodyColor)]">
                                    {translations.attempt} #{index + 1}
                                </span>
                                {attempt.is_correct ? (
                                    <span className="flex items-center gap-[6px] text-[0.8125rem] text-[var(--greenColor)] font-semibold">
                                        <i className="pi pi-check-circle"></i>
                                        {translations.correct}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-[6px] text-[0.8125rem] text-[var(--redColor)] font-semibold">
                                        <i className="pi pi-times-circle"></i>
                                        {translations.incorrect}
                                    </span>
                                )}
                            </div>
                            {attempt?.answers?.text ? <span className="text-[0.8125rem] text-[var(--titleColor)] break-words">{attempt.answers.text}</span> : null}
                        </div>
                    ))}
                </div>
            )}
            {steps?.my_score != null && !(steps?.details && steps.details.length > 0) && <div className="flex justify-end">{chip('pi pi-star', `${translations.yourTotalScore}: ${steps.my_score}`, 'main')}</div>}
        </div>
    );

    // ---------- шапка: тема + степпер ----------
    const courseTitle = getLocalized(courseInfo, 'title') || courseInfo?.title;
    const courseDescription = getLocalized(courseInfo, 'description') || courseInfo?.description;

    const headerSection = (
        <div className={`${facultyCardClass} p-[12px] sm:p-[16px] flex flex-col gap-[12px]`}>
            <div className="flex items-center gap-[12px]">
                <Link
                    href={backHref}
                    aria-label={translations.backToThemes}
                    title={translations.backToThemes}
                    className="group flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[10px] bg-[#f1f5f9] text-[var(--bodyColor)] hover:bg-[var(--mainColor)] hover:text-white transition-colors duration-200"
                >
                    <i className="pi pi-arrow-left text-[0.8125rem] transition-transform duration-200 group-hover:-translate-x-[2px]"></i>
                </Link>
                <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                    {courseTitle && <span className="text-[0.75rem] text-[var(--text-color-secondary)] truncate">{courseTitle}</span>}
                    <h1 className="text-[1rem] sm:text-[1.25rem] leading-snug font-bold text-[var(--titleColor)] m-0 break-words">
                        {translations.theme}
                        {lessonIndex >= 0 ? ` ${lessonIndex + 1}` : ''}: {lessonName || '—'}
                    </h1>
                </div>
            </div>

            {(courseDescription || courseInfo?.image) && (
                <details className="group">
                    <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer select-none inline-flex items-center gap-[6px] text-[0.8125rem] font-semibold text-[var(--mainColor)]">
                        <i className="pi pi-info-circle text-[0.8125rem]"></i>
                        {translations.aboutCourse}
                        <i className="pi pi-chevron-down text-[0.625rem] transition-transform group-open:rotate-180"></i>
                    </summary>
                    <div className="mt-[10px] flex flex-col sm:flex-row gap-[12px]">
                        {courseInfo?.image && <img src={courseInfo.image} alt={courseTitle || ''} className="w-full sm:w-[200px] max-h-[160px] object-cover rounded-[12px]" />}
                        {courseDescription && <p className="m-0 text-[0.875rem] text-[var(--bodyColor)] break-words">{courseDescription}</p>}
                    </div>
                </details>
            )}

            {lessonSteps.length > 0 && (
                <div className="flex flex-col gap-[8px]">
                    <div className="flex items-center justify-between gap-[8px] text-[0.75rem]">
                        <span className="font-semibold uppercase tracking-[0.04em] text-[var(--text-color-secondary)]">
                            {stepNavigation?.currentStepPos ? `${translations.step} ${stepNavigation.currentStepPos} ${translations.from.toLowerCase()} ${stepNavigation.stepsLength}` : translations.step}
                        </span>
                        <span className="inline-flex items-center gap-[4px] font-semibold text-[var(--greenColor)]">
                            <i className="pi pi-check-circle text-[0.75rem]"></i>
                            {doneCount}/{lessonSteps.length}
                        </span>
                    </div>
                    <div className="h-[4px] rounded-full bg-[#eef2f6] overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--greenColor)] transition-[width] duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                    <div ref={stepperRef} className="flex gap-[6px] overflow-x-auto pb-[4px] scrollbar-thin">
                        {lessonSteps.map((s, i) => {
                            const current = s.id === Number(id);
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    data-current={current}
                                    title={s.type?.title}
                                    aria-current={current ? 'step' : undefined}
                                    onClick={() => !current && router.push(stepUrl(s.id))}
                                    className={`shrink-0 flex items-center gap-[6px] h-[38px] px-[12px] rounded-[10px] border text-[0.8125rem] font-semibold transition-colors ${
                                        current
                                            ? 'bg-[var(--mainColor)] border-[var(--mainColor)] text-white cursor-default'
                                            : s.done
                                            ? 'bg-[#effaf0] border-[#cdeccd] text-[var(--greenColor)] hover:border-[var(--greenColor)]'
                                            : 'bg-white border-[#e5e7eb] text-[var(--bodyColor)] hover:border-[var(--mainColor)] hover:text-[var(--mainColor)]'
                                    }`}
                                >
                                    {s.type?.logo && <i className={`${s.type.logo} text-[0.875rem]`}></i>}
                                    <span>{i + 1}</span>
                                    {s.done && <i className="pi pi-check text-[0.625rem]"></i>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    // ---------- нижняя навигация: шаги, а на краях темы ----------
    const navBtnBase = 'flex items-center gap-[8px] h-[48px] px-[12px] sm:px-[16px] rounded-[12px] text-[0.875rem] font-semibold transition-colors min-w-0';
    const navSecondary = `${navBtnBase} border border-[#e5e7eb] bg-white text-[var(--titleColor)] hover:border-[var(--mainColor)] hover:text-[var(--mainColor)]`;
    const navPrimary = `${navBtnBase} bg-[var(--mainColor)] text-white hover:opacity-90`;
    const navDisabled = 'opacity-50 pointer-events-none';

    const themeBtnLabel = (label: string, title: string, align: 'start' | 'end') => (
        <span className={`flex flex-col min-w-0 leading-tight ${align === 'end' ? 'items-end text-right' : 'items-start text-left'}`}>
            <span className="text-[0.6875rem] font-medium opacity-80">{label}</span>
            <span className="text-[0.8125rem] truncate max-w-full">{title}</span>
        </span>
    );

    const bottomNav = (
        <div className="sticky bottom-0 z-[5] pb-[env(safe-area-inset-bottom)]">
            <div className={`${facultyCardClass} shadow-[0_-6px_20px_-12px_rgba(15,23,42,0.35)] p-[8px] sm:p-[10px] flex items-center gap-[8px]`}>
                <div className="flex-1 flex justify-start min-w-0">
                    {stepNavigation?.prevStep ? (
                        <button type="button" onClick={() => router.push(stepUrl(stepNavigation.prevStep.id))} className={navSecondary}>
                            <i className="pi pi-arrow-left text-[0.8125rem] shrink-0"></i>
                            <span>{translations.back}</span>
                        </button>
                    ) : prevLesson?.title ? (
                        <button
                            type="button"
                            onClick={() => handleLessonRouterPush(prevLesson?.id, Number(stream_id))}
                            className={`${navSecondary} max-w-full ${!prevLesson?.active ? navDisabled : ''}`}
                            title={prevLesson.title}
                        >
                            <i className={`${prevLesson?.active ? 'pi pi-angle-double-left' : 'pi pi-lock'} text-[0.8125rem] shrink-0`}></i>
                            {themeBtnLabel(translations.prevTheme, prevLesson.title, 'start')}
                        </button>
                    ) : null}
                </div>

                <div className="flex-1 flex justify-end min-w-0">
                    {stepNavigation?.nextStep ? (
                        <button type="button" onClick={() => router.push(stepUrl(stepNavigation.nextStep.id))} className={navPrimary}>
                            <span>{translations.next}</span>
                            <i className="pi pi-arrow-right text-[0.8125rem] shrink-0"></i>
                        </button>
                    ) : nextLesson?.title ? (
                        <button
                            type="button"
                            onClick={() => handleLessonRouterPush(nextLesson?.id, Number(stream_id))}
                            className={`${navPrimary} max-w-full ${!nextLesson?.active ? navDisabled : ''}`}
                            title={nextLesson?.active ? nextLesson.title : translations.themeLocked}
                        >
                            {themeBtnLabel(nextLesson?.active ? translations.nextTheme : translations.themeLocked, nextLesson.title, 'end')}
                            <i className={`${nextLesson?.active ? 'pi pi-angle-double-right' : 'pi pi-lock'} text-[0.8125rem] shrink-0`}></i>
                        </button>
                    ) : (
                        <Link href={backHref} className={navSecondary}>
                            <i className="pi pi-list text-[0.8125rem] shrink-0"></i>
                            <span className="truncate">{translations.backToThemes}</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    if (mainProgressSpinner)
        return (
            <div className="main-bg flex justify-center items-center h-[100vh]">
                <ProgressSpinner style={{ width: '60px', height: '60px' }} />
            </div>
        );

    return (
        <div className="w-full min-h-[calc(100vh-9rem)] flex flex-col gap-[12px] sm:gap-[16px]">
            {headerSection}

            {/* main */}
            <div className="flex-1 flex flex-col">
                {hasSteps ? (
                    <FacultyEmpty icon="pi pi-inbox" text={translations.noData} />
                ) : !steps ? (
                    <GroupSkeleton count={1} size={{ width: '100%', height: '16rem' }} />
                ) : (
                    <>
                        {type === 'document' && docSection}
                        {type === 'link' && linkSection}
                        {type === 'practical' && practicaSection}
                        {type === 'test' && testSection}
                        {type === 'video' && videoSection}
                    </>
                )}
            </div>

            {bottomNav}
        </div>
    );
}
