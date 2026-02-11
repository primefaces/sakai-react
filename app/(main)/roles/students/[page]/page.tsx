'use client';

import React, { useContext, useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Link from 'next/link';
import { fethcReductor } from '@/services/roles/roles';
import { RoleUserType } from '@/types/roles/RoleUserType';
import { Paginator } from 'primereact/paginator';
import useMediaQuery from '@/hooks/useMediaQuery';
import { NotFound } from '@/app/components/NotFound';
import { fetchFaculty } from '@/services/faculty';
import { fetchSpeciality } from '@/services/student/studentSearch';
import { Dropdown } from 'primereact/dropdown';
import { useParams, useRouter } from 'next/navigation';
import { LayoutContext } from '@/layout/context/layoutcontext';

interface Student extends RoleUserType {
    speciality: {
        name_ru: string;
    } | null;
}

export default function StudentsPage() {
    const { contextFilterState, setContextFilterState } = useContext(LayoutContext);

    const media = useMediaQuery('(max-width: 640px)');
    const { page } = useParams();

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<boolean | null>(null);
    const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>({
        currentPage: 1,
        total: 0,
        perPage: 0
    });
    const [pageState, setPageState] = useState<number>(Number(page));
    const [search, setSearch] = useState<string>('');
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [searchController, setSearchController] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [hideInstruction, setHideInstructon] = useState<boolean>();
    const [timeMode, setTimeMode] = useState<{ name_ru: string; code: number | null; id: number | null } | null>({ name_ru: '', code: null, id: null });
    const [timeModeOptions, setTimeModeOptions] = useState<any>(null);

    const [speciality, setSpecialyty] = useState<{ name_ru: string; code: number | null; id: number | null } | null>(null);
    const [specialityOptions, setSpecialityOptions] = useState<any>(null);

    const [currentFacultyId, setCurrentFacultyId] = useState<number | null>(null);
    const [currentSpecialityId, setCurrentSpecialityId] = useState<number | null>(null);

    const router = useRouter();

    const handleFetchFaculty = async () => {
        const data = await fetchFaculty();
        if (data && data?.length) {
            const alls = { name_ru: 'Все', code: null, id: null };
            data.unshift(alls);
            setTimeModeOptions(data);
        }
    };

    const handleStudentSpeciality = async (id_faculty: number) => {
        const data = await fetchSpeciality(id_faculty);
        if (data && data?.length) {
            const alls = { name_ru: 'Все', code: null, id: null };
            data.unshift(alls);
            setSpecialityOptions(data);
            // setStudents(data?.data);
        }
    };

    // Асинхронная функция для будущего запроса
    const handleFetchReductor = async (page: number = pageState, search: string, specialityId: number | null) => {
        setLoading(true);
        setError(null);
        const data = await fethcReductor(page, search, specialityId);
        if (data && data?.current_page) {
            setPagination({
                currentPage: data?.current_page,
                total: data?.total,
                perPage: data?.per_page
            });
            if (data?.data?.length > 0) {
                setStudents(data?.data);
                setEmpty(false);
            } else {
                setEmpty(true);
            }
        } else {
            setError(true);
        }
        setLoading(false);
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        router.push(`/roles/students/${page}`);
        // setGlobalCourseId(null);
        // handleFetchReductor(page, search, currentSpecialityId);
        // setPageState(page);
    };

    const studentsMobile = (student: any) => (
        <div className="p-2 w-full">
            <div key={student.id}>
                <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-[#1e293b] leading-tight">
                            <Link href={`/roles/students/1/${student?.id}`} className="text-[#1e293b] cursor-pointer flex flex-wrap gap-1 underline">
                                <span>{student?.last_name}</span>
                                <span>{student?.name}</span>
                                <span>{student?.father_name}</span>
                            </Link>
                        </div>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-200 shrink-0 ml-2">{student.myedu_id}</span>
                    </div>

                    <div className="text-xs text-slate-500 mb-4">
                        <span className="block uppercase font-semibold text-[10px] text-slate-400 mb-1">Специальность:</span>
                        {student.speciality ? student.speciality?.name_ru : ''}
                    </div>
                    <Link
                        href={`/roles/students/1/${student?.id}`}
                        className="flex gap-1 cursor-pointer w-full bg-[var(--mainColor)] hover:opacity-90 text-white px-4 py-3 rounded-lg items-center justify-center text-sm font-medium transition-all active:scale-[0.98]"
                    >
                        <i className="pi pi-book text-white text-sm"></i>
                        <button>Просмотреть работы</button>
                    </Link>
                </div>
            </div>
        </div>
    );

    function EditorPanel() {
        return (
            <div>
                {/* --- МОБИЛЬНАЯ ВЕРСИЯ (Список карточек) --- */}
                <div className="w-full">
                    <div className="grid grid-cols-1 justify-content-center gap-2 md:hidden">{students.map((student) => studentsMobile(student))}</div>
                </div>

                {empty ? (
                    <b className="main-bg flex justify-center">Студенты не найдены</b>
                ) : loading ? (
                    <div className="flex items-center gap-3 mb-4 justify-center">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                    </div>
                ) : (
                    <>
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hidden md:block">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-500 text-sm font-medium">
                                        <th className="py-4 pl-3 font-semibold">ФИО студента</th>
                                        <th className="py-4 px-6 font-semibold">Л/н</th>
                                        <th className="py-4 px-6 font-semibold">Специальность</th>
                                        <th className="py-4 px-6 font-semibold">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 pl-3 font-bold">
                                                <Link href={`/roles/students/1/${student?.id}`} className="text-[#1e293b] cursor-pointer flex gap-1 underline">
                                                    <span>{student?.last_name}</span>
                                                    <span>{student?.name}</span>
                                                    <span>{student?.father_name}</span>
                                                </Link>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-200">{student.myedu_id}</span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-600 text-sm">{student.speciality ? student.speciality?.name_ru : ''}</td>
                                            <td className="py-4 px-6 text-right">
                                                <Link href={`/roles/students/1/${student?.id}`}>
                                                    <button className="cursor-pointer bg-[var(--mainColor)] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all shadow-sm">
                                                        <i className="pi pi-book text-white text-sm"></i>
                                                        Просмотреть работы
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Футер таблицы */}
                        <p className="mt-4 text-sm text-slate-500">
                            Показано студентов: {students.length} из {students.length}
                        </p>

                        <Paginator
                            first={(pagination.currentPage - 1) * pagination.perPage}
                            rows={pagination.perPage}
                            totalRecords={pagination.total}
                            onPageChange={(e) => handlePageChange(e.page + 1)}
                            // template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            template={media ? 'FirstPageLink PrevPageLink NextPageLink LastPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                        />
                    </>
                )}
            </div>
        );
    }

    const instructionSection = (
        <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-xl p-4 mb-4 flex gap-3">
            <i className="pi pi-info text-[#2563eb] shrink-0 mt-0.5 pi pi-info-circle text-xl"></i>
            <div className="text-sm text-[#1e40af] leading-relaxed">
                <p className="font-semibold mb-1">Инструкция для редуктора</p>
                <p>Выберите студента из списка ниже, чтобы просмотреть все его работы. На странице студента вы сможете аннулировать работы, если были выявлены нарушения академической честности или другие причины для аннулирования.</p>
            </div>
            <i
                onClick={() => {
                    localStorage.setItem('hideInstruction', 'true');
                    setHideInstructon(false);
                }}
                className="pi pi-times cursor-pointer"
            ></i>
        </div>
    );

    const facultiItemeTemplate = (option: any) => {
        return (
            <div className="w-full flex flex-col">
                <span className="items-center max-w-[300px] overflow-hidden text-wrap word-break sm:text-nowrap sm:max-w-full text-sm">{option.name_ru}</span>
            </div>
        );
    };

    const specialityItemeTemplate = (option: any) => {
        return (
            <div className="w-full flex flex-col">
                <span className="items-center max-w-[300px] overflow-hidden text-wrap word-break sm:text-nowrap sm:max-w-full text-sm">{option.name_ru}</span>
            </div>
        );
    };

    useEffect(() => {
        setProgressSpinner(true);
        if (search?.length === 0 && searchController) {
            handleFetchReductor(pageState, search, currentSpecialityId);
            setSearchController(false);
            setProgressSpinner(false);
        }

        if (search?.length < 2) {
            setProgressSpinner(false);
            return;
        }

        setSearchController(true);
        const delay = setTimeout(() => {
            handleFetchReductor(pageState, search, currentSpecialityId);
            setProgressSpinner(false);
        }, 1000);

        return () => {
            clearTimeout(delay);
        };
    }, [search]);

    useEffect(() => {
        if (timeMode?.id) {
            setCurrentFacultyId(timeMode?.id);
            setContextFilterState((prev: any) => ({ ...prev, faculty_id: timeMode?.id }));
        }
    }, [timeMode]);

    useEffect(() => {
        if (contextFilterState?.faculty_id && timeModeOptions?.length) {
            const selected = timeModeOptions.find((item: any) => item.id === contextFilterState.faculty_id);

            if (selected) {
                setTimeMode(selected);
            }
        }
    }, [timeModeOptions, contextFilterState?.faculty_id]);

    useEffect(() => {
        if (currentFacultyId) {
            handleStudentSpeciality(currentFacultyId);
        }
    }, [currentFacultyId]);

    // useEffect(() => {
    //     if (speciality) {
    //         setCurrentSpecialityId(speciality?.id);
    //         const specialityId = speciality?.id;
    //         handleFetchReductor(pageState, search, specialityId);
    //     }
    // }, [speciality]);

    useEffect(() => {
        if (speciality && speciality.id !== currentSpecialityId) {
            setCurrentSpecialityId(speciality.id);
            handleFetchReductor(pageState, search, speciality.id);
        }
    }, [speciality]);

    useEffect(() => {
        if (specialityOptions?.length && contextFilterState?.speciality_id !== undefined) {
            const selected = specialityOptions.find((item: any) => item.id === contextFilterState.speciality_id);

            if (selected) {
                setSpecialyty(selected);
            }
        }
    }, [specialityOptions, contextFilterState?.speciality_id]);

    useEffect(() => {
        handleFetchReductor(pageState, search, currentSpecialityId);
        handleFetchFaculty();
        const hide = localStorage.getItem('hideInstruction');
        if (hide) setHideInstructon(false);
        else setHideInstructon(true);
    }, []);

    return (
        <div className="bg-white p-4 rounded-2xl shadow-md">
            <div className="min-h-screen font-sans text-[#1e293b]">
                {/* Заголовок */}
                <div className="flex items-center gap-3 mb-4">
                    <i className="pi pi-users text-white bg-[#2563eb] p-2 text-4xl rounded-lg"></i>
                    <div>
                        <h1 className="m-0 mb-1 text-3xl font-bold tracking-tight">Панель редуктора</h1>
                        <p className="text-slate-500">Управление работами студентов</p>
                    </div>
                </div>

                {/* Блок инструкции */}
                {hideInstruction && instructionSection}

                {/* filter */}
                <div className="main-bg flex flex-col gap-1 my-1">
                    <div className=" flex sm:items-center gap-2 flex-col sm:flex-row mb-2">
                        <div className="sm:max-w-[60%] overflow-hidden flex flex-col items-start gap-2">
                            <b className="px-1 inline">Выберите факультет</b>
                            <div className="sm:max-w-[60%] overflow-hidden flex juctify-center items-start">
                                <Dropdown
                                    value={timeMode}
                                    optionLabel="name_ru"
                                    itemTemplate={facultiItemeTemplate}
                                    options={timeModeOptions}
                                    onChange={(e) => setTimeMode(e.value)}
                                    placeholder="Выберите факультет"
                                    className="text-wrap word-break sm:text-nowrap sm:max-w-full"
                                />
                            </div>
                        </div>

                        <div className="sm:max-w-[60%] overflow-hidden flex flex-col gap-2">
                            <b className="px-1">Выберите специальность</b>
                            <div className="sm:max-w-[60%] overflow-hidden flex juctify-center items-start">
                                <Dropdown
                                    value={speciality}
                                    optionLabel="name_ru"
                                    options={specialityOptions}
                                    itemTemplate={specialityItemeTemplate}
                                    onChange={(e) => {
                                        setSpecialyty(e.value);
                                        setContextFilterState((prev: any) => ({
                                            ...prev,
                                            speciality_id: e.value?.id ?? null
                                        }));
                                    }}
                                    placeholder="Выберите специальность"
                                    className={`${!specialityOptions ? 'pointer-events-none opacity-50' : ''} w-full text-sm`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Поиск */}
                <div className="relative flex border border-slate-200 rounded-xl py-2 sm:py-3 pl-3 items-center gap-3 w-full bg-white mb-4 shadow-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                    <i className="pi pi-search text-sm"></i>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Поиск по ФИО" className="w-full pr-4 outline-none" />
                    <div className="absolute right-1">{progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                </div>

                {error ? (
                    <div className="mb-4 flex justify-center">
                        <NotFound titleMessage="Данные не доступны" />
                    </div>
                ) : (
                    <EditorPanel />
                )}
            </div>
        </div>
    );
}
