'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchStreams, newConnectStreams } from '@/services/streams';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import { streamsType } from '@/types/streamType';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { mainStreamsType } from '@/types/mainStreamsType';
import Link from 'next/link';
import { useLocalization } from '@/layout/context/localizationcontext';
import { useLocalizedData } from '@/hooks/useLocalizedData';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { studentEduYear } from '@/services/studentMain';

interface EduYearType {
    id: number;
    name_ru: string;
}

const StreamList = React.memo(function StreamList({
    callIndex,
    courseValue,
    isMobile,
    fetchprop,
    close,
    audit
}: {
    callIndex: number;
    courseValue: { id: number | null; title: string } | null;
    isMobile: boolean;
    fetchprop: () => void;
    close?: () => void;
    audit: string;
}) {
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const { language, translations } = useLocalization();
    const { getLocalized } = useLocalizedData();

    const [streams, setStreams] = useState<mainStreamsType[]>([]);
    const [dialogStreams, setDialogStreams] = useState<mainStreamsType[]>([]);
    const [hasStreams, setHasStreams] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [visible, setVisible] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<streamsType[]>([]);
    const [emptyCourse, setEmptyCourse] = useState(false);
    const [sendStream_id, setSendStream_id] = useState<number | null>(null);
    const [active, setActive] = useState(false);
    const [nameLang, setNameLang] = useState<'name_ru' | 'name_kg'>('name_ru');
    const [auditTitle, setAuditTitle] = useState<string | null>(null);
    const [dialogSkeleton, setDialogSkeleton] = useState(false);
    const [auditState, setAuditState] = useState<boolean | null>(null);

    const [expandedRows, setExpandedRows] = useState<any | null>(null);

    const [courseConnectInfo, setCourseConnectInfo] = useState(false);

    const [eduYearOpt, setEduYearOpt] = useState<EduYearType[]>([]);
    const [eduYearSelected, setEduYearSelected] = useState<EduYearType>();

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    const profilactor = (data: mainStreamsType[]) => {
        const newStreams: streamsType[] = [];

        data?.forEach((item) => {
            if (item?.connect_id) {
                newStreams.push({
                    course_id: item?.course_id || null,
                    stream_id: item?.stream_id,
                    info: '',
                    id_curricula: item?.id_curricula,
                    id_subject: item?.subject_name?.id,
                    subject_type: item?.subject_type_name?.short_name_ru ? item?.subject_type_name?.short_name_ru : '',
                    id_subject_type: item?.subject_type_name?.id,
                    id_edu_year: item?.id_edu_year,
                    id_period: item?.id_period,
                    id_speciality: item?.speciality?.id,
                    id_faculty: item?.speciality?.id_faculty,
                    stream_title: item?.subject_name?.name_ru //
                });
            }
        });

        setPendingChanges((prev) => {
            const pendingIds = new Set(prev.map((p) => p.stream_id));
            const uniqueNewStreams = newStreams.filter((s) => !pendingIds.has(s.stream_id));
            return [...prev, ...uniqueNewStreams];
        });
    };

    const auditProcessing = (audit: boolean | null, data: mainStreamsType[]) => {
        if (audit === null) {
            return [];
        }

        if (audit === true) {
            const result = data?.filter((item: mainStreamsType) => item?.id_extra_type === null);
            return result;
        }

        if (audit === false) {
            const result = data?.filter((item: mainStreamsType) => item?.id_extra_type != null);
            return result;
        }
    };

    const handleFetchStreams = async (audit: boolean | null, id_edu_year: number | null) => {
        setDialogSkeleton(true);
        const data = await fetchStreams(courseValue ? courseValue?.id : null, id_edu_year);
        // setStreamValues({ stream: [] });
        setPendingChanges([]);
        setSendStream_id(null);
        if (data) {
            profilactor(data);
            setHasStreams(false);
            const forDate = auditProcessing(audit, data);

            setDialogStreams(forDate ?? data);
            setStreams(data);
        } else {
            setHasStreams(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setDialogSkeleton(false);
    };

    const handleConnect = async (id_stream: number, active: boolean) => {
        // const data = await connectStreams({ course_id: courseValue?.id ? courseValue?.id : null, stream: pendingChanges });
        setSkeleton(true);
        const data = await newConnectStreams({ course_id: courseValue?.id ? courseValue?.id : null, id_stream: id_stream, active: active });

        if (data?.success) {
            fetchprop();
            toggleSkeleton();
            handleFetchStreams(auditState, eduYearSelected ? eduYearSelected.id  : null);
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.successAdd, detail: '' }
            });
        } else {
            const teachers = () => {
                if (data?.teachers?.length) {
                    return (
                        <div className="flex flex-col gap-2">
                            <span>{data?.message}</span>
                            {data.teachers?.map((item: any, idx: number) => {
                                return (
                                    <div key={idx} className={`flex gap-1 flex-col`}>
                                        <span>
                                            {item?.last_name} {item?.name && item?.name[0] + '.'} {item?.father_name && item?.father_name?.length > 1 && item?.father_name[0] + '.'}
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
            if (data?.status === 400) {
                if (data?.teachers?.length) {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: data?.message, detail: <div style={{ whiteSpace: 'pre-line' }}>{teachers()}</div> }
                    });
                } else {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                }
            } else {
                showError(data?.response?.status);
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: data?.teachers?.length ? '' : translations.addError, detail: data?.teachers?.length ? <div style={{ whiteSpace: 'pre-line' }}>{teachers()}</div> : translations.addError }
                });
            }
        }
        setSkeleton(false);
    };

    const handleEdit = (e: {checked: boolean} , item: mainStreamsType) => {
        const { stream_id } = item;
        const isChecked = e.checked;

        setSendStream_id(stream_id);
        if (isChecked) {
            setActive(true);
            handleConnect(stream_id, true);
        } else {
            setActive(false);
            handleConnect(stream_id, false);
        }
    };

    const formatEduYear = (): number => {
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();

        // С сентября (9) по декабрь — новый учебный год начался
        // С января по август — всё ещё предыдущий учебный год
        const startYear = month >= 9 ? year : year - 1;
        const endYear = String(startYear + 1).slice(-2);

        // return `${startYear}-${endYear}`;
        return Number(String(startYear).slice(-2));
    };

    const handleFetchEduYear = async ()=> {
        const data = await studentEduYear();
        if (data) {
            setEduYearOpt(data);
            const date = formatEduYear();
            const currentDate = data?.find((item: EduYearType)=> item?.id === date);
            if(currentDate){
                setEduYearSelected(currentDate);
            }
        }
    }

    useEffect(() => {
        if (language === 'ru') {
            setNameLang('name_ru');
        } else if (language === 'ky') {
            setNameLang('name_kg');
        }
    }, [language]);

    useEffect(() => {
        toggleSkeleton();
        if (courseValue?.id && eduYearSelected) {
            handleFetchStreams(null, eduYearSelected.id);
        }
    }, [courseValue, eduYearSelected]);

    useEffect(() => {
        if (streams?.length < 1) {
            setEmptyCourse(true);
            setHasStreams(true);
        } else {
            const hasData = streams?.some((item) => item?.connect_id !== null);
            if (hasData) {
                setEmptyCourse(false);
            } else {
                setEmptyCourse(true);
            }
            setHasStreams(false);
        }
    }, [streams]);

    useEffect(()=> {
        handleFetchEduYear();
    },[]);

    const connectConfirm = (e: any, item: mainStreamsType) => {
        confirmDialog({
            message: translations.streamConnectConfirm,
            header: translations.confirmation,
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: ()=> handleEdit(e, item),
            rejectLabel: translations.cancel,
            rejectClassName: 'reject-button',
            acceptLabel: translations.next
        });
    };

    const itemTemplate = (item: mainStreamsType, index: number) => {
        const bgClass = index % 2 == 0 ? 'bg-[#f5f5f5]' : '';
        return (
            <div className={`w-full ${bgClass}`} key={item?.stream_id}>
                <div className={`flex flex-column p-2 gap-2`}>
                    <div className="w-full flex justify-between gap-1 items-center">
                        <h3 className="m-0 text-lg">{getLocalized(item?.subject_name, 'name') || item?.subject_name[nameLang]}</h3>
                        <small className="underline text-[var(--mainColor)]">Id: {item?.stream_id}</small>
                    </div>
                    <div className="flex flex-column xl:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-2">
                        <div className="w-full sm:w-[70%] flex flex-col order-2 xl:order-1 gap-1 items-start text-[12px] sm:text-[14px]">
                            <div className="flex gap-1 items-center text-[var(--mainColor)]">
                                <span>{getLocalized(item?.subject_type_name, 'name') || item?.subject_type_name?.name_ru}</span>
                            </div>
                            <div className="flex gap-1 items-center text-[var(--mainColor)]">{item?.id_extra_type === null ? translations.auditItem : item?.id_extra_type != null ? translations.notAuditItem : ''}</div>
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">{translations.languageOfStudy}: </span>
                                <span>{item?.language?.name}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">{translations.studyYear}: </span>
                                <span className="font-semibold">20{item?.id_edu_year}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">{translations.period}: </span>
                                <span>{getLocalized(item?.period, 'name') || item?.period[nameLang]}</span>
                            </div>
                            <div className="flex gap-1 items-center" title={item?.speciality.name_ru}>
                                <span className="text-[var(--mainColor)] ">{translations.speciality}: </span>
                                <span className="max-w-[170px] sm:max-w-[800px] text-nowrap text-ellipsis overflow-hidden">{getLocalized(item?.speciality, 'name') || item?.speciality[nameLang]}</span>
                            </div>
                        </div>
                        <div className="flex flex-col order-1 xl:order-2 align-items-center gap-2">
                            <span className="font-semibold">{getLocalized(item?.semester, 'name') || item?.semester?.name_ru}</span>
                            <span className="bg-[var(--greenColor)] text-[12px] text-white p-1 rounded">{getLocalized(item?.edu_form, 'name') || item?.edu_form[nameLang]}</span>
                            {item.connect_id && (
                                <Link href={`/students/${courseValue?.id}/${item.connect_id}/${item.stream_id}`} className="underline text-sm">
                                    {translations.students}
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
                <p className="text-[16px] text-center font-bold">{translations.noLinkedStreams}</p>
            </div>
        );
    };

    const rowExpansionTemplate = (data: mainStreamsType) => {
        const course = data?.course;

        const truncate = (text: string, length: number) => {
            if (!text) return '';
            return text.length > length ? text.substring(0, length) + '...' : text;
        };

        const formatDate = (dateString: string) => {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString();
        };

        return (
            <div className="p-3 bg-gray-50">
                {data?.course != null ? (
                    <>
                        <div className="mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">{translations.courseStreamConnect}</div>
                        <table className="w-full bg-white text-left border-collapse shadow-sm rounded ">
                            <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase">
                                <tr>
                                    <th className="px-3 py-2 border-b border-gray-200 font-bold">{translations.streamName || 'Course'}</th>
                                    <th className="px-3 py-2 border-b border-gray-200 font-bold">{translations.courseName || 'Course'}</th>
                                    <th className="px-3 py-2 border-b border-gray-200 font-bold">{translations.description || 'Description'}</th>
                                    <th className="px-3 py-2 border-b border-gray-200 font-bold whitespace-nowrap">Дата</th>
                                </tr>
                            </thead>
                            <tbody className="text-[12px] text-gray-600">
                                {course ? (
                                    <tr>
                                        <td className="px-3 py-2 border-b border-gray-100 font-medium text-gray-800">{getLocalized(data?.subject_name, 'name') || data?.subject_name?.name_ru}</td>
                                        <td className="px-3 py-2 border-b border-gray-100 font-medium text-gray-800">{course.title}</td>
                                        <td className="px-3 py-2 border-b border-gray-100 leading-relaxed">{truncate(course.description, 120)}</td>
                                        <td className="px-3 py-2 border-b border-gray-100 whitespace-nowrap">{formatDate(course.created_at)}</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-3 py-4 text-center text-gray-400 italic">
                                            {translations.noData}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <>{translations.notCourseConnections}</>
                )}
            </div>
        );
    };

    const toggleRow = (rowData: any) => {
        setExpandedRows((prev: any) => {
            // если вдруг null/undefined
            const current = prev ? { ...prev } : {};

            const id = rowData.stream_id;

            if (current[id]) {
                // если уже открыт → закрываем
                delete current[id];
            } else {
                // если закрыт → открываем
                current[id] = true;
            }

            return current;
        });
    };

    const DialogOpenBtns = () => {
        if (audit !== 'extra') {
            return (
                <div className="min-w-[110px]">
                    <Button
                        // label={emptyCourse ? translations.addStream : translations.streams}
                        // аудиторные не аудиторные
                        label={translations.audit}
                        // icon="pi pi-link"
                        icon="pi pi-building"
                        className="w-full"
                        style={{ fontSize: '13px' }}
                        size="small"
                        onClick={() => {
                            handleFetchStreams(true, eduYearSelected ? eduYearSelected.id  : null);
                            setVisible(true);
                            setAuditTitle(translations.audit);
                            setAuditState(true);
                        }}
                    />
                </div>
            );
        }

        if (audit === 'extra') {
            return <div className="min-w-[110px]">
                <Button
                    label={translations.notAudit}
                    // icon="pi pi-link"
                    icon="pi pi-desktop"
                    className="w-full"
                    style={{ fontSize: '13px' }}
                    size="small"
                    onClick={() => {
                        handleFetchStreams(false, eduYearSelected ? eduYearSelected.id  : null);
                        setVisible(true);
                        setAuditTitle(translations.notAudit);
                        setAuditState(false);
                    }}
                />
            </div>;
        }
    };

    return (
        <>
            <Dialog
                header={() => (
                    <div className={'items-center flex justify-between'}>
                        {auditTitle}{' '}
                        <i
                            onClick={(e) => {
                                e.stopPropagation(); // ключевая строка
                                setCourseConnectInfo(true);
                            }}
                            className={'pi pi-info-circle text-lg text-[var(--titleColor)]'}
                        ></i>{' '}
                    </div>
                )}
                visible={visible}
                className={`${streams.length < 1 ? '' : 'w-[95%]'}`}
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                    setAuditState(null);
                }}
            >
                {dialogSkeleton ? (
                    <GroupSkeleton count={1} size={{ width: '100%', height: '15rem' }} />
                ) : hasStreams ? (
                    <p className="text-[16px] text-center font-bold">{translations.dataTemporarilyUnavailable}</p>
                ) : dialogStreams && dialogStreams.length > 0 ? (
                    <DataTable
                        value={dialogStreams}
                        className="w-full my-custom-table text-sm"
                        loading={skeleton}
                        dataKey="stream_id"
                        emptyMessage={translations.noData}
                        key={JSON.stringify(pendingChanges)}
                        expandedRows={expandedRows}
                        onRowToggle={(e: any) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        responsiveLayout="stack"
                        breakpoint="960px"
                        rows={5}
                    >
                        <Column expander style={{ width: '2rem' }} />
                        <Column body={(_, { rowIndex }) => rowIndex + 1} header={() => <div className="text-[13px]">{translations.numberSign}</div>}></Column>
                        <Column body={(rowIndex) => <span>{rowIndex?.stream_id}</span>} header={() => <div className="text-[13px]">ID</div>}></Column>

                        <Column
                            field="title"
                            header={() => <div className="text-[13px]">{translations.streamName}</div>}
                            body={(rowData) => (
                                // <p key={rowData.id}></p>
                                <p key={rowData.id}>{getLocalized(rowData?.subject_name, 'name') || rowData?.subject_name?.name_ru}</p>
                            )}
                        ></Column>

                        <Column
                            field="title"
                            header={() => <div className="text-[13px]">{translations.speciality}</div>}
                            body={(rowData) => (
                                <div className="max-w-[250px] scrollbar-thin overflow-x-scroll">
                                    <p key={rowData?.id}>{getLocalized(rowData?.speciality, 'name') || rowData?.speciality?.name_ru}</p>
                                </div>
                            )}
                        ></Column>

                        <Column header={() => <div>{translations.languageOfStudy}</div>} body={(rowData) => <p key={rowData?.id}>{rowData?.language?.name}</p>}></Column>

                        <Column field="title" header={() => <div className="text-[13px]">{translations.studyYear}</div>} body={(rowData) => <p key={rowData?.id}>20{rowData?.id_edu_year}</p>}></Column>
                        <Column field="title" header={() => <div className="text-[13px]">{translations.period}</div>} body={(rowData) => <p key={rowData?.id}>{getLocalized(rowData?.period, 'name') || rowData?.period.name_ru}</p>}></Column>

                        <Column field="title" header={() => <div className="text-[13px]">{translations.semester}</div>} body={(rowData) => <p key={rowData?.id}>{getLocalized(rowData?.semester, 'name') || rowData?.semester.name_ru}</p>}></Column>

                        <Column field="title" header={() => <div className="text-[13px]">{translations.studyForm}</div>} body={(rowData) => <p key={rowData?.id}>{getLocalized(rowData?.edu_form, 'name') || rowData?.edu_form.name_ru}</p>}></Column>

                        <Column
                            field="title"
                            header={() => <div className="text-[13px]">{translations.studyType}</div>}
                            body={(rowData) => (
                                <p key={rowData?.id}>
                                    {rowData?.id_extra_type === null
                                        ? getLocalized(rowData?.subject_type_name, 'short_name') || rowData?.subject_type_name?.short_name_ru
                                        : rowData?.id_extra_type != null && rowData?.subject_type_name === null
                                        ? getLocalized(rowData?.extra_type, 'short_name') || rowData?.extra_type?.short_name_ru
                                        : ''}
                                </p>
                            )}
                        ></Column>

                        <Column
                            field="title"
                            style={{ width: '3rem', textAlign: 'center' }}
                            header={() => <div className="text-[13px] flex justify-center">Связь</div>}
                            body={(rowData) => <i onClick={() => toggleRow(rowData)} className={`text-sm ${rowData?.course != null ? 'pi pi-check text-[green]' : 'pi pi-minus text-[red]'}`}></i>}
                        ></Column>

                        <Column
                            header={() => <div className="text-[13px]">{translations.streamConnection}</div>}
                            style={{ margin: '0 3px', textAlign: 'center', width: '4rem' }}
                            body={(rowData) => (
                                <>
                                    <label className="custom-radio">
                                        <input
                                            type="checkbox"
                                            className={`customCheckbox`}
                                            checked={pendingChanges.some((s) => s?.stream_id === rowData?.stream_id)}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                if (rowData?.course !== null && e.target.checked) {
                                                    connectConfirm(e.target, rowData);
                                                } else {
                                                    handleEdit(e.target, rowData);
                                                }
                                            }}
                                        />
                                        <span className="checkbox-mark"></span>
                                    </label>
                                </>
                            )}
                        ></Column>
                    </DataTable>
                ) : (
                    <p className="text-[16px] text-center font-bold">{translations.noStreamsOrNotLinked}</p>
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

                                        <span className="max-w-sm lg:max-w-[300px] xl:max-w-[600px] text-[16px] sm:text-[16px] md:text-[18px] font-bold text-[#4B4563] break-words">{courseValue?.title}</span>
                                        {/* </span> */}
                                        <div className={'flex items-center gap-2'}>
                                            <Dropdown
                                                value={eduYearSelected}
                                                onChange={(e) => {
                                                    setEduYearSelected(e.value);
                                                }}
                                                options={eduYearOpt}
                                                optionLabel="name_ru"
                                                className="w-full sm:w-14rem p-inputtext-sm"
                                            />

                                            {DialogOpenBtns()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {isMobile && (
                        <div className={'w-full mb-2'}>
                            <Dropdown
                                value={eduYearSelected}
                                onChange={(e) => {
                                    setEduYearSelected(e.value);
                                }}
                                options={eduYearOpt}
                                optionLabel="name_ru"
                                className="w-full sm:w-14rem p-inputtext-sm"
                            />
                        </div>
                    )}
                    {hasStreams ? (
                        <>
                            <p className="text-[16px] text-center font-bold">{translations.noStreamsOrNotLinked}</p>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 sm:gap-2">
                            {isMobile && (
                                DialogOpenBtns()
                            )}

                            <div className="max-h-[685px] overflow-y-scroll">
                                {skeleton ? (
                                    <GroupSkeleton count={10} size={{ width: '100%', height: '4rem' }} />
                                ) : (
                                    <>
                                        <div>
                                            <DataView value={streams} listTemplate={listTemplate} emptyMessage={translations.noData} />
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

            <Dialog
                header={'Связь'}
                visible={courseConnectInfo}
                className={'max-w-xl'}
                onHide={() => {
                    if (!courseConnectInfo) return;
                    setCourseConnectInfo(false);
                }}
            >
                <div>
                    Колонка «Связи» показывает, связан ли поток с одним из ваших курсов. Если отображается <i className={'pi pi-check text-[green]'}></i> поток уже привязан к курсу. <br /> Если <i className={'pi pi-minus text-[red]'}></i> связь с
                    курсом отсутствует. Нажатием на иконку либо на кнопку раскрытия можно увидеть связанный курс.
                </div>
            </Dialog>
        </>
    );
});

export default StreamList;
