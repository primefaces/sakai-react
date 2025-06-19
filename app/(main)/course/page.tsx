'use client';

import FormModal from '@/app/components/popUp/FormModal';
import { addCourse, deleteCourse, fetchCourseInfo, fetchCourses, updateCourse } from '@/services/courses';
import { getToken } from '@/utils/auth';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ConfirmModal from '@/app/components/popUp/ConfirmModal';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import Link from 'next/link';
import { CourseCreateType } from '@/types/courseCreateType';
import { CourseType } from '@/types/courseType';
import { Paginator } from 'primereact/paginator';

export default function Course() {
    const [courses, setCourses] = useState([]);
    const [courseValue, setCourseValue] = useState<CourseCreateType>({ title: '', description: '', video_url: '', image: '' });
    const [courseTitle, setCourseTitle] = useState('');
    const [video_url, setVideo_url] = useState('');
    const [description, setDesciption] = useState('');
    // const fileUploadRef = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [image, setImage] = useState<File | string>('');
    const [forStart, setForStart] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [courseCash, setCourseCash] = useState<{ [key: number]: any[] }>({});
    const [pagination, setPagination] = useState({
        currentPage: 1,
        total: 0,
        perPage: 0
    });

    const { setMessage } = useContext(LayoutContext);

    const fetchData = async (page = 1) => {
        console.log('Запрашиваем курсы...');

        const token = getToken('access_token');
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            console.log('Номер запрашиваемой страницы ', page);

            const res = await fetch(`http://api.mooc.oshsu.kg/public/api/v1/teacher/courses?page=${Number(page)}&limit=3`, {
                headers
            });
            const data = await res.json();

            if (data.courses) {
                setCourses(data.courses.data);
                setPagination({
                    currentPage: data.courses.current_page,
                    total: data.courses.total,
                    perPage: data.courses.per_page
                });
                localStorage.setItem('lastPage', JSON.stringify(page));
                setCourseCash((prev) => ({ ...prev, [page]: data.courses.data }));
            } else {
                localStorage.removeItem('lastPage');
                setCourseCash({});
                setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при добавлении' }
            }); // messege - Ошибка при добавлении
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            localStorage.removeItem('lastPage');
            setCourseCash({});
        }
    };

    const handleAddCourse = async () => {
        if (courseValue.title.length < 1) {
            alert('hi');
            return null;
        }
        const token = getToken('access_token');
        const data = await addCourse(token, courseValue);
        if (data.success) {
            toggleSkeleton();
            fetchData();
            setCourseCash({});
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при добавлении' }
            }); // messege - Ошибка при добавлении
        }
    };

    const handleDeleteCourse = async (id: number) => {
        const token = getToken('access_token');

        const data = await deleteCourse(token, id);
        if (data.success) {
            toggleSkeleton();
            fetchData();
            setCourseCash({});
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өчүрүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при удалении' }
            }); // messege - Ошибка при добавлении
        }
    };

    const handleUpdateCourse = async () => {
        const token = getToken('access_token');

        const data = await updateCourse(token, selectedCourse, courseValue);
        if (data.success) {
            toggleSkeleton();
            fetchData();
            clearValues();
            setEditMode(false);
            setSelectedCourse(null);
            setCourseCash({});
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при при изменении курса', detail: 'Заполняйте поля правильно' }
            }); // messege - Ошибка при изменении курса
        }
    };

    const clearValues = () => {
        setCourseValue({ title: '', description: '', video_url: '', image: '' });
        setCourseTitle('');
        setVideo_url('');
        setDesciption('');
        // fileUploadRef.current = null;
        setEditMode(false);
        setSelectedCourse(null);
        setCourseCash({});
    };

    const onSelect = (e: FileUploadSelectEvent) => {
        setImage(e.files[0]); // сохраняешь файл

        setCourseValue((prev) => ({
            ...prev,
            image: e.files[0]
        }));
    };

    const imageBodyTemplate = (product: CourseType) => {
        const image = product.image;

        if (typeof image === 'string') {
            return (
                <div className="flex justify-center" key={product.id}>
                    <img src={image} alt="Course image" className="w-4rem shadow-2 border-round" />
                </div>
            );
        }

        return (
            <div className="flex justify-center" key={product.id}>
                <img src={'/layout/images/no-image.jpg'} alt="Course image" className="w-4rem shadow-2 border-round" />
            </div>
        );
    };

    const getConfirmOptions = (id: number) => ({
        message: 'Сиз чын эле өчүрүүнү каалайсызбы??',
        header: 'Өчүрүү',
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger',
        acceptLabel: 'Кийинки кадам', // кастомная надпись для "Yes"
        rejectLabel: 'Артка',
        accept: () => handleDeleteCourse(id),
        reject: () => console.log('Удаление отменено')
    });

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        console.log(courseCash, courseCash[page]);

        if (page in courseCash) {
            setCourses(courseCash[page]);
            setPagination((prev) => ({ ...prev, currentPage: page }));
        } else {
            fetchData(page);
        }
    };

    useEffect(() => {
        const title = courseTitle.trim();
        if (title.length > 0) {
            setForStart(false);
        } else {
            setForStart(true);
        }
    }, [courseTitle]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log('Курсы ', courses);
    }, [courses]);

    useEffect(() => {
        console.log('pagination ', pagination);
    }, [pagination]);

    return (
        <div>
            <FormModal title={editMode ? 'Курсту жаңылоо' : 'Кошуу'} fetchValue={editMode ? handleUpdateCourse : handleAddCourse} clearValues={clearValues} visible={formVisible} setVisible={setFormVisible} start={forStart}>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col lg:flex-row gap-1 justify-around items-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Аталышы</label>
                            <InputText
                                value={courseTitle}
                                placeholder="Аталышы талап кылынат"
                                onChange={(e) => {
                                    setCourseTitle(e.target.value);
                                    setCourseValue((prev) => ({
                                        ...prev,
                                        title: e.target.value
                                    }));
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Видео шилтеме</label>
                            <InputText
                                value={video_url}
                                placeholder="https://..."
                                title="Шилтеме https:// менен башталышы шарт!"
                                onChange={(e) => {
                                    setVideo_url(e.target.value);
                                    setCourseValue((prev) => ({
                                        ...prev,
                                        video_url: e.target.value
                                    }));
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-1 justify-around items-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Мазмуну</label>
                            <InputTextarea
                                autoResize
                                value={description}
                                rows={5}
                                cols={30}
                                onChange={(e) => {
                                    setDesciption(e.target.value);
                                    setCourseValue((prev) => ({
                                        ...prev,
                                        description: e.target.value
                                    }));
                                }}
                            />
                        </div>

                        <div className="flex flex-col pag-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Сүрөт кошуу</label>
                            <FileUpload mode="basic" customUpload name="demo[]" accept="image/*" maxFileSize={1000000} onSelect={onSelect} />
                            {courseValue.image ? (
                                <div className="mt-2 text-sm text-gray-700">
                                    Сүрөт: <b className="text-[12px]">{courseValue.image.name || courseValue.image}</b>
                                </div>
                            ) : (
                                <b className="text-[12px] text-red-500">jpeg, png, jpg</b>
                            )}
                        </div>
                    </div>
                </div>
            </FormModal>

            <div className="flex justify-between items-center my-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                <div>
                    <h3 className="text-[36px] m-0">Курстар</h3>
                </div>

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

            <div className="py-4">
                {skeleton ? (
                    <GroupSkeleton count={courses.length} size={{ width: '100%', height: '4rem' }} />
                ) : (
                    <>
                        <DataTable value={courses} breakpoint="960px" rows={5} responsiveLayout="stack" className="my-custom-table">
                            <Column field="id" header="Номер" sortable style={{ width: '30px', textAlign: 'center' }}></Column>
                            <Column field="title" header="Аталышы" className="w-2/3" sortable body={(rowData) => <Link href={`/course/${rowData.id}`} key={rowData.id}>{rowData.title}</Link>}></Column>
                            <Column header="" style={{ width: '80px' }} body={imageBodyTemplate}></Column>
                            <Column
                                header=""
                                className="flex justify-center"
                                body={(rowData) => (
                                    <div className="flex gap-2" key={rowData.id}>
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-rounded bg-blue-400"
                                            onClick={() => {
                                                setEditMode(true);
                                                setSelectedCourse(rowData.id);
                                                setCourseValue({
                                                    title: rowData.title || '',
                                                    description: rowData.description || '',
                                                    video_url: rowData.video_url || '',
                                                    image: rowData.image || ''
                                                });
                                                setCourseTitle(rowData.title);
                                                setVideo_url(rowData.video_url);
                                                setDesciption(rowData.description);
                                                setFormVisible(true);
                                            }}
                                        />
                                        <ConfirmModal confirmVisible={getConfirmOptions(rowData.id)} />
                                        <Link href={`/course/${rowData.id}`}>
                                            <Button className="bg-blue-400" icon="pi pi-arrow-right"></Button>
                                        </Link>
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
        </div>
    );
}
