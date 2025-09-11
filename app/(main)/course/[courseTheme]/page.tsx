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
import { useParams, usePathname } from 'next/navigation';
import { addThemes, deleteTheme, fetchCourseInfo, fetchThemes, updateTheme } from '@/services/courses';
import useErrorMessage from '@/hooks/useErrorMessage';
import { CourseCreateType } from '@/types/courseCreateType';
import { NotFound } from '@/app/components/NotFound';
import Redacting from '@/app/components/popUp/Redacting';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { ProgressSpinner } from 'primereact/progressspinner';
import useBreadCrumbs from '@/hooks/useBreadCrumbs';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DataView } from 'primereact/dataview';

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
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [editingThemes, setEditingThemes] = useState<{ title: string }>({
        title: ''
    });

    const { setMessage, contextFetchThemes } = useContext(LayoutContext);

    const { courseTheme } = useParams() as { courseTheme: string };

    const teachingBreadCrumb = [
        {
            id: 1,
            url: '/',
            title: '',
            icon: true,
            parent_id: null
        },
        {
            id: 2,
            url: '/course',
            title: 'Курстар',
            parent_id: 1
        },
        {
            id: 3,
            url: `/course/:id`,
            title: 'Темалар',
            parent_id: 2
        },
        {
            id: 4,
            url: '/course/:course_id/:lesson_id',
            title: 'Сабактар',
            parent_id: 3
        },
        {
            id: 5,
            url: '/students/:course_id/:stream_id',
            title: 'Студенттер',
            parent_id: 2
        }
    ];

    const showError = useErrorMessage();
    const pathname = usePathname();
    const breadcrumb = useBreadCrumbs(teachingBreadCrumb, pathname);
    const media = useMediaQuery('(max-width: 640px)');
    const tableMedia = useMediaQuery('(max-width: 577px)');

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
            console.log(data.lessons);

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
        setSelectedCourse({ id: rowData });
        // setThemeValue({ title: rowData.title || '' });
        setFormVisible(true);
    };

    const clearValues = () => {
        setThemeValue({ title: '', description: '', video_url: '' });
        setEditingThemes({ title: '' });
        setEditMode(false);
        setSelectedCourse({ id: null });
    };

    useEffect(() => {
        handleFetchInfo();
        handleFetchThemes();
    }, []);

    useEffect(() => {
        const handleShow = async () => {
            setProgressSpinner(true);
            const data: { lessons: { data: { id: number; title: string }[] } } = await fetchThemes(Number(courseTheme));

            if (data?.lessons) {
                setProgressSpinner(false);
                const forEditing = data.lessons.data.find((item) => item.id === selectedCourse.id);

                setEditingThemes({
                    title: forEditing?.title || ''
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
        const title = editMode ? editingThemes.title.trim() : themeValue.title.trim();
        if (title.length > 0) {
            setForStart(false);
        } else {
            setForStart(true);
        }
    }, [themeValue.title, editingThemes.title]);

    useEffect(() => {
        console.log(themeInfo);
        themes.length < 1 ? setHasThemes(true) : setHasThemes(false);
    }, [themes]);

    const titleInfoClass = `${!themeInfo?.image ? 'items-center' : 'w-full'} ${themeInfo?.image ? 'w-1/2' : 'w-full'}`;
    const titleImageClass = `${themeInfo?.image ? 'md:w-1/3' : ''}`;

    const itemTemplate = (shablonData: any) => {
        return (
            <div className="col-12">
                <div className={`w-full flex flex-column sm:flex-row align-items-center p-2 sm:p-4 gap-3 `}>
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

    return (
        <div className="main-bg">
            {/* title section */}
            <div className="bg-[var(--titleColor)] flex flex-col gap-3 p-5 sm:p-10 pb-3 mt-2 mb-10 ">
                <div className={`flex flex-col gap-3 md:flex-row items-center shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]`}>
                    <div className={`${titleInfoClass} flex flex-col justify-center gap-2 text-white`}>
                        <h3 className="text-[36px] font-bold m-0" style={{ color: 'white' }}>
                            {themeInfo?.title}
                        </h3>
                        <p style={{ color: 'white' }}>{themeInfo?.description}</p>
                        <div className="flex items-center gap-2">
                            <i className={`pi pi-calendar text-white`}></i>
                            <span>{themeInfo?.created_at && new Date(themeInfo?.created_at).toISOString().slice(0, 10)}</span>
                        </div>
                    </div>
                    {themeInfo?.image && (
                        <div className={`${titleImageClass}`}>
                            <img src={String(themeInfo?.image)} />
                        </div>
                    )}
                </div>
                <div className="w-full">{breadcrumb}</div>
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
            <FormModal title={editMode ? 'Сабакты жаңылоо' : 'Кошуу'} fetchValue={editMode ? handleUpdateTheme : handleAddTheme} clearValues={clearValues} visible={formVisible} setVisible={setFormVisible} start={forStart}>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col lg:flex-row gap-1 justify-around items-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Аталышы</label>
                            <div className="flex gap-2 items-center">
                                <InputText
                                    value={editMode ? editingThemes.title || '' : themeValue.title}
                                    disabled={progressSpinner === true ? true : false}
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
                                {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                            </div>
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
                        <div>
                            {themes.map((item: any, index: number) => {
                                return (
                                    <div className="col-12">
                                        <div className={`w-full flex flex-column sm:flex-row align-items-center p-2 sm:p-4 gap-3 `}>
                                            {/* Заголовок */}
                                            <div className={`w-full flex-1 ${tableMedia && 'flex items-center gap-1 justify-between'}`}>
                                                <div className="font-bold text-md mb-2 flex gap-1 items-center">
                                                    <div className="w-[15px] flex flex-col justify-between gap-2 mr-1">
                                                        <div className='flex gap-1'>
                                                            <span className="w-[10px] h-[10px] bg-[var(--mainBgColor)]"></span>
                                                            <span className="w-[10px] h-[10px] bg-[var(--mainBgColor)]"></span>
                                                        </div>
                                                        <div className='flex gap-1'>
                                                            <span className="w-[10px] h-[10px] bg-[var(--mainBgColor)]"></span>
                                                            <span className="w-[10px] h-[10px] bg-[var(--mainBgColor)]"></span>
                                                        </div>
                                                    </div>
                                                    <div>{index + 1}.</div>
                                                    <Link className='max-w-[170px] sm:max-w-full break-all' href={`/course/${courseTheme}/lessonStep/${courseTheme}/${item.id}`}>
                                                        {item.title} {/* Используем subject_name из вашего шаблона */}
                                                    </Link>
                                                </div>
                                                {tableMedia && (
                                                    <div className="flex flex-column sm:flex-row gap-2 sm:mt-0">
                                                        <Redacting redactor={getRedactor('null', item, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse })} textSize={'14px'} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Кнопки действий */}
                                            {!tableMedia && (
                                                <div className="flex flex-column sm:flex-row gap-2 sm:mt-0">
                                                    {/* <Button icon="pi pi-pencil" className="p-button-rounded" onClick={() => edit(item)} /> */}
                                                    {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDeleteCourse(item.id)} /> */}
                                                    <Redacting redactor={getRedactor('null', item, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse })} textSize={'14px'} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
