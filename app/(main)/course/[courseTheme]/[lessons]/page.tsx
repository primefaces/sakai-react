'use client';

import { useContext, useEffect, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import CKEditorWrapper from '@/app/components/CKEditorWrapper.tsx';
import { Button } from 'primereact/button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { lessonSchema } from '@/schemas/lessonSchema';
import Redacting from '@/app/components/popUp/Redacting';
import { addLesson, deleteLesson, fetchLesson, updateLesson } from '@/services/courses';
import { getToken } from '@/utils/auth';
import { useParams } from 'next/navigation';
import { LayoutContext } from '@/layout/context/layoutcontext';
import useErrorMessage from '@/hooks/useErrorMessage';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import LessonTyping from '@/app/components/lessons/LessonTyping';
import { TabViewChange } from '@/types/tabViewChange';

export default function Lesson() {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [contentShow, setContentShow] = useState<boolean>(true);
    const [textShow, setTextShow] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editingLesson, setEditingLesson] = useState<string | null>(null);
    const [textValue, setTextValue] = useState<{ id: number | null }>({ id: null });
    const { setMessage } = useContext(LayoutContext);

    const showError = useErrorMessage();
    const [sentValues, setSentValues] = useState<string | null>('');

    const params = useParams();
    const courseId = params.courseTheme;
    const lessonId = params.lessons;

    const handleText = (e: string | null) => {
        setSentValues(e);
    };

    useEffect(() => {
        console.log(sentValues);
    }, [sentValues]);

    const {
        register,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(lessonSchema),
        mode: 'onChange'
    });

    const handleFetchLesson = async () => {
        // skeleton = false

        const token = getToken('access_token');
        const data = await fetchLesson('text', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);
        console.log(data);

        if (data.success) {
            if (data?.content?.content) {
                setTextValue({ id: data?.content.id });
                setSentValues(data.content.content);
                setTextShow(true);
            } else {
                setTextShow(false);
            }
        } else {
            setTextShow(false);
            if (data.response.status) {
                showError(data.response.status);
            }
            // skeleton = false
        }
    };

    const handleAddLesson = async () => {
        const token = getToken('access_token');

        const data = await addLesson('text', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, String(sentValues), 'the title');
        if (data.success) {
            handleFetchLesson();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү Кошулдуу!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при добавлении' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const handleDeleteLesson = async () => {
        const token = getToken('access_token');

        const data = await deleteLesson('text', token, Number(courseId), Number(lessonId), textValue.id);
        if (data.success) {
            handleFetchLesson();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өчүрүлдү!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при удалении' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const edit = async () => {
        setTextShow(false);
        setEditMode(true);

        const token = getToken('access_token');
        const data = await fetchLesson('text', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);
        if (data.success) {
            setEditingLesson(data.content.content);
        }
    };

    const cencalEdit = () => {
        handleFetchLesson();
        setEditingLesson('');
        setTextShow(true);
        setEditMode(false);
    };

    const handleUpdateLesson = async () => {
        const token = getToken('access_token');
        const data = await updateLesson('text', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, textValue.id, sentValues);
        console.log(data);

        if (data.success) {
            setEditMode(false);
            setTextShow(true);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при изменении темы' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const handleTabChange = (e: TabViewChange) => {
        console.log(e);

        if (e.index === 0) handleFetchLesson();
        setActiveIndex(e.index);
    };

    return (
        <div>
            {/* header section */}
            <TabView
                onTabChange={(e) => handleTabChange(e)}
                activeIndex={activeIndex}
                className="main-bg"
                pt={{
                    nav: { className: 'flex flex-wrap justify-around' },
                    panelContainer: { className: 'flex-1 pl-4' }
                }}
            >
                {/* CKEDITOR */}
                <TabPanel
                    pt={{
                        headerAction: { className: 'font-italic tab-custom-text' }
                    }}
                    header="Тексттер"
                    leftIcon={'pi pi-pen-to-square mr-1'}
                    className=" p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                >
                    {contentShow && (
                        <div>
                            {textShow ? (
                                <div className="py-4 w-[800px] h-[340px] m-auto p-2 rounded" style={{ boxShadow: '2px 2px 21px -8px rgba(34, 60, 80, 0.2)' }}>
                                    <div className="flex flex-col gap-2 border-b p-1 border-[var(--borderBottomColor)]">
                                        <div className="flex items-center justify-between">
                                            <div className={`flex gap-1 items-center font-bold text-[var(--mainColor)]`}>
                                                <i className={`pi pi-pen-to-square`}></i>
                                                <span>Текст</span>
                                            </div>

                                            <Redacting redactor={getRedactor(textValue.id, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteLesson })} textSize={'14px'} />
                                            {/* <MySkeleton size={{ width: '12px', height: '15px' }} /> */}
                                        </div>
                                        <div className={`flex gap-1 items-center`}>
                                            <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                                            <span>xx-xx-xx</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-[80%] break-words whitespace-normal overflow-scroll">
                                        <div dangerouslySetInnerHTML={{ __html: typeof sentValues === 'string' && sentValues }} />
                                        {/* {sentValues.text} */}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-16 items-center m-0">
                                    {editMode ? (
                                        <>
                                            <CKEditorWrapper insideValue={editingLesson} textValue={(e)=> handleText(e)} />
                                            <div className="flex items-center gap-4">
                                                <Button label="Өзгөртүү" disabled={!sentValues?.length} onClick={handleUpdateLesson} />
                                                <Button label="Артка кайтуу" className="reject-button" onClick={cencalEdit} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <CKEditorWrapper insideValue={null} textValue={handleText} />
                                            <Button label="Сактоо" disabled={!sentValues?.length} onClick={handleAddLesson} />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </TabPanel>

                {/* DOC */}
                <TabPanel
                    pt={{
                        headerAction: { className: 'font-italic tab-custom-text-2' }
                    }}
                    header="Документтер"
                    leftIcon={'pi pi-folder mr-1'}
                    className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                >
                    {contentShow && <LessonTyping mainType="doc" courseId={courseId} lessonId={lessonId} />}
                </TabPanel>

                {/* USEFUL LINKS */}
                <TabPanel
                    pt={{
                        headerAction: { className: 'font-italic tab-custom-text-3' }
                    }}
                    header="Пайдалуу шилтемелер"
                    leftIcon={'pi pi-link mr-1'}
                    className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                >
                    {contentShow && <LessonTyping mainType="link" courseId={courseId} lessonId={lessonId} />}   
                </TabPanel>

                {/* VIDEO */}
                <TabPanel
                    pt={{
                        headerAction: { className: 'font-italic tab-custom-text-4' }
                    }}
                    header="Видео"
                    leftIcon={'pi pi-video mr-1'}
                    className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                >
                    {contentShow && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="flex justify-center">
                                {/* <LessonCard cardValue={'vremenno'} cardBg={'#f1b1b31a'} type={{ typeValue: 'Видео', icon: 'pi pi-video' }} typeColor={'var(--mainColor)'} lessonDate={'xx-xx-xx'} /> */}
                            </div>
                        </div>
                    )}
                </TabPanel>
            </TabView>
        </div>
    );
}
