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
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useContext, useEffect, useState } from 'react';
import { useLocalization } from '@/layout/context/localizationcontext';
import { useLocalizedData } from '@/hooks/useLocalizedData';
import RoleSwitch from '@/app/components/roles/RoleSwitch';
import UserAvatar from '@/app/components/roles/UserAvatar';

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
    const { translations } = useLocalization();
    const { getLocalized } = useLocalizedData();

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
    const [selectedTypeId, setSelectedTypeId] = useState<Role_idType | null>({ name: translations.all, role_id: null });
    const [cities, setCities] = useState<Role_idType[]>([{ name: translations.all, role_id: null }]);

    const [categorySelectedId, setCategorySelectedId] = useState<CategoryId | null>({ title: translations.all, id: null, description: '' });
    const [depCategoryes, setCategoryes] = useState<CategoryId[]>([{ title: translations.selectCategoryPlaceholder, id: null, description: '' }]);

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

    const [langSelectedId, setLangSelectedId] = useState<SelectLangType | null>({ title: translations.all, id: null, description: '' });
    const [depSelectLang, setSelectLang] = useState<SelectLangType[]>([{ title: translations.selectCategoryPlaceholder, id: null, description: '' }]);
    const [language_id, setLanguage_id] = useState<number | null>(null);

    const [is_featured, setFeaturedChecked] = useState<boolean>(false);

    const clearValues = () => {
        setPublicCourseId(null);
        setPublicState(null);
        setPublicStatus(null);
        setCategoryes([{ title: translations.selectCategoryPlaceholder, id: null, description: '' }]);
        setCategorySelectedId({ title: translations.all, id: null, description: '' });
        setPublicCategoryId(null);
        setLanguage_id(null);
        setSelectLang([{ title: translations.selectCategoryPlaceholder, id: null, description: '' }]);
        setLangSelectedId({ title: translations.all, id: null, description: '' });
    };

    // fetch types
    const handleFetchCourseOpenStatus = async () => {
        const data = await fetchCourseOpenStatus();
        if (data && Array.isArray(data)) {
            setOpenTypes(data);
            setCities([{ name: translations.all, role_id: null }]);
            const forSelectedRole_id: any = data?.map((item) => {
                return { name: item?.title, role_id: item?.id };
            });
            setCities((prev) => [...prev, ...forSelectedRole_id]);
            setContentNull(false);
        } else {
            setContentNull(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.error, detail: '' }
            }); // messege - Ошибка при изменении курса
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
    };

    // fetch roledepartements
    const handleFetchDepartment = async (page: number, search: string, myedu_id: string | null, selectedTypeId: Role_idType | null, active: boolean | null) => {
        setMainProgressSpinner(true);
        const res = await fetchRolesDepartment(page, search, myedu_id, selectedTypeId?.role_id || null, active);
        if (res?.success) {
            setRoles(res?.data?.data);
            // setPagination(res?.data);
            setPagination({
                current_page: res?.data?.current_page,
                total: res?.data?.total,
                per_page: res?.data?.per_page
            });
            setContentNull(false);
        } else {
            setContentNull(true);
            setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater } });
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
        if (res?.success) {
            setTimeout(() => {
                handleFetchDepartment(Number(page), search, myedu_id, selectedTypeId, active);
            }, 1000);
            setMessage({ state: true, value: { severity: 'success', summary: translations.successChanged, detail: '' } });
        } else {
            setMainProgressSpinner(false);
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data?.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater } });
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
            setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater } });
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
            handleFetchTeacherCheck(Number(page), search, myedu_id, selectedTypeId);
            setMessage({ state: true, value: { severity: 'success', summary: translations.successChanged, detail: '' } });
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater } });
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
                handleFetchTeacherCheck(Number(page), search, myedu_id, selectedTypeId);
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
                setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater } });
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
            // handleFetchTeacherCheck(Number(checkPageState), search, myedu_id, selectedTypeId);
            // const forCategoryes = res.map((item: { title: string, id: number, description: string }) => {
            //     return { name: item?.title, id: item?.id, description: item?.description };
            // });
            // if (forCategoryes) {
            //     setCategoryes(forCategoryes);
            // }
            handleDepCategoryFetch();
            setMessage({ state: true, value: { severity: 'success', summary: translations.successAdd, detail: '' } });
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater } });
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
            setMessage({ state: true, value: { severity: 'success', summary: translations.deleteSuccess, detail: '' } });
            handleDepCategoryFetch();
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater } });
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
            setMessage({ state: true, value: { severity: 'success', summary: translations.successChanged, detail: '' } });
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater } });
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
                // handleFetchTeacherCheck(Number(checkPageState), search, myedu_id, selectedTypeId);
                setSelectLang(res?.data);
            }
        } else {
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: translations.error, detail: translations.tryAgainLater } });
                if (res?.response?.status) {
                    showError(res.response.status);
                }
            }
        }
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        router.push(`/roles/departament/${page}`);
    };

    // Ручное управление пагинацией
    const handleCheckPageChange = (page: number) => {
        // handleFetchDepartment(page, search, myedu_id, selectedTypeId, active);
        // handleFetchTeacherCheck(page, search, myedu_id, selectedTypeId);
        // setCheckPageState(page);
        router.push(`/roles/departament/check/${page}`);
    };

    // for tabview
    const handleTabChange = (e: TabViewChange) => {
        setActiveIndex(e.index);
        if (e.index === 0 || e.index === 1) {
            setSearch('');
            setMyedu_id(null);
            setSelectedTypeId({ name: translations.all, role_id: null });
            setCities([{ name: translations.all, role_id: null }]);
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
                <span className="font-medium text-[0.813rem] sm:text-md">{option.name}</span>
                {option.description && <span className="text-xs text-gray-500 text-[0.75rem] sm:text-sm max-w-[300px] text-wrap word-break sm:text-nowrap sm:max-w-full">{option.description}</span>}
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
                    <span className="font-medium text-[0.75rem] sm:text-md">{option.title}</span>
                </div>
                {option.description && <span className="text-xs text-gray-500 text-[0.75rem] sm:text-sm max-w-[300px] text-wrap word-break sm:text-nowrap sm:max-w-full">{option.description}</span>}
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
                <span className="font-medium text-[0.813rem] sm:text-md">{option.title}</span>
            </div>
        );
    };

    // общие стили
    const cardClass = 'rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]';

    const sectionLoader = (
        <div className="flex justify-center items-center min-h-[320px]">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        </div>
    );

    const emptyState = (
        <div className="flex flex-col items-center justify-center gap-[8px] py-[40px] text-center">
            <span className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#f1f5f9] text-[var(--text-color-secondary)]">
                <i className="pi pi-inbox text-[1.375rem]"></i>
            </span>
            <span className="text-[0.875rem] text-[var(--text-color-secondary)]">{translations.noData}</span>
        </div>
    );

    // ФИО + доп. информация
    const userCell = (user: any) => (
        <div className="flex items-center gap-[10px] min-w-[200px]">
            <UserAvatar user={user} />
            <div className="flex flex-col min-w-0">
                <span className="text-[0.875rem] font-semibold leading-snug text-[var(--titleColor)]">
                    {user?.last_name} {user?.name} {user?.father_name}
                </span>
                {(user?.myedu_id || user?.email) && (
                    <span className="text-[0.75rem] text-[var(--text-color-secondary)] truncate">
                        {user?.myedu_id && <>ID: {user.myedu_id}</>}
                        {user?.myedu_id && user?.email && ' · '}
                        {user?.email}
                    </span>
                )}
            </div>
        </div>
    );

    // статус курса (открытый / платный)
    const audienceChip = (typeId: number | null) => {
        if (typeId !== 2 && typeId !== 3) return null;
        const isOpen = typeId === 2;
        return (
            <span
                className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full text-[0.75rem] font-semibold whitespace-nowrap ${
                    isOpen ? 'bg-[var(--greenColor)]/10 text-[var(--greenColor)]' : 'bg-[var(--amberColor)]/10 text-[var(--amberColor)]'
                }`}
            >
                <i className={`${isOpen ? 'pi pi-globe' : 'pi pi-wallet'} text-[0.6875rem]`}></i>
                {isOpen ? translations.openCourse : translations.paid}
            </span>
        );
    };

    // мягкая иконка-кнопка действия
    const actionButton = (icon: string, tone: 'main' | 'red', onClick: () => void, title?: string) => (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`flex items-center justify-center w-[34px] h-[34px] rounded-[10px] transition-colors duration-200 ${
                tone === 'main' ? 'bg-[var(--mainColor)]/10 text-[var(--mainColor)] hover:bg-[var(--mainColor)] hover:text-white' : 'bg-[var(--redColor)]/10 text-[var(--redColor)] hover:bg-[var(--redColor)] hover:text-white'
            }`}
        >
            <i className={`${icon} text-[0.8125rem]`}></i>
        </button>
    );

    // TSX access
    const itemAccessTemplate = (roles: any) => {
        if (roles) {
            return roles.map((item: any) => {
                return (
                    <div key={item?.id} className={`${cardClass} w-full flex flex-col gap-[10px] p-[14px]`}>
                        <div className="pb-[10px] border-b border-[#f1f5f9]">{userCell(item)}</div>

                        {openTypes?.map((role) => {
                            const element = item?.course_type_access.find((el: { id: number }) => el.id === role.id);
                            const isActive = Boolean(element?.pivot?.active);

                            return (
                                <div key={role?.id} className="flex justify-between items-center gap-[10px]">
                                    <span className={`text-[0.8125rem] ${isActive || role?.id === 1 ? 'font-semibold text-[var(--titleColor)]' : 'text-[var(--bodyColor)]'}`}>{role?.title}</span>

                                    <div className="flex justify-center items-center">
                                        {!isActive && role?.id !== 1 ? (
                                            <RoleSwitch isActive={false} disabled={forDisabled} onClick={() => handleControlDepartament(item?.id, role?.id, true)} />
                                        ) : (
                                            <RoleSwitch isActive={true} disabled={forDisabled} onClick={() => handleControlDepartament(item?.id, role?.id, false)} />
                                        )}
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
        <div className="flex flex-col gap-[12px]">
            {media ? (
                <div className="flex flex-col gap-[10px]">{roles?.length ? itemAccessTemplate(roles) : emptyState}</div>
            ) : (
                <div className="overflow-x-auto scrollbar-thin">
                    <DataTable value={roles || []} dataKey="id" emptyMessage={emptyState} loading={forDisabled} breakpoint="960px" key={JSON.stringify(forDisabled)} rows={5} className="modern-table min-w-[640px] overflow-x-auto text-sm">
                        <Column
                            header="#"
                            style={{ width: '48px', textAlign: 'center' }}
                            body={(_, { rowIndex }) => <span className="text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{(pagination.current_page - 1) * pagination.per_page + rowIndex + 1}</span>}
                        />

                        <Column header={translations.fullName} body={(rowData: any) => userCell(rowData)} />

                        {openTypes?.map((item) => {
                            return (
                                <Column
                                    key={item?.id}
                                    header={() => <div className="w-full text-center">{item?.title}</div>}
                                    style={{ textAlign: 'center' }}
                                    body={(rowData) => {
                                        const element = rowData?.course_type_access.find((el: { id: number }) => el.id === item.id);
                                        const isActive = Boolean(element?.pivot?.active);

                                        return (
                                            <div className="flex justify-center items-center">
                                                {!isActive && item.id !== 1 ? (
                                                    <RoleSwitch isActive={false} disabled={forDisabled} onClick={() => handleControlDepartament(rowData?.id, item?.id, true)} />
                                                ) : (
                                                    <RoleSwitch isActive={true} disabled={forDisabled} onClick={() => handleControlDepartament(rowData?.id, item?.id, false)} />
                                                )}
                                            </div>
                                        );
                                    }}
                                />
                            );
                        })}
                    </DataTable>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-[8px]">
                {pagination.total > 0 && pagination.per_page > 0 && (
                    <span className="text-[0.8125rem] text-[var(--text-color-secondary)]">
                        {(pagination.current_page - 1) * pagination.per_page + 1}–{Math.min(pagination.current_page * pagination.per_page, pagination.total)} / <b className="text-[var(--titleColor)]">{pagination.total}</b>
                    </span>
                )}
                <Paginator
                    first={(pagination.current_page - 1) * pagination.per_page}
                    rows={pagination.per_page}
                    totalRecords={pagination.total}
                    onPageChange={(e) => handlePageChange(e.page + 1)}
                    template={media ? 'FirstPageLink PrevPageLink NextPageLink LastPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                    className="courses-paginator bg-transparent p-0 sm:ml-auto"
                />
            </div>
        </div>
    );

    // TSX checking
    const itemCheckingTemplate = (roles: any) => {
        if (roles) {
            return roles.map((item: any) => {
                return (
                    <div key={item?.id} className={`${cardClass} w-full flex flex-col gap-[10px] p-[14px]`}>
                        <div className="flex items-start justify-between gap-[8px]">
                            <Link href={`/roles/departament/check/${item?.id}`} className="text-[0.875rem] font-bold leading-snug text-[var(--mainColor)] hover:underline break-words">
                                {item.title}
                            </Link>
                            {audienceChip(item?.course_audience_type_id)}
                        </div>
                        <div className="pb-[10px] border-b border-[#f1f5f9]">{userCell(item?.user)}</div>
                        <div className="w-full flex items-center gap-[8px]">
                            <button
                                type="button"
                                onClick={() => {
                                    setPublicStatus(1);
                                    setPublicState(true);
                                    setPublicCourseId(item?.id);
                                    setVisible(true);
                                    handleDepCategoryFetch();
                                    handleDepLangFetch();
                                }}
                                className="flex-1 flex items-center justify-center gap-[6px] h-[36px] rounded-[10px] text-[0.8125rem] font-semibold bg-[var(--mainColor)] text-white shadow-[0_4px_10px_-4px_rgba(8,169,230,0.6)] active:scale-[0.98] transition-transform"
                            >
                                <i className="pi pi-check text-[0.75rem]"></i>
                                {translations.publish}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPublicStatus(0);
                                    setPublicState(false);
                                    setPublicCourseId(item?.id);
                                    setVisible(true);
                                }}
                                className="flex-1 flex items-center justify-center gap-[6px] h-[36px] rounded-[10px] text-[0.8125rem] font-semibold bg-[var(--redColor)]/10 text-[var(--redColor)] active:scale-[0.98] transition-transform"
                            >
                                <i className="pi pi-times text-[0.75rem]"></i>
                                {translations.cancel}
                            </button>
                        </div>
                    </div>
                );
            });
        }
    };

    const checkDepartamentSection = (
        <div className="flex flex-col gap-[12px]">
            {media ? (
                <div className="flex flex-col gap-[10px]">{checkOpenCourseEmpty ? emptyState : itemCheckingTemplate(teachersCheck)}</div>
            ) : (
                <div className="overflow-x-auto scrollbar-thin">
                    {checkOpenCourseEmpty ? (
                        emptyState
                    ) : (
                        <DataTable value={teachersCheck || []} dataKey="id" emptyMessage={emptyState} loading={forDisabled} breakpoint="960px" rows={5} className="modern-table min-w-[640px] overflow-x-auto text-sm">
                            <Column header="#" style={{ width: '48px', textAlign: 'center' }} body={(_, { rowIndex }) => <span className="text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{rowIndex + 1}</span>}></Column>

                            <Column
                                field="title"
                                header={translations.courses}
                                body={(rowData) => (
                                    <Link href={`/roles/departament/check/${rowData?.id}`} key={rowData?.id} className="group inline-flex items-center gap-[6px] text-[0.875rem] font-semibold text-[var(--mainColor)] hover:underline">
                                        <i className="pi pi-book text-[0.75rem] opacity-70"></i>
                                        {rowData.title}
                                    </Link>
                                )}
                            ></Column>

                            <Column field="title" header={translations.teachers} body={(rowData) => userCell(rowData?.user)}></Column>

                            <Column
                                field="title"
                                header={() => <div className="w-full text-center">{translations.status}</div>}
                                body={(rowData) => <div className="w-full flex justify-center">{audienceChip(rowData?.course_audience_type_id)}</div>}
                            ></Column>

                            <Column
                                field="title"
                                header={() => <div className="w-full text-center">{translations.actions}</div>}
                                body={(rowData) => (
                                    <div className="w-full flex justify-center items-center gap-[8px]">
                                        {actionButton(
                                            'pi pi-check',
                                            'main',
                                            () => {
                                                setPublicStatus(1);
                                                setPublicState(true);
                                                setPublicCourseId(rowData?.id);
                                                setVisible(true);
                                                handleDepCategoryFetch();
                                                handleDepLangFetch();
                                            },
                                            translations.publish
                                        )}
                                        {actionButton(
                                            'pi pi-times',
                                            'red',
                                            () => {
                                                setPublicStatus(0);
                                                setPublicState(false);
                                                setPublicCourseId(rowData?.id);
                                                setVisible(true);
                                            },
                                            translations.cancel
                                        )}
                                    </div>
                                )}
                            ></Column>
                        </DataTable>
                    )}
                </div>
            )}
        </div>
    );

    // category crud
    const categorySection = (
        <div className="flex flex-col gap-[12px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[10px]">
                <div className="flex items-center gap-[10px]">
                    <span className="flex items-center justify-center w-[36px] h-[36px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                        <i className="pi pi-tags text-[0.875rem]"></i>
                    </span>
                    <h3 className="m-0 text-[0.9375rem] sm:text-[1rem] font-semibold leading-snug text-[var(--titleColor)]">{translations.courseCategoryInfo}</h3>
                </div>
                <Button
                    size="small"
                    icon="pi pi-plus"
                    label={translations.create}
                    onClick={() => {
                        setCategoryVisible(true);
                    }}
                />
            </div>
            <div className="overflow-x-auto scrollbar-thin">
                <DataTable value={cateroriesList || []} dataKey="id" emptyMessage={emptyState} loading={forDisabled} breakpoint="960px" rows={5} className="modern-table min-w-[480px] overflow-x-auto text-sm">
                    <Column header="#" style={{ width: '48px', textAlign: 'center' }} body={(_, { rowIndex }) => <span className="text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{rowIndex + 1}</span>}></Column>

                    <Column
                        field="title"
                        header={translations.courseCategories}
                        body={(rowData) => (
                            <div key={rowData.id} className="flex flex-col min-w-0">
                                <span className="text-[0.875rem] font-semibold text-[var(--titleColor)]">{rowData.title}</span>
                                {rowData?.description && <span className="text-[0.75rem] text-[var(--text-color-secondary)] truncate">{rowData.description}</span>}
                            </div>
                        )}
                    ></Column>

                    <Column
                        field="title"
                        header={() => <div className="w-full text-center">{translations.actions}</div>}
                        style={{ width: '140px' }}
                        body={(rowData) => (
                            <div className="w-full flex justify-center items-center gap-[8px]">
                                {actionButton(
                                    'pi pi-pencil',
                                    'main',
                                    () => {
                                        editing(rowData?.id);
                                    },
                                    translations.change
                                )}
                                {actionButton(
                                    'pi pi-trash',
                                    'red',
                                    () => {
                                        const options = getConfirmOptions(Number(rowData.id), () => handleCategoryDelete(rowData.id));
                                        confirmDialog(options);
                                    },
                                    translations.delete
                                )}
                            </div>
                        )}
                    ></Column>
                </DataTable>
            </div>
        </div>
    );

    const footerContent = (
        <div>
            <Button
                label={translations.back}
                className="reject-button"
                size="small"
                icon="pi pi-times"
                onClick={() => {
                    setVisible(false);
                    clearValues();
                }}
            />

            <Button
                label={publicState ? translations.publish : translations.cancel}
                size="small"
                className={`trash-button ${publicState ? (categorySelectedId?.id && language_id ? '' : 'opacity-50 pointer-events-none') : ''}`}
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
                label={translations.back}
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
                label={!categoryState ? translations.create : translations.change}
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
            handleFetchTeacherCheck(Number(page), search, myedu_id, selectedTypeId);
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
                const forCities: Role_idType[] = [{ name: translations.all, role_id: null }];
                for (const element of idsArray) {
                    const typeName: string = element === 2 ? translations.openCourse : element === 3 ? translations.paid : '';
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
                handleFetchTeacherCheck(Number(page), search, myedu_id, selectedTypeId);
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
                handleFetchTeacherCheck(Number(page), search, myedu_id, selectedTypeId);
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
                handleFetchTeacherCheck(Number(page), search, myedu_id, selectedTypeId);
            } else {
                handleFetchDepartment(Number(page), search, myedu_id, selectedTypeId, active);
            }
        }
    }, [selectedTypeId]);

    useEffect(() => {
        setMyeduProgressSpinner(true);
        if (myedu_id?.length === 0 && myeduController) {
            if (roleStatus) {
                handleFetchTeacherCheck(Number(page), search, myedu_id, selectedTypeId);
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
                handleFetchTeacherCheck(Number(page), search, myedu_id, selectedTypeId);
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

    // Update default values when language changes
    useEffect(() => {
        setCities(prev => {
            const newCities = [...prev];
            if (newCities.length > 0 && newCities[0].role_id === null) {
                newCities[0].name = translations.all;
            }
            return newCities;
        });

        if (selectedTypeId?.role_id === null) {
            setSelectedTypeId(prev => prev ? ({ ...prev, name: translations.all }) : null);
        }

        setCategoryes(prev => {
            const newCats = [...prev];
            if (newCats.length > 0 && newCats[0].id === null) {
                newCats[0].title = translations.selectCategoryPlaceholder;
            }
            return newCats;
        });

        if (categorySelectedId?.id === null) {
            setCategorySelectedId(prev => prev ? ({ ...prev, title: translations.all }) : null);
        }

        setSelectLang(prev => {
            const newLangs = [...prev];
            if (newLangs.length > 0 && newLangs[0].id === null) {
                newLangs[0].title = translations.selectCategoryPlaceholder;
            }
            return newLangs;
        });

        if (langSelectedId?.id === null) {
            setLangSelectedId(prev => prev ? ({ ...prev, title: translations.all }) : null);
        }

    }, [translations]);

    if (contentNull) return <NotFound titleMessage={translations.noData} />;

    const headerCount = activeIndex === 0 ? pagination.total : activeIndex === 1 ? checkPagination?.total : cateroriesList?.length;

    return (
        <div className="flex flex-col gap-4">
            {skeleton ? (
                <GroupSkeleton count={6} size={{ width: '100%', height: '5rem' }} />
            ) : (
                <div className="overflow-x-auto scrollbar-thin flex flex-col gap-[16px]">
                    {/* шапка и фильтры */}
                    <div className={`${cardClass} p-[14px] sm:p-[18px]`}>
                        <div className="flex items-center gap-[10px] mb-[14px]">
                            <h3 className="text-[1.25rem] sm:text-[1.375rem] leading-tight font-bold m-0">{translations.department}</h3>
                            {Number(headerCount) > 0 && (
                                <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full bg-[#f1f5f9] text-[0.75rem] font-semibold text-[var(--bodyColor)]">
                                    <i className={`${activeIndex === 2 ? 'pi pi-tags' : activeIndex === 1 ? 'pi pi-book' : 'pi pi-users'} text-[0.6875rem]`}></i>
                                    {headerCount}
                                </span>
                            )}
                        </div>

                        <div className={`flex flex-col lg:flex-row lg:items-center gap-[10px] transition-opacity ${activeIndex === 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                            {/* поиск */}
                            <div className="flex items-center relative flex-1 min-w-0">
                                <i className="pi pi-search absolute left-[12px] z-[1] text-[0.8125rem] text-[var(--text-color-secondary)] pointer-events-none"></i>
                                <InputText placeholder={translations.search} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-[40px] text-[0.875rem]" style={{ paddingLeft: 36, borderRadius: 10 }} />
                                <div className="absolute right-[10px]">{miniProgressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-[10px]">
                                {/* myedu id */}
                                <div className="flex items-center relative sm:w-[150px]">
                                    <InputText type="number" placeholder={translations.myeduIdPlaceholder} value={myedu_id || ''} className="w-full h-[40px] text-[0.875rem]" style={{ borderRadius: 10 }} onChange={(e) => setMyedu_id(e.target.value)} />
                                    <div className="absolute right-[10px]">{myeduProgressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                                </div>

                                {/* тип курса */}
                                <Dropdown
                                    value={selectedTypeId}
                                    onChange={(e: DropdownChangeEvent) => setSelectedTypeId(e.value)}
                                    options={cities}
                                    optionLabel="name"
                                    placeholder="..."
                                    className="sm:w-[200px] h-[40px] items-center text-sm"
                                    style={{ borderRadius: 10 }}
                                />

                                {/* только активные */}
                                {!roleStatus && (
                                    <div className={`flex items-center gap-[4px] h-[40px] transition-opacity ${!selectedTypeId?.role_id ? 'opacity-45 pointer-events-none' : ''}`}>
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
                                        <p className="m-0 text-[0.875rem] text-[var(--bodyColor)] whitespace-nowrap">{translations.active}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* main */}
                    <div className={`${cardClass} p-[10px] sm:p-[16px]`}>
                        <TabView onTabChange={(e) => handleTabChange(e)} activeIndex={activeIndex} className={`modern-tabview ${mainProgressSpinner ? 'modern-tabview-busy' : ''}`}>
                            {/* Departament */}
                            <TabPanel header={translations.access} leftIcon="pi pi-users">
                                {mainProgressSpinner ? sectionLoader : mainDepartamentSection}
                            </TabPanel>

                            {/* Checking */}
                            <TabPanel header={translations.check} leftIcon="pi pi-check-square">
                                {mainProgressSpinner ? sectionLoader : checkDepartamentSection}
                            </TabPanel>

                            {/* Category crud */}
                            <TabPanel header={translations.courseCategories} leftIcon="pi pi-tags">
                                {mainProgressSpinner ? sectionLoader : categorySection}
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            )}

            {/* publising */}
            <Dialog
                header={publicState ? translations.publishCourse : translations.cancelCourse}
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
                            <div className="flex flex-col gap-[14px]">
                                <div className="flex flex-col gap-[6px]">
                                    <label className="inline-flex items-center gap-[6px] text-[0.8125rem] font-semibold text-[var(--titleColor)]">
                                        <i className="pi pi-tags text-[0.75rem] text-[var(--mainColor)]"></i>
                                        {translations.selectCourseCategory}
                                    </label>
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
                                        style={{ borderRadius: 10 }}
                                    />
                                </div>
                                <div className="flex flex-col gap-[6px]">
                                    <label className="inline-flex items-center gap-[6px] text-[0.8125rem] font-semibold text-[var(--titleColor)]">
                                        <i className="pi pi-language text-[0.75rem] text-[var(--mainColor)]"></i>
                                        {translations.selectCourseLanguage}
                                    </label>
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
                                        style={{ borderRadius: 10 }}
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-[10px] px-[12px] py-[10px] rounded-[12px] bg-[#f8fafc] border border-[#eef2f6]">
                                    <span className="inline-flex items-center gap-[8px] text-[0.875rem] font-medium text-[var(--titleColor)]">
                                        <i className="pi pi-star text-[0.8125rem] text-[var(--amberColor)]"></i>
                                        {translations.recommend}
                                    </span>
                                    <label className="custom-radio p-0">
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
                            <div className="flex flex-col gap-[10px]">
                                <div className="flex items-start gap-[10px] p-[10px] rounded-[12px] bg-[var(--redColor)]/5 border border-[var(--redColor)]/20">
                                    <i className="pi pi-exclamation-triangle text-[0.875rem] text-[var(--redColor)] mt-[2px]"></i>
                                    <b className="text-[0.875rem] text-[var(--titleColor)] leading-snug">{translations.confirmRejectCourse}</b>
                                </div>
                                <InputText value={comment || ''} onChange={(e) => setPublicComment(e.target.value)} type="text" placeholder={translations.rejectReason} className="w-full h-[40px] text-[0.875rem]" style={{ borderRadius: 10 }} />
                            </div>
                        )}
                    </div>
                }
            </Dialog>

            {/* catetory */}
            <Dialog
                header={!categoryState ? translations.createCategoryTitle : translations.editCategoryTitle}
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
                            <div className="flex flex-col gap-[12px]">
                                <div className="flex flex-col gap-[6px]">
                                    <label className="text-[0.8125rem] font-semibold text-[var(--titleColor)]">{translations.categoryName}</label>
                                    <InputText
                                        type="text"
                                        value={categoryValue?.title}
                                        onChange={(e) => {
                                            setCategoryValue((prev) => ({ ...prev, title: e.target.value }));
                                        }}
                                        placeholder={translations.categoryName}
                                        className="w-full h-[40px] text-[0.875rem]"
                                        style={{ borderRadius: 10 }}
                                    />
                                </div>
                                <div className="flex flex-col gap-[6px]">
                                    <label className="text-[0.8125rem] font-semibold text-[var(--titleColor)]">{translations.categoryDescription}</label>
                                    <InputText
                                        type="text"
                                        value={categoryValue?.description}
                                        onChange={(e) => {
                                            setCategoryValue((prev) => ({ ...prev, description: e.target.value }));
                                        }}
                                        placeholder={translations.categoryDescription}
                                        className="w-full h-[40px] text-[0.875rem]"
                                        style={{ borderRadius: 10 }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-[12px]">
                                <div className="flex flex-col gap-[6px]">
                                    <label className="text-[0.8125rem] font-semibold text-[var(--titleColor)]">{translations.categoryName}</label>
                                    <InputText
                                        type="text"
                                        value={editingLesson?.title}
                                        onChange={(e) => {
                                            setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                        }}
                                        placeholder={translations.categoryName}
                                        className="w-full h-[40px] text-[0.875rem]"
                                        style={{ borderRadius: 10 }}
                                    />
                                </div>
                                <div className="flex flex-col gap-[6px]">
                                    <label className="text-[0.8125rem] font-semibold text-[var(--titleColor)]">{translations.categoryDescription}</label>
                                    <InputText
                                        type="text"
                                        value={editingLesson?.description}
                                        onChange={(e) => {
                                            setEditingLesson((prev) => prev && { ...prev, description: e.target.value });
                                        }}
                                        className="w-full h-[40px] text-[0.875rem]"
                                        style={{ borderRadius: 10 }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                }
            </Dialog>
        </div>
    );
}
