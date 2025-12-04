'use client';

import OpenCourseCard from '@/app/components/cards/OpenCourseCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchActiveCourses, fetchOpenCourses } from '@/services/openCourse';
import { myMainCourseType } from '@/types/myMainCourseType';
import { useContext, useEffect, useState } from 'react';

export default function ActiveCourseList() {
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const [coursesValue, setValueCourses] = useState<myMainCourseType[]>([]);
    const [emptyCourse, setEmptyCourse] = useState(false);
    const [hasCourses, setHasCourses] = useState(false);
    const [skeleton, setSkeleton] = useState(false);

    const handleFetchActiveCourse = async () => {
        setSkeleton(true);
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
        setSkeleton(false);
    };

    useEffect(() => {
        handleFetchActiveCourse();
    }, []);

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
                <div className="main-bg">
                    <b className="flex justify-center">Пусто</b>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {coursesValue?.map((item) => {
                        return (
                            <div key={item?.id}>
                                {/* <OpenCourseShowCard course={item} /> */}
                                <OpenCourseCard course={item} signBtn={false} link={{ url: `/openCourse/activeCourse/${item?.id}`, status: true }} courseShowProp={() => {}} courseSignup={() => {}} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
