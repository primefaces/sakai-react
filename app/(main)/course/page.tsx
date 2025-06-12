'use client';

import FormModal from '@/app/components/popUp/FormModal';
import { addCourse, deleteCourse, fetchCourses, updateCourse } from '@/services/courses';
import { getToken } from '@/utils/auth';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ConfirmModal from '@/app/components/popUp/ConfirmModal';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import Link from 'next/link';

export default function Course() {
    const [courses, setCourses] = useState([]);
    const [courseValue, setCourseValue] = useState({ title: '', description: '', video_url: '', image: '' });
    const [courseTitle, setCourseTitle] = useState('');
    const [video_url, setVideo_url] = useState('');
    const [description, setDesciption] = useState('');
    // const fileUploadRef = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [forStart, setForStart] = useState(false);
    const [skeleton, setSkeleton] = useState(false);

    const { setMessage } = useContext(LayoutContext);

    const handleFetchCourses = async () => {
        const token = getToken('access_token');
        const data = await fetchCourses(token);
        console.log(data);

        setCourses(data.courses);
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
            handleFetchCourses();
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

    const handleDeleteCourse = async (id) => {
        const token = getToken('access_token');

        const data = await deleteCourse(token, id);
        if (data.success) {
            toggleSkeleton();
            handleFetchCourses();
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

        const data = await updateCourse(token, selectedCourse.id, courseValue);
        if (data.success) {
            toggleSkeleton();
            handleFetchCourses();
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
    };

    const onSelect = (e) => {
        setImage(e.files[0]); // сохраняешь файл
        console.log(e.files[0]);

        setCourseValue((prev) => ({
            ...prev,
            image: e.files[0]
        }));
    };

    const imageBodyTemplate = (product) => {
        const image = product.image;

        if (typeof image === 'string') {
            return <div className='flex justify-center'>
                <img src={image} alt="Course image" className="w-4rem shadow-2 border-round" />
            </div>
        }

        return <div className='flex justify-center'>
            <img src={'/layout/images/no-image.jpg'} alt="Course image" className="w-4rem shadow-2 border-round" />
        </div>
    };

    const getConfirmOptions = (id) => ({
        message: 'Сиз чын эле өчүрүүнү каалайсызбы??',
        header: 'Өчүрүү',
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger',
        acceptLabel: 'Кийинки кадам',     // кастомная надпись для "Yes"
        rejectLabel: 'Артка', 
        accept: () => handleDeleteCourse(id),
        reject: () => console.log('Удаление отменено')
    });

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    }

    useEffect(() => {
        handleFetchCourses();
    }, []);

    useEffect(() => {
        courseTitle.length > 0 ? setForStart(false) : setForStart(true);
    }, [courseTitle]);

    return (
        <div>
                <FormModal title={editMode ? 'Курсту жаңылоо' : 'Кошуу'} fetchValue={editMode ? handleUpdateCourse : handleAddCourse} clearValues={clearValues} visible={formVisible} setVisible={setFormVisible} start={forStart}>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col lg:flex-row gap-1 justify-around items-center">
                            <div className="flex flex-col gap-1 items-center justify-center">
                                <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Аталышы</label>
                                <InputText
                                    value={courseTitle}
                                    // classname?
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
            <div className='flex justify-between items-center my-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]'>
                <div>
                    <h3 className='text-[36px] m-0'>Курстар</h3>
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
                { skeleton ? <GroupSkeleton count={courses.length} size={{width:'100%', height:'4rem'}}/>
                : <DataTable value={courses} breakpoint="960px" responsiveLayout="stack" className="my-custom-table">
                    <Column field="id" header="Номер" sortable style={{ width: '30px', textAlign: 'center' }}></Column>
                    <Column field="title" header="Аталышы" className='w-2/3' sortable body={(rowData)=> (
                        <Link href={'/'}>{rowData.title}</Link>
                    )}></Column>
                    <Column header="" style={{ width:'80px' }} body={imageBodyTemplate}></Column>
                    
                    <Column
                        header=""
                        className="flex justify-center"
                        body={(rowData) => (
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded bg-blue-400"
                                    onClick={() => {
                                        setEditMode(true);
                                        setSelectedCourse(rowData);
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
                                <ConfirmModal confirmVisible={getConfirmOptions(rowData.id) } />
                                <Button className=" bg-blue-400" icon="pi pi-arrow-right">
                                    <Link href={'#'}></Link>
                                </Button>
                            </div>
                        )}
                    />
                </DataTable>
                }
            </div>
        </div>
    );
}
