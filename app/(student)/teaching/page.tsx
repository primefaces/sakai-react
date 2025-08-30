'use client';

import ItemCard from '@/app/components/cards/ItemCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsConnect, fetchItemsLessons } from '@/services/studentMain';
import { Dropdown } from 'primereact/dropdown';
import { useContext, useEffect, useState } from 'react';

export default function Teaching() {
    interface sortOptType {
        name: string;
        code: number;
    }

    const [skeleton, setSkeleton] = useState(false);
    const [lessons, setLessons] = useState<{}>({});
    const [lessonsDisplay, setLessonsDisplay] = useState<[]>([]);
    const [hasLessons, setHasLessons] = useState(false);
    const [selectedSort, setSelectedSort] = useState({ name: 'Баары', code: 0 });
    const [sortOpt, setSortOpt] = useState<sortOptType[]>();
    const [connection, setConnection] = useState<[]>([]);

    // [{ name: '1-семестр', page: 0 }];
    // const sortOpt = [
    //     { name: 'Баары', code: 1 },
    //     { name: 'London', code: 2 },
    //     { name: 'Paris', code: 3 },
    //     { name: 'Баары', code: 1 },
    //     { name: 'London', code: 2 },
    //     { name: 'Paris', code: 3 }
    // ];

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    // functions
    const toggleSortSelect = (e: sortOptType) => {
        console.log(e);
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
        // skeleton = false
        const data = await fetchItemsLessons();
        console.log(data);
        toggleSkeleton();
        if (data) {
            // валидность проверить
            setLessons(data);
            setHasLessons(false);
        } else {
            setHasLessons(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Байланышы менен көйгөй' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleFetchConnectId = async () => {
        const data = await fetchItemsConnect();
        console.log(data);
        toggleSkeleton();
        if (data) {
            setConnection(data);
        } else {
            setHasLessons(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    // useEffect(() => {
    //     console.log(lessons);

    // if (lessons) {
    //     let forSortSelect = [];
    //     Object.values(lessons).forEach((item,idx) => {
    //         console.log(item);
    //         const obj = { name: item.semester.name_kg, code: idx + 1 };
    //         forSortSelect.push(obj);
    //     });
    //     setSortOpt(forSortSelect);

    //     const x = Object.values(lessons).map((item) => {
    //         return (
    //             <div className="flex flex-col gap-2">
    //                 <h3 className="text-center">{item.semester.name_kg}</h3>
    //                 <div className="flex justify-around flex-wrap items-center gap-2">
    //                     {item.streams.map((j) => {
    //                         return (
    //                             <>
    //                                 <ItemCard lessonName={j.curricula.name_subject.name_kg} teacherName={j.teacher.name} teacherLastName={j.teacher!.last_name && j.teacher!.last_name} lessonType={j.subject_type_name.name_kg} />
    //                             </>
    //                         );
    //                     })}
    //                 </div>
    //             </div>
    //         );
    //     });

    //     setLessonsDisplay(x);
    // }

    // useEffect(() => {
    //     if (lessons) {
    //         let forSortSelect = [{ name: 'Баары', code: 0 }];

    //         Object.entries(lessons).forEach(([key, item]) => {
    //             const obj = { name: item.semester.name_kg, code: Number(key) };
    //             forSortSelect.push(obj);
    //         });

    //         setSortOpt(forSortSelect);
    //     }
    // }, [lessons]);

    // рабочий вариант до изменении структуры
    // useEffect(() => {
    //     if (!lessons) return;

    //     let displayData;

    //     if (selectedSort?.code === 0) {
    //         // "Баары" → показать все
    //         displayData = Object.values(lessons);
    //     } else {
    //         // конкретный семестр
    //         const selected = lessons[selectedSort.code];
    //         displayData = selected ? [selected] : [];
    //     }

    //     const x = displayData.map((item) => (
    //         <div className="flex flex-col gap-2" key={item.semester.name_kg}>
    //             <h3 className="text-center">{item.semester.name_kg}</h3>
    //             <div className="flex justify-around flex-wrap items-center gap-2">
    //                 {item.streams?.map((j, idx) => (
    //                     <ItemCard key={idx} lessonName={j.curricula.name_subject.name_kg} teacherName={j.teacher.name} teacherLastName={j.teacher?.last_name} lessonType={j.subject_type_name.name_kg} />
    //                 ))}
    //             </div>
    //         </div>
    //     ));

    //     setLessonsDisplay(x);
    // }, [lessons, selectedSort]);

    useEffect(() => {
        if (!lessons) return;

        // готовим опции для dropdown
        let forSortSelect = [{ name: 'Баары', code: 0 }];

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
                <h3 className="text-center text-[26px]">{semester.semester.name_kg}</h3>
                <div className="flex justify-around flex-wrap items-center gap-2">
                    {Object.values(semester)
                        .filter((val: any) => val.subject) // только предметы
                        .map((subj: any, subjIdx: number) => (
                            <ItemCard key={subjIdx} lessonName={subj.subject} streams={subj.streams} connection={connection} />
                        ))}
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
        <div className="w-full flex justify-between items-start gap-2 xl:gap-5">
            <div className="py-4 w-full">
                {/* info section */}
                {skeleton ? (
                    <GroupSkeleton count={1} size={{ width: '100%', height: '4rem' }} />
                ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                        <h3 className="text-[20px] sm:text-[28px] m-0">Менин окуу планым</h3>

                        <Dropdown
                            value={selectedSort}
                            onChange={(e) => {
                                toggleSortSelect(e.value);
                            }}
                            options={sortOpt}
                            optionLabel="name"
                            placeholder=""
                            className="w-[213px]  md:w-14rem"
                        />
                    </div>
                )}

                {/* lesson section */}
                {hasLessons ? <NotFound titleMessage={'Сабактар убактылуу жетклиликсиз'} /> : skeleton ? <GroupSkeleton count={10} size={{ width: '100%', height: '3rem' }} /> : <div className="flex gap-2 sm:gap-6 flex-col">{lessonsDisplay}</div>}
            </div>
        </div>
    );
}
