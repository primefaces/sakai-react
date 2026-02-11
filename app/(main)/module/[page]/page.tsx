'use client';

import { fetchFaculty } from '@/services/faculty';
import { fetchSpeciality } from '@/services/student/studentSearch';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';

export default function Module() {
    const [timeMode, setTimeMode] = useState<{ name_ru: string; code: number | null; id: number | null } | null>({ name_ru: '', code: null, id: null });
    const [timeModeOptions, setTimeModeOptions] = useState<any>(null);
    const [searchController, setSearchController] = useState(false);

    const [speciality, setSpecialyty] = useState<{ name_ru: string; code: number | null; id: number | null } | null>(null);
    const [specialityOptions, setSpecialityOptions] = useState<any>([]);

    const [currentFacultyId, setCurrentFacultyId] = useState<number | null>(null);
    const [currentSpecialityId, setCurrentSpecialityId] = useState<number | null>(null);

    const [period, setPeriod] = useState<{ name_ru: string; code: number | null; id: number | null } | null>(null);
    const [periodOptions, setPeriodOptions] = useState<any>([
        { name_ru: 'Летний', id: null },
        { name_ru: 'Зимний', id: null }
    ]);
    const [allSpecialityIds, setAllSpecialityIds] = useState<{id: number}[] | null>(null);

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [search, setSearch] = useState<string>('');

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
            setSpecialityOptions(data);
            // setStudents(data?.data);
        }
    };

    const specialityWithAll = [{ id: null, name_ru: 'Все' }, { id: null, code: 1, name_ru: 'По всем специальностям' }, ...specialityOptions];

    useEffect(() => {
        setProgressSpinner(true);
        if (search?.length === 0 && searchController) {
            // handleAnswersReport(pageState, currentSpecialityId, search);
            setSearchController(false);
            setProgressSpinner(false);
        }

        if (search && search?.length < 2) {
            setProgressSpinner(false);
            return;
        }

        setSearchController(true);
        const delay = setTimeout(() => {
            // handleAnswersReport(pageState, currentSpecialityId, search);
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
        console.log(speciality);
        if (speciality) {
            if (speciality?.code === 1) {
                const forAllSpecialityIds = specialityWithAll.filter((item) => {
                    if (item?.id) {
                        return item.id;
                    }
                });
                console.log(forAllSpecialityIds);
                setAllSpecialityIds(forAllSpecialityIds);
            }
            console.log(specialityWithAll);
            setCurrentSpecialityId(speciality?.id);
            const specialityId = speciality?.id;
            // query
        }
    }, [speciality]);

    useEffect(() => {
        handleFetchFaculty();
        // query
    }, []);

    return (
        <div>
            {/* filter */}
            <div className="main-bg flex flex-col gap-1 my-1">
                <div className=" flex sm:items-center gap-2 flex-col sm:flex-row mb-2">
                    <div className="sm:max-w-[60%] overflow-hidden flex flex-col items-start gap-2">
                        <b className="px-1 inline">Выберите факультет</b>
                        <div className="sm:max-w-[60%] overflow-hidden flex juctify-center items-start">
                            <Dropdown value={timeMode} optionLabel="name_ru" options={timeModeOptions} onChange={(e) => setTimeMode(e.value)} placeholder="Выберите факультет" className="text-wrap word-break sm:text-nowrap sm:max-w-full" />
                        </div>
                    </div>

                    <div className="sm:max-w-[60%] overflow-hidden flex flex-col gap-2">
                        <b className="px-1">Выберите специальность</b>
                        <div className="maxsm:max-w-[60%] overflow-hidden flex juctify-center items-start">
                            <Dropdown
                                value={speciality}
                                optionLabel="name_ru"
                                options={specialityWithAll}
                                onChange={(e) => setSpecialyty(e.value)}
                                placeholder="Выберите специальность"
                                className={`${specialityOptions?.length < 1 ? 'pointer-events-none opacity-50' : ''} w-full text-sm`}
                            />
                        </div>
                    </div>

                    <div className="sm:max-w-[60%] overflow-hidden flex flex-col gap-2">
                        <b className="px-1">Период</b>
                        <div className="sm:max-w-[60%] overflow-hidden flex juctify-center items-start">
                            <Dropdown value={period} optionLabel="name_ru" options={periodOptions} onChange={(e) => setPeriod(e.value)} placeholder="Выберите специальность" className={`w-full text-sm`} />
                        </div>
                    </div>
                </div>
                <div className="flex items-center relative">
                    <InputText placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-inputtext-sm p-inputtext-rounded" />
                    <div className="absolute right-1">{progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                </div>
            </div>
        </div>
    );
}
