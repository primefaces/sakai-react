'use client';

import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import useMediaQuery from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { controlRolesUsers, fetchRolesList, fetchRolesUsers } from '@/services/roles/roles';
import { RoleUserType } from '@/types/roles/RoleUserType';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
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
    name_ru?: string;
    name_kg?: string;
}

interface Role_idType {
    name: string;
    role_id: number | null;
}

interface RoleState {
    create: boolean;
    update: boolean;
    delete: boolean;
    show: boolean;
}

export default function Roles() {
    const { page } = useParams();
    const router = useRouter();

    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);
    const media = useMediaQuery('(max-width: 640px)');
    const { translations } = useLocalization();
    const { getLocalized } = useLocalizedData();

    const [userFetchGlag, setUserFetchGlag] = useState(false);
    const [roles, setRoles] = useState<Role[] | null>(null);
    const [users, setUsers] = useState<RoleUserType[] | null>(null);

    const [skeleton, setSkeleton] = useState(false);
    const [contentNull, setContentNull] = useState<boolean>(false);
    const [mainProgressSpinner, setMainProgressSpinner] = useState(false);
    const [miniProgressSpinner, setMiniProgressSpinner] = useState(false);
    const [myeduProgressSpinner, setMyeduProgressSpinner] = useState(false);
    const [search, setSearch] = useState<string>('');
    const [searchController, setSearchController] = useState(false);
    const [myeduController, setMyeduController] = useState(false);
    const [active, setActive] = useState(false);
    const [myedu_id, setMyedu_id] = useState<string | null>(null);
    const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>({
        currentPage: 1,
        total: 0,
        perPage: 0
    });
    // const [Number(page), setNumber(page)] = useState<number>(1);
    const [selectedRole_idType, setSelectedRole_idType] = useState<Role_idType | null>({ name: translations.all, role_id: null });
    const [cities, setCities] = useState<Role_idType[]>([{ name: translations.all, role_id: null }]);
    const [forDisabled, setForDisabled] = useState(false);
    const [categoryVisible, setCategoryVisible] = useState<boolean>(false);
    const [roleState, setRoleState] = useState<RoleState>({
        create: false,
        update: false,
        delete: false,
        show: true
    });
    const [role_id, setRole_id] = useState<number | null>(null);
    const [user_id, setUser_id] = useState<number | null>(null);

    const handleFetchRoles = async () => {
        setSkeleton(true);
        setMainProgressSpinner(true);
        const data = await fetchRolesList();
        if (data && Array.isArray(data)) {
            if (data.length > 0) {
                setContentNull(false);
                setRoles(data);
                setCities([{ name: translations.all, role_id: null }]);
                const forSelectedRole_id: any = data?.map((item) => {
                    return { name: getLocalized(item, 'name') || item?.title, role_id: item?.id };
                });

                if (forSelectedRole_id) setCities((prev) => [...prev, ...forSelectedRole_id]);
            } else {
                setContentNull(true);
            }
        } else {
            setContentNull(false);
            setMessage({ state: true, value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater } });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setSkeleton(false);
        setMainProgressSpinner(false);
    };

    const handleFetchUsers = async (page: number, search: string, myedu_id: string | null, selectedRole_idType: Role_idType | null, active: boolean | null) => {
        const res = await fetchRolesUsers(page, search, myedu_id, selectedRole_idType?.role_id ? selectedRole_idType?.role_id : null, active);

        if (res?.success) {
            setPagination({
                currentPage: res?.data?.current_page,
                total: res?.data?.total,
                perPage: res?.data?.per_page
            });
            const validRolesPosition = res?.data?.data?.map((item: any) => {

                if (item?.roles?.length > 1) {
                    // const [first, second] = item.roles;
                    // return {
                    //     ...item,
                    //     roles: [second, first]
                    // };
                    const newRoles = [...item.roles];

                    // меняем местами первые два
                    [newRoles[0], newRoles[1]] = [newRoles[1], newRoles[0]];

                    return {
                        ...item,
                        roles: newRoles
                    };
                }
                return item;
            });
            if (validRolesPosition) {
                setUsers(validRolesPosition);
            }
        } else {
            setMessage({ state: true, value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater } });
            if (res?.response?.status) {
                showError(res.response.status);
            }
        }
    };

    const handleControlUsersRole = async (worker_id: number | null, selectedRole_idTypeParam: number | null, activeParam: boolean | null, roleState: RoleState) => {
        clearValues();
        setForDisabled(true);
        const res = await controlRolesUsers(worker_id, selectedRole_idTypeParam ? selectedRole_idTypeParam : null, activeParam, roleState);
        if (res?.success) {
            handleFetchRoles();
            setTimeout(() => {
                handleFetchUsers(Number(page), search, myedu_id, selectedRole_idType, active);
            }, 1000);
            setMessage({ state: true, value: { severity: 'success', summary: translations.successChanged, detail: '' } });
        } else {
            if (res.response.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater } });
                if (res?.response?.status) {
                    showError(res.response.status);
                }
            }
        }
        setForDisabled(false);
    };

    const clearValues = () => {
        setRole_id(null);
        setUser_id(null);
        setRoleState({
            create: false,
            update: false,
            delete: false,
            show: true
        });
    };

    const checkRolesCrud = (user: any, role: number) => {
        const userObj = user?.roles?.find((item: { id: number }) => item?.id === role);
        if (userObj) {
            setRoleState({
                create: userObj?.pivot?.create,
                update: userObj?.pivot?.update,
                delete: userObj?.pivot?.delete,
                show: userObj?.pivot?.read
            });
        }
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        router.push(`/roles/${page}`);
    };

    // TSX

    const itemTemplate = (shablonData: any) => {
        if (shablonData) {
            return shablonData.map((item: any) => {
                return (
                    <div key={item?.id} className="w-full flex flex-col gap-[10px] p-[14px] rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                        <div className="flex gap-[10px] items-center pb-[10px] border-b border-[#f1f5f9]">
                            <UserAvatar user={item} />
                            <div className="flex flex-col min-w-0">
                                <b className="text-[14px] leading-snug text-[var(--titleColor)] break-words">
                                    {item.last_name} {item.name} {item.father_name}
                                </b>
                                {item?.myedu_id && <span className="text-[12px] text-[var(--text-color-secondary)]">MyEdu ID: {item.myedu_id}</span>}
                            </div>
                        </div>

                        {roles?.map((role, idx) => {
                            const userRole = item?.roles?.find((r: { id: number }) => r.id === role.id);
                            const isActive = Boolean(userRole?.pivot?.active);
                            return (
                                <div key={role?.id} className="flex justify-between items-center gap-[10px]">
                                    {/*<span className="text-sm">{idx % 2 === 0 ? translations.administrator : translations.department}</span>*/}
                                    <span className={`text-[13px] ${isActive ? 'font-semibold text-[var(--titleColor)]' : 'text-[var(--bodyColor)]'}`}>{role?.title}</span>

                                    <div className="flex justify-center items-center">
                                        {!isActive ? (
                                            <RoleSwitch
                                                isActive={false}
                                                disabled={forDisabled}
                                                // onClick={() => handleControlUsersRole(item?.id, roles[idx]?.id, true, roleState)}
                                                onClick={() => {
                                                    setCategoryVisible(true);
                                                    checkRolesCrud(item, role?.id);
                                                    setRole_id(roles[idx]?.id);
                                                    setUser_id(item?.id);
                                                    setActive(true);
                                                }}
                                            />
                                        ) : (
                                            <RoleSwitch
                                                isActive={true}
                                                disabled={forDisabled}
                                                // onClick={() => handleControlUsersRole(item?.id, roles[idx]?.id, false, roleState)}
                                                onClick={() => {
                                                    setCategoryVisible(true);
                                                    checkRolesCrud(item, role?.id);
                                                    setRole_id(roles[idx]?.id);
                                                    setUser_id(item?.id);
                                                    setActive(true);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            });
        }
        return [];
    };

    useEffect(() => {
        setMiniProgressSpinner(true);
        if (search?.length === 0 && searchController) {
            handleFetchUsers(Number(page), search, myedu_id, selectedRole_idType, active);
            setSearchController(false);
            setMiniProgressSpinner(false);
        }

        if (search?.length < 2) {
            setMiniProgressSpinner(false);
            return;
        }

        setSearchController(true);
        const delay = setTimeout(() => {
            if (userFetchGlag) {
                handleFetchUsers(Number(page), search, myedu_id, selectedRole_idType, active);
                setMiniProgressSpinner(false);
            }
        }, 1000);

        return () => {
            clearTimeout(delay);
        };
    }, [search]);

    useEffect(() => {
        if (selectedRole_idType && userFetchGlag) {
            handleFetchUsers(Number(page), search, myedu_id, selectedRole_idType, active);
        }
    }, [selectedRole_idType]);

    useEffect(() => {
        setMyeduProgressSpinner(true);
        if (myedu_id?.length === 0 && myeduController) {
            handleFetchUsers(Number(page), search, myedu_id, selectedRole_idType, active);
            setMyeduController(false);
            setMyeduProgressSpinner(false);
        }

        if (myedu_id && myedu_id?.length < 4) {
            setMyeduProgressSpinner(false);
            return;
        }

        setMyeduController(true);
        const delay = setTimeout(() => {
            if (userFetchGlag) {
                handleFetchUsers(Number(page), search, myedu_id, selectedRole_idType, active);
            }
            setMyeduProgressSpinner(false);
        }, 1000);

        return () => {
            clearTimeout(delay);
        };
    }, [myedu_id]);

    useEffect(() => {
        handleFetchRoles();
        // handleFetchUsers(1, '', null, null, null);
        setUserFetchGlag(true);
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

        if (selectedRole_idType?.role_id === null) {
            setSelectedRole_idType(prev => prev ? ({ ...prev, name: translations.all }) : null);
        }
    }, [translations]);

    const categoryFooterContent = (
        <div>
            <Button
                label={translations.back}
                className="reject-button"
                size="small"
                icon="pi pi-times"
                onClick={() => {
                    setCategoryVisible(false);
                    clearValues();
                }}
            />

            <Button
                label={translations.send}
                size="small"
                icon="pi pi-check"
                onClick={() => {
                    setCategoryVisible(false);
                    handleControlUsersRole(user_id, role_id, active, roleState);
                }}
                autoFocus
            />
        </div>
    );

    if (mainProgressSpinner)
        return (
            <div className="main-bg flex justify-center items-center h-[100vh]">
                <ProgressSpinner style={{ width: '60px', height: '60px' }} />
            </div>
        );

    if (contentNull) return <NotFound titleMessage={translations.noData} />;

    // только для отображения в диалоге
    const dialogUser = users?.find((u) => u.id === user_id);
    const dialogRole = roles?.find((r) => r.id === role_id);

    const permissionOptions: { key: keyof RoleState; label: string; icon: string }[] = [
        { key: 'create', label: translations.create, icon: 'pi pi-plus-circle' },
        { key: 'update', label: translations.change, icon: 'pi pi-pencil' },
        { key: 'delete', label: translations.delete, icon: 'pi pi-trash' },
        { key: 'show', label: translations.view, icon: 'pi pi-eye' }
    ];

    return (
        <div className="flex flex-col gap-4">
            {skeleton ? (
                <GroupSkeleton count={5} size={{ width: '100%', height: '3rem' }} />
            ) : (
                <div className="overflow-x-auto scrollbar-thin flex flex-col gap-[16px]">
                    <div className="rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-[14px] sm:p-[18px]">
                        <div className="flex items-center gap-[10px] mb-[14px]">
                            <h3 className="text-[20px] sm:text-[22px] leading-tight font-bold m-0">{translations.adminTitle}</h3>
                            {pagination.total > 0 && (
                                <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full bg-[#f1f5f9] text-[12px] font-semibold text-[var(--bodyColor)]">
                                    <i className="pi pi-users text-[11px]"></i>
                                    {pagination.total}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center gap-[10px]">
                            {/* поиск */}
                            <div className="flex items-center relative flex-1 min-w-0">
                                <i className="pi pi-search absolute left-[12px] z-[1] text-[13px] text-[var(--text-color-secondary)] pointer-events-none"></i>
                                <InputText placeholder={translations.search} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-[40px] text-[14px]" style={{ paddingLeft: 36, borderRadius: 10 }} />
                                <div className="absolute right-[10px]">{miniProgressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-[10px]">
                                {/* myedu id */}
                                <div className="flex items-center relative sm:w-[150px]">
                                    <InputText type="number" placeholder={translations.myeduIdPlaceholder} className="w-full h-[40px] text-[14px]" style={{ borderRadius: 10 }} onChange={(e) => setMyedu_id(e.target.value)} />
                                    <div className="absolute right-[10px]">{myeduProgressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                                </div>

                                {/* роль */}
                                <Dropdown
                                    value={selectedRole_idType}
                                    onChange={(e: DropdownChangeEvent) => setSelectedRole_idType(e.value)}
                                    options={cities}
                                    optionLabel="name"
                                    placeholder="..."
                                    className="sm:w-[200px] h-[40px] items-center text-sm"
                                    style={{ borderRadius: 10 }}
                                />

                                {/* только активные */}
                                <div className={`flex items-center gap-[4px] h-[40px] transition-opacity ${!selectedRole_idType?.role_id ? 'opacity-45 pointer-events-none' : ''}`}>
                                    <label className="custom-radio p-0">
                                        <input
                                            type="checkbox"
                                            checked={active}
                                            className={`customCheckbox p-0`}
                                            onChange={() => {
                                                setActive((prev) => !prev);
                                                handleFetchUsers(Number(page), search, myedu_id, selectedRole_idType, !active);
                                            }}
                                        />
                                        <span className="checkbox-mark"></span>
                                    </label>
                                    <p className="m-0 text-[14px] text-[var(--bodyColor)] whitespace-nowrap">{translations.active}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* main */}
                    {media ? (
                        // <DataView
                        //     value={users || []}
                        //     itemTemplate={itemTemplate}
                        //     layout="list" // Отображение в виде сетки, что идеально подходит для карточек
                        //     rows={5}
                        //     emptyMessage="Нет данных для отображения"
                        // />
                        <div className="flex flex-col gap-[10px]">{itemTemplate(users)}</div>
                    ) : (
                        <div className="rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-[12px] sm:p-[16px] overflow-x-auto scrollbar-thin flex flex-col gap-[12px]">
                            <DataTable value={users || []} dataKey="id" emptyMessage="..." breakpoint="960px" key={JSON.stringify(forDisabled)} rows={5} className="modern-table min-w-[640px] overflow-x-auto text-sm">
                                <Column
                                    header="#"
                                    style={{ width: '48px', textAlign: 'center' }}
                                    body={(_, { rowIndex }) => <span className="text-[12px] font-semibold text-[var(--text-color-secondary)]">{(pagination.currentPage - 1) * pagination.perPage + rowIndex + 1}</span>}
                                />

                                <Column
                                    header={translations.fullName}
                                    body={(rowData: any) => (
                                        <div className="flex items-center gap-[10px] min-w-[220px]">
                                            <UserAvatar user={rowData} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[14px] font-semibold leading-snug text-[var(--titleColor)]">
                                                    {rowData.last_name} {rowData.name} {rowData.father_name}
                                                </span>
                                                {(rowData?.myedu_id || rowData?.email) && (
                                                    <span className="text-[12px] text-[var(--text-color-secondary)] truncate">
                                                        {rowData?.myedu_id && <>ID: {rowData.myedu_id}</>}
                                                        {rowData?.myedu_id && rowData?.email && ' · '}
                                                        {rowData?.email}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />
                                {roles?.map((role, idx) => {
                                    return (
                                        <Column
                                            key={role?.id}
                                            header={() => <div className="w-full text-center">{getLocalized(role, 'name') || role.title}</div>}
                                            style={{ textAlign: 'center' }}
                                            body={(user) => {
                                                const userRole = user?.roles?.find((r: { id: number }) => r.id === role.id);

                                                const isActive = Boolean(userRole?.pivot?.active);

                                                return (
                                                    <div className="text-center">
                                                        <div className="flex justify-center items-center">
                                                            {!isActive ? (
                                                                <RoleSwitch
                                                                    isActive={false}
                                                                    disabled={forDisabled}
                                                                    // onClick={() => handleControlUsersRole(user?.id, roles[idx]?.id, true)}
                                                                    onClick={() => {
                                                                        setCategoryVisible(true);
                                                                        checkRolesCrud(user, role?.id);
                                                                        setRole_id(roles[idx]?.id);
                                                                        setUser_id(user?.id);
                                                                        setActive(true);
                                                                    }}
                                                                />
                                                            ) : (
                                                                <RoleSwitch
                                                                    isActive={true}
                                                                    disabled={forDisabled}
                                                                    // onClick={() => handleControlUsersRole(user?.id, roles[idx]?.id, false)}
                                                                    onClick={() => {
                                                                        setCategoryVisible(true);
                                                                        checkRolesCrud(user, role?.id);
                                                                        setRole_id(roles[idx]?.id);
                                                                        setUser_id(user?.id);
                                                                        setActive(false);
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />
                                    );
                                })}
                            </DataTable>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-[8px]">
                                {pagination.total > 0 && pagination.perPage > 0 && (
                                    <span className="text-[13px] text-[var(--text-color-secondary)]">
                                        {(pagination.currentPage - 1) * pagination.perPage + 1}–{Math.min(pagination.currentPage * pagination.perPage, pagination.total)} / <b className="text-[var(--titleColor)]">{pagination.total}</b>
                                    </span>
                                )}
                                <Paginator
                                    first={(pagination.currentPage - 1) * pagination.perPage}
                                    rows={pagination.perPage}
                                    totalRecords={pagination.total}
                                    onPageChange={(e) => handlePageChange(e.page + 1)}
                                    // template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                    template={media ? 'FirstPageLink PrevPageLink NextPageLink LastPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                                    className="courses-paginator bg-transparent p-0"
                                />
                            </div>
                        </div>
                    )}
                    <Dialog
                        header={translations.send}
                        visible={categoryVisible}
                        className="my-custom-dialog"
                        onHide={() => {
                            if (!categoryVisible) return;
                            setCategoryVisible(false);
                            clearValues();
                        }}
                        footer={categoryFooterContent}
                    >
                        {
                            <div className="flex flex-col gap-[12px]">
                                {(dialogUser || dialogRole) && (
                                    <div className="flex items-center gap-[10px] p-[10px] rounded-[12px] bg-[#f8fafc] border border-[#eef2f6]">
                                        {dialogUser && <UserAvatar user={dialogUser} />}
                                        <div className="flex flex-col min-w-0">
                                            {dialogUser && (
                                                <b className="text-[14px] text-[var(--titleColor)] leading-snug">
                                                    {dialogUser.last_name} {dialogUser.name} {dialogUser.father_name}
                                                </b>
                                            )}
                                            {dialogRole && (
                                                <span className="inline-flex items-center gap-[4px] text-[12px] text-[var(--mainColor)] font-semibold">
                                                    <i className="pi pi-shield text-[11px]"></i>
                                                    {getLocalized(dialogRole, 'name') || dialogRole.title}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="[display:grid] grid-cols-1 sm:grid-cols-2 gap-[8px]">
                                    {permissionOptions.map((perm) => (
                                        <label
                                            key={perm.key}
                                            className={`custom-radio flex items-center gap-[10px] px-[12px] py-[10px] rounded-[12px] border transition-colors duration-200 ${
                                                roleState?.[perm.key] ? 'border-[var(--mainColor)] bg-[var(--mainColor)]/5' : 'border-[#e2e8f0] bg-white hover:border-[var(--mainBorder)]'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className={`customCheckbox`}
                                                checked={roleState?.[perm.key]}
                                                onChange={(e) => {
                                                    setRoleState((prev) => {
                                                        return {
                                                            ...prev,
                                                            [perm.key]: !prev?.[perm.key]
                                                        };
                                                    });
                                                }}
                                            />
                                            <i className={`${perm.icon} text-[14px] ${roleState?.[perm.key] ? 'text-[var(--mainColor)]' : 'text-[var(--text-color-secondary)]'}`}></i>
                                            <span className="checkbox-mark text-[14px] font-medium text-[var(--titleColor)]">{perm.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        }
                    </Dialog>
                </div>
            )}
        </div>
    );
}
