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
import { useLocalization } from '@/layout/context/localizationcontext';

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
        formula: string;
        sections: { name: string; weight: string; description: string }[];
        title: string;
    }

    interface PerformanceType {
        course_sync_score: string;
        created_at: string;
        details: { courses_count: number; notifs_count: number; courses: number; notifs: number };
        id: number;
        id_edu_year: number;
        notification_score: string;
        study_from: string;
        study_to: string;
        total_rate: string;
        updated_at: string;
        user_id: number;
    }

    type OptionsType = Intl.DateTimeFormatOptions;

    const { user, departament } = useContext(LayoutContext);
    const { language, translations } = useLocalization();

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

    const kpdTitle = 'Мугалимдердин эффективдүүлүгүн эсептөө методикасы';
    const formulf = '(Курстун баллы + Билдирүү баллы) / 2';
    const timelinessAssessment = 'Семестрдин башталышына салыштырмалуу курстук тапшырмалардын өз убагында аткарылышы бааланат.';
    const notificationAssessment = 'Билдирмелерге жооп берүү убактысы (түзүлгөндөн ачылганга чейин) бааланат.';

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
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };
        const options = {
            plugins: {
                legend: {
                    position: 'bottom',
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
            labels: [translations.coursesConnection + performance?.course_sync_score + '%', translations.notificationsConnection + performance?.notification_score + '%', translations.totalRating + performance?.total_rate + '%'],
            datasets: [
                {
                    label: translations.statistics,
                    data: [performance?.course_sync_score, performance?.notification_score, performance?.total_rate],
                    backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    borderWidth: 1
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [performance, translations]);

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
            <div className="flex flex-col gap-[16px]">
                {/* user info */}
                <div className="relative overflow-hidden rounded-[16px] px-[16px] py-[14px] sm:px-[22px] sm:py-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                    <div className="relative flex items-center gap-[12px] sm:gap-[16px]">
                        <div className="flex items-center justify-center shrink-0 w-[46px] h-[46px] sm:w-[52px] sm:h-[52px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[16px] sm:text-[18px] font-bold uppercase">
                            {user ? `${user?.last_name?.[0] ?? ''}${user?.name?.[0] ?? ''}` : <i className="pi pi-user text-[20px]"></i>}
                        </div>
                        <h1 className="text-lg sm:text-xl m-0 min-w-0">
                            {user ? (
                                <div className="flex flex-col gap-[6px]">
                                    <span className="truncate font-semibold">
                                        {user?.last_name} {user?.name && user.name[0] + '.'} {user?.father_name && user.father_name[0] + '.'}
                                    </span>
                                    <div className="flex flex-wrap items-center gap-[6px]">
                                        <span className="inline-flex items-center gap-[6px] px-[10px] py-[3px] rounded-full bg-[var(--surface-100)] text-[var(--bodyColor)] text-[12px] sm:text-[13px] font-medium">
                                            <i className="pi pi-briefcase text-[11px]"></i>
                                            {translations.teacher}
                                        </span>
                                        {user?.is_working && departament?.name && (
                                            <span className="inline-flex items-center gap-[6px] px-[10px] py-[3px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[12px] sm:text-[13px] font-semibold">
                                                <i className="pi pi-star-fill text-[11px]"></i>
                                                {translations.headOfDepartment}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                '---'
                            )}
                        </h1>
                    </div>
                </div>

                {/* statistic */}
                {skeleton ? (
                    <div className="[display:grid] grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[12px]">
                        <GroupSkeleton count={1} size={{ width: '100%', height: '7rem' }} />
                        <GroupSkeleton count={1} size={{ width: '100%', height: '7rem' }} />
                        <GroupSkeleton count={1} size={{ width: '100%', height: '7rem' }} />
                        <GroupSkeleton count={1} size={{ width: '100%', height: '7rem' }} />
                    </div>
                ) : (
                    !hasCourses && (
                        <div className="[display:grid] grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[12px]">
                            {[
                                { title: translations.allCourses, icon: 'pi-book', stat: courses?.all, color: '#3b82f6', bg: '#dbeafe' },
                                { title: translations.closedCourses, icon: 'pi-lock', stat: courses?.lock, color: '#f7634d', bg: '#fde4df' },
                                { title: translations.openCoursesTitle, icon: 'pi-lock-open', stat: courses?.open, color: '#16a34a', bg: '#dcfce7' },
                                { title: translations.paidCourses, icon: 'pi-wallet', stat: courses?.wallet, color: '#8b5cf6', bg: '#ede9fe' }
                            ].map((card) => (
                                <Link
                                    key={card.icon}
                                    href={'/course/1'}
                                    className="group relative flex flex-col gap-[10px] min-h-[120px] p-[16px] rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_24px_-12px_rgba(33,34,95,0.25)] hover:border-[var(--mainBorder)]"
                                >
                                    <div className="flex justify-between gap-[8px] items-start">
                                        <span className="text-[14px] font-medium text-[var(--bodyColor)] leading-snug">{card.title}</span>
                                        <span className="flex items-center justify-center shrink-0 w-[42px] h-[42px] rounded-[12px] transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: card.bg, color: card.color }}>
                                            <i className={`pi ${card.icon} text-[18px]`}></i>
                                        </span>
                                    </div>
                                    <div className="text-[22px] font-bold leading-none text-[var(--titleColor)]">{card.stat?.total}</div>
                                    {card.stat?.last_month && card.stat.last_month > 0 ? (
                                        <small className="inline-flex items-center gap-[6px] self-start px-[8px] py-[3px] rounded-full bg-[#ecfdf3] text-[12px] text-[var(--bodyColor)]">
                                            <i className="pi pi-arrow-up-right text-[10px] text-[var(--greenColor)]"></i>
                                            <b className="text-[var(--greenColor)]">{card.stat.last_month}</b> {translations.createdLast30Days}
                                        </small>
                                    ) : (
                                        ''
                                    )}
                                    <i className="pi pi-arrow-right absolute right-[16px] bottom-[16px] text-[12px] text-[var(--mainColor)] opacity-0 -translate-x-[4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"></i>
                                </Link>
                            ))}
                        </div>
                    )
                )}

                {/* activity */}
                <div ref={ref} className="w-full rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-[12px] sm:p-[18px]">
                    <div className="flex items-center gap-[10px] mb-[16px]">
                        <span className="flex items-center justify-center w-[36px] h-[36px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                            <i className="pi pi-chart-line text-[16px]"></i>
                        </span>
                        <h2 className="m-0 text-[16px] sm:text-[18px] font-semibold">{translations.activity}</h2>
                    </div>
                    <ActivityPage value={contribution} />
                </div>

                {/* kpd */}
                <div className="main-bg p-3 sm:p-4">
                    <h3 className="text-xl text-center shadow-[var(--bottom-shadow)] pb-2 mb-2">{language === 'ky' ? kpdTitle : info?.title}</h3>
                    <b className="flex flex-wrap gap-1 items-center mb-3 text-sm sm:text-base">
                        {translations.reportFor}
                        <span className="text-sm">{<MyDateTime createdAt={performance?.study_from || ''} options={options} />}</span> -<span className="text-sm">{<MyDateTime createdAt={performance?.study_to || ''} options={options} />}</span>
                    </b>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col items-center gap-1 text-sm text-center">
                            <b className="text-md">
                                {translations.formula} <span className="text-sm">{language === 'ky' ? formulf : info?.formula}</span>
                            </b>
                            <b className="text-[var(--productQuantityText)]">{language === 'ky' ? timelinessAssessment : info?.sections[0]?.description}</b>
                            <b className="text-[var(--orangeColor)]">{language === 'ky' ? notificationAssessment : info?.sections[1]?.description}</b>
                        </div>
                        <div className="flex justify-around flex-col sm:flex-row gap-3 items-center">
                            <DataTable
                                value={[
                                    { label: translations.coursesCount, value: performance?.details?.courses },
                                    { label: translations.notificationsCount, value: performance?.details?.notifs }
                                ]}
                                showHeaders={false}
                                className="my-custom-table w-full max-w-[520px] p-3 border-1 border-[#dfe7ef] rounded-md bg-white/40"
                            >
                                <Column field="label" />
                                <Column field="value" />
                            </DataTable>
                            <div className="sm:card flex justify-center">
                                <div className="w-full max-w-[280px] aspect-square">
                                    <Chart type="pie" data={chartPieData} options={chartPieOptions} className="w-full h-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-3 p-2 sm:p-3 border-1 border-[#e6edf3] rounded-md bg-white/30">
                        <div className="w-full h-56 sm:h-64 md:h-72">
                            <Chart type="bar" data={chartData} options={chartOptions} className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        router.push('/');
    }
}
