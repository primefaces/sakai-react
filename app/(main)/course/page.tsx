'use client';

import FormModal from '@/app/components/popUp/FormModal';
import { addCourse, deleteCourse, fetchCourseInfo, fetchCourses, updateCourse } from '@/services/courses';
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
import { RadioButton } from 'primereact/radiobutton';
import { DataView } from 'primereact/dataview';
import { displayType } from '@/types/displayType';
import { FileWithPreview } from '@/types/fileuploadPreview';

export default function Course() {
    const { setMessage, course, setCourses, contextFetchCourse } = useContext(LayoutContext);
    const [coursesValue, setValueCourses] = useState<myMainCourseType[]>([]);
    const [hasCourses, setHasCourses] = useState(false);
    const [courseValue, setCourseValue] = useState<CourseCreateType>({ title: '', description: '', video_url: '', image: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [formVisible, setFormVisible] = useState(false);
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
    const [displayStrem, setDisplayStreams] = useState<displayType[]>([]);
    const [visible, setVisisble] = useState(false);

    [
        {
            title: 'dfdj', 
            topic_id: 1,
            lessons: []
        },
        {
            title: 'r', 
            topic_id: 2,
            lessons: []
        },
        {
            title: 't', 
            topic_id: 3,
            lessons: []
        }
    ];

    const [editingLesson, setEditingLesson] = useState<CourseCreateType>({
        title: '',
        description: '',
        video_url: '',
        image: '',
        created_at: ''
    });

    const shablon = [
        {
            created_at: '',
            id: 3,
            image: '',
            status: true,
            title: 'course-1',
            user_id: 2
        },
        {
            created_at: '',
            id: 4,
            image: '',
            status: true,
            title: 'course-2',
            user_id: 2
        },
        {
            created_at: '',
            id: 5,
            image: '',
            status: true,
            title: 'course-3',
            user_id: 2
        },
        {
            created_at: '',
            id: 6,
            image: '',
            status: true,
            title: 'course-4',
            user_id: 2
        },
        {
            created_at: '',
            id: 7,
            image: '',
            status: true,
            title: 'course-5',
            user_id: 2
        },
        {
            created_at: '',
            id: 8,
            image: '',
            status: true,
            title: 'course-6',
            user_id: 5
        }
    ];

    const [forStreamId, setForStreamId] = useState<{ id: number | null; title: string } | null>(null);

    const showError = useErrorMessage();

    const media = useMediaQuery('(max-width: 640px)');
    const tableMedia = useMediaQuery('(max-width: 577px)');

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
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
                value: { severity: 'error', summary: 'Катаа!', detail: 'Байланышы менен көйгөй' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }

        //  const data = await fetchCourses(page, 0);
        // toggleSkeleton();
        // if (data?.courses) {
        //     setHasCourses(false);
        //     setValueCourses(data.courses.data);
        //     setPagination({
        //         currentPage: data.courses.current_page,
        //         total: data.courses.total,
        //         perPage: data.courses.per_page
        //     });
        // } else {
        //     setHasCourses(true);
        //     setMessage({
        //         state: true,
        //         value: { severity: 'error', summary: 'Катаа!', detail: 'Байланышы менен көйгөй' }
        //     });
        //     if (data?.response?.status) {
        //         showError(data.response.status);
        //     }
        // }
    };

    const handleAddCourse = async () => {
        const data = await addCourse(courseValue);
        if (data?.success) {
            toggleSkeleton();
            // handleFetchCourse();
            contextFetchCourse(1);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Кошуу учурунда катаа кетти' }
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
            // handleFetchCourse();
            contextFetchCourse(1);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өчүрүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа', detail: 'Өчүрүүдө ката кетти' }
            }); // messege - Ошибка при добавлении
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const clearValues = () => {
        console.log('clear');

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
            clearValues();
            setEditMode(false);
            setSelectedCourse(null);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Өзгөртүүдө ката кетти' }
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

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        // handleFetchCourse(page);
        contextFetchCourse(page);
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

    const displayInfo = (value: displayType[]) => {
        setDisplayStreams(value);
    };

    useEffect(() => {
        contextFetchCourse(1);
    }, []);

    useEffect(() => {
        handleFetchCourse();
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
            if (coursesValue?.length > 0) {
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
                console.log('udali', data);

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

    useEffect(() => {
        console.log('Для потока ', forStreamId);
    }, [forStreamId]);

    const itemTemplate = (shablonData: any) => {
        return (
            <div className="col-12">
                <div className={`w-full flex flex-column sm:flex-row align-items-center p-3 gap-3 `}>
                    {/* Номер (rowIndex) можно добавить через внешний счетчик или props, но для DataView это сложнее */}

                    {/* Заголовок */}
                    <div className={`w-full flex-1 ${tableMedia && 'flex items-center gap-1 justify-between'}`}>
                        <div className="font-bold text-md mb-2">
                            <Link href={`/course/${shablonData.id}`}>
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

                    {/* Радиокнопка */}
                    <div className="flex-auto">
                        {/* <RadioButton inputId={`radio-${shablonData.id}`} name="radio" value={shablonData} onChange={() => setForStreamId(shablonData)} checked={forStreamId?.id === shablonData.id} /> */}
                        <label className="custom-radio">
                            <span>Агымга байлоо</span>
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
                            <span className="radio-mark"></span>
                            {/* {Radio(rowData)} */}
                        </label>
                    </div>

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

    const imagestateStyle = imageState || editingLesson.image ? 'flex gap-1 items-center justify-between flex-col sm:flex-row' : '';
    const imageTitle = useShortText(typeof editingLesson.image === 'string' ? editingLesson.image : '', 20);

    return (
        <div className="main-bg">
            {/* modal window */}
            <FormModal title={editMode ? 'Курсту жаңылоо' : 'Кошуу'} fetchValue={editMode ? handleUpdateCourse : handleAddCourse} clearValues={clearValues} visible={formVisible} setVisible={setFormVisible} start={forStart}>
                <div className="flex flex-col gap-1">
                    <div className={imagestateStyle}>
                        {/* {imagestateStyle && ( */}
                        <div className="w-1/2 order-2 sm:order-1 max-h-[170px] max-w-[300px] overflow-hidden flex justify-center items-center">
                            {/* {typeof imageState === 'string' && <img className="w-full object-cover" src={editMode ? typeof editingLesson.image === 'string' ? editingLesson.image : '' : imageState} alt="" />} */}
                            {typeof imageState === 'string' ? <img className="w-full object-cover" src={imageState} /> : <img className="w-full object-cover" src={typeof editingLesson.image === 'string' ? editingLesson.image : ''} />}
                        </div>
                        {/* )} */}
                        <div className={`flex flex-col pag-1 order-1 sm:order-2 items-center justify-center ${imageState && 'w-1/2'}`}>
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Сүрөт кошуу</label>
                            <FileUpload ref={fileUploadRef} mode="basic" chooseLabel="Сүрөт" style={{ fontSize: '12px' }} customUpload name="demo[]" accept="image/*" maxFileSize={1000000} onSelect={onSelect} />
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
                    {/* <div className="flex flex-col lg:flex-row gap-1 justify-around items-center"> */}
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Аталышы</label>
                        <div className="flex gap-2 items-center">
                            <InputText
                                value={editMode ? editingLesson.title || '' : courseValue.title}
                                placeholder="Аталышы талап кылынат"
                                disabled={progressSpinner === true ? true : false}
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
                        <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Видео шилтеме</label>
                        <div className="flex gap-2 items-center">
                            <InputText
                                value={editMode ? editingLesson.video_url || '' : courseValue.video_url}
                                placeholder="https://..."
                                title="Шилтеме https:// менен башталышы шарт!"
                                disabled={progressSpinner === true ? true : false}
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
                        <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Мазмуну</label>
                        <div className="flex gap-2 items-center">
                            <InputTextarea
                                autoResize
                                value={editMode ? editingLesson.description || '' : courseValue.description}
                                disabled={progressSpinner === true ? true : false}
                                rows={5}
                                cols={30}
                                className="w-[300px]"
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
                </div>
            </FormModal>

            <div className="flex justify-between gap-3">
                <div className="w-full">
                    <div className="w-full flex justify-center pt-1">
                        {forStreamId?.title && (
                            <div className="flex flex-col items-center justify-center gap-2 text-[14px]">
                                <div className="w-full flex items-center justify-center gap-2">
                                    <span className="min-w-[14px] w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] block border bg-[var(--greenColor)]"></span>
                                    <span className="text-[16px] sm:text-[18px] font-bold text-[var(--mainColor)] ">
                                        Тандалган курстун аталышы: <span className="text-[#4B4563]">{forStreamId?.title}</span>
                                    </span>
                                </div>
                                <div className="w-full flex items-center justify-center gap-2">
                                    <div className="min-w-[14px] w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] border bg-[yellow]"></div>
                                    <div className="flex flex-col gap-1 ">
                                        {displayStrem?.length < 1 && <span className="text-[13px]">Курска байлоо үчүн агымдарды тандаңыз</span>}
                                        {displayStrem.map((item, idx) => {
                                            if (idx < 1) {
                                                return (
                                                    <>
                                                        <div key={item?.stream_id}>{item?.stream_title}...</div>
                                                    </>
                                                );
                                            }
                                            // <span>{displayStrem.length >= 3 && '...'}</span>
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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
                                    header="Курстар"
                                    className=" p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                                >
                                    {/* mobile table section */}
                                    {/* mobile table section */}
                                    {hasCourses ? (
                                        <>
                                            <div className="flex justify-end">
                                                <Button
                                                    label="Кошуу"
                                                    icon="pi pi-plus"
                                                    onClick={() => {
                                                        setEditMode(false);
                                                        clearValues();
                                                        setFormVisible(true);
                                                    }}
                                                />
                                            </div>
                                            <NotFound titleMessage={'Курс кошуу үчүн кошуу баскычты басыныз'} />
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-full flex flex-col items-center justify-between gap-1">
                                                <Button
                                                    label="Курс кошуу"
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
                                                    label="Агымдар"
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
                                    header="Агымдар"
                                    className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                                >
                                    <div className="w-full sm:w-1/2">
                                        <StreamList callIndex={activeIndex} courseValue={forStreamId} isMobile={true} insideDisplayStreams={(value: displayType[]) => displayInfo(value)} toggleIndex={() => setActiveIndex(0)} />
                                    </div>
                                </TabPanel>
                            </TabView>
                        </>
                    ) : (
                        <div className="w-full flex justify-between items-start gap-2 xl:gap-5">
                            <div className="py-4 w-full">
                                {/* info section */}
                                {skeleton ? (
                                    <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                                ) : (
                                    <div className="flex justify-between items-center mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                                        <h3 className="text-[32px] m-0">Курстар</h3>
                                        <Button
                                            label="Кошуу"
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
                                    <NotFound titleMessage={'Курс кошуу үчүн кошуу баскычты басыныз'} />
                                ) : (
                                    <div>
                                        {skeleton ? (
                                            <GroupSkeleton count={coursesValue?.length} size={{ width: '100%', height: '4rem' }} />
                                        ) : (
                                            <>
                                                <DataTable value={coursesValue} dataKey="id" key={JSON.stringify(forStreamId)} responsiveLayout="stack" breakpoint="960px" rows={5} className="my-custom-table">
                                                    <Column body={(_, { rowIndex }) => rowIndex + 1} header="Номер" style={{ width: '20px' }}></Column>
                                                    <Column
                                                        field="title"
                                                        header="Аталышы"
                                                        style={{ width: '80%' }}
                                                        body={(rowData) => (
                                                            <Link href={`/course/${rowData.id}`} key={rowData.id}>
                                                                {rowData.title}
                                                            </Link>
                                                        )}
                                                    ></Column>

                                                    <Column body={imageBodyTemplate}></Column>

                                                    <Column
                                                        header="Агымга байлоо"
                                                        style={{ margin: '0 3px', textAlign: 'center' }}
                                                        body={(rowData) => (
                                                            <>
                                                                <label className="custom-radio">
                                                                    <input
                                                                        type="radio"
                                                                        name="radio"
                                                                        onChange={() => {
                                                                            const newValue = forStreamId?.id === rowData.id ? null : { id: rowData.id, title: rowData.title };
                                                                            console.log(rowData, forStreamId);

                                                                            // Устанавливаем состояние
                                                                            setForStreamId(newValue);
                                                                        }}
                                                                        checked={forStreamId?.id === rowData.id}
                                                                    />
                                                                    <span className="radio-mark"></span>
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
                                                <Paginator
                                                    first={(pagination.currentPage - 1) * pagination.perPage}
                                                    rows={pagination.perPage}
                                                    totalRecords={pagination.total}
                                                    onPageChange={(e) => handlePageChange(e.page + 1)}
                                                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* STREAMS SECTION */}
                            {/* <div className="w-1/2">
                                <StreamList isMobile={false} callIndex={1} courseValue={forStreamId?.id ? forStreamId : null} insideDisplayStreams={(value: displayType[]) => displayInfo(value)} toggleIndex={() => {}} />
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
