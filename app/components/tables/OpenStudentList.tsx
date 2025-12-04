'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import MyDateTime from '../MyDateTime';
import { DataTable } from 'primereact/datatable';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import { NotFound } from '../NotFound';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useContext, useEffect, useState } from 'react';
import { mainStreamsType } from '@/types/mainStreamsType';
import { LayoutContext } from '@/layout/context/layoutcontext';
import useErrorMessage from '@/hooks/useErrorMessage';
import { OptionsType } from '@/types/OptionsType';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { fetchOpenStudents, fetchWeeks } from '@/services/openCourse';
import { User } from '@/types/user';

export default function OpenStudentList({ course_id, course_title, close }: { course_id: number | null; course_title: string | null; close: () => void }) {
    interface OpenCourseStudent extends User {
        all_score: number;
    }

    const media = useMediaQuery('(max-width: 640px)');

    const [studentList, setStudentList] = useState<OpenCourseStudent[]>([]);
    const [hasStudents, setHasStudents] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [tableSkeleton, setTableSkeleton] = useState(false);
    const [emptyStudents, setEmptyStudents] = useState(false);
    const [stream, setStream] = useState<mainStreamsType | null>(null);
    const [weekDays, setWeekDays] = useState<string[] | null>(null);
    const [displayWeekDays, setDisplayWeekDays] = useState<{ student_id: number; activity: string[] }[] | null>(null);
    const [sendStudentIds, setSendStudentIds] = useState<number[] | null>(null);
    const [currentDay, setCurrentDay] = useState<{ date: string | Date; day: string } | null>(null);

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const options: OptionsType = {
        year: '2-digit',
        month: '2-digit', // 'long', 'short', 'numeric'
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit',
        hour12: false // 24-часовой формат
    };

    const handleFetchOpenStudents = async () => {
        setSkeleton(true);
        const data = await fetchOpenStudents(course_id);
        if (data.success) {
            setHasStudents(false);
            setStudentList(data.students);
            if (data?.students?.length < 1) {
                setEmptyStudents(true);
            } else {
                setEmptyStudents(false);
            }
        } else {
            setHasStudents(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setSkeleton(false);
    };

    const handleFetchWeeks = async () => {
        const params = new URLSearchParams();

        params.append('course_id', String(course_id));
        // Добавляем каждый элемент массива отдельно
        sendStudentIds?.forEach((el) => {
            params.append('studentIds[]', String(el));
        });

        weekDays?.forEach((day) => {
            params.append('days[]', day);
        });

        setTableSkeleton(true);
        const data = await fetchWeeks(params);

        if (data.success) {
            setDisplayWeekDays(data.data);
        }
        setTableSkeleton(false);
    };

    const findWeekdays = (fromState: boolean, direction: 'next' | 'prev' | '') => {
        let baseDate: Date;

        if (!fromState) {
            // первая загрузка: сегодняшняя дата
            baseDate = new Date();
        } else {
            if (direction === 'next') {
                // брать последний день текущей недели и +1 день
                baseDate = new Date(weekDays ? weekDays[6] : '');
                baseDate.setDate(baseDate.getDate() + 1);
            } else if (direction === 'prev') {
                // брать первый день недели и -1 день
                baseDate = new Date(weekDays ? weekDays[0] : '');
                baseDate.setDate(baseDate.getDate() - 1);
            } else {
                baseDate = new Date();
            }
        }

        // День недели: Пн = 1 … Вс = 7
        const dayOfWeek = baseDate.getDay() === 0 ? 7 : baseDate.getDay();

        // Находим понедельник
        const monday = new Date(baseDate);
        monday.setDate(baseDate.getDate() - (dayOfWeek - 1));

        // Генерируем 7 дней недели
        const result = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const date = String(d.getDate()).padStart(2, '0');

            result.push(`${year}-${month}-${date}`);
        }

        return result;
    };

    const sendPrevNextWeek = (state: boolean, stateSend: 'next' | 'prev' | '') => {
        const result = findWeekdays(state, stateSend);
        if (result) {
            handleFetchOpenStudents();
            handleFetchWeeks();
            setWeekDays(result);
        } else {
            alert('oshibka');
        }
    };

    const week = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header="#" rowSpan={2} />
                <Column header="ФИО" rowSpan={2} />
                <Column header="Посещение за неделю" colSpan={7} style={{ textAlign: 'center' }} />
                <Column header="Балл" rowSpan={2} />
            </Row>
            <Row>
                {/* <Column
                    style={{ textAlign: 'center', width: '5px' }}
                    header={() => {
                        return (
                            <i
                                onClick={() => sendPrevNextWeek(true, 'prev')}
                                className={`${tableSkeleton ? 'opacity-50 pointer-events-none' : ''} cursor-pointer text-sm rounded-full hover:text-white hover:bg-[var(--mainColor)] pi pi-angle-left`}
                            ></i>
                        );
                    }}
                /> */}
                {displayWeekDays &&
                    Object.keys(displayWeekDays[0].activity).map((day, idx) => (
                        <Column
                            key={day}
                            header={() => {
                                return (
                                    <div className='flex items-center gap-1'>
                                        {idx === 0 && (
                                            <i
                                                onClick={() => sendPrevNextWeek(true, 'prev')}
                                                className={`${tableSkeleton ? 'opacity-50 pointer-events-none' : ''} cursor-pointer text-sm rounded-full hover:text-white hover:bg-[var(--mainColor)] pi pi-angle-left`}
                                            ></i>
                                        )}
                                        <div className={`${week[idx] === 'Сб' || week[idx] === 'Вс' ? 'bg-[red]' : 'bg-[green]'} text-white p-1 text-[13px] rounded-[2px] flex flex-col`}>
                                            <span>{week[idx]}</span>
                                            <span className="text-[10px]">{day}</span>
                                        </div>
                                        {idx === 6 && (
                                            <i
                                                onClick={() => sendPrevNextWeek(true, 'next')}
                                                className={`${tableSkeleton ? 'opacity-50 pointer-events-none' : ''} cursor-pointer rounded-full hover:text-white hover:bg-[var(--mainColor)] pi pi-angle-right`}
                                            ></i>
                                        )}
                                    </div>
                                );
                            }}
                            style={{ textAlign: 'center' }}
                        />
                    ))}
                {/* <Column
                    style={{ textAlign: 'center' }}
                    header={() => {
                        return <i onClick={() => sendPrevNextWeek(true, 'next')} className={`${tableSkeleton ? 'opacity-50 pointer-events-none' : ''} cursor-pointer rounded-full hover:text-white hover:bg-[var(--mainColor)] pi pi-angle-right`}></i>;
                    }}
                /> */}
            </Row>
        </ColumnGroup>
    );

    useEffect(() => {
        const forCurrentDay = new Date();
        const day = new Date().getDay();
        let newDay = '';
        switch (day) {
            case 0:
                newDay = 'Вс';
                break;
            case 1:
                newDay = 'Пн';
                break;
            case 2:
                newDay = 'Вт';
                break;
            case 3:
                newDay = 'Ср';
                break;
            case 4:
                newDay = 'Чт';
                break;
            case 5:
                newDay = 'Пт';
                break;
            case 6:
                newDay = 'Сб';
                break;
        }

        setCurrentDay({ date: forCurrentDay, day: newDay });
        handleFetchOpenStudents();
        const week = findWeekdays(false, '');
        if (week) {
            setWeekDays(week);
        } else {
            setWeekDays(null);
        }
    }, []);

    useEffect(() => {
        if (studentList && studentList?.length > 0) {
            const forStudentIds = studentList.map((item) => {
                return item?.id;
            });
            if (forStudentIds) {
                setSendStudentIds(forStudentIds);
            }
        }
    }, [studentList]);

    useEffect(() => {
        if (weekDays && sendStudentIds) {
            handleFetchWeeks();
        }
    }, [weekDays, sendStudentIds]);

    if (hasStudents) {
        <NotFound titleMessage={'Данные временно не доступны'} />;
    }

    return (
        <div>
            {skeleton ? (
                <GroupSkeleton count={studentList.length} size={{ width: '100%', height: '5rem' }} />
            ) : (
                <>
                    {/* info section */}
                    <div className="bg-[var(--titleColor)] relative flex flex-col justify-center items-center w-full text-white p-[30px] md:p-[40px] pb-4">
                        <i onClick={close} className="absolute text-white left-1 top-1 pi pi-arrow-left cursor-pointer p-2 rounded-full hover:bg-[var(--mainColor)] hover:text-[var(--titleColor)]"></i>
                        <h1 className="text-wrap break-words text-xl sm:text-2xl m-2" style={{ color: 'white', textAlign: 'center' }}>
                            {`Ваш открытый курс: ${course_title}`}
                        </h1>

                        {!emptyStudents ? (
                            <div className="w-full flex flex-wrap flex-col sm:flex-row gap-3 justify-center text-[12px] sm:text-[14px]">
                                <span className="text-sm font-semibold">{stream?.semester?.name_ru}</span>

                                <div className="flex gap-1 items-center">
                                    <span className="font-semibold">{stream?.subject_type_name?.name_ru}</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span>Количество записанных студентов: </span>
                                    <span className="font-semibold">{studentList?.length || 0}</span>
                                </div>
                                <div>
                                    <span className="bg-[var(--greenColor)] text-[12px] text-center text-white p-1 rounded">{'Бесплатный'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1 items-center">
                                <span>Все пользователи MOOC смогут находить этот курс, записываться и проходить его материалы.</span> <span className="underline">Пока на ваш курс никто не записан</span>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* week days controlled */}

            {/* {!emptyStudents && (
                <div className="flex gap-3 items-center justify-end m-2">
                    <i onClick={() => sendPrevNextWeek(true, 'prev')} className={`${tableSkeleton ? 'opacity-50 pointer-events-none' : ''} cursor-pointer p-1 rounded-full hover:text-white hover:bg-[var(--mainColor)] pi pi-arrow-left`}></i>

                    <div className={`${currentDay?.day === 'Сб' || currentDay?.day === 'Вс' ? 'bg-[red]' : 'bg-[green]'} text-white p-1 rounded-[2px] flex gap-3 items-center`}>
                        <span>{currentDay?.day}</span>
                        <span className="text-sm">
                            <MyDateTime createdAt={currentDay?.date || ''} options={options} />{' '}
                        </span>
                    </div>

                    <i onClick={() => sendPrevNextWeek(true, 'next')} className={`${tableSkeleton ? 'opacity-50 pointer-events-none' : ''} cursor-pointer p-1 rounded-full hover:text-white hover:bg-[var(--mainColor)] pi pi-arrow-right`}></i>
                </div>
            )} */}

            {emptyStudents ? (
                <b className="flex justify-center p-3 text-center">Здесь будет отображаться список ваших студентов</b>
            ) : (
                <div className="attendance-table-wrapper">
                    <DataTable value={studentList} key={Object.keys(displayWeekDays?.[0]?.activity || {}).join('-')} loading={tableSkeleton} headerColumnGroup={headerGroup} className="attendance-table">
                        <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '10px', fontSize: '14px' }}></Column>
                        <Column
                            field="name"
                            className="pl-1"
                            body={(rowData) => (
                                // <Link href={`/openCourse/students/${course_id}/${rowData.id}`} className="flex gap-1" key={rowData?.id}>
                                //     <span>{rowData?.last_name}</span>
                                //     <span>{rowData?.name}</span>
                                //     <span>{rowData?.father_name}</span>
                                // </Link>
                                <span className="flex gap-1 text-sm" key={rowData?.id}>
                                    <span>{rowData?.last_name}</span>
                                    <span>{rowData?.name}</span>
                                    <span>{rowData?.father_name}</span>
                                </span>
                            )}
                        ></Column>

                        {/* <Column /> */}

                        {displayWeekDays &&
                            displayWeekDays?.length > 0 &&
                            Object.keys(displayWeekDays[0].activity).map((dayKey: any) => (
                                <Column
                                    key={dayKey}
                                    body={(row) => {
                                        // найти активность конкретного студента
                                        const studentActivity = displayWeekDays?.find((item) => item.student_id === row.id);

                                        // если нет — пропускаем
                                        if (!studentActivity) return <div>—</div>;

                                        const value = studentActivity?.activity[dayKey];

                                        return <i className={`flex justify-center ${value ? 'pi pi-check text-[green] text-md' : 'pi pi-minus text-[red] text-md'}`}></i>;
                                    }}
                                />
                            ))}
                        {/* <Column /> */}

                        <Column field="all_score" style={{ textAlign: 'center', fontSize: '14px' }} />
                    </DataTable>
                </div>
            )}
        </div>
    );
}
