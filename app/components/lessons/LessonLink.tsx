'use client';

import { lessonSchema } from '@/schemas/lessonSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NotFound } from '../NotFound';
import LessonCard from '../cards/LessonCard';
import { addLink, deleteLink, fetchElement, stepSequenceUpdate, updateLink } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import FormModal from '../popUp/FormModal';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import { contentType } from '@/types/contentType';
import { linkValueType } from '@/types/linkValueType';

export default function LessonLink({ element, content, fetchPropElement, clearProp }: { element: mainStepsType; content: any; fetchPropElement: (id: number) => void; clearProp: boolean }) {
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [editingLesson, setEditingLesson] = useState<linkValueType>({ title: '', description: '', url: '' });
    const [visible, setVisisble] = useState(false);
    const [contentShow, setContentShow] = useState(false);
    // doc
    const [link, setLink] = useState<contentType>();
    const [linkValue, setLinkValue] = useState<linkValueType>({
        title: '',
        description: '',
        url: ''
    });
    const [docShow, setDocShow] = useState<boolean>(false);

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [additional, setAdditional] = useState<{ doc: boolean; link: boolean; video: boolean }>({ doc: false, link: false, video: false });
    const [selectId, setSelectId] = useState<number | null>(null);
    const [skeleton, setSkeleton] = useState(false);

    const clearFile = () => {
        setAdditional((prev) => ({ ...prev, link: false }));
    };

    const clearValues = () => {
        clearFile();
        setLinkValue({ title: '', description: '', url: '' });
        setEditingLesson({ title: '', description: '', url: '' });
        setSelectId(null);
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
        setSelectId(id);
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

    const handleAddLink = async () => {
        setProgressSpinner(true);
        const data = await addLink(linkValue, element.lesson_id, element.type_id, element.id);
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

    // delete document
    const handleDeleteLink = async (id: number) => {
        const data = await deleteLink(Number(link?.lesson_id), id, element.type.id, element.id);
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

    // update document
    const handleUpdateLink = async () => {
        setSkeleton(true);
        const data = await updateLink(editingLesson, link?.lesson_id ? Number(link?.lesson_id) : null, Number(selectId), element.type.id, element.id);

        const steps: { id: number; step: number | null }[] = [{ id: element?.id, step: editingLesson?.stepPos || 0 }];
        const secuence = await stepSequenceUpdate(link?.lesson_id ? Number(link?.lesson_id) : null, steps);
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
            setLinkValue({ title: '', description: '', url: '' });
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

    const linkSection = () => {
        return (
            <div className="py-1 sm:py-3 flex flex-col items-center gap-4">
                {contentShow ? (
                    <div className="w-full flex flex-col items-center gap-4 py-2">
                        <div className="w-full flex flex-wrap gap-4">
                            {docShow ? (
                                <NotFound titleMessage={'Заполните поля для добавления урока'} />
                            ) : skeleton ? (
                                <div className="w-full">
                                    <GroupSkeleton count={1} size={{ width: '100%', height: '6rem' }} />
                                </div>
                            ) : (
                                link && (
                                    <LessonCard
                                        status="working"
                                        onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                        onDelete={(id: number) => handleDeleteLink(id)}
                                        cardValue={{ title: link?.title, id: link.id, desctiption: link?.description || '', type: 'link', url: link.url, document: link.document }}
                                        cardBg={'#ddc4f51a'}
                                        type={{ typeValue: 'link', icon: 'pi pi-link' }}
                                        typeColor={'var(--mainColor)'}
                                        lessonDate={new Date(link.created_at).toISOString().slice(0, 10)}
                                        urlForPDF={() => {}}
                                        urlForDownload={''}
                                    />
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col justify-center gap-2">
                        <div className="w-full flex flex-col items-center">
                            <InputText
                                id="usefulLink"
                                type="url"
                                placeholder={'Загрузить ссылку'}
                                value={linkValue.url}
                                className="w-full"
                                onChange={(e) => {
                                    setLinkValue((prev) => ({ ...prev, url: e.target.value }));
                                    setValue('usefulLink', e.target.value, { shouldValidate: true });
                                }}
                            />
                            <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>
                        </div>
                        <div>
                            <InputText
                                id="title"
                                type="text"
                                placeholder={'Название'}
                                className="w-full"
                                value={linkValue.title}
                                onChange={(e) => {
                                    setLinkValue((prev) => ({ ...prev, title: e.target.value }));
                                    setValue('title', e.target.value, { shouldValidate: true });
                                }}
                            />
                            <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                        </div>
                        {additional.link && <InputText placeholder="Описание" value={linkValue.description} onChange={(e) => setLinkValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />}

                        <div className="flex relative">
                            {/* <Button disabled={!!errors.title || !docValue.file} label="Сактоо" onClick={handleAddDoc} /> */}
                            <div className="absolute">
                                <span className="cursor-pointer ml-1 text-[13px] sm:text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, link: !prev.link }))}>
                                    Дополнительно {additional.link ? '-' : '+'}
                                </span>
                            </div>
                            <div className="w-full flex gap-1 justify-center items-center mt-4 sm:m-0">
                                <Button label="Сохранить" disabled={progressSpinner || !linkValue.title.length || !!errors.title || !linkValue.url.length} onClick={() => handleAddLink()} />
                                {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (content) {
            setContentShow(true);
            setLink(content);
        } else {
            setContentShow(false);
        }
    }, [content]);

    useEffect(() => {
        setLinkValue({ title: '', description: '', url: '' });
    }, [element]);

    return (
        <div>
            <FormModal title={'Обновить урок'} fetchValue={() => handleUpdateLink()} clearValues={clearValues} visible={visible} setVisible={setVisisble} start={false} footerValue={{ footerState: true, reject: 'Назад', next: 'Сохранить' }}>
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
                    <div className="w-full flex flex-col items-center">
                        <InputText
                            id="usefulLink"
                            type="url"
                            placeholder={'Загрузить ссылку'}
                            value={editingLesson.url}
                            className="w-full"
                            onChange={(e) => {
                                setEditingLesson((prev) => ({ ...prev, url: e.target.value }));
                                setValue('usefulLink', e.target.value, { shouldValidate: true });
                            }}
                        />
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>
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
                    {additional.link && <InputText placeholder="Описание" value={editingLesson.description} onChange={(e) => setEditingLesson((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />}

                    <div className="flex relative">
                        {/* <Button disabled={!!errors.title || !editingLesson.file} label="Сохранить" onClick={handleAddDoc} /> */}
                        <div className="absolute">
                            <span className="cursor-pointer ml-1 text-[13px] sm:text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, link: !prev.link }))}>
                                Дополнительно {additional.link ? '-' : '+'}
                            </span>
                        </div>
                    </div>
                </div>
            </FormModal>
            {!clearProp && linkSection()}
        </div>
    );
}
