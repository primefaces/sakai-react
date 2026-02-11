'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { ContributionDay } from '@/types/ContributionDay';
import ActivityPage from '@/app/components/Contribution';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { fetchDashboardPerformance, fetchTeacherDashboard } from '@/services/dashboard/workingDashboard';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import MyDateTime from '@/app/components/MyDateTime';

export default function Dashboard() {
    interface CourseTotalLastMonth {
        total: number;
        last_month: number;
    }

    interface CourseStatisticApi {
        all: CourseTotalLastMonth;
        lock: CourseTotalLastMonth;
        myActiveDays: string[];
        open: CourseTotalLastMonth;
        published: number;
        wallet: CourseTotalLastMonth;
    }

    interface InfoType {
        formula: string,
        sections: { name: string, weight: string, description: string }[],
        title: string
    }

    interface PerformanceType {
        course_sync_score: string,
        created_at: string,
        details: { courses_count: number, notifs_count: number, courses:number, notifs:number },
        id: number,
        id_edu_year: number,
        notification_score: string,
        study_from: string,
        study_to: string,
        total_rate: string,
        updated_at: string,
        user_id: number
    }

    type OptionsType = Intl.DateTimeFormatOptions;

    const { user, departament } = useContext(LayoutContext);

    const ref = useRef<HTMLDivElement>(null);
    const media = useMediaQuery('(max-width: 640px)');
    const router = useRouter();

    const [courses, setCourses] = useState<CourseStatisticApi | null>(null);
    const [hasCourses, setHasCourses] = useState(false);
    const [contribution, setContribution] = useState<ContributionDay[] | null>(null);
    const [skeleton, setSkeleton] = useState(false);
    const [performance, setPerformance] = useState<PerformanceType | null>(null);
    const [info, setInfo] = useState<InfoType | null>(null);

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const [chartPieData, setChartPieData] = useState({});
    const [chartPieOptions, setChartPieOptions] = useState({});

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour12: false // 24-часовой формат
    };

    const hanldeTeacherDashboard = async () => {
        setSkeleton(true);
        const data = await fetchTeacherDashboard();

        if (data && data?.all) {
            if (data?.myActiveDays) {
                setContribution(data.myActiveDays);
            }
            setHasCourses(false);
            setCourses(data);
        } else {
            setHasCourses(true);
        }
        setSkeleton(false);
    };

    const hanldeFetchPerformance = async () => {
        const data = await fetchDashboardPerformance();

        if (data && data?.performance) {
            // setHasCourses(false);
            setPerformance(data?.performance);
            setInfo(data?.info);
        } else {
            // setHasCourses(true);
        }
    };

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: [info?.sections[0]?.name, info?.sections[1]?.name],
            datasets: [
                {
                    data: [50, 50],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400')
                    ]
                }
            ]
        }
        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };

        setChartPieData(data);
        setChartPieOptions(options);
    }, [info]);

    useEffect(() => {
        const data = {
            labels: ['Курсы(связь) ' + performance?.course_sync_score + "%", "Уведом-я(связь) " + performance?.notification_score + '%', 'Общий рейтинг ' + performance?.total_rate + '%'],
            datasets: [
                {
                    label: 'Статистика',
                    data: [performance?.course_sync_score, performance?.notification_score, performance?.total_rate],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [performance]);

    useEffect(() => {
        hanldeTeacherDashboard();
        hanldeFetchPerformance();
    }, []);

    useEffect(() => {
        if (media) {
            if (ref.current) {
                ref.current.scrollLeft = ref.current.scrollWidth;
            }
        }
    }, [media]);

    if (!user?.is_student) {
        return (
            <div className="flex flex-col gap-2">
                {/* user info */}
                <div className="main-bg">
                    <h1 className="text-lg sm:text-xl m-0">
                        {user ? (
                            <div className="flex flex-col gap-1">
                                {user?.last_name} {user?.name && user.name[0] + '.'} {user?.father_name && user.father_name[0] + '.'}
                                <small className="text-sm">Преподаватель {user?.is_working && departament?.name && '• Зав. кафедрой'}</small>
                            </div>
                        ) : (
                            '---'
                        )}
                    </h1>
                </div>

                {/* statistic */}
                {skeleton ? (
                    <div className="w-full flex items-center justify-center gap-1 flex-col sm:flex-row sm:flex-wrap">
                        <GroupSkeleton count={1} size={{ width: '260px', height: '6rem' }} />
                        <GroupSkeleton count={1} size={{ width: '260px', height: '6rem' }} />
                        <GroupSkeleton count={1} size={{ width: '260px', height: '6rem' }} />
                        <GroupSkeleton count={1} size={{ width: '260px', height: '6rem' }} />
                    </div>
                ) : (
                    !hasCourses && (
                        <div className="flex items-start gap-2 justify-around lg:justify-between flex-wrap mb-2">
                            <Link href={'/course/1'} className="main-bg flex flex-col gap-1 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                                <div className="flex justify-between gap-1 items-start">
                                    <b className="underline text-[var(--bodyColor)]">Все курсы</b>
                                    <i className="pi pi-fw pi-book text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                                </div>
                                <div className="text-lg mb-1 text-[black]">{courses?.all?.total}</div>
                                {courses?.all.last_month && courses?.all.last_month > 0 ? (
                                    <small>
                                        <b className="text-[var(--greenColor)]">{courses?.all.last_month}</b> созданы за последние 30 дней
                                    </small>
                                ) : (
                                    ''
                                )}
                            </Link>
                            <Link href={'/course/1'} className="main-bg flex flex-col gap-1 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                                <div className="flex justify-between gap-1 items-start">
                                    <b className="underline text-[var(--bodyColor)]">Закрытые курсы</b>
                                    <i className="pi pi-fw pi-lock text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                                </div>
                                <div className="text-lg mb-1 text-[black]">{courses?.lock?.total}</div>
                                {courses?.lock.last_month && courses?.lock.last_month > 0 ? (
                                    <small>
                                        <b className="text-[var(--greenColor)]">{courses?.lock.last_month}</b> созданы за последние 30 дней
                                    </small>
                                ) : (
                                    ''
                                )}
                            </Link>
                            <Link href={'/course/1'} className="main-bg flex flex-col gap-1 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                                <div className="flex justify-between gap-1 items-start">
                                    <b className="underline text-[var(--bodyColor)]">Открытые курсы</b>
                                    <i className="pi pi-fw pi-lock-open text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                                </div>
                                <div className="text-lg mb-1 text-[black]">{courses?.open?.total}</div>
                                {courses?.open.last_month && courses?.open.last_month > 0 ? (
                                    <small>
                                        <b className="text-[var(--greenColor)]">{courses?.open.last_month}</b> созданы за последние 30 дней
                                    </small>
                                ) : (
                                    ''
                                )}
                            </Link>
                            <Link href={'/course/1'} className="main-bg flex flex-col gap-1 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                                <div className="flex justify-between gap-1 items-start">
                                    <b className="underline text-[var(--bodyColor)]">Платные курсы</b>
                                    <i className="pi pi-fw pi-wallet text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                                </div>
                                <div className="text-lg mb-1 text-[black]">{courses?.wallet?.total}</div>
                                {courses?.wallet.last_month && courses?.wallet.last_month > 0 ? (
                                    <small>
                                        <b className="text-[var(--greenColor)]">{courses?.wallet.last_month}</b> созданы за последние 30 дней
                                    </small>
                                ) : (
                                    ''
                                )}
                            </Link>
                        </div>
                    )
                )}

                {/* activity */}
                <div ref={ref} className="w-full main-bg p-2">
                    <h2 style={{ marginBottom: 20 }} className="text-md sm:text-lg flex items-center justify-center gap-2">
                        <span>Активность преподавателя</span>
                    </h2>
                    <ActivityPage value={contribution} />
                </div>

                {/* kpd */}
                <div className='main-bg'>
                    <h3 className='text-xl text-center shadow-[var(--bottom-shadow)] pb-1'>{info?.title}</h3>
                    <b className='flex gap-1 items-center mb-1'>
                        Отчёт за:
                        <span className='text-sm'>{<MyDateTime createdAt={performance?.study_from || ''} options={options} />}</span> -
                        <span className='text-sm'>{<MyDateTime createdAt={performance?.study_to || ''} options={options} />}</span>
                    </b>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-col items-center gap-1 text-sm'>
                            <b className='text-md'>Формула: <span className='text-sm'>{info?.formula}</span></b>
                            <b className='text-[var(--productQuantityText)]'>{info?.sections[0]?.description}</b>
                            <b className='text-[var(--orangeColor)]'>{info?.sections[1]?.description}</b>
                        </div>
                        <div className='flex items-center sm:items-start gap-1 justify-around flex-col sm:flex-row'>
                            <DataTable value={[
                                { label: 'Количество курсов :', value: performance?.details?.courses },
                                { label: 'Количество уведомлений :', value: performance?.details?.notifs }
                            ]} showHeaders={false} className='my-custom-table max-w-[400px] p-2 border-1 border-[#dfe7ef]'>
                                <Column field="label" />
                                <Column field="value" />
                            </DataTable>
                            <div className="sm:card flex justify-content-center">
                                <Chart type="pie" data={chartPieData} options={chartPieOptions} className="w-full md:w-20rem" />
                            </div>
                        </div>
                    </div>

                    <div className="card mt-1">
                        <Chart type="bar" data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        );
    } else {
        router.push('/');
    }
}
