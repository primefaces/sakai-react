'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { connectStreams, fetchStreams } from '@/services/streams';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { useContext, useEffect, useState } from 'react';
import { NotFound } from '../NotFound';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import { streamsType } from '@/types/streamType';
import { displayType } from '@/types/displayType';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { mainStreamsType } from '@/types/mainStreamsType';

export default function StreamList({
    callIndex,
    courseValue,
    isMobile,
    insideDisplayStreams,
    toggleIndex,
    fetchprop
}: {
    callIndex: number;
    courseValue: { id: number | null; title: string } | null;
    isMobile: boolean;
    insideDisplayStreams: (id: mainStreamsType[]) => void;
    toggleIndex: () => void;
    fetchprop: () => void;
}) {
    const [streams, setStreams] = useState<mainStreamsType[]>([]);
    const [displayStreams, setDisplayStreams] = useState<displayType[] | any>([]);
    const [hasStreams, setHasStreams] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [visible, setVisible] = useState(false);
    const [contentShow, setContentShow] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<streamsType[]>([]);

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

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
        const data = await fetchStreams(courseValue ? courseValue.id : null);
        // setStreamValues({ stream: [] });
        setPendingChanges([]);

        if (data) {
            profilactor(data);
            setHasStreams(false);
            setStreams(data);
        } else {
            setHasStreams(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Проблема с соединением' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleConnect = async () => {
        const data = await connectStreams({ course_id: courseValue?.id ? courseValue?.id : null, stream: pendingChanges });

        if (data?.success) {
            fetchprop();
            toggleSkeleton();
            handleFetchStreams();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при добавлении', detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleEdit = (e: { checked: boolean }, item: mainStreamsType) => {
        const { stream_id, subject_name } = item;
        const isChecked = e.checked;

        const forSentStreams = {
            course_id: courseValue!.id,
            stream_id: stream_id,
            id_curricula: item.id_curricula,
            id_subject: item.subject_name.id,
            subject_type: item.subject_type_name.short_name_ru,
            id_subject_type: item.subject_type_name.id,
            id_edu_year: item.id_edu_year,
            id_period: item.id_period,
            id_speciality: item.speciality.id,
            id_faculty: item.speciality.id_faculty,
            info: '',
            stream_title: subject_name.name_ru
        };

        setPendingChanges((prev) => {
            const isCurrentlyPending = prev.some((s) => s.stream_id === stream_id);

            if (isChecked) {
                // Если чекбокс отмечается
                if (!isCurrentlyPending) {
                    return [...prev, forSentStreams];
                }
            } else {
                // Если чекбокс снимается, удаляем объект из временного состояния
                return prev.filter((s) => s.stream_id !== stream_id);
            }

            return prev;
        });
    };

    useEffect(() => {
        setDisplayStreams([]);
        toggleSkeleton();
        if (courseValue?.id) {
            handleFetchStreams();
        }
    }, [courseValue]);

    useEffect(() => {
        console.log('streams', streams);
        
        if (streams.length < 1) {
            // insideDisplayStreams(streams);
            setHasStreams(true);
        } else {
            setHasStreams(false);
        }
    }, [streams]);

    useEffect(() => {
        insideDisplayStreams(displayStreams);
        console.log(displayStreams);
        
    }, [displayStreams]);

    const itemTemplate = (item: mainStreamsType, index: number) => {
        const bgClass = index % 2 == 0 ? 'bg-[#f5f5f5]' : '';
        return (
            <div className={`w-full ${bgClass}`} key={item?.stream_id}>
                <div className={`flex flex-column p-2 gap-2`}>
                    <div className="flex justify-between gap-1 items-center">
                        <h3 className="m-0 text-lg">{item?.subject_name.name_ru}</h3>
                        {/* <label className="custom-radio">
                            <input
                                type="checkbox"
                                className={`customCheckbox`}
                                // svoysky
                                // checked={Boolean(item.connect_id)}
                                // onChange={(e) => {
                                //     handleEdit(e.target, item.stream_id, item?.subject_name.name_ru);
                                //     setStreams((prev) => prev.map((el) => (el.stream_id === item.stream_id ? { ...el, connect_id: el.connect_id ? null : 1 } : el)));
                                // }}
                                checked={pendingChanges.some((s) => s.stream_id === item.stream_id)}
                                onChange={(e) => {
                                    // console.log();

                                    handleEdit(e.target, item);
                                }}
                            />
                            <span className="checkbox-mark"></span>
                        </label> */}
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
                            {/* {item.connect_id && (
                                <Link href={`/students/${item.connect_id}/${item.stream_id}`} className="underline">
                                    Студенттер
                                </Link>
                            )} */}
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
            const forCourse = items.filter((item)=> item.connect_id !== null);
            console.log(forCourse);
            
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
                    disabled={false}
                    icon="pi pi-check"
                    onClick={() => {
                        setVisible(false);
                        handleConnect();
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
                className="w-[95%]"
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                    // clearValues();
                }}
                footer={footerContent}
            >
                {streams && streams.length > 0 ? (
                    <DataTable value={streams} className="w-full my-custom-table" dataKey="stream_id" key={JSON.stringify(pendingChanges)} responsiveLayout="stack" breakpoint="960px" rows={5}>
                        <Column body={(_, { rowIndex }) => rowIndex + 1} header="#"></Column>
                        {/* <Column body={imageBodyTemplate}></Column> */}

                        <Column field="title" header="Название" body={(rowData) => <p key={rowData.id}>{rowData.subject_name.name_ru}</p>}></Column>

                        <Column header="Язык обучения" body={(rowData) => <p key={rowData.id}>{rowData.language.name}</p>}></Column>

                        <Column field="title" header="Год обучения" body={(rowData) => <p key={rowData.id}>20{rowData.id_edu_year}</p>}></Column>
                        <Column field="title" header="Период" body={(rowData) => <p key={rowData.id}>{rowData.period.name_ru}</p>}></Column>

                        <Column field="title" header="Семестр" body={(rowData) => <p key={rowData.id}>{rowData.semester.name_ru}</p>}></Column>

                        <Column field="title" header="Тип обучения" body={(rowData) => <p key={rowData.id}>{rowData.subject_type_name.short_name_ru}</p>}></Column>

                        <Column
                            header="Связь к потоку"
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
                                            // checked={true}
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
                    <p className="text-[16px] text-center font-bold">Курс не опубликован или данные временно не доступны</p>
                )}
            </Dialog>
            {callIndex === 1 && (
                <div className="sm:py-4">
                    {skeleton ? (
                        <GroupSkeleton count={10} size={{ width: '100%', height: '5rem' }} />
                    ) : (
                        <>
                            {/* info section */}
                            {!isMobile && (
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-1 mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                                    {/* <span className=" text-[var(--mainColor)] "> */}
                                    <span className="lg:max-w-[300px] xl:max-w-[400px] text-[16px] sm:text-[16px] md:text-[18px] font-bold text-[#4B4563]">{courseValue?.title}</span>
                                    {/* </span> */}
                                    <div className="min-w-[110px]">
                                        <Button
                                            label="Добавить"
                                            icon="pi pi-link"
                                            className="w-full"
                                            onClick={() => {
                                                handleFetchStreams();
                                                setVisible(true);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {hasStreams ? (
                        <>
                            <NotFound titleMessage={'Потоков пока нет'} />
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
                                            toggleIndex();
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
                                            <DataView value={streams} listTemplate={listTemplate} />
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
}
