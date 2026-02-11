'use client';

import OpenCourseCard from '@/app/components/cards/OpenCourseCard';
import MyDateTime from '@/app/components/MyDateTime';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchActiveCourses } from '@/services/openCourse';
import { myMainCourseType } from '@/types/myMainCourseType';
import { CourseCategoryOption } from '@/types/openCourse/CourseCategoryOption';
import { OptionsType } from '@/types/OptionsType';
import Link from 'next/link';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';

export default function ActiveCourseList() {
    // types 

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const [coursesValue, setValueCourses] = useState<CourseCategoryOption[]>([]);
    const [emptyCourse, setEmptyCourse] = useState(false);
    const [hasCourses, setHasCourses] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [mainProgressSpinner, setMainProgressSpinner] = useState(false);

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        hour12: false // 24-часовой формат
    };

    const imageBodyTemplate = (product: any) => {
        const image = product.image;

        if (typeof image === 'string') {
            return (
                <div className="flex justify-center min-w-[60px] w-[60px] min-h-[60px] h-[60px] sm:w-[80px] sm:min-w-[80px] sm:h-[80px] sm:min-h-[80px] mx-4" key={product.id}>
                    <img src={image} alt="Course image" className="w-full object-cover shadow-2 border-round" />
                </div>
            );
        }

        return (
            <div className="flex justify-center min-w-[60px] w-[60px] min-h-[60px] h-[60px] sm:w-[80px] sm:min-w-[80px] sm:h-[80px] sm:min-h-[80px] mx-4" key={product.id}>
                <img src={'/layout/images/no-image.png'} alt="Course image" className="w-full object-cover shadow-2 border-round" />
            </div>
        );
    };

    function ProgressBar({ value = 0, max = 100, height = 'h-3', className = '' }) {
        const safeMax = typeof max === 'number' && max > 0 ? max : 100;
        const safeValue = typeof value === 'number' ? Math.max(0, Math.min(value, safeMax)) : 0;
        const pct = (safeValue / safeMax) * 100;

        return (
            <div style={{ height: height }} className={`w-full bg-white dark:bg-gray-700 rounded-full overflow-hidden ${className}`} role="progressbar" aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue} aria-label="Course progress">
                <div style={{ width: `${pct}%`, transition: 'width 400ms ease' }} className="bg-[var(--greenColor)] h-full" />
                <style jsx>{`
                    /* If you prefer a custom height using the height prop (e.g. 'h-4'),
                    apply it by targeting\ the inner bar via a wrapper class: */
                `}</style>
            </div>
        );
    }

    const handleFetchActiveCourse = async () => {
        setSkeleton(true);
        setMainProgressSpinner(true);
        const data = await fetchActiveCourses();

        if (data?.success) {
            setHasCourses(false);

            if (data?.courses?.length < 1) {
                setEmptyCourse(true);
            } else {
                setEmptyCourse(false);
            }
            setValueCourses(data.courses);
        } else {
            setHasCourses(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setMainProgressSpinner(false);
        setSkeleton(false);
    };

    const MyActiveCourse = ({ item }: { item: CourseCategoryOption }) => {
        const link = { url: `/openCourse/activeCourse/${item?.id}`, status: true };

        return <div className="flex flex-col shadow rounded p-2 sm:p-4 sm:pb-2 gap-2 w-full hover:shadow-lg">
            {/* header section */}
            <div className="flex items-start justify-between gap-2">
                <div className={`w-full flex gap-3 sm:items-center`}>
                    <Link href={link.url || '#'}>{imageBodyTemplate(item)}</Link>
                    {link.status ? (
                        <Link href={link.url || '#'}>
                            <b className="hidden sm:block cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline">
                                {item?.title}
                            </b>
                        </Link>
                    ) : (
                        <b className="hidden sm:block cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline">
                            {item?.title}
                        </b>
                    )}
                </div>
                <div className="flex-col items-end">
                    <div
                        className={`flex gap-1 items-center text-sm text-white rounded p-1 mb-1 ${item?.audience_type?.name === 'open' ? 'bg-[var(--greenColor)]' : item?.audience_type?.name === 'wallet' ? 'bg-[var(--amberColor)]' : ''
                            }`}
                    >
                        <i className={item?.audience_type?.icon} style={{ fontSize: '14px' }}></i>
                        <i className="text-[13px]">{item?.audience_type?.name === 'open' ? 'Бесплатный' : item?.audience_type?.name === 'wallet' ? 'Платный' : ''}</i>
                    </div>
                </div>
            </div>

            {link.status ? (
                <Link href={link.url || '#'}>
                    <b className="block sm:hidden cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline">
                        {item?.title}
                    </b>
                </Link>
            ) : (
                <b className="block sm:hidden cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline">
                    {item?.title}
                </b>
            )}

            {/* score, progress */}
            <div className='flex justify-end sm:items-end gap-4 flex-col sm:flex-row'>
                <div className='order-2 sm:order-1 flex items-center justiy-center sm:justify-end gap-1 text-sm sm:font-bold mb-[1px]'>
                    <span>Балл: </span>
                    <div className='flex items-center gap-1 text-[var(--mainColor)]'>{item?.total_score || 0} / {item?.max_score?.total_score || 0}</div>
                </div>

                <div className="flex flex-col items-center justify-between order-0 sm:order-2 shadow px-1">
                    <div>
                        <span className="text-[var(--titleColor)] text-sm">Статус завершения</span>
                    </div>
                    <div className="w-full flex items-center gap-1 justify-between order-0 sm:order-2 ">
                        <div className="flex items-center text-[var(--titleColor)]">
                            <span className="text-[14px] sm:text-md block sm:w-full">{Math.floor(typeof item?.progress_percent === 'number' ? item?.progress_percent : 0)}</span>
                            <span>%</span>
                        </div>
                        <div className="w-full border-1 rounded border-[green]">
                            <ProgressBar value={item?.progress_percent ? Number(item?.progress_percent) : 0} max={100} height="7px" className="h-3 sm:min-w-[150px] max-w-[80%]" />
                        </div>
                    </div>
                </div>

            </div>

            <div className='flex flex-col gap-1'>
                <div className="flex items-center gap-1 justify-between">

                </div>
                {/* data */}
                <div className="w-full flex justify-end text-[11px] order-1 sm:order-2">
                    <MyDateTime createdAt={item?.created_at} options={options} />
                </div>
            </div>
        </div>
    }

    useEffect(() => {
        handleFetchActiveCourse();
    }, []);

    if (mainProgressSpinner) return <div className='main-bg flex justify-center items-center h-[100vh]'><ProgressSpinner style={{ width: '60px', height: '60px' }} /></div>

    if (hasCourses) return <NotFound titleMessage="Данные не доступны" />;

    return (
        <div className="main-bg">
            <h1 className="m-0 mb-4 pb-1 shadow-[var(--bottom-shadow)] text-xl sm:text-2xl">Мои активные курсы</h1>
            {skeleton ? (
                <>
                    <GroupSkeleton count={2} size={{ width: '100%', height: '12rem' }} />
                    <GroupSkeleton count={2} size={{ width: '100%', height: '12rem' }} />
                </>
            ) : emptyCourse ? (
                <b className="flex justify-center">Пусто</b>
            ) : (
                <div className="flex flex-col gap-2">
                    {coursesValue?.map((item) => {
                        return (
                            <div key={item?.id}>
                                <MyActiveCourse item={item} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
