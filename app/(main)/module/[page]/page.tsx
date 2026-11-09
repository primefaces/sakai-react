'use client';

import { fetchFaculty } from '@/services/faculty';
import { fetchSpeciality } from '@/services/student/studentSearch';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useContext, useEffect, useState } from 'react';
import ModuleChartCard from '@/app/components/cards/ModuleChartCard';
import { dateUpdate, fetchModuleShedule, fetchSemestr, sheduleDiactivate, sheduleSave } from '@/services/module/module';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Nullable } from 'primereact/ts-helpers';
import { LayoutContext } from '@/layout/context/layoutcontext';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useLocalization } from '@/layout/context/localizationcontext';
import { useLocalizedData } from '@/hooks/useLocalizedData';
import MyDateTime from '@/app/components/MyDateTime';

interface CurrentSpecialityType {
    name_ru: string;
    code: number | null;
    id: number | null;
}

interface SpecialityOptType extends CurrentSpecialityType {}

// фильтры, с которыми был загружен текущий список
interface AppliedFilters {
    specialityIds: number | number[] | null;
    periodId: number | null;
    semesterId: number | null;
}

type OptionsType = Intl.DateTimeFormatOptions;

const cardClass = 'rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]';

const options: OptionsType = {
    year: '2-digit',
    month: 'short', // 'long', 'short', 'numeric'
    day: '2-digit',
    hour12: false // 24-часовой формат
};

const uniq = (arr: number[]) => Array.from(new Set(arr));
const streamIdsOf = (course: any): number[] => (course?.streams || []).map((stream: any) => stream?.id_stream);
const normalizeIds = (ids: number | number[] | null) => (Array.isArray(ids) ? [...ids].sort((a, b) => a - b) : ids);

export default function Module() {
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const { translations } = useLocalization();
    const { getLocalized } = useLocalizedData();

    const [timeMode, setTimeMode] = useState<CurrentSpecialityType | null>({ name_ru: '', code: null, id: null });
    const [timeModeOptions, setTimeModeOptions] = useState<any>(null);

    const [speciality, setSpecialyty] = useState<CurrentSpecialityType | null>(null);
    const [specialityOptions, setSpecialityOptions] = useState<SpecialityOptType[]>([]);
    const [id_speciality, setId_speciality] = useState<number | null>(null);

    const [currentFacultyId, setCurrentFacultyId] = useState<number | null>(null);
    const [currentSpecialityId, setCurrentSpecialityId] = useState<number | number[] | null>(null);

    const [period, setPeriod] = useState<CurrentSpecialityType | null>(null);
    const [periodOptions, setPeriodOptions] = useState<any>([
        { name_ru: 'Летний', id: 1 },
        { name_ru: 'Зимний', id: 2 }
    ]);

    const [semestr, setSemestr] = useState<{ name_ru: string; id: number | null } | null>(null);
    const [semestrOptions, setSemestrOptions] = useState<any>([]);

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [miniSpinner, setMiniSpinner] = useState(false);

    const [connectIds, setConnectIds] = useState<number[] | null>(null);
    const [connects, setConnects] = useState<any>([]);

    const [openIds, setOpenIds] = useState<number[]>([]);
    const [visible, setVisible] = useState(false);
    const [dateUpdateVisible, setDateUpdateVisible] = useState(false);
    const [allSelectFl, setAllSelectFl] = useState<number[]>([]);

    const [emptySpeciality, setEmptySpeciality] = useState(false);
    const [applied, setApplied] = useState<AppliedFilters | null>(null);
    const [listSearch, setListSearch] = useState('');

    const [from, setFrom] = useState<Nullable<Date>>(null);
    const [to, setTo] = useState<Nullable<Date>>(null);
    const [editingFrom, setEditingFrom] = useState<Nullable<Date>>(null);
    const [editingTo, setEditingTo] = useState<Nullable<Date>>(null);
    const [updateDateId, setUpdateDateId] = useState<number | null>(null);
    const [id_stream, setId_stream] = useState<number | null>(null);

    const handleFetchFaculty = async () => {
        const data = await fetchFaculty();
        if (data && data?.length > 0) {
            setTimeModeOptions(data);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleStudentSpeciality = async (id_faculty: number) => {
        setMiniSpinner(true);
        const data = await fetchSpeciality(id_faculty);
        if (data && data?.length) {
            const newOpts = data;
            newOpts.unshift({ id: null, code: 1, name_ru: translations.allSpecialities });
            setSpecialityOptions(newOpts);
        } else {
            // у факультета нет специальностей — не оставляем опции предыдущего факультета
            setSpecialityOptions([]);
            setSpecialyty(null);
            setCurrentSpecialityId(null);
        }
        setMiniSpinner(false);
    };

    const handleFetchModuleShedule = async (specialityIds: any, periodId: number | null, semesterId: number | null) => {
        setProgressSpinner(true);
        setApplied({ specialityIds, periodId, semesterId });
        const data = await fetchModuleShedule(Array.isArray(specialityIds) ? specialityIds : [specialityIds], periodId, semesterId);

        if (data && data?.length > 0) {
            setConnects(data);
            setEmptySpeciality(false);
            startSpecialityCheck(data);
            startSheduleCheck(data);
        } else {
            setConnects([]);
            setAllSelectFl([]);
            setConnectIds([]);
            setEmptySpeciality(true);
        }
        setProgressSpinner(false);
    };

    // повторная загрузка с теми же фильтрами, с которыми загружен список
    const refetchApplied = () => {
        if (applied) handleFetchModuleShedule(applied.specialityIds, applied.periodId, applied.semesterId);
    };

    const handleFetchSemestr = async () => {
        const data = await fetchSemestr();
        if (data && data?.length) {
            setSemestrOptions(data);
            setSemestr({ id: data[0]?.id, name_ru: data[0]?.name_ru });
        }
    };

    const handleSave = async () => {
        if (!applied) return;
        setProgressSpinner(true);
        const data = await sheduleSave(from, to, applied.periodId, applied.semesterId, allSelectFl, connectIds);
        if (data && data?.success) {
            setMessage({
                state: true,
                value: { severity: 'success', summary: data?.message, detail: '' }
            });
            refetchApplied();
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            setProgressSpinner(false);
        }
    };

    const handleDiactivate = async (spId: number | null, ctId: number | null) => {
        if (!applied) return;
        setProgressSpinner(true);
        const data = await sheduleDiactivate(applied.periodId, applied.semesterId, spId, ctId);
        if (data && data?.success) {
            setMessage({
                state: true,
                value: { severity: 'success', summary: data?.message, detail: '' }
            });
            refetchApplied();
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            setProgressSpinner(false);
        }
    };

    // --- Выбор потоков ---
    const handleEdit = (id: number, e: { checked: boolean }, specialityId: number, active: boolean) => {
        if (e.checked) {
            setConnectIds((prev) => (prev ? (prev.includes(id) ? prev : [...prev, id]) : [id]));
        } else {
            if (active) {
                // активный поток снимается только через деактивацию на сервере
                confirm1(null, id);
            } else {
                setAllSelectFl((prev) => prev && prev?.filter((id) => id !== specialityId));
                setConnectIds((prev) => prev && prev?.filter((item) => item !== id));
            }
        }
    };

    // --- Выбор специальности целиком ---
    const toggleSpeciality = (course: any) => {
        const exists = allSelectFl?.includes(course?.id);
        const streamArr = streamIdsOf(course);

        if (exists) {
            if (course?.checking) {
                confirm1(course?.id, null);
            } else {
                // активные на сервере потоки не трогаем — их можно снять только через деактивацию
                const keep = (course?.streams || []).filter((s: any) => s?.schedule?.active).map((s: any) => s?.id_stream);
                setAllSelectFl((prev) => prev.filter((id) => id !== course.id));
                setConnectIds((prev) => prev && prev.filter((id) => !streamArr.includes(id) || keep.includes(id)));
            }
        } else {
            setAllSelectFl((prev) => (prev.includes(course.id) ? prev : [...prev, course.id]));
            setConnectIds((prev) => uniq([...(prev || []), ...streamArr]));
        }
    };

    const startSheduleCheck = (connects: number[]) => {
        if (connects) {
            const activeStreamIds = connects
                .flatMap((c: any) => c?.streams || [])
                .filter((s: any) => s?.schedule?.active)
                .map((s: any) => s?.id_stream);

            if (activeStreamIds) {
                setConnectIds(activeStreamIds);
            }
        }
    };

    const startSpecialityCheck = (speciality: number[]) => {
        if (speciality) {
            const activeSpecialityIds = speciality.filter((s: any) => s?.checking).map((s: any) => s?.id);

            if (activeSpecialityIds) {
                setAllSelectFl(activeSpecialityIds);
            }
        }
    };

    // вернуть выбор к состоянию с сервера
    const resetChanges = () => {
        startSpecialityCheck(connects);
        startSheduleCheck(connects);
    };

    const firstDateSearch = (stream: any) => {
        // Проверяем, что schedule существует и у него есть оба заполненных поля
        if (stream?.schedule?.from && stream?.schedule?.to) {
            return {
                from: stream.schedule.from,
                to: stream.schedule.to
            };
        }
        return null;
    };

    const firstCourseDates = (course: any): { from: string; to: string } | null => {
        for (const stream of course?.streams || []) {
            const result = firstDateSearch(stream);
            if (result) return result;
        }
        return null;
    };

    const onDateUpdate = (id_speciality: number | null, item: any, course?: any) => {
        setDateUpdateVisible(true);
        setId_speciality(id_speciality);
        if (item) {
            setUpdateDateId(item?.id);
            setId_stream(item?.id_stream);
            setEditingFrom(item?.schedule?.from);
            setEditingTo(item?.schedule?.to);
        } else {
            // для специальности подставляем текущие даты, если они есть
            const dates = firstCourseDates(course);
            setUpdateDateId(null);
            setId_stream(null);
            setEditingFrom((dates?.from as any) ?? null);
            setEditingTo((dates?.to as any) ?? null);
        }
    };

    const resetDateUpdate = () => {
        setUpdateDateId(null);
        setEditingFrom(null);
        setEditingTo(null);
        setId_speciality(null);
        setId_stream(null);
    };

    const handleDateUpdate = async (idStream: number | null) => {
        setDateUpdateVisible(false);
        if (!applied) return;
        const data = await dateUpdate(editingFrom, editingTo, applied.periodId, applied.semesterId, idStream, id_speciality);
        if (data?.success) {
            if (data?.message) {
                setMessage({
                    state: true,
                    value: { severity: 'success', summary: data.message, detail: '' }
                });
            }
            refetchApplied();
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        resetDateUpdate();
    };

    const confirm1 = (spId: number | null, ctId: number | null) => {
        confirmDialog({
            message: translations.confirmChange,
            header: translations.confirmation,
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptLabel: translations.change,
            rejectLabel: translations.back,
            rejectClassName: 'p-button-secondary reject-button',
            accept: () => handleDiactivate(spId, ctId)
        });
    };

    const normalizeDate = (date: any): any => {
        if (!date) return null;

        const d = new Date(date);
        d.setHours(12, 0, 0, 0); // фикс timezone
        return d;
    };

    const isRangeInvalid = (start: any, end: any) => Boolean(start && end && new Date(start).getTime() > new Date(end).getTime());

    const specialityProcessing = (specialityParam: CurrentSpecialityType) => {
        if (specialityParam) {
            // "По всем специальностям" — единственная опция без id
            if (specialityParam?.id === null) {
                const forAllSpecialityIds: any = specialityOptions?.map((item: SpecialityOptType) => item?.id)?.filter((item) => item);
                setCurrentSpecialityId(forAllSpecialityIds);
            } else {
                if (specialityParam?.id) {
                    setCurrentSpecialityId(specialityParam?.id);
                }
            }
        }
    };

    useEffect(() => {
        if (timeMode?.id) setCurrentFacultyId(timeMode?.id);
    }, [timeMode]);

    useEffect(() => {
        if (currentFacultyId) handleStudentSpeciality(currentFacultyId);
    }, [currentFacultyId]);

    useEffect(() => {
        // новый факультет — по умолчанию "По всем специальностям", и в выпадающем списке тоже
        if (specialityOptions?.length > 0) {
            setSpecialyty(specialityOptions[0]);
            specialityProcessing(specialityOptions[0]);
        }
    }, [specialityOptions]);

    // Update period options when language changes
    useEffect(() => {
        setPeriodOptions([
            { name_ru: translations.summer, id: 1 },
            { name_ru: translations.winter, id: 2 }
        ]);

        // Update selected period if it exists
        if (period) {
            const updatedPeriod = period.id === 1 ? { ...period, name_ru: translations.summer } : { ...period, name_ru: translations.winter };
            setPeriod(updatedPeriod);
        }
    }, [translations]);

    useEffect(() => {
        handleFetchFaculty();
        handleFetchSemestr();
    }, []);

    // --- Производные значения ---
    const activeStreamIds = new Set<number>(connects.flatMap((c: any) => (c?.streams || []).filter((s: any) => s?.schedule?.active).map((s: any) => s?.id_stream)));
    const selectedStreams = uniq(connectIds || []);
    const newStreamsCount = selectedStreams.filter((id) => !activeStreamIds.has(id)).length;
    const hasSelection = allSelectFl.length > 0 || selectedStreams.length > 0;

    const filtersChanged = Boolean(
        applied &&
            (JSON.stringify(normalizeIds(currentSpecialityId)) !== JSON.stringify(normalizeIds(applied.specialityIds)) || (period?.id ? period.id : null) !== applied.periodId || (semestr?.id ? semestr.id : null) !== applied.semesterId)
    );

    const query = listSearch.trim().toLowerCase();
    const visibleConnects: any[] = query
        ? connects.filter((course: any) => {
              const name = (getLocalized(course, 'name') || course?.name_ru || '').toLowerCase();
              if (name.includes(query)) return true;
              return (course?.streams || []).some((s: any) => (getLocalized(s?.subject_data, 'name') || s?.subject_data?.name_ru || '').toLowerCase().includes(query));
          })
        : connects;

    const selectAllVisible = () => {
        const toAdd = visibleConnects.filter((c) => !allSelectFl.includes(c.id));
        setAllSelectFl((prev) => uniq([...prev, ...toAdd.map((c) => c.id)]));
        setConnectIds((prev) => uniq([...(prev || []), ...toAdd.flatMap(streamIdsOf)]));
    };

    const allVisibleSelected = visibleConnects.length > 0 && visibleConnects.every((c) => allSelectFl.includes(c.id));
    const allVisibleOpen = visibleConnects.length > 0 && visibleConnects.every((c) => openIds.includes(c.id));

    const toggleOpen = (id: number) => setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

    const searchDisabled = !currentSpecialityId || (Array.isArray(currentSpecialityId) && currentSpecialityId.length === 0) || miniSpinner || progressSpinner;

    // --- UI ---
    const optionLabel = (option: any) => <span>{getLocalized(option, 'name') || option?.name_ru}</span>;

    const field = (label: string, control: React.ReactNode) => (
        <div className="flex flex-col gap-[6px] min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-color-secondary)] ml-[2px]">{label}</span>
            {control}
        </div>
    );

    const renderFilters = () => (
        <div className={`${cardClass} p-[14px] sm:p-[18px] flex flex-col gap-[16px]`}>
            <div className="flex items-center gap-[12px]">
                <span className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                    <i className="pi pi-calendar text-[18px]"></i>
                </span>
                <div className="flex flex-col gap-[4px] min-w-0">
                    <h3 className="text-[20px] sm:text-[22px] leading-tight font-bold text-[var(--titleColor)] m-0">{translations.moduleSchedule}</h3>
                    <span className="text-[13px] text-[var(--text-color-secondary)]">{translations.moduleHint}</span>
                </div>
            </div>

            <div className="[display:grid] grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[10px]">
                {field(
                    translations.selectFaculty,
                    <Dropdown
                        value={timeMode}
                        options={timeModeOptions}
                        optionLabel="name_ru"
                        onChange={(e) => setTimeMode(e.value)}
                        placeholder={translations.selectFaculty}
                        className="w-full h-[40px] items-center text-sm"
                        style={{ borderRadius: 10 }}
                        itemTemplate={optionLabel}
                        valueTemplate={(option) => {
                            if (!option || (!option.id && !option.name_ru)) return <span>{translations.selectFaculty}</span>;
                            return optionLabel(option);
                        }}
                    />
                )}

                {field(
                    translations.speciality,
                    <div className="relative w-full">
                        <Dropdown
                            value={speciality}
                            options={specialityOptions}
                            optionLabel="name_ru"
                            onChange={(e) => {
                                setSpecialyty(e.value);
                                specialityProcessing(e.value);
                            }}
                            placeholder={translations.selectSpeciality}
                            className={`${specialityOptions?.length < 1 || miniSpinner ? 'pointer-events-none opacity-50' : ''} w-full h-[40px] items-center text-sm`}
                            style={{ borderRadius: 10 }}
                            itemTemplate={optionLabel}
                            valueTemplate={(option) => {
                                if (!option) return <span>{translations.selectSpeciality}</span>;
                                return optionLabel(option);
                            }}
                        />
                        {miniSpinner && (
                            <div className="absolute right-[36px] top-1/2 -translate-y-1/2">
                                <ProgressSpinner style={{ width: '16px', height: '16px' }} strokeWidth="6" />
                            </div>
                        )}
                    </div>
                )}

                {field(
                    translations.period,
                    <Dropdown
                        value={period}
                        options={periodOptions}
                        optionLabel="name_ru"
                        onChange={(e) => setPeriod(e.value)}
                        placeholder={translations.selectPeriod}
                        showClear
                        className={`${specialityOptions?.length < 1 ? 'pointer-events-none opacity-50' : ''} w-full h-[40px] items-center text-sm`}
                        style={{ borderRadius: 10 }}
                        itemTemplate={(option) => <span>{option.name_ru}</span>}
                        valueTemplate={(option) => {
                            if (!option) return <span>{translations.selectPeriod}</span>;
                            return <span>{option.name_ru}</span>;
                        }}
                    />
                )}

                {field(
                    translations.semester,
                    <Dropdown
                        value={semestr}
                        options={semestrOptions}
                        optionLabel="name_ru"
                        onChange={(e) => setSemestr(e.value)}
                        placeholder={translations.selectSemester}
                        className={`${specialityOptions?.length < 1 || miniSpinner ? 'pointer-events-none opacity-50' : ''} w-full h-[40px] items-center text-sm`}
                        style={{ borderRadius: 10 }}
                        itemTemplate={optionLabel}
                        valueTemplate={(option) => {
                            if (!option) return <span>{translations.selectSemester}</span>;
                            return optionLabel(option);
                        }}
                    />
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[10px]">
                {filtersChanged ? (
                    <div className="flex items-start gap-[8px] text-[12px] leading-snug text-[#b45309]">
                        <i className="pi pi-exclamation-circle text-[13px] mt-[1px]"></i>
                        <span>{translations.filtersChanged}</span>
                    </div>
                ) : (
                    <span></span>
                )}
                <Button
                    label={translations.search}
                    icon="pi pi-search"
                    size="small"
                    className={`shrink-0 self-end sm:self-auto ${filtersChanged ? 'shadow-[0_0_0_3px_rgba(8,169,230,0.25)]' : ''}`}
                    style={{ borderRadius: 10 }}
                    disabled={searchDisabled}
                    onClick={() => {
                        handleFetchModuleShedule(currentSpecialityId, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null);
                    }}
                />
            </div>
        </div>
    );

    const stateBlock = (icon: string, text: string) => (
        <div className={`${cardClass} flex flex-col items-center justify-center gap-[10px] py-[48px] px-[16px] text-center`}>
            <span className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#f1f5f9] text-[var(--text-color-secondary)]">
                <i className={`${icon} text-[22px]`}></i>
            </span>
            <span className="text-[14px] text-[var(--text-color-secondary)] max-w-[420px]">{text}</span>
        </div>
    );

    const toolbarButton = (icon: string, label: string, onClick: () => void, disabled = false) => (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="inline-flex items-center gap-[6px] h-[32px] px-[10px] rounded-[9px] text-[12px] font-semibold whitespace-nowrap text-[var(--bodyColor)] bg-[#f1f5f9] hover:bg-[var(--mainColor)]/10 hover:text-[var(--mainColor)] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#f1f5f9] disabled:hover:text-[var(--bodyColor)]"
        >
            <i className={`${icon} text-[11px]`}></i>
            {label}
        </button>
    );

    const specialityCard = (course: any, idx: number) => {
        const isOpen = openIds.includes(course.id);
        const isSelected = allSelectFl.includes(course?.id);
        const streams = course?.streams || [];
        const selectedCount = streams.filter((s: any) => connectIds?.includes(s?.id_stream)).length;
        const partial = !isSelected && selectedCount > 0;
        const dates = firstCourseDates(course);

        return (
            <div
                key={course.id}
                className={`fade-up rounded-[16px] border bg-white overflow-hidden transition-all duration-200 ${isOpen ? 'border-[var(--mainBorder)] shadow-[0_4px_14px_-8px_rgba(8,169,230,0.45)]' : 'border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]'}`}
                style={{ animationDelay: `${Math.min(idx, 12) * 25}ms` }}
            >
                {/* заголовок специальности */}
                <div className="flex items-center gap-[10px] sm:gap-[12px] p-[12px] sm:px-[14px] cursor-pointer hover:bg-[#f8fbfd] transition-colors" onClick={() => toggleOpen(course.id)}>
                    <label className="flex items-center shrink-0 p-[4px] -m-[4px] cursor-pointer" title={translations.wholeSpeciality} onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            className="customCheckbox"
                            checked={isSelected}
                            ref={(el) => {
                                if (el) el.indeterminate = partial;
                            }}
                            onChange={() => toggleSpeciality(course)}
                        />
                    </label>

                    <span className="hidden sm:flex items-center justify-center shrink-0 w-[32px] h-[32px] rounded-[10px] bg-[#f1f5f9] text-[12px] font-bold text-[var(--bodyColor)]">{idx + 1}</span>

                    <div className="flex flex-col gap-[4px] min-w-0 flex-1">
                        <span className="text-[14px] sm:text-[15px] font-semibold leading-snug text-[var(--titleColor)] break-words">{getLocalized(course, 'name') || course.name_ru}</span>
                        <div className="flex flex-wrap items-center gap-[6px]">
                            {course?.checking && (
                                <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-[#ecfdf3] text-[11px] font-semibold text-[#16a34a]">
                                    <i className="pi pi-check-circle text-[10px]"></i>
                                    {translations.isActive}
                                </span>
                            )}
                            <span
                                className={`inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[11px] font-semibold ${
                                    selectedCount > 0 ? 'bg-[var(--mainColor)]/10 text-[var(--mainColor)]' : 'bg-[#f1f5f9] text-[var(--bodyColor)]'
                                }`}
                            >
                                <i className="pi pi-sitemap text-[10px]"></i>
                                {selectedCount} / {streams.length}
                            </span>
                            {dates && (
                                <span className="inline-flex items-center gap-[4px] text-[12px] text-[var(--bodyColor)] whitespace-nowrap">
                                    <i className="pi pi-calendar text-[11px] text-[var(--text-color-secondary)]"></i>
                                    <MyDateTime createdAt={dates.from} options={options} />
                                    <span>–</span>
                                    <MyDateTime createdAt={dates.to} options={options} />
                                </span>
                            )}
                        </div>
                    </div>

                    {isSelected && (
                        <button
                            type="button"
                            aria-label={translations.dateUpdate}
                            title={translations.dateUpdate}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDateUpdate(course?.id, null, course);
                            }}
                            className="flex items-center justify-center shrink-0 w-[32px] h-[32px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] hover:bg-[var(--mainColor)] hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                            <i className="pi pi-calendar-plus text-[13px]"></i>
                        </button>
                    )}

                    <i className={`pi pi-chevron-down shrink-0 text-[12px] text-[var(--text-color-secondary)] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[var(--mainColor)]' : ''}`}></i>
                </div>

                {/* потоки */}
                {isOpen && (
                    <div className="flex flex-col gap-[8px] p-[12px] sm:px-[14px] border-t border-[#f1f5f9]">
                        {streams.length > 0 ? (
                            streams.map((item: any) => (
                                <ModuleChartCard
                                    key={item?.id}
                                    title={getLocalized(item?.subject_data, 'name') || item?.subject_data?.name_ru}
                                    connectId={item?.id_stream}
                                    handleEdit={(id, checked) => handleEdit(id, checked, course?.id, item?.schedule?.active)}
                                    allIds={connectIds}
                                    active={Boolean(item?.schedule?.active)}
                                    date={{ from: item?.schedule?.from, to: item?.schedule?.to }}
                                    dateUpdate={() => onDateUpdate(null, item)}
                                />
                            ))
                        ) : (
                            <div className="flex items-center gap-[8px] p-[12px] rounded-[12px] bg-[#f8fafc] text-[13px] text-[var(--text-color-secondary)]">
                                <i className="pi pi-info-circle text-[13px]"></i>
                                {translations.noData}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // main block
    const renderMainContent = () => {
        if (progressSpinner) {
            return (
                <div className={`${cardClass} flex justify-center items-center min-h-[280px]`}>
                    <ProgressSpinner style={{ width: '45px', height: '45px' }} />
                </div>
            );
        }

        if (!applied) return stateBlock('pi pi-filter', translations.moduleHint);
        if (emptySpeciality) return stateBlock('pi pi-inbox', translations.noData);

        return (
            <div className="flex flex-col gap-[12px]">
                {/* панель инструментов */}
                <div className={`${cardClass} p-[10px] sm:p-[12px] flex flex-col lg:flex-row lg:items-center gap-[10px]`}>
                    <div className="flex items-center relative w-full lg:max-w-[420px]">
                        <i className="pi pi-search absolute left-[12px] z-[1] text-[13px] text-[var(--text-color-secondary)] pointer-events-none"></i>
                        <InputText value={listSearch} onChange={(e) => setListSearch(e.target.value)} placeholder={translations.searchInList} className="w-full h-[36px] text-[13px]" style={{ paddingLeft: 34, paddingRight: 32, borderRadius: 10 }} />
                        {listSearch && (
                            <button type="button" aria-label="clear" onClick={() => setListSearch('')} className="absolute right-[6px] flex items-center justify-center w-[24px] h-[24px] rounded-full text-[var(--text-color-secondary)] hover:bg-[#f1f5f9] transition-colors">
                                <i className="pi pi-times text-[11px]"></i>
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-[6px] lg:ml-auto">
                        {toolbarButton('pi pi-check-square', `${translations.selectAll} (${visibleConnects.length})`, selectAllVisible, allVisibleSelected)}
                        {toolbarButton('pi pi-undo', translations.resetChanges, resetChanges)}
                        {toolbarButton(allVisibleOpen ? 'pi pi-angle-double-up' : 'pi pi-angle-double-down', allVisibleOpen ? translations.collapseAll : translations.expandAll, () =>
                            setOpenIds(allVisibleOpen ? [] : visibleConnects.map((c) => c.id))
                        )}
                    </div>
                </div>

                {visibleConnects.length === 0 ? stateBlock('pi pi-search', translations.nothingFound) : <div className="flex flex-col gap-[8px]">{visibleConnects.map((course, idx) => specialityCard(course, idx))}</div>}

                {/* панель действий */}
                <div className={`${cardClass} sticky bottom-[12px] z-[2] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] p-[12px] sm:px-[16px]`}>
                    <div className="flex flex-wrap items-center gap-[8px] text-[13px] text-[var(--text-color-secondary)]">
                        <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#f1f5f9]">
                            <i className="pi pi-bookmark text-[11px]"></i>
                            {translations.selectedSpecialities}: <b className="text-[var(--titleColor)]">{allSelectFl.length}</b>
                        </span>
                        <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#f1f5f9]">
                            <i className="pi pi-sitemap text-[11px]"></i>
                            {translations.selectedStreams}: <b className="text-[var(--titleColor)]">{selectedStreams.length}</b>
                        </span>
                        {newStreamsCount > 0 && (
                            <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] font-semibold">
                                <i className="pi pi-plus-circle text-[11px]"></i>
                                {translations.newSelected}: {newStreamsCount}
                            </span>
                        )}
                    </div>
                    <Button label={translations.save} icon="pi pi-check" size="small" style={{ borderRadius: 10 }} className="self-end sm:self-auto" disabled={!hasSelection} onClick={() => setVisible(true)} />
                </div>
            </div>
        );
    };

    const instructionSection = (
        <div className="flex items-start gap-[10px] p-[12px] rounded-[12px] bg-[var(--mainColor)]/5 border border-[var(--mainColor)]/20">
            <i className="pi pi-info-circle text-[var(--mainColor)] text-[15px] mt-[2px]"></i>
            <p className="m-0 text-[13px] leading-relaxed text-[var(--bodyColor)]">{translations.dateChangeWarn}</p>
        </div>
    );

    const calendarField = (label: string, value: any, onChange: (v: any) => void, disabled = false) => (
        <div className="flex flex-col gap-[6px] w-full">
            <span className="text-[12px] font-semibold text-[var(--titleColor)]">{label}</span>
            <Calendar
                value={value}
                locale="ru" // Указываем русскую локаль
                dateFormat="dd.mm.yy"
                showIcon
                className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                inputClassName="h-[40px] text-[14px]"
                onChange={(e) => {
                    const date: any = normalizeDate(e.value);
                    onChange(date ? date : e.value);
                }}
            />
        </div>
    );

    const rangeError = (show: boolean) =>
        show && (
            <div className="flex items-center gap-[6px] text-[12px] text-[var(--redColor)]">
                <i className="pi pi-exclamation-circle text-[12px]"></i>
                {translations.dateRangeError}
            </div>
        );

    const footerContent = (
        <div>
            <Button label={translations.back} className="reject-button" icon="pi pi-times" size="small" onClick={() => setVisible(false)} />
            <Button
                label={translations.save}
                icon="pi pi-check"
                size="small"
                disabled={isRangeInvalid(from, to)}
                onClick={() => {
                    setVisible(false);
                    handleSave();
                }}
                autoFocus
            />
        </div>
    );

    // save dialog
    const renderDialog = () => (
        <Dialog header={translations.changeModuleSchedule} visible={visible} className="w-[95%] sm:w-[560px]" onHide={() => setVisible(false)} footer={footerContent}>
            <div className="flex flex-col gap-[14px]">
                <div className="flex flex-col gap-[6px] p-[12px] rounded-[12px] bg-[#f8fafc] border border-[#eef2f6]">
                    <span className="text-[11px] uppercase tracking-[0.04em] font-semibold text-[var(--text-color-secondary)]">{translations.willBeSaved}</span>
                    <div className="flex flex-wrap items-center gap-[8px] text-[13px] text-[var(--bodyColor)]">
                        <span>
                            {translations.selectedSpecialities}: <b className="text-[var(--titleColor)]">{allSelectFl.length}</b>
                        </span>
                        <span className="text-[#cbd5e1]">•</span>
                        <span>
                            {translations.selectedStreams}: <b className="text-[var(--titleColor)]">{selectedStreams.length}</b>
                        </span>
                        {newStreamsCount > 0 && (
                            <>
                                <span className="text-[#cbd5e1]">•</span>
                                <span className="text-[var(--mainColor)] font-semibold">
                                    {translations.newSelected}: {newStreamsCount}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                {instructionSection}
                <div className="[display:grid] grid-cols-1 sm:grid-cols-2 gap-[12px]">
                    {calendarField(translations.moduleStart, from, setFrom)}
                    {calendarField(translations.moduleEnd, to, setTo)}
                </div>
                {rangeError(isRangeInvalid(from, to))}
            </div>
        </Dialog>
    );

    // date update
    const footerDateUpdate = (
        <div>
            <Button
                label={translations.back}
                className="reject-button"
                icon="pi pi-times"
                size="small"
                onClick={() => {
                    setDateUpdateVisible(false);
                    resetDateUpdate();
                }}
            />
            <Button
                label={translations.update}
                icon="pi pi-check"
                size="small"
                disabled={isRangeInvalid(editingFrom, editingTo)}
                onClick={() => {
                    setDateUpdateVisible(false);
                    handleDateUpdate(id_stream);
                }}
                autoFocus
            />
        </div>
    );

    // date update dialog
    const renderDateUpdateDialog = () => (
        <Dialog
            header={translations.dateUpdate}
            visible={dateUpdateVisible}
            className="w-[95%] sm:w-[520px]"
            onHide={() => {
                if (!dateUpdateVisible) return;
                setDateUpdateVisible(false);
                resetDateUpdate();
            }}
            footer={footerDateUpdate}
        >
            <div className="flex flex-col gap-[14px]">
                {id_speciality && instructionSection}
                <div className="[display:grid] grid-cols-1 sm:grid-cols-2 gap-[12px]">
                    {calendarField(translations.moduleStart, editingFrom ? new Date(editingFrom) : null, setEditingFrom, miniSpinner)}
                    {calendarField(translations.moduleEnd, editingTo ? new Date(editingTo) : null, setEditingTo, miniSpinner)}
                </div>
                {rangeError(isRangeInvalid(editingFrom, editingTo))}
            </div>
        </Dialog>
    );

    return (
        <div className="flex flex-col gap-[16px]">
            {/* filter */}
            {renderFilters()}

            {/* main content */}
            {renderMainContent()}

            {/* dialog */}
            {renderDialog()}

            {/* date update dialog */}
            {renderDateUpdateDialog()}
        </div>
    );
}
