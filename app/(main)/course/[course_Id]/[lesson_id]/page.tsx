'use client';

import LessonDocument from '@/app/components/lessons/LessonDocument';
import LessonForum from '@/app/components/lessons/LessonForum';
import LessonLink from '@/app/components/lessons/LessonLink';
import LessonPractica from '@/app/components/lessons/LessonPractica';
import LessonTest from '@/app/components/lessons/LessonTest';
import LessonVideo from '@/app/components/lessons/LessonVideo';
import MyDateTime from '@/app/components/MyDateTime';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchCourseInfo, fetchLessonShow } from '@/services/courses';
import { addLesson, deleteStep, fetchElement, fetchSteps, fetchTypes } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useContext, useEffect, useRef, useState } from 'react';

export default function LessonStep() {
    const param = useParams();
    const course_id = param.course_Id;
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const prevLessonsRef = useRef<Array<{ id: number; title: string }> | null>(null);
    const prevStepsRef = useRef<mainStepsType[]>([]);

    const [courseInfo, setCourseInfo] = useState<{ title: string } | null>(null);
    const [lessonInfoState, setLessonInfoState] = useState<{ title: string; documents_count: string; usefullinks_count: string; videos_count: string } | null>(null);
    const media = useMediaQuery('(max-width: 640px)');
    const { user, setMessage, contextFetchThemes, contextThemes, deleteQuery } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [formVisible, setFormVisible] = useState(false);
    const [types, setTypes] = useState<{ id: number; title: string; name: string; logo: string }[]>([]);
    const [steps, setSteps] = useState<mainStepsType[]>([]);
    const [element, setElement] = useState<{ content: any | null; step: mainStepsType } | null>(null);
    const [selectedId, setSelectId] = useState<number | null>(null);
    const [hasSteps, setHasSteps] = useState(false);
    const [themeNull, setThemeNull] = useState(false);
    const [lesson_id, setLesson_id] = useState<number | null>(null);
    const [sequence_number, setSequence_number] = useState<number | null>(null);
    const [skeleton, setSkeleton] = useState(false);
    const [wasCreated, setWasCreated] = useState(false);
    const [lastStep, setLastStep] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | string>('');
    const [toggleDragSteps, setToggleDragSteps] = useState<boolean>(false);
    const [toggleDocGenerate, setToggleDocGenerate] = useState<boolean>(false);
    const [documentSteps, setDocumentSteps] = useState<mainStepsType[]>([]);

    const changeUrl = (lessonId: number | null) => {
        router.replace(`/course/${course_id}/${lessonId ? lessonId : null}`);
    };

    const handleCourseInfo = async () => {
        setSkeleton(true);
        const data = await fetchCourseInfo(Number(course_id));

        if (data && data?.success) {
            setSkeleton(false);
            setCourseInfo(data.course);
        }
    };

    const handleShow = async (LessonId: number | null) => {
        setSkeleton(true);
        const data = await fetchLessonShow(LessonId);

        if (data?.lesson) {
            setSkeleton(false);
            setLessonInfoState({ title: data.lesson.title, videos_count: data.lesson.videos_count, usefullinks_count: data.lesson.usefullinks_count, documents_count: data.lesson.documents_count });
        } else {
            setSkeleton(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            // skeleton = false
        }
    };

    const handleFetchTypes = async () => {
        setFormVisible(true);
        setSkeleton(true);
        const data = await fetchTypes();
        if (data && Array.isArray(data)) {
            setTypes(data);
            setSkeleton(false);
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
    };

    const handleFetchSteps = async (lesson_id: number | null) => {
        setSkeleton(true);
        const data = await fetchSteps(Number(lesson_id));

        if (data.success) {
            setSkeleton(false);
            if (data.steps.length < 1) {
                setHasSteps(true);
            } else {
                setHasSteps(false);
                setSteps(data.steps);
            }
        } else {
            setSkeleton(false);
            setHasSteps(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleAddLesson = async (lessonId: number, typeId: number) => {
        setFormVisible(false);
        const forSequence_number = lastStep && lastStep > 0 ? (!sequence_number || sequence_number < 1 ? lastStep + 1 : sequence_number) : sequence_number;

        const data = await addLesson({ lesson_id: lessonId, type_id: typeId }, forSequence_number || 0);

        if (data.success) {
            setSequence_number(null);
            setWasCreated(true);
            handleFetchSteps(lessonId);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
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
    };

    const handleFetchElement = async (stepId: number) => {
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
                    value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
                });
                if (data?.response?.status) {
                    showError(data.response.status);
                }
            }
        }
    };

    const handleDeleteStep = async () => {
        const data = await deleteStep(Number(lesson_id), Number(selectedId));
        if (data.success) {
            contextFetchThemes(Number(course_id), null);
            handleFetchSteps(Number(lesson_id));
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно удалено!', detail: '' }
            });
            setSelectId(null);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при удалении!', detail: '' }
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

    // РАБОЧИЙ ВАРИАНТ
    // useEffect(() => {
    //     if (Array.isArray(steps) && steps.length > 0) {
    //         const stepId = wasCreated ? steps[steps.length - 1].id : steps[0].id;
    //         setSelectId(stepId);
    //         handleFetchElement(stepId);
    //         setWasCreated(false);
    //     }
    // }, [steps]);
    // РАБОЧИЙ ВАРИАНТ

    useEffect(() => {
        if (Array.isArray(steps) && steps.length > 0) {
            let max = 0;
            steps?.forEach((item) => {
                if (item.step > max) {
                    max = item.step;
                }
            });

            if (max) {
                setLastStep(max);
            }

            let stepId: number | null = null;

            if (wasCreated) {
                // находим шаг, которого не было в предыдущем массиве
                const prevIds = prevStepsRef.current.map((s) => s.id);
                const newStep = steps.find((s) => !prevIds.includes(s.id));

                if (newStep) {
                    stepId = newStep.id;
                } else {
                    stepId = steps[steps.length - 1].id; // fallback: берем последний
                }
            } else {
                if (selectedId) {
                    stepId = selectedId;
                } else {
                    stepId = steps[0].id; // если просто загрузка — берем первый
                }
            }

            if (stepId !== null) {
                setSelectId(stepId);
                handleFetchElement(stepId);
            }

            // сохраняем текущие steps для следующего сравнения
            prevStepsRef.current = steps;
            setWasCreated(false);
        }
    }, [steps]);

    useEffect(() => {
        handleCourseInfo();
        if (lesson_id) {
            handleShow(lesson_id);
            changeUrl(lesson_id);
        }
    }, [lesson_id]);

    useEffect(() => {
        contextFetchThemes(Number(course_id), null);
    }, [course_id]);

    // заменяем первый useEffect
    useEffect(() => {
        const lessons = contextThemes?.lessons?.data ?? [];

        // делаем "снимок" важных полей (id + title)
        const snapshot = lessons.map((l: any) => ({ id: l.id, title: l.title ?? '' }));
        const prev = prevLessonsRef.current;

        const isSameSnapshot = prev && prev.length === snapshot.length && prev.every((p, i) => p.id === snapshot[i].id && p.title === snapshot[i].title);

        // обновляем ref для следующего раза
        prevLessonsRef.current = snapshot;

        // если ничего по-сути не поменялось — ничего не делаем
        if (isSameSnapshot) return;

        // дальше — твоя логика, но чуть упрощённая и аккуратная
        if (!lessons || lessons?.length < 1) {
            setLesson_id(null);
            setThemeNull(true);
            return;
        } else {
            setThemeNull(false);
        }

        let chosenId: number | null = null;
        if (param.lesson_id && param.lesson_id !== 'null') {
            const urlId = Number(param.lesson_id);
            const exists = lessons.some((l: { id: number }) => l.id === urlId);
            chosenId = exists ? urlId : lessons[0].id;
        } else {
            chosenId = lessons[0]?.id;
        }

        // если выбор изменился — setLesson_id вызовет второй useEffect и всё остальное произойдёт там
        if (lesson_id !== chosenId) {
            setLesson_id(chosenId);
        } else {
            // если lesson_id не поменялся, но изменился контент выбранной темы (например, title),
            // можно аккуратно обновить отображение (handleShow) — только если у нас реально поменялся title
            const prevSelected = prev?.find((p) => p.id === lesson_id);
            const currSelected = snapshot.find((p: { id: number }) => p.id === lesson_id);

            if (lesson_id && prevSelected && currSelected && prevSelected.title !== currSelected.title) {
                // вызываем только обновление показа — не трогаем fetchSteps, если id тот же
                handleShow(lesson_id);
            }
        }
    }, [contextThemes, deleteQuery, param.lesson_id /* оставил твои зависимости */]);

    useEffect(() => {
        if (lesson_id && param.lesson_id !== String(lesson_id)) {
            changeUrl(lesson_id);
        }
        if (lesson_id) {
            handleFetchSteps(lesson_id);
            handleShow(lesson_id);
        }
    }, [lesson_id]);

    useEffect(() => {
        const element = scrollRef.current;
        if (element) {
            const handleWheelScroll = (event: any) => {
                // 1. Проверяем, что это вертикальный скролл (колесо мыши)
                if (event.deltaY !== 0) {
                    // 2. Отменяем стандартное вертикальное поведение прокрутки страницы
                    event.preventDefault();

                    // 3. Смещаем горизонтальную позицию (scrollLeft)
                    // на величину вертикального сдвига (event.deltaY)
                    element.scrollLeft += event.deltaY;
                }
            };

            // Добавляем слушатель события 'wheel'
            element.addEventListener('wheel', handleWheelScroll);

            // Функция очистки: удаляем слушатель при демонтировании компонента
            return () => {
                element.removeEventListener('wheel', handleWheelScroll);
            };
        }
    }, []);

    // ... остальная часть вашего компонента и JSX, где используется ref={scrollRef}

    const lessonInfo = (
        <div className="w-full">
            <div className="bg-[var(--titleColor)] relative flex flex-col justify-center items-center w-full text-white p-4 md:p-3 pb-4">
                {/* <h1 style={{ color: 'white', fontSize: media ? '24px' : '28px', textAlign: 'center' }} className="m-0 w-full break-words">
                    {courseInfo?.title}
                </h1> */}
                <h2 style={{ color: 'white', fontSize: media ? '22px' : '26px', textAlign: 'center' }} className="w-full break-words">
                    {lessonInfoState?.title}
                </h2>
                {media && contextThemes && contextThemes?.max_sum_score ? (
                    <div className="flex justify-center gap-1 items-center">
                        <span>Балл за курс</span>
                        <b className="font-semibold">{contextThemes?.max_sum_score}</b>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );

    const step = (item: mainStepsType, icon: string, step: number, idx: number) => {
        return (
            <div
                className="cursor-pointer flex flex-col items-center"
                onClick={() => {
                    if (toggleDragSteps) {
                        setDraggedId(item?.id);
                    } else {
                        setSelectId(step);
                        handleFetchElement(step);
                    }
                }}
            >
                <span className="flex gap-1 items-center">
                    <span className="text-[13px] sm:text-sm">{idx + 1} </span>
                    {item?.type?.name === 'practical' || item?.type?.name === 'test' ? (
                        <span title={`${item.score} балл`} className="text-[11px]">
                            ({item.score})
                        </span>
                    ) : (
                        ''
                    )}
                </span>

                <div className={`rounded ${step === selectedId ? 'activeStep' : 'step'} flex justify-center items-center`}>
                    <i className={`${icon} text-xl sm:text-2xl text-white stepElement`}></i>
                </div>
            </div>
        );
    };

    const handleDragStart = (id: number | string) => {
        console.log('Перетаскивается элемент с id:', id);
        // здесь можно, например, сохранить id в состояние
        setDraggedId(id);
    };

    const handlePreparation = (steps: mainStepsType[]) => {
        const forSteps = steps?.filter((item) => item?.type?.name === 'document' && item?.id_parent);
        if (forSteps && forSteps?.length > 0) {
            setToggleDragSteps(true);
            setDocumentSteps(forSteps);
            return true;
        } else {
            setToggleDragSteps(true);
            setDocumentSteps([]);
            return true;
        }
    };

    const Notificatoin = ({ notification }: { notification: any }) => {
        return (
            <div className={`flex flex-col justify-center p-2 gap-1`}>
                {notification?.length > 0 ? (
                    notification?.map((item: any) => {
                        let path = '';
                        if (user?.is_working && item?.type?.type === 'practical') {
                            path = `/students/${item?.meta?.course_id}/${item?.meta?.connect_id}/${item?.meta?.stream_id}/${item?.meta?.student_id}/${item?.meta?.lesson_id}/${item?.meta?.step_id}`;
                        } else if (user?.is_student && item?.type?.type === 'practical') {
                            path = `/teaching/lessonView/${item?.meta?.lesson_id}/${item?.meta?.id_curricula}/${item?.meta?.stream_id}/${item?.meta?.step_id}`;
                        }

                        return (
                            <div key={item?.id} className={`w-full flex flex-col justify-center shadow p-2 gap-1 sm:gap-2`}>
                                <div className="w-full flex justify-between">
                                    <Link className="cursor-pointer hover:underline" href={path}>
                                        <b className="text-[var(--mainColor)] text-[12px] sm:text-[14px]">{item?.type?.title}</b>
                                    </Link>
                                    <span className="text-sm w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-full bg-[var(--amberColor)]"></span>
                                </div>

                                {/* student message */}
                                {user?.is_student && item?.type?.type === 'practical' && (
                                    <b className="text-[13px] max-w-[350px] text-nowrap overflow-hidden text-ellipsis" title={item?.title}>
                                        {item?.title}
                                    </b>
                                )}
                                <p className="m-0 text-[11px] sm:text-[12px]">
                                    {item?.from_user?.last_name} {item?.from_user?.name}
                                </p>
                                <div className="w-full relative flex">
                                    <p className="absolute right-0 -top-3 text-[10px] sm:text-[12px] m-0">
                                        {/* <MyDateTime createdAt={item?.created_at} options={options} /> */}
                                        {/* '----' */}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center">Сообщений нет</p>
                )}
            </div>
        );
    };

    const [notificationGroup, setNotificationGroup] = useState({ state: false, type: '' });

    if (themeNull) {
        return (
            <div>
                <NotFound titleMessage="Темы отсутствуют" />
            </div>
        );
    }

    return (
        <div className="main-bg">
            {/* modal sectoin */}
            <Dialog
                header={'Выберите тип шага'}
                visible={formVisible}
                className="w-[90%] sm:w-[400px]"
                onHide={() => {
                    if (!formVisible) return;
                    setFormVisible(false);
                }}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col">
                        <span>Позиция:</span>
                        <InputText
                            type="number"
                            placeholder={lastStep ? String(lastStep + 1) : ''}
                            className="w-full p-1"
                            onChange={(e) => {
                                setSequence_number(Number(e.target.value));
                            }}
                        />
                    </div>
                    {skeleton ? (
                        <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                    ) : (
                        <div className="w-full flex flex-col mt-1">
                            {types.map((item) => {
                                // if(item?.name === 'forum'){
                                //     return null;
                                // }

                                return (
                                    <React.Fragment key={item?.id}>
                                        <div className="flex-1 py-2 px-2 shadow flex gap-1 items-center hover:text-[var(--mainColor)] transition-all">
                                            <i className={`${item?.logo}`}></i>
                                            <b
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    handleAddLesson(Number(lesson_id), item?.id);
                                                }}
                                            >
                                                {item.title}
                                            </b>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Dialog>

            {/* info section */}
            {lessonInfo}

            {/* steps section */}
            <div className="flex gap-2 mt-4 items-end">
                {hasSteps ? (
                    <div className="flex items-center gap-4">
                        <div onClick={handleFetchTypes} className="cursor-pointer w-[54px] h-[54px] sm:w-[54px] sm:h-[54px] rounded animate-step"></div>
                    </div>
                ) : (
                    <div className="flex items-center relative max-w-[550px] sm:max-w-[800px] overflow-x-auto scrollbar-thin">
                        {toggleDocGenerate ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col sm:flex-row gap-2 items-start">
                                    <b className="pi pi-times cursor-pointer sm:text-xl text-[var(--mainColor)]" onClick={() => {
                                        setToggleDocGenerate(false);
                                    }}></b>
                                    <div className="flex items-center gap-1">
                                        <b>Выберите свой документ в формате Word — из его содержания будет автоматически создан тест.</b>
                                    </div>
                                </div>
                            </div>
                        ) : toggleDragSteps ? (
                            <div className="flex flex-col gap-2 items-start">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center ">
                                        <b className="pi pi-times cursor-pointer sm:text-xl text-[var(--mainColor)]" onClick={() => setToggleDragSteps(false)}></b>
                                        <div className="flex items-center gap-1">
                                            <b className="">Тест генерируется искусственным интеллектом</b>
                                            <i className="pi pi-microchip-ai text-xl"></i>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-black">
                                            Варианты тестов будут более продуманными если передать ваш документ <span className="opacity-60 text-[13px]">(необязательно)</span>
                                        </span>
                                        {/* <span className="text-[13px]">Кол-о документов: {documentSteps?.length || 0}</span> */}
                                    </div>
                                </div>
                                {documentSteps?.length > 0 && (
                                    <div ref={scrollRef} className={`flex gap-2 max-w-[550px] sm:max-w-[800px] overflow-x-auto scrollbar-thin ${media ? (steps.length >= 6 ? 'right-shadow' : '') : steps.length >= 12 ? 'right-shadow' : ''}`}>
                                        {documentSteps?.map((item, idx) => {
                                            return (
                                                <div key={item.id}>
                                                    <div className="flex flex-col items-center" draggable onDragStart={() => handleDragStart(item.id)}>
                                                        {step(item, item.type.logo, item.id, idx)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div ref={scrollRef} className={`flex gap-2 max-w-[550px] sm:max-w-[800px] overflow-x-auto scrollbar-thin ${media ? (steps.length >= 6 ? 'right-shadow' : '') : steps.length >= 12 ? 'right-shadow' : ''}`}>
                                {steps.map((item, idx) => {
                                    return (
                                        <div key={item.id} className="flex flex-col items-center">
                                            {step(item, item.type.logo, item.id, idx)}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-1">
                    {skeleton ? (
                        <GroupSkeleton count={1} size={{ width: '47px', height: '3rem' }} />
                    ) : (
                        !toggleDragSteps &&
                        !toggleDocGenerate && (
                            <button
                                onClick={handleFetchTypes}
                                className={`stepElement pi pi-plus text-xl ${
                                    media ? steps?.length >= 6 && 'mb-1' : steps?.length >= 12 && 'mb-1'
                                } sm:text-2xl text-white cursor-pointer border rounded flex justify-center items-center bg-[var(--mainColor)] hover:bg-[var(--mainBorder)] transition`}
                            ></button>
                        )
                    )}
                </div>
            </div>

            {hasSteps && (
                <div>
                    <NotFound titleMessage="Шаги отсутствует" />
                </div>
            )}
            {element?.step.type.title && (
                <div className="shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] mt-3 pb-1 flex items-center flex-col sm:flex-row gap-1">
                    <span className="sm:text-[18px]">{element?.step.type.title}</span> -
                    <div>
                        (<b className="mr-1">{element?.step?.step === 0 ? '1' : element?.step?.step}</b> позиция)
                    </div>
                </div>
            )}

            {skeleton ? (
                <GroupSkeleton count={1} size={{ width: '100%', height: '10rem' }} />
            ) : (
                <>
                    {element?.step.type.name === 'document' && (
                        <LessonDocument
                            element={element?.step}
                            content={element?.content}
                            fetchPropElement={(stepId) => {
                                handleFetchElement(stepId);
                                handleFetchSteps(lesson_id);
                            }}
                            clearProp={hasSteps}
                        />
                    )}
                    {element?.step.type.name === 'video' && (
                        <LessonVideo
                            element={element?.step}
                            content={element?.content}
                            fetchPropElement={(stepId) => {
                                handleFetchElement(stepId);
                                handleFetchSteps(lesson_id);
                            }}
                            clearProp={hasSteps}
                        />
                    )}

                    {element?.step.type.name === 'test' && (
                        <LessonTest
                            preparation={() => handlePreparation(steps)}
                            docPreparationTrue={() => {
                                setToggleDocGenerate(true);
                            }}
                            docPreparationFalse={() => {
                                setToggleDocGenerate(false);
                            }}
                            aiTestStat={toggleDragSteps}
                            docGenerageState={toggleDocGenerate}
                            aiTestSet={() => setToggleDragSteps(false)}
                            forAiTestId={draggedId}
                            aiTestSteps={documentSteps}
                            element={element?.step}
                            content={element?.content}
                            fetchPropElement={(stepId) => {
                                handleFetchElement(stepId);
                                handleFetchSteps(lesson_id);
                            }}
                            fetchPropThemes={() => contextFetchThemes(Number(course_id), null)}
                            clearProp={hasSteps}
                        />
                    )}
                    {element?.step.type.name === 'practical' && (
                        <LessonPractica
                            element={element?.step}
                            content={element?.content}
                            fetchPropElement={(stepId) => {
                                handleFetchElement(stepId);
                                handleFetchSteps(lesson_id);
                            }}
                            fetchPropThemes={() => contextFetchThemes(Number(course_id), null)}
                            clearProp={hasSteps}
                        />
                    )}
                    {element?.step.type.name === 'link' && (
                        <LessonLink
                            element={element?.step}
                            content={element?.content}
                            fetchPropElement={(stepId) => {
                                handleFetchElement(stepId);
                                handleFetchSteps(lesson_id);
                            }}
                            clearProp={hasSteps}
                        />
                    )}
                    {element?.step.type.name === 'forum' && (
                        <LessonForum
                            element={element?.step}
                            content={element?.content}
                            fetchPropElement={(stepId) => {
                                handleFetchElement(stepId);
                                handleFetchSteps(lesson_id);
                            }}
                            clearProp={hasSteps}
                        />
                    )}
                </>
            )}

            <div className="flex justify-end mt-1">
                <Button
                    icon={'pi pi-trash'}
                    label="Удалить шаг"
                    disabled={hasSteps || toggleDragSteps}
                    className="hover:bg-[var(--mainBorder)] transition trash-button"
                    onClick={() => {
                        const options = getConfirmOptions(Number(), () => handleDeleteStep());
                        confirmDialog(options);
                    }}
                />
            </div>
        </div>
    );
}
