'use client';

import { NotFound } from '@/app/components/NotFound';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { statusView } from '@/services/notifications';
import { fetchItemsLessons, fetchStudentSteps, fetchSubjects, stepPractica, stepTest } from '@/services/studentMain';
import { docValueType } from '@/types/docValueType';
import { lessonType } from '@/types/lessonType';
import { mainStepsType } from '@/types/mainStepType';
import { useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';
import { fetchActiveStepsDetail } from '@/services/openCourse';

export default function ActiveLessonDetail() {
    // types
    interface subjectType {
        id_curricula: number;
        course_ids: number[];
        streams: number[];
    }

    const { course_id, lesson_id, step_id } = useParams();
    const params = new URLSearchParams();

    const media = useMediaQuery('(max-width: 640px)');
    const showError = useErrorMessage();
    const { setMessage, setContextNewStudentThemes, contextNotificationId, setContextNotificationId } = useContext(LayoutContext);

    const [steps, setSteps] = useState<mainStepsType | null>(null);
    const [hasSteps, setHasSteps] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [type, setType] = useState('');
    const [practica, setPractica] = useState<{
        content?: { document: string; document_path: string; description: string | null; title: string; link: string; url: string; content: string; answers: [{ text: string; is_correct: boolean; id: number | null }]; score: number };
    } | null>(null);
    const [test, setTests] = useState<mainStepsType | null>(null);
    const [answer, setAnswer] = useState<{ id: number | null; text: string; is_correct: boolean }[] | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState(false);
    const [answerCheck, setAnswerCheck] = useState(false);
    const [lessons, setLessons] = useState<Record<number, { semester: { name_kg: string } } | predmetType>>({
        1: { semester: { name_kg: '' } }
    });
    const [lessonName, setLessonName] = useState('');
    const [courseInfo, setCoursesInfo] = useState<{ title: string; description: string; image: string } | null>(null);
    const [main_id, setMain_id] = useState<predmetType | null>(null);
    const [skeleton, setSkeleton] = useState(false);
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

    // document
    const [document, setDocument] = useState<mainStepsType | null>(null);

    // link
    const [link, setLink] = useState<mainStepsType | null>(null);

    // video
    const [video, setVideo] = useState<mainStepsType | null>(null);
    const [preview, setPreview] = useState(false);
    const [videoLink, setVideoLink] = useState('');

    // fetch lessons

    const handleSteps = async () => {
        setSkeleton(true);
        const data = await fetchActiveStepsDetail(course_id ? Number(course_id) : null, step_id ? Number(step_id) : null);
        console.log(data);

        if (data?.success) {
            setHasSteps(false);
            // if (data?.courses?.length < 1) {
            //     setEmptyCourse(true);
            // } else {
            //     setEmptyCourse(false);
            // }
            setSteps(data?.step);
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

    // const handleStatusView = async (notification_id: number | null) => {
    //     console.log(notification_id);
    //     if (notification_id) {
    //         const data = await statusView(Number(notification_id));
    //         console.log(data);

    //         setContextNotificationId(null);
    //     }
    // };

    // const handleStep = async () => {
    //     const data = await fetchStudentSteps(Number(id), Number(stream_id));
    //     if (data?.success) {
    //         if (!data?.step?.content || data?.step?.content == null) {
    //             setHasSteps(true);
    //         } else {
    //             setHasSteps(false);
    //             setMainSteps(data.step);
    //         }
    //     } else {
    //         setHasSteps(true);
    //     }
    // };

    // Запрос курса, типа уроков (лк,лб)
    // const handleFetchSubject = async (subject: subjectType) => {
    //     params.append('id_curricula', String(subject.id_curricula));
    //     subject.streams.forEach((i) => params.append('streams[]', String(i)));
    //     subject.course_ids.forEach((i) => params.append('course_ids[]', String(i)));

    //     const data = await fetchSubjects(params);
    //     // console.log(data);

    //     if (data) {
    //         setCourses(data);
    //         // setHasThemes(false);
    //     } else {
    //         // setHasThemes(true);
    //         setMessage({
    //             state: true,
    //             value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
    //         });
    //         if (data?.response?.status) {
    //             showError(data.response.status);
    //         }
    //     }
    // };

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
        const data = await stepTest(steps && steps?.id, steps?.connections?.id_stream, (isCorrect && isCorrect[0]?.id) || null);

        if (data?.success) {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'success', summary: '', detail: data?.message }
            });
            handleSteps();
        } else {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при отправке ответа!', detail: '' }
            });
            handleSteps();
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
        const data = await stepPractica(steps && steps?.id, steps?.connections?.id_stream, docValue.file);
        if (data?.success) {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'success', summary: '', detail: data?.message }
            });
            handleSteps();
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
            setType(steps?.type.name);
            setTests(steps);
            setAnswer(steps?.content?.answers || []);
        } else if (steps?.type.name === 'video') {
            setType(steps?.type.name);
            setVideo(steps);
        }
    }, [steps]);

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
        handleSteps();
    }, []);

    const docSection = (
        <div className="flex flex-col gap-2">
            <div className="p-2 mt-2 mb-4 w-full flex flex-col gap-3 items-center">
                <div className="w-full flex gap-1 items-center mb-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                    <span className="sm:text-[18px]">{steps?.type?.title}</span>
                    <i className={`${steps?.type?.logo} text-2xl`}></i>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <b className="text-[16px] sm:text-[18px] break-words">{document?.content?.title}</b>
                    {document?.content?.description && <div className="flex flex-col gap-2 ">{document?.content?.description && <div className="lesson-card-border shadow rounded p-2 sm:w-full md:w-[70%]">{document?.content?.description}</div>}</div>}
                </div>
                <div className="w-full flex gap-2 items-center">
                    {/* <Link href={`/pdf/${document?.content?.document}`}>
                        <Button icon="pi pi-eye" label="Открыть документ" className="px-2 mini-button" />
                    </Link> */}
                    <span>Открыть отдельно</span>
                    {document?.content?.document_path && (
                        <a href={document?.content?.document_path} download target="_blank" rel="noopener noreferrer">
                            {' '}
                            <Button icon="pi pi-file-arrow-up" className="mini-button" />
                        </a>
                    )}
                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                </div>
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
                    {link?.content?.description && <div className="flex flex-col gap-2">{link?.content?.description && <div className="lesson-card-border shadow rounded p-2 sm:w-full md:w-[70%]">{link?.content?.description}</div>}</div>}
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

                <div className="lesson-card-border shadow rounded p-2">
                    {practica?.content?.description && <div className="p-2 sm:w-full md:w-[70%]" dangerouslySetInnerHTML={{ __html: practica?.content?.description }} />}

                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-1">
                            {practica?.content?.document_path && practica?.content.document_path.toLowerCase().includes('pdf') && (
                                <>
                                    <span className="text-[var(--mainColor)]">Документ: </span>
                                    <a className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[var(--mainColor)] p-1 rounded`} href={practica?.content.document_path} download target="_blank" rel="noopener noreferrer"></a>
                                </>
                            )}
                        </div>

                        <div>
                            {practica?.content?.url && (
                                <div className="flex gap-2 flex-col sm:flex-row">
                                    <span className="text-[var(--mainColor)]">Ссылка: </span>
                                    {practica?.content.url && (
                                        <a href={practica?.content.url} className="max-w-[800px] overflow-x-auto text-[12px] sm:text-sm text-wrap break-all" target="_blank">
                                            {practica?.content.url}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* <div>
                <span className="pi pi-envelope text-lg mb-1 text-[var(--mainColor)] shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] pb-1"> Сообщения от преподавателя</span>

                <ul className="pl-2 w-[95%]">
                    <li className="list-disc ml-[15px] text-sm break-words">Loremipsumdolorsitametconsecteturadipisicingelit. Mollitia, illum.</li>
                    <li className="list-disc ml-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, illum.</li>
                </ul>
            </div> */}

            {steps?.chills ? (
                <span className="pi pi-check-circle text-xl mb-1 text-[var(--greenColor)]"> Задание выполнено</span>
            ) : (
                <div className="flex flex-col gap-2 items-start w-full mt-2">
                    <span className="pi pi-check-circle text-lg mb-1 text-[var(--mainColor)] shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] pb-1"> Задание после изучения материала, загрузи свой файл с решением.</span>
                    <div className="w-full mt-2">
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
                            size="small"
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
        <div className="w-full relative flex flex-col justify-center gap-2 my-2">
            {progressSpinner && (
                <div className="z-10 absolute top-0 bottom-0 bg-[rgba(0,0,0,99%)] opacity-50 w-full flex justify-center items-center">
                    <ProgressSpinner style={{ width: '60px', height: '60px' }} />
                </div>
            )}
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
                                                <span className={`radio-mark  min-w-[18px] ${steps?.count_attempt && steps?.count_attempt >= 3 ? 'opacity-50' : ''}`}></span>
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
                                                    className="bg-[var(--greenBgColor)] none"
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
                        size="small"
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
                <div className="w-full flex gap-1 items-center mb-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                    <span className="sm:text-[18px]">{steps?.type?.title}</span>
                    <i className={`${steps?.type?.logo} text-2xl`}></i>
                </div>
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
                        <div className="sm:w-1/2 flex flex-col gap-2 items-center">
                            <h1 className="m-0" style={{ color: 'white', fontSize: media ? '24px' : '28px', textAlign: 'center', margin: '0' }}>
                                {courseInfo?.title}
                            </h1>
                            <div className="flex items-center justify-end gap-1 flex-col sm:flex-row mt-2">
                                <h3 className="text-white m-0 sm:text-lg">Тема: </h3>
                                <h3 className="text-white text-[16px] m-0 sm:text-[18px]">{lessonName ? lessonName : '------'}</h3>
                            </div>
                            <span className="w-[90%] break-words text-center">{courseInfo?.description} </span>
                        </div>
                        {courseInfo?.image && courseInfo?.image.length > 0 && (
                            <div className="sm:w-1/3">
                                <img src={courseInfo?.image} />
                            </div>
                        )}
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
