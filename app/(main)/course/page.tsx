'use client';

import FormModal from '@/app/components/popUp/FormModal';
import { addCourse, addOpenTypes, deleteCourse, fetchCourseInfo, fetchCourseOpenStatus, fetchCourses, updateCourse, veryfyCourse } from '@/services/courses';
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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import useShortText from '@/hooks/useShortText';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataView } from 'primereact/dataview';
import { FileWithPreview } from '@/types/fileuploadPreview';
import { Dialog } from 'primereact/dialog';
import { AudenceType } from '@/types/courseTypes/AudenceTypes';
import OpenStudentList from '@/app/components/tables/OpenStudentList';

export default function Course() {
    const { setMessage, setGlobalLoading, course, contextFetchCourse, setMainCourseId } = useContext(LayoutContext);

    const topRef = useRef<HTMLDivElement>(null);
    const media = useMediaQuery('(max-width: 640px)');
    const tableMedia = useMediaQuery('(max-width: 577px)');

    const [coursesValue, setValueCourses] = useState<myMainCourseType[]>([]);
    const [hasCourses, setHasCourses] = useState(false);
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
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [imageState, setImageState] = useState<string | null>(null);
    const [editingLesson, setEditingLesson] = useState<CourseCreateType>({
        title: '',
        description: '',
        video_url: '',
        image: '',
        created_at: ''
    });

    const [forStreamId, setForStreamId] = useState<{ id: number | null; title: string } | null>(null);
    const [sendStream, setSendStream] = useState<{ status: boolean; name: 'lock' | 'open' | 'wallet' | '' }>({ status: true, name: 'lock' });
    const [globalCourseId, setGlobalCourseId] = useState<{ id: number | null; title: string | null } | null>(null);
    const [pageState, setPageState] = useState<number>(1);
    const [openTypes, setOpenTypes] = useState<AudenceType[]>([]);
    const [openCourseId, setOpenCourseId] = useState<number | null>(null);

    const [isTall, setIsTall] = useState(false);

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
            contextFetchCourse(1);
            setPageState(1);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setSkeleton(false);
            if (data.response.data.cause) {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка!', detail: data.response.data.cause }
                });
            } else if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else if (data?.response?.status == '422') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            } else {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Не удалось добавить курс', detail: '' }
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

    const handleFetchCourse = async (page = 1) => {
        setSkeleton(true);
        const data = await fetchCourses(page, 10);
        if (course) {
            setHasCourses(false);
            setValueCourses(course.data);
            setPagination({
                currentPage: course.current_page,
                total: course?.total,
                perPage: course?.per_page
            });
        } else {
            setHasCourses(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
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
            contextFetchCourse(1);
            setPageState(1);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при добавлении!', detail: '' }
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
            setGlobalCourseId(null);
            contextFetchCourse(1);
            setPageState(1);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно удалено!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при удалении!', detail: '' }
            }); // messege - Ошибка при добавлении
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
            contextFetchCourse(1);
            setPageState(1);
            clearValues();
            setEditMode(false);
            setSelectedCourse(null);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно изменено!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при изменении!', detail: '' }
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

        if (typeof image === 'string') {
            return (
                <div className="flex justify-center w-[50px] h-[50px] mx-4" key={product.id}>
                    <img src={image} alt="Course image" className="w-full object-cover shadow-2 border-round" />
                </div>
            );
        }

        return (
            <div className="flex justify-center w-[50px] h-[50px] mx-4" key={product.id}>
                <img src={'/layout/images/no-image.png'} alt="Course image" className="w-full object-cover shadow-2 border-round" />
            </div>
        );
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        setGlobalCourseId(null);
        contextFetchCourse(page);
        setPageState(page);
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
        setActiveIndex(e.index);
    };

    const handleFetchCourseOpenStatus = async () => {
        setAudenceTypeVisible(true);
        const data = await fetchCourseOpenStatus();
        if (data && Array.isArray(data)) {
            setOpenTypes(data);
        } else {
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
        console.log(data);
    };

    const handleAddOpenTypes = async (course_audience_type_id: number, course_id: number) => {
        setSkeleton(true);
        const data = await addOpenTypes(course_audience_type_id, course_id);
        console.log(data);

        if (data && data.success) {
            contextFetchCourse(1);
            setMessage({
                state: true,
                value: { severity: 'success', summary: data.message, detail: '' }
            });
        } else {
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
        setAudenceTypeVisible(false);
        setSelectedCourse(null);
        setSkeleton(false);
    };

    const itemTemplate = (shablonData: any) => {
        return (
            <div className="col-12">
                <div className={`w-full flex flex-col align-items-center p-3 gap-3 `}>
                    {/* Номер (rowIndex) можно добавить через внешний счетчик или props, но для DataView это сложнее */}
                    {/* Заголовок */}
                    <div className={`w-full flex-1 ${tableMedia && 'flex items-center gap-1 justify-between'}`}>
                        <div className="font-bold text-md mb-2">
                            <Link
                                href={`/course/${shablonData.id}/${'null'}`}
                                className="max-w-sm break-words"
                                onClick={() => {
                                    setMainCourseId(shablonData.id);
                                    setGlobalLoading(true);
                                    setTimeout(() => {
                                        setGlobalLoading(false);
                                    }, 900);
                                }}
                            >
                                {shablonData.title} {/* Используем subject_name из вашего шаблона */}
                            </Link>
                        </div>
                        {tableMedia && (
                            <div className="flex flex-column sm:flex-row gap-2 sm:mt-0">
                                <Redacting redactor={getRedactor(shablonData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse })} textSize={'14px'} />
                            </div>
                        )}
                    </div>
                    <div>{imageBodyTemplate(shablonData)}</div>
                    <div className="w-full flex flex-col justify-start">
                        <div className="flex gap-1 items-center">
                            <span className="text-[var(--mainColor)] text-sm mr-1">Статус: </span>
                            <Button
                                size="small"
                                className="p-2"
                                onClick={() => {
                                    setSelectedCourse(shablonData?.id);
                                    handleFetchCourseOpenStatus();
                                }}
                            >
                                <i className={`${shablonData?.audience_type?.icon}`}></i>
                            </Button>
                        </div>
                        <div>
                            <span className="text-[var(--mainColor)] text-sm">Балл: </span>
                            <span className="text-sm">{`${shablonData?.max_score}`}</span>
                        </div>
                        <div className="flex gap-1 items-center">
                            <span className="text-[var(--mainColor)] text-sm">На рассмотрение: </span>
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
                        <div className="flex gap-1 items-center">
                            <span className="text-[var(--mainColor)] text-sm">Публикация: </span>
                            {shablonData.is_published ? <i className="pi pi-check text-md text-[var(--greenColor)]"></i> : <i className="pi pi-times text-md text-[var(--redColor)]"></i>}
                        </div>
                    </div>
                    <>
                        <label className="custom-course-radio">
                            <input
                                type="radio"
                                name="radio"
                                onChange={() => {
                                    const newValue = forStreamId?.id === shablonData.id ? null : { id: shablonData.id, title: shablonData.title };
                                    // Устанавливаем состояние
                                    setForStreamId(newValue);
                                    setSendStream({ status: false, name: shablonData?.audience_type?.name });
                                    setOpenCourseId(shablonData.id);
                                }}
                                checked={forStreamId?.id === shablonData.id}
                            />
                            <span className="radio-course-mark rounded">Связан ({shablonData.connects_count})</span>
                        </label>
                    </>
                    {/* Кнопки действий */}
                    {!tableMedia && (
                        <div className="flex flex-column sm:flex-row gap-2 sm:mt-0">
                            {/* <Button icon="pi pi-pencil" className="p-button-rounded" onClick={() => edit(shablonData)} /> */}
                            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDeleteCourse(shablonData.id)} /> */}
                            <Redacting redactor={getRedactor(shablonData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse })} textSize={'14px'} />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const imagestateStyle = imageState || editingLesson.image ? 'flex gap-1 items-center justify-between flex-col sm:flex-row' : '';
    const imageTitle = useShortText(typeof editingLesson.image === 'string' ? editingLesson.image : '', 20);

    // usecallback
    const callbackFetchCourse = useCallback(() => {
        contextFetchCourse(pageState);
    }, [pageState]);

    const callbackSetIndex = useCallback(() => {
        setActiveIndex(0);
    }, [activeIndex]);

    const callbackClose = useCallback(() => {
        setSendStream({ status: true, name: '' });
    }, [activeIndex]);

    // useMemo
    const memoForStreamId = useMemo(() => (forStreamId?.id ? forStreamId : null), [forStreamId?.id]);

    useEffect(() => {
        contextFetchCourse(1);
        setPageState(1);
        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 900);
    }, []);

    useEffect(() => {
        handleFetchCourse();
        if (course?.data?.length > 5) {
            setIsTall(true);
        } else {
            setIsTall(false);
        }
    }, [course]);

    useEffect(() => {
        const title = editMode ? editingLesson.title.trim() : courseValue.title.trim();
        if (title?.length > 0) {
            setForStart(false);
        } else {
            setForStart(true);
        }
    }, [courseValue.title, editingLesson.title]);

    useEffect(() => {
        if (coursesValue?.length < 1) {
            setHasCourses(true);
        } else {
            if (globalCourseId != null) {
                const exists = coursesValue.some((c: { id: number }) => c.id === globalCourseId.id);
                if (exists) {
                    // setForStreamId({ id: globalCourseId.id, title: globalCourseId.title || '' });
                } else {
                    // setForStreamId({ id: coursesValue[0].id, title: coursesValue[0].title });
                }
            } else {
                // setForStreamId({ id: coursesValue[0].id, title: coursesValue[0].title });
            }
            setHasCourses(false);
        }
    }, [coursesValue]);

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

    const tableData = useMemo(() => {
        return coursesValue.map((item) => ({ ...item, __isActive: forStreamId?.id === item.id }));
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
                                header="Курсы"
                                className=" p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                            >
                                {/* mobile table section */}
                                {hasCourses ? (
                                    <>
                                        <div className="flex justify-end">
                                            <Button
                                                label="Добавить курс"
                                                icon="pi pi-plus"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    clearValues();
                                                    setFormVisible(true);
                                                }}
                                            />
                                        </div>
                                        <NotFound titleMessage={'Курсы отсутствуют'} />
                                    </>
                                ) : (
                                    <>
                                        <div className="w-full flex flex-col items-center justify-between gap-1">
                                            <Button
                                                label="Добавить курс"
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
                                                label="Потоки"
                                                icon="pi pi-arrow-right"
                                                className="w-full"
                                                iconPos="right"
                                                onClick={() => {
                                                    setActiveIndex(1);
                                                }}
                                            />
                                        </div>
                                        <DataView
                                            value={coursesValue}
                                            itemTemplate={itemTemplate}
                                            layout="list" // Отображение в виде сетки, что идеально подходит для карточек
                                            rows={5}
                                            emptyMessage="Нет данных для отображения"
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
                                header="Потоки"
                                className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                            >
                                <div className="w-full block sm:w-1/2">
                                    {sendStream.name === 'lock' ? (
                                        <StreamList callIndex={activeIndex} courseValue={memoForStreamId} isMobile={true} fetchprop={callbackFetchCourse} toggleIndex={callbackSetIndex} close={callbackClose} />
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
                                {skeleton ? (
                                    <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                                ) : (
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 py-2 gap-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                                        <h3 className="text-[32px] m-0">Курсы</h3>
                                        <Button
                                            label="Добавить курс"
                                            icon="pi pi-plus"
                                            onClick={() => {
                                                setEditMode(false);
                                                clearValues();
                                                setFormVisible(true);
                                            }}
                                        />
                                    </div>
                                )}

                                {/* table section */}
                                {hasCourses ? (
                                    <p className="text-[16px] text-center font-bold">{'Курсы отсутствуют'}</p>
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
                                                    <DataTable value={tableData} dataKey="id" emptyMessage="..." breakpoint="960px" rows={5} className="my-custom-table">
                                                        <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px' }}></Column>
                                                        <Column
                                                            style={{ width: '70px' }}
                                                            header={() => (
                                                                <div className="flex justify-center">
                                                                    <i className="pi pi-images text-xl"></i>
                                                                </div>
                                                            )}
                                                            body={imageBodyTemplate}
                                                        ></Column>

                                                        <Column
                                                            field="title"
                                                            header={() => <div className="text-[13px]">Название</div>}
                                                            body={(rowData) => (
                                                                <Link
                                                                    href={`/course/${rowData.id}/${'null'}`}
                                                                    onClick={() => {
                                                                        setGlobalLoading(true);
                                                                        setTimeout(() => {
                                                                            setGlobalLoading(false);
                                                                        }, 1200);
                                                                        setMainCourseId(rowData.id);
                                                                    }}
                                                                    key={rowData.id}
                                                                    className="max-w-sm break-words"
                                                                >
                                                                    {rowData.title}
                                                                </Link>
                                                            )}
                                                        ></Column>
                                                        <Column
                                                            style={{ width: '70px' }}
                                                            header={() => <div className="text-[13px]">Статус</div>}
                                                            body={(rowData) => (
                                                                <Button
                                                                    size="small"
                                                                    className="p-2"
                                                                    onClick={() => {
                                                                        setSelectedCourse(rowData?.id);
                                                                        handleFetchCourseOpenStatus();
                                                                    }}
                                                                >
                                                                    <i className={`${rowData?.audience_type?.icon}`}></i>
                                                                </Button>
                                                            )}
                                                        ></Column>
                                                        <Column field="title" header={() => <div className="text-[13px]">Балл</div>} body={(rowData) => <span key={rowData.id}>{rowData.max_score}</span>}></Column>
                                                        <Column
                                                            header={() => <div className="text-[13px]">На рассмотрение</div>}
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
                                                            header={() => <div className="text-[13px]">Публикация</div>}
                                                            style={{ margin: '0 3px', textAlign: 'center' }}
                                                            body={(rowData) => {
                                                                // if(rowData?.audience_type?.name === 'lock'){
                                                                return rowData.is_published ? <i className="pi pi-check text-md text-[var(--greenColor)]"></i> : <i className="pi pi-times text-md text-[var(--redColor)]"></i>;
                                                                // }
                                                                // return <i className='pi pi-minus'></i>
                                                            }}
                                                        ></Column>
                                                        <Column
                                                            header={() => <div className="text-[13px]">Потоки</div>}
                                                            style={{ margin: '0 3px', textAlign: 'center' }}
                                                            body={(rowData) => {
                                                                const isChecked = forStreamId?.id === rowData.id;
                                                                return (
                                                                    <>
                                                                        <label className="custom-course-radio">
                                                                            <input
                                                                                type="radio"
                                                                                name="radio"
                                                                                onClick={() => {
                                                                                    // const newValue = forStreamId?.id === rowData.id ? { id: rowData.id, title: rowData.title } : { id: rowData.id, title: rowData.title };
                                                                                    // if(isChecked) {
                                                                                    const newValue = { id: rowData.id, title: rowData.title };
                                                                                    setGlobalCourseId(newValue);
                                                                                    setForStreamId(newValue);
                                                                                    setSendStream({ status: false, name: rowData?.audience_type?.name });
                                                                                    setOpenCourseId(rowData.id);
                                                                                    // }
                                                                                    // Устанавливаем состояние
                                                                                }}
                                                                                checked={isChecked}
                                                                                // checked={forStreamId?.id === rowData.id}
                                                                            />
                                                                            <span className="radio-course-mark rounded">Связан ({rowData.connects_count})</span>
                                                                        </label>
                                                                    </>
                                                                );
                                                            }}
                                                        ></Column>
                                                        <Column
                                                            className="flex items-center justify-center h-[60px] border-b-0"
                                                            body={(rowData) => (
                                                                <div className="flex items-center gap-2" key={rowData.id}>
                                                                    <Redacting redactor={getRedactor(rowData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse })} textSize={'14px'} />
                                                                </div>
                                                            )}
                                                        />
                                                    </DataTable>
                                                </div>
                                                <div className={`${isTall ? 'mt-[20px]' : 'mt-[5px]'} shadow-[0px_-11px_5px_-6px_rgba(0,_0,_0,_0.1)]`}>
                                                    <Paginator
                                                        first={(pagination.currentPage - 1) * pagination.perPage}
                                                        rows={pagination.perPage}
                                                        totalRecords={pagination.total}
                                                        onPageChange={(e) => handlePageChange(e.page + 1)}
                                                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="w-full">
                                {sendStream.name === 'lock' ? (
                                    <StreamList isMobile={false} callIndex={1} courseValue={memoForStreamId} fetchprop={callbackFetchCourse} close={callbackClose} />
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
                title={editMode ? 'Обновить курс' : 'Добавить'}
                fetchValue={editMode ? handleUpdateCourse : handleAddCourse}
                clearValues={clearValues}
                visible={formVisible}
                setVisible={setFormVisible}
                start={forStart}
                footerValue={{ footerState: editMode, reject: 'Назад', next: 'Сохранить' }}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <div className="w-full flex justify-center gap-3 items-center">
                            <label className="block text-900 font-medium text-md md:text-lg">Название</label>
                        </div>
                        <div className="w-full flex gap-2 items-center">
                            <div className="p-inputgroup flex-1">
                                <InputText
                                    value={editMode ? editingLesson.title || '' : courseValue.title}
                                    placeholder="Название обязательно"
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
                    {/* <div className="flex flex-col gap-1 items-center justify-center">
                        <label className="block text-900 font-medium text-[16px] md:text-lg mb-1 md:mb-2">Видео ссылка</label>
                        <div className="w-full flex gap-2 items-center">
                            <InputText
                                value={editMode ? editingLesson.video_url || '' : courseValue.video_url}
                                placeholder="https://..."
                                title="Ссылка должна начинаться с https://!"
                                disabled={progressSpinner === true ? true : false}
                                className="w-full"
                                onChange={(e) => {
                                    editMode
                                        ? setEditingLesson((prev) => ({
                                              ...prev,
                                              video_url: e.target.value
                                          }))
                                        : setCourseValue((prev) => ({
                                              ...prev,
                                              video_url: e.target.value
                                          }));
                                }}
                            />
                            {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                        </div>
                    </div> */}

                    <div className="flex flex-col gap-1 items-center justify-center">
                        <label className="block text-900 font-medium text-[16px] md:text-lg mb-1 md:mb-2">Описание</label>
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
                            {typeof imageState === 'string' ? <img className="w-full object-cover" src={imageState} /> : <img className="w-full object-cover" src={typeof editingLesson.image === 'string' ? editingLesson.image : ''} />}
                        </div>
                        <div className={`flex flex-col pag-1 order-1 sm:order-2 items-center justify-center ${imageState && 'w-1/2'}`}>
                            <label className="block text-900 font-medium text-[16px] md:text-lg mb-1 md:mb-2">Добавить фото</label>
                            <FileUpload
                                ref={fileUploadRef}
                                mode="basic"
                                chooseLabel="Фото"
                                style={{ fontSize: '12px', textWrap: 'wrap' }}
                                className="max-w-[200px]"
                                customUpload
                                name="demo[]"
                                accept="image/*"
                                maxFileSize={1000000}
                                onSelect={onSelect}
                            />
                            {courseValue.image || editingLesson.image ? (
                                <div className="mt-2 text-sm text-gray-700 ">
                                    {typeof editingLesson.image === 'string' && (
                                        <>
                                            <b className="text-[12px] text-center w-[300px]">{imageTitle}</b>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <b className="text-[12px] text-red-500">jpeg, png, jpg</b>
                            )}
                            <div className="flex items-center gap-1">{(editingLesson.image || imageState) && <Button icon={'pi pi-trash'} className="trash-button" onClick={clearFile} />}</div>
                        </div>
                    </div>
                </div>
            </FormModal>

            {/* open status window */}
            <Dialog
                header={'Выберите статус курса'}
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
                        <div className="w-full flex flex-col mt-1 gap-1">
                            {openTypes?.map((item) => {
                                return (
                                    <div
                                        key={item?.id}
                                        className="cursor-pointer shadow flex flex-col hover:text-[var(--mainColor)] transition-all"
                                        onClick={() => {
                                            if (selectedCourse) {
                                                handleAddOpenTypes(item?.id, selectedCourse);
                                            }
                                        }}
                                    >
                                        <div key={item?.id} className="flex-1 py-2 px-2 flex gap-1 items-center">
                                            <i className={`${item?.icon}`}></i>
                                            <b>{item.title}</b>
                                        </div>
                                        <small className="px-2">{item?.description}</small>
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
