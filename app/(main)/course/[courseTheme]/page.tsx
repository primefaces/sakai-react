'use client';

import ConfirmModal from '@/app/components/popUp/ConfirmModal';
import FormModal from '@/app/components/popUp/FormModal';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { LayoutContext } from '@/layout/context/layoutcontext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { addThemes, deleteTheme, fetchCourseInfo, fetchThemes, updateTheme } from '@/services/courses';
import useErrorMessage from '@/hooks/useErrorMessage';
import { CourseCreateType } from '@/types/courseCreateType';
import { NotFound } from '@/app/components/NotFound';
import Redacting from '@/app/components/popUp/Redacting';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';

export default function CourseTheme() {
    const [hasThemes, setHasThemes] = useState(false);
    const [themes, setThemes] = useState([]);
    const [themeValue, setThemeValue] = useState({ title: '', description: '', video_url: '' });
    const [themeInfo, setThemeInfo] = useState<CourseCreateType>();
    const [selectedCourse, setSelectedCourse] = useState<{ id: number | null }>({ id: null });
    const [formVisible, setFormVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [forStart, setForStart] = useState(true);
    const [skeleton, setSkeleton] = useState(false);
    const [editingThemes, setEditingThemes] = useState<{ title: string }>({
        title: ''
    });

    const { setMessage, contextFetchThemes } = useContext(LayoutContext);

    const { courseTheme } = useParams() as { courseTheme: string };

    const showError = useErrorMessage();

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    const handleFetchThemes = async () => {
        const data = await fetchThemes(Number(courseTheme));

        toggleSkeleton();
        
        contextFetchThemes(Number(courseTheme));
        if (data?.lessons) {
            setHasThemes(false);
            setThemes(data.lessons.data);
        } else {
            setHasThemes(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            }); // messege - Ошибка загрузки курсов
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleFetchInfo = async () => {
        const data = await fetchCourseInfo(Number(courseTheme));

        if (data.success) {
            setThemeInfo(data.course);
        }
    };

    const handleAddTheme = async () => {
        if (themeValue.title.length < 1) {
            return null;
        }
        const data = await addThemes(Number(courseTheme), themeValue.title);
        if (data.success) {
            toggleSkeleton();
            handleFetchThemes();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при добавлении' }
            }); // messege - Ошибка при добавлении
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const handleDeleteCourse = async (id: number) => {
        const data = await deleteTheme(id);
        if (data.success) {
            toggleSkeleton();
            handleFetchThemes();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өчүрүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при удалении' }
            }); // messege - Ошибка при добавлении
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const handleUpdateTheme = async () => {
        
        const data = await updateTheme(Number(courseTheme), selectedCourse.id, editingThemes.title);
        if (data.success) {
            toggleSkeleton();
            handleFetchThemes();
            clearValues();
            setEditMode(false);
            setSelectedCourse({ id: null });
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при при изменении темы', detail: 'Заполняйте поля правильно' }
            }); // messege - Ошибка при изменении курса
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const edit = (rowData: number | null) => {

        setEditMode(true);
        setSelectedCourse({id: rowData});
        // setThemeValue({ title: rowData.title || '' });
        setFormVisible(true);
    };

    const clearValues = () => {
        setThemeValue({ title: '', description: '', video_url: '' });
        setEditingThemes({ title: ''});
        setEditMode(false);
        setSelectedCourse({ id: null });
    };

    useEffect(() => {
        handleFetchInfo();
        handleFetchThemes();
    }, []);

    useEffect(() => {
        const handleShow = async () => {
            const data:{lessons: {data: {id: number, title: string}[]}} = await fetchThemes(Number(courseTheme));
            
            if (data?.lessons) {
                console.log('rab');
                
                const forEditing = data.lessons.data.find(item => item.id === selectedCourse.id)
                
                setEditingThemes({
                    title: forEditing?.title || '',
                });
            }
        };

        if (editMode) {
            handleShow();
        }
    }, [editMode]);
    
    useEffect(() => {
        const title = editMode ? editingThemes.title.trim() : themeValue.title.trim();
        if (title.length > 0) {
            setForStart(false);
        } else {
            setForStart(true);
        }
    }, [themeValue.title, editingThemes.title]);

    useEffect(() => {
        themes.length < 1 ? setHasThemes(true) : setHasThemes(false);
    }, [themes]);

    const titleInfoClass = `${!themeInfo?.image ? 'items-center' : 'w-full'} ${themeInfo?.image ? 'w-1/2' : 'w-full'}`;
    const titleImageClass = `${themeInfo?.image ? 'md:w-1/3' : ''}`;

    return (
        <div className="main-bg">
            {/* title section */}
            <div className={`bg-[var(--titleColor)] flex flex-col gap-3 md:flex-row items-center p-10 mt-2 mb-10 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]`}>
                <div className={`${titleInfoClass} flex flex-col justify-center gap-2 text-white`}>
                    <h3 className="text-[36px] font-bold m-0" style={{ color: 'white' }}>
                        {themeInfo?.title}
                    </h3>
                    <p style={{ color: 'white' }}>{themeInfo?.description}</p>
                    <div className="flex items-center gap-2">
                        <i className={'pi pi-clock text-blue-500'}></i>
                        <span>{themeInfo?.created_at}</span>
                    </div>
                </div>

                <div className={`${titleImageClass}`}>
                    <img src={String(themeInfo?.image)} />
                </div>
            </div>

            {/* add button*/}
            <Button
                label="Кошуу"
                icon="pi pi-plus"
                onClick={() => {
                    setEditMode(false);
                    clearValues();
                    setFormVisible(true);
                }}
            />

            {/* modal sectoin */}
            <FormModal title={editMode ? 'Теманы жаңылоо' : 'Кошуу'} fetchValue={editMode ? handleUpdateTheme : handleAddTheme} clearValues={clearValues} visible={formVisible} setVisible={setFormVisible} start={forStart}>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col lg:flex-row gap-1 justify-around items-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Аталышы</label>
                            <InputText
                                value={editMode ? editingThemes.title : themeValue.title}
                                onChange={(e) => {
                                    // setCourseTitle(e.target.value);
                                    editMode
                                        ? setEditingThemes((prev) => ({
                                              ...prev,
                                              title: e.target.value
                                          }))
                                        : setThemeValue((prev) => ({
                                              ...prev,
                                              title: e.target.value
                                          }));
                                }}
                            />
                        </div>
                    </div>
                </div>
            </FormModal>    

            {/* table section */}
            {hasThemes ? (
                <NotFound titleMessage={'Тема кошуу үчүн кошуу баскычты басыныз'} />
            ) : (
                <div className="py-4">
                    {skeleton ? (
                        <GroupSkeleton count={themes.length} size={{ width: '100%', height: '4rem' }} />
                    ) : (
                        <DataTable value={themes} breakpoint="960px" className="my-custom-table">
                            <Column body={(_, { rowIndex }) => rowIndex + 1} header="Номер" style={{ width: '20px' }}></Column>
                            <Column field="title" header="Темалар" className="w-full" body={(rowData) => <Link href={`/course/${courseTheme}/${rowData.id}`}>{rowData.title}</Link>}></Column>

                            <Column
                                header=""
                                className="flex justify-center"
                                body={(rowData) => (
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-2" key={rowData.id}>
                                            <Redacting redactor={getRedactor('null', rowData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse })} textSize={'14px'} />
                                        </div>
                                    </div>
                                )}
                            />
                        </DataTable>
                    )}
                </div>
            )}
        </div>
    );
}
