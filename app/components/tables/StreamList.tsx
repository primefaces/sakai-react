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
            handleFetchStreams(auditState, eduYearSelected ? eduYearSelected.id : null);
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

    const handleEdit = (e: { checked: boolean }, item: mainStreamsType) => {
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

    const handleFetchEduYear = async () => {
        const res = await studentEduYear();
        // studentEduYear при ошибке возвращает объект ошибки, а не массив
        const data: EduYearType[] | null = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : null;
        if (data) {
            setEduYearOpt(data);
            const date = formatEduYear();
            const currentDate = data?.find((item: EduYearType) => item?.id === date);
            if (currentDate) {
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

    useEffect(() => {
        handleFetchEduYear();
    }, []);

    const connectConfirm = (e: any, item: mainStreamsType) => {
        confirmDialog({
            message: translations.streamConnectConfirm,
            header: translations.confirmation,
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => handleEdit(e, item),
            rejectLabel: translations.cancel,
            rejectClassName: 'reject-button',
            acceptLabel: translations.next
        });
    };

    const metaItem = (icon: string, label: string, value: React.ReactNode, title?: string) => (
        <div className="flex items-center gap-[8px] min-w-0" title={title}>
            <span className="flex shrink-0 items-center justify-center w-[26px] h-[26px] rounded-[8px] bg-[#f1f5f9] text-[var(--text-color-secondary)]">
                <i className={`pi ${icon} text-[0.75rem]`}></i>
            </span>
            <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[0.6875rem] uppercase tracking-wide text-[var(--text-color-secondary)]">{label}</span>
                <span className="text-[0.8125rem] font-medium text-[var(--titleColor)] truncate">{value}</span>
            </div>
        </div>
    );

    const emptyState = (icon: string, text: string) => (
        <div className="flex flex-col items-center justify-center gap-[10px] py-[40px] px-[16px] rounded-[14px] border border-dashed border-[#dbe3ea] bg-[#fbfdfe]">
            <span className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                <i className={`pi ${icon} text-[1.5rem]`}></i>
            </span>
            <p className="m-0 text-center text-[0.9375rem] font-semibold text-[var(--titleColor)]">{text}</p>
        </div>
    );

    const itemTemplate = (item: mainStreamsType, index: number) => {
        const isAudit = item?.id_extra_type === null;
        return (
            <div
                className="w-full rounded-[14px] border border-[#eef2f6] bg-white p-[14px] transition-all hover:border-[var(--mainColor)]/40 hover:shadow-[0_10px_24px_-14px_rgba(8,169,230,0.5)]"
                key={item?.stream_id}
            >
                <div className="flex items-start justify-between gap-[10px]">
                    <div className="flex items-start gap-[12px] min-w-0">
                        <span className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                            <i className="pi pi-sitemap text-[1rem]"></i>
                        </span>
                        <div className="flex flex-col gap-[6px] min-w-0">
                            <h3 className="m-0 text-[0.9375rem] font-semibold leading-snug text-[var(--titleColor)] break-words">{getLocalized(item?.subject_name, 'name') || item?.subject_name[nameLang]}</h3>
                            <div className="flex flex-wrap items-center gap-[6px]">
                                {(getLocalized(item?.subject_type_name, 'name') || item?.subject_type_name?.name_ru) && (
                                    <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.6875rem] font-semibold">
                                        {getLocalized(item?.subject_type_name, 'name') || item?.subject_type_name?.name_ru}
                                    </span>
                                )}
                                {item?.id_extra_type !== undefined && (
                                    <span className={`inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[0.6875rem] font-semibold ${isAudit ? 'bg-[#eef2ff] text-[#4f46e5]' : 'bg-[#fff7ed] text-[#c2410c]'}`}>
                                        <i className={`pi ${isAudit ? 'pi-building' : 'pi-desktop'} text-[0.625rem]`}></i>
                                        {isAudit ? translations.auditItem : translations.notAuditItem}
                                    </span>
                                )}
                                <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[var(--greenColor)] text-white text-[0.6875rem] font-semibold">
                                    {getLocalized(item?.edu_form, 'name') || item?.edu_form[nameLang]}
                                </span>
                            </div>
                        </div>
                    </div>
                    <span className="shrink-0 inline-flex items-center px-[8px] py-[3px] rounded-[8px] bg-[#f1f5f9] text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">ID {item?.stream_id}</span>
                </div>

                <div className="mt-[12px] pt-[12px] border-t border-[#f1f5f9] flex flex-wrap gap-x-[20px] gap-y-[10px]">
                    {metaItem('pi-calendar', translations.studyYear, `20${item?.id_edu_year}`)}
                    {metaItem('pi-clock', translations.period, getLocalized(item?.period, 'name') || item?.period[nameLang])}
                    {metaItem('pi-bookmark', translations.semester, getLocalized(item?.semester, 'name') || item?.semester?.name_ru)}
                    {metaItem('pi-globe', translations.languageOfStudy, item?.language?.name)}
                    <div className="w-full">{metaItem('pi-briefcase', translations.speciality, getLocalized(item?.speciality, 'name') || item?.speciality[nameLang], item?.speciality.name_ru)}</div>
                </div>

                {item.connect_id && (
                    <div className="mt-[12px] flex justify-end">
                        <Link
                            href={`/students/${courseValue?.id}/${item.connect_id}/${item.stream_id}`}
                            className="inline-flex items-center gap-[6px] px-[12px] py-[6px] rounded-[10px] border border-[var(--mainColor)]/30 text-[var(--mainColor)] text-[0.8125rem] font-semibold transition hover:bg-[var(--mainColor)] hover:text-white"
                        >
                            <i className="pi pi-users text-[0.8125rem]"></i>
                            {translations.students}
                            <i className="pi pi-angle-right text-[0.75rem]"></i>
                        </Link>
                    </div>
                )}
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

            return <div className="flex flex-col gap-[10px]">{list}</div>;
        }
        return emptyState('pi-link', translations.noLinkedStreams);
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
            <div className="px-[12px] py-[10px] bg-[#f8fbfd]">
                {data?.course != null ? (
                    <div className="rounded-[12px] border border-[#eef2f6] bg-white overflow-hidden">
                        <div className="flex items-center gap-[8px] px-[14px] py-[10px] border-b border-[#eef2f6] bg-[#f8fafc]">
                            <i className="pi pi-link text-[0.75rem] text-[var(--mainColor)]"></i>
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-color-secondary)]">{translations.courseStreamConnect}</span>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead className="text-[10px] text-[var(--text-color-secondary)] uppercase tracking-wide">
                                <tr>
                                    <th className="px-[14px] py-[8px] border-b border-[#f1f5f9] font-semibold">{translations.streamName || 'Course'}</th>
                                    <th className="px-[14px] py-[8px] border-b border-[#f1f5f9] font-semibold">{translations.courseName || 'Course'}</th>
                                    <th className="px-[14px] py-[8px] border-b border-[#f1f5f9] font-semibold">{translations.description || 'Description'}</th>
                                    <th className="px-[14px] py-[8px] border-b border-[#f1f5f9] font-semibold whitespace-nowrap">Дата</th>
                                </tr>
                            </thead>
                            <tbody className="text-[12px] text-[var(--text-color-secondary)]">
                                {course ? (
                                    <tr>
                                        <td className="px-[14px] py-[10px] font-semibold text-[var(--titleColor)]">{getLocalized(data?.subject_name, 'name') || data?.subject_name?.name_ru}</td>
                                        <td className="px-[14px] py-[10px] font-semibold text-[var(--mainColor)]">{course.title}</td>
                                        <td className="px-[14px] py-[10px] leading-relaxed">{truncate(course.description, 120)}</td>
                                        <td className="px-[14px] py-[10px] whitespace-nowrap">
                                            <span className="inline-flex items-center gap-[4px]">
                                                <i className="pi pi-calendar text-[0.6875rem]"></i>
                                                {formatDate(course.created_at)}
                                            </span>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-[14px] py-[16px] text-center italic">
                                            {translations.noData}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-[12px] border border-dashed border-[#dbe3ea] bg-white text-[0.8125rem] text-[var(--text-color-secondary)]">
                        <i className="pi pi-info-circle text-[0.875rem]"></i>
                        {translations.notCourseConnections}
                    </div>
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
                        className="w-full rounded-[10px] px-[16px] py-[9px] shadow-[0_6px_14px_-6px_rgba(8,169,230,0.7)] hover:opacity-90 transition"
                        style={{ fontSize: '13px' }}
                        size="small"
                        onClick={() => {
                            handleFetchStreams(true, eduYearSelected ? eduYearSelected.id : null);
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
                    className="w-full rounded-[10px] px-[16px] py-[9px] shadow-[0_6px_14px_-6px_rgba(8,169,230,0.7)] hover:opacity-90 transition"
                    style={{ fontSize: '13px' }}
                    size="small"
                    onClick={() => {
                        handleFetchStreams(false, eduYearSelected ? eduYearSelected.id : null);
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
                    <div className={'items-center flex gap-[12px]'}>
                        <span className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                            <i className={`pi ${auditState === false ? 'pi-desktop' : 'pi-building'} text-[1rem]`}></i>
                        </span>
                        <div className="flex flex-col gap-[2px] min-w-0">
                            <span className="text-[1.125rem] font-bold leading-tight text-[var(--titleColor)]">{auditTitle}</span>
                            {courseValue?.title && <span className="text-[0.8125rem] font-normal text-[var(--text-color-secondary)] truncate">{courseValue?.title}</span>}
                        </div>
                        <i
                            onClick={(e) => {
                                e.stopPropagation(); // ключевая строка
                                setCourseConnectInfo(true);
                            }}
                            className={'pi pi-info-circle ml-1 cursor-pointer text-[1rem] p-[6px] rounded-full text-[var(--text-color-secondary)] hover:bg-[var(--mainColor)]/10 hover:text-[var(--mainColor)] transition'}
                        ></i>
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
                    emptyState('pi-exclamation-circle', translations.dataTemporarilyUnavailable)
                ) : dialogStreams && dialogStreams.length > 0 ? (
                    <DataTable
                        value={dialogStreams}
                        className="w-full modern-table text-sm"
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
                        <Column
                            body={(_, { rowIndex }) => <span className="text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{rowIndex + 1}</span>}
                            header={translations.numberSign}
                            style={{ width: '40px', textAlign: 'center' }}
                        ></Column>
                        <Column
                            body={(rowIndex) => <span className="inline-flex items-center px-[8px] py-[3px] rounded-[8px] bg-[#f1f5f9] text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{rowIndex?.stream_id}</span>}
                            header="ID"
                        ></Column>

                        <Column
                            field="title"
                            header={translations.streamName}
                            body={(rowData) => (
                                // <p key={rowData.id}></p>
                                <p key={rowData.id} className="m-0 font-semibold text-[0.875rem] leading-snug text-[var(--titleColor)] min-w-[140px]">
                                    {getLocalized(rowData?.subject_name, 'name') || rowData?.subject_name?.name_ru}
                                </p>
                            )}
                        ></Column>

                        <Column
                            field="title"
                            header={translations.speciality}
                            body={(rowData) => (
                                <div className="max-w-[250px] scrollbar-thin overflow-x-auto">
                                    <p key={rowData?.id} className="m-0 text-[0.8125rem] text-[var(--text-color-secondary)] whitespace-nowrap">
                                        {getLocalized(rowData?.speciality, 'name') || rowData?.speciality?.name_ru}
                                    </p>
                                </div>
                            )}
                        ></Column>

                        <Column header={translations.languageOfStudy} body={(rowData) => <p key={rowData?.id} className="m-0">{rowData?.language?.name}</p>}></Column>

                        <Column field="title" header={translations.studyYear} body={(rowData) => <p key={rowData?.id} className="m-0 font-semibold">20{rowData?.id_edu_year}</p>}></Column>
                        <Column field="title" header={translations.period} body={(rowData) => <p key={rowData?.id} className="m-0">{getLocalized(rowData?.period, 'name') || rowData?.period.name_ru}</p>}></Column>

                        <Column field="title" header={translations.semester} body={(rowData) => <p key={rowData?.id} className="m-0">{getLocalized(rowData?.semester, 'name') || rowData?.semester.name_ru}</p>}></Column>

                        <Column
                            field="title"
                            header={translations.studyForm}
                            body={(rowData) => (
                                <span key={rowData?.id} className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[var(--greenColor)] text-white text-[0.6875rem] font-semibold whitespace-nowrap">
                                    {getLocalized(rowData?.edu_form, 'name') || rowData?.edu_form.name_ru}
                                </span>
                            )}
                        ></Column>

                        <Column
                            field="title"
                            header={translations.studyType}
                            body={(rowData) => {
                                const studyType =
                                    rowData?.id_extra_type === null
                                        ? getLocalized(rowData?.subject_type_name, 'short_name') || rowData?.subject_type_name?.short_name_ru
                                        : rowData?.id_extra_type != null && rowData?.subject_type_name === null
                                            ? getLocalized(rowData?.extra_type, 'short_name') || rowData?.extra_type?.short_name_ru
                                            : '';
                                return studyType ? (
                                    <span key={rowData?.id} className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.6875rem] font-semibold whitespace-nowrap">
                                        {studyType}
                                    </span>
                                ) : null;
                            }}
                        ></Column>

                        <Column
                            field="title"
                            style={{ width: '3rem', textAlign: 'center' }}
                            header={() => <div className="flex justify-center">Связь</div>}
                            body={(rowData) => (
                                <span
                                    onClick={() => toggleRow(rowData)}
                                    title={rowData?.course != null ? rowData?.course?.title : ''}
                                    className={`inline-flex items-center justify-center w-[28px] h-[28px] rounded-full cursor-pointer transition hover:scale-110 ${rowData?.course != null ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]'
                                        }`}
                                >
                                    <i className={`text-[0.75rem] ${rowData?.course != null ? 'pi pi-check' : 'pi pi-minus'}`}></i>
                                </span>
                            )}
                        ></Column>

                        <Column
                            header={translations.streamConnection}
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
                    emptyState('pi-inbox', translations.noStreamsOrNotLinked)
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
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-[12px] pb-[14px] mb-[14px] border-b border-[#eef2f6]">
                                    <div className="flex items-center gap-[12px] min-w-0">
                                        <button
                                            type="button"
                                            onClick={close}
                                            className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-[12px] border border-[#eef2f6] bg-white text-[var(--mainColor)] cursor-pointer transition hover:bg-[var(--mainColor)] hover:border-[var(--mainColor)] hover:text-white"
                                        >
                                            <i className="pi pi-arrow-left"></i>
                                        </button>
                                        <span className="max-w-sm lg:max-w-[300px] xl:max-w-[600px] text-[1.125rem] md:text-[1.25rem] leading-tight font-bold text-[var(--titleColor)] break-words">{courseValue?.title}</span>
                                    </div>
                                    <div className={'flex items-center gap-2'}>
                                        <Dropdown
                                            value={eduYearSelected}
                                            onChange={(e) => {
                                                setEduYearSelected(e.value);
                                            }}
                                            options={eduYearOpt}
                                            optionLabel="name_ru"
                                            className="w-full sm:w-14rem p-inputtext-sm rounded-[10px]"
                                        />

                                        {DialogOpenBtns()}
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
                                className="w-full sm:w-14rem p-inputtext-sm rounded-[10px]"
                            />
                        </div>
                    )}
                    {hasStreams ? (
                        emptyState('pi-inbox', translations.noStreamsOrNotLinked)
                    ) : (
                        <div className="flex flex-col gap-[10px]">
                            {isMobile && (
                                DialogOpenBtns()
                            )}

                            <div className="max-h-[685px] overflow-y-auto pr-[4px] scrollbar-thin">
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
                <div className="flex flex-col gap-[12px] text-[0.875rem] leading-relaxed text-[var(--text-color-secondary)]">
                    <p className="m-0">Колонка «Связи» показывает, связан ли поток с одним из ваших курсов.</p>
                    <div className="flex items-start gap-[10px] p-[10px] rounded-[12px] bg-[#f0fdf4] border border-[#dcfce7]">
                        <span className="flex shrink-0 items-center justify-center w-[28px] h-[28px] rounded-full bg-[#dcfce7] text-[#16a34a]">
                            <i className={'pi pi-check text-[0.75rem]'}></i>
                        </span>
                        <span>Поток уже привязан к курсу.</span>
                    </div>
                    <div className="flex items-start gap-[10px] p-[10px] rounded-[12px] bg-[#fef2f2] border border-[#fee2e2]">
                        <span className="flex shrink-0 items-center justify-center w-[28px] h-[28px] rounded-full bg-[#fee2e2] text-[#dc2626]">
                            <i className={'pi pi-minus text-[0.75rem]'}></i>
                        </span>
                        <span>Связь с курсом отсутствует.</span>
                    </div>
                    <p className="m-0 inline-flex items-start gap-[6px]">
                        <i className="pi pi-info-circle text-[var(--mainColor)] mt-[3px]"></i>
                        Нажатием на иконку либо на кнопку раскрытия можно увидеть связанный курс.
                    </p>
                </div>
            </Dialog>
        </>
    );
});

export default StreamList;
