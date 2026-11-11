'use client';

import MyDateTime from '@/app/components/MyDateTime';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import useMediaQuery from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useLocalization } from '@/layout/context/localizationcontext';
import { fetchScoreValues, fetchStreams, fetchStreamStudents, sendMyeduScore } from '@/services/streams';
import { mainStreamsType } from '@/types/mainStreamsType';
import { OptionsType } from '@/types/OptionsType';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocalizedData } from '@/hooks/useLocalizedData';

export default function StudentList() {
    // types

    interface ScoreValueType {
        course: { id: number; title: string };
        teacher: { last_name: string; name: string };
        id_stream: number;
        score: number | null;
        schedule: { active: boolean; expired: boolean; from: string; to: string };
    }

    interface StudentType {
        id: number;
        export: boolean;
        score: number | null;
        last_movement: string;
        name: string;
        father_name: string;
        email: string;

    }

    const { cource_id, connect_id, edu_year, stream_id } = useParams();
    const media = useMediaQuery('(max-width: 640px)');
    console.log(cource_id, connect_id, edu_year, stream_id);

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
    const [exportBtnSkeleton, setExportBtnSkeleton] = useState(false);
    const { setMessage } = useContext(LayoutContext);
    const { translations } = useLocalization();
    const { getLocalized } = useLocalizedData();
    const showError = useErrorMessage();

    const searchParams = useSearchParams();
    const id_edu_year = searchParams.get('id_edu_year');
    console.log(id_edu_year);
    
    const options: OptionsType = {
        year: '2-digit',
        month: '2-digit', // 'long', 'short', 'numeric'`
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24‚
    };

    // functions
    const handleFetchStreams = async () => {
        if (cource_id) {
            const data = await fetchStreams(cource_id ? Number(cource_id) : null, id_edu_year ? Number(id_edu_year) : null);

            if (data) {
                setStreams(data);
            } else {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
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
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setSkeleton(false);
    };

    const handleFetchScoreValues = async (id_extra_type: number | null, stream_id: number, student_id: number | null, score: number | null) => {
        setStudentId(student_id);
        setStudentScore(score);
        setMyEduInfoVisible(true);
        setExportBtnSkeleton(true);
        const checkingExtraType = id_extra_type == null ? 0 : 1;
        // console.log(id_extra_type);
        // console.log(checkingExtraType);

        const data = await fetchScoreValues(checkingExtraType, stream_id, student_id);
        if (data) {
            const scoresArr: ScoreValueType[] = Object.values(data);
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
                    value: {
                        severity: 'error',
                        summary: data?.response?.data?.message,
                        detail: <div style={{ whiteSpace: 'pre-line' }}>{teachers()}</div>
                    }
                });
            }
        }
        setExportBtnSkeleton(false);
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
                value: { severity: 'success', summary: translations.sendSuccess, detail: '' }
            });
        } else {
            if (data?.response?.status == '400') {
                setMessage({
                    state: true,
                    value: {
                        severity: 'error',
                        summary: translations.errorTitle,
                        detail: data?.response?.data?.message
                    }
                });
            } else {
                showError(data.response.status);
            }
        }
        setStudentId(null);
        setStudentScore(null);
        setSkeleton(false);
    };

    const item = scoreValues?.[0]; // берем первый элемент безопасно
    const isExportDisabled = !item || !item.schedule?.active || !!item.schedule?.expired;

    const footerContent = (
        <div>
            <Button
                label={translations.back}
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
                label={translations.send}
                icon="pi pi-check"
                size="small"
                disabled={isExportDisabled}
                onClick={() => {
                    setMyEduInfoVisible(false);
                    handleSendMyeduScore(Number(stream_id), studentId, studentScore);
                }}
                autoFocus
            />
        </div>
    );

    // ===== Над компонентом =====
    const SUCCESS_CLASS = 'bg-[#dcfce7] text-[var(--greenColor)]';
    const WARNING_CLASS = 'bg-[#fef3c7] text-amber-500';
    const ERROR_CLASS = 'bg-[#fee2e2] text-[var(--redColor)]';

    const SPECIAL_MIN_SCORE = 1;
    const SPECIAL_MAX_SCORE = 30;
    const DEFAULT_MIN_SCORE = 30;


    const isOpenSend = Boolean(stream?.open_send);

    const getScoreState = (rowData: StudentType) => {
        const score = rowData?.score ?? 0;
        const isExported = Boolean(rowData?.export);

        if (isOpenSend) {
            // open_send = true: отправка от 1 до 30
            const isInRange = score >= SPECIAL_MIN_SCORE && score <= SPECIAL_MAX_SCORE;

            if (!isInRange) {
                return { colorClass: ERROR_CLASS, showButton: false };
            }

            return {
                colorClass: isExported ? SUCCESS_CLASS : WARNING_CLASS,
                showButton: !isExported,
            };
        }

        // open_send = false: отправка от 30
        return {
            colorClass: score >= DEFAULT_MIN_SCORE ? SUCCESS_CLASS : WARNING_CLASS,
            showButton: !isExported && score >= DEFAULT_MIN_SCORE,
        };
    };

    const moduleScoreContent = (rowData: StudentType) => {
        const { colorClass, showButton } = getScoreState(rowData);

        return (
            <div className="flex justify-between items-center gap-2">
                <b
                    className={`inline-flex items-center justify-center min-w-[40px] px-[8px] py-[4px] rounded-[8px] text-[0.8125rem] ${colorClass}`}
                >
                    {rowData?.score}
                </b>
                {showButton && (
                    <i
                        onClick={() =>
                            handleFetchScoreValues(
                                stream?.id_extra_type || null,
                                Number(stream_id),
                                rowData?.id || null,
                                rowData?.score
                            )
                        }
                        className="cursor-pointer pi pi-upload bg-[var(--mainColor)] text-white p-[8px] px-[12px] rounded-[10px] shadow-[0_6px_14px_-6px_rgba(8,169,230,0.7)] transition hover:opacity-90 hover:-translate-y-[1px]"
                        title={translations.saveToMyedu}
                    ></i>
                )}
            </div>
        );
    };

    // return (
    //     // ... ваша разметка
    //     <DataTable /* ваши пропсы */>
    //         {/* ... другие колонки */}

    //         <Column
    //             header={translations.score}
    //             body={(rowData: StudentType) => (
    //                 <div className="flex items-center gap-2">
    //                     {(rowData?.score ?? 0) > 0 ? (
    //                         moduleScoreContent(rowData)
    //                     ) : (
    //                         <b
    //                             className={`inline-flex items-center justify-center min-w-[40px] px-[8px] py-[4px] rounded-[8px] text-[0.8125rem] ${ERROR_CLASS}`}
    //                         >
    //                             {rowData?.score}
    //                         </b>
    //                     )}
    //                 </div>
    //             )}
    //         />

    //         {/* ... другие колонки */}
    //     </DataTable>
    // );


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
    //     console.log('finish stream ',stream);
    //     if(stream && stream?.open_send) {
    //         openSendRef.current = stream.open_send;
    //     } else if(stream && !stream?.open_send){
    //         openSendRef.current = false;
    //     }
    // },[stream]);

    // UI: поиск и статистика (только отображение, на загрузку баллов не влияет)
    const [search, setSearch] = useState('');
    const studentRows = studentList as any[];
    const scoredCount = studentRows.filter((s) => s?.score && s.score > 0).length;
    const exportedCount = studentRows.filter((s) => s?.export).length;
    const activeCount = studentRows.filter((s) => s?.last_movement).length;

    const statCard = (icon: string, label: string, value: number, tone: string) => (
        <div className="flex items-center gap-[12px] p-[12px] rounded-[14px] border border-[#eef2f6] bg-white min-w-[150px] flex-1">
            <span className={`flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-[12px] ${tone}`}>
                <i className={`pi ${icon} text-[1rem]`}></i>
            </span>
            <div className="flex flex-col leading-tight">
                <span className="text-[1.25rem] font-bold text-[var(--titleColor)]">{value}</span>
                <span className="text-[0.75rem] text-[var(--text-color-secondary)]">{label}</span>
            </div>
        </div>
    );

    const headerChip = (content: React.ReactNode, extra = '') => <span className={`inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-white/15 text-white text-[0.75rem] backdrop-blur-sm ${extra}`}>{content}</span>;

    return (
        <div className="main-bg">
            {skeleton ? (
                <GroupSkeleton count={studentList.length} size={{ width: '100%', height: '5rem' }} />
            ) : (
                <>
                    {/* info section */}
                    <div className="relative overflow-hidden rounded-[16px] bg-[var(--titleColor)] bg-gradient-to-br from-[var(--titleColor)] to-[var(--mainColor)] text-white p-[20px] md:p-[28px]">
                        <i className="pi pi-users absolute -right-[10px] -bottom-[20px] text-[120px] text-white/10 pointer-events-none"></i>
                        <div className="relative flex flex-col gap-[14px]">
                            <div className="flex items-center gap-[12px]">
                                <span className="flex shrink-0 items-center justify-center w-[44px] h-[44px] rounded-[12px] bg-white/15">
                                    <i className="pi pi-sitemap text-[1.125rem]"></i>
                                </span>
                                <h1 className="m-0 text-wrap break-words font-bold leading-tight" style={{ color: 'white', fontSize: media ? '20px' : '24px' }}>
                                    {getLocalized(stream?.subject_name, 'name') || stream?.subject_name.name_ru}
                                </h1>
                            </div>

                            <div className="w-full flex flex-wrap gap-[8px]">
                                {headerChip(
                                    <>
                                        <i className="pi pi-bookmark text-[0.6875rem]"></i>
                                        <span className="font-semibold">{getLocalized(stream?.semester, 'name') || stream?.semester?.name_ru}</span>
                                    </>
                                )}

                                {(stream?.id_extra_type === null || stream?.id_extra_type != null) &&
                                    headerChip(
                                        <>
                                            <i className={`pi ${stream?.id_extra_type === null ? 'pi-building' : 'pi-desktop'} text-[0.6875rem]`}></i>
                                            <span>{stream?.id_extra_type === null ? translations.auditItem : stream?.id_extra_type != null ? translations.notAuditItem : ''}</span>
                                        </>
                                    )}

                                {(getLocalized(stream?.subject_type_name, 'name') || stream?.subject_type_name?.name_ru) &&
                                    headerChip(
                                        <>
                                            <span className="font-semibold">{getLocalized(stream?.subject_type_name, 'name') || stream?.subject_type_name?.name_ru}</span>
                                            {/* <span>{stream?.teacher?.name}</span> */}
                                        </>
                                    )}
                                {headerChip(
                                    <>
                                        <i className="pi pi-globe text-[0.6875rem]"></i>
                                        <span>{translations.languageOfStudy}: </span>
                                        <span className="font-semibold">{stream?.language?.name}</span>
                                    </>
                                )}
                                {headerChip(
                                    <>
                                        <i className="pi pi-calendar text-[0.6875rem]"></i>
                                        <span>{translations.studyYear}: </span>
                                        <span className="font-semibold">20{stream?.id_edu_year}</span>
                                    </>
                                )}
                                {headerChip(
                                    <>
                                        <i className="pi pi-clock text-[0.6875rem]"></i>
                                        <span>{translations.period}: </span>
                                        <span className="font-semibold">{getLocalized(stream?.period, 'name') || stream?.period.name_ru}</span>
                                    </>
                                )}
                                {headerChip(<span className="font-semibold">{getLocalized(stream?.edu_form, 'name') || stream?.edu_form?.name_ru}</span>, '!bg-[var(--greenColor)]')}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* table section */}
            {hasList ? (
                <NotFound titleMessage={translations.dataTemporarilyUnavailable} />
            ) : (
                <div className="mt-[16px] flex flex-col gap-[14px]">
                    {skeleton ? (
                        <GroupSkeleton count={studentList.length} size={{ width: '100%', height: '4rem' }} />
                    ) : (
                        <>
                            {/* stats + search */}
                            <div className="flex flex-wrap gap-[10px]">
                                {statCard('pi-users', translations.students, studentRows.length, 'bg-[var(--mainColor)]/10 text-[var(--mainColor)]')}
                                {statCard('pi-star', translations.score, scoredCount, 'bg-[#fef3c7] text-[#d97706]')}
                                {statCard('pi-cloud-upload', translations.saveToMyedu, exportedCount, 'bg-[#dcfce7] text-[#16a34a]')}
                                {statCard('pi-history', translations.lastVisit, activeCount, 'bg-[#eef2ff] text-[#4f46e5]')}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[10px]">
                                <span className="p-input-icon-left w-full sm:w-[320px]">
                                    <i className="pi pi-search" />
                                    <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder={translations.search} className="w-full p-inputtext-sm rounded-[10px]" />
                                </span>
                                <div className="flex flex-wrap items-center gap-[12px] text-[0.75rem] text-[var(--text-color-secondary)]">
                                    <span className="inline-flex items-center gap-[6px]">
                                        <span className="w-[10px] h-[10px] rounded-full bg-[var(--greenColor)]"></span>&gt; 30
                                    </span>
                                    <span className="inline-flex items-center gap-[6px]">
                                        <span className="w-[10px] h-[10px] rounded-full bg-amber-400"></span>1 – 30
                                    </span>
                                    <span className="inline-flex items-center gap-[6px]">
                                        <span className="w-[10px] h-[10px] rounded-full bg-[var(--redColor)]"></span>0
                                    </span>
                                    <span className="inline-flex items-center gap-[6px]">
                                        <i className="pi pi-upload text-[var(--mainColor)]"></i>
                                        {translations.saveToMyedu}
                                    </span>
                                </div>
                            </div>

                            <DataTable
                                value={studentList}
                                dataKey="id"
                                emptyMessage={translations.loading}
                                loading={skeleton}
                                breakpoint="960px"
                                rows={5}
                                className="modern-table text-sm"
                                globalFilter={search}
                                globalFilterFields={['last_name', 'name', 'father_name']}
                            >
                                <Column
                                    body={(_, { rowIndex }) => <span className="text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{rowIndex + 1}</span>}
                                    header={translations.numberSign}
                                    style={{ width: '40px', textAlign: 'center' }}
                                ></Column>
                                <Column
                                    field="title"
                                    header={translations.fullName}
                                    style={{ width: '45%' }}
                                    body={(rowData) => (
                                        <div className="flex items-center gap-[10px]" key={rowData?.id}>
                                            <span className="flex shrink-0 items-center justify-center w-[34px] h-[34px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.75rem] font-bold uppercase">
                                                {rowData?.last_name?.[0]}
                                                {rowData?.name?.[0]}
                                            </span>
                                            <div className="flex flex-wrap gap-1 font-semibold text-[0.875rem] text-[var(--titleColor)]">
                                                <span>{rowData?.last_name}</span>
                                                <span>{rowData?.name}</span>
                                                <span className="font-normal text-[var(--text-color-secondary)]">{rowData?.father_name}</span>
                                            </div>
                                        </div>
                                    )}
                                ></Column>

                                <Column
                                    header={translations.score}
                                    body={(rowData) => {
                                        return (
                                            <div className="flex items-center gap-2" key={rowData?.id}>
                                                {rowData?.score && rowData.score > 0 ? (
                                                    // <div className="flex justify-between items-center gap-2">
                                                    //     <b
                                                    //         className={`inline-flex items-center justify-center min-w-[40px] px-[8px] py-[4px] rounded-[8px] text-[0.8125rem] ${rowData.score > 30 ? 'bg-[#dcfce7] text-[var(--greenColor)]' : 'bg-[#fef3c7] text-amber-500'
                                                    //             }`}
                                                    //     >
                                                    //         {rowData.score}
                                                    //     </b>
                                                    //     {!rowData?.export ? (
                                                    //         <i
                                                    //             onClick={() => handleFetchScoreValues(stream?.id_extra_type || null, Number(stream_id), rowData?.id || null, rowData?.score)}
                                                    //             className="cursor-pointer pi pi-upload bg-[var(--mainColor)] text-white p-[8px] px-[12px] rounded-[10px] shadow-[0_6px_14px_-6px_rgba(8,169,230,0.7)] transition hover:opacity-90 hover:-translate-y-[1px]"
                                                    //             title={translations.saveToMyedu}
                                                    //         ></i>
                                                    //     ) : (
                                                    //         ''
                                                    //     )}
                                                    // </div>
                                                    moduleScoreContent(rowData)
                                                ) : (
                                                    <b className={'inline-flex items-center justify-center min-w-[40px] px-[8px] py-[4px] rounded-[8px] bg-[#fee2e2] text-[var(--redColor)] text-[0.8125rem]'}>{rowData?.score}</b>
                                                )}
                                            </div>
                                        );
                                    }}
                                />

                                <Column
                                    header={translations.lastVisit}
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2 text-[13px] text-[var(--text-color-secondary)]" key={rowData?.id}>
                                            {/* {rowData?.last_movement ? new Date(rowData.last_movement).toISOString().slice(0, 19).replace('T', ' ') : <i className="pi pi-minus"></i>} */}
                                            {rowData?.last_movement ? (
                                                <span className="inline-flex items-center gap-[6px]">
                                                    <i className="pi pi-clock text-[0.75rem]"></i>
                                                    <MyDateTime createdAt={rowData?.last_movement} options={options} />
                                                </span>
                                            ) : (
                                                <i className="pi pi-minus text-[#cbd5e1]"></i>
                                            )}
                                        </div>
                                    )}
                                />

                                <Column
                                    header={translations.completedActions}
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2 text-white" key={rowData?.id}>
                                            {rowData?.last_movement && (
                                                <Link
                                                    className='text-white'
                                                    href={{
                                                        pathname: `/students/${cource_id}/${connect_id}/${stream_id}/${rowData?.id}/optional/optional/optional`,
                                                        // query: {id_edu_year: id_edu_year}
                                                    }}
                                                >
                                                    <Button label={translations.dataLabel} icon="pi pi-chart-bar" size="small" outlined className="rounded-[10px] text-white" />
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
                header={() => (
                    <div className="flex items-center gap-[12px]">
                        <span className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                            <i className="pi pi-cloud-upload text-[1rem]"></i>
                        </span>
                        <div className="flex flex-col gap-[2px]">
                            <span className="text-[1.0625rem] font-bold leading-tight text-[var(--titleColor)]">{translations.confirmationWindow}</span>
                            <span className="text-[0.75rem] font-normal text-[var(--text-color-secondary)]">{translations.saveToMyedu}</span>
                        </div>
                    </div>
                )}
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
                    {exportBtnSkeleton ? (
                        <div>
                            <GroupSkeleton count={1} size={{ width: '100%', height: '10rem' }} />
                        </div>
                    ) : hasScoreValue ? (
                        <div className="flex flex-col items-center justify-center gap-[10px] py-[28px] rounded-[14px] border border-dashed border-[#dbe3ea] bg-[#fbfdfe]">
                            <span className="flex items-center justify-center w-[48px] h-[48px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                                <i className="pi pi-inbox text-[1.25rem]"></i>
                            </span>
                            <b className="flex justify-center text-[var(--titleColor)]">{translations.dataNotAvailable}</b>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-[10px]">
                            {scoreValues?.map((item: ScoreValueType) => {
                                return (
                                    <div key={item?.course?.id} className="flex flex-col gap-[10px] text-[14px] sm:text-md rounded-[14px] border border-[#eef2f6] bg-white p-[14px]">
                                        <div className="flex items-start gap-[8px] justify-between">
                                            <b className="sm:text-md text-[var(--titleColor)] leading-snug">{item?.course?.title}</b>
                                            <span className="shrink-0 inline-flex items-center px-[8px] py-[3px] rounded-[8px] bg-[#f1f5f9] text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">
                                                {translations.idLabel}: {item?.id_stream}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-[8px] justify-between pt-[10px] border-t border-[#f1f5f9]">
                                            <p className="m-0 inline-flex items-center gap-[6px] text-[var(--text-color-secondary)]">
                                                <i className="pi pi-user text-[0.75rem]"></i>
                                                {item?.teacher?.last_name} {item?.teacher?.name}
                                            </p>
                                            <div className="inline-flex items-center gap-[6px] text-sm">
                                                <span className="text-[var(--text-color-secondary)]">{translations.score}:</span>
                                                <span className="inline-flex items-center justify-center min-w-[36px] px-[8px] py-[2px] rounded-[8px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] font-bold">{item?.score || 0}</span>
                                            </div>
                                        </div>
                                        {item?.schedule && (
                                            <div className="flex items-center gap-[8px] justify-between">
                                                <p className="m-0 inline-flex items-center gap-[6px] text-[var(--text-color-secondary)]">
                                                    <i className="pi pi-calendar text-[0.75rem]"></i>
                                                    {translations.periodExportShedule}
                                                </p>
                                                <div className="text-[12px] flex flex-wrap justify-end items-center gap-1 font-medium text-[var(--titleColor)]">
                                                    <MyDateTime createdAt={item.schedule.from} options={options} />
                                                    <i>-</i>
                                                    <MyDateTime createdAt={item.schedule.to} options={options} />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-[8px] justify-between">
                                            <p className="m-0 inline-flex items-center gap-[6px] text-[var(--text-color-secondary)]">
                                                <i className="pi pi-info-circle text-[0.75rem]"></i>
                                                {translations.status}
                                            </p>
                                            {item?.schedule?.active ? (
                                                <div className="text-[12px] text-[var(--greenColor)] bg-[#dcfce7] px-[8px] py-[4px] rounded-full flex flex-wrap justify-end items-center gap-1">
                                                    <i className="pi pi-check-circle"></i>
                                                    {/*<span>{translations.accessExportStatus}</span>*/}
                                                </div>
                                            ) : (
                                                <div className="text-[12px] text-[var(--redColor)] bg-[#fee2e2] px-[8px] py-[4px] rounded-full flex flex-wrap justify-end items-center gap-1">
                                                    <i className="pi pi-times-circle"></i>
                                                    {/*<span>{translations.accessExportStatusFalse}</span>*/}
                                                </div>
                                            )}
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
