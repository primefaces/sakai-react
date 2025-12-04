'use client';

import { NotFound } from '@/app/components/NotFound';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsLessons, fetchMainLesson, fetchStudentSteps, fetchSubjects, stepPractica, stepTest } from '@/services/studentMain';
import { docValueType } from '@/types/docValueType';
import { lessonType } from '@/types/lessonType';
import { mainStepsType } from '@/types/mainStepType';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';

export default function AnotherLesson() {
    // types
    interface subjectType {
        id_curricula: number;
        course_ids: number[];
        streams: number[];
    }

    const { lesson_id, subject_id, stream_id, id } = useParams();
    const params = new URLSearchParams();
    const media = useMediaQuery('(max-width: 640px)');
    const showError = useErrorMessage();
    const { setMessage, setContextNewStudentThemes } = useContext(LayoutContext);

    const [steps, setMainSteps] = useState<mainStepsType | null>(null);
    const [hasSteps, setHasSteps] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [type, setType] = useState('');
    const [practica, setPractica] = useState<{
        content?: { document: string; document_path: string; description: string | null; title: string; link: string; url: string; content: string; answers: [{ text: string; is_correct: boolean; id: number | null }]; score: number };
    } | null>(null);
    const [test, setTests] = useState<mainStepsType | null>(null);
    const [answer, setAnswer] = useState<{ id: number | null; text: string; is_correct: boolean }[]>([
        { text: '', is_correct: false, id: null },
        { text: '', is_correct: false, id: null }
    ]);
    const [selectedAnswer, setSelectedAnswer] = useState(false);
    const [answerCheck, setAnswerCheck] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [hasLessons, setHasLessons] = useState(false);
    const [lessons, setLessons] = useState<Record<number, { semester: { name_kg: string } } | predmetType>>({
        1: { semester: { name_kg: '' } }
    });
    const [mainLesson, setMainLesson] = useState<lessonType | null>(null);
    const [lessonName, setLessonName] = useState('');
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
    const [idStream, setIdStream] = useState<number | null>(null);

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
        const data = await fetchItemsLessons();

        setSkeleton(true);
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

    // const handleStep = async () => {
    //     const data = await fetchStudentSteps(Number(id), Number(stream_id));
    //     console.log(data);

    //     if (data.success) {
    //         setHasSteps(false);
    //         setMainSteps(data.step);
    //     } else {
    //         setHasSteps(true);
    //     }
    // };

    // Запрос курса, типа уроков (лк,лб)
    const handleFetchSubject = async (subject: subjectType) => {
        params.append('id_curricula', String(subject.id_curricula));
        subject.streams.forEach((i) => params.append('streams[]', String(i)));
        subject.course_ids.forEach((i) => params.append('course_ids[]', String(i)));

        const data = await fetchSubjects(params);
        setSkeleton(true);
        if (data) {
            setCourses(data);
            // setHasThemes(false);
            setSkeleton(false);
        } else {
            // setHasThemes(true);
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

    const handleVideoCall = (value: string | null) => {
        setPreview(true);

        if (!value) {
            setPreview(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при воспроизведении видео', detail: '' }
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
                value: { severity: 'error', summary: 'Ошибка при воспроизведении видео', detail: '' }
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
        const data = await stepTest(steps && steps?.id, idStream, (isCorrect && isCorrect[0]?.id) || null);

        if (data?.success) {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'success', summary: '', detail: data?.message }
            });
            forMainLesson();
        } else {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при отправке ответа!', detail: '' }
            });
            forMainLesson();
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

    const handleAddPractica = async () => {
        setProgressSpinner(true);
        const data = await stepPractica(steps && steps?.id, idStream, docValue.file);

        if (data?.success) {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'success', summary: '', detail: data?.message }
            });
            forMainLesson();
        } else {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при отправке документа!', detail: '' }
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

    const handleStep = async (id: number, stream_id: number) => {
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

    // альтернатива handleStep()
    const handleMainLesson = async (lesson_id: number, stream_id: number) => {
        const data: { step: { content: any } } = await fetchMainLesson(lesson_id, stream_id);

        if (data && Array.isArray(data)) {
            const forSteps = data.filter((item) => item?.content);
            if (forSteps && forSteps?.length > 0) {
                setHasSteps(false);
                // setMainSteps(forSteps[0]);
                if (stream_id && forSteps[0] && forSteps[0]?.id) {
                    handleStep(forSteps[0]?.id, stream_id);
                }
            } else {
                setHasSteps(true);
            }
        } else {
            setHasSteps(true);
        }
    };

    const forMainLesson = () => {
        if (mainLesson) {
            const course = courses.find((c) => c.id === mainLesson?.course_id);
            const stream = course?.connections[0];
            if (stream?.id_stream) {
                setIdStream(stream.id_stream);
                handleMainLesson(mainLesson?.id, stream.id_stream);
            }
        }
    };

    useEffect(() => {
        console.log('Step ', steps);

        // const lesson = steps.find((item) => item.id === Number(id));
        // console.log(lesson, lesson?.type);
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
            setAnswer(steps?.content?.answers || []);
            setType(steps?.type.name);
            setTests(steps);
        } else if (steps?.type.name === 'video') {
            setType(steps?.type.name);
            setVideo(steps);
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
        if (mainLesson) {
            forMainLesson();
        }
    }, [mainLesson]);

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
                        setMainLesson(j);
                    }
                    return j?.id === Number(lesson_id);
                });
            });
            if (forLesson && forLesson?.lessons) {
                setContextNewStudentThemes(forLesson?.lessons);
            }
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
        handleFetchLessons();
        // handleStep();
    }, []);

    const hasPdf = /pdf/i.test(document?.content?.document || ''); // true

    const docSection = (
        <div className="p-2 mt-2 mb-4 w-full flex flex-col gap-3 items-center">
            <div className="w-full flex gap-1 items-center mb-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                <span className="sm:text-[18px]">{steps?.type?.title}</span>
                <i className={`${steps?.type?.logo} text-2xl`}></i>
            </div>
            <div className="w-full flex flex-col gap-1">
                <b className="text-[16px] sm:text-[18px] break-words">{document?.content?.title}</b>
                {document?.content?.description && <div className="flex flex-col gap-2">{document?.content?.description && <div className="lesson-card-border shadow rounded p-2 sm:w-full md:w-[70%]">{document?.content?.description}</div>}</div>}
            </div>
            <div className="w-full flex gap-2">
                <Link href={`/pdf/${document?.content?.document}`}>
                    <Button icon="pi pi-eye" label="Открыть документ" className="px-2 mini-button" />
                </Link>
                {document?.content?.document_path && (
                    <a href={document?.content?.document_path} download target="_blank" rel="noopener noreferrer">
                        {' '}
                        <Button icon="pi pi-file-arrow-up" className="mini-button" />
                    </a>
                )}
                {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
            </div>
        </div>
    );

    const linkSection = (
        <div className="p-2 mt-2 mb-4">
            <div className="flex flex-col w-full gap-3">
                <div className="w-full flex gap-1 items-center mb-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                    <span className="sm:text-[18px]">{steps?.type?.title}</span>
                    <i className={`${steps?.type?.logo} text-2xl`}></i>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <b className="text-[16px] sm:text-[18px] break-words">{link?.content?.title}</b>
                    {link?.content?.description && (
                        <div className="flex flex-col gap-2">{link?.content?.description && <div className="lesson-card-border bg-[#ddc4f51a] shadow rounded p-2 sm:w-full md:w-[70%]">{link?.content?.description}</div>}</div>
                    )}
                </div>
                <div className="flex gap-1 items-start flex-col sm:flex-row">
                    <span className="text-[var(--mainColor)]">Ссылка: </span>
                    <a href={link ? String(link?.content?.url) : '#'} className="max-w-[800px] text-[16px] break-words hover:underline" target="_blank">
                        {link?.content?.url}
                    </a>
                </div>
            </div>
        </div>
    );

    const practicaSection = (
        <div className="p-2 mt-2 mb-4 flex flex-col gap-3">
            <div className="flex justify-between gap-1 items-center flex-col sm:flex-row shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                <div className="flex gap-1 items-center">
                    <span className="sm:text-[18px]">{steps?.type?.title}</span>
                    <i className={`${steps?.type?.logo} text-2xl`}></i>
                </div>
                <div className="flex items-center gap-1 my-2">
                    <span className="text-[var(--mainColor)]">Балл за задание: </span>
                    <b className="text-[16px] sm:text-[18px] ">{`${steps?.score}`}</b>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <b className="text-[16px] sm:text-[18px] break-words">{practica?.content?.title}</b>
                {practica?.content?.description && <div className="lesson-card-border shadow rounded p-2 sm:w-full md:w-[70%]" dangerouslySetInnerHTML={{ __html: practica?.content?.description }} />}
            </div>

            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-1">
                    {practica?.content?.document_path && practica?.content.document_path.toLowerCase().includes('pdf') && (
                        <>
                            <span className="text-[var(--mainColor)]">Документ: </span>
                            <a className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[var(--mainColor)] p-1 rounded`} href={practica?.content.document_path} download target="_blank" rel="noopener noreferrer"></a>
                        </>
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    {practica?.content?.url && (
                        <>
                            <span className="text-[var(--mainColor)]">Ссылка: </span>
                            {practica?.content.url && (
                                <a href={practica?.content.url} className="max-w-[800px] break-words" target="_blank">
                                    {practica?.content.url}
                                </a>
                            )}
                        </>
                    )}
                </div>
            </div>
            {steps?.chills ? (
                <span className="pi pi-check-circle text-xl mb-1 text-[var(--greenColor)]"> Задание выполнено</span>
            ) : (
                <div className="flex flex-col gap-2 items-start w-full mt-2">
                    <span className="pi pi-check-circle sm:text-lg mb-1 text-[var(--mainColor)] shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] pb-1"> Задание после изучения материала, загрузи свой файл с решением.</span>
                    <div className="w-full">
                        <input
                            type="file"
                            accept="application/pdf"
                            className="border rounded p-1 max-w-[90%]"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const maxSize = 10 * 1024 * 1024;

                                    if (file.size > maxSize) {
                                        setMessage({
                                            state: true,
                                            value: { severity: 'error', summary: 'Файл слишком большой!', detail: 'Разрешено максимум 10 MB.' }
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
                    </div>
                    <div className="w-full">
                        {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                        <Button
                            label="Отправить"
                            disabled={progressSpinner}
                            className={`${progressSpinner ? 'opacity-50' : ''}`}
                            onClick={() => {
                                handleAddPractica();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const testSection = (
        <div className="w-full flex flex-col justify-center gap-2 my-2">
            <div className="lesson-card-border shadow rounded p-2">
                <div className="flex justify-between gap-1 items-center flex-col sm:flex-row shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                    <div className="flex gap-1 items-center">
                        <span className="sm:text-[18px]">{steps?.type?.title}</span>
                        <i className={`${steps?.type?.logo} text-2xl`}></i>
                    </div>
                    <div className="flex items-center gap-1 my-2">
                        <span className="text-[var(--mainColor)]">Балл за задание: </span>
                        <b className="text-[16px] sm:text-[18px] ">{`${steps?.score}`}</b>
                    </div>
                </div>
                <div className="flex flex-col gap-2 p-1 sm:p-2">
                    <b className="sm:text-[18px]">{test?.content?.content}</b>
                    <div className="w-full flex flex-col justify-start items-start gap-2">
                        {test?.content?.answers.map((item, index) => {
                            return (
                                <div className="w-full flex items-center" key={index}>
                                    {selectedAnswer ? (
                                        <>
                                            <label className="custom-radio border border-[var(--borderBottomColor)] p-2">
                                                <input
                                                    type="radio"
                                                    name="testRadio"
                                                    checked={item.id == test?.answer_id}
                                                    disabled={steps?.count_attempt ? steps?.count_attempt >= 3 : false}
                                                    onChange={() => {
                                                        setSelectedAnswer(false);
                                                        setAnswer((prev) => prev && prev.map((ans, i) => (i === index ? { ...ans, is_correct: true } : { ...ans, is_correct: false })));
                                                    }}
                                                />
                                                <span className={`radio-mark min-w-[18px] ${steps?.count_attempt && steps?.count_attempt >= 3 ? 'opacity-50' : ''}`}></span>
                                            </label>
                                            <div className="bg-gray border border-[var(--borderBottomColor)] py-[5px] pl-1 w-full">{item.text}</div>
                                        </>
                                    ) : (
                                        <>
                                            <label className="custom-radio border border-[var(--borderBottomColor)] p-2">
                                                <input
                                                    type="radio"
                                                    name="testRadio"
                                                    disabled={steps?.count_attempt ? steps?.count_attempt >= 3 : false}
                                                    onChange={() => {
                                                        setAnswer((prev) => prev && prev.map((ans, i) => (i === index ? { ...ans, is_correct: true } : { ...ans, is_correct: false })));
                                                    }}
                                                />
                                                <span className={`radio-mark min-w-[18px] ${steps?.count_attempt && steps?.count_attempt >= 3 ? 'opacity-50' : ''}`}></span>
                                            </label>
                                            <div className="bg-gray border border-[var(--borderBottomColor)] py-[5px] pl-1 w-full">{item.text}</div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {steps?.count_attempt && steps?.count_attempt >= 3 ? (
                <span className="pi pi-check-circle text-xl mb-1 text-[var(--greenColor)]"> Задание выполнено</span>
            ) : (
                <div className="w-full">
                    <Button
                        label="Отправить"
                        disabled={progressSpinner || !answer || !answerCheck}
                        onClick={() => {
                            handleAddTest();
                        }}
                    />
                </div>
            )}
        </div>
    );

    const videoSection = (
        <div className="lesson-card-border shadow rounded p-2 mt-2">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    {video?.content?.description && (
                        <div className="w-full flex flex-col gap-1">
                            <b className="text-[16px] sm:text-[18px] text-wrap break-words">{video?.content?.title}</b>
                            {video?.content?.description && <div className="flex flex-col gap-2">{video?.content?.description && <div className="lesson-card-border shadow rounded p-2 sm:w-full md:w-[70%]">{video?.content?.description}</div>}</div>}
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                    {preview ? (
                        <div className="relative bg-white shadow w-full max-h-[400px] overflow-hidden rounded-2xl">
                            <div className="w-full h-[100%] absolute flex justify-center items-center bg-[rgba(8,9,0,70%)]">
                                <ProgressSpinner className="max-w-[70px] sm:max-w-[100px]" />
                            </div>
                            <img src={video?.content?.cover_url || '/layout/images/no-image.png'} className="w-full sm:w-[200px] max-h-[400px] object-cover" alt="Видео" />
                        </div>
                    ) : (
                        <iframe
                            className="w-full h-[200px] md:h-[400px]"
                            // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            src={videoLink}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="main-bg min-h-[100vh]">
            <div className={`w-full bg-[var(--titleColor)] relative text-white p-4 md:p-3 pb-4`}>
                <div className="flex flex-col gap-2 items-center">
                    <div className={`w-full flex items-center gap-2 ${courseInfo?.image && courseInfo?.image.length > 0 ? 'justify-around flex-col sm:flex-row' : 'justify-center'} items-center`}>
                        <h1 className="sm:w-1/2" style={{ color: 'white', fontSize: media ? '24px' : '28px', textAlign: 'center', margin: '0' }}>
                            {courseInfo?.title}
                        </h1>
                        {courseInfo?.image && courseInfo?.image.length > 0 && (
                            <div className="sm:w-1/2">
                                {' '}
                                <img src={courseInfo?.image} />
                            </div>
                        )}
                    </div>
                    <span className="w-[90%] break-words text-center">{courseInfo?.description} </span>
                    <div className="flex items-center justify-end gap-1 flex-col sm:flex-row mt-2">
                        <b className="text-white sm:text-lg">Тема: </b>
                        <b className="text-[16px] sm:text-[18px]">{lessonName ? lessonName : '------'}</b>
                    </div>
                </div>
            </div>

            {hasSteps && <NotFound titleMessage="Данные не доступны" />}
            {type === 'document' && docSection}
            {type === 'link' && linkSection}
            {type === 'practical' && practicaSection}
            {type === 'test' && testSection}
            {type === 'video' && videoSection}
        </div>
    );
}
