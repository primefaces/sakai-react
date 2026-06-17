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
import { Panel } from 'primereact/panel';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { LayoutContext } from '@/layout/context/layoutcontext';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useLocalization } from '@/layout/context/localizationcontext';
import { useLocalizedData } from '@/hooks/useLocalizedData';
import MainTitle from '@/app/components/titles/MainTitle';
import MyDateTime from '@/app/components/MyDateTime';

interface CurrentSpecialityType {
    name_ru: string;
    code: number | null;
    id: number | null;
}

interface SpecialityOptType extends CurrentSpecialityType {}

type OptionsType = Intl.DateTimeFormatOptions;

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
    const [diactivateSp, setDiactivateSp] = useState<number | null>(null);
    const [diactivateCt, setDiactivateCt] = useState<number | null>(null);

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

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [visible, setVisible] = useState(false);
    const [dateUpdateVisible, setDateUpdateVisible] = useState(false);
    const [allSelectFl, setAllSelectFl] = useState<number[]>([]);

    const [emptySpeciality, setEmptySpeciality] = useState(false);
    const [startDisplay, setStartDisplay] = useState(true);

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
        setStartDisplay(false);
        const data = await fetchSpeciality(id_faculty);
        // console.log(data);
        if (data && data?.length) {
            const newOpts = data;
            newOpts.unshift({ id: null, code: 1, name_ru: translations.allSpecialities });
            setSpecialityOptions(newOpts);
        }
        setMiniSpinner(false);
    };

    const handleFetchModuleShedule = async (specialityIds: any, periodId: number | null, semesterId: number | null) => {
        setProgressSpinner(true);
        const data = await fetchModuleShedule(Array.isArray(specialityIds) ? specialityIds : [specialityIds], periodId, semesterId);

        if (data && data?.length > 0) {
            setConnects(data);
            setEmptySpeciality(false);
            startSpecialityCheck(data);
            startSheduleCheck(data);
        } else {
            setEmptySpeciality(true);
        }
        setProgressSpinner(false);
    };

    const handleFetchSemestr = async () => {
        setProgressSpinner(true);
        const data = await fetchSemestr();
        if (data && data?.length) {
            setSemestrOptions(data);
            setSemestr({ id: data[0]?.id, name_ru: data[0]?.name_ru });
        }
        setProgressSpinner(false);
    };

    const handleSave = async () => {
        setProgressSpinner(true);
        const data = await sheduleSave(from, to, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null, allSelectFl, connectIds);
        if (data && data?.success) {
            // setAllSelectFl([]);
            // setConnectIds([]);
            setMessage({
                state: true,
                value: { severity: 'success', summary: data?.message, detail: '' }
            });
            handleFetchModuleShedule(currentSpecialityId, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null);
            // setSemestrOptions(data);
            // setSemestr({ id: data[0]?.id, name_ru: data[0]?.name_ru });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            setProgressSpinner(false);
        }
    };

    const handleDiactivate = async (spId: number | null, ctId: number | null) => {
        setProgressSpinner(true);
        const data = await sheduleDiactivate(period?.id ? period?.id : null, semestr?.id ? semestr?.id : null, spId, ctId);
        if (data && data?.success) {
            setMessage({
                state: true,
                value: { severity: 'success', summary: data?.message, detail: '' }
            });
            handleFetchModuleShedule(currentSpecialityId, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            setProgressSpinner(false);
        }
    };

    const handleEdit = (id: number, e: { checked: boolean }, specialityId: number, active: boolean) => {
        if (e.checked) {
            if (connectIds) {
                !connectIds?.includes(id) && setConnectIds([...connectIds, id]);
            } else {
                setConnectIds([id]);
            }
        } else {
            if (active) {
                setDiactivateCt(id);
                confirm1(null, id);
            } else {
                setAllSelectFl((prev) => prev && prev?.filter((id) => id !== specialityId));
                setConnectIds((prev) => prev && prev?.filter((item) => item !== id));
            }
        }
    };

    // const specialityWithAll = [{ id: null, code: 1, name_ru: translations.allSpecialities }, ...specialityOptions];

    const startSheduleCheck = (connects: number[]) => {
        if (connects) {
            const activeStreamIds = connects
                .flatMap((c: any) => c?.streams)
                .filter((s: any) => s.schedule?.active)
                .map((s: any) => s?.id_stream);

            // console.log(activeStreamIds); // [1, 3, 4]
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

    const onDateUpdate = (id_speciality: number | null, item: any) => {
        setDateUpdateVisible(true);
        setId_speciality(id_speciality);
        if (item) {
            setUpdateDateId(item?.id);
            setId_stream(item?.id_stream);
            setEditingFrom(item?.schedule?.from);
            setEditingTo(item?.schedule?.to);
        }
    };

    const handleDateUpdate = async (idStream: number | null) => {
        setDateUpdateVisible(false);
        const data = await dateUpdate(editingFrom, editingTo, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null, idStream, id_speciality);
        console.log(data);
        if (data?.success) {
            handleFetchModuleShedule(currentSpecialityId, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null);
        }
        setId_speciality(null);
        setId_stream(null);
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

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour12: false // 24-часовой формат
    };

    // filters block
    const renderFilters = () => (
        <div className="main-bg flex flex-col gap-3  mb-2 p-4 rounded-lg">
            <MainTitle>{translations.moduleSchedule}</MainTitle>
            <div className="flex items-center gap-3 flex-col sm:flex-row">
                <div className="w-full min-w-0 flex flex-col gap-2">
                    <b className="px-1 inline">{translations.selectFaculty}</b>
                    <div className="w-full flex items-center">
                        <Dropdown
                            value={timeMode}
                            options={timeModeOptions}
                            onChange={(e) => setTimeMode(e.value)}
                            placeholder={translations.selectFaculty}
                            className="w-full text-sm"
                            itemTemplate={(option) => <span>{getLocalized(option, 'name') || option.name_ru}</span>}
                            valueTemplate={(option) => {
                                if (!option) return <span>{translations.selectFaculty}</span>;
                                return <span>{getLocalized(option, 'name') || option.name_ru}</span>;
                            }}
                        />
                    </div>
                </div>

                <div className="w-full min-w-0 flex flex-col gap-2 mr-1">
                    <b className="px-1">{translations.speciality}</b>
                    <div className="w-full flex items-center">
                        <Dropdown
                            value={speciality}
                            options={specialityOptions}
                            onChange={(e) => {
                                setSpecialyty(e.value);
                                specialityProcessing(e.value);
                            }}
                            placeholder={translations.selectSpeciality}
                            className={`${specialityOptions?.length < 1 ? 'pointer-events-none opacity-50' : ''} w-full text-sm `}
                            itemTemplate={(option) => <span>{getLocalized(option, 'name') || option.name_ru}</span>}
                            valueTemplate={(option) => {
                                if (!option) return <span>{translations.selectSpeciality}</span>;
                                return <span>{getLocalized(option, 'name') || option.name_ru}</span>;
                            }}
                        />
                        {miniSpinner && (
                            <div>
                                <ProgressSpinner style={{ width: '17px', height: '17px' }} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full min-w-0 flex flex-col gap-2">
                    <b className="px-1">{translations.period}</b>
                    <div className="w-full flex items-center">
                        <Dropdown
                            value={period}
                            options={periodOptions}
                            onChange={(e) => setPeriod(e.value)}
                            placeholder={translations.selectPeriod}
                            className={`${specialityOptions?.length < 1 ? 'pointer-events-none opacity-50' : ''} w-full text-sm`}
                            itemTemplate={(option) => <span>{option.name_ru}</span>}
                            valueTemplate={(option) => {
                                if (!option) return <span>{translations.selectPeriod}</span>;
                                return <span>{option.name_ru}</span>;
                            }}
                        />
                    </div>
                </div>

                <div className="w-full min-w-0 flex flex-col gap-2">
                    <b className="px-1">{translations.semester}</b>
                    <div className="w-full flex items-center">
                        <Dropdown
                            value={semestr}
                            options={semestrOptions}
                            onChange={(e) => setSemestr(e.value)}
                            placeholder={translations.selectSemester}
                            className={`${specialityOptions?.length < 1 || miniSpinner ? 'pointer-events-none opacity-50' : ''} w-full text-sm`}
                            itemTemplate={(option) => <span>{getLocalized(option, 'name') || option.name_ru}</span>}
                            valueTemplate={(option) => {
                                if (!option) return <span>{translations.selectSemester}</span>;
                                return <span>{getLocalized(option, 'name') || option.name_ru}</span>;
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    className="px-4"
                    label={translations.search}
                    // disabled={speciality?.name_ru ? false : true}
                    disabled={currentSpecialityId ? false : true}
                    onClick={() => {
                        handleFetchModuleShedule(currentSpecialityId, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null);
                    }}
                />
            </div>
        </div>
    );

    const saveBtnDisabled = connects?.length === 0;

    // main block
    const renderMainContent = () => {
        if (startDisplay) {
            return (
                <div className="main-bg flex justify-center p-4">
                    <i className="pi pi-calendar text-4xl"></i>
                </div>
            );
        }

        if (progressSpinner) {
            return (
                <div className="main-bg my-2 flex justify-center p-6 rounded-lg">
                    <ProgressSpinner style={{ width: '45px', height: '45px' }} />
                </div>
            );
        }

        if (emptySpeciality) {
            return (
                <div className="main-bg my-2 flex justify-center p-6 rounded-lg">
                    <b>{translations.noData}</b>
                </div>
            );
        }

        return (
            <div className="main-bg flex flex-col gap-2 p-3 rounded-lg">
                {connects.map((course: any, idx: number) => {
                    const isOpen = openIndex === idx;
                    return (
                        <Panel
                            key={course.id}
                            toggleable
                            collapsed={!isOpen}
                            onToggle={() => {
                                setOpenIndex(isOpen ? null : idx);
                                // setConnectIds([]);
                            }}
                            className="w-full"
                            header={
                                <div className={'flex flex-col gap-2 items-center'}>
                                    <div className={'w-full flex items-center justify-between gap-2'}>
                                        <div className="flex items-center justify-between w-full sm:min-w-[370px] gap-1 sm:gap-2">
                                            <div className="flex items-center gap-1 sm:gap-3 min-w-0">
                                                <div className="flex items-center shrink-0">
                                                    <label className="custom-radio text-xl leading-none">
                                                        <input
                                                            type="checkbox"
                                                            className={`customCheckbox p-2`}
                                                            checked={allSelectFl.some((s) => s === course?.id) ? true : false}
                                                            onChange={(e) => {
                                                                const exists = allSelectFl?.includes(course?.id);
                                                                if (exists) {
                                                                    // console.log(course);
                                                                    if (course?.checking) {
                                                                        setDiactivateSp(course.id);
                                                                        confirm1(course?.id, null);
                                                                    } else {
                                                                        setAllSelectFl((prev) => {
                                                                            const streamArr = course?.streams?.map((stream: any) => stream.id_stream);
                                                                            setConnectIds((prev) => prev && prev.filter((id) => !streamArr?.includes(id)));
                                                                            return prev.filter((id) => id !== course.id);
                                                                        });
                                                                    }
                                                                } else {
                                                                    setAllSelectFl((prev) => {
                                                                        const forConnects = course?.streams?.map((stream: any) => {
                                                                            return stream?.id_stream;
                                                                        });
                                                                        if (connectIds) {
                                                                            const f = [...connectIds];
                                                                            setConnectIds([...f, ...forConnects]);
                                                                        } else {
                                                                            setConnectIds(forConnects);
                                                                        }
                                                                        return [...prev, course.id];
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        <span className="checkbox-mark"></span>
                                                    </label>
                                                </div>
                                                <span className="font-semibold max-w-[90%] sm:w-full text-[0.938rem] sm:text-[1rem] break-words flex items-center gap-1">
                                                    <span>{idx + 1}.</span> <span>{getLocalized(course, 'name') || course.name_ru}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {allSelectFl.some((s) => s === course?.id) ? (
                                            <div>
                                                <i
                                                    onClick={() => {
                                                        onDateUpdate(course?.id, null);
                                                    }}
                                                    className={'cursor-pointer pi pi-calendar-plus text-[var(--mainColor)]'}
                                                ></i>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        <div className={'w-full hidden sm:block'}>
                                            {(() => {
                                                let foundResult: any | { from: string; to: string } = null;

                                                // Просто вызываем find, не сохраняя его в константу
                                                course?.streams?.find((item: any) => {
                                                    const result = firstDateSearch(item);
                                                    if (result) {
                                                        foundResult = result;
                                                        return true;
                                                    }
                                                    return false;
                                                });

                                                if (foundResult) {
                                                    return (
                                                        <div className="flex items-center gap-1 text-[10px] justify-center max-w-[165px]">
                                                            <span className=""><MyDateTime createdAt={foundResult.from} options={options} /></span>
                                                            <i>-</i>
                                                            <span className=""><MyDateTime createdAt={foundResult.to} options={options} /></span>
                                                        </div>
                                                    );
                                                }

                                                return null;
                                            })()}
                                        </div>
                                    </div>
                                    <div className={'w-full block sm:hidden flex justify-center'}>
                                        {(() => {
                                            let foundResult: any | { from: string; to: string } = null;

                                            // Просто вызываем find, не сохраняя его в константу
                                            course?.streams?.find((item: any) => {
                                                const result = firstDateSearch(item);
                                                if (result) {
                                                    foundResult = result;
                                                    return true;
                                                }
                                                return false;
                                            });

                                            if (foundResult) {
                                                return (
                                                    <div className="flex items-center gap-1 text-[10px] justify-center max-w-[165px]">
                                                        <span className=""><MyDateTime createdAt={foundResult.from} options={options} /></span>
                                                        <i>-</i>
                                                        <span className=""><MyDateTime createdAt={foundResult.to} options={options} /></span>
                                                    </div>
                                                );
                                            }

                                            return null;
                                        })()}
                                    </div>
                                </div>
                            }
                        >
                            <div className="flex flex-col gap-3 mt-3 w-full">
                                {course?.streams?.length > 0 ? (
                                    course.streams.map((item: any) => (
                                        <ModuleChartCard
                                            key={item?.id}
                                            title={getLocalized(item?.subject_data, 'name') || item?.subject_data?.name_ru}
                                            connectId={item?.id_stream}
                                            handleEdit={(id, checked) => handleEdit(id, checked, course?.id, item?.schedule?.active)}
                                            allIds={connectIds}
                                            date={{ from: item?.schedule?.from, to: item?.schedule?.to }}
                                            dateUpdate={(id: number) => onDateUpdate(null, item)}
                                        />
                                    ))
                                ) : (
                                    <div className="main-bg flex justify-center p-4 rounded-md">
                                        <b>{translations.noData}</b>
                                    </div>
                                )}
                            </div>
                        </Panel>
                    );
                })}
                <div className="flex justify-end pt-2">
                    <Button label={translations.save} disabled={saveBtnDisabled} onClick={() => setVisible(true)} className="px-4" />
                </div>
            </div>
        );
    };

    const instructionSection = (
        <div className="max-w-lg bg-[#eff6ff] border border-[#dbeafe] rounded-xl p-2 sm:p-3 mb-2 flex gap-2 sm:gap-3">
            <i className="pi pi-info text-[#2563eb] shrink-0 mt-0.5 pi pi-info-circle text-xl"></i>
            <div className="text-sm text-[#1e40af] leading-relaxed">
                {/*<p className="font-semibold mb-1">{translations.reductorInstruction}</p>*/}
                <p>{translations.dateChangeWarn}</p>
            </div>
        </div>
    );

    // save dialog
    const renderDialog = () => (
        <Dialog
            header={translations.changeModuleSchedule}
            visible={visible}
            onHide={() => {
                if (!visible) return;
                setVisible(false);
            }}
            footer={footerContent}
        >
            <div>
                <div className="flex flex-col gap-2">
                    {instructionSection}
                    <div className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-sm">{translations.moduleStart}</span>
                            <Calendar
                                value={from}
                                locale="ru" // Указываем русскую локаль
                                dateFormat="dd.mm.yy"
                                className="p-inputtext-sm"
                                onChange={(e) => {
                                    const date: any = normalizeDate(e.value);
                                    if (date) {
                                        setFrom(date);
                                    } else {
                                        setFrom(e.value);
                                    }
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-sm">{translations.moduleEnd}</span>
                            <Calendar
                                value={to}
                                locale="ru" // Указываем русскую локаль
                                dateFormat="dd.mm.yy"
                                className="p-inputtext-sm"
                                onChange={(e) => {
                                    const date: any = normalizeDate(e.value);
                                    if (date) {
                                        setTo(date);
                                    } else {
                                        setTo(e.value);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );

    // date update dialog
    const renderDateUpdateDialog = () => (
        <Dialog
            header={translations.dateUpdate}
            visible={dateUpdateVisible}
            onHide={() => {
                if (!dateUpdateVisible) return;
                setDateUpdateVisible(false);
                setUpdateDateId(null);
                setEditingFrom(null);
                setEditingTo(null);
                setId_speciality(null);
            }}
            footer={footerDateUpdate}
        >
            <div>
                <div className="w-full flex flex-col">
                    <div className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div className="flex flex-col items-center sm:items-start">
                            <div className={'flex items-center gap-1'}>
                                <span className="text-sm">{translations.moduleStart}</span>
                                {miniSpinner && (
                                    <div>
                                        <ProgressSpinner style={{ width: '17px', height: '17px' }} />
                                    </div>
                                )}
                            </div>
                            <Calendar
                                value={editingFrom ? new Date(editingFrom) : null}
                                locale="ru" // Указываем русскую локаль
                                dateFormat="dd.mm.yy"
                                className={`p-inputtext-sm ${miniSpinner ? 'opacity-50 pointer-events-none' : ''}`}
                                onChange={(e) => {
                                    const date: any = normalizeDate(e.value);
                                    if (date) {
                                        setEditingFrom(date);
                                    } else {
                                        setEditingFrom(e.value);
                                    }
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-center sm:items-start">
                            <div className={'flex items-center gap-1'}>
                                <span className="text-sm">{translations.moduleEnd}</span>
                                {miniSpinner && (
                                    <div>
                                        <ProgressSpinner style={{ width: '17px', height: '17px' }} />
                                    </div>
                                )}
                            </div>
                            <Calendar
                                value={editingTo ? new Date(editingTo) : null}
                                locale="ru" // Указываем русскую локаль
                                dateFormat="dd.mm.yy"
                                className={`p-inputtext-sm ${miniSpinner ? 'opacity-50 pointer-events-none' : ''}`}
                                onChange={(e) => {
                                    const date: any = normalizeDate(e.value);
                                    if (date) {
                                        setEditingTo(date);
                                    } else {
                                        setEditingTo(e.value);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );

    const specialityProcessing = (specialityParam: CurrentSpecialityType) => {
        if (specialityParam) {
            if (specialityParam?.code === 1) {
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
        if (specialityOptions?.length > 0) specialityProcessing(specialityOptions[0]);
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

    const footerContent = (
        <div>
            <Button
                label={translations.back}
                className="reject-button"
                icon="pi pi-times"
                size="small"
                onClick={() => {
                    setVisible(false);
                }}
            />

            <Button
                label={translations.save}
                icon="pi pi-check"
                size="small"
                onClick={() => {
                    setVisible(false);
                    handleSave();
                }}
                autoFocus
            />
        </div>
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
                    setUpdateDateId(null);
                    setDateUpdateVisible(false);
                    setEditingFrom(null);
                    setEditingTo(null);
                    setId_speciality(null);
                }}
            />

            <Button
                label={translations.update}
                icon="pi pi-check"
                size="small"
                onClick={() => {
                    setDateUpdateVisible(false);
                    handleDateUpdate(id_stream);
                }}
                autoFocus
            />
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
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
