'use client';

import React, { useContext, useEffect, useState, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
// import 'primereact/resources/themes/lara-light-blue/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
import Link from 'next/link';
import { fethcReductor } from '@/services/roles/roles';
import { RoleUserType } from '@/types/roles/RoleUserType';
import { Paginator } from 'primereact/paginator';
import useMediaQuery from '@/hooks/useMediaQuery';
import { NotFound } from '@/app/components/NotFound';
import { fetchFaculty } from '@/services/faculty';
import { fetchSpeciality } from '@/services/student/studentSearch';
import { Dropdown } from 'primereact/dropdown';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useLocalization } from '@/layout/context/localizationcontext';
import { InputText } from 'primereact/inputtext';

interface Student extends RoleUserType {
    speciality: {
        name_ru: string;
    } | null;
}

export default function StudentsPage() {
    const { contextFilterState, setContextFilterState } = useContext(LayoutContext);
    const { translations } = useLocalization();
    const media = useMediaQuery('(max-width: 640px)');
    const { page } = useParams<{page: string}>();
    const queryParams = useSearchParams();
    const searchParams = queryParams.get('search');

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<boolean | null>(null);
    const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>({
        currentPage: 1,
        total: 0,
        perPage: 0
    });
    const [search, setSearch] = useState<string>(searchParams || '');
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [searchController, setSearchController] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [hideInstruction, setHideInstructon] = useState<boolean>();
    const [timeMode, setTimeMode] = useState<{ name_ru: string; code: number | null; id: number | null } | null>({ name_ru: '', code: null, id: null });
    const [timeModeOptions, setTimeModeOptions] = useState<any>(null);

    const isFirstRender = useRef(true);
    const prevSearch = useRef(search);

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
        const handleFetchReductor = async (page: number, search: string, specialityId: number | null) => {
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
        router.push(`/roles/students/${page}/reductor?${search ? `search=${search}` : ''}`);
    };

    // общие стили
    const cardClass = 'rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]';

    const studentName = (student: any) => (
        <Link href={`/roles/students/1/${student?.id}`} className="flex items-center gap-[10px] min-w-0 group">
            <span className="text-[0.875rem] font-semibold leading-snug text-[var(--titleColor)] group-hover:text-[var(--mainColor)] transition-colors break-words">
                {student?.last_name} {student?.name} {student?.father_name}
            </span>
        </Link>
    );

    const myeduChip = (id: any) =>
        id ? (
            <span className="inline-flex items-center gap-[4px] px-[9px] py-[3px] rounded-full bg-[#f1f5f9] text-[0.75rem] font-semibold text-[var(--bodyColor)] whitespace-nowrap">
                <i className="pi pi-id-card text-[0.6875rem]"></i>
                {id}
            </span>
        ) : null;

    const studentsMobile = (student: any, key: number) => (
        <div key={key} className={`${cardClass} w-full flex flex-col gap-[10px] p-[14px]`}>
            <div className="flex justify-between items-start gap-[8px] pb-[10px] border-b border-[#f1f5f9]">
                {studentName(student)}
                {myeduChip(student.myedu_id)}
            </div>

            {student.speciality?.name_ru && (
                <div className="flex items-start gap-[8px] text-[0.8125rem] text-[var(--bodyColor)]">
                    <i className="pi pi-briefcase text-[0.75rem] text-[var(--text-color-secondary)] mt-[3px]"></i>
                    <span className="leading-snug">{student.speciality.name_ru}</span>
                </div>
            )}

            <Link
                href={`/roles/students/1/${student?.id}`}
                className="flex items-center justify-center gap-[6px] w-full h-[38px] rounded-[10px] bg-[var(--mainColor)] text-white text-[0.8125rem] font-semibold shadow-[0_4px_10px_-4px_rgba(8,169,230,0.6)] active:scale-[0.98] transition-transform"
            >
                <i className="pi pi-book text-[0.75rem]"></i>
                {translations.checkingWork}
            </Link>
        </div>
    );

    const editorPanel = (
        <div className="flex flex-col gap-[12px]">
            {empty ? (
                <div className={`${cardClass} flex flex-col items-center justify-center gap-[8px] py-[40px] text-center`}>
                    <span className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#f1f5f9] text-[var(--text-color-secondary)]">
                        <i className="pi pi-user-minus text-[1.375rem]"></i>
                    </span>
                    <span className="text-[0.875rem] text-[var(--text-color-secondary)]">{translations.studentsNotFound}</span>
                </div>
            ) : loading ? (
                <div className={`${cardClass} flex justify-center items-center min-h-[320px]`}>
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                </div>
            ) : (
                <>
                    {/* --- МОБИЛЬНАЯ ВЕРСИЯ (Список карточек) --- */}
                    <div className="flex flex-col gap-[10px] md:hidden">{students.map((student) => studentsMobile(student, student?.id))}</div>

                    {/* --- ДЕСКТОП (таблица) --- */}
                    <div className={`${cardClass} hidden md:block p-[16px]`}>
                        <div className="overflow-x-auto scrollbar-thin border border-[#eef2f6] rounded-[14px]">
                            <table className="w-full min-w-[720px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f8fafc] border-b border-[#eef2f6] text-[0.6875rem] uppercase tracking-[0.04em] text-[var(--text-color-secondary)]">
                                        <th className="py-[12px] px-[16px] w-[48px] text-center font-semibold">#</th>
                                        <th className="py-[12px] px-[16px] font-semibold">{translations.fullNameStudent}</th>
                                        <th className="py-[12px] px-[16px] font-semibold whitespace-nowrap">{translations.personalShortNumber}</th>
                                        <th className="py-[12px] px-[16px] font-semibold">{translations.speciality}</th>
                                        <th className="py-[12px] px-[20px] font-semibold text-right">{translations.actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, idx) => (
                                        <tr key={student.id} className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fbfd] transition-colors">
                                            <td className="py-[18px] px-[16px] text-center text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{(pagination.currentPage - 1) * pagination.perPage + idx + 1}</td>
                                            <td className="py-[18px] px-[16px]">{studentName(student)}</td>
                                            <td className="py-[18px] px-[16px]">{myeduChip(student.myedu_id)}</td>
                                            <td className="py-[18px] px-[16px] text-[0.8125rem] text-[var(--bodyColor)] max-w-[320px]">{student.speciality ? student.speciality?.name_ru : ''}</td>
                                            <td className="py-[18px] px-[20px] text-right">
                                                <Link
                                                    href={`/roles/students/1/${student?.id}`}
                                                    className="inline-flex items-center gap-[6px] h-[34px] px-[12px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.8125rem] font-semibold whitespace-nowrap hover:bg-[var(--mainColor)] hover:text-white transition-colors duration-200"
                                                >
                                                    <i className="pi pi-book text-[0.75rem]"></i>
                                                    {translations.checkingWork}
                                                    <i className="pi pi-arrow-right text-[0.6875rem]"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Футер таблицы */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-[8px]">
                        <span className="text-[0.8125rem] text-[var(--text-color-secondary)]">
                            {translations.viewStudents}: <b className="text-[var(--titleColor)]">{students.length}</b> {translations.from} <b className="text-[var(--titleColor)]">{pagination.total}</b>
                        </span>
                        <Paginator
                            first={(pagination.currentPage - 1) * pagination.perPage}
                            rows={pagination.perPage}
                            totalRecords={pagination.total}
                            onPageChange={(e) => handlePageChange(e.page + 1)}
                            // template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            template={media ? 'FirstPageLink PrevPageLink NextPageLink LastPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                            className="courses-paginator bg-transparent p-0"
                        />
                    </div>
                </>
            )}
        </div>
    );

    const instructionSection = (
        <div className="flex items-start gap-[12px] p-[14px] rounded-[16px] bg-[var(--mainColor)]/5 border border-[var(--mainColor)]/20">
            <span className="flex items-center justify-center shrink-0 w-[34px] h-[34px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                <i className="pi pi-info-circle text-[0.9375rem]"></i>
            </span>
            <div className="flex-1 text-[0.8125rem] leading-relaxed text-[var(--bodyColor)]">
                <p className="m-0 mb-[2px] font-semibold text-[var(--titleColor)]">{translations.reductorInstruction}</p>
                <p className="m-0">{translations.reductorWorkingInstruction}</p>
            </div>
            <button
                type="button"
                onClick={() => {
                    localStorage.setItem('hideInstruction', 'true');
                    setHideInstructon(false);
                }}
                className="flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-full text-[var(--text-color-secondary)] hover:bg-white hover:text-[var(--titleColor)] transition-colors"
            >
                <i className="pi pi-times text-[0.75rem]"></i>
            </button>
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
        // Пропускаем первый рендер
        if (isFirstRender.current) {
            isFirstRender.current = false;
            prevSearch.current = search;
            return;
        }

        // Пропускаем если search не изменился
        if (prevSearch.current === search) {
            return;
        }

        prevSearch.current = search;

        // Сброс при пустой строке
        if (!search || search.length === 0) {
            if (searchController) {
                handleFetchReductor(1, search, currentSpecialityId);
                setSearchController(false);
            }
            setProgressSpinner(false);
            return;
        }

        if (search.length < 2) {
            setProgressSpinner(false);
            return;
        }

        // Дебоунс запрос
        setProgressSpinner(true);
        setSearchController(true);

        const delay = setTimeout(() => {
            handleFetchReductor(1, search, currentSpecialityId);
            setProgressSpinner(false);
        }, 1000);

        return () => clearTimeout(delay);
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

    useEffect(() => {
        if (speciality && speciality.id !== currentSpecialityId) {
            setCurrentSpecialityId(speciality.id);
                handleFetchReductor(Number(page), search, speciality.id);
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
        handleFetchReductor(Number(page), search, currentSpecialityId);
        handleFetchFaculty();
        const hide = localStorage.getItem('hideInstruction');
        if (hide) setHideInstructon(false);
        else setHideInstructon(true);
    }, []);

    return (
        <div className="flex flex-col gap-[16px]">
            {/* Заголовок и фильтры */}
            <div className={`${cardClass} p-[14px] sm:p-[18px]`}>
                <div className="flex items-center gap-[12px] mb-[24px]">
                    <span className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                        <i className="pi pi-users text-[1.125rem]"></i>
                    </span>
                    <div className="flex flex-col gap-[4px] min-w-0">
                        <div className="flex items-center gap-[10px]">
                            <h3 className="text-[1.25rem] sm:text-[1.375rem] leading-tight font-bold m-0">{translations.reductorPanel}</h3>
                            {pagination.total > 0 && (
                                <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full bg-[#f1f5f9] text-[0.75rem] font-semibold text-[var(--bodyColor)]">
                                    <i className="pi pi-users text-[0.6875rem]"></i>
                                    {pagination.total}
                                </span>
                            )}
                        </div>
                        <span className="text-[0.8125rem] text-[var(--text-color-secondary)]">{translations.studentControl}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-[10px]">
                    <div className="[display:grid] grid-cols-1 md:grid-cols-2 gap-[10px]">
                        {/* факультет */}
                        <div className="flex flex-col gap-[6px] min-w-0">
                            <Dropdown
                                value={timeMode}
                                optionLabel="name_ru"
                                itemTemplate={facultiItemeTemplate}
                                options={timeModeOptions}
                                onChange={(e) => setTimeMode(e.value)}
                                placeholder={translations.selectFaculty}
                                className="w-full h-[40px] items-center text-sm"
                                style={{ borderRadius: 10 }}
                            />
                        </div>

                        {/* специальность */}
                        <div className="flex flex-col gap-[6px] min-w-0">
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
                                placeholder={translations.selectSpeciality}
                                className={`${!specialityOptions ? 'pointer-events-none opacity-50' : ''} w-full h-[40px] items-center text-sm`}
                                style={{ borderRadius: 10 }}
                            />
                        </div>
                    </div>

                    {/* Поиск */}
                    <div className="flex items-center relative w-full">
                        <i className="pi pi-search absolute left-[12px] z-[1] text-[0.8125rem] text-[var(--text-color-secondary)] pointer-events-none"></i>
                        <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder={translations.searchByFullName + translations.orMyeduId} className="w-full h-[40px] text-[0.875rem]" style={{ paddingLeft: 36, borderRadius: 10 }} />
                        <div className="absolute right-[10px]">{progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                    </div>
                </div>
            </div>

            {/* Блок инструкции */}
            {hideInstruction && instructionSection}

            {error ? (
                <div className="flex justify-center">
                    <NotFound titleMessage={translations.dataNotAvailable} />
                </div>
            ) : (
                editorPanel
            )}
        </div>
    );
}
