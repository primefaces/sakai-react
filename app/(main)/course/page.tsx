'use client';

import FormModal from '@/app/components/popUp/FormModal';
import { addCourse, deleteCourse, fetchCourseInfo, fetchCourses, publishCourse, updateCourse, veryfyCourse } from '@/services/courses';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useRef, useState } from 'react';
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
import { mainStreamsType } from '@/types/mainStreamsType';
import { InputSwitch } from 'primereact/inputswitch';

export default function Course() {
    const { setMessage, setGlobalLoading, course, setCourses, contextFetchCourse, setMainCourseId } = useContext(LayoutContext);
    const [coursesValue, setValueCourses] = useState<myMainCourseType[]>([]);
    const [hasCourses, setHasCourses] = useState(false);
    const [courseValue, setCourseValue] = useState<CourseCreateType>({ title: '', description: '', video_url: '', image: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [forStart, setForStart] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [forStreamCount, setForStreamCount] = useState<mainStreamsType[]>([]);
    const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>({
        currentPage: 1,
        total: 0,
        perPage: 0
    });
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [imageState, setImageState] = useState<string | null>(null);
    const [pendingChanges, setPendingChanges] = useState<{ status: boolean }[]>([]);
    const [editingLesson, setEditingLesson] = useState<CourseCreateType>({
        title: '',
        description: '',
        video_url: '',
        image: '',
        created_at: ''
    });

    const [forStreamId, setForStreamId] = useState<{ id: number | null; title: string } | null>(null);
    const [globalCourseId, setGlobalCourseId] = useState<{ id: number | null; title: string | null } | null>(null);
    const [pageState, setPageState] = useState<number>(1);

    const showError = useErrorMessage();

    const media = useMediaQuery('(max-width: 640px)');
    const tableMedia = useMediaQuery('(max-width: 577px)');

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
        console.log(forSentStreams);
        const data = await veryfyCourse(forSentStreams);
        if (data.success) {
            contextFetchCourse(1);
            setPageState(1);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            console.log(data);
            setSkeleton(false);
            if (data.response.data.cause) {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка!', detail: data.response.data.cause }
                });
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
                        image: ''
                    }
            );
            // query
        } else {
            setCourseValue((prev) => ({
                ...prev,
                image: ''
            }));
        }
    };

    const handleFetchCourse = async (page = 1) => {
        const data = await fetchCourses(page, 0);
        toggleSkeleton();

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
    };

    const handleAddCourse = async () => {
        const data = await addCourse(courseValue);
        if (data?.success) {
            toggleSkeleton();
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
    };

    const handleDeleteCourse = async (id: number) => {
        const data = await deleteCourse(id);
        if (data?.success) {
            toggleSkeleton();
            setGlobalCourseId(null);
            // handleFetchCourse();
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
                showError(data.response.status);
            }
        }
    };

    const clearValues = () => {
        setImageState(null);
        setCourseValue({ title: '', description: '', video_url: '', image: '' });
        setEditingLesson({ title: '', description: '', video_url: '', image: '', created_at: '' });
        setEditMode(false);
        setSelectedCourse(null);
    };

    const handleUpdateCourse = async () => {
        const data = await updateCourse(selectedCourse, editingLesson);
        if (data?.success) {
            toggleSkeleton();
            // handleFetchCourse();
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
                showError(data.response.status);
            }
        }
    };

    const onSelect = (e: FileUploadSelectEvent & { files: FileWithPreview[] }) => {
        if (e.files.length > 0) {
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

    const topRef = useRef<HTMLDivElement>(null);
    const [isTall, setIsTall] = useState(false);

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
        if (course?.data.length > 5) {
            setIsTall(true);
        } else {
            setIsTall(false);
        }
    }, [course]);

    useEffect(() => {
        const title = editMode ? editingLesson.title.trim() : courseValue.title.trim();
        if (title.length > 0) {
            setForStart(false);
        } else {
            setForStart(true);
        }
    }, [courseValue.title, editingLesson.title]);

    useEffect(() => {
        console.log('Курсы ', coursesValue);

        if (coursesValue?.length < 1) {
            setHasCourses(true);
        } else {
            if (globalCourseId != null) {
                const exists = coursesValue.some((c: { id: number }) => c.id === globalCourseId.id);
                if (exists) {
                    setForStreamId({ id: globalCourseId.id, title: globalCourseId.title || '' });
                } else {
                    setForStreamId({ id: coursesValue[0].id, title: coursesValue[0].title });
                }
            } else {
                setForStreamId({ id: coursesValue[0].id, title: coursesValue[0].title });
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
                                <Redacting redactor={getRedactor('null', shablonData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse })} textSize={'14px'} />
                            </div>
                        )}
                    </div>

                    <div>{imageBodyTemplate(shablonData)}</div>

                    <div>
                        <div className="flex gap-1 items-center">
                            <span className="text-[var(--mainColor)] text-sm">Публикация: </span>
                            {shablonData.is_published ? <i className="pi pi-check text-md sm:text-lg text-[var(--greenColor)]"></i> : <i className="pi pi-times text-md sm:text-lg text-[var(--redColor)]"></i>}
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
                            <Redacting redactor={getRedactor('null', shablonData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse })} textSize={'14px'} />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        console.log(forStreamCount);
    }, [forStreamCount]);

    const imagestateStyle = imageState || editingLesson.image ? 'flex gap-1 items-center justify-between flex-col sm:flex-row' : '';
    const imageTitle = useShortText(typeof editingLesson.image === 'string' ? editingLesson.image : '', 20);

    return (
        <div className="main-bg">
            {/* modal window */}
            <FormModal title={editMode ? 'Обновить курс' : 'Добавить'} fetchValue={editMode ? handleUpdateCourse : handleAddCourse} clearValues={clearValues} visible={formVisible} setVisible={setFormVisible} start={forStart}>
                <div className="flex flex-col gap-1">
                    {/* <div className="flex flex-col lg:flex-row gap-1 justify-around items-center"> */}
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <label className="block text-900 font-medium text-[16px] md:text-lg mb-1 md:mb-2">Название</label>
                        <div className="w-full flex gap-2 items-center">
                            <InputText
                                value={editMode ? editingLesson.title || '' : courseValue.title}
                                placeholder="Название обязательно"
                                disabled={progressSpinner === true ? true : false}
                                className="w-full"
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
                            {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-center justify-center">
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
                    </div>
                    {/* </div> */}

                    {/* <div className="flex flex-col lg:flex-row gap-1 justify-around items-center"> */}
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <label className="block text-900 font-medium text-[16px] md:text-lg mb-1 md:mb-2">Описание</label>
                        <div className="w-full flex gap-2 justify-center items-center">
                            <InputTextarea
                                autoResize
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
                    {/* </div> */}

                    <div className={imagestateStyle}>
                        {/* {imagestateStyle && ( */}
                        <div className="w-1/2 order-2 sm:order-1 max-h-[170px] max-w-[300px] overflow-hidden flex justify-center items-center">
                            {/* {typeof imageState === 'string' && <img className="w-full object-cover" src={editMode ? typeof editingLesson.image === 'string' ? editingLesson.image : '' : imageState} alt="" />} */}
                            {typeof imageState === 'string' ? <img className="w-full object-cover" src={imageState} /> : <img className="w-full object-cover" src={typeof editingLesson.image === 'string' ? editingLesson.image : ''} />}
                        </div>
                        {/* )} */}
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
                            <div className="flex items-center gap-1">{(editingLesson.image || imageState) && <Button icon={'pi pi-trash'} onClick={clearFile} />}</div>
                        </div>
                    </div>
                </div>
            </FormModal>

            <div className="flex justify-between gap-3">
                <div className="w-full">
                    {media ? (
                        <>
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
                                            <NotFound titleMessage={'Нажмите на кнопку добавить курс'} />
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
                                    <div className="w-full sm:w-1/2">
                                        <StreamList
                                            callIndex={activeIndex}
                                            courseValue={forStreamId}
                                            isMobile={true}
                                            insideDisplayStreams={(value) => setForStreamCount(value)}
                                            fetchprop={() => contextFetchCourse(pageState)}
                                            toggleIndex={() => setActiveIndex(0)}
                                        />
                                    </div>
                                </TabPanel>
                            </TabView>
                        </>
                    ) : (
                        <div className="w-full flex justify-between items-start gap-2 xl:gap-5">
                            <div className="py-4 w-2/3">
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
                                    <NotFound titleMessage={'Нажмите на кнопку добавить курс'} />
                                ) : (
                                    <>
                                        {skeleton ? (
                                            <GroupSkeleton count={coursesValue?.length} size={{ width: '100%', height: '4rem' }} />
                                        ) : (
                                            <div>
                                                <div ref={topRef}>
                                                    <DataTable value={coursesValue} dataKey="id" key={JSON.stringify(forStreamId)} responsiveLayout="stack" breakpoint="960px" rows={5} className="my-custom-table">
                                                        <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px' }}></Column>
                                                        <Column body={imageBodyTemplate}></Column>

                                                        <Column
                                                            field="title"
                                                            header="Название"
                                                            // style={{ width: '80%' }}
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
                                                                >
                                                                    {rowData.title}
                                                                </Link>
                                                            )}
                                                        ></Column>
                                                        <Column
                                                            header={() => <div className="text-[13px]">На рассмотр.</div>}
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
                                                            header="Публикация"
                                                            style={{ margin: '0 3px', textAlign: 'center' }}
                                                            body={(rowData) =>
                                                                rowData.is_published ? <i className="pi pi-check text-md sm:text-lg text-[var(--greenColor)]"></i> : <i className="pi pi-times text-md sm:text-lg text-[var(--redColor)]"></i>
                                                            }
                                                        ></Column>
                                                        <Column
                                                            header="Потоки"
                                                            style={{ margin: '0 3px', textAlign: 'center' }}
                                                            body={(rowData) => (
                                                                <>
                                                                    <label className="custom-course-radio">
                                                                        <input
                                                                            type="radio"
                                                                            name="radio"
                                                                            onChange={() => {
                                                                                const newValue = forStreamId?.id === rowData.id ? null : { id: rowData.id, title: rowData.title };
                                                                                // Устанавливаем состояние
                                                                                setGlobalCourseId(newValue);
                                                                                setForStreamId(newValue);
                                                                            }}
                                                                            checked={forStreamId?.id === rowData.id}
                                                                        />
                                                                        <span className="radio-course-mark rounded">Связан ({rowData.connects_count})</span>
                                                                    </label>
                                                                </>
                                                            )}
                                                        ></Column>
                                                        <Column
                                                            className="flex items-center justify-center h-[60px] border-b-0"
                                                            body={(rowData) => (
                                                                <div className="flex items-center gap-2" key={rowData.id}>
                                                                    <Redacting redactor={getRedactor('null', rowData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse })} textSize={'14px'} />
                                                                </div>
                                                            )}
                                                        />
                                                    </DataTable>
                                                </div>
                                                <div className={`${isTall ? 'mt-[20px]' : 'mt-[5px]'} shadow-[0px_-11px_5px_-6px_rgba(0,_0,_0,_0.1)]`} style={{ marginTop: isTall ? '20px' : '5px' }}>
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
                            {/* STREAMS SECTION */}
                            <div className="w-1/2">
                                <StreamList
                                    isMobile={false}
                                    callIndex={1}
                                    courseValue={forStreamId?.id ? forStreamId : null}
                                    insideDisplayStreams={(value) => setForStreamCount(value)}
                                    fetchprop={() => contextFetchCourse(pageState)}
                                    toggleIndex={() => {}}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
