'use client';

import React, { useState, useEffect } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { fetchAnwerReport } from '@/services/studentMain';
import { myMainCourseType } from '@/types/myMainCourseType';
import { Paginator } from 'primereact/paginator';
import { fetchSpeciality } from '@/services/student/studentSearch';
import { fetchFaculty } from '@/services/faculty';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useLocalization } from '@/layout/context/localizationcontext';
import { useLocalizedData } from '@/hooks/useLocalizedData';

interface Report extends myMainCourseType {
    name: string;
    last_name: string;
    father_name: string;
    pending_count?: number | null;
}

const cardClass = 'rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]';

// цвет по количеству непроверенных: 0 / до 5 / больше
const pendingStyle = (count: number) => {
    if (count <= 0) return { chip: 'bg-[#ecfdf3] text-[#16a34a]', bar: 'bg-[#22c55e]', icon: 'pi pi-check-circle' };
    if (count <= 5) return { chip: 'bg-[#fff7e6] text-[#b45309]', bar: 'bg-[#f59e0b]', icon: 'pi pi-clock' };
    return { chip: 'bg-[var(--redBgColor)] text-[var(--redColor)]', bar: 'bg-[var(--redColor)]', icon: 'pi pi-exclamation-circle' };
};

const TeacherCheckPage = () => {
    const media = useMediaQuery('(max-width: 768px)');
    const { translations } = useLocalization();
    const { getLocalized } = useLocalizedData();
    const [report, setReport] = useState<Report[] | null>(null);
    const [empty, setEmpty] = useState<boolean>(false);
    const [hasReport, setHasReport] = useState<boolean>(false);
    const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>({
        currentPage: 1,
        total: 0,
        perPage: 0
    });
    const [pageState, setPageState] = useState<number>(1);
    const [timeMode, setTimeMode] = useState<{ name_ru: string; code: number | null; id: number | null } | null>({ name_ru: '', code: null, id: null });
    const [timeModeOptions, setTimeModeOptions] = useState<any>(null);
    const [searchController, setSearchController] = useState(false);

    const [speciality, setSpecialyty] = useState<{ name_ru: string; code: number | null; id: number | null } | null>(null);
    const [specialityOptions, setSpecialityOptions] = useState<any>(null);

    const [currentFacultyId, setCurrentFacultyId] = useState<number | null>(null);
    const [currentSpecialityId, setCurrentSpecialityId] = useState<number | null>(null);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [skeleton, setSkeleton] = useState(true);
    const [search, setSearch] = useState<string>('');

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        setPageState(page);
        handleAnswersReport(page, currentSpecialityId, search);
    };

    const handleFetchFaculty = async () => {
        const data = await fetchFaculty();
        if (data && data?.length) {
            const alls = { name_ru: translations.all, code: null, id: null };
            data.unshift(alls);
            setTimeModeOptions(data);
        }
    };

    const handleStudentSpeciality = async (id_faculty: number) => {
        const data = await fetchSpeciality(id_faculty);
        if (data && data?.length) {
            const alls = { name_ru: translations.all, code: null, id: null };
            data.unshift(alls);
            setSpecialityOptions(data);
        }
    };

    // Вызываем отчет ответов
    const handleAnswersReport = async (page: number, specialityId: number | null, search: string | null) => {
        setSkeleton(true);
        const data = await fetchAnwerReport(page, specialityId, search);
        if (data?.success) {
            setPagination({
                currentPage: data?.data?.current_page,
                total: data?.data?.total,
                perPage: data?.data?.per_page
            });
            if (data?.data?.data?.length > 0) {
                setEmpty(false);
                setReport(data.data.data);
            } else if (data?.data?.data?.length < 1) {
                setEmpty(true);
                setReport(null);
            }
            setHasReport(false);
        } else {
            setHasReport(true);
        }
        setSkeleton(false);
        setProgressSpinner(false);
    };

    // при новом поиске или фильтре начинаем с первой страницы
    useEffect(() => {
        setProgressSpinner(true);
        if (search?.length === 0 && searchController) {
            setPageState(1);
            handleAnswersReport(1, currentSpecialityId, search);
            setSearchController(false);
            setProgressSpinner(false);
        }

        if (search && search?.length < 2) {
            setProgressSpinner(false);
            return;
        }

        setSearchController(true);
        const delay = setTimeout(() => {
            setPageState(1);
            handleAnswersReport(1, currentSpecialityId, search);
            setProgressSpinner(false);
        }, 1000);

        return () => {
            clearTimeout(delay);
        };
    }, [search]);

    useEffect(() => {
        if (timeMode?.id) {
            setCurrentFacultyId(timeMode?.id);
        }
    }, [timeMode]);

    useEffect(() => {
        if (currentFacultyId) {
            handleStudentSpeciality(currentFacultyId);
        }
    }, [currentFacultyId]);

    useEffect(() => {
        if (speciality) {
            setCurrentSpecialityId(speciality?.id);
            setPageState(1);
            handleAnswersReport(1, speciality?.id, search);
        }
    }, [speciality]);

    useEffect(() => {
        handleFetchFaculty();
        handleAnswersReport(pageState, currentSpecialityId, search);
    }, []);

    // Update default values when language changes
    useEffect(() => {
        if (timeModeOptions && timeModeOptions.length > 0 && timeModeOptions[0].id === null) {
            const updatedOptions = [...timeModeOptions];
            updatedOptions[0].name_ru = translations.all;
            setTimeModeOptions(updatedOptions);
        }
        if (specialityOptions && specialityOptions.length > 0 && specialityOptions[0].id === null) {
            const updatedOptions = [...specialityOptions];
            updatedOptions[0].name_ru = translations.all;
            setSpecialityOptions(updatedOptions);
        }
        if (timeMode?.id === null) {
            setTimeMode((prev) => (prev ? { ...prev, name_ru: translations.all } : null));
        }
        if (speciality?.id === null) {
            setSpecialyty((prev) => (prev ? { ...prev, name_ru: translations.all } : null));
        }
    }, [translations]);

    const optionTemplate = (option: any) => (
        <div className="w-full flex flex-col">
            <span className="items-center max-w-[300px] overflow-hidden text-wrap word-break sm:text-nowrap sm:max-w-full text-sm">{getLocalized(option, 'name') || option.name_ru}</span>
        </div>
    );

    const facultyValueTemplate = (option: any) => {
        if (!option || (!option.id && !option.name_ru)) {
            return <span>{translations.selectFaculty}</span>;
        }
        return <span>{getLocalized(option, 'name') || option.name_ru}</span>;
    };

    const specialityValueTemplate = (option: any) => {
        if (!option) {
            return <span>{translations.selectSpeciality}</span>;
        }
        return <span>{getLocalized(option, 'name') || option.name_ru}</span>;
    };

    const fullName = (t: Report) => `${t?.last_name ?? ''} ${t?.name ?? ''} ${t?.father_name ?? ''}`.trim();
    const rowNumber = (idx: number) => (pagination.currentPage - 1) * pagination.perPage + idx + 1;
    // максимум на странице — для относительной полоски
    const maxPending = Math.max(1, ...(report || []).map((t) => Number(t?.pending_count) || 0));

    const avatar = (t: Report) => (
        <span className="flex items-center justify-center shrink-0 w-[36px] h-[36px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[13px] font-bold uppercase">
            {`${t?.last_name?.[0] ?? ''}${t?.name?.[0] ?? ''}` || <i className="pi pi-user text-[13px]"></i>}
        </span>
    );

    const pendingChip = (t: Report) => {
        const count = Number(t?.pending_count) || 0;
        const style = pendingStyle(count);
        return (
            <span className={`inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full text-[12px] font-semibold whitespace-nowrap ${style.chip}`} title={count === 0 ? translations.allChecked : undefined}>
                <i className={`${style.icon} text-[11px]`}></i>
                {count}
            </span>
        );
    };

    const pendingBar = (t: Report) => {
        const count = Number(t?.pending_count) || 0;
        return (
            <div className="h-[6px] w-full rounded-full bg-[#f1f5f9] overflow-hidden">
                <div className={`h-full rounded-full transition-[width] duration-500 ${pendingStyle(count).bar}`} style={{ width: `${count > 0 ? Math.max(4, (count / maxPending) * 100) : 0}%` }}></div>
            </div>
        );
    };

    const DesktopTable = () => (
        <div className="overflow-x-auto scrollbar-thin border border-[#eef2f6] rounded-[14px]">
            <table className="w-full min-w-[640px] text-left border-collapse">
                <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#eef2f6] text-[11px] uppercase tracking-[0.04em] text-[var(--text-color-secondary)]">
                        <th className="py-[12px] px-[16px] w-[56px] text-center font-semibold">#</th>
                        <th className="py-[12px] px-[16px] font-semibold">{translations.teachers}</th>
                        <th className="py-[12px] px-[16px] font-semibold w-[320px]">{translations.uncheckedAssignments}</th>
                    </tr>
                </thead>
                <tbody>
                    {(report || []).map((t, idx) => (
                        <tr key={t.id ?? idx} className="fade-up border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fbfd] transition-colors" style={{ animationDelay: `${Math.min(idx, 12) * 25}ms` }}>
                            <td className="py-[14px] px-[16px] text-center text-[12px] font-semibold text-[var(--text-color-secondary)]">{rowNumber(idx)}</td>
                            <td className="py-[14px] px-[16px]">
                                <div className="flex items-center gap-[10px] min-w-0">
                                    {avatar(t)}
                                    <span className="text-[14px] font-semibold leading-snug text-[var(--titleColor)] break-words">{fullName(t)}</span>
                                </div>
                            </td>
                            <td className="py-[14px] px-[16px]">
                                <div className="flex items-center gap-[12px]">
                                    <div className="w-[64px] shrink-0">{pendingChip(t)}</div>
                                    {pendingBar(t)}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const MobileTable = () => (
        <div className="flex flex-col gap-[10px]">
            {(report || []).map((t, idx) => (
                <div key={t.id ?? idx} className="fade-up flex flex-col gap-[10px] p-[12px] rounded-[14px] border border-[#eef2f6] bg-white" style={{ animationDelay: `${Math.min(idx, 12) * 30}ms` }}>
                    <div className="flex items-center gap-[10px]">
                        {avatar(t)}
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[14px] font-semibold leading-snug text-[var(--titleColor)] break-words">{fullName(t)}</span>
                            <span className="text-[12px] text-[var(--text-color-secondary)]">#{rowNumber(idx)}</span>
                        </div>
                        {pendingChip(t)}
                    </div>
                    {pendingBar(t)}
                </div>
            ))}
        </div>
    );

    const stateBlock = (icon: string, text: string) => (
        <div className="flex flex-col items-center justify-center gap-[8px] py-[40px] text-center">
            <span className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#f1f5f9] text-[var(--text-color-secondary)]">
                <i className={`${icon} text-[22px]`}></i>
            </span>
            <span className="text-[14px] text-[var(--text-color-secondary)]">{text}</span>
        </div>
    );

    const content = () => {
        if (skeleton) {
            return (
                <div className="flex justify-center items-center min-h-[320px]">
                    <ProgressSpinner style={{ width: '45px', height: '45px' }} />
                </div>
            );
        }
        if (hasReport) return stateBlock('pi pi-exclamation-circle', translations.loadingError);
        if (empty) return stateBlock('pi pi-search', translations.nothingFound);

        return (
            <div className="flex flex-col gap-[12px]">
                {media ? <MobileTable /> : <DesktopTable />}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-[8px]">
                    <span className="text-[13px] text-[var(--text-color-secondary)]">
                        {translations.viewTeachers}: <b className="text-[var(--titleColor)]">{report?.length ?? 0}</b> {translations.from} <b className="text-[var(--titleColor)]">{pagination.total}</b>
                    </span>
                    <Paginator
                        first={(pagination.currentPage - 1) * pagination.perPage}
                        rows={pagination.perPage}
                        totalRecords={pagination.total}
                        onPageChange={(e) => handlePageChange(e.page + 1)}
                        template={media ? 'FirstPageLink PrevPageLink NextPageLink LastPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                        className="courses-paginator bg-transparent p-0"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-[16px]">
            {/* Заголовок и фильтры */}
            <div className={`${cardClass} p-[14px] sm:p-[18px]`}>
                <div className="flex items-center gap-[12px] mb-[20px]">
                    <span className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                        <i className="pi pi-chart-bar text-[18px]"></i>
                    </span>
                    <div className="flex flex-col gap-[4px] min-w-0">
                        <div className="flex flex-wrap items-center gap-[10px]">
                            <h3 className="text-[20px] sm:text-[22px] leading-tight font-bold m-0">{translations.teacherReport}</h3>
                            {pagination.total > 0 && (
                                <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full bg-[#f1f5f9] text-[12px] font-semibold text-[var(--bodyColor)]">
                                    <i className="pi pi-users text-[11px]"></i>
                                    {pagination.total}
                                </span>
                            )}
                        </div>
                        <span className="text-[13px] text-[var(--text-color-secondary)]">{translations.teacherReportHint}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-[10px]">
                    <div className="[display:grid] grid-cols-1 md:grid-cols-2 gap-[10px]">
                        {/* факультет */}
                        <div className="flex flex-col gap-[6px] min-w-0">
                            <Dropdown
                                value={timeMode}
                                options={timeModeOptions}
                                optionLabel="name_ru"
                                onChange={(e) => setTimeMode(e.value)}
                                placeholder={translations.selectFaculty}
                                itemTemplate={optionTemplate}
                                valueTemplate={facultyValueTemplate}
                                className="w-full h-[40px] items-center text-sm"
                                style={{ borderRadius: 10 }}
                            />
                        </div>

                        {/* специальность */}
                        <div className="flex flex-col gap-[6px] min-w-0">
                            <Dropdown
                                value={speciality}
                                options={specialityOptions}
                                optionLabel="name_ru"
                                onChange={(e) => setSpecialyty(e.value)}
                                placeholder={translations.selectSpeciality}
                                itemTemplate={optionTemplate}
                                valueTemplate={specialityValueTemplate}
                                className={`${!specialityOptions ? 'pointer-events-none opacity-50' : ''} w-full h-[40px] items-center text-sm`}
                                style={{ borderRadius: 10 }}
                            />
                        </div>
                    </div>

                    {/* Поиск */}
                    <div className="flex items-center relative w-full">
                        <i className="pi pi-search absolute left-[12px] z-[1] text-[13px] text-[var(--text-color-secondary)] pointer-events-none"></i>
                        <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder={translations.search} className="w-full h-[40px] text-[14px]" style={{ paddingLeft: 36, borderRadius: 10 }} />
                        <div className="absolute right-[10px]">{progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                    </div>
                </div>
            </div>

            {/* Отчёт */}
            <div className={`${cardClass} p-[12px] sm:p-[16px]`}>{content()}</div>
        </div>
    );
};

export default TeacherCheckPage;
