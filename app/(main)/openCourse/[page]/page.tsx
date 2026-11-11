'use client';

import OpenCourseCard from '@/app/components/cards/OpenCourseCard';
import OpenCourseShowCard from '@/app/components/cards/OpenCourseShowCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import useMediaQuery from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchOpenCourses, openCourseShow, openCourseSignup, signupList } from '@/services/openCourse';
import { depCategoryFetch, depLangFetch } from '@/services/roles/roles';
import { CourseCategoryOption } from '@/types/openCourse/CourseCategoryOption';
import { MainLangType } from '@/types/openCourse/MainLangType';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import React, { useContext, useEffect, useState } from 'react';
import { useLocalization } from '@/layout/context/localizationcontext';
import MainTitle from '@/app/components/titles/MainTitle';

// types
interface CategoryId {
    title: string;
    id: number | null;
    description: string;
    name_ru?: string;
    name_kg?: string;
}

interface SelectLangType extends Pick<MainLangType, 'title' | 'description' | 'id'> {
    name_ru?: string;
    name_kg?: string;
}

export default function OpenCourse() {
    const { page } = useParams();
    const router = useRouter();
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const media = useMediaQuery('(max-width: 640px)');
    const { translations, language } = useLocalization();

    const params = new URLSearchParams();
    const [coursesValue, setValueCourses] = useState<CourseCategoryOption[]>([]);
    const [courseDetail, setCourseDetail] = useState<CourseCategoryOption | null>(null);
    const [free, setFree] = useState<'free' | 'paid' | null>(null);
    const [search, setSearch] = useState<string>('');
    const [skeleton, setSkeleton] = useState(false);
    const [hasCourses, setHasCourses] = useState(false);
    const [emptyCourse, setEmptyCourse] = useState(false);
    const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>({
        currentPage: 1,
        total: 0,
        perPage: 0
    });
    const [searchController, setSearchController] = useState(false);
    const [showVisisble, setShowVisible] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [mainProgressSpinner, setMainProgressSpinner] = useState(false);
    const [signUpList, setSignupList] = useState<number[]>([]);
    const [signupDisabled, setSignupDisebled] = useState(false);

    const [langSelectedId, setLangSelectedId] = useState<SelectLangType | null>({ title: translations.all, id: null, description: '' });
    const [depSelectLang, setSelectLang] = useState<SelectLangType[]>([{ title: translations.selectCategoryPlaceholder, id: null, description: '' }]);
    const [language_id, setLanguage_id] = useState<number | null>(null);

    const [categorySelectedId, setCategorySelectedId] = useState<CategoryId | null>({ title: translations.all, id: null, description: '' });
    const [depCategoryes, setCategoryes] = useState<CategoryId[]>([{ title: translations.selectCategoryPlaceholder, id: null, description: '' }]);

    const getLocalizedName = (item: any) => {
        if (!item) return '';
        if (language === 'ky' && item.name_kg) return item.name_kg;
        if (language === 'ru' && item.name_ru) return item.name_ru;
        return item.name || item.title || '';
    };

    const handleFetchOpenCourse = async (page: number, audence_type_id: number | string, search: string, categoryId: number | null, lang_id: number | null) => {
        setSkeleton(true);
        setMainProgressSpinner(true);
        const data = await fetchOpenCourses(page, audence_type_id, search, categoryId, lang_id);

        if (data && Array.isArray(data.data)) {
            setHasCourses(false);
            if (data?.data?.length < 1) {
                setEmptyCourse(true);
            } else {
                setEmptyCourse(false);
            }
            setValueCourses(data.data);
            setPagination({
                currentPage: data.current_page,
                total: data?.total,
                perPage: data?.per_page
            });
        } else {
            setHasCourses(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.error, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setSkeleton(false);
        setMainProgressSpinner(false);
    };

    const handleDepCategoryFetch = async () => {
        const res = await depCategoryFetch();
        if (res && res?.length) {
            const forCategoryes = res.map((item: { title: string; id: number; description: string; name_ru?: string; name_kg?: string }) => {
                return { name: item?.title, id: item?.id, description: item?.description, name_ru: item?.name_ru, name_kg: item?.name_kg };
            });
            if (forCategoryes) {
                forCategoryes.unshift({ name: translations.all, id: null, description: translations.showAllCourses });
                setCategoryes(forCategoryes);
            }
        }
    };

    // lang
    const handleDepLangFetch = async () => {
        const res = await depLangFetch();
        if (res && res?.success) {
            const selectLangList = res?.data;
            if (selectLangList) {
                selectLangList?.unshift({ title: translations.all, id: null, description: translations.showAllCourses });
                setSelectLang(res?.data);
            }
        }
    };

    const handleCourseShow = async (course_id: number) => {
        setShowVisible(true);
        setSkeleton(true);
        const data = await openCourseShow(course_id);

        if (data && Object.values(data)?.length) {
            setCourseDetail(data);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.error, detail: data?.response?.data?.message }
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
        course?.forEach((i: { id: number }) => params.append('course_Ids[]', String(i?.id)));
        const data = await signupList(params);
        if (data && data?.signed_courses) {
            return data?.signed_courses;
        } else {
            return null;
        }
    };

    // signUp
    const сourseSignup = async (course_id: number) => {
        setSignupDisebled(true);
        const data = await openCourseSignup(course_id);
        if (data?.success) {
            handleSendSingup();
            const list: any | null = await handleSignupList(coursesValue);
            if (list) {
                setValueCourses((prev) =>
                    prev.map((item) => ({
                        ...item,
                        is_signed: list?.signed_courses?.includes(item.id)
                    }))
                );
                setMessage({
                    state: true,
                    value: { severity: 'success', summary: list?.message || translations.successAdd, detail: '' }
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
                value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.error, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setSignupDisebled(false);
    };

    const handleSendSingup = async () => {
        const list: any | null = await handleSignupList(coursesValue);
        if (list) setSignupList(list);
    };

    const clearFilter = () => {
        setFree(null);
        handleFetchOpenCourse(Number(page), '', '', null, null);
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        router.push(`/openCourse/${page}`);
    };

    // category jsx
    const categoryItemTemplate = (option: any) => {
        return (
            <div className="w-full flex flex-col">
                <span className="font-medium text-[13px] sm:text-md">{getLocalizedName(option)}</span>
                {option.description && <span className="text-xs text-gray-500 text-[12px] sm:text-sm max-w-[300px] text-wrap word-break sm:text-nowrap sm:max-w-full">{option.description}</span>}
            </div>
        );
    };

    const categoryValueTemplate = (option: any | null) => {
        if (!option) {
            return <span className="text-gray-400">...</span>;
        }

        return (
            <div className="flex flex-col">
                <span>{getLocalizedName(option)}</span>
                {option.description && <span className="text-xs text-gray-500">{option.description}</span>}
            </div>
        );
    };

    // lang jsx
    const langItemTemplate = (option: any) => {
        return (
            <div className="w-full flex flex-col">
                <div className="flex gap-1 items-center">
                    {option?.logo && <img src={`/layout/images/flags/${option?.logo}`} alt="flag" className="w-[20px] h-[20px]" />}
                    <span className="font-medium text-[13px] sm:text-md">{getLocalizedName(option)}</span>
                </div>
                {option.description && <span className="text-xs text-gray-500 text-[12px] sm:text-sm max-w-[300px] text-wrap word-break sm:text-nowrap sm:max-w-full">{option.description}</span>}
            </div>
        );
    };

    const langValueTemplate = (option: any | null) => {
        if (!option) {
            return <span className="text-gray-400">...</span>;
        }

        return (
            <div className="flex gap-1 items-center">
                {option?.logo && <img src={`/layout/images/flags/${option?.logo}`} alt="flag" className="w-[20px] h-[20px]" />}
                <span className="font-medium text-[13px] sm:text-md">{getLocalizedName(option)}</span>
            </div>
        );
    };

    // filter render
    const filterRender = () => (
        <div className="flex flex-col gap-2 mt-2">
            <div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center m-2">
                    <div className="flex gap-3 items-center">
                        <div className="flex items-center">
                            <label className="custom-radio p-0">
                                <input
                                    type="checkbox"
                                    checked={free === 'free'}
                                    className={`customCheckbox p-0`}
                                    onChange={() => {
                                        handleFetchOpenCourse(Number(page), 2, search, categorySelectedId?.id || null, language_id);
                                        setFree((prev) => (prev === 'free' ? null : 'free'));
                                    }}
                                />
                                <span className="checkbox-mark"></span>
                            </label>
                            <p>{translations.free}</p>
                        </div>
                        <div className="flex items-center">
                            <label className="custom-radio p-0">
                                <input
                                    type="checkbox"
                                    checked={free === 'paid'}
                                    className={`customCheckbox`}
                                    onChange={() => {
                                        handleFetchOpenCourse(Number(page), 3, search, categorySelectedId?.id || null, language_id);
                                        setFree((prev) => (prev === 'paid' ? null : 'paid'));
                                    }}
                                />
                                <span className="checkbox-mark"></span>
                            </label>
                            <p>{translations.paid}</p>
                        </div>
                    </div>
                    <div className="flex items-end">
                        <Button
                            label={translations.resetFilter}
                            icon="pi pi-refresh"
                            onClick={clearFilter}
                            className="w-full py-1 bg-white text-gray-700 border-0 shadow-sm ring-1 ring-gray-200 rounded-xl hover:bg-gray-50 hover:text-red-500 transition-all duration-200 flex justify-center gap-2"
                            size="small"
                        />
                    </div>
                </div>
                <div className="flex items-start flex-col sm:flex-row gap-2">
                    <div className="flex flex-col gap-2 max-w-[80%] overflow-x-hidden">
                        <b className="px-1">{translations.selectCategory}</b>
                        <div>
                            <Dropdown
                                value={categorySelectedId}
                                itemTemplate={categoryItemTemplate}
                                valueTemplate={categoryValueTemplate}
                                onChange={(e: DropdownChangeEvent) => {
                                    setCategorySelectedId(e.value);
                                    // setPublicCategoryId(e.value?.id);
                                }}
                                options={depCategoryes}
                                optionLabel="name"
                                placeholder="..."
                                className="w-full text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <b className="px-1">{translations.selectLanguage}</b>
                        <div className="max-w-[95%] flex juctify-center items-start">
                            <Dropdown
                                value={langSelectedId}
                                itemTemplate={langItemTemplate}
                                valueTemplate={langValueTemplate}
                                onChange={(e: DropdownChangeEvent) => {
                                    setLangSelectedId(e.value);
                                    setLanguage_id(e.value?.id);
                                }}
                                options={depSelectLang}
                                optionLabel="name"
                                placeholder="..."
                                className="w-full text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Button label={translations.resetFilter} size="small" className="block sm:hidden text-sm p-1" onClick={clearFilter} />

            <div className="flex items-center relative">
                <InputText placeholder={`${translations.search}...`} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-inputtext-sm p-inputtext-rounded" />
                <div className="absolute right-1">{progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
            </div>
        </div>
    );

    // main content
    const mainContent = () => {
        if (skeleton) {
            return (
                <>
                    <GroupSkeleton count={2} size={{ width: '100%', height: '12rem' }} />
                    <GroupSkeleton count={2} size={{ width: '100%', height: '12rem' }} />
                </>
            );
        }

        if (emptyCourse) {
            return (
                <div className="main-bg my-2">
                    <b className="flex justify-center">{translations.noCourses}</b>
                </div>
            );
        }

        return (
            <>
                <div className="main-bg open__course__grid">
                    {coursesValue?.map((item) => {
                        return (
                            <div key={item?.id}>
                                {/* <OpenCourseShowCard course={item} /> */}
                                <OpenCourseCard course={item} link={{ url: null, status: false }} courseShowProp={handleCourseShow} courseSignup={сourseSignup} signUpList={signUpList} btnDisabled={signupDisabled} />
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
                        // template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        template={media ? 'FirstPageLink PrevPageLink NextPageLink LastPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                    />
                </div>
            </>
        );
    };

    useEffect(() => {
        setProgressSpinner(true);
        if (search?.length === 0 && searchController) {
            handleFetchOpenCourse(Number(page), free === 'paid' ? '3' : free === 'free' ? '2' : '', search, categorySelectedId?.id || null, language_id);
            setSearchController(false);
            setProgressSpinner(false);
        }

        if (search?.length < 2) {
            setProgressSpinner(false);
            return;
        }

        setSearchController(true);
        const delay = setTimeout(() => {
            handleFetchOpenCourse(Number(page), free === 'paid' ? '3' : free === 'free' ? '2' : '', search, categorySelectedId?.id || null, language_id);
            setProgressSpinner(false);
        }, 1000);

        return () => {
            clearTimeout(delay);
        };
    }, [search]);

    useEffect(() => {
        if (categorySelectedId) handleFetchOpenCourse(Number(page), free === 'paid' ? '3' : free === 'free' ? '2' : '', search, categorySelectedId?.id || null, language_id);
    }, [categorySelectedId]);

    useEffect(() => {
        if (langSelectedId) handleFetchOpenCourse(Number(page), free === 'paid' ? '3' : free === 'free' ? '2' : '', search, categorySelectedId?.id || null, language_id);
    }, [langSelectedId]);

    useEffect(() => {
        if (coursesValue?.length) {
            handleSendSingup();
        }
    }, [coursesValue]);

    useEffect(() => {
        handleFetchOpenCourse(Number(page), '', '', null, null);
        handleDepCategoryFetch(); // получаем категории
        handleDepLangFetch(); // получаем азыки
    }, []);

    if (mainProgressSpinner)
        return (
            <div className="main-bg flex justify-center items-center h-[100vh]">
                <ProgressSpinner style={{ width: '60px', height: '60px' }} />
            </div>
        );

    if (hasCourses) return <NotFound titleMessage={translations.noData} />;

    return (
        <div className="flex flex-col gap-2">
            <div className="main-bg">
                {/* header section */}
                <MainTitle>{translations.courses}</MainTitle>

                {/* filter section */}
                {filterRender()}
            </div>

            {/* courses section */}
            {mainContent()}

            {/*{media && user?.is_student && <BottomNav />}*/}

            <Sidebar visible={showVisisble} position="bottom" style={{ height: '90vh' }} onHide={() => setShowVisible(false)}>
                {skeleton ? (
                    <GroupSkeleton count={1} size={{ width: '100%', height: '12rem' }} />
                ) : courseDetail ? (
                    <OpenCourseShowCard course={courseDetail} courseSignup={сourseSignup} signUpList={signUpList} btnDisabled={signupDisabled} />
                ) : (
                    <b className="flex justify-center">{translations.noData}</b>
                )}
            </Sidebar>
        </div>
    );
}
