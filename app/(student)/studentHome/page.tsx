'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchStudentActivity, fetchStudentStatistic } from '@/services/studentMain';
import { Skeleton } from 'primereact/skeleton';
import { useContext, useEffect, useState } from 'react';
import ActivityPage from '@/app/components/Contribution';
import { fetchStudentImg } from '@/services/student/studentpage';
import { ContributionDay } from '@/types/ContributionDay';
import Link from 'next/link';
import { useLocalization } from '@/layout/context/localizationcontext';

// NOTE: primeflex подключён глобально с !important (w-9, w-12, grid, order-* и т.п. конфликтуют с Tailwind),
// поэтому для размеров/раскладки здесь используются произвольные значения Tailwind.

interface StudentStatistic {
    last_visit: string | null;
    streak: number | string | null;
    total_active_days: number | string | null;
}

// Бэкенд может вернуть дату как "YYYY-MM-DD HH:mm:ss" — Safari такой формат не парсит
const parseDate = (value: string | null | undefined): Date | null => {
    if (!value) return null;
    const normalized = /^\d{4}-\d{2}-\d{2} \d/.test(value) ? value.replace(' ', 'T') : value;
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? null : date;
};

const toNumber = (value: number | string | null | undefined): number | null => {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
};

export default function StudentHome() {
    const { user, contextNotifications } = useContext(LayoutContext);
    const { translations } = useLocalization();

    const [statsLoading, setStatsLoading] = useState(true);
    const [studentImg, setStudentImg] = useState<{ image_url: string; id: string } | null>(null);
    const [studentStatistic, setStudentStatistic] = useState<StudentStatistic | null>(null);
    const [contribution, setContribution] = useState<ContributionDay[] | null>(null);

    const handleFetchStudentImg = async () => {
        const data = await fetchStudentImg();
        if (data && data?.success) {
            setStudentImg(data?.data);
        }
    };

    const handleFetchStudentStatistic = async () => {
        setStatsLoading(true);
        const data = await fetchStudentStatistic();
        if (data && data?.success) {
            setStudentStatistic(data?.data);
        }
        setStatsLoading(false);
    };

    const handleFetchStudentActivity = async () => {
        const data = await fetchStudentActivity();
        if (data && data?.length) {
            setContribution(data);
        }
    };

    useEffect(() => {
        if (user?.is_student) {
            handleFetchStudentImg();
            handleFetchStudentStatistic();
            handleFetchStudentActivity();
        }
    }, [user]);

    const lastVisit = parseDate(studentStatistic?.last_visit);
    const streak = toNumber(studentStatistic?.streak);
    const totalActiveDays = toNumber(studentStatistic?.total_active_days);
    const notificationsCount = contextNotifications?.length || 0;

    const lastVisitDate = lastVisit
        ? lastVisit.toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: 'short',
              ...(lastVisit.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {})
          })
        : '—';
    const lastVisitTime = lastVisit ? lastVisit.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : null;

    const stats = [
        {
            key: 'streak',
            icon: 'pi pi-bolt',
            color: '#f59e0b',
            label: translations.daysVisitedStreak,
            value: streak ?? '—',
            hint: null
        },
        {
            key: 'total',
            icon: 'pi pi-calendar',
            color: 'var(--greenColor)',
            label: translations.daysVisitedTotal,
            value: totalActiveDays ?? '—',
            hint: null
        },
        {
            key: 'lastVisit',
            icon: 'pi pi-clock',
            color: 'var(--mainColor)',
            label: translations.lastVisit,
            value: lastVisitDate,
            hint: lastVisitTime
        }
    ];

    return (
        // Мобильный порядок: приветствие → активность → события.
        // Десктоп (xl): приветствие + события в первой строке, активность на всю ширину ниже.
        <div className="flex flex-col xl:flex-row xl:flex-wrap gap-[12px] sm:gap-[16px]">
            {/* Приветствие */}
            <div className="main-bg [order:1] xl:[flex:2_1_0%] relative overflow-hidden !p-3 sm:!p-6">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(8, 169, 230, 0.10) 0%, rgba(8, 169, 230, 0) 60%)' }}
                />
                <div className="hidden sm:block absolute -right-6 -bottom-10 opacity-10 pointer-events-none">
                    <i className="pi pi-user text-[150px] text-[var(--mainColor)]"></i>
                </div>

                <div className="relative z-10 flex items-center gap-[12px] sm:gap-[24px]">
                    <div className="w-[64px] h-[64px] sm:w-[160px] sm:h-[160px] shrink-0 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-white shadow-md ring-1 ring-gray-200 bg-gray-50">
                        <img
                            src={studentImg?.image_url?.length ? studentImg.image_url : '/layout/images/no-image.png'}
                            alt={translations.photo}
                            className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:gap-[8px] min-w-0">
                        <h1 className="text-lg sm:text-3xl font-bold text-[var(--titleColor)] m-0 leading-tight">
                            {translations.welcome}, {user?.name || translations.studentBtn}
                        </h1>
                        <p className="hidden sm:block text-lg text-[var(--bodyColor)] m-0">
                            {user?.last_name} {user?.name} {user?.father_name}
                        </p>

                        <div className="flex flex-wrap items-center gap-[6px] sm:gap-[8px] sm:mt-[4px]">
                            <Link
                                href="/notifications"
                                className="flex items-center gap-[6px] px-[10px] py-[4px] sm:px-[12px] sm:py-[6px] rounded-full bg-white border border-gray-200 text-xs sm:text-sm text-[var(--titleColor)] hover:border-[var(--mainColor)] transition-colors"
                            >
                                <i className="pi pi-bell text-[var(--mainColor)]"></i>
                                <span className="hidden sm:inline">{translations.notifications}</span>
                                <span className="min-w-[20px] h-[20px] px-[6px] flex items-center justify-center rounded-full bg-[var(--greenColor)] text-white text-xs font-bold">
                                    {notificationsCount}
                                </span>
                            </Link>
                            <Link
                                href="/teaching"
                                className="flex items-center gap-[6px] px-[10px] py-[4px] sm:px-[12px] sm:py-[6px] rounded-full bg-[var(--mainColor)] text-white text-xs sm:text-sm hover:opacity-90 transition-opacity"
                            >
                                <i className="pi pi-book"></i>
                                <span>{translations.trainingPlan}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Активность: статистика посещений + тепловая карта */}
            <div className="main-bg [order:2] xl:[order:3] xl:[flex-basis:100%] !p-3 sm:!p-6">
                <div className="flex items-start gap-[10px] mb-[12px]">
                    <span className="w-[36px] h-[36px] shrink-0 rounded-xl flex items-center justify-center" style={{ background: 'rgba(46, 192, 46, 0.14)' }}>
                        <i className="pi pi-chart-bar text-[var(--greenColor)]"></i>
                    </span>
                    <div className="flex flex-col min-w-0">
                        <h2 className="text-lg font-bold text-[var(--titleColor)] m-0 leading-tight">{translations.activity}</h2>
                        <span className="text-xs sm:text-sm text-[var(--bodyColor)]">{translations.activityHint}</span>
                    </div>
                </div>

                <div className="flex rounded-xl bg-[#f6f9fb] border border-gray-100 mb-[12px] divide-x divide-gray-200">
                    {stats.map((stat) => (
                        <div key={stat.key} className="flex-1 min-w-0 flex flex-col items-center text-center px-[6px] py-[10px] sm:py-[14px]">
                            {statsLoading ? (
                                <Skeleton width="3.5rem" height="1.5rem" className="mb-1" />
                            ) : (
                                <div className="flex items-center gap-[6px]">
                                    <i className={`${stat.icon} text-sm sm:text-base`} style={{ color: stat.color }}></i>
                                    <span className="text-lg sm:text-2xl font-bold text-[var(--titleColor)] leading-tight whitespace-nowrap">{stat.value}</span>
                                </div>
                            )}
                            {stat.hint && !statsLoading && <span className="text-xs text-[var(--bodyColor)] leading-tight">{stat.hint}</span>}
                            <span className="text-[11px] sm:text-sm text-[var(--bodyColor)] leading-tight mt-[2px]">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <ActivityPage value={contribution} />
            </div>

            {/* Предстоящие события */}
            <div className="main-bg [order:3] xl:[order:2] xl:[flex:1_1_0%] !p-3 sm:!p-6 flex flex-col">
                <div className="flex items-center gap-[8px] mb-[12px]">
                    <span className="w-[36px] h-[36px] shrink-0 rounded-xl flex items-center justify-center" style={{ background: 'rgba(8, 169, 230, 0.12)' }}>
                        <i className="pi pi-calendar-clock text-[var(--mainColor)]"></i>
                    </span>
                    <h3 className="text-lg font-bold text-[var(--titleColor)] m-0">{translations.upcomingEvents}</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-[8px] py-[16px] rounded-xl border border-dashed border-gray-200">
                    <i className="pi pi-inbox text-3xl text-gray-300"></i>
                    <p className="m-0 text-sm text-[var(--bodyColor)]">{translations.noUpcomingEvents}</p>
                </div>
            </div>
        </div>
    );
}
