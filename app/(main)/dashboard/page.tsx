'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { ContributionDay } from '@/types/ContributionDay';
import ActivityPage from '@/app/components/Contribution';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { fetchTeacherDashboard } from '@/services/dashboard/workingDashboard';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    interface CourseTotalLastMonth {total: number, last_month: number};

    interface CourseStatisticApi {
        all: CourseTotalLastMonth;
        lock: CourseTotalLastMonth;
        myActiveDays: string[];
        open: CourseTotalLastMonth;
        published: number;
        wallet: CourseTotalLastMonth;
    }

    const { user, departament, setMessage } = useContext(LayoutContext);

    const media = useMediaQuery('(max-width: 640px)');
    const router = useRouter();

    const [courses, setCourses] = useState<CourseStatisticApi | null>(null);
    const [hasCourses, setHasCourses] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const [contribution, setContribution] = useState<ContributionDay[] | null>(null);
    const [skeleton, setSkeleton] = useState(false);

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

    useEffect(() => {
        hanldeTeacherDashboard();
    }, []);

    if(!user?.is_student){
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
                            <Link href={'/course'} className="main-bg flex flex-col gap-1 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                                <div className="flex justify-between gap-1 items-start">
                                    <b className="underline text-[var(--bodyColor)]">Все курсы</b>
                                    <i className="pi pi-fw pi-book text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                                </div>
                                <div className="text-lg mb-1 text-[black]">{courses?.all?.total}</div>
                                {courses?.all.last_month && courses?.all.last_month > 0 ?
                                    <small>
                                        <b className="text-[var(--greenColor)]">{courses?.all.last_month}</b> созданы за последние 30 дней
                                    </small>
                                    : ''
                                }
                            </Link>
                            <Link href={'/course'} className="main-bg flex flex-col gap-1 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                                <div className="flex justify-between gap-1 items-start">
                                    <b className="underline text-[var(--bodyColor)]">Закрытые курсы</b>
                                    <i className="pi pi-fw pi-lock text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                                </div>
                                <div className="text-lg mb-1 text-[black]">{courses?.lock?.total}</div>
                                {courses?.lock.last_month && courses?.lock.last_month > 0 ? 
                                    <small>
                                        <b className="text-[var(--greenColor)]">{courses?.lock.last_month}</b> созданы за последние 30 дней
                                    </small>
                                    : ''
                                }
                            </Link>
                            <Link href={'/course'} className="main-bg flex flex-col gap-1 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                                <div className="flex justify-between gap-1 items-start">
                                    <b className="underline text-[var(--bodyColor)]">Открытые курсы</b> 
                                    <i className="pi pi-fw pi-lock-open text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                                </div>
                                <div className="text-lg mb-1 text-[black]">{courses?.open?.total}</div>
                                {courses?.open.last_month && courses?.open.last_month > 0 ? 
                                    <small>
                                        <b className="text-[var(--greenColor)]">{courses?.open.last_month}</b> созданы за последние 30 дней
                                    </small>
                                    : ''
                                }
                            </Link>
                            <Link href={'/course'} className="main-bg flex flex-col gap-1 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                                <div className="flex justify-between gap-1 items-start">
                                    <b className="underline text-[var(--bodyColor)]">Платные курсы</b>
                                    <i className="pi pi-fw pi-wallet text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                                </div>
                                <div className="text-lg mb-1 text-[black]">{courses?.wallet?.total}</div>
                                {courses?.wallet.last_month && courses?.wallet.last_month > 0 ? 
                                    <small>
                                        <b className="text-[var(--greenColor)]">{courses?.wallet.last_month}</b> созданы за последние 30 дней
                                    </small>
                                    : ''
                                }
                            </Link>
                        </div>
                    )
                )}
    
                <div className="flex flex-col gap-4 items-center">
                    {/* activity */}
                    <div className="w-full main-bg p-2">
                        <ActivityPage value={contribution} recipient="Активность преподавателя" userInfo={null} />
                    </div>
                </div>
            </div>
        );
    } else {
        router.push('/');
    }
}
