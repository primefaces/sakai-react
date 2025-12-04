'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { connectStreams, fetchStreams, newConnectStreams } from '@/services/streams';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import React, { useContext, useEffect, useState } from 'react';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import { streamsType } from '@/types/streamType';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { mainStreamsType } from '@/types/mainStreamsType';
import Link from 'next/link';

const StreamList = React.memo(function StreamList({
    callIndex,
    courseValue,
    isMobile,
    toggleIndex,
    fetchprop,
    close
}: {
    callIndex: number;
    courseValue: { id: number | null; title: string } | null;
    isMobile: boolean;
    toggleIndex?: () => void;
    fetchprop: () => void;
    close?: () => void;
}) {
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [streams, setStreams] = useState<mainStreamsType[]>([]);
    const [hasStreams, setHasStreams] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [visible, setVisible] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<streamsType[]>([]);
    const [emptyCourse, setEmptyCourse] = useState(false);
    const [sendStream_id, setSendStream_id] = useState<number | null>(null);
    const [active, setActive] = useState(false);

    // const shortTitle = useShortText(courseValue?.title ? courseValue?.title : '', 40, 'right');

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    const profilactor = (data: mainStreamsType[]) => {
        const newStreams: streamsType[] = [];

        data.forEach((item) => {
            if (item?.connect_id) {
                newStreams.push({
                    course_id: item?.course_id || null,
                    stream_id: item.stream_id,
                    info: '',
                    id_curricula: item.id_curricula,
                    id_subject: item.subject_name.id,
                    subject_type: item.subject_type_name.short_name_ru,
                    id_subject_type: item.subject_type_name.id,
                    id_edu_year: item.id_edu_year,
                    id_period: item.id_period,
                    id_speciality: item.speciality.id,
                    id_faculty: item.speciality.id_faculty,
                    stream_title: item?.subject_name.name_ru //
                });
            }
        });

        setPendingChanges((prev) => {
            const pendingIds = new Set(prev.map((p) => p.stream_id));
            const uniqueNewStreams = newStreams.filter((s) => !pendingIds.has(s.stream_id));
            return [...prev, ...uniqueNewStreams];
        });
    };

    const handleFetchStreams = async () => {
        const data = await fetchStreams(courseValue ? courseValue?.id : null);
        // setStreamValues({ stream: [] });
        setPendingChanges([]);
        setSendStream_id(null);

        if (data) {
            profilactor(data);
            setHasStreams(false);
            setStreams(data);
        } else {
            setHasStreams(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleConnect = async (id_stream: number, active: boolean) => {
        // const data = await connectStreams({ course_id: courseValue?.id ? courseValue?.id : null, stream: pendingChanges });
        setSkeleton(true);
        const data = await newConnectStreams({ course_id: courseValue?.id ? courseValue?.id : null, id_stream: id_stream, active: active });
        console.log(data);

        if (data?.success) {
            fetchprop();
            toggleSkeleton();
            handleFetchStreams();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            if (data?.message) {
                const teachers = () => {
                    if (data?.teachers?.length) {
                        return (
                            <div className="flex flex-col gap-2">
                                {data.teachers?.map((item: any, idx: number) => {
                                    return (
                                        <div key={idx} className={`flex gap-1 flex-col`}>
                                            <span>
                                                {item?.last_name} {item?.name && item?.name[0] + '.'} {item?.father_name && item?.father_name.length > 1 && item?.father_name[0] + '.'}
                                            </span>
                                            <small>{item?.streams?.map((item: number)=>(
                                                item + ' '
                                            ))}</small>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    } else {
                        return '';
                    }
                };
                console.log(teachers);

                setMessage({
                    state: true,
                    value: { severity: 'error', summary: data?.message, detail: <div style={{ whiteSpace: 'pre-line' }}>{teachers()}</div> }
                });
            } else if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            } else {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка при добавлении', detail: '' }
                });
            }
        }
        setSkeleton(false);
    };

    const handleEdit = (e: { checked: boolean }, item: mainStreamsType) => {
        const { stream_id, subject_name } = item;
        const isChecked = e.checked;

        setSendStream_id(stream_id);
        if (isChecked) {
            setActive(true);
            handleConnect(stream_id, true);
        } else {
            setActive(false);
            handleConnect(stream_id, false);
        }

        // const forSentStreams = {
        //     course_id: courseValue!.id,
        //     stream_id: stream_id,
        //     id_curricula: item.id_curricula,
        //     id_subject: item.subject_name.id,
        //     subject_type: item.subject_type_name.short_name_ru,
        //     id_subject_type: item.subject_type_name.id,
        //     id_edu_year: item.id_edu_year,
        //     id_period: item.id_period,
        //     id_speciality: item.speciality.id,
        //     id_faculty: item.speciality.id_faculty,
        //     info: '',
        //     stream_title: subject_name.name_ru
        // };

        // setPendingChanges((prev) => {
        //     const isCurrentlyPending = prev.some((s) => s.stream_id === stream_id);

        //     if (isChecked) {
        //         // Если чекбокс отмечается
        //         if (!isCurrentlyPending) {
        //             return [...prev, forSentStreams];
        //         }
        //     } else {
        //         // Если чекбокс снимается, удаляем объект из временного состояния
        //         return prev.filter((s) => s.stream_id !== stream_id);
        //     }

        //     return prev;
        // });
    };

    useEffect(() => {
        toggleSkeleton();
        if (courseValue?.id) {
            handleFetchStreams();
        }
    }, [courseValue]);

    useEffect(() => {
        if (streams.length < 1) {
            setEmptyCourse(true);
            setHasStreams(true);
        } else {
            const hasData = streams.some((item) => item.connect_id !== null);
            if (hasData) {
                setEmptyCourse(false);
            } else {
                setEmptyCourse(true);
            }
            setHasStreams(false);
        }
    }, [streams]);

    useEffect(() => {
        console.log(pendingChanges);
    }, [pendingChanges]);

    const itemTemplate = (item: mainStreamsType, index: number) => {
        const bgClass = index % 2 == 0 ? 'bg-[#f5f5f5]' : '';
        return (
            <div className={`w-full ${bgClass}`} key={item?.stream_id}>
                <div className={`flex flex-column p-2 gap-2`}>
                    <div className="flex justify-between gap-1 items-center">
                        <h3 className="m-0 text-lg">{item?.subject_name.name_ru}</h3>
                    </div>
                    <div className="flex flex-column xl:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-2">
                        <div className="flex flex-col order-2 xl:order-1 gap-1 items-start text-[12px] sm:text-[14px]">
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">{item?.subject_type_name?.name_ru}</span>
                                {/* <span>{item?.teacher?.name}</span> */}
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">Язык обучения: </span>
                                <span>{item?.language?.name}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">Год обучения: </span>
                                <span className="font-semibold">20{item?.id_edu_year}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">Период: </span>
                                <span>{item?.period.name_ru}</span>
                            </div>
                        </div>
                        <div className="flex flex-col order-1 xl:order-2 align-items-center gap-2">
                            <span className="font-semibold">{item?.semester?.name_ru}</span>
                            <span className="bg-[var(--greenColor)] text-[12px] text-white p-1 rounded">{item?.edu_form?.name_ru}</span>
                            {item.connect_id && (
                                <Link href={`/students/${courseValue?.id}/${item.connect_id}/${item.stream_id}`} className="underline text-sm">
                                    Студенты
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items: mainStreamsType[]) => {
        if (!items || items.length === 0) return null;

        const hasData = items.some((item) => item.connect_id !== null);
        if (hasData) {
            let list = items.map((product, index: number) => {
                if (product.connect_id !== null) {
                    return itemTemplate(product, index);
                }
            });

            return <div className="grid grid-nogutter shadow-[0_2px_2px_0px_rgba(0,0,0,0.2)]">{list}</div>;
        }
        return (
            <div className="flex flex-col gap-2 justify-center items-center m-4">
                <p className="text-[16px] text-center font-bold">Нет связанных потоков</p>
            </div>
        );
    };

    const footerContent = (
        <div>
            <Button
                label="Назад"
                size="small"
                className="reject-button"
                icon="pi pi-times"
                onClick={() => {
                    setVisible(false);
                    // clearValues();
                }}
            />
            {
                <Button
                    label="Добавить"
                    size="small"
                    disabled={streams.length < 1}
                    icon="pi pi-check"
                    onClick={() => {
                        setVisible(false);
                        // handleConnect();
                    }}
                    autoFocus
                />
            }
        </div>
    );

    return (
        <>
            <Dialog
                header={'Потоки'}
                visible={visible}
                className={`${streams.length < 1 ? '' : 'w-[95%]'}`}
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                    // clearValues();
                }}
                // footer={footerContent}
            >
                {streams && streams.length > 0 ? (
                    <DataTable value={streams} className="w-full my-custom-table" loading={skeleton} dataKey="stream_id" emptyMessage="Нет данных" key={JSON.stringify(pendingChanges)} responsiveLayout="stack" breakpoint="960px" rows={5}>
                        <Column body={(_, { rowIndex }) => rowIndex + 1} header={() => <div className="text-[13px]">#</div>}></Column>
                        <Column body={(rowIndex) => <span>{rowIndex.stream_id}</span>} header={() => <div className="text-[13px]">ID</div>}></Column>
                        {/* <Column body={imageBodyTemplate}></Column> */}

                        <Column field="title" header={() => <div className="text-[13px]">Название</div>} body={(rowData) => <p key={rowData.id}>{rowData.subject_name.name_ru}</p>}></Column>

                        <Column header={() => <div className="text-[13px]">Язык обучения</div>} body={(rowData) => <p key={rowData.id}>{rowData.language.name}</p>}></Column>

                        <Column field="title" header={() => <div className="text-[13px]">Год обучения</div>} body={(rowData) => <p key={rowData.id}>20{rowData.id_edu_year}</p>}></Column>
                        <Column field="title"  header={() => <div className="text-[13px]">Период </div>} body={(rowData) => <p key={rowData.id}>{rowData.period.name_ru}</p>}></Column>

                        <Column field="title" header={() => <div className="text-[13px]">Семестр</div>} body={(rowData) => <p key={rowData.id}>{rowData.semester.name_ru}</p>}></Column>

                        <Column field="title" header={() => <div className="text-[13px]">Форма обучения</div>} body={(rowData) => <p key={rowData.id}>{rowData.edu_form.name_ru}</p>}></Column>

                        <Column field="title" header={() => <div className="text-[13px]">Тип обучения</div>} body={(rowData) => <p key={rowData.id}>{rowData.subject_type_name.short_name_ru}</p>}></Column>

                        <Column
                            header={() => <div className="text-[13px]">Связь к потоку</div>}
                            style={{ margin: '0 3px', textAlign: 'center' }}
                            body={(rowData) => (
                                <>
                                    <label className="custom-radio">
                                        <input
                                            type="checkbox"
                                            className={`customCheckbox`}
                                            // svoysky
                                            // checked={Boolean(item.connect_id)}
                                            // onChange={(e) => {
                                            //     handleEdit(e.target, item.stream_id, item?.subject_name.name_kg);
                                            //     setStreams((prev) => prev.map((el) => (el.stream_id === item.stream_id ? { ...el, connect_id: el.connect_id ? null : 1 } : el)));
                                            // }}

                                            checked={pendingChanges.some((s) => s.stream_id === rowData.stream_id)}
                                            // checked={sendStream_id === rowData.stream_id}

                                            onChange={(e) => {
                                                handleEdit(e.target, rowData);
                                            }}
                                        />
                                        <span className="checkbox-mark"></span>
                                    </label>
                                </>
                            )}
                        ></Column>
                    </DataTable>
                ) : (
                    <p className="text-[16px] text-center font-bold">Данные временно не доступны</p>
                )}
            </Dialog>
            {callIndex === 1 && (
                <div>
                    {skeleton ? (
                        <GroupSkeleton count={10} size={{ width: '100%', height: '5rem' }} />
                    ) : (
                        <>
                            {/* info section */}
                            {!isMobile && (
                                <div>
                                    <i onClick={close} className="pi pi-arrow-left cursor-pointer text-[var(--mainColor)] p-2 rounded-full hover:bg-[var(--mainColor)] hover:text-white"></i>
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-1 mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                                        {/* <span className=" text-[var(--mainColor)] "> */}

                                        <span className="lg:max-w-[300px] xl:max-w-[600px] text-[16px] sm:text-[16px] md:text-[18px] font-bold text-[#4B4563] max-w-sm break-words">{courseValue?.title}</span>
                                        {/* </span> */}
                                        <div className="min-w-[110px]">
                                            <Button
                                                label={emptyCourse ? 'Добавить поток' : 'Потоки'}
                                                icon="pi pi-link"
                                                className="w-full"
                                                onClick={() => {
                                                    handleFetchStreams();
                                                    setVisible(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {hasStreams ? (
                        <>
                            <p className="text-[16px] text-center font-bold">Потоков пока нет или курс не связан с потоками</p>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 sm:gap-2">
                            {isMobile && (
                                <div className="w-full flex flex-col items-center gap-1">
                                    <Button
                                        label="Добавить"
                                        className="w-full"
                                        icon="pi pi-link"
                                        onClick={() => {
                                            handleFetchStreams();
                                            setVisible(true);
                                        }}
                                    />

                                    <Button
                                        label="Курсы"
                                        className="w-full"
                                        icon="pi pi-arrow-left"
                                        onClick={() => {
                                            toggleIndex && toggleIndex();
                                        }}
                                    />
                                </div>
                            )}

                            <div className="max-h-[685px] overflow-y-scroll">
                                {skeleton ? (
                                    <GroupSkeleton count={10} size={{ width: '100%', height: '4rem' }} />
                                ) : (
                                    <>
                                        <div>
                                            <DataView value={streams} listTemplate={listTemplate} emptyMessage="..." />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* {courseValue?.title && (
                                <div className="flex flex-col items-start justify-center gap-2 text-[14px]">
                                    <div className="flex items-center gap-1">
                                        <span className="w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] block border bg-[var(--greenColor)] rounded-4xl"></span>
                                        <span className="text-[16px] sm:text-[18px] font-bold">Тандалган курстун аталышы: {courseValue?.title}</span>
                                    </div>
                                    <div className="w-full flex items-center gap-2">
                                        <div className="w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] border bg-[yellow]"></div>
                                        <div className="flex flex-col gap-1">
                                            {streamValues.stream?.length < 1 && <span className="text-[13px]">Курска байлоо үчүн агымдарды тандаңыз</span>}
                                            {displayStreams.map((item) => {
                                                return <div key={item?.stream_id}>{item?.stream_title}</div>;
                                            })}
                                            <div>{displayStreams.length >= 3 && '...'}</div>
                                        </div>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    )}
                </div>
            )}
        </>
    );
});

export default StreamList;
