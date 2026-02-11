'use client';

import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import useMediaQuery from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchCourseOpenStatus } from '@/services/courses';
import { controlDepartamentUsers, depCategoryAdd, depCategoryDelete, depCategoryFetch, depCategoryShow, depCategoryUpdate, depLangFetch, fetchRolesDepartment, fetchTeacherCheck, teacherCoursePublic } from '@/services/roles/roles';
import { CourseType } from '@/types/courseType';
import { AudenceType } from '@/types/courseTypes/AudenceTypes';
import { MainLangType } from '@/types/openCourse/MainLangType';
import { TabViewChange } from '@/types/tabViewChange';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { TabPanel, TabView } from 'primereact/tabview';
import { useContext, useEffect, useState } from 'react';

// types
interface Role {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

interface Role_idType {
    name: string;
    role_id: number | null;
}

interface CategoryId {
    title: string;
    id: number | null;
    description: string;
}

interface TeacherCheckType extends CourseType {
    course_audience_type_id: number | null;
}

interface MainCategoryType extends CategoryId {
    created_at: string;
    updated_at: string;
}

interface SelectLangType extends Pick<MainLangType, 'title' | 'description' | 'id'> {}

export default function RolesDepartment() {
    const { page } = useParams();
    const router = useRouter();

    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const media = useMediaQuery('(max-width: 640px)');

    const [roleStatus, setRoleStatus] = useState<0 | 1>(0);
    const [roles, setRoles] = useState<Role[] | null>(null);

    const [teachersCheck, setTeacherCheck] = useState<TeacherCheckType[] | null>(null);

    const [skeleton, setSkeleton] = useState(true);
    const [contentNull, setContentNull] = useState<boolean>(false);
    const [mainProgressSpinner, setMainProgressSpinner] = useState(false);
    const [miniProgressSpinner, setMiniProgressSpinner] = useState(false);
    const [myeduProgressSpinner, setMyeduProgressSpinner] = useState(false);
    const [search, setSearch] = useState<string>('');
    const [searchController, setSearchController] = useState(false);
    const [myeduController, setMyeduController] = useState(false);
    const [active, setActive] = useState(false);
    const [myedu_id, setMyedu_id] = useState<string | null>(null);
    const [pagination, setPagination] = useState<{ current_page: number; total: number; per_page: number }>({
        current_page: 1,
        total: 0,
        per_page: 0
    });
    const [checkPagination, setCheckPagination] = useState<{ current_page: number; total: number; per_page: number }>({
        current_page: 1,
        total: 0,
        per_page: 0
    });
    const [checkPageState, setCheckPageState] = useState<number>(1);
    const [selectedTypeId, setSelectedTypeId] = useState<Role_idType | null>({ name: 'Все', role_id: null });
    const [cities, setCities] = useState<Role_idType[]>([{ name: 'Все', role_id: null }]);

    const [categorySelectedId, setCategorySelectedId] = useState<CategoryId | null>({ title: 'Все', id: null, description: '' });
    const [depCategoryes, setCategoryes] = useState<CategoryId[]>([{ title: 'Выберите категорию', id: null, description: '' }]);

    const [forDisabled, setForDisabled] = useState(false);
    const [openTypes, setOpenTypes] = useState<AudenceType[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [comment, setPublicComment] = useState<string | null>(null);
    const [publicCourseId, setPublicCourseId] = useState<number | null>(null);
    const [publicStatus, setPublicStatus] = useState<number | null>(null);
    const [publicState, setPublicState] = useState<boolean | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [course_category_id, setPublicCategoryId] = useState<number | null>(null);

    const [categoryState, setCategoryState] = useState<boolean | null>(null);
    const [categoryVisible, setCategoryVisible] = useState<boolean>(false);
    const [categoryValue, setCategoryValue] = useState<CategoryId>({ title: '', description: '', id: null });
    const [cateroriesList, setCategoriesList] = useState<MainCategoryType[] | null>(null);

    const [editingLesson, setEditingLesson] = useState<MainCategoryType | null>(null);
    const [checkOpenCourseEmpty, setCheckOpenCourseEmpty] = useState<boolean>(false);

    const [langSelectedId, setLangSelectedId] = useState<SelectLangType | null>({ title: 'Все', id: null, description: '' });
    const [depSelectLang, setSelectLang] = useState<SelectLangType[]>([{ title: 'Выберите категорию', id: null, description: '' }]);
    const [language_id, setLanguage_id] = useState<number | null>(null);

    const [is_featured, setFeaturedChecked] = useState<boolean>(false);

    const clearValues = () => {
        setPublicCourseId(null);
        setPublicState(null);
        setPublicStatus(null);
        setCategoryes([{ title: 'Выберите категорию', id: null, description: '' }]);
        setCategorySelectedId({ title: 'Все', id: null, description: '' });
        setPublicCategoryId(null);
        setLanguage_id(null);
        setSelectLang([{ title: 'Выберите категорию', id: null, description: '' }]);
        setLangSelectedId({ title: 'Все', id: null, description: '' });
    };

    // fetch types
    const handleFetchCourseOpenStatus = async () => {
        const data = await fetchCourseOpenStatus();
        if (data && Array.isArray(data)) {
            setOpenTypes(data);
            setCities([{ name: 'Все', role_id: null }]);
            const forSelectedRole_id: any = data?.map((item) => {
                return { name: item?.title, role_id: item?.id };
            });
            setCities((prev) => [...prev, ...forSelectedRole_id]);
            setContentNull(false);
        } else {
            setContentNull(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка повторите позже', detail: '' }
            }); // messege - Ошибка при изменении курса
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

    // fetch roledepartements
    const handleFetchDepartment = async (page: number, search: string, myedu_id: string | null, selectedTypeId: Role_idType | null, active: boolean | null) => {
        setMainProgressSpinner(true);
        const res = await fetchRolesDepartment(page, search, myedu_id, selectedTypeId?.role_id || null, active);
        if (res?.success) {
            setRoles(res?.data?.data);
            setPagination(res?.data);
            setContentNull(false);
        } else {
            setContentNull(true);
            setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
            if (res?.response?.status) {
                showError(res.response.status);
            }
        }
        setMainProgressSpinner(false);
        setSkeleton(false);
    };

    const handleControlDepartament = async (worker_id: number, course_audience_type_id: number | null, activeParam: boolean | null) => {
        // setForDisabled(true);
        setMainProgressSpinner(true);
        const res = await controlDepartamentUsers(worker_id, course_audience_type_id || null, activeParam);
        console.log(res);
        if (res?.success) {
            setTimeout(() => {
                handleFetchDepartment(Number(page), search, myedu_id, selectedTypeId, active);
            }, 1000);
            setMessage({ state: true, value: { severity: 'success', summary: 'Успешно изменено!', detail: '' } });
        } else {
            setMainProgressSpinner(false);
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data?.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
                if (res?.response?.status) {
                    showError(res.response.status);
                }
            }
        }
        // setForDisabled(false);
    };

    // checking functions
    const handleFetchTeacherCheck = async (page: number | null, search: string | null, myedu_id: string | null, selectedTypeId: Role_idType | null) => {
        setMainProgressSpinner(true);
        const res = await fetchTeacherCheck(page, search, myedu_id, selectedTypeId?.role_id ? selectedTypeId?.role_id : null);
        if (res?.success) {
            if (res.data.data.length < 1) {
                setCheckOpenCourseEmpty(true);
            } else {
                setTeacherCheck(res?.data?.data);
                setCheckOpenCourseEmpty(false);
            }
            setCheckPagination(res?.data);
            setContentNull(false);
        } else {
            setContentNull(true);
            setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
            if (res?.response?.status) {
                showError(res.response.status);
            }
        }
        setMainProgressSpinner(false);
    };

    const handleCoursePublic = async (comment: string | null) => {
        setMainProgressSpinner(true);
        clearValues();
        const res = await teacherCoursePublic(Number(publicCourseId) || null, publicStatus, comment, course_category_id, language_id, is_featured);
        if (res?.success) {
            handleFetchTeacherCheck(checkPageState, search, myedu_id, selectedTypeId);
            setMessage({ state: true, value: { severity: 'success', summary: 'Курс успешно изменен!', detail: '' } });
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
                if (res?.response?.status) {
                    showError(res.response.status);
                }
            }
        }
        setMainProgressSpinner(false);
    };

    const editing = async (id: number) => {
        setCategoryVisible(true);
        setCategoryState(true);
        const res = await depCategoryShow(id);
        if (res && res?.id) {
            setEditingLesson(res);
        }
    };

    const handleDepCategoryFetch = async () => {
        setMainProgressSpinner(true);
        const res = await depCategoryFetch();
        if (res && res?.length) {
            if (activeIndex === 1) {
                handleFetchTeacherCheck(checkPageState, search, myedu_id, selectedTypeId);
                const forCategoryes = res.map((item: { title: string; id: number; description: string }) => {
                    return { name: item?.title, id: item?.id, description: item?.description };
                });
                if (forCategoryes) {
                    setCategoryes(forCategoryes);
                }
            } else if (activeIndex === 2) {
                setCategoriesList(res);
            }
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
                if (res?.response?.status) {
                    showError(res.response.status);
                }
            }
        }
        setMainProgressSpinner(false);
    };

    // add category
    const handleCategoryAdd = async () => {
        const res = await depCategoryAdd(categoryValue?.title || '', categoryValue?.description || '');
        if (res && res?.id) {
            // handleFetchTeacherCheck(checkPageState, search, myedu_id, selectedTypeId);
            // const forCategoryes = res.map((item: { title: string, id: number, description: string }) => {
            //     return { name: item?.title, id: item?.id, description: item?.description };
            // });
            // if (forCategoryes) {
            //     setCategoryes(forCategoryes);
            // }
            handleDepCategoryFetch();
            setMessage({ state: true, value: { severity: 'success', summary: 'Успешно добавлено!', detail: '' } });
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
                if (res?.response?.status) {
                    showError(res.response.status);
                }
            }
        }
    };

    // delete
    const handleCategoryDelete = async (id: number | null) => {
        const res = await depCategoryDelete(id);

        if (res && res?.success) {
            setMessage({ state: true, value: { severity: 'success', summary: 'Успешно Удалено!', detail: '' } });
            handleDepCategoryFetch();
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
                if (res?.response?.status) {
                    showError(res.response.status);
                }
            }
        }
    };

    // updata
    const handleCategoryUpdate = async () => {
        const res = await depCategoryUpdate(editingLesson?.id || null, editingLesson?.title || '', editingLesson?.description || '');

        if (res && res?.success) {
            handleDepCategoryFetch();
            setMessage({ state: true, value: { severity: 'success', summary: 'Успешно изменено!', detail: '' } });
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
                if (res?.response?.status) {
                    showError(res.response.status);
                }
            }
        }
    };

    // lang
    const handleDepLangFetch = async () => {
        const res = await depLangFetch();
        if (res && res?.success) {
            if (activeIndex === 1) {
                // handleFetchTeacherCheck(checkPageState, search, myedu_id, selectedTypeId);
                setSelectLang(res?.data);
            }
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
                if (res?.response?.status) {
                    showError(res.response.status);
                }
            }
        }
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        router.push(`/roles/departament/${page}`)
    };

    // Ручное управление пагинацией
    const handleCheckPageChange = (page: number) => {
        // handleFetchDepartment(page, search, myedu_id, selectedTypeId, active);
        handleFetchTeacherCheck(page, search, myedu_id, selectedTypeId);
        setCheckPageState(page);
    };

    // for tabview
    const handleTabChange = (e: TabViewChange) => {
        setActiveIndex(e.index);
        if (e.index === 0 || e.index === 1) {
            setSearch('');
            setMyedu_id(null);
            setSelectedTypeId({ name: 'Все', role_id: null });
            setCities([{ name: 'Все', role_id: null }]);
            setRoleStatus(e.index);
        }

        if (e.index === 0) {
            handleFetchCourseOpenStatus();
        }
    };

    // category jsx
    const categoryItemTemplate = (option: any) => {
        return (
            <div className="w-full flex flex-col">
                <span className="font-medium text-[13px] sm:text-md">{option.name}</span>
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
                <span>{option.name}</span>
                {option.description && <span className="text-xs text-gray-500">{option.description}</span>}
            </div>
        );
    };

    // lang jsx
    const langItemTemplate = (option: any) => {
        return (
            <div className="w-full flex flex-col">
                <div className="flex gap-1 items-center">
                    <img src={`/layout/images/flags/${option?.logo}`} alt="flag" className="w-[20px] h-[20px]" />
                    <span className="font-medium text-[13px] sm:text-md">{option.title}</span>
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
                <img src={`/layout/images/flags/${option?.logo}`} alt="flag" className="w-[20px] h-[20px]" />
                <span className="font-medium text-[13px] sm:text-md">{option.title}</span>
            </div>
        );
    };

    // TSX access
    const itemAccessTemplate = (roles: any) => {
        if (roles) {
            return roles.map((item: any) => {
                return (
                    <div key={item?.id} className="main-bg w-full flex flex-col gap-1 justify-start">
                        <div className="flex gap-1 items-center">
                            <b className="text-[14px] text-[var(--mainColor)]">
                                {item.last_name} {item.name} {item.father_name}
                            </b>
                        </div>

                        {openTypes?.map((role) => {
                            const element = item?.course_type_access.find((el: { id: number }) => el.id === role.id);
                            const isActive = Boolean(element?.pivot?.active);

                            return (
                                <div key={role?.id} className="text-center flex justify-between items-start">
                                    <span className="text-sm">{role?.title}</span>

                                    <div className="text-center">
                                        <div className="flex justify-center items-center">
                                            {!isActive && role?.id !== 1 ? (
                                                <button
                                                    className={`theme-toggle ${forDisabled && 'opacity-50'}`}
                                                    disabled={forDisabled}
                                                    onClick={() => handleControlDepartament(item?.id, role?.id, true)}
                                                    // onClick={() => console.log(rowData?.id, element?.id, item.id, true)}
                                                    aria-pressed="false"
                                                >
                                                    <span className="right">
                                                        <span className="option option-left" aria-hidden></span>
                                                        <span className="option option-right" aria-hidden></span>
                                                        <span className="knob" aria-hidden></span>
                                                    </span>
                                                </button>
                                            ) : (
                                                <button
                                                    className={`theme-toggle ${forDisabled && 'opacity-50'}`}
                                                    disabled={forDisabled}
                                                    onClick={() => handleControlDepartament(item?.id, role?.id, false)}
                                                    aria-pressed="false"
                                                    // onClick={() => console.log(user, roles[idx])} aria-pressed="false"
                                                >
                                                    <span className="track">
                                                        <span className="option option-left" aria-hidden></span>
                                                        <span className="option option-right" aria-hidden>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                fill="none"
                                                                stroke="green"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                viewBox="0 0 24 24"
                                                                aria-label="Опубликовано"
                                                            >
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <path d="M9 12l2 2 4-4"></path>
                                                            </svg>
                                                        </span>
                                                        <span className="knob" aria-hidden></span>
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            });
        }
    };

    const mainDepartamentSection = (
        <div className="flex flex-col gap-2">
            {media ? (
                itemAccessTemplate(roles)
            ) : (
                <div className="main-bg overflow-x-auto scrollbar-thin">
                    <DataTable value={roles || []} dataKey="id" emptyMessage="..." loading={forDisabled} breakpoint="960px" key={JSON.stringify(forDisabled)} rows={5} className="min-w-[640px] overflow-x-auto">
                        <Column header={() => <div className="text-[14px]">#</div>} body={(_, { rowIndex }) => rowIndex + 1} />

                        <Column
                            header={() => <div className="text-[14px]">ФИО</div>}
                            body={(rowData: any) => (
                                <div>
                                    {rowData.last_name} {rowData.name} {rowData.father_name}
                                </div>
                            )}
                        />

                        {openTypes?.map((item) => {
                            return (
                                <Column
                                    key={item?.id}
                                    header={item?.title}
                                    body={(rowData) => {
                                        const element = rowData?.course_type_access.find((el: { id: number }) => el.id === item.id);
                                        const isActive = Boolean(element?.pivot?.active);

                                        return (
                                            <div className="text-center">
                                                <div className="flex justify-center items-center">
                                                    {!isActive && item.id !== 1 ? (
                                                        <button
                                                            className={`theme-toggle ${forDisabled && 'opacity-50'}`}
                                                            disabled={forDisabled}
                                                            onClick={() => handleControlDepartament(rowData?.id, item?.id, true)}
                                                            // onClick={() => console.log(rowData?.id, element?.id, item.id, true)}
                                                            aria-pressed="false"
                                                        >
                                                            <span className="right">
                                                                <span className="option option-left" aria-hidden></span>
                                                                <span className="option option-right" aria-hidden></span>
                                                                <span className="knob" aria-hidden></span>
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className={`theme-toggle ${forDisabled && 'opacity-50'}`}
                                                            disabled={forDisabled}
                                                            onClick={() => handleControlDepartament(rowData?.id, item?.id, false)}
                                                            aria-pressed="false"
                                                            // onClick={() => console.log(user, roles[idx])} aria-pressed="false"
                                                        >
                                                            <span className="track">
                                                                <span className="option option-left" aria-hidden></span>
                                                                <span className="option option-right" aria-hidden>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="24"
                                                                        height="24"
                                                                        fill="none"
                                                                        stroke="green"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        viewBox="0 0 24 24"
                                                                        aria-label="Опубликовано"
                                                                    >
                                                                        <circle cx="12" cy="12" r="10"></circle>
                                                                        <path d="M9 12l2 2 4-4"></path>
                                                                    </svg>
                                                                </span>
                                                                <span className="knob" aria-hidden></span>
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            );
                        })}
                    </DataTable>
                </div>
            )}
            <div className={`shadow-[0px_-11px_5px_-6px_rgba(0,_0,_0,_0.1)]`}>
                <Paginator
                    first={(pagination.current_page - 1) * pagination.per_page}
                    rows={pagination.per_page}
                    totalRecords={pagination.total}
                    onPageChange={(e) => handlePageChange(e.page + 1)}
                    // template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    template={media ? 'FirstPageLink PrevPageLink NextPageLink LastPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                />
            </div>
        </div>
    );

    // TSX checking
    const itemCheckingTemplate = (roles: any) => {
        if (roles) {
            return roles.map((item: any) => {
                return (
                    <div key={item?.id} className="main-bg w-full flex flex-col gap-1 justify-start">
                        <div className="flex gap-1 flex-col">
                            <b className="text-[14px] text-[var(--mainColor)]">
                                {item?.user.last_name} {item?.user.name} {item?.user.father_name}
                            </b>
                            <div className="w-full flex flex-col gap-2">
                                <Link href={`/roles/departament/check?course_id=${item?.id}`} key={item?.id} className="text-[14px] font-bold underline">
                                    {item.title}
                                </Link>
                                <div className="w-full flex justify-end">
                                    <i
                                        className={`text-[13px] text-white rounded p-1
                                    ${item?.course_audience_type_id === 2 ? 'bg-[var(--greenColor)]' : item?.course_audience_type_id === 3 ? 'bg-[var(--amberColor)]' : ''}
                                    `}
                                    >
                                        {item?.course_audience_type_id === 2 ? 'Открытый' : item?.course_audience_type_id === 3 ? 'Платный' : ''}
                                    </i>
                                </div>
                                <div className="w-full flex justify-end items-center gap-2">
                                    <div className="flex items-center gap-1 cursor-pointer text-[white] shadow rounded bg-[var(--mainColor)] p-1" style={{ fontSize: '12px' }}>
                                        <i className="pi pi-check" style={{ fontSize: '12px' }}></i>
                                        <button
                                            onClick={() => {
                                                setPublicStatus(1);
                                                setPublicState(true);
                                                setPublicCourseId(item?.id);
                                                setVisible(true);
                                                handleDepCategoryFetch();
                                                handleDepLangFetch();
                                            }}
                                        >
                                            Опубликовать
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1 cursor-pointer text-[white] shadow rounded bg-[var(--redColor)] p-1" style={{ fontSize: '12px' }}>
                                        <i className="pi pi-times" style={{ fontSize: '12px' }}></i>
                                        <button
                                            onClick={() => {
                                                setPublicStatus(0);
                                                setPublicState(false);
                                                setPublicCourseId(item?.id);
                                                setVisible(true);
                                            }}
                                        >
                                            Аннулировать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
        }
    };

    const checkDepartamentSection = (
        <div className="flex flex-col gap-2">
            {media ? (
                itemCheckingTemplate(teachersCheck)
            ) : (
                <div className="main-bg overflow-x-auto scrollbar-thin">
                    {/* <DataTable value={roles || []} emptyMessage="Загрузка" dataKey="id_kafedra" responsiveLayout="stack" breakpoint="960px" rows={5} className='min-w-[640px] overflow-x-auto'> */}
                    {checkOpenCourseEmpty ? (
                        <p className="text-center text-md">Данных нет</p>
                    ) : (
                        <DataTable value={teachersCheck || []} dataKey="id" emptyMessage="..." loading={forDisabled} breakpoint="960px" rows={5} className="min-w-[640px] overflow-x-auto">
                            <Column body={(_, { rowIndex }) => rowIndex + 1} header="#"></Column>

                            <Column
                                field="title"
                                header="Курсы"
                                body={(rowData) => (
                                    <Link href={`/roles/departament/check?course_id=${rowData?.id}`} key={rowData?.id} className="text-[14px] font-bold text-[var(--mainColor)] underline">
                                        {rowData.title}
                                    </Link>
                                )}
                            ></Column>

                            <Column
                                field="title"
                                header="Преподаватели"
                                body={(rowData) => (
                                    <span key={rowData.id} className="text-[14px]">
                                        {rowData?.user.last_name} {rowData?.user.name} {rowData?.user.father_name}
                                    </span>
                                )}
                            ></Column>

                            <Column
                                field="title"
                                header="Статус"
                                body={(rowData) => (
                                    <div className="w-full flex justify-center">
                                        <i
                                            className={`text-[13px] text-white rounded p-1
                                        ${rowData?.course_audience_type_id === 2 ? 'bg-[var(--greenColor)]' : rowData?.course_audience_type_id === 3 ? 'bg-[var(--amberColor)]' : ''}
                                        `}
                                        >
                                            {rowData?.course_audience_type_id === 2 ? 'Открытый' : rowData?.course_audience_type_id === 3 ? 'Платный' : ''}
                                        </i>
                                    </div>
                                )}
                            ></Column>

                            <Column
                                field="title"
                                header="Действия"
                                body={(rowData) => (
                                    <div className="w-full flex justify-center items-center gap-4">
                                        <i
                                            onClick={() => {
                                                setPublicStatus(1);
                                                setPublicState(true);
                                                setPublicCourseId(rowData?.id);
                                                setVisible(true);
                                                handleDepCategoryFetch();
                                                handleDepLangFetch();
                                            }}
                                            className="cursor-pointer pi pi-check text-[white] shadow rounded-full bg-[var(--mainColor)] p-[5px]"
                                            style={{ fontSize: '13px' }}
                                        ></i>
                                        <i
                                            onClick={() => {
                                                setPublicStatus(0);
                                                setPublicState(false);
                                                setPublicCourseId(rowData?.id);
                                                setVisible(true);
                                            }}
                                            className="cursor-pointer pi pi-times text-[white] shadow rounded-full bg-[red] p-[5px]"
                                            style={{ fontSize: '13px' }}
                                        ></i>
                                    </div>
                                )}
                            ></Column>
                        </DataTable>
                    )}
                </div>
            )}

            <div className={`shadow-[0px_-11px_5px_-6px_rgba(0,_0,_0,_0.1)]`}>
                <Paginator
                    first={(checkPagination.current_page - 1) * checkPagination.per_page}
                    rows={checkPagination.per_page}
                    totalRecords={checkPagination.total}
                    onPageChange={(e) => handleCheckPageChange(e.page + 1)}
                    // template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    template={media ? 'FirstPageLink PrevPageLink NextPageLink LastPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                />
            </div>
        </div>
    );

    // category crud
    const categorySection = (
        <div className="">
            {/* {media ? (
                itemCheckingTemplate(teachersCheck)
            ) : ( */}
            <div className="my-2 flex flex-col gap-1">
                <h3 className="text-[16px] sm:text-lg pb-1 shadow-[var(--bottom-shadow)]">Здесь вы можете создавать собственные категории для курсов и добавлять их в общие категории</h3>
                <div className="flex justify-end">
                    <Button
                        size="small"
                        label="Создать"
                        onClick={() => {
                            setCategoryVisible(true);
                        }}
                    />
                </div>
            </div>
            <div className="main-bg overflow-x-auto scrollbar-thin">
                {/* crud */}

                {/* table */}
                {/* <DataTable value={roles || []} emptyMessage="Загрузка" dataKey="id_kafedra" responsiveLayout="stack" breakpoint="960px" rows={5} className='min-w-[640px] overflow-x-auto'> */}
                <DataTable value={cateroriesList || []} dataKey="id" emptyMessage="..." loading={forDisabled} breakpoint="960px" rows={5} className="min-w-[640px] overflow-x-auto">
                    <Column body={(_, { rowIndex }) => rowIndex + 1} header="#"></Column>

                    <Column
                        field="title"
                        header="Категории"
                        body={(rowData) => (
                            <span key={rowData.id} className="text-[14px] ">
                                {rowData.title}
                            </span>
                        )}
                    ></Column>

                    <Column
                        field="title"
                        header="Действия"
                        body={(rowData) => (
                            <div className="w-full flex justify-center items-center gap-4">
                                <i
                                    className="cursor-pointer pi pi-pencil p-2 text-sm rounded bg-[var(--mainColor)] text-white"
                                    onClick={() => {
                                        editing(rowData?.id);
                                    }}
                                ></i>
                                <i
                                    className="cursor-pointer pi pi-trash p-2 text-sm rounded bg-[var(--redColor)] text-white"
                                    onClick={() => {
                                        const options = getConfirmOptions(Number(rowData.id), () => handleCategoryDelete(rowData.id));
                                        confirmDialog(options);
                                    }}
                                ></i>
                            </div>
                        )}
                    ></Column>
                </DataTable>
            </div>
            {/* )} */}
        </div>
    );

    const footerContent = (
        <div>
            <Button
                label={'Назад'}
                className="reject-button"
                size="small"
                icon="pi pi-times"
                onClick={() => {
                    setVisible(false);
                    clearValues();
                }}
            />

            <Button
                label={publicState ? 'Опубликовать' : 'Аннулировать'}
                size="small"
                className={`${publicState ? (categorySelectedId?.id && language_id ? '' : 'opacity-50 pointer-events-none') : ''}`}
                icon="pi pi-check"
                onClick={() => {
                    setVisible(false);
                    handleCoursePublic(comment);
                }}
                autoFocus
            />
        </div>
    );

    const categoryFooterContent = (
        <div>
            <Button
                label={'Назад'}
                className="reject-button"
                size="small"
                icon="pi pi-times"
                onClick={() => {
                    setCategoryVisible(false);
                    setCategoryState(false);
                    clearValues();
                }}
            />

            <Button
                label={!categoryState ? 'Создать' : 'Изменить'}
                size="small"
                icon="pi pi-check"
                onClick={() => {
                    setCategoryVisible(false);
                    if (!categoryState) {
                        handleCategoryAdd();
                    }

                    if (categoryState) {
                        handleCategoryUpdate();
                    }
                }}
                autoFocus
            />
        </div>
    );

    // USEEFFECTS
    useEffect(() => {
        if (roleStatus) {
            handleFetchTeacherCheck(checkPageState, search, myedu_id, selectedTypeId);
        }
    }, [roleStatus]);

    useEffect(() => {
        if (teachersCheck && teachersCheck?.length > 0) {
            const uniqAudenceIds = new Set<number>();

            for (const teacher of teachersCheck) {
                const key: any = teacher?.course_audience_type_id;
                if (key !== undefined) {
                    uniqAudenceIds.add(key);
                }
            }
            const idsArray = Array.from(uniqAudenceIds);
            if (idsArray?.length) {
                const forCities: Role_idType[] = [{ name: 'Все', role_id: null }];
                for (const element of idsArray) {
                    const typeName: string = element === 2 ? 'Открытый' : element === 3 ? 'Платный' : '';
                    forCities.push({ name: typeName, role_id: element });
                }
                setCities(forCities);
            }
        }
    }, [teachersCheck]);

    useEffect(() => {
        setMiniProgressSpinner(true);
        if (search?.length === 0 && searchController) {
            if (roleStatus) {
                handleFetchTeacherCheck(checkPageState, search, myedu_id, selectedTypeId);
            } else {
                handleFetchDepartment(Number(page), search, myedu_id, selectedTypeId, active);
            }
            setSearchController(false);
            setMiniProgressSpinner(false);
        }

        if (search?.length < 2) {
            setMiniProgressSpinner(false);
            return;
        }

        setSearchController(true);
        const delay = setTimeout(() => {
            if (roleStatus) {
                handleFetchTeacherCheck(checkPageState, search, myedu_id, selectedTypeId);
            } else {
                handleFetchDepartment(Number(page), search, myedu_id, selectedTypeId, active);
            }
            setMiniProgressSpinner(false);
        }, 1000);

        return () => {
            clearTimeout(delay);
        };
    }, [search]);

    useEffect(() => {
        if (selectedTypeId) {
            if (roleStatus) {
                handleFetchTeacherCheck(checkPageState, search, myedu_id, selectedTypeId);
            } else {
                handleFetchDepartment(Number(page), search, myedu_id, selectedTypeId, active);
            }
        }
    }, [selectedTypeId]);

    useEffect(() => {
        setMyeduProgressSpinner(true);
        if (myedu_id?.length === 0 && myeduController) {
            if (roleStatus) {
                handleFetchTeacherCheck(checkPageState, search, myedu_id, selectedTypeId);
            } else {
                handleFetchDepartment(Number(page), search, myedu_id, selectedTypeId, active);
            }

            setMyeduController(false);
            setMyeduProgressSpinner(false);
        }

        if (myedu_id && myedu_id?.length < 4) {
            setMyeduProgressSpinner(false);
            return;
        }

        setMyeduController(true);
        const delay = setTimeout(() => {
            if (roleStatus) {
                handleFetchTeacherCheck(checkPageState, search, myedu_id, selectedTypeId);
            } else {
                handleFetchDepartment(Number(page), search, myedu_id, selectedTypeId, active);
            }

            setMyeduProgressSpinner(false);
        }, 1000);

        return () => {
            clearTimeout(delay);
        };
    }, [myedu_id]);

    useEffect(() => {
        if (activeIndex === 2) {
            handleDepCategoryFetch();
        }
    }, [activeIndex]);

    useEffect(() => {
        handleFetchCourseOpenStatus();
        handleFetchDepartment(1, '', null, null, null);
    }, []);

    if (contentNull) return <NotFound titleMessage="Данные отсутствуют" />;

    return (
        <div className="flex flex-col gap-4">
            {skeleton ? (
                <GroupSkeleton count={6} size={{ width: '100%', height: '5rem' }} />
            ) : (
                <div className="overflow-x-auto scrollbar-thin">
                    <div className={`main-bg mb-2`}>
                        <h3 className="text-xl sm:text-2xl pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">Департамент</h3>
                        <div className={`flex flex-col sm:flex-row gap-2 mb-2 ${activeIndex === 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="flex gap-3 items-center">
                                {!roleStatus && (
                                    <div className={`flex items-center ${!selectedTypeId?.role_id ? 'opacity-45 pointer-events-none' : ''}`}>
                                        <label className="custom-radio p-0">
                                            <input
                                                type="checkbox"
                                                checked={active}
                                                className={`customCheckbox p-0`}
                                                onChange={() => {
                                                    setActive((prev) => !prev);
                                                    handleFetchDepartment(Number(page), search, myedu_id, selectedTypeId, !active);
                                                }}
                                            />
                                            <span className="checkbox-mark"></span>
                                        </label>
                                        <p>Активные</p>
                                    </div>
                                )}
                                <div>
                                    <Dropdown value={selectedTypeId} onChange={(e: DropdownChangeEvent) => setSelectedTypeId(e.value)} options={cities} optionLabel="name" placeholder="..." className="w-[160px] sm:w-full text-sm" />
                                </div>
                            </div>
                            <div className="w-full flex justify-center sm:justify-start items-center gap-1">
                                <InputText type="number" placeholder="myedu id" value={myedu_id || ''} className="w-full sm:max-w-[120px] h-[48px]" onChange={(e) => setMyedu_id(e.target.value)} />
                                <div>{myeduProgressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                            </div>
                        </div>

                        <div className={`flex items-center relative mb-2 ${activeIndex === 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                            <InputText placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-inputtext-sm p-inputtext-rounded" />
                            <div className="absolute right-1">{miniProgressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                        </div>
                    </div>

                    {/* main */}

                    {mainProgressSpinner ? (
                        <div className="main-bg flex justify-center items-center h-[100vh]">
                            <ProgressSpinner style={{ width: '60px', height: '60px' }} />
                        </div>
                    ) : (
                        <TabView
                            onTabChange={(e) => handleTabChange(e)}
                            activeIndex={activeIndex}
                            pt={{
                                nav: { className: 'flex cursor-pointer px-2 pt-2' },
                                panelContainer: { className: 'flex-1 pl-4' }
                            }}
                        >
                            {/* Departament */}
                            <TabPanel
                                pt={{
                                    headerAction: { className: 'font-italic' }
                                }}
                                header="Доступ"
                                className="text-[13px] sm:text-[18px]"
                                // className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                            >
                                {mainDepartamentSection}
                            </TabPanel>

                            {/* Checking */}
                            <TabPanel
                                pt={{
                                    headerAction: { className: 'font-italic' }
                                }}
                                header="Проверка"
                                className="text-[13px] sm:text-[18px]"
                                // className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                            >
                                {checkDepartamentSection}
                            </TabPanel>

                            {/* Category crud */}
                            <TabPanel
                                pt={{
                                    headerAction: { className: 'font-italic' }
                                }}
                                header="Категории курсов"
                                className="text-[13px] sm:text-[18px]"
                                // className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                            >
                                {categorySection}
                            </TabPanel>
                        </TabView>
                    )}
                </div>
            )}

            {/* publising */}
            <Dialog
                header={publicState ? 'Опубликовать курс' : 'Аннулировать курс'}
                visible={visible}
                className="my-custom-dialog"
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                    clearValues();
                }}
                footer={footerContent}
            >
                {
                    <div>
                        {/* Аннулирование */}
                        {publicState ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-2">
                                    <b className="px-1">Выберите категорию для курса</b>
                                    <div className="max-w-[95%]">
                                        <Dropdown
                                            value={categorySelectedId}
                                            filter
                                            itemTemplate={categoryItemTemplate}
                                            valueTemplate={categoryValueTemplate}
                                            onChange={(e: DropdownChangeEvent) => {
                                                setCategorySelectedId(e.value);
                                                setPublicCategoryId(e.value?.id);
                                            }}
                                            options={depCategoryes}
                                            optionLabel="name"
                                            placeholder="..."
                                            className="w-full text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <b className="px-1">Выберите язык для курса</b>
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
                                <div className="flex items-center">
                                    <span>Рекомендую</span>
                                    <label className="custom-radio">
                                        <input
                                            type="checkbox"
                                            className={`customCheckbox`}
                                            onChange={(e) => {
                                                setFeaturedChecked(e.target.checked);
                                            }}
                                        />
                                        <span className="checkbox-mark"></span>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <b className="px-1">Вы уверены что хотите отказать курс?</b>
                                <InputText value={comment || ''} onChange={(e) => setPublicComment(e.target.value)} type="text" placeholder="Укажите причину вашего отказа" />
                            </div>
                        )}
                    </div>
                }
            </Dialog>

            {/* catetory */}
            <Dialog
                header={!categoryState ? 'Создать категорию' : 'Изменить категорию'}
                visible={categoryVisible}
                className="my-custom-dialog"
                onHide={() => {
                    if (!categoryVisible) return;
                    setCategoryVisible(false);
                    setCategoryState(false);
                    clearValues();
                }}
                footer={categoryFooterContent}
            >
                {
                    <div>
                        {/* Аннулирование */}
                        {!categoryState ? (
                            <div className="flex flex-col gap-2">
                                <InputText
                                    type="text"
                                    value={categoryValue?.title}
                                    onChange={(e) => {
                                        setCategoryValue((prev) => ({ ...prev, title: e.target.value }));
                                    }}
                                    placeholder="Название категории"
                                />
                                <InputText
                                    type="text"
                                    value={categoryValue?.description}
                                    onChange={(e) => {
                                        setCategoryValue((prev) => ({ ...prev, description: e.target.value }));
                                    }}
                                    placeholder="Описание"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <InputText
                                    type="text"
                                    value={editingLesson?.title}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                    }}
                                    placeholder="Название категории"
                                />
                                <InputText
                                    type="text"
                                    value={editingLesson?.description}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, description: e.target.value });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                }
            </Dialog>
        </div>
    );
}
