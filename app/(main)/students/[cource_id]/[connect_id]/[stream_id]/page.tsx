'use client';

import MyDateTime from '@/app/components/MyDateTime';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import useMediaQuery from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchScoreValues, fetchStreams, fetchStreamStudents, sendMyeduScore } from '@/services/streams';
import { mainStreamsType } from '@/types/mainStreamsType';
import { OptionsType } from '@/types/OptionsType';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { useContext, useEffect, useState } from 'react';

export default function StudentList() {
    // types

    interface ScoreValueType {
        course: { id: number; title: string };
        teacher: { last_name: string; name: string };
        id_stream: number;
        score: number | null;
    }

    const { cource_id, connect_id, stream_id } = useParams();
    const media = useMediaQuery('(max-width: 640px)');

    const [studentList, setStudentList] = useState([]);
    const [hasList, setHasList] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [streams, setStreams] = useState<mainStreamsType[]>([]);
    const [stream, setStream] = useState<mainStreamsType | null>(null);
    const [myEduInfoVisible, setMyEduInfoVisible] = useState<boolean>(false);
    const [hasScoreValue, setHasScoreValue] = useState<boolean>(false);
    const [scoreValues, setScoreValues] = useState<ScoreValueType[]>([]);
    const [studentId, setStudentId] = useState<number | null>(null);
    const [studentScore, setStudentScore] = useState<number | null>(null);

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

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
        setSkeleton(true);
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
        setSkeleton(false);
    };

    const handleFetchScoreValues = async (stream_id: number, student_id: number | null, score: number) => {
        setStudentId(student_id);
        setStudentScore(score);
        setMyEduInfoVisible(true);
        setSkeleton(true);
        const data = await fetchScoreValues(stream_id, student_id);
        if (data) {
            const scoresArr: ScoreValueType[] = Object.values(data);
            console.log(scoresArr);
            if (scoresArr && scoresArr?.length > 0) {
                setScoreValues(scoresArr);
                setHasScoreValue(false);
            } else if (scoresArr?.length < 1) {
                setHasScoreValue(true);
            }
        } else {
            setHasScoreValue(true);
            if (data?.response?.status == '400') {
                const teachers = () => {
                    if (data?.response?.data?.teacher) {
                        return (
                            <div className="flex flex-col gap-2">
                                <div className={`flex gap-1 flex-col`}>
                                    <span>
                                        {data?.response?.data?.teacher?.last_name} {data?.response?.data?.teacher?.name && data?.response?.data?.teacher?.name[0] + '.'}{' '}
                                        {data?.response?.data?.teacher?.father_name && data?.response?.data?.teacher?.father_name.length > 1 && data?.response?.data?.teacher?.father_name[0] + '.'}
                                    </span>
                                </div>
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
            }
        }
        setSkeleton(false);
    };

    const handleSendMyeduScore = async (stream_id: number, student_id: number | null, score: number | null) => {
        setMyEduInfoVisible(false);
        setSkeleton(true);
        const data = await sendMyeduScore(stream_id, student_id, score);

        if (data.success) {
            handleFetchStudents();
            const scoresArr: ScoreValueType[] = Object.values(data);
            if (scoresArr && scoresArr?.length > 0) {
                setScoreValues(scoresArr);
                setHasScoreValue(false);
            } else if (scoresArr?.length < 1) {
                setHasScoreValue(true);
            }
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно отправлен!', detail: '' }
            });
        } else {
            if (data?.response?.status == '400') {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                });
            } else {
                showError(data.response.status);
            }
        }
        setStudentId(null);
        setStudentScore(null);
        setSkeleton(false);
    };

    const footerContent = (
        <div>
            <Button
                label={'Назад'}
                className="reject-button"
                icon="pi pi-times"
                size="small"
                onClick={() => {
                    setMyEduInfoVisible(false);
                    setStudentId(null);
                    setStudentScore(null);
                }}
            />

            <Button
                label={'Отправить'}
                icon="pi pi-check"
                size="small"
                onClick={() => {
                    setMyEduInfoVisible(false);
                    handleSendMyeduScore(Number(stream_id), studentId, studentScore);
                }}
                autoFocus
            />
        </div>
    );

    // USEECFFECTS

    useEffect(() => {
        handleFetchStreams();
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

    // useEffect(()=> {
    //     console.log(studentId, studentScore);
    // },[studentId, studentScore]);

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
                            <DataTable value={studentList} dataKey="id" emptyMessage="Загрузка" loading={skeleton} breakpoint="960px" rows={5} className="mini-table">
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
                                                <div className="flex justify-between items-center gap-2">
                                                    <b className={`${rowData.score > 30 ? 'text-[var(--greenColor)] p-1 w-[25px] text-center' : 'text-amber-400 p-1 w-[25px] text-center '}`}>{rowData.score}</b>
                                                    {!rowData?.export ? (
                                                        <i
                                                            onClick={() => handleFetchScoreValues(Number(stream_id), rowData?.id || null, rowData?.score)}
                                                            className="cursor-pointer pi pi-upload bg-[var(--mainColor)] text-white p-2 px-3 rounded"
                                                            title="Сохранить в myedu"
                                                        ></i>
                                                    ) : (
                                                        ''
                                                    )}
                                                    {/* <i onClick={()=> console.log(rowData)} className="cursor-pointer pi pi-upload bg-[var(--mainColor)] text-white p-2 px-3 rounded" title="Сохранить в myedu"></i> */}
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
                                                        pathname: `/students/${cource_id}/${connect_id}/${stream_id}/${rowData?.id}/optional/optional/optional`
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

            {/* dialog */}
            <Dialog
                header={'Окно подтверждение'}
                className="p-2 w-[90%] sm:w-[600px] max-h-[400px]"
                visible={myEduInfoVisible}
                onHide={() => {
                    if (!myEduInfoVisible) return;
                    setMyEduInfoVisible(false);
                    setStudentId(null);
                    setStudentScore(null);
                }}
                footer={footerContent}
            >
                <>
                    {hasScoreValue ? (
                        <div>
                            <b className="flex justify-center">Данные не доступны</b>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {scoreValues?.map((item: ScoreValueType) => {
                                return (
                                    <div key={item?.course?.id} className={`flex flex-col gap-2 ${scoreValues.length > 1 && 'p-2 lesson-card-border shadow'}`}>
                                        <div className="flex items-center gap-1 justify-between">
                                            <b className="sm:text-md">{item?.course?.title}</b>
                                            <div className="text-sm">
                                                <span>Id:</span> <span className="text-[var(--mainColor)]"> {item?.id_stream}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 justify-between">
                                            <p className="m-0">
                                                {item?.teacher?.last_name} {item?.teacher?.name}
                                            </p>
                                            <div className="text-sm">
                                                <span>Балл:</span> <span className="text-[var(--mainColor)]"> {item?.score || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            </Dialog>
        </div>
    );
}
