'use client';

import ItemCard from '@/app/components/cards/ItemCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsConnect, fetchItemsLessons, studentEduYear } from '@/services/studentMain';
import Link from 'next/link';
import { Dropdown } from 'primereact/dropdown';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useLocalization } from '@/layout/context/localizationcontext';
import { useLocalizedData } from '@/hooks/useLocalizedData';
import MainTitle from '@/app/components/titles/MainTitle';

export default function Teaching() {
    interface sortOptType {
        name: string;
        code: number;
    }

    interface EduYearType {
        id: number;
        name_ru: string;
    }

    const [lessons, setLessons] = useState<Record<number, { semester: { name_kg: string } }>>({
        1: { semester: { name_kg: '' } }
    });

    const { translations } = useLocalization();
    const { getLocalized } = useLocalizedData();

    const [lessonsDisplay, setLessonsDisplay] = useState<ReactElement[]>([]);
    const [hasLessons, setHasLessons] = useState(false);
    const [selectedSort, setSelectedSort] = useState({ name: translations.all, code: 0 });
    const [sortOpt, setSortOpt] = useState<sortOptType[]>();
    const [connection, setConnection] = useState<[]>([]);
    const [skeleton, setSkeleton] = useState(false);
    const [mainProgressSpinner, setMainProgressSpinner] = useState(false);

    const [eduYearOpt, setEduYearOpt] = useState<EduYearType[]>([]);
    const [eduYearSelected, setEduYearSelected] = useState<EduYearType>();

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    // functions
    const toggleSortSelect = (e: sortOptType) => {
        setSelectedSort(e);
    };

    const toggleEduYearSelect = (e: EduYearType) => {
        setEduYearSelected(e);
    };

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    // fetch lessons
    const handleFetchLessons = async (eduYear: number) => {
        setSkeleton(true);
        setMainProgressSpinner(true);
        console.log(eduYear);
        const data = await fetchItemsLessons(eduYear);
        if (data && data?.success) {
            // валидность проверить
            setLessons(data.data);
            setHasLessons(false);
        } else {
            setHasLessons(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater }
            });
            if (data?.data?.response?.status) {
                showError(data?.data.response.status);
            }
        }
        setSkeleton(false);
        setMainProgressSpinner(false);
    };

    const handleFetchConnectId = async () => {
        const data = await fetchItemsConnect();
        toggleSkeleton();
        if (data) {
            setConnection(data);
        } else {
            setHasLessons(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const formatEduYear = (): string => {
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();

        // С сентября (9) по декабрь — новый учебный год начался
        // С января по август — всё ещё предыдущий учебный год
        const startYear = month >= 9 ? year : year - 1;
        const endYear = String(startYear + 1).slice(-2);

        return `${startYear}-${endYear}`;
    };

    const handleFetchEduYear = async ()=> {
        const data = await studentEduYear();
        if (data) {
            setEduYearOpt(data);

            const date = formatEduYear();
            const currentDate = data?.find((item: EduYearType)=> item?.name_ru === date);
            if(currentDate){
                setEduYearSelected(currentDate);
            }
        }
    }

    useEffect(() => {
        if (!lessons) return;

        // готовим опции для dropdown
        let forSortSelect = [{ name: translations.all, code: 0 }];

        Object.entries(lessons).forEach(([key, value]) => {
            if (value.semester) {
                forSortSelect.push({
                    name: getLocalized(value.semester, 'name') || value.semester.name_kg,
                    code: Number(key)
                });
            }
        });

        setSortOpt(forSortSelect);

        // фильтрация по selectedSort
        let displayData;
        if (selectedSort?.code === 0) {
            displayData = Object.values(lessons).filter((item: any) => item.semester);
        } else {
            const selected = lessons[selectedSort.code];
            displayData = selected && selected.semester ? [selected] : [];
        }

        if(displayData?.length < 1){
            setHasLessons(true);
        }

        // превращаем в jsx
        const x = displayData.map((semester: any, sIdx: number) => (
            <div className="flex flex-col gap-2" key={sIdx}>
                <h3 className="text-center text-[1.375rem] sm:text-[1.625rem] mb-1">{getLocalized(semester.semester, 'name') || semester.semester.name_kg}</h3>
                <div key={sIdx} className="flex flex-col gap-2">
                    {Object.values(semester)
                        .filter((val: any) => val.subject)
                        .map((subj: any, subjIdx: number) => {
                            return subj.connect ? (
                                <Link key={subjIdx} href={`/teaching/${subj.id_curricula}/${eduYearSelected?.id}`}>
                                    <ItemCard key={subjIdx} subject={subj} lessonName={subj.streams[0].curricula.name_subject} streams={subj.streams} connection={connection} />
                                </Link>
                            ) : (
                                <span key={subjIdx}>
                                    <ItemCard key={subjIdx} subject={subj} lessonName={subj.streams[0].curricula.name_subject} streams={subj.streams} connection={connection} />
                                </span>
                            );
                        })}
                </div>
            </div>
        ));

        setLessonsDisplay(x);
    }, [lessons, selectedSort, translations]);

    useEffect(() => {
        handleFetchConnectId();
        handleFetchEduYear();
    }, []);

    useEffect(()=> {
        if(eduYearSelected?.id){
            handleFetchLessons(eduYearSelected.id);
        }
    },[eduYearSelected]);

    // Update default values when language changes
    useEffect(() => {
        if (selectedSort.code === 0) {
            setSelectedSort(prev => ({ ...prev, name: translations.all }));
        }
    }, [translations]);

    return (
        <>
            <div className="main-bg w-full flex justify-between items-start gap-2 xl:gap-5">
                <div className="w-full">
                    {/* info section */}
                    {/*{skeleton ? (*/}
                    {/*    <GroupSkeleton count={1} size={{ width: '100%', height: '4rem' }} />*/}
                    {/*) : (*/}
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                            <h3 className="text-[1.5rem] sm:text-[1.75rem] font-bold m-0">{translations.trainingPlan}</h3>
                            <div className={'flex sm:items-center gap-2 justify-between flex-col md:flex-row'}>
                                <Dropdown
                                    value={eduYearSelected}
                                    onChange={(e) => {
                                        toggleEduYearSelect(e.value);
                                    }}
                                    options={eduYearOpt}
                                    optionLabel="name_ru"
                                    className="w-full sm:w-14rem p-inputtext-sm"
                                />

                                <Dropdown
                                    value={selectedSort}
                                    onChange={(e) => {
                                        toggleSortSelect(e.value);
                                    }}
                                    options={sortOpt}
                                    optionLabel="name"
                                    className="w-full sm:w-14rem p-inputtext-sm"
                                />
                            </div>
                        </div>
                    {/*// )}*/}

                    {/* lesson section */}
                    {!mainProgressSpinner ?
                        hasLessons ? <NotFound titleMessage={translations.noData} /> :
                            skeleton ?
                                <GroupSkeleton count={10} size={{ width: '100%', height: '4rem' }} />
                                : <div className="flex gap-4 sm:gap-6 flex-col">{lessonsDisplay}</div>
                        : <div className="main-bg flex justify-center items-center h-[100vh]">
                            <ProgressSpinner style={{ width: '60px', height: '60px' }} />
                        </div>
                    }
                </div>
            </div>
        </>
    );
}
