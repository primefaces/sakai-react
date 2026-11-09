'use client';

import FormModal from '@/app/components/popUp/FormModal';
import { addCourse, addOpenTypes, archiveCourse, deleteCourse, fetchCourseInfo, fetchCourseOpenStatus, fetchCourses, updateCourse, veryfyCourse } from '@/services/courses';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import Link from 'next/link';
import { CourseCreateType } from '@/types/courseCreateType';
import { CourseType } from '@/types/courseType';
import { Paginator } from 'primereact/paginator';
import { NotFound } from '@/app/components/NotFound';
import Redacting from '@/app/components/popUp/Redacting';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import useErrorMessage from '@/hooks/useErrorMessage';
import { myMainCourseType } from '@/types/myMainCourseType';
import StreamList from '@/app/components/tables/StreamList';
import { TabPanel, TabView } from 'primereact/tabview';
import { TabViewChange } from '@/types/tabViewChange';
import useMediaQuery from '@/hooks/useMediaQuery';
import useShortText from '@/hooks/useShortText';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataView } from 'primereact/dataview';
import { FileWithPreview } from '@/types/fileuploadPreview';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { AudenceType } from '@/types/courseTypes/AudenceTypes';
import OpenStudentList from '@/app/components/tables/OpenStudentList';
import { confirmDialog } from 'primereact/confirmdialog';

import { useLocalization } from '@/layout/context/localizationcontext';
import { useParams, useRouter } from 'next/navigation';

export default function Course() {
    const { page } = useParams();

    const { translations } = useLocalization();
    const { setMessage, setGlobalLoading, course, setMainCourseId, contextCourseDisplay, setContextCourseDisplay, contextStreamId, setContextStreamId, contextStreamIndex, setContextStreamIndex } = useContext(LayoutContext);

    const router = useRouter();
    const topRef = useRef<HTMLDivElement>(null);
    const media = useMediaQuery('(max-width: 640px)');
    const tableMedia = useMediaQuery('(max-width: 577px)');

    const [coursesValue, setValueCourses] = useState<myMainCourseType[]>([]);
    const [hasCourses, setHasCourses] = useState(false);
    const [emptyCourses, setEmptyCourses] = useState(false);
    const [courseValue, setCourseValue] = useState<CourseCreateType>({ title: '', description: '', video_url: '', image: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [audenceTypeVisible, setAudenceTypeVisible] = useState(false);
    const [forStart, setForStart] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>({
        currentPage: 1,
        total: 0,
        perPage: 0
    });
    const [activeIndex, setActiveIndex] = useState<number>(contextStreamIndex);
    const [imageState, setImageState] = useState<string | null>(null);
    const [editingLesson, setEditingLesson] = useState<CourseCreateType>({
        title: '',
        description: '',
        video_url: '',
        image: '',
        created_at: ''
    });

    const [forStreamId, setForStreamId] = useState<{ id: number | null; title: string } | null>(contextCourseDisplay?.streamId);
    const [sendStream, setSendStream] = useState<{ status: boolean; name: 'lock' | 'open' | 'wallet' | 'extra' | '' }>(contextCourseDisplay);
    // const [globalCourseId, setGlobalCourseId] = useState<{ id: number | null; title: string | null } | null>(null);
    // const [pageState, setPageState] = useState<number>(Number(page));
    const [openTypes, setOpenTypes] = useState<AudenceType[]>([]);
    const [openCourseId, setOpenCourseId] = useState<number | null>(null);
    // const [copy_have, setCopy_have] = useState<boolean>(false);

    const [isTall, setIsTall] = useState(false);

    const [filters, setFilters] = useState<{
        course_audience_type_id: number | null;
        is_published: boolean | null;
        status: boolean | null;
    }>({
        course_audience_type_id: null,
        is_published: null,
        status: null
    });

    const audienceTypeOptions = [
        { label: translations.all, value: null },
        { label: translations.closed, value: 1 },
        { label: translations.openCourse, value: 2 },
        { label: translations.paid, value: 3 },
        { label: translations.notAuditItem, value: 4 }
    ];

    const publishedOptions = [
        { label: translations.all, value: null },
        { label: translations.published, value: true },
        { label: translations.notPublished, value: false }
    ];

    const statusOptions = [
        { label: translations.all, value: null },
        { label: translations.onReview, value: true },
        { label: translations.notOnReview, value: false }
    ];

    const handleFilterChange = (e: DropdownChangeEvent) => {
        let value: any | null = null;
        if (typeof e.value === 'object') {
            value = null;
        } else {
            value = e.value;
        }

        setFilters((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const resetFilters = () => {
        setFilters({
            course_audience_type_id: null,
            is_published: null,
            status: null
        });
        // Here you would also refetch the data without filters
    };

    const showError = useErrorMessage();

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    const handleEdit = async (e: { checked: boolean }, item: { status: boolean; id: number }) => {
        setSkeleton(true);
        const { id } = item;
        const status = e.checked;

        const forSentStreams = {
            course_id: id,
            status: status ? 1 : 0
        };

        const data = await veryfyCourse(forSentStreams);
        if (data.success) {
            handleFetchCourse(Number(page), filters);
            // setPageState(1);
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.updateSuccess, detail: '' }
            });
        } else {
            setSkeleton(false);
            if (data.response.data.cause) {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.errorTitle, detail: data.response.data.cause }
                });
            } else if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else if (data?.response?.status == '422') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            } else {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.addCourseError, detail: '' }
                });
            }
        }
    };

    const fileUploadRef = useRef<FileUpload>(null);
    const clearFile = () => {
        fileUploadRef.current?.clear();
        setImageState(null);
        if (editMode) {
            setEditingLesson(
                (prev) =>
                    prev && {
                        ...prev,
                        image: null
                    }
            );
            // query
        } else {
            setCourseValue((prev) => ({
                ...prev,
                image: null
            }));
        }
    };

    const handleFetchCourse = async (
        page: number,
        filters: {
            course_audience_type_id: number | null;
            is_published: boolean | null;
            status: boolean | null;
        }
    ) => {
        setSkeleton(true);
        const data = await fetchCourses(page, 10, filters?.course_audience_type_id, filters?.is_published, filters?.status);

        if (data && data?.courses) {
            if (data?.courses?.data?.length > 0) {
                setEmptyCourses(false);
            } else {
                setEmptyCourses(true);
            }
            setHasCourses(false);
            setValueCourses(data.courses.data);
            setPagination({
                currentPage: data?.courses?.current_page,
                total: data?.courses?.total,
                perPage: data?.courses?.per_page
            });
        } else {
            setHasCourses(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setSkeleton(false);
    };

    const handleAddCourse = async () => {
        setSkeleton(true);
        const data = await addCourse(courseValue);
        if (data?.success) {
            handleFetchCourse(Number(page), filters);
            // setPageState(1);
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.successAdd, detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.addError, detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setSkeleton(false);
    };

    const handleDeleteCourse = async (id: number) => {
        setSkeleton(true);
        const data = await deleteCourse(id);
        if (data?.success) {
            // setGlobalCourseId(null);
            handleFetchCourse(Number(page), filters);
            // setPageState(1);
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.deleteSuccess, detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.deleteError, detail: '' }
            }); // messege - Ошибка при добавлении
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setSkeleton(false);
    };

    const clearValues = () => {
        setImageState(null);
        setCourseValue({ title: '', description: '', video_url: '', image: '' });
        setEditingLesson({ title: '', description: '', video_url: '', image: '', created_at: '' });
        setEditMode(false);
        setSelectedCourse(null);
    };

    const handleUpdateCourse = async () => {
        setSkeleton(true);
        const data = await updateCourse(selectedCourse, editingLesson);
        if (data?.success) {
            toggleSkeleton();
            handleFetchCourse(Number(page), filters);
            // setPageState(1);
            clearValues();
            setEditMode(false);
            setSelectedCourse(null);
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.updateSuccess, detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.updateError, detail: '' }
            }); // messege - Ошибка при изменении курса
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setSkeleton(false);
    };

    const onSelect = (e: FileUploadSelectEvent & { files: FileWithPreview[] }) => {
        if (e.files?.length > 0) {
            editMode
                ? setEditingLesson((prev) => ({
                      ...prev,
                      image: e.files[0]
                  }))
                : setCourseValue((prev) => ({
                      ...prev,
                      image: e.files[0]
                  }));
            setImageState(e.files[0].objectURL);
        }
    };

    const imageBodyTemplate = (product: CourseType) => {
        const image = product.image;

        return (
            <div className="w-[52px] h-[52px] mx-auto rounded-[12px] overflow-hidden bg-[#f1f5f9] border border-[#eef2f6] shadow-[0_1px_2px_rgba(0,0,0,0.05)]" key={product.id}>
                {typeof image === 'string' ? (
                    <img src={image} alt="Course image" className="w-full h-full object-cover" />
                ) : (
                    <img src={'/layout/images/no-image.png'} alt="Course image" className="w-full h-full object-cover opacity-60" />
                )}
            </div>
        );
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        // setGlobalCourseId(null);
        // handleFetchCourse(page, filters);
        // setPageState(page);
        router.push(`/course/${page}`);
    };

    const edit = (rowData: number | null) => {
        setEditMode(true);
        setSelectedCourse(rowData);
        setFormVisible(true);
    };

    const handleTabChange = (e: TabViewChange) => {
        if (e.index === 0) {
            // handleFetchLesson();
        }
        // setActiveIndex(e.index);
        setContextStreamIndex(e.index);
    };

    const handleFetchCourseOpenStatus = async () => {
        setAudenceTypeVisible(true);
        const data = await fetchCourseOpenStatus();
        if (data && Array.isArray(data)) {
            setOpenTypes(data);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTryAgainLater, detail: '' }
            }); // messege - Ошибка при изменении курса
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    const handleAddOpenTypes = async (course_audience_type_id: number, course_id: number) => {
        setSkeleton(true);
        const data = await addOpenTypes(course_audience_type_id, course_id);
        if (data && data.success) {
            handleFetchCourse(Number(page), filters);
            setMessage({
                state: true,
                value: { severity: 'success', summary: data.message, detail: '' }
            });
        } else {
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setAudenceTypeVisible(false);
        setSelectedCourse(null);
        setSkeleton(false);
    };

    const onInbox = async (id: number, copy_have: boolean) => {
        const data = await archiveCourse(id, copy_have);
        if (data?.success) {
            handleFetchCourse(Number(page), filters);
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.archiveSuccess, detail: '' }
            });
        } else {
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    const inboxConfirm = (id: number) => {
        let copy_have = false;
        confirmDialog({
            message: (
                <div className="flex flex-col gap-1">
                    <b>{translations.archiveCourseConfirmation}</b>
                    <span className="text-sm">{translations.archiveCourseNote}</span>
                    <div className="flex items-center text-sm">
                        <span>{translations.leaveCopy}</span>
                        <label className="custom-radio">
                            <input
                                type="checkbox"
                                className={`customCheckbox`}
                                onChange={(e) => {
                                    // setCopy_have(e.target.checked);
                                    copy_have = e.target.checked;
                                }}
                            />
                            <span className="checkbox-mark"></span>
                        </label>
                    </div>
                </div>
            ),
            header: translations.archiveCourse,
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            // acceptLabel: translations.archive,
            acceptLabel: translations.archive,
            rejectLabel: translations.back,
            rejectClassName: 'p-button-secondary reject-button',
            className: 'w-[50%]',
            accept: () => onInbox(id, copy_have)
        });
    };

    const formatDate = (value?: string) => {
        if (!value) return '';
        const date = new Date(value);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString('ru-RU');
    };

    // чип статуса курса (тип аудитории)
    const audienceChip = (rowData: any, compact = false) => (
        <button
            type="button"
            title={rowData?.audience_type?.title}
            className="inline-flex items-center gap-[6px] max-w-full px-[10px] py-[5px] rounded-full border border-[var(--mainBorder)] bg-[var(--mainColor)]/5 text-[var(--mainColor)] text-[0.75rem] font-semibold cursor-pointer whitespace-nowrap transition-colors duration-200 hover:bg-[var(--mainColor)] hover:text-white hover:border-[var(--mainColor)]"
            onClick={() => {
                setSelectedCourse(rowData?.id);
                handleFetchCourseOpenStatus();
            }}
        >
            <i className={`${rowData?.audience_type?.icon} text-[0.75rem]`}></i>
            {!compact && rowData?.audience_type?.title && <span className="truncate">{rowData.audience_type.title}</span>}
            <i className="pi pi-angle-down text-[0.625rem] opacity-70"></i>
        </button>
    );

    const publishedChip = (isPublished: boolean) =>
        isPublished ? (
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#ecfdf3] text-[#16a34a] text-[0.75rem] font-semibold whitespace-nowrap">
                <i className="pi pi-check-circle text-[0.75rem]"></i>
                {translations.published}
            </span>
        ) : (
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[var(--redBgColor)] text-[var(--redColor)] text-[0.75rem] font-semibold whitespace-nowrap">
                <i className="pi pi-times-circle text-[0.75rem]"></i>
                {translations.notPublished}
            </span>
        );

    const itemTemplate = (shablonData: any) => {
        return (
            <div className="col-12 py-[6px] px-0">
                <div className={`relative bg-white rounded-[16px] border p-[14px] flex flex-col gap-[12px] transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${forStreamId?.id === shablonData.id ? 'border-[var(--mainColor)] shadow-[0_8px_20px_-12px_rgba(8,169,230,0.6)]' : 'border-[#eef2f6]'}`}>
                    {/* Header: Image, Title & Actions */}
                    <div className="flex gap-[12px] items-start">
                        <div className="w-[64px] h-[64px] shrink-0 rounded-[12px] overflow-hidden bg-[#f1f5f9] border border-[#eef2f6]">
                            {typeof shablonData.image === 'string' ? (
                                <img src={shablonData.image} alt="Course" className="w-full h-full object-cover" />
                            ) : (
                                <img src={'/layout/images/no-image.png'} alt="No image" className="w-full h-full object-cover opacity-50" />
                            )}
                        </div>
                        <div className="flex flex-col gap-[6px] min-w-0 flex-1">
                            <Link
                                href={`/course/courseDetail/${shablonData.id}/process`}
                                className="font-semibold text-[0.9375rem] leading-snug text-[var(--titleColor)] break-words hover:text-[var(--mainColor)] transition-colors"
                                onClick={() => {
                                    setMainCourseId(shablonData.id);
                                    setGlobalLoading(true);
                                    setTimeout(() => {
                                        setGlobalLoading(false);
                                    }, 900);
                                }}
                            >
                                {shablonData.title}
                            </Link>
                            <div className="flex flex-wrap items-center gap-[6px]">
                                {audienceChip(shablonData)}
                                {publishedChip(shablonData.is_published)}
                            </div>
                        </div>
                        {tableMedia && (
                            <div className="shrink-0 -mr-[8px]">
                                <Redacting redactor={getRedactor(shablonData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse }, inboxConfirm)} textSize={'14px'} />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="[display:grid] grid-cols-2 gap-[8px]">
                        <div className="flex flex-col gap-[2px] px-[10px] py-[8px] rounded-[10px] bg-[#f8fafc]">
                            <span className="text-[0.6875rem] uppercase tracking-wide text-[var(--text-color-secondary)]">{translations.score}</span>
                            <span className="text-[1rem] font-bold text-[var(--titleColor)]">{shablonData?.max_score ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between gap-[6px] px-[10px] py-[8px] rounded-[10px] bg-[#f8fafc]">
                            <span className="text-[0.75rem] leading-tight text-[var(--bodyColor)]">{translations.onReview}</span>
                            <label className="custom-radio">
                                <input
                                    type="checkbox"
                                    className={`customCheckbox`}
                                    checked={shablonData.status}
                                    onChange={(e) => {
                                        handleEdit(e.target, shablonData);
                                    }}
                                />
                                <span className="checkbox-mark"></span>
                            </label>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="pt-[12px] border-t border-[#f1f5f9] flex items-center justify-between gap-[8px]">
                        <label className="custom-course-radio">
                            <input
                                type="radio"
                                name="radio"
                                checked={forStreamId?.id === shablonData.id}
                            />
                            <span
                                className="radio-course-mark connect-chip rounded"
                                onClick={() => {
                                    const newValue = { id: shablonData.id, title: shablonData.title };
                                    // Устанавливаем состояние
                                    // setForStreamId(newValue);
                                    setContextStreamId(newValue);
                                    setContextCourseDisplay({ status: false, name: shablonData?.audience_type?.name});
                                    // setSendStream({ status: false, name: shablonData?.audience_type?.name });
                                    setOpenCourseId(shablonData.id);
                                    // setActiveIndex(1);
                                    setContextStreamIndex(1);
                                }}
                            >
                                <i className="pi pi-link text-[0.6875rem]"></i>
                                {translations.connected} ({shablonData.connects_count})
                            </span>
                        </label>
                        {!tableMedia && (
                            <Redacting redactor={getRedactor(shablonData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse }, inboxConfirm)} textSize={'14px'} />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const courseFiltered = () => (
        <div className="my-[12px]">
            <div className="flex flex-col lg:flex-row lg:items-end gap-[12px] p-[12px] sm:p-[14px] bg-[#f8fafc] border border-[#eef2f6] rounded-[14px] text-sm">
                <div className="[display:grid] grid-cols-1 sm:grid-cols-3 gap-[12px] flex-1">
                    {/* Селект: Тип аудитории */}
                    <div className="flex flex-col gap-[6px] min-w-0">
                        <label htmlFor="course_audience_type_id" className="text-[0.6875rem] font-semibold text-[var(--text-color-secondary)] ml-[2px] uppercase tracking-wider">
                            {translations.courseStatus}
                        </label>
                        <Dropdown
                            id="course_audience_type_id"
                            name="course_audience_type_id"
                            value={filters.course_audience_type_id}
                            options={audienceTypeOptions}
                            onChange={handleFilterChange}
                            placeholder="Выберите тип"
                            className="w-full rounded-[10px] bg-white border-[#e2e8f0] transition-all duration-200 hover:border-[var(--mainBorder)]"
                            pt={{
                                root: { className: 'h-[38px] items-center' }
                            }}
                        />
                    </div>

                    {/* Селект: На проверке */}
                    <div className="flex flex-col gap-[6px] min-w-0">
                        <label htmlFor="status" className="text-[0.6875rem] font-semibold text-[var(--text-color-secondary)] ml-[2px] uppercase tracking-wider">
                            {translations.onReview}
                        </label>
                        <Dropdown
                            id="status"
                            name="status"
                            value={filters.status}
                            options={statusOptions}
                            onChange={handleFilterChange}
                            className="w-full rounded-[10px] bg-white border-[#e2e8f0] transition-all duration-200 hover:border-[var(--mainBorder)]"
                            pt={{
                                root: { className: 'h-[38px] items-center' }
                            }}
                        />
                    </div>

                    {/* Селект: Опубликовано */}
                    <div className="flex flex-col gap-[6px] min-w-0">
                        <label htmlFor="is_published" className="text-[0.6875rem] font-semibold text-[var(--text-color-secondary)] ml-[2px] uppercase tracking-wider">
                            {translations.published}
                        </label>
                        <Dropdown
                            id="is_published"
                            name="is_published"
                            value={filters.is_published}
                            options={publishedOptions}
                            onChange={handleFilterChange}
                            className="w-full rounded-[10px] bg-white border-[#e2e8f0] transition-all duration-200 hover:border-[var(--mainBorder)]"
                            pt={{
                                root: { className: 'h-[38px] items-center' }
                            }}
                        />
                    </div>
                </div>

                {/* Кнопка сброса */}
                <Button
                    label={translations.reset}
                    icon="pi pi-refresh"
                    onClick={resetFilters}
                    className="w-full lg:w-auto h-[38px] px-[16px] bg-white text-[var(--bodyColor)] border border-[#e2e8f0] rounded-[10px] hover:bg-white hover:text-[var(--redColor)] hover:border-[var(--redColor)] transition-all duration-200 flex justify-center gap-[6px] shrink-0"
                    size="small"
                />
            </div>
        </div>
    );

    const imagestateStyle = imageState || editingLesson.image ? 'flex gap-1 items-center justify-between flex-col sm:flex-row' : '';
    const imageTitle = useShortText(typeof editingLesson.image === 'string' ? editingLesson.image : '', 20);

    // usecallback
    const callbackFetchCourse = useCallback(() => {
        handleFetchCourse(Number(page), filters);
    }, [page]);

    const callbackSetIndex = useCallback(() => {
        // setActiveIndex(0);
        setContextStreamIndex(0);
    }, [activeIndex]);

    const callbackClose = useCallback(() => {
        // setSendStream({ status: true, name: '' });
        setContextCourseDisplay({ status: true, name: '' });
    }, [activeIndex]);

    // useMemo
    const memoForStreamId = useMemo(() => (forStreamId?.id ? forStreamId : null), [forStreamId?.id]);

    useEffect(() => {
        // handleFetchCourseNumber((page), filters);
        // setPageState(1);
        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 900);
    }, []);

    useEffect(() => {
        handleFetchCourse(Number(page), filters);
        if (course?.data?.length > 5) {
            setIsTall(true);
        } else {
            setIsTall(false);
        }
    }, [filters]);

    useEffect(() => {
        const title = editMode ? editingLesson.title.trim() : courseValue.title.trim();
        if (title?.length > 0) {
            setForStart(false);
        } else {
            setForStart(true);
        }
    }, [courseValue.title, editingLesson.title]);

    useEffect(() => {
        const handleShow = async () => {
            setProgressSpinner(true);
            const data = await fetchCourseInfo(selectedCourse);

            if (data?.success) {
                setProgressSpinner(false);
                setEditingLesson({
                    title: data.course.title || '',
                    video_url: data.course.video_url || '',
                    description: data.course.description || '',
                    image: data.course.image
                });
            } else {
                setProgressSpinner(false);
            }
        };

        if (editMode) {
            handleShow();
        }
    }, [editMode]);

    useEffect(()=> {
        setSendStream(contextCourseDisplay);
    },[contextCourseDisplay]);

    useEffect(()=> {
        setForStreamId(contextStreamId);
    },[contextStreamId]);

    useEffect(() => {
        setActiveIndex(contextStreamIndex);
    }, [contextStreamIndex]);

    const tableData = useMemo(() => {
        return coursesValue?.map((item) => ({ ...item, __isActive: forStreamId?.id === item.id }));
    }, [coursesValue, forStreamId]);

    return (
        <div className="main-bg">
            <div className="w-full flex justify-between gap-3">
                {/* Мобильный курс */}
                {media ? (
                    <div className="w-full">
                        <TabView
                            onTabChange={(e) => handleTabChange(e)}
                            activeIndex={activeIndex}
                            // className="main-bg"
                            pt={{
                                nav: { className: 'flex flex-wrap justify-around' },
                                panelContainer: { className: 'flex-1 pl-4' }
                            }}
                        >
                            {/* COURSE MOBILE */}
                            <TabPanel
                                pt={{
                                    headerAction: { className: 'font-italic ' }
                                }}
                                header={translations.courses}
                                className=" p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                            >
                                {/* mobile table section */}
                                {hasCourses ? (
                                    <>
                                        <div className="flex justify-end">
                                            <Button
                                                label={translations.addCourse}
                                                icon="pi pi-plus"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    clearValues();
                                                    setFormVisible(true);
                                                }}
                                            />
                                        </div>
                                        <NotFound titleMessage={translations.noCourses} />
                                    </>
                                ) : (
                                    <>
                                        <div className="w-full flex flex-col items-center justify-between gap-1">
                                            <Button
                                                label={translations.addCourse}
                                                icon="pi pi-plus"
                                                iconPos="right"
                                                className="w-full"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    clearValues();
                                                    setFormVisible(true);
                                                }}
                                            />
                                            <Button
                                                label={translations.streams}
                                                icon="pi pi-arrow-right"
                                                className="w-full mb-2"
                                                iconPos="right"
                                                onClick={() => {
                                                    // setActiveIndex(1);
                                                    setContextStreamIndex(1);
                                                }}
                                            />
                                        </div>

                                        {skeleton ? (
                                            <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-start">
                                                <GroupSkeleton count={1} size={{ height: '40px', width: '250px' }} /> <GroupSkeleton count={1} size={{ height: '40px', width: '250px' }} />{' '}
                                                <GroupSkeleton count={1} size={{ height: '40px', width: '250px' }} />{' '}
                                            </div>
                                        ) : (
                                            courseFiltered()
                                        )}

                                        {/* {skeleton ? <div className='flex items-center gap-1 flex-wrap justify-center sm:justify-start'><GroupSkeleton count={1} size={{height: '40px', width: '250px'}}/> <GroupSkeleton count={1} size={{height: '40px', width: '250px'}}/> <GroupSkeleton count={1} size={{height: '40px', width: '250px'}}/> </div> : courseFiltered()} */}
                                        <DataView
                                            value={coursesValue}
                                            itemTemplate={itemTemplate}
                                            layout="list" // Отображение в виде сетки, что идеально подходит для карточек
                                            rows={5}
                                            emptyMessage={translations.noData}
                                        />
                                        <Paginator
                                            first={(pagination.currentPage - 1) * pagination.perPage}
                                            rows={pagination.perPage}
                                            totalRecords={pagination.total}
                                            onPageChange={(e) => handlePageChange(e.page + 1)}
                                            template={media ? 'FirstPageLink PrevPageLink NextPageLink LastPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                                        />
                                    </>
                                )}
                            </TabPanel>

                            {/* STREAMS MOBILE */}
                            <TabPanel
                                pt={{
                                    headerAction: { className: 'font-italic' }
                                }}
                                header={translations.streams}
                                className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                            >
                                <div className="w-full block sm:w-1/2">
                                    {sendStream.name === 'lock' || sendStream.name === 'extra' ? (
                                        <StreamList callIndex={activeIndex} courseValue={memoForStreamId} isMobile={true} fetchprop={callbackFetchCourse} close={callbackClose} audit={sendStream?.name}/>
                                    ) : (
                                        <OpenStudentList course_id={openCourseId} course_title={forStreamId?.title || null} close={callbackSetIndex} />
                                    )}
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                ) : (
                    // Десктопный курс
                    <div className="w-full flex justify-between items-start gap-2 xl:gap-5">
                        {sendStream.status ? (
                            <div className="w-full">
                                {/* info section */}
                                {/* {skeleton ? (
                                    <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                                ) : ( */}
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-[12px] pb-[14px] border-b border-[#eef2f6]">
                                    <div className="flex items-center gap-[12px]">
                                        <span className="flex items-center justify-center w-[44px] h-[44px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                                            <i className="pi pi-book text-[1.25rem]"></i>
                                        </span>
                                        <div className="flex flex-col gap-[2px]">
                                            <h3 className="text-[1.5rem] leading-tight font-bold m-0">{translations.courses}</h3>
                                            {!hasCourses && pagination.total > 0 && (
                                                <span className="text-[0.8125rem] text-[var(--text-color-secondary)]">
                                                    {translations.allCourses}: <b className="text-[var(--titleColor)]">{pagination.total}</b>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        label={translations.addCourse}
                                        icon="pi pi-plus text-sm"
                                        className={'rounded-[10px] px-[18px] py-[10px] shadow-[0_6px_14px_-6px_rgba(8,169,230,0.7)] hover:opacity-90 transition'}
                                        onClick={() => {
                                            setEditMode(false);
                                            clearValues();
                                            setFormVisible(true);
                                        }}
                                    />
                                </div>
                                {/* // )} */}

                                {skeleton ? (
                                    <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-start my-[12px]">
                                        <GroupSkeleton count={1} size={{ height: '40px', width: '250px' }} /> <GroupSkeleton count={1} size={{ height: '40px', width: '250px' }} /> <GroupSkeleton count={1} size={{ height: '40px', width: '250px' }} />{' '}
                                    </div>
                                ) : (
                                    courseFiltered()
                                )}

                                {/* table section */}
                                {emptyCourses || hasCourses ? (
                                    <div className="flex flex-col items-center justify-center gap-[10px] py-[48px] rounded-[14px] border border-dashed border-[#dbe3ea] bg-[#fbfdfe]">
                                        <span className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                                            <i className="pi pi-inbox text-[1.5rem]"></i>
                                        </span>
                                        <p className="m-0 text-[0.9375rem] font-semibold text-[var(--titleColor)]">{emptyCourses ? translations.noData : translations.noCourses}</p>
                                    </div>
                                ) : (
                                    <>
                                        {skeleton ? (
                                            <div className="w-full">
                                                <GroupSkeleton count={coursesValue?.length || 5} size={{ width: '100%', height: '4rem' }} />
                                            </div>
                                        ) : (
                                            <div>
                                                {/* <OpenStudentList /> */}
                                                <div ref={topRef}>
                                                    <DataTable
                                                        value={tableData}
                                                        dataKey="id"
                                                        emptyMessage={translations.loading}
                                                        breakpoint="960px"
                                                        rows={5}
                                                        rowClassName={(rowData) => (rowData.__isActive ? 'course-row-active' : '')}
                                                        className="courses-table text-sm"
                                                    >
                                                        <Column
                                                            body={(_, { rowIndex }) => <span className="text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{(pagination.currentPage - 1) * pagination.perPage + rowIndex + 1}</span>}
                                                            header="#"
                                                            style={{ width: '40px', textAlign: 'center' }}
                                                        ></Column>
                                                        <Column
                                                            style={{ width: '76px' }}
                                                            header={() => (
                                                                <div className="flex justify-center w-full">
                                                                    <i className="pi pi-images text-[0.875rem]"></i>
                                                                </div>
                                                            )}
                                                            body={imageBodyTemplate}
                                                        ></Column>

                                                        <Column
                                                            field="title"
                                                            header={translations.courseName}
                                                            body={(rowData) => (
                                                                <div className="flex flex-col gap-[3px] min-w-[180px] max-w-[420px]">
                                                                    <Link
                                                                        // href={`/course/detail/${rowData.id}/${'null'}`}
                                                                        href={`/course/courseDetail/${rowData.id}/process`}
                                                                        onClick={() => {
                                                                            setGlobalLoading(true);
                                                                            setTimeout(() => {
                                                                                setGlobalLoading(false);
                                                                            }, 1200);
                                                                            setMainCourseId(rowData.id);
                                                                        }}
                                                                        key={rowData.id}
                                                                        className="break-words font-semibold text-[0.875rem] leading-snug text-[var(--titleColor)] hover:text-[var(--mainColor)] transition-colors"
                                                                    >
                                                                        {rowData.title}
                                                                    </Link>
                                                                    {(rowData.description || rowData.created_at) && (
                                                                        <div className="flex items-center gap-[8px] text-[0.75rem] text-[var(--text-color-secondary)] min-w-0">
                                                                            {formatDate(rowData.created_at) && (
                                                                                <span className="inline-flex items-center gap-[4px] shrink-0">
                                                                                    <i className="pi pi-calendar text-[0.6875rem]"></i>
                                                                                    {formatDate(rowData.created_at)}
                                                                                </span>
                                                                            )}
                                                                            {rowData.description && (
                                                                                <span className="truncate" title={rowData.description}>
                                                                                    {rowData.description}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        ></Column>
                                                        <Column header={translations.courseStatus} body={(rowData) => audienceChip(rowData)}></Column>
                                                        <Column
                                                            field="title"
                                                            header={translations.score}
                                                            style={{ textAlign: 'center' }}
                                                            body={(rowData) => (
                                                                <span key={rowData.id} className="inline-flex items-center justify-center min-w-[36px] px-[8px] py-[3px] rounded-[8px] bg-[#f1f5f9] text-[0.8125rem] font-bold text-[var(--titleColor)]">
                                                                    {rowData.max_score ?? 0}
                                                                </span>
                                                            )}
                                                        ></Column>
                                                        <Column
                                                            header={translations.onReview}
                                                            style={{ margin: '0 3px', textAlign: 'center' }}
                                                            body={(rowData) => (
                                                                <>
                                                                    <label className="custom-radio">
                                                                        <input
                                                                            type="checkbox"
                                                                            className={`customCheckbox`}
                                                                            checked={rowData.status}
                                                                            onChange={(e) => {
                                                                                handleEdit(e.target, rowData);
                                                                            }}
                                                                        />
                                                                        <span className="checkbox-mark"></span>
                                                                    </label>
                                                                </>
                                                            )}
                                                        ></Column>
                                                        <Column
                                                            header={translations.publication}
                                                            style={{ margin: '0 3px', textAlign: 'center' }}
                                                            body={(rowData) => publishedChip(rowData.is_published)}
                                                        ></Column>
                                                        <Column
                                                            header={translations.streams}
                                                            style={{ margin: '0 3px', textAlign: 'center' }}
                                                            body={(rowData) => {
                                                                const isChecked = forStreamId?.id === rowData.id;
                                                                return (
                                                                    <>
                                                                        <label className="custom-course-radio">
                                                                            <input
                                                                                type="radio"
                                                                                name="radio"
                                                                                onChange={() => {
                                                                                    const newValue = { id: rowData.id, title: rowData.title };
                                                                                    // setGlobalCourseId(newValue);
                                                                                    // setForStreamId(newValue);
                                                                                    setContextStreamId(newValue);
                                                                                    setOpenCourseId(rowData.id);
                                                                                }}
                                                                                onClick={() => {
                                                                                    setContextCourseDisplay({ status: false, name: rowData?.audience_type?.name });
                                                                                    // setSendStream({ status: false, name: rowData?.audience_type?.name });
                                                                                }}
                                                                                checked={isChecked}
                                                                            />
                                                                            <span className="radio-course-mark connect-chip rounded">
                                                                                <i className="pi pi-link text-[0.6875rem]"></i>
                                                                                {translations.connects} ({rowData.connects_count})
                                                                            </span>
                                                                        </label>
                                                                    </>
                                                                );
                                                            }}
                                                        ></Column>
                                                        <Column
                                                            style={{ width: '56px', textAlign: 'center' }}
                                                            body={(rowData) => (
                                                                <div className="flex items-center justify-center" key={rowData.id}>
                                                                    <Redacting redactor={getRedactor(rowData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse }, inboxConfirm)} textSize={'14px'} />
                                                                </div>
                                                            )}
                                                        />
                                                    </DataTable>
                                                </div>
                                                <div className={`${isTall ? 'mt-[16px]' : 'mt-[10px]'} flex flex-col sm:flex-row items-center justify-between gap-[8px]`}>
                                                    {pagination.total > 0 && pagination.perPage > 0 && (
                                                        <span className="text-[0.8125rem] text-[var(--text-color-secondary)]">
                                                            {(pagination.currentPage - 1) * pagination.perPage + 1}–{Math.min(pagination.currentPage * pagination.perPage, pagination.total)} / <b className="text-[var(--titleColor)]">{pagination.total}</b>
                                                        </span>
                                                    )}
                                                    <Paginator
                                                        first={(pagination.currentPage - 1) * pagination.perPage}
                                                        rows={pagination.perPage}
                                                        totalRecords={pagination.total}
                                                        onPageChange={(e) => handlePageChange(e.page + 1)}
                                                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                                        className="courses-paginator bg-transparent p-0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="w-full">
                                {sendStream.name === 'lock' || sendStream.name === 'extra' ? (
                                    <StreamList isMobile={false} callIndex={1} courseValue={memoForStreamId} fetchprop={callbackFetchCourse} close={callbackClose} audit={sendStream?.name} />
                                ) : (
                                    <OpenStudentList course_id={openCourseId} course_title={forStreamId?.title || null} close={callbackClose} />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* modal window */}
            <FormModal
                title={editMode ? translations.edit : translations.add}
                fetchValue={editMode ? handleUpdateCourse : handleAddCourse}
                clearValues={clearValues}
                visible={formVisible}
                setVisible={setFormVisible}
                start={forStart}
                footerValue={{ footerState: editMode, reject: translations.back, next: translations.save }}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <div className="w-full flex justify-center gap-3 items-center">
                            <label className="block text-900 font-medium text-md md:text-lg">{translations.courseName}</label>
                        </div>
                        <div className="w-full flex gap-2 items-center">
                            <div className="p-inputgroup flex-1">
                                <InputText
                                    value={editMode ? editingLesson.title || '' : courseValue.title}
                                    placeholder={translations.courseName}
                                    disabled={progressSpinner === true ? true : false}
                                    className="w-[100%]"
                                    onChange={(e) => {
                                        editMode
                                            ? setEditingLesson((prev) => ({
                                                  ...prev,
                                                  title: e.target.value
                                              }))
                                            : setCourseValue((prev) => ({
                                                  ...prev,
                                                  title: e.target.value
                                              }));
                                    }}
                                />
                            </div>
                            {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 items-center justify-center">
                        <label className="block text-900 font-medium text-[1rem] md:text-lg mb-1 md:mb-2">{translations.courseDescription}</label>
                        <div className="w-full flex gap-2 justify-center items-center">
                            <InputTextarea
                                // autoResize
                                value={editMode ? editingLesson.description || '' : courseValue.description}
                                disabled={progressSpinner === true ? true : false}
                                rows={3}
                                cols={30}
                                className="w-[300px] sm:w-full h-[100px]"
                                onChange={(e) => {
                                    editMode
                                        ? setEditingLesson((prev) => ({
                                              ...prev,
                                              description: e.target.value
                                          }))
                                        : setCourseValue((prev) => ({
                                              ...prev,
                                              description: e.target.value
                                          }));
                                }}
                            />
                            {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                        </div>
                    </div>

                    <div className={imagestateStyle}>
                        <div className="w-1/2 order-2 sm:order-1 max-h-[170px] max-w-[300px] overflow-hidden flex justify-center items-center">
                            {typeof imageState === 'string' ? (
                                <img className="w-full object-cover" src={imageState} alt={translations.photo} />
                            ) : editingLesson.image ? (
                                <img className="w-full object-cover" src={typeof editingLesson.image === 'string' ? editingLesson.image : ''} alt={translations.photo} />
                            ) : (
                                ''
                            )}
                        </div>
                        <div className={`flex flex-col pag-1 order-1 sm:order-2 items-center justify-center ${imageState && 'w-1/2'}`}>
                            <label className="block text-900 font-medium text-[1rem] md:text-lg mb-1 md:mb-2">{translations.addPhoto}</label>
                            <FileUpload
                                ref={fileUploadRef}
                                mode="basic"
                                chooseLabel={translations.photo}
                                style={{ fontSize: '0.75rem', textWrap: 'wrap' }}
                                className="max-w-[200px]"
                                customUpload
                                name="demo[]"
                                accept="image/*"
                                maxFileSize={1000000}
                                onSelect={onSelect}
                            />
                            {courseValue.image || editingLesson.image ? (
                                <div className="mt-2 text-sm text-gray-700">
                                    {typeof editingLesson.image === 'string' && (
                                        <>
                                            <b className="text-[0.75rem] text-center w-[300px]">{imageTitle}</b>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <b className="text-[0.75rem] text-red-500">jpeg, png, jpg</b>
                            )}
                            <div className="flex items-center gap-1">{(editingLesson.image || imageState) && <Button icon={'pi pi-trash'} className="trash-button" onClick={clearFile} />}</div>
                        </div>
                    </div>
                </div>
            </FormModal>

            {/* open status window */}
            <Dialog
                header={translations.courseStatus}
                visible={audenceTypeVisible}
                className="w-[90%] sm:w-[400px]"
                onHide={() => {
                    if (!audenceTypeVisible) return;
                    setAudenceTypeVisible(false);
                }}
            >
                <div className="flex flex-col gap-1">
                    {skeleton ? (
                        <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                    ) : (
                        <div className="w-full flex flex-col mt-[4px] gap-[8px]">
                            {openTypes?.map((item) => {
                                const isCurrent = coursesValue?.find((c) => c.id === selectedCourse)?.audience_type?.id === item?.id;
                                return (
                                    <div
                                        key={item?.id}
                                        className={`group cursor-pointer flex items-start gap-[12px] p-[12px] rounded-[12px] border transition-all duration-200 hover:border-[var(--mainColor)] hover:bg-[var(--mainColor)]/5 ${isCurrent ? 'border-[var(--mainColor)] bg-[var(--mainColor)]/5' : 'border-[#eef2f6] bg-white'}`}
                                        onClick={() => {
                                            console.log(item, selectedCourse);
                                            if (selectedCourse) {
                                                handleAddOpenTypes(item?.id, selectedCourse);
                                            }
                                        }}
                                    >
                                        <span className={`flex items-center justify-center shrink-0 w-[38px] h-[38px] rounded-[10px] transition-colors ${isCurrent ? 'bg-[var(--mainColor)] text-white' : 'bg-[var(--mainColor)]/10 text-[var(--mainColor)] group-hover:bg-[var(--mainColor)] group-hover:text-white'}`}>
                                            <i className={`${item?.icon} text-[0.9375rem]`}></i>
                                        </span>
                                        <div key={item?.id} className="flex flex-col gap-[2px] min-w-0 flex-1">
                                            <b className="text-[0.875rem] text-[var(--titleColor)]">{item.title}</b>
                                            <small className="text-[0.75rem] leading-snug text-[var(--text-color-secondary)]">{item?.description}</small>
                                        </div>
                                        {isCurrent && <i className="pi pi-check-circle text-[var(--mainColor)] text-[1rem] mt-[2px]"></i>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
