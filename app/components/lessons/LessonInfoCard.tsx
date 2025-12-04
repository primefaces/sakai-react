'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from 'react';
import GroupSkeleton from '../skeleton/GroupSkeleton';

export default function LessonInfoCard({
    contentType,
    totalScore,
    type,
    icon,
    title,
    checkTitle,
    description,
    documentUrl,
    link,
    video_link,

    videoStart,
    
    test,
    
    getValues,
    answerList,
    addPracticaScore,
    addPracticaDisannul,
    skeleton,
    isOpened,
    item
}: {
    type: string;
    icon: string;
    title?: string;
    description?: string;
    documentUrl?: { document: string | null; document_path: string };
    link?: string;
    video_link?: string;
    videoStart?: (id: string) => void;
    test?: { content: string; answers: { id: number | null; text: string; is_correct: boolean }[]; score: number | null };
    contentType?: string;
    totalScore?: number | null;
    answerList?: { answer_id: number | null; file: string; score: number | null; id_curricula: number; course_id: number; id_parent: number | null; id_stream: number; student_id: number; lesson_id: number; id:number; steps_id: number };
    checkTitle?: string | null;
    skeleton?: boolean;
    getValues?: () => void;
    addPracticaScore?: (id: number) => void;
    addPracticaDisannul?: (id_curricula:number, course_id:number, id_stream:number, id:number, steps_id:number, message:string) => void;
    isOpened?: boolean;
    item?: {};
}) {
    const { setMessage } = useContext(LayoutContext);
    
    const [testCall, setTestCall] = useState(false);
    const [answerTest, setAnswerTest] = useState<{ text: string } | null>(null);
    const [docCall, setDocCall] = useState(false);
    const [practicaCall, setPracticaCall] = useState(false);
    const [linkCall, setLinkCall] = useState(false);
    const [videoCall, setVideoCall] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const [practicaScore, setPracticaScore] = useState<{ score: number }>({ score: 0 });
    const [practicaMessage, setPracticaMessage] = useState('');

    const hasPdf = /pdf/i.test(documentUrl?.document_path || ''); // true
    const hasAnswerPdf = /pdf/i.test(answerList?.file || ''); // true

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
    };

    const docCard = (
        <div className="w-full flex justify-between flex-col sm:flex-row">
            <div className=" flex items-start sm:items-center gap-2 py-1">
                <div className="p-2 bg-[var(--mainColor)] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="flex flex-col justify-center gap-1">
                    {documentUrl?.document_path ? (
                        documentUrl?.document_path?.length > 0 ? (
                            <a
                                href={documentUrl?.document_path ? (documentUrl?.document_path?.length > 0 ? String(documentUrl?.document_path) : '#') : '#'}
                                className="max-w-[800px] text-[16px] text-wrap break-all hover:underline"
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {contentType == 'check' ? checkTitle : title}
                            </a>
                        ) : (
                            <span className="max-w-[800px] text-[16px] text-wrap break-all ">{contentType == 'check' ? checkTitle : title}</span>
                        )
                    ) : (
                        <span className="max-w-[800px] text-[16px] text-wrap break-all">{contentType == 'check' ? checkTitle : title}</span>
                    )}
                    <p className="max-w-[800px] text-wrap break-all text-[12px]">{contentType !== 'check' && description !== 'null' && description}</p>
                </div>
            </div>
            {contentType === 'check' && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        label={'Проверить'}
                        size="small"
                        onClick={() => {
                            getValues && getValues();
                            setDocCall(true);
                        }}
                    />
                </div>
            )}
        </div>
    );

    const docSection = () => {
        return (
            <>
                {skeleton ? (
                    <div className="w-full">
                        <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                    </div>
                ) : (
                    <div className="flex flex-col justify-between gap-4 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            {documentUrl ? (
                                documentUrl.document_path && hasPdf ? (
                                    <a className="flex gap-2" href={documentUrl.document_path} download target="_blank" rel="noopener noreferrer">
                                        <span className="max-w-[800px] text-wrap break-all font-bold hover:underline">{title}</span>
                                    </a>
                                ) : (
                                    <div className="flex gap-2">
                                        <span className="max-w-[800px] text-wrap break-all font-bold">{title}</span>
                                    </div>
                                )
                            ) : (
                                <div className="flex gap-2">
                                    <span className="max-w-[800px] text-wrap break-all font-bold">{title}</span>
                                </div>
                            )}
                            {/* <p className="max-w-[800px] text-wrap break-all">{description}</p> */}
                            {description && description !== 'null' && <div dangerouslySetInnerHTML={{ __html: description }} />}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-1">
                                <span className="text-[var(--mainColor)] text-[13px]">Документ: </span>
                                {documentUrl && documentUrl.document_path && hasPdf ? (
                                    <a className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[var(--mainColor)] p-1 rounded`} href={documentUrl && documentUrl.document_path} download target="_blank" rel="noopener noreferrer"></a>
                                ) : (
                                    <span className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[gray] p-1 rounded`} rel="noopener noreferrer"></span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const linkCard = (
        <div className="w-full flex justify-between flex-col sm:flex-row">
            <div className="w-full flex items-start sm:items-center gap-2 py-1">
                <div className="p-2 bg-[var(--greenColor)] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                    <a href={link ? String(link) : '#'} className="max-w-[800px] text-[16px] text-wrap break-all hover:underline" target="_blank">
                        {contentType == 'check' ? checkTitle : title}
                    </a>

                    <p className="max-w-[800px] text-wrap break-all text-[12px]">{contentType !== 'check' && description !== 'null' && description}</p>
                </div>
            </div>
            {contentType === 'check' && (
                <div className="flex items-center gap-2 justify-end">
                    <Button
                        label={'Проверить'}
                        size="small"
                        onClick={() => {
                            getValues && getValues();
                            setLinkCall(true);
                        }}
                    />
                </div>
            )}
        </div>
    );

    const linkSection = () => {
        return (
            <>
                {skeleton ? (
                    <div className="w-full">
                        <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-start  gap-2 py-1">
                        <span className="max-w-[800px] text-wrap break-all font-bold">{title}</span>
                        <div className="flex gap-2 items-center">
                            <span className="text-[var(--mainColor)] text-[13px]">Ссылка: </span>
                            {link ? (
                                <a href={link ? String(link) : ''} className="max-w-[800px] text-[13px] text-wrap break-all" target="_blank">
                                    {link}
                                </a>
                            ) : (
                                <span className={``} rel="noopener noreferrer">
                                    ?
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </>
        );
    };

    const videoCard = (
        <div className="w-full flex justify-between flex-col sm:flex-row">
            <div className="w-full flex items-start sm:items-center gap-2 py-1">
                <div className="p-2 bg-[var(--amberColor)] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                    <span onClick={() => videoStart && videoStart(video_link || '')} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                        {contentType == 'check' ? checkTitle : title}
                    </span>

                    <p className="max-w-[800px] text-wrap break-all text-[12px]">{contentType !== 'check' && description !== 'null' && description}</p>
                </div>
            </div>
            {contentType === 'check' && (
                <div className="flex items-center gap-2 justify-end">
                    <Button
                        label={'Проверить'}
                        size="small"
                        onClick={() => {
                            getValues && getValues();
                            setVideoCall(true);
                        }}
                    />
                </div>
            )}
        </div>
    );

    const videoSecton = () => {
        return (
            <>
                {' '}
                {skeleton ? (
                    <div className="w-full">
                        <GroupSkeleton count={1} size={{ width: '100%', height: '12rem' }} />
                    </div>
                ) : (
                    <div className="w-full flex gap-2 py-1">
                        <div className="w-full flex flex-col gap-2">
                            <span className="text-[var(--mainColor)] text-[13px]">{title} </span>

                            <div className="w-full flex">
                                <iframe
                                    className="w-full h-[200px] md:h-[400px]"
                                    // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                    src={videoLink}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const testCard = (
        <div className="w-full flex justify-between gap-1 flex-col sm:flex-row">
            <div className="w-full flex items-start sm:items-center gap-2 py-1">
                <div className="p-2 bg-[#c38598] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                    <span
                        onClick={() => {
                            setTestCall(true);
                            getValues && getValues();
                        }}
                        className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline"
                    >
                        Тест
                    </span>
                </div>
            </div>
            {contentType === 'check' && (
                <div className="w-full flex items-center justify-center sm:justify-end gap-2 sm:max-w-[300px]">
                    <div className="w-1/2 sm:w-full sm:text-sm">
                        <span>Балл:</span>{' '}
                        <span className="text-[var(--mainColor)]">
                            {' '}
                            {answerList?.score || 0} / {totalScore}
                        </span>
                    </div>
                    <div className="w-1/2 sm:w-full flex justify-end">
                        <Button
                            label={'Проверить'}
                            size="small"
                            onClick={() => {
                                getValues && getValues();
                                setTestCall(true);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const testInfo = (
        <div className="flex items-center gap-2 w-full">
            {test?.answers && (
                <div className="flex flex-col justify-center gap-2 w-full">
                    <div className="flex gap-1 items-center flex-col md:flex-row border-b-1 pb-1 border-[var(--borderBottomColor)]">
                        <span className="cursor-pointer max-w-[800px] text-wrap break-all">{test?.content}</span>
                    </div>
                    <div className="flex flex-col gap-1 justify-center">
                        {test?.answers.map((item) => {
                            return (
                                <div key={item.id}>
                                    <label className="custom-radio opacity-[60%]">
                                        <input disabled type="radio" name="radio" />
                                        <span className="radio-mark min-w-[18px]"></span>
                                        <span>{item.text}</span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-1 justify-center w-full">
                        <span className="text-[var(--mainColor)]">Балл за тест: </span>
                        <b className="">{`${test?.score}`}</b>
                    </div>
                </div>
            )}
        </div>
    );

    const testCheckInfo = () => {
        return (
            <div className="flex items-center gap-2 w-full">
                {skeleton ? (
                    <div className="w-full">
                        <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                    </div>
                ) : (
                    test?.answers && (
                        <div className="flex flex-col justify-center gap-2 w-full">
                            <div className="flex gap-1 items-center flex-col md:flex-row border-b-1 pb-1 border-[var(--borderBottomColor)]">
                                <span className="max-w-[800px] text-wrap break-all">{test?.content}</span>
                            </div>
                            <div className="flex flex-col gap-1 justify-center">
                                {test?.answers.map((item) => {
                                    return (
                                        <div key={item.id}>
                                            <label className="custom-radio opacity-[60%]">
                                                <input disabled checked={item?.is_correct} type="radio" name="radio" />
                                                <span className="radio-mark min-w-[18px]"></span>
                                                <span>{item.text}</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-1 pl-[7px]">
                                <span className="text-[var(--mainColor)]">Ответ студента: </span>
                                <b className="">{answerTest?.text || '?'}</b>
                            </div>
                        </div>
                    )
                )}
            </div>
        );
    };

    const practicaCard = (
        <div className={`w-full flex justify-between flex-col sm:flex-row ${isOpened ? 'bg-[var(--greenBgColor)] rounded' : ''}`}>
            <div className="w-full flex items-start sm:items-center gap-2 py-1">
                <div className="p-2 bg-[var(--yellowColor)] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <span
                    onClick={() => {
                        setPracticaCall(true);
                        getValues && getValues();
                    }}
                    className={`cursor-pointer max-w-[800px] text-[16px] text-wrap ${isOpened ? 'underline' : ''} break-all hover:underline`}
                >
                    Практическое задание
                </span>
            </div>
            {contentType === 'check' && (
                <div className="w-full flex items-center justify-end sm:justify-end gap-2 sm:max-w-[300px]">
                    <div className="w-1/2 sm:w-full sm:text-sm">
                        <span>Балл:</span>{' '}
                        <span className="text-[var(--mainColor)]">
                            {' '}
                            {answerList?.score || 0} / {totalScore}
                        </span>
                    </div>
                    <div className="w-1/2 sm:w-full flex justify-end">
                        <Button
                            label={'Проверить'}
                            size="small"
                            onClick={() => {
                                getValues && getValues();
                                setPracticaCall(true);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const practicaInfo = () => {
        return (
            <>
                {skeleton ? (
                    <div className="w-full">
                        <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                    </div>
                ) : (
                    <div className="flex flex-col justify-between gap-4 w-full">
                        <div className="flex flex-col gap-1 w-full">
                            {documentUrl ? (
                                documentUrl.document_path && hasPdf ? (
                                    <a className="flex gap-2" href={documentUrl.document_path} download target="_blank" rel="noopener noreferrer">
                                        <span className="max-w-[800px] text-wrap break-all font-bold hover:underline">{title}</span>
                                    </a>
                                ) : (
                                    <div className="flex gap-2">
                                        <span className="max-w-[800px] text-wrap break-all font-bold">{title}</span>
                                    </div>
                                )
                            ) : (
                                <div className="flex gap-2">
                                    <span className="max-w-[800px] text-wrap break-all font-bold">{title}</span>
                                </div>
                            )}
                            {/* <p className="max-w-[800px] text-wrap break-all">{description}</p> */}
                            {description && description !== 'null' && <div dangerouslySetInnerHTML={{ __html: description }} />}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-1">
                                <span className="text-[var(--mainColor)] text-sm">Документ: </span>
                                {documentUrl && documentUrl.document_path && hasPdf ? (
                                    <a className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[var(--mainColor)] p-1 rounded`} href={documentUrl && documentUrl.document_path} download target="_blank" rel="noopener noreferrer"></a>
                                ) : (
                                    <span className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[gray] p-1 rounded`} rel="noopener noreferrer"></span>
                                )}
                            </div>

                            <div className="flex gap-2 items-center shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                                <span className="text-[var(--mainColor)] text-sm">Ссылка: </span>
                                {link ? (
                                    <a href={link ? String(link) : ''} className="max-w-[800px] text-[13px] text-wrap break-all" target="_blank">
                                        {link}
                                    </a>
                                ) : (
                                    <b className={``} rel="noopener noreferrer">
                                        ?
                                    </b>
                                )}
                            </div>

                            {contentType === 'check' && (
                                <div className="flex gap-1 flex-col mt-2">
                                    <div className="flex items-center gap-1">
                                        <b>Ответ студента: </b>
                                        <span className="text-sm max-w-[400px] break-words">
                                            {answerList?.file && answerList?.file && hasAnswerPdf ? (
                                                <a className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[var(--mainColor)] p-1 rounded`} href={answerList?.file && answerList?.file} download target="_blank" rel="noopener noreferrer"></a>
                                            ) : (
                                                <b>?</b>
                                            )}
                                        </span>
                                    </div>
                                    {answerList?.file && answerList?.file && hasAnswerPdf && (
                                        <div className="flex flex-col justify-center items-start">
                                            {answerList?.score ? (
                                                <b>
                                                    Балл отправлен <span className="text-[var(--mainColor)]">{answerList?.score}</span>
                                                </b>
                                            ) : (
                                                <div className="w-full flex flex-col gap-2">
                                                    <div className="flex flex-col gap-1">
                                                        <b className="text-sm">Поставить балл студенту</b>
                                                        <div className="w-full flex items-center gap-1">
                                                            <InputText
                                                                type="number"
                                                                placeholder={`Макс. ${totalScore}`}
                                                                className="w-[70%] sm:w-[80%]"
                                                                onChange={(e) => {
                                                                    setPracticaScore((prev) => ({ ...prev, score: Number(e.target.value) }));
                                                                }}
                                                            />
                                                            <Button
                                                                label="Отправить"
                                                                size="small"
                                                                onClick={() => {
                                                                    setPracticaCall(false);
                                                                    addPracticaScore && addPracticaScore(Number(practicaScore?.score));
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <b className="text-sm">Анулировать ответ студента</b>
                                                        <div className="w-full flex items-center gap-1">
                                                            <InputText
                                                                type="text"
                                                                className="w-[70%] sm:w-[80%]"
                                                                onChange={(e) => {
                                                                    setPracticaMessage((prev) => prev = e.target.value );
                                                                }}
                                                            />
                                                            <Button
                                                                label="Отправить"
                                                                size="small"
                                                                onClick={() => {
                                                                    if(answerList){
                                                                        addPracticaDisannul && addPracticaDisannul(answerList?.id_curricula, answerList?.course_id, answerList?.id_stream, answerList?.id, answerList?.steps_id, practicaMessage);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </>
        );
    };

    useEffect(() => {
        const answer = test?.answers?.find((item) => item.id === answerList?.answer_id);
        if (answer) {
            setAnswerTest(answer);
        }
    }, [test, answerList]);

    useEffect(() => {
        if (videoCall && video_link) {
            handleVideoCall(video_link);
        }
    }, [videoCall]);

    useEffect(()=> {
        console.log(practicaMessage);
    },[practicaMessage]);

    return (
        <div>
            <Dialog
                header={contentType === 'check' ? 'Проверка теста' : 'Тест'}
                className="p-2 w-[90%] sm:w-[600px] max-h-[400px]"
                visible={testCall}
                onHide={() => {
                    if (!testCall) return;
                    setTestCall(false);
                }}
            >
                <div className="flex items-center w-full">{contentType === 'check' ? testCheckInfo() : testInfo}</div>
            </Dialog>
            <Dialog
                header={'Практическое задание'}
                className="p-2 w-[90%] sm:w-[600px] max-h-[400px]"
                visible={practicaCall}
                onHide={() => {
                    if (!practicaCall) return;
                    setPracticaCall(false);
                }}
            >
                <div className="flex items-center">{practicaInfo()}</div>
            </Dialog>
            <Dialog
                header={'Проверить документ'}
                className="p-2 w-[90%] sm:w-[600px] max-h-[400px]"
                visible={docCall}
                onHide={() => {
                    if (!docCall) return;
                    setDocCall(false);
                }}
            >
                <div className="flex items-center">{docSection()}</div>
            </Dialog>
            <Dialog
                header={'Проверить ссылку'}
                className="p-2 w-[90%] sm:w-[600px] max-h-[400px]"
                visible={linkCall}
                onHide={() => {
                    if (!linkCall) return;
                    setLinkCall(false);
                }}
            >
                <div className="flex items-center">{linkSection()}</div>
            </Dialog>
            <Dialog
                header={'Проверить видео'}
                className="p-2 w-[90%] sm:w-[600px] max-h-[400px]"
                visible={videoCall}
                onHide={() => {
                    if (!videoCall) return;
                    setVideoCall(false);
                }}
            >
                <div className="">{videoSecton()}</div>
            </Dialog>
            <div className="flex items-center">{type === 'document' && docCard}</div>
            <div className="flex items-center">{type === 'link' && linkCard}</div>
            <div className="flex items-center">{type === 'video' && videoCard}</div>
            <div className="flex items-center">{type === 'test' && testCard}</div>
            <div className="flex items-center">{type === 'practical' && practicaCard}</div>
        </div>
    );
}
