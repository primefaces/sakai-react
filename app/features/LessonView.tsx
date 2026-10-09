'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { AxiosError } from 'axios';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLessonShow } from '@/services/courses';
import useErrorMessage from '@/hooks/useErrorMessage';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useLocalization } from '@/layout/context/localizationcontext';
import { mainStepsType } from '@/types/mainStepType';
import { addLesson, deleteStep, fetchElement, fetchSteps, fetchTypes, stepSequenceUpdate } from '@/services/steps';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import { NotFound } from '@/app/components/NotFound';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import LessonDocument from '@/app/components/lessons/LessonDocument';
import LessonVideo from '@/app/components/lessons/LessonVideo';
import LessonTest from '@/app/components/lessons/LessonTest';
import LessonPractica from '@/app/components/lessons/LessonPractica';
import LessonLink from '@/app/components/lessons/LessonLink';
import LessonForum from '@/app/components/lessons/LessonForum';
import { Button } from 'primereact/button';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { confirmDialog } from 'primereact/confirmdialog';
import { CourseDetailMenu } from '@/app/components/menu/CourseDetailMenu';

interface LessonResponse {
    lesson: {
        title: string;
        videos_count: string;
        usefullinks_count: string;
        documents_count: string;
        from: string;
        to: string;
    };
}

export default function LessonView({ defaultValue, defaultLessonId }: { defaultValue: boolean; defaultLessonId: string }) {
    const { setMessage, contextMobileLessons, setContextMobileLessons } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const { lesson_id } = useParams<{ course_id: string; lesson_id: string }>();
    const { translations } = useLocalization();

    const [lessonVarId, setLessonVarId] = useState<string>(defaultValue ? defaultLessonId : lesson_id);
    const media = useMediaQuery('(max-width: 640px)');

    const scrollRef = useRef<HTMLDivElement>(null);
    const prevLessonsRef = useRef<Array<{ id: number; title: string }> | null>(null);
    const prevStepsRef = useRef<mainStepsType[]>([]);

    const [lessonInfoState, setLessonInfoState] = useState<{ title: string; documents_count: string; usefullinks_count: string; videos_count: string; from: string; to: string } | null>(null);
    const [steps, setSteps] = useState<mainStepsType[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [types, setTypes] = useState<{ id: number; title: string; name: string; logo: string }[]>([]);
    const [skeleton, setSkeleton] = useState(false);
    const [stepSkeleton, setStepSkeleton] = useState(false);
    const [wasCreated, setWasCreated] = useState(false);
    const [lastStep, setLastStep] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | string>('');
    const [toggleDragSteps, setToggleDragSteps] = useState<boolean>(false);
    const [toggleDocGenerate, setToggleDocGenerate] = useState<boolean>(false);
    const [documentSteps, setDocumentSteps] = useState<mainStepsType[]>([]);
    const [element, setElement] = useState<{ content: any | null; step: mainStepsType } | null>(null);
    const [selectedId, setSelectId] = useState<number | null>(null);
    const [hasSteps, setHasSteps] = useState(false);
    const [themeNull, setThemeNull] = useState(false);
    const [sequence_number, setSequence_number] = useState<number | null>(null);

    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery<LessonResponse, AxiosError>({
        queryKey: ['lessonKey'],
        queryFn: () => fetchLessonShow(Number(lessonVarId) || null),
        enabled: !!lessonVarId // чтобы не стреляло с null
    });

    const handleFetchElement = async (stepId: number) => {
        if (lessonVarId) {
            setStepSkeleton(true);
            const data = await fetchElement(Number(lessonVarId), stepId);

            if (data.success) {
                setElement({ content: data.content, step: data.step });
            } else {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
                });
                if (data?.response?.status) {
                    showError(data.response.status);
                }
            }
            setStepSkeleton(false);
        }
    };

    const handleFetchSteps = async (lessonVarId: number | null) => {
        setSkeleton(true);
        const data = await fetchSteps(Number(lessonVarId));

        if (data.success) {
            if (data.steps.length < 1) {
                setHasSteps(true);
            } else {
                setHasSteps(false);
                setSteps(data.steps);
            }
        } else {
            setHasSteps(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setSkeleton(false);
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
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleUpdateSequence = async (steps: { id: number; step: number }[]) => {
        setSkeleton(true);
        const secuence = await stepSequenceUpdate(lessonVarId ? Number(lessonVarId) : null, steps);

        if (secuence?.success) {
            if (lessonVarId) handleFetchSteps(Number(lessonVarId));
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.updateSuccess, detail: '' }
            });
        } else {
            if (secuence?.response?.status) {
                if (secuence?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: secuence?.response?.data?.message }
                    });
                } else {
                    showError(secuence.response.status);
                }
            }
        }
        setSkeleton(false);
    };

    const handleAddLesson = async (lessonId: number, typeId: number) => {
        setFormVisible(false);
        const forSequence_number = lastStep && lastStep > 0 ? (!sequence_number || sequence_number < 1 ? lastStep + 1 : sequence_number) : sequence_number;

        const data = await addLesson({ lesson_id: lessonId, type_id: typeId }, forSequence_number || 0);
        if (data.success) {
            setSequence_number(null);
            setWasCreated(true);
            handleFetchSteps(Number(lessonId));
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.successAdd, detail: '' }
            });
        } else {
            if (data?.message) {
                const teachers = () => {
                    if (data?.response?.data.teachers?.length) {
                        return (
                            <div className="flex flex-col gap-2">
                                {data.response?.data.teachers?.map((item: any, idx: number) => {
                                    return (
                                        <div key={idx} className={`flex gap-1 flex-col`}>
                                            <span>
                                                {item?.last_name} {item?.name && item?.name[0] + '.'} {item?.father_name && item?.father_name.length > 1 && item?.father_name[0] + '.'}
                                            </span>
                                            <small className="text-[var(--mainColor)] underline">{item?.streams?.map((item: number) => item + ' ')}</small>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    } else {
                        return '';
                    }
                };

                setMessage({
                    state: true,
                    value: { severity: 'error', summary: data?.response?.data?.message, detail: <div style={{ whiteSpace: 'pre-line' }}>{teachers()}</div> }
                });
            } else if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            } else {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.addError, detail: '' }
                });
            }
        }
    };

    const handleDeleteStep = async () => {
        const data = await deleteStep(Number(lessonVarId), Number(selectedId));
        if (data.success) {
            // contextFetchThemes(Number(course_id), null);
            await queryClient.invalidateQueries({ queryKey: ['themes'] });
            handleFetchSteps(Number(lessonVarId));
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.deleteSuccess, detail: '' }
            });
            setSelectId(null);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.deleteError, detail: '' }
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

    const handleDrop = (e: any, index: number) => {
        const startI = e.dataTransfer.getData('index');

        if (startI !== index) {
            const newStepsPosition = [];
            if (steps && steps?.length > 0) {
                const arr = [...steps];
                [arr[startI], arr[index]] = [arr[index], arr[startI]];
                if (arr) {
                    for (let i = 0; i < arr?.length; i++) {
                        const step = { id: arr[i]?.id, step: i + 1 };
                        newStepsPosition?.push(step);
                    }
                }
            }
            if (newStepsPosition) {
                handleUpdateSequence(newStepsPosition);
            }
        }
    };

    // lesson info render
    const lessonInfo = (
        <div className="w-full">
            <div className="bg-[var(--titleColor)] relative flex flex-col justify-center items-center w-full text-white p-4 md:p-3 pb-4">
                <h2 style={{ color: 'white', fontSize: media ? '22px' : '26px', textAlign: 'center' }} className="w-full break-words">
                    {lessonInfoState?.title ? lessonInfoState?.title : '---'}
                </h2>
                {lessonInfoState?.from && lessonInfoState?.to && (
                    <div className="w-full flex justify-center sm:justify-start gap-1 items-center text-[12px]" title={translations.lessonAvailability}>
                        <div className="flex gap-1 items-center p-1 bg-[var(--borderBottomColor)] rounded text-black">
                            <span>{translations.availableFrom}</span>
                            {lessonInfoState?.from}
                            <span>-</span>
                            {lessonInfoState?.to}
                        </div>
                    </div>
                )}
                {/*{media && contextThemes && data?.max_sum_score ? (*/}
                {/*    <div className="flex justify-center gap-1 items-center">*/}
                {/*        <span className="text-sm">{translations.courseScore}</span>*/}
                {/*        <b className="font-semibold">{data?.max_sum_score}</b>*/}
                {/*    </div>*/}
                {/*) : (*/}
                {/*    ''*/}
                {/*)}*/}
            </div>
        </div>
    );

    // step render
    const step = (item: mainStepsType, icon: string, step: number, idx: number) => {
        return (
            <div
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData('index', String(idx));
                    console.log('Перетаскиваем: ', idx);
                }}
                onDrop={(e) => handleDrop(e, idx)}
                onDragOver={(e) => e.preventDefault()}
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
                        <span title={`${item.score} ${translations.scoreUnit}`} className="text-[11px]">
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

    useEffect(() => {
        if (defaultValue) {
            setLessonVarId(defaultLessonId);
        } else {
            setLessonVarId(lesson_id);
        }
    }, [lesson_id, defaultLessonId]);

    useEffect(() => {
        if (data?.lesson) {
            setLessonInfoState({
                title: data?.lesson?.title,
                videos_count: data?.lesson?.videos_count,
                usefullinks_count: data?.lesson?.usefullinks_count,
                documents_count: data?.lesson?.documents_count,
                from: data?.lesson?.from,
                to: data?.lesson?.to
            });
        }
    }, [data]);

    useEffect(() => {
        if (isError) {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });

            if (error?.response?.status) {
                showError(error.response.status);
            }
        }
    }, [isError]);

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
        if (lessonVarId) {
            handleFetchSteps(Number(lessonVarId));
        }
    }, [lessonVarId]);

    if (themeNull) {
        return (
            <div>
                <NotFound titleMessage={translations.noThemes} />
            </div>
        );
    }

    return (
        <>
            <div className={'main-bg mb-4'}>
                <Dialog
                    header={translations.selectStepType}
                    visible={formVisible}
                    className="w-[90%] sm:w-[400px]"
                    onHide={() => {
                        if (!formVisible) return;
                        setFormVisible(false);
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col">
                            <span>{translations.position}</span>
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
                                                        handleAddLesson(Number(lessonVarId), item?.id);
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

                {/* lesson info section */}
                {isLoading ? <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} /> : lessonInfo}

                {/* steps section */}
                {skeleton ? (
                    <div className={'my-4 flex items-center gap-2'}>
                        <GroupSkeleton count={1} size={{ width: '55px', height: '3rem' }} />
                        <GroupSkeleton count={1} size={{ width: '55px', height: '3rem' }} />
                        <GroupSkeleton count={1} size={{ width: '55px', height: '3rem' }} />
                    </div>
                ) : (
                    <div className="flex gap-2 mt-4 items-end">
                        {hasSteps ? (
                            <div className="flex items-center gap-4">
                                <div onClick={handleFetchTypes} className="cursor-pointer w-[40px] h-[40px] sm:w-[54px] sm:h-[54px] rounded animate-step"></div>
                            </div>
                        ) : (
                            <div className="flex items-center relative max-w-[550px] sm:max-w-[800px] overflow-x-auto scrollbar-thin">
                                {toggleDocGenerate ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col sm:flex-row gap-2 items-start">
                                            <b
                                                className="pi pi-times cursor-pointer sm:text-xl text-[var(--mainColor)]"
                                                onClick={() => {
                                                    setToggleDocGenerate(false);
                                                }}
                                            ></b>
                                            <div className="flex items-center gap-1">
                                                <b>{translations.wordTestGeneration}</b>
                                            </div>
                                        </div>
                                    </div>
                                ) : toggleDragSteps ? (
                                    <div className="flex flex-col gap-2 items-start">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                                <b className="pi pi-times cursor-pointer sm:text-xl text-[var(--mainColor)]" onClick={() => setToggleDragSteps(false)}></b>
                                                <div className="flex items-center gap-1">
                                                    <b className="">{translations.aiTestGeneration}</b>
                                                    <i className="pi pi-microchip-ai text-xl"></i>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-black">
                                                    {translations.testVariantsHint} <span className="opacity-60 text-[13px]">{translations.optional}</span>
                                                </span>
                                                {/* <span className="text-[13px]">Кол-о документов: {documentSteps?.length || 0}</span> */}
                                            </div>
                                        </div>{' '}
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
                )}

                {hasSteps && (
                    <div>
                        <NotFound titleMessage={translations.noSteps} />
                    </div>
                )}
                {element?.step.type.title && (
                    <div className="shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] mt-3 pb-1 flex items-center flex-col sm:flex-row gap-1">
                        <span className="sm:text-[18px]">{element?.step.type.title}</span> -
                        <div>
                            (<b className="mr-1">{element?.step?.step === 0 ? '1' : element?.step?.step}</b> {translations.positionUnit})
                        </div>
                    </div>
                )}

                {stepSkeleton ? (
                    <GroupSkeleton count={1} size={{ width: '100%', height: '12rem' }} />
                ) : (
                    <>
                        {element?.step.type.name === 'document' && (
                            <LessonDocument
                                element={element?.step}
                                content={element?.content}
                                fetchPropElement={(stepId) => {
                                    handleFetchElement(stepId);
                                    handleFetchSteps(Number(lessonVarId));
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
                                    handleFetchSteps(Number(lessonVarId));
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
                                    handleFetchSteps(Number(lessonVarId));
                                }}
                                // fetchPropThemes={() => contextFetchThemes(Number(course_id), null)}
                                fetchPropThemes={async () => await queryClient.invalidateQueries({ queryKey: ['themes'] })}
                                clearProp={hasSteps}
                            />
                        )}
                        {element?.step.type.name === 'practical' && (
                            <LessonPractica
                                element={element?.step}
                                content={element?.content}
                                fetchPropElement={(stepId) => {
                                    handleFetchElement(stepId);
                                    handleFetchSteps(Number(lessonVarId));
                                }}
                                fetchPropThemes={async () => await queryClient.invalidateQueries({ queryKey: ['themes'] })}
                                clearProp={hasSteps}
                            />
                        )}
                        {element?.step.type.name === 'link' && (
                            <LessonLink
                                element={element?.step}
                                content={element?.content}
                                fetchPropElement={(stepId) => {
                                    handleFetchElement(stepId);
                                    handleFetchSteps(Number(lessonVarId));
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
                                    handleFetchSteps(Number(lessonVarId));
                                }}
                                clearProp={hasSteps}
                            />
                        )}
                    </>
                )}

                <div className="flex justify-end mt-1">
                    <Button
                        icon={'pi pi-trash'}
                        label={translations.deleteStep}
                        disabled={hasSteps || toggleDragSteps}
                        className="hover:bg-[var(--mainBorder)] transition trash-button"
                        onClick={() => {
                            const options = getConfirmOptions(Number(), () => handleDeleteStep());
                            confirmDialog(options);
                        }}
                    />
                </div>
            </div>
            <CourseDetailMenu />
        </>
    );
}
