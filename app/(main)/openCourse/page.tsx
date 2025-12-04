'use client';

import OpenCourseCard from '@/app/components/cards/OpenCourseCard';
import OpenCourseShowCard from '@/app/components/cards/OpenCourseShowCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchOpenCourses, openCourseShow, openCourseSignup, signupList } from '@/services/openCourse';
import { myMainCourseType } from '@/types/myMainCourseType';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { useContext, useEffect, useState } from 'react';

export default function OpenCourse() {
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const params = new URLSearchParams();
    const [mainCourse, setMainCourse] = useState([]);
    const [coursesValue, setValueCourses] = useState<myMainCourseType[]>([]);
    const [courseDetail, setCourseDetail] = useState<myMainCourseType | null>(null);
    const [free, setFree] = useState<'free' | 'paid' | null>(null);
    const [search, setSearch] = useState<string>('');
    const [skeleton, setSkeleton] = useState(false);
    const [hasCourses, setHasCourses] = useState(false);
    const [emptyCourse, setEmptyCourse] = useState(false);
    const [pageState, setPageState] = useState<number>(1);
    const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>({
        currentPage: 1,
        total: 0,
        perPage: 0
    });
    const [searchController, setSearchController] = useState(false);
    const [showVisisble, setShowVisible] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [sendSignupList, setSendSignupList] = useState(false);

    const handleFetchOpenCourse = async (page: number, audence_type_id: number | string, search: string) => {
        setSkeleton(true);
        const data = await fetchOpenCourses(page, audence_type_id, search);
        console.log(data);

        if (data && Array.isArray(data.data)) {
            setHasCourses(false);
            setMainCourse(data);
            if (data?.data?.length < 1) {
                setEmptyCourse(true);
            } else {
                setEmptyCourse(false);
            }
            setValueCourses(data.data);
            const list: any | null = await handleSignupList(data?.data);
            if (list) {
                console.warn(list);
                setValueCourses((prev) =>
                    prev.map((item) => ({
                        ...item,
                        is_signed: list.signed_courses?.includes(item.id)
                    }))
                );
            }
            setPagination({
                currentPage: data.current_page,
                total: data?.total,
                perPage: data?.per_page
            });
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

    const handleCourseShow = async (course_id: number) => {
        setShowVisible(true);
        setSkeleton(true);
        const data = await openCourseShow(course_id);
        console.log(data);

        if (data && Object.values(data)?.length) {
            setCourseDetail(data);
        } else {
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

    // signup courses list
    const handleSignupList = async (course: any) => {
        course?.forEach((i:{id:number}) => params.append('course_Ids[]', String(i?.id)));
        const data = await signupList(params);

        if (data && data?.signed_courses) {
            return data;
        } else {
            return null;
        }
    };

    // signUp
    const сourseSignup = async (course_id: number) => {
        const data = await openCourseSignup(course_id);
        console.log(data);

        if (data?.success) {
            // handleFetchOpenCourse(1, free === 'paid' ? '3' : free === 'free' ? '2' : '', search);
            const list: any | null = await handleSignupList(coursesValue);
            if (list) {
                setValueCourses((prev) =>
                    prev.map((item) => ({
                        ...item,
                        is_signed: list.signed_courses.includes(item.id)
                    }))
                );
                setMessage({
                    state: true,
                    value: { severity: 'success', summary: list?.message || 'Успешное добавление!', detail: '' }
                });
                setValueCourses((prev) =>
                    prev.map((item) => ({
                        ...item,
                        is_signed: list.signed_courses?.includes(item.id)
                    }))
                );
            }
        } else {
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
    };

    const clearFilter = () => {
        setFree(null);
        handleFetchOpenCourse(pageState, '', '');
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        handleFetchOpenCourse(page, free === 'paid' ? '3' : free === 'free' ? '2' : '', search);
        setPageState(page);
    };

    useEffect(() => {
        setProgressSpinner(true);
        if (search?.length === 0 && searchController) {
            handleFetchOpenCourse(pageState, free === 'paid' ? '3' : free === 'free' ? '2' : '', search);
            setSearchController(false);
            setProgressSpinner(false);
        }

        if (search?.length < 2) {
            setProgressSpinner(false);
            return;
        }

        setSearchController(true);
        const delay = setTimeout(() => {
            handleFetchOpenCourse(pageState, free === 'paid' ? '3' : free === 'free' ? '2' : '', search);
            setProgressSpinner(false);
        }, 1000);

        return () => {
            clearTimeout(delay);
        };
    }, [search]);

    useEffect(() => {
        if (coursesValue?.length) {
            setSendSignupList(true);
        } else {
            setSendSignupList(false);
        }
    }, [coursesValue]);

    useEffect(() => {
        const handleSendSingup = async () => {
            const list: any | null = await handleSignupList(coursesValue);
            if (list) {
                setValueCourses((prev) =>
                    prev.map((item) => ({
                        ...item,
                        is_signed: list.signed_courses?.includes(item.id)
                    }))
                );
            }
        };
        if (sendSignupList) {
            handleSendSingup();
        }
    }, [sendSignupList]);

    useEffect(() => {
        handleFetchOpenCourse(pageState, '', '');
    }, []);

    if (hasCourses) return <NotFound titleMessage="Данные не доступны" />;

    return (
        <div className="flex flex-col gap-2">
            <div className="main-bg">
                {/* header section */}
                <div>
                    <h1 className="text-xl sm:text-2xl m-0 mb-2 pb-1 shadow-[var(--bottom-shadow)]">Курсы</h1>
                </div>

                {/* filter section */}
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center m-2">
                        <div className="flex gap-3 items-center">
                            <div className="flex items-center">
                                <label className="custom-radio p-0">
                                    <input
                                        type="checkbox"
                                        checked={free === 'free'}
                                        className={`customCheckbox p-0`}
                                        onChange={() => {
                                            handleFetchOpenCourse(pageState, 2, search);
                                            setFree((prev) => (prev === 'free' ? null : 'free'));
                                        }}
                                    />
                                    <span className="checkbox-mark"></span>
                                </label>
                                <p>Бесплатные</p>
                            </div>
                            <div className="flex items-center">
                                <label className="custom-radio p-0">
                                    <input
                                        type="checkbox"
                                        checked={free === 'paid'}
                                        className={`customCheckbox`}
                                        onChange={() => {
                                            handleFetchOpenCourse(pageState, 3, search);
                                            setFree((prev) => (prev === 'paid' ? null : 'paid'));
                                        }}
                                    />
                                    <span className="checkbox-mark"></span>
                                </label>
                                <p>Платные</p>
                            </div>
                        </div>
                        <Button label="Сбросить фильтр" size="small" className="text-sm p-1" onClick={clearFilter} />
                    </div>
                    <div className="flex items-center relative">
                        <InputText placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-inputtext-sm p-inputtext-rounded" />
                        <div className="absolute right-1">{progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                    </div>
                </div>
            </div>

            {/* courses section */}
            {skeleton ? (
                <>
                    <GroupSkeleton count={2} size={{ width: '100%', height: '12rem' }} />
                    <GroupSkeleton count={2} size={{ width: '100%', height: '12rem' }} />
                </>
            ) : emptyCourse ? (
                <div className="main-bg">
                    <b className="flex justify-center">Курсы отсутствуют</b>
                </div>
            ) : (
                <>
                    <div className="main-bg open__course__grid">
                        {coursesValue?.map((item) => {
                            return (
                                <div key={item?.id}>
                                    {/* <OpenCourseShowCard course={item} /> */}
                                    <OpenCourseCard course={item} signBtn={true} link={{url: null, status: false}} courseShowProp={handleCourseShow} courseSignup={сourseSignup} />
                                </div>
                            );
                        })}
                    </div>
                    <div className={`shadow-[0px_-11px_5px_-6px_rgba(0,_0,_0,_0.1)]`}>
                        <Paginator
                            first={(pagination.currentPage - 1) * pagination.perPage}
                            rows={pagination.perPage}
                            totalRecords={pagination.total}
                            onPageChange={(e) => handlePageChange(e.page + 1)}
                            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        />
                    </div>
                </>
            )}

            <Sidebar visible={showVisisble} position="bottom" style={{ height: '90vh' }} onHide={() => setShowVisible(false)}>
                {skeleton ? <GroupSkeleton count={1} size={{ width: '100%', height: '12rem' }} /> : courseDetail ? <OpenCourseShowCard course={courseDetail} courseSignup={сourseSignup}/> : <b className="flex justify-center">Данные не доступны</b>}
            </Sidebar>
        </div>
    );
}
