'use client';

import ItemCard from '@/app/components/cards/ItemCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsConnect, fetchItemsLessons } from '@/services/studentMain';
import Link from 'next/link';
import { Dropdown } from 'primereact/dropdown';
import { ReactElement, useContext, useEffect, useState } from 'react';

export default function Teaching() {
    interface sortOptType {
        name: string;
        code: number;
    }

    const [skeleton, setSkeleton] = useState(false);
    const [lessons, setLessons] = useState<Record<number, { semester: { name_kg: string } }>>({
        1: { semester: { name_kg: '' } }
    });

    const [lessonsDisplay, setLessonsDisplay] = useState<ReactElement[]>([]);
    const [hasLessons, setHasLessons] = useState(false);
    const [selectedSort, setSelectedSort] = useState({ name: 'Все', code: 0 });
    const [sortOpt, setSortOpt] = useState<sortOptType[]>();
    const [connection, setConnection] = useState<[]>([]);

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    // functions
    const toggleSortSelect = (e: sortOptType) => {
        setSelectedSort(e);
    };

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    // fetch lessons
    const handleFetchLessons = async () => {
        setSkeleton(true);
        const data = await fetchItemsLessons();
        
        if (data && Object.keys(data).length > 0) {
            // валидность проверить
            setLessons(data);
            setHasLessons(false);
            setSkeleton(false);
        } else {
            setHasLessons(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            setSkeleton(false);
        }
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
                value: { severity: 'error', summary: 'Ошибка!', detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    useEffect(() => {
        if (!lessons) return;

        // готовим опции для dropdown
        let forSortSelect = [{ name: 'Все', code: 0 }];

        Object.entries(lessons).forEach(([key, value]) => {
            if (value.semester) {
                forSortSelect.push({
                    name: value.semester.name_kg,
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

        // превращаем в jsx
        const x = displayData.map((semester: any, sIdx: number) => (
            <div className="flex flex-col gap-2" key={sIdx}>
                <h3 className="text-center text-[22px] sm:text-[26px] mb-1">{semester.semester.name_kg}</h3>
                <div className="flex flex-col gap-2">
                    {Object.values(semester)
                        .filter((val: any) => val.subject)
                        .map((subj: any, subjIdx: number) => {
                            return subj.connect ? (
                                <Link key={subjIdx} href={`/teaching/${subj.id_curricula}`}>
                                    <ItemCard key={subjIdx} subject={subj} lessonName={subj.subject} streams={subj.streams} connection={connection} />
                                </Link>
                            ) : (
                                <span>
                                    <ItemCard key={subjIdx} subject={subj} lessonName={subj.subject} streams={subj.streams} connection={connection} />
                                </span>
                            );
                        })}
                </div>
            </div>
        ));

        setLessonsDisplay(x);
    }, [lessons, selectedSort]);

    useEffect(() => {
        handleFetchLessons();
        handleFetchConnectId();
    }, []);

    return (
        <div className="main-bg w-full flex justify-between items-start gap-2 xl:gap-5">
            <div className="w-full">
                {/* info section */}
                {skeleton ? (
                    <GroupSkeleton count={1} size={{ width: '100%', height: '4rem' }} />
                ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                        <h3 className="text-[24px] sm:text-[28px] m-0">План обучения</h3>

                        <Dropdown
                            value={selectedSort}
                            onChange={(e) => {
                                toggleSortSelect(e.value);
                            }}
                            options={sortOpt}
                            optionLabel="name"
                            className="w-full sm:w-14rem"
                        />
                    </div>
                )}  

                {/* lesson section */}
                {hasLessons ? <NotFound titleMessage={'Данные временно не доступны'} /> : skeleton ? <GroupSkeleton count={10} size={{ width: '100%', height: '4rem' }} /> : <div className="flex gap-4 sm:gap-6 flex-col">{lessonsDisplay}</div>}
            </div>
        </div>
    );
}
