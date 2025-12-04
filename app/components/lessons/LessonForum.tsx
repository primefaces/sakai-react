'use client';

import { lessonSchema } from '@/schemas/lessonSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import LessonCard from '../cards/LessonCard';
import { addForum, deleteForum, fetchElement, stepSequenceUpdate, updateForum } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import FormModal from '../popUp/FormModal';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import { contentType } from '@/types/contentType';

export default function LessonForum({ element, content, fetchPropElement, clearProp }: { element: mainStepsType; content: any; fetchPropElement: (id: number) => void; clearProp: boolean }) {
    interface linkValueType {
        title: string;
        description: string;
        url: string;
        stepPos?: number;
    }

    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [editingLesson, setEditingLesson] = useState<linkValueType>({ title: '', description: '', url: '' });
    const [visible, setVisisble] = useState(false);
    const [contentShow, setContentShow] = useState(false);
    // doc
    const [forum, setForum] = useState<contentType>();
    const [forumValue, setForumValue] = useState<linkValueType>({
        title: '',
        description: '',
        url: ''
    });

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [skeleton, setSkeleton] = useState(false);

    const clearValues = () => {
        setForumValue({ title: '', description: '', url: '' });
        setEditingLesson({ title: '', description: '', url: '' });
    };

    // validate
    const {
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(lessonSchema),
        mode: 'onChange'
    });

    const selectedForEditing = (id: number, type: string) => {
        setVisisble(true);
        editing();
    };

    const editing = async () => {
        const data = await fetchElement(element.lesson_id, element.id);

        if (data.success) {
            setEditingLesson({ title: data.content.title, description: data.content.description, url: data.content.url, stepPos: data?.step?.step });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleAddForum = async () => {
        setProgressSpinner(true);
        const data = await addForum(forumValue?.title, element.lesson_id, element.type_id, element.id);
        if (data.success) {
            fetchPropElement(element.id);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при добавлении!', detail: '' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
        setProgressSpinner(false);
    };

    // delete forum
    const handleDeleteForum = async (id: number) => {
        const data = await deleteForum(Number(forum?.lesson_id), id, element.type.id, element.id);
        if (data.success) {
            fetchPropElement(element.id);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно удалено!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при удалении!', detail: '' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    // update forum
    const handleUpdateForum = async () => {
        setSkeleton(true);
        const data = await updateForum(editingLesson?.title, forum?.lesson_id ? Number(forum?.lesson_id) : null, content?.id, element.type.id, element.id);

        const steps: { id: number; step: number | null }[] = [{ id: element?.id, step: editingLesson?.stepPos || 0 }];
        const secuence = await stepSequenceUpdate(forum?.lesson_id ? Number(forum?.lesson_id) : null, steps);
        if (data?.success && secuence.success) {
            setSkeleton(false);
            fetchPropElement(element.id);
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно изменено!', detail: '' }
            });
        } else {
            setSkeleton(false);
            setForumValue({ title: '', description: '', url: '' });
            setEditingLesson({ title: '', description: '', url: '' });
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при изменении!', detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const forumSection = () => {
        return (
            <div className="py-1 sm:py-3 flex flex-col items-center gap-4">
                {contentShow ? (
                    <div className="w-full flex flex-col items-center gap-4 py-2">
                        <div className="w-full flex flex-wrap gap-4">
                            {skeleton ? (
                                <div className="w-full">
                                    <GroupSkeleton count={1} size={{ width: '100%', height: '6rem' }} />
                                </div>
                            ) : (
                                forum && (
                                    <LessonCard
                                        status="working"
                                        onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                        onDelete={(id: number) => handleDeleteForum(id)}
                                        cardValue={{ title: forum?.title, id: content?.id, type: 'forum' }}
                                        cardBg={'#ddc4f51a'}
                                        type={{ typeValue: 'forum', icon: 'pi pi-link' }}
                                        typeColor={'var(--mainColor)'}
                                        lessonDate={new Date(forum.created_at).toISOString().slice(0, 10)}
                                        urlForPDF={() => {}}
                                        urlForDownload={''}
                                    />
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col justify-center gap-2">
                        <div>
                            <InputText
                                id="title"
                                type="text"
                                placeholder={'Название темы для обсуждения'}
                                className="w-full"
                                value={forumValue.title}
                                onChange={(e) => {
                                    setForumValue((prev) => ({ ...prev, title: e.target.value }));
                                    setValue('title', e.target.value, { shouldValidate: true });
                                }}
                            />
                            <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                        </div>
                        <div className="w-full flex gap-1 justify-center items-center mt-4 sm:m-0">
                            <Button label="Сохранить" disabled={progressSpinner || !forumValue.title.length || !!errors.title} onClick={() => handleAddForum()} />
                            {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {        
        if (content) {
            setContentShow(true);
            setForum(content);
        } else {
            setContentShow(false);
        }
    }, [content]);

    useEffect(() => {
        setForumValue({ title: '', description: '', url: '' });
    }, [element]);

    return (
        <div>
            <FormModal title={'Обновить форум'} fetchValue={() => handleUpdateForum()} clearValues={clearValues} visible={visible} setVisible={setVisisble} start={false} footerValue={{ footerState: true, reject: 'Назад', next: 'Сохранить' }}>
                <div className="flex flex-col gap-1">
                    <div className="w-full flex flex-col">
                        <span>Позиция шага:</span>
                        <InputText
                            type="number"
                            value={String(editingLesson?.stepPos) || ''}
                            className="w-full p-1"
                            onChange={(e) => {
                                setEditingLesson(
                                    (prev) =>
                                        prev && {
                                            ...prev,
                                            stepPos: Number(e.target.value)
                                        }
                                );
                            }}
                        />
                    </div>

                    <InputText
                        id="title"
                        type="text" 
                        placeholder={'Название'}
                        value={editingLesson.title}
                        onChange={(e) => {
                            setEditingLesson((prev) => ({ ...prev, title: e.target.value }));
                            setValue('title', e.target.value, { shouldValidate: true });
                        }}
                    />
                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                </div>
            </FormModal>
            {!clearProp && forumSection()}
        </div>
    );
}
