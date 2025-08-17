'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { connectStreams, fetchStreams } from '@/services/streams';
import { getToken } from '@/utils/auth';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { NotFound } from '../NotFound';

export default function StreamList({ callIndex, courseValue, isMobile }: { callIndex: number; courseValue: { id: number | null; title: string } | null; isMobile: boolean }) {
    const streamList = [
        {
            created_at: '',
            id: 1,
            image: '',
            status: true,
            title: 'lorem-1 lorem-1 lorem-1lorem-1lorem-1lorem-1lorem-1',
            user_id: 1
        },
        {
            created_at: '',
            id: 2,
            image: '',
            status: true,
            title: 'lorem-2',
            user_id: 2
        },
        {
            created_at: '',
            id: 3,
            image: '',
            status: true,
            title: 'lorem-3',
            user_id: 3
        },
        {
            created_at: '',
            id: 4,
            image: '',
            status: true,
            title: 'lorem-4',
            user_id: 4
        },
        {
            created_at: '',
            id: 5,
            image: '',
            status: true,
            title: 'lorem-5',
            user_id: 5
        }
    ];

    // type
    interface StreamsType {}

    const [streams, setStreams] = useState<StreamsType[]>([]);
    const [streamValues, setStreamValues] = useState({ value: courseValue, streams: [] });
    const [displayStreams, setDisplayStreams] = useState([]);
    const [hasStreams, setHasStreams] = useState(false);

    const [skeleton, setSkeleton] = useState(false);

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    [
        {
            courseId: 1,
            streams: [1, 2]
        }
    ];

    const handleFetchStreams = async (page = 1) => {
        const token = getToken('access_token');
        const data = await fetchStreams();
        console.log(data);

        if (data?.courses) {
            setHasStreams(false);
            setStreams(data.courses.data);
            // setPagination({
            //     currentPage: data.courses.current_page,
            //     total: data.courses.total,
            //     perPage: data.courses.per_page
            // });
        } else {
            setHasStreams(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleConnect = async () => {
        const token = getToken('access_token');
        const data = await connectStreams(courseValue);
        console.log(data);

        if (data?.success) {
            toggleSkeleton();
            handleFetchStreams();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при связке' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const clearValues = () => {
        // ?
    };

    const handleEdit = (e, id: number, title: string) => {
        console.log(e.checked);

        const forSentStreams = {
            stream_id: id,
            stream_title: title
        };

        if (e.checked) {
            setStreamValues(
                (prev) =>
                    prev && {
                        ...prev,
                        streams: [...prev.streams, forSentStreams]
                    }
            );
        } else {
            setStreamValues(
                (prev) =>
                    prev && {
                        ...prev,
                        streams: [...prev.streams.filter((item) => item?.stream_id !== id)]
                    }
            );
        }
    };

    useEffect(() => {
        console.log('отправляемый поток ', streamValues);
        const forDisplay = streamValues.streams.map((item, idx) => {
            if (idx <= 2) {
                return item;
            }
        });

        setDisplayStreams(forDisplay);
    }, [streamValues]);

    useEffect(() => {
        console.log('Id ', courseValue);
    }, [courseValue]);

    useEffect(() => {
        console.log('Потоки ', streams);

        if (streams.length < 1) {
            // setHasStreams(true);
        } else {
            if (streams.length > 0) {
                // setForStreamId({ id: courses[0].id, title: courses[0].title });
            }
            // setHasStreams(false);
        }
    }, [streams]);

    return (
        <>
            {callIndex === 1 && (
                <div className="p-1 sm:py-4 px-2">
                    {/* info section */}
                    {!isMobile && (
                        <div className="flex justify-between items-center mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                            <h3 className="text-[32px] m-0">Агымдар</h3>
                            <Button
                                label="Байлоо"
                                icon="pi pi-link"
                                onClick={() => {
                                    // setEditMode(false);
                                    // clearValues();
                                    // setFormVisible(true);
                                }}
                            />
                        </div>
                    )}

                    {hasStreams ? (
                        <NotFound titleMessage={'Агымдар азырынча жок'} />
                    ) : (
                        <div className="flex flex-col gap-2 sm:gap-4">
                            {isMobile && (
                                <div className="flex">
                                    <Button
                                        label="Байлоо"
                                        icon="pi pi-link"
                                        onClick={() => {
                                            // setEditMode(false);
                                            // clearValues();
                                            // setFormVisible(true);
                                        }}
                                    />
                                </div>
                            )}

                            <div className="max-h-[450px] overflow-y-scroll">
                                {/* {skeleton ? (
                                                <GroupSkeleton count={courses.length} size={{ width: '100%', height: '4rem' }} />
                                            ) : ( */}
                                <>
                                    {/* <StreamList courseValue={forStreamId} courseInsideTitle=''/> */}
                                    <DataTable value={streamList} breakpoint="960px" dataKey={'id'} rows={5} className="my-custom-table">
                                        <Column body={(_, { rowIndex }) => rowIndex + 1} header="Номер" style={{ width: '20px' }}></Column>
                                        <Column
                                            field="title"
                                            header="Аталышы"
                                            style={{ width: '80%' }}
                                            sortable
                                            body={
                                                (rowData) => (
                                                    // <Link href={`/course/${rowData.id}`} key={rowData.id}>
                                                    // {
                                                    <div className="p-[10px]">{rowData.title}</div>
                                                )
                                                // }
                                                // </Link>
                                            }
                                        ></Column>

                                        <Column
                                            header="Курска байлоо"
                                            style={{margin: '0 3px', textAlign: 'center' }}
                                            body={(rowData) => (
                                                <label className="custom-radio">
                                                    <input type="checkbox" className={`customCheckbox`} onChange={(e) => handleEdit(e.target, rowData.id, rowData.title)} />
                                                    <span className="checkbox-mark"></span>
                                                </label>
                                            )}
                                        ></Column>
                                    </DataTable>
                                </>
                                {/* )} */}
                            </div>

                            {courseValue?.title && (
                                <div className="flex flex-col items-start justify-center gap-2 text-[14px]">
                                    <div className="flex items-center gap-1">
                                        <span className="w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] block border bg-[var(--greenColor)] rounded-4xl"></span>
                                        <span className="text-[16px] font-bold">Курстун аталышы: {courseValue?.title}</span>
                                    </div>
                                    <div className="w-full flex items-center gap-2">
                                        <div className="w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] border bg-[yellow]"></div>
                                        <div className="flex flex-col gap-1">
                                            {streamValues.streams?.length < 1 && <span className="text-[13px]">Курска байлоо үчүн агымдарды тандаңыз</span>}
                                            {displayStreams.map((item) => {
                                                return <div className="">{item?.stream_title}</div>;
                                            })}
                                            <div>{displayStreams.length >= 3 && '...'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
