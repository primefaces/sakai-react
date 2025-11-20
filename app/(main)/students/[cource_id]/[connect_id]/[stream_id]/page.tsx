'use client';

import MyDateTime from '@/app/components/MyDateTime';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchStreams, fetchStreamStudents } from '@/services/streams';
import { mainStreamsType } from '@/types/mainStreamsType';
import { OptionsType } from '@/types/OptionsType';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';

export default function StudentList() {
    const [studentList, setStudentList] = useState([]);
    const [hasList, setHasList] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [streams, setStreams] = useState<mainStreamsType[]>([]);
    const [stream, setStream] = useState<mainStreamsType | null>(null);

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const { cource_id, connect_id, stream_id } = useParams();
    const media = useMediaQuery('(max-width: 640px)');

    const options: OptionsType = {
        year: '2-digit',
        month: '2-digit', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24-часовой формат
    };

    // functions
    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    const handleFetchStreams = async () => {
        if (cource_id) {
            const data = await fetchStreams(cource_id ? Number(cource_id) : null);
            if (data) {
                setStreams(data);
            } else {
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

    const handleFetchStudents = async () => {
        const data = await fetchStreamStudents(connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null);
        toggleSkeleton();
        if (data) {
            setHasList(false);
            setStudentList(data);
        } else {
            setHasList(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    // USEECFFECTS

    useEffect(() => {
        handleFetchStreams();
        toggleSkeleton();
        handleFetchStudents();
    }, []);

    useEffect(() => {
        if (streams && streams?.length > 0 && stream_id) {
            const forStream = streams.find((item) => item.stream_id === Number(stream_id));
            if (forStream) {
                setStream(forStream);
            }
        }
    }, [streams]);

    return (
        <div className="main-bg">
            {skeleton ? (
                <GroupSkeleton count={studentList.length} size={{ width: '100%', height: '5rem' }} />
            ) : (
                <>
                    {/* info section */}
                    <div className="bg-[var(--titleColor)] relative flex flex-col justify-center items-center w-full text-white p-[30px] md:p-[40px] pb-4">
                        <h1 className="text-wrap break-words" style={{ color: 'white', fontSize: media ? '22px' : '26px', textAlign: 'center' }}>
                            {stream?.subject_name.name_ru}
                        </h1>

                        <div className="w-full flex flex-wrap flex-col sm:flex-row gap-3 justify-center text-[12px] sm:text-[14px]">
                            <span className="text-sm font-semibold">{stream?.semester?.name_ru}</span>

                            <div className="flex gap-1 items-center">
                                <span className="font-semibold">{stream?.subject_type_name?.name_ru}</span>
                                {/* <span>{stream?.teacher?.name}</span> */}
                            </div>
                            <div className="flex gap-1 items-center">
                                <span>Язык обучения: </span>
                                <span className="font-semibold">{stream?.language?.name}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span>Год обучения: </span>
                                <span className="font-semibold">20{stream?.id_edu_year}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span>Период: </span>
                                <span className="font-semibold">{stream?.period.name_ru}</span>
                            </div>
                            <div>
                                <span className="bg-[var(--greenColor)] text-[12px] text-center text-white p-1 rounded">{stream?.edu_form?.name_ru}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* table section */}
            {hasList ? (
                <NotFound titleMessage={'Данные временно не доступны'} />
            ) : (
                <div>
                    {skeleton ? (
                        <GroupSkeleton count={studentList.length} size={{ width: '100%', height: '4rem' }} />
                    ) : (
                        <>
                            <DataTable value={studentList} dataKey="id" emptyMessage="Нет данных" breakpoint="960px" rows={5} className="mini-table">
                                <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px' }}></Column>
                                <Column
                                    field="title"
                                    header="ФИО"
                                    style={{ width: '50%' }}
                                    body={(rowData) => (
                                        <div className="flex gap-1" key={rowData?.id}>
                                            <span>{rowData?.last_name}</span>
                                            <span>{rowData?.name}</span>
                                            <span>{rowData?.father_name}</span>
                                        </div>
                                    )}
                                ></Column>

                                <Column
                                    header="Балл"
                                    className="flex items-center border-b-0"
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2" key={rowData?.id}>
                                            {rowData?.score && rowData.score > 0 ? (
                                                <div className="flex justify-between items-center gap-2 ">
                                                    <b className={`${rowData.score > 30 ? 'text-[var(--greenColor)] p-1 w-[25px] text-center' : 'text-amber-400 p-1 w-[25px] text-center '}`}>{rowData.score}</b>
                                                    <i className="cursor-pointer pi pi-upload bg-[var(--mainColor)] text-white p-2 px-3 rounded" title="Сохранить в myedu"></i>
                                                    {/* <Button icon={'pi pi-arrow-right'} size='small' style={{ fontSize: '13px', padding: '4px 4px'}} label="myedu" /> */}
                                                </div>
                                            ) : (
                                                <b className={'text-[var(--redColor)] p-1 w-[25px]text-center'}>{rowData?.score}</b>
                                            )}
                                        </div>
                                    )}
                                />

                                <Column
                                    header="Последнее посещение"
                                    // style={{ width: '20%' }}
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2" key={rowData?.id}>
                                            {/* {rowData?.last_movement ? new Date(rowData.last_movement).toISOString().slice(0, 19).replace('T', ' ') : <i className="pi pi-minus"></i>} */}
                                            {rowData?.last_movement ? <MyDateTime createdAt={rowData?.last_movement} options={options} /> : <i className="pi pi-minus"></i>}
                                        </div>
                                    )}
                                />

                                <Column
                                    header="Выполненные действия"
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2" key={rowData?.id}>
                                            {rowData?.last_movement && (
                                                <Link
                                                    href={{
                                                        pathname: `/students/${cource_id}/${connect_id}/${stream_id}/${rowData?.id}/optional/optional`
                                                    }}
                                                >
                                                    <Button label="Данные" />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                />
                            </DataTable>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
