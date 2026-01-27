'use client';

import { NotFound } from '@/app/components/NotFound';
import FormModal from '@/app/components/popUp/FormModal';
import Redacting from '@/app/components/popUp/Redacting';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import useMediaQuery from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { addForumMessage, deleteMessageForum, forumDetails, forumDetailsShow, updateMessageForum } from '@/services/forum';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { getRedactor } from '@/utils/getRedactor';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';

export default function Forum() {
    type OptionsType = Intl.DateTimeFormatOptions;

    // data
    interface answerType {
        created_at: string;
        description: string;
        forum_id: number;
        id: number;
        parent_id: number | null;
        steps_id: number;
        updated_at: string;
        user: { id: number; name: string };
        user_id: number;
    }

    // main
    interface mainAnswerType {
        current_page: number;
        data: answerType[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: [{ url: string | null; label: string; active: boolean }];
        next_page_url: null;
        path: string;
        per_page: number;
        prev_page_url: null;
        to: number;
        total: number;
    }

    const { stepId, id_parent, forum_id } = useParams();

    const { user, setMessage, forumValuse } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const media = useMediaQuery('(max-width: 640px)');
    const scrollRef = useRef();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [selectId, setSelectId] = useState<number | null>(null);
    const [visible, setVisisble] = useState(false);
    const [isLoadingOlder, setIsLoadingOlder] = useState(false);
    const [forumValue, setForumValue] = useState<mainAnswerType>({
        current_page: 0,
        data: [],
        first_page_url: '',
        from: 0,
        last_page: 0,
        last_page_url: '',
        links: [{ url: '', label: '', active: false }],
        next_page_url: null,
        path: '',
        per_page: 0,
        prev_page_url: null,
        to: 0,
        total: 0
    });

    const [sendMessage, setSendMessage] = useState('');
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [bigProgressSpinner, setBigProgressSpinner] = useState(false);
    const [sendBtnDisabled, setSendBtnDisabled] = useState(false);
    const [currentPage, setCurrentPage] = useState<number | null>(0);
    const [editingLesson, setEditingLesson] = useState<{ description: string } | null>(null);
    const [descCommentState, setDescCommentState] = useState(false);
    const [answerToComment, setAnswerToComment] = useState<{ userInfo: { userName: string }; description: string; id: number } | null>(null);
    const [hasComments, setHasComments] = useState(false);
    const [valueEmpty, setValueEmpty] = useState(false);
    const [skeleton, setSkeleton] = useState(true);
    const [forumInfoValues, setInfoForumValues] = useState<{ description: string; userInfo: { userName: string; userLastName: string } } | null>(null);

    const router = useRouter();

    // 2. Функция, выполняющая прокрутку
    const scrollToTop = () => {
        if (messagesEndRef.current) {
            // Устанавливаем scrollTop в 0 для прокрутки в самый верх
            messagesEndRef.current.scrollTop = 0;
        }
    };

    const dateTime = (createdAt: string | null) => {
        const invalidDate = <span>---</span>;
        if (createdAt) {
            const dateObject = new Date(createdAt);
            if (dateObject) {
                const options: OptionsType = {
                    month: 'short', // 'long', 'short', 'numeric'
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false // 24-часовой формат
                };
                const formattedString = dateObject.toLocaleString('ru-RU', options);
                const result = formattedString?.replace(/,/g, '');
                if (formattedString) {
                    return <span>{result}</span>;
                } else {
                    return invalidDate;
                }
            } else {
                return invalidDate;
            }
        } else {
            return invalidDate;
        }
    };

    const handleForumDetails = async () => {
        if (skeleton) {
            setTimeout(() => {
                setSkeleton(false);
            }, 1000);
        }

        setIsLoadingOlder(true); // сразу же отключаем запрос
        setProgressSpinner(true);
        const data = await forumDetails(Number(forum_id), currentPage);
        if (data && Object.values(data).length > 0) {
            setHasComments(false);
            setProgressSpinner(false);

            if (data?.data?.length < 1) {
                // если очередной или первый запрос возвращает пустой массив то отключам состояние и прекращаем на этом делать новые запросы
                setIsLoadingOlder(true);
            } else {
                setIsLoadingOlder(false); // если же данные пришли то значит и дальше есть скорее есть данные значит включаем состояние
            }

            const forData = [...(forumValue?.data ?? []), ...(data?.data || [])];
            const newStructure: mainAnswerType = {
                current_page: data?.current_page,
                first_page_url: '',
                data: forData,
                from: data?.from,
                last_page: data?.last_page,
                last_page_url: data?.last_page_url,
                links: [{ url: '', label: '', active: false }],
                next_page_url: data?.next_page_url,
                path: data?.path,
                per_page: data?.per_page,
                prev_page_url: data?.prev_page_url,
                to: data?.to,
                total: data?.total
            };
            setForumValue(newStructure);
        } else {
            setHasComments(true);
            setIsLoadingOlder(true); // останавливаем если ошибка
            setProgressSpinner(false);
        }
    };

    const editing = async (id: number) => {
        const data = await forumDetailsShow(id);

        if (data && Object.values(data).length) {
            setEditingLesson({ description: data?.description });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const selectedForEditing = (id: number) => {
        setSelectId(id);
        setVisisble(true);
        editing(id);
    };

    // const handleForumMore = () => {
    // };

    // ДОБАВЛЕНИЕ СООБЩЕНИЙ
    const handleAddMessage = async () => {
        setIsLoadingOlder(true);
        setProgressSpinner(true);
        const data = await addForumMessage(Number(stepId), answerToComment?.id || null, sendMessage);
        console.log(data);

        if (data.success) {
            setSendMessage('');
            setIsLoadingOlder(false);
            setProgressSpinner(false);
            setForumValue((prev) => (prev ? { ...prev, data: [data?.data, ...prev.data] } : prev));
            // setForumValue(data?.data);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при добавлении!', detail: '' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const handleDelete = async (id: number) => {
        setBigProgressSpinner(true);

        const data = await deleteMessageForum(id);
        console.log(data);

        if (data.success) {
            setBigProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно удалено!', detail: '' }
            });
            setForumValue((prev) =>
                prev
                    ? {
                          ...prev,
                          data: prev.data.filter((item) => {
                              return item?.id !== id;
                          })
                      }
                    : prev
            );
        } else {
            setBigProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при удалении!', detail: '' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    // update document
    const handleUpdate = async () => {
        setBigProgressSpinner(true);
        const data = await updateMessageForum(selectId, (editingLesson && editingLesson?.description) || '');
        console.log(data);

        if (data?.success) {
            setBigProgressSpinner(false);
            setForumValue((prev) =>
                prev
                    ? {
                          ...prev,
                          data: prev.data.map((item) =>
                              item.id === data.data.id
                                  ? { ...item, description: data.data.description } // обновляем нужное поле
                                  : item
                          )
                      }
                    : prev
            );

            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно изменено!', detail: '' }
            });
        } else {
            setBigProgressSpinner(false);
            setEditingLesson({ description: '' });
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при изменении!', detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleScroll = (e: { currentTarget: { scrollTop: number; clientHeight: number; scrollHeight: number } }) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

        // Рассчитываем, насколько близко мы к низу.
        // Мы на самом низу, когда: scrollTop + clientHeight === scrollHeight
        // Устанавливаем "зазор" (например, 100px), чтобы начать загрузку заранее:
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 250;

        if (isNearBottom && !isLoadingOlder) {
            // Вызов функции для загрузки БОЛЕЕ НОВЫХ сообщений
            // handleAddMessage();
            handleForumDetails();
        }
    };

    const chatSection = (item: answerType, messageAnswer: boolean) => {
        const parendItem = item?.parent_id ? forumValue.data.find((el) => el.id === item.parent_id) : false;
        return (
            <div className={`shadow p-2 gap-3 ${user?.id === item?.user?.id ? 'bg-[#ddc4f51a]' : ''} `}>
                {parendItem && (
                    <a
                        href={'#' + item?.parent_id}
                        className="relative p-2 mb-1 lesson-card-border rounded flex overflow-hidden"
                        onClick={(e) => {
                            e.preventDefault();
                            if(item?.parent_id){
                                const target = document.getElementById(item.parent_id + '');
                                if (target) {
                                    target.scrollIntoView({ behavior: 'smooth' }); // плавный скролл
                                }
                            }
                        }}
                    >
                        <span className="bg-[var(--mainColor)] w-[6px] h-full absolute block top-0 left-0"></span>
                        <div className="flex flex-col gap-1">
                            <b className="w-full ml-[5px] text-[13px] text-[var(--mainColor)]">{item?.parent_id ? parendItem?.user.name : ''}</b>
                            <span className="text-[13px] ml-[5px]">{item?.parent_id ? parendItem?.description : ''}</span>
                        </div>
                    </a>
                )}
                <div className={`flex ${messageAnswer ? 'w-full justify-center' : 'w-[97%] justify-end'} flex-col`}>
                    <div id={'' + item?.id} className="w-full flex justify-between">
                        <b className="w-full text-sm text-[var(--mainColor)]">{item?.user?.name}</b>

                        <div className="w-full h-full relative flex flex-col items-end gap-2 justify-between">
                            {user?.id === item?.user?.id && <Redacting redactor={getRedactor(item, { onEdit: selectedForEditing, getConfirmOptions, onDelete: handleDelete })} textSize={'14px'} />}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between flex-col sm:items-end">
                            <div className="w-full break-words text-sm whitespace-pre-wrap">{item?.description}</div>
                        </div>
                        <div className="relative flex justify-end items-center">
                            {messageAnswer && (
                                <div className="w-full flex items-center gap-1 justify-start sm:justify-end sm:mr-[120px]">
                                    <i className="pi pi-envelope text-[10px] text-[var(--mainColor)]" style={{ fontSize: '0.8rem' }}></i>
                                    <i
                                        className="cursor-pointer text-[var(--mainColor)] text-[12px] sm:text-[13px]"
                                        onClick={() => {
                                            setDescCommentState(true);
                                            setAnswerToComment({ userInfo: { userName: item?.user?.name }, description: item?.description, id: item?.id });
                                            scrollToTop();
                                        }}
                                    >
                                        Ответить
                                    </i>
                                </div>
                            )}
                            <p className="absolute top-2 text-[10px] m-0 flex justify-end">{dateTime(item?.updated_at)}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Вызываем детаилс
    useEffect(() => {
        // const testFunc = () => {
        //     const clearValue = setInterval(() => {
        handleForumDetails();
        //     }, 3000);
        //     if(hasComments || ha){
        //         clearInterval(clearValue);
        //     }
        // }
        // testFunc();
        const checkValues = localStorage.getItem('forumValues');
        if (checkValues && checkValues?.length > 0) {
            setInfoForumValues(JSON.parse(checkValues));
        }
    }, []);

    useEffect(() => {
        console.log(forumValue);
        if (forumValue?.current_page) {
            setCurrentPage(forumValue.current_page);
        }

        if (forumValue?.data?.length < 1) {
            setValueEmpty(true);
        } else {
            setValueEmpty(false);
        }
    }, [forumValue]);

    useEffect(() => {
        console.log('currentpage', forumValuse);
    }, [forumValuse]);

    return (
        <div className="main-bg">
            <div className="flex flex-col gap-4">
                {/* header section */}
                <div className="flex flex-col gap-2">
                    <div className="max-w-4xl mb-2">
                        <button onClick={() => router.back()} className="text-[var(--mainColor)] underline px-2 flex items-center gap-1">
                            <i className="pi pi-arrow-left text-[13px] cursor-pointer hover:shadow-2xl" style={{ fontSize: '13px' }}></i>
                            <span className="text-[13px] cursor-pointer">Назад</span>
                        </button>
                    </div>
                    {/* <div className="flex justify-between shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] pb-2">
                        <div className="flex flex-col sm:flex-row items-center gap-1 text-xl">
                            <h3 className="m-0">Название курса {!media && '-'}</h3>
                            <h3 className="m-0">Название темы</h3>
                        </div>
                        <span>xx-xx-xx</span>
                    </div> */}
                    <div className="flex justify-between items-start shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] pb-2">
                        <div className="flex flex-col gap-1">
                            {forumInfoValues?.description ? <h3 className="m-0 w-full break-words text-lg">Название форума: {forumInfoValues?.description}</h3> : <h3 className="m-0 w-full break-words text-xl">Форум</h3>}
                            {forumInfoValues?.userInfo?.userName && (
                                <span className="text-[13px]">
                                    {forumInfoValues?.userInfo?.userLastName} {forumInfoValues?.userInfo?.userName}
                                </span>
                            )}
                        </div>
                        {/* <span className="w-[180px] text-sm flex justify-end">xx-xx-xx</span> */}
                    </div>
                </div>

                {skeleton ? (
                    <div className="w-full">
                        <GroupSkeleton count={1} size={{ width: '100%', height: '15rem' }} />
                    </div>
                ) : hasComments ? (
                    <NotFound titleMessage="Данные временно не доступны" />
                ) : (
                    <>
                        {/* chat */}
                        <div className="relative">
                            {bigProgressSpinner && (
                                <div className="absolute w-full h-full bg-black/50 flex justify-center items-center">
                                    <ProgressSpinner className="text-white text-lg" style={{ width: '54px', height: '54px' }} />
                                </div>
                            )}
                            <div onScroll={handleScroll} ref={messagesEndRef} className="flex flex-col gap-2 p-3 lesson-card-border rounded max-h-[350px] sm:max-h-[400px] overflow-x-auto">
                                {valueEmpty ? (
                                    <div className="w-full">
                                        <p className="text-sm text-center">Сообщения отсутствуют. Добавьте первое, чтобы начать диалог</p>
                                    </div>
                                ) : (
                                    // <div className="flex flex-col gap-2">
                                    //     <div className="flex justify-between flex-col sm:gap-1 pb-1 mb-4 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                                    //         <div className="flex justify-between items-center">
                                    //             <div className="flex items-center gap-3">
                                    //                 <b className="pi pi-times cursor-pointer sm:text-lg text-[var(--mainColor)]" onClick={() => setDescCommentState(false)}></b>
                                    //                 <h3 className="m-0">Ответить пользователю ({''})</h3>
                                    //             </div>
                                    //             <p className="text-[10px] m-0 flex justify-end">{dateTime('')}</p>
                                    //         </div>
                                    //         <div className="w-full break-words text-sm">{'lorem'}</div>
                                    //     </div>

                                    //     {Array.isArray(forumValue?.data) &&
                                    //         forumValue?.data?.map((item) => {
                                    //             return (
                                    //                 <div key={item?.id} className="w-full flex justify-end">
                                    //                     {chatSection(item, false)}
                                    //                 </div>
                                    //             );
                                    //         })}
                                    // </div>
                                    <div className="flex flex-col gap-4">
                                        {descCommentState && (
                                            <div className="flex justify-between flex-col sm:gap-1 pb-1 mb-4 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                                                <div className="flex items-center justify-between gap-3">
                                                    <h3 className="m-0">Ответить пользователю ({answerToComment?.userInfo?.userName})</h3>
                                                    <b className="pi pi-times cursor-pointer mr-2 sm:text-lg text-[var(--mainColor)]" onClick={() => setDescCommentState(false)}></b>
                                                </div>

                                                <div className="w-full break-words text-sm">{answerToComment?.description}</div>
                                            </div>
                                        )}

                                        {Array.isArray(forumValue?.data) &&
                                            forumValue?.data?.map((item) => {
                                                return <div key={item?.id}>{chatSection(item, true)}</div>;
                                            })}
                                    </div>
                                )}

                                {progressSpinner && <ProgressSpinner style={{ width: '70px', height: '50px' }} animationDuration=".5s" />}
                            </div>
                        </div>
                        {/* send area */}
                        <div className="flex items-center gap-1">
                            <InputText
                                className="w-full p-2 p-inputtext-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddMessage();
                                        setSendBtnDisabled(true);
                                        setTimeout(() => {
                                            setSendBtnDisabled(false);
                                        }, 1000);
                                    }
                                }}
                                placeholder={descCommentState ? 'Введите свой ответ' : ''}
                                value={sendMessage}
                                onChange={(e) => setSendMessage((prev) => (prev = e.target.value))}
                            />
                            <button
                                disabled={progressSpinner || sendBtnDisabled}
                                onClick={() => {
                                    handleAddMessage();
                                    setSendBtnDisabled(true);
                                    setTimeout(() => {
                                        setSendBtnDisabled(false);
                                    }, 1000);
                                }}
                                className={`pi pi-send cursor-pointer ${
                                    progressSpinner && 'opacity-50'
                                } transform rotate-[47deg] bg-[var(--mainColor)] p-[10px] sm:p-[12px] rounded-full text-white text-lg sm:text-xl hover:bg-[var(--mainBorder)] hover:text-[var(--mainColor)]`}
                            ></button>
                        </div>
                    </>
                )}
            </div>

            <FormModal title={'Редактировать'} fetchValue={() => handleUpdate()} clearValues={() => {}} visible={visible} setVisible={setVisisble} start={false} footerValue={{ footerState: true, reject: 'Закрыть', next: 'Сохранить' }}>
                <div className="flex flex-col gap-1">
                    <div className="flex relative">
                        <InputText
                            value={editingLesson?.description}
                            disabled={progressSpinner === true ? true : false}
                            className="w-full"
                            onChange={(e) => {
                                setEditingLesson(
                                    (prev) =>
                                        prev && {
                                            ...prev,
                                            description: e.target.value
                                        }
                                );
                            }}
                        />
                        {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                    </div>
                </div>
            </FormModal>
        </div>
    );
}
