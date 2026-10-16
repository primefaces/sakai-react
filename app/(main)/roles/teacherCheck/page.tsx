'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import useMediaQuery from '@/hooks/useMediaQuery';
import { fetchAnwerReport } from '@/services/studentMain';
import { myMainCourseType } from '@/types/myMainCourseType';
import { Paginator } from 'primereact/paginator';
import { fetchSpeciality } from '@/services/student/studentSearch';
import { fetchFaculty } from '@/services/faculty';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import SubTitle from '@/app/components/titles/SubTitle';
import { useLocalization } from '@/layout/context/localizationcontext';
import { useLocalizedData } from '@/hooks/useLocalizedData';
import MainTitle from '@/app/components/titles/MainTitle';

interface Report extends myMainCourseType {
    name: string;
    last_name: string;
    father_name: string;
    pending_count?: number | null;
}

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
    const [skeleton, setSkeleton] = useState(false);
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
            // setStudents(data?.data);
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

    useEffect(() => {
        setProgressSpinner(true);
        if (search?.length === 0 && searchController) {
            handleAnswersReport(pageState, currentSpecialityId, search);
            setSearchController(false);
            setProgressSpinner(false);
        }

        if (search && search?.length < 2) {
            setProgressSpinner(false);
            return;
        }

        setSearchController(true);
        const delay = setTimeout(() => {
            handleAnswersReport(pageState, currentSpecialityId, search);
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
            const specialityId = speciality?.id;
            handleAnswersReport(pageState, specialityId, search);
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
            setTimeMode(prev => prev ? ({ ...prev, name_ru: translations.all }) : null);
        }
        if (speciality?.id === null) {
            setSpecialyty(prev => prev ? ({ ...prev, name_ru: translations.all }) : null);
        }
    }, [translations]);

    const teacherNameBodyTemplate = (rowData: Report) => {
        return (
            <div className="flex items-center gap-2 ">
                <span className="text-[13px] sm:text-[16px]">{rowData?.last_name}</span>
                <span className="text-[13px] sm:text-[16px]">{rowData?.name}</span>
                <span className="text-[13px] sm:text-[16px]">{rowData?.father_name}</span>
            </div>
        );
    };

    const uncheckedAssignmentsBodyTemplate = (rowData: Report) => {
        return <span>{rowData?.pending_count}</span>;
    };

    const facultyItemTemplate = (option: any) => {
        return <span>{getLocalized(option, 'name') || option.name_ru}</span>;
    };

    const facultyValueTemplate = (option: any) => {
        if (!option) {
            return <span>{translations.selectFaculty}</span>;
        }
        return <span>{getLocalized(option, 'name') || option.name_ru}</span>;
    };

    const specialityItemTemplate = (option: any) => {
        return <span>{getLocalized(option, 'name') || option.name_ru}</span>;
    };

    const specialityValueTemplate = (option: any) => {
        if (!option) {
            return <span>{translations.selectSpeciality}</span>;
        }
        return <span>{getLocalized(option, 'name') || option.name_ru}</span>;
    };

    const DesktopTable = () => (
        <div className="card">
            <DataTable value={report || []} rows={5} tableStyle={{ minWidth: '50rem' }} className="text-sm" emptyMessage="...">
                <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px' }}></Column>
                <Column header={translations.teachers} body={teacherNameBodyTemplate} style={{ width: '50%' }} />
                <Column header={translations.uncheckedAssignments} className='w-full flex justify-center' body={uncheckedAssignmentsBodyTemplate} style={{ width: '50%' }} />
            </DataTable>
        </div>
    );

    const MobileTable = () => (
        <div className="w-full">
            {report?.length &&
                report.map((teacher) => (
                    <div key={teacher.id} className="p-4 mb-4 bg-white rounded-lg shadow">
                        <div className="flex sm:items-center justify-between flex-col sm:flex-row">
                            <div className="flex items-center gap-3">
                                {
                                    <span className="font-semibold">
                                        {teacher.name} {teacher.last_name} {teacher.father_name}
                                    </span>
                                }
                            </div>
                            <div className="flex items-center gap-1">
                                <span>{translations.uncheckedAssignments}: </span>
                                <b className="text-[var(--mainColor)]">{uncheckedAssignmentsBodyTemplate(teacher)}</b>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div>
                {/* filter */}
                <div className="main-bg flex flex-col gap-1 my-1">
                    <MainTitle>{translations.teacherReport}</MainTitle>
                    <div className=" flex sm:items-center gap-2 flex-col sm:flex-row mb-2">
                        <div className="sm:max-w-[60%] overflow-hidden flex flex-col items-start gap-2">
                            <b className="px-1 inline">{translations.selectFaculty}</b>
                            <div className="sm:max-w-[60%] overflow-hidden flex juctify-center items-start">
                                <Dropdown
                                    value={timeMode}
                                    options={timeModeOptions}
                                    onChange={(e) => setTimeMode(e.value)}
                                    placeholder={translations.selectFaculty}
                                    className="text-wrap word-break sm:text-nowrap sm:max-w-full"
                                    itemTemplate={facultyItemTemplate}
                                    valueTemplate={facultyValueTemplate}
                                />
                            </div>
                        </div>

                        <div className="sm:max-w-[60%] overflow-hidden flex flex-col gap-2">
                            <b className="px-1">{translations.selectSpeciality}</b>
                            <div className="sm:max-w-[60%] overflow-hidden flex juctify-center items-start">
                                <Dropdown
                                    value={speciality}
                                    options={specialityOptions}
                                    onChange={(e) => setSpecialyty(e.value)}
                                    placeholder={translations.selectSpeciality}
                                    className={`${!specialityOptions ? 'pointer-events-none opacity-50' : ''} w-full text-sm`}
                                    itemTemplate={specialityItemTemplate}
                                    valueTemplate={specialityValueTemplate}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center relative">
                        <InputText placeholder={translations.search} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-inputtext-sm p-inputtext-rounded" />
                        <div className="absolute right-1">{progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                    </div>
                </div>

                {hasReport ? (
                    <div className="flex justify-center items-center flex-col gap-2 h-[50vh]">
                        <i className="pi pi-folder-open text-3xl"></i>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">{translations.loadingError}</h3>
                    </div>
                ) : empty ? (
                    <div className="flex justify-center items-center flex-col gap-2 h-[50vh]">
                        <i className="pi pi-folder-open text-3xl"></i>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">{translations.nothingFound}</h3>
                    </div>
                ) : skeleton ? (
                    <div className="main-bg flex justify-center items-center my-3">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                    </div>
                ) : media ? (
                    <MobileTable />
                ) : (
                    <DesktopTable />
                )}
                {!skeleton && (
                    <Paginator
                        first={(pagination.currentPage - 1) * pagination.perPage}
                        rows={pagination.perPage}
                        totalRecords={pagination.total}
                        onPageChange={(e) => handlePageChange(e.page + 1)}
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    />
                )}
            </div>
        </div>
    );
};

export default TeacherCheckPage;
