'use client';

import FormModal from '@/app/components/popUp/FormModal';
import { addCourse, deleteCourse, fetchCourseInfo, fetchCourses, updateCourse } from '@/services/courses';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from 'react';
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

export default function Course() {
    const { setMessage, course, setCourses, contextFetchCourse } = useContext(LayoutContext);
    interface FileWithPreview extends File {
        objectURL?: string;
    }

    const [coursesValue, setValueCourses] = useState<myMainCourseType[]>([]);
    const [hasCourses, setHasCourses] = useState(false);
    const [courseValue, setCourseValue] = useState<CourseCreateType>({ title: '', description: '', video_url: '', image: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [forStart, setForStart] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
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

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
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
        console.log('rabotaet ', e);
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
        } else {
            console.log('noo');
        }
    };

    useEffect(() => {
        console.log(imageState);
    }, [imageState]);

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
        console.log(page);
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
            const data = await fetchCourseInfo(selectedCourse);

            if (data?.success) {
                setEditingLesson({
                    title: data.course.title || '',
                    video_url: data.course.video_url || '',
                    description: data.course.description || '',
                    image: data.course.image
                });
            }
        };

        if (editMode) {
            handleShow();
        }
    }, [editMode]);

    useEffect(() => {
        console.log('Для потока ', forStreamId);
    }, [forStreamId]);

    const imagestateStyle = imageState ? 'flex gap-1 items-center justify-between' : '';

    return (
        <div className="main-bg">
            {/* modal window */}
            <FormModal title={editMode ? 'Курсту жаңылоо' : 'Кошуу'} fetchValue={editMode ? handleUpdateCourse : handleAddCourse} clearValues={clearValues} visible={formVisible} setVisible={setFormVisible} start={forStart}>
                <div className="flex flex-col gap-1">
                    <div className={imagestateStyle}>
                        {imagestateStyle && <div className="w-1/2 max-h-[170px] max-w-[330px] overflow-hidden flex justify-center items-center">{typeof imageState === 'string' && <img className="w-full object-cover" src={imageState} alt="" />}</div>}
                        <div className="flex flex-col pag-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Сүрөт кошуу</label>
                            <FileUpload mode="basic" chooseLabel="Сүрөт" customUpload name="demo[]" accept="image/*" maxFileSize={1000000} onSelect={onSelect} />
                            {courseValue.image || editingLesson.image ? (
                                <div className="mt-2 text-sm text-gray-700 ">
                                    {typeof editingLesson.image === 'string' && (
                                        <>
                                            Сүрөт: <b className="text-[12px] text-center w-[300px]">{editingLesson.image}</b>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <b className="text-[12px] text-red-500">jpeg, png, jpg</b>
                            )}
                        </div>
                    </div>
                    {/* <div className="flex flex-col lg:flex-row gap-1 justify-around items-center"> */}
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Аталышы</label>
                        <InputText
                            value={editMode ? editingLesson.title : courseValue.title}
                            placeholder="Аталышы талап кылынат"
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
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Видео шилтеме</label>
                        <InputText
                            value={editMode ? editingLesson.video_url : courseValue.video_url}
                            placeholder="https://..."
                            title="Шилтеме https:// менен башталышы шарт!"
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
                    </div>
                    {/* </div> */}

                    {/* <div className="flex flex-col lg:flex-row gap-1 justify-around items-center"> */}
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Мазмуну</label>
                        <InputTextarea
                            autoResize
                            value={editMode ? editingLesson.description : courseValue.description}
                            rows={5}
                            cols={30}
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
                    </div>
                    {/* </div> */}
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
                                    header="Курстар"
                                    className=" p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                                >
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
                                        <div className="">
                                            {skeleton ? (
                                                <GroupSkeleton count={coursesValue?.length} size={{ width: '100%', height: '4rem' }} />
                                            ) : (
                                                <div className="flex flex-col gap-2 sm:gap-4">
                                                    <div className="flex">
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

                                                    <DataTable value={coursesValue} dataKey="id" key={JSON.stringify(forStreamId)} breakpoint="960px" rows={5} className="my-custom-table">
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
                                                            style={{ width: '40%' }}
                                                            body={(rowData) => (
                                                                <>
                                                                    <label className="custom-radio">
                                                                        <input
                                                                            type="radio"
                                                                            name="radio"
                                                                            onChange={() => {
                                                                                const newValue = forStreamId?.id === rowData.id ? null : { id: rowData.id, title: rowData.title };
                                                                                // Устанавливаем состояние
                                                                                setForStreamId(newValue);
                                                                            }}
                                                                            checked={forStreamId?.id === rowData.id}
                                                                        />
                                                                        <span className="radio-mark"></span>
                                                                        {/* {Radio(rowData)} */}
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
                                                        // template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                                        template={media ? 'PrevPageLink NextPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </TabPanel>

                                {/* STREAMS MOBILE */}
                                <TabPanel
                                    pt={{
                                        headerAction: { className: 'font-italic' }
                                    }}
                                    header="Потоктор"
                                    className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                                >
                                    <div className="w-full sm:w-1/2">
                                        <StreamList isMobile={true} callIndex={activeIndex} courseValue={forStreamId} />
                                    </div>
                                </TabPanel>
                            </TabView>
                        </>
                    ) : (
                        <div className="w-full flex justify-between items-start gap-2 xl:gap-5">
                            <div className="py-4 w-1/2">
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
                                                <DataTable
                                                    value={coursesValue}
                                                    dataKey="id"
                                                    key={JSON.stringify(forStreamId)}
                                                    responsiveLayout="stack"
                                                    breakpoint="960px"
                                                    rows={5}
                                                    className="my-custom-table"
                                                >
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
                            <div className="w-1/2">
                                <StreamList isMobile={false} callIndex={1} courseValue={forStreamId?.id ? forStreamId : null} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
