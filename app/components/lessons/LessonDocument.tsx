'use client';

import { lessonSchema } from '@/schemas/lessonSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import LessonCard from '../cards/LessonCard';
import { getToken } from '@/utils/auth';
import { addDocument, deleteDocument, fetchElement, stepSequenceUpdate, updateDocument } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import FormModal from '../popUp/FormModal';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import { contentType } from '@/types/contentType';

export default function LessonDocument({ element, content, fetchPropElement, clearProp }: { element: mainStepsType; content: any; fetchPropElement: (id: number) => void; clearProp: boolean }) {
    interface docValueType {
        title: string;
        description: string;
        file: File | null;
        document?: string;
        stepPos?: number;
    }

    const router = useRouter();
    const fileUploadRef = useRef<FileUpload>(null);
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [editingLesson, setEditingLesson] = useState<docValueType | null>({ title: 'string', description: '', file: null });
    const [visible, setVisisble] = useState(false);
    const [contentShow, setContentShow] = useState(false);
    const [skeleton, setSkeleton] = useState(false);

    // doc
    const [document, setDocuments] = useState<contentType>();
    const [docValue, setDocValue] = useState<docValueType>({
        title: '',
        description: '',
        file: null
    });
    const [urlPDF, setUrlPDF] = useState('');
    const [PDFVisible, setPDFVisible] = useState<boolean>(false);

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [additional, setAdditional] = useState<{ doc: boolean; link: boolean; video: boolean }>({ doc: false, link: false, video: false });
    const [selectId, setSelectId] = useState<number | null>(null);

    const clearFile = () => {
        fileUploadRef.current?.clear();
        setAdditional((prev) => ({ ...prev, video: false }));
        if (visible) {
            setEditingLesson(
                (prev) =>
                    prev && {
                        ...prev,
                        file: null
                    }
            );
        } else {
            setDocValue((prev) => ({
                ...prev,
                file: null
            }));
        }
    };

    const clearValues = () => {
        clearFile();
        setDocValue({ title: '', description: '', file: null });
        setEditingLesson(null);
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

    const documentView = (
        <>
            <div className=" flex flex-col gap-1">
                <i className="pi pi-times text-2xl cursor-pointer" onClick={() => setPDFVisible(false)}></i>
                <div className="w-full flex flex-col gap-1 items-center justify-center"></div>
            </div>
        </>
    );
    const selectedForEditing = (id: number, type: string) => {
        setSelectId(id);
        setVisisble(true);
        editing();
    };

    const sentToPDF = (url: string) => {
        setUrlPDF(url);
        // if (media) {
        router.push(`/pdf/${url}`);
        // } else {
        // }
    };

    const editing = async () => {
        const data = await fetchElement(element.lesson_id, element.id);

        if (data.success) {
            setEditingLesson({ title: data.content.title, file: null, document: data.content.document, description: data.content.description, stepPos: data?.step?.step });
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

    const handleAddDoc = async () => {
        setProgressSpinner(true);
        const data = await addDocument(docValue, element.lesson_id, element.type_id, element.id);
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
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setProgressSpinner(false);
    };

    // delete document
    const handleDeleteDoc = async (id: number) => {
        // const token = getToken('access_token');
        const data = await deleteDocument(Number(document?.lesson_id), id);
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
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    // update document
    const handleUpdateDoc = async () => {
        setSkeleton(true);
        const token = getToken('access_token');
        const data = await updateDocument(token, document?.lesson_id ? Number(document?.lesson_id) : null, Number(selectId), element.type.id, element.type.id, editingLesson);

        const steps: { id: number; step: number | null }[] = [{ id: element?.id, step: editingLesson?.stepPos || 0 }];
        const secuence = await stepSequenceUpdate(document?.lesson_id ? Number(document?.lesson_id) : null, steps);

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
            setDocValue({ title: '', description: '', file: null });
            setEditingLesson(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при изменении!', detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    const documentSection = () => {
        return (
            <div className="py-1 sm:py-3 flex flex-col items-center gap-4">
                {PDFVisible ? (
                    documentView
                ) : contentShow ? (
                    <div className="w-full flex flex-col items-center gap-4 py-2">
                        <div className="w-full flex flex-wrap gap-4">
                            <>
                                {skeleton ? (
                                    <div className="w-full">
                                        <GroupSkeleton count={1} size={{ width: '100%', height: '6rem' }} />
                                    </div>
                                ) : (
                                    document && (
                                        <LessonCard
                                            status="working"
                                            onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                            onDelete={(id: number) => handleDeleteDoc(id)}
                                            cardValue={{ title: document?.title, id: document.id, desctiption: document?.description || '', type: 'doc', document: document.document }}
                                            cardBg={'#ddc4f51a'}
                                            type={{ typeValue: 'doc', icon: 'pi pi-doc' }}
                                            typeColor={'var(--mainColor)'}
                                            lessonDate={new Date(document.created_at).toISOString().slice(0, 10)}
                                            urlForPDF={() => sentToPDF(document.document || '')}
                                            urlForDownload={document.document_path || ''}
                                        />
                                    )
                                )}
                            </>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col justify-center gap-2">
                        <input
                            type="file"
                            accept="application/pdf"
                            className="border rounded p-1"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const maxSize = 10 * 1024 * 1024;

                                    if (file.size > maxSize) {
                                        setMessage({
                                            state: true,
                                            value: { severity: 'error', summary: 'Файл слишком большой!', detail: 'Разрешено максимум 10 MB.' }
                                        });
                                    } else {
                                        setDocValue((prev) => ({
                                            ...prev,
                                            file: file
                                        }));
                                    }
                                }
                            }}
                        />

                        <div className="w-full">
                            <InputText
                                id="title"
                                type="text"
                                placeholder={'Название'}
                                className="w-full"
                                value={docValue.title}
                                onChange={(e) => {
                                    setDocValue((prev) => ({ ...prev, title: e.target.value }));
                                    setValue('title', e.target.value, { shouldValidate: true });
                                }}
                            />
                            <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                        </div>
                        {additional.doc && <InputText placeholder="Описание" value={docValue.description} onChange={(e) => setDocValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />}

                        <div className="flex relative">
                            {/* <Button disabled={!!errors.title || !docValue.file} label="Сохранить" onClick={handleAddDoc} /> */}
                            <div className="absolute">
                                <span className="cursor-pointer ml-1 text-[13px] sm:text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, doc: !prev.doc }))}>
                                    Дополнительно {additional.doc ? '-' : '+'}
                                </span>
                            </div>
                            <div className="w-full flex gap-1 justify-center items-center mt-4 sm:m-0">
                                <Button
                                    label="Сохранить"
                                    disabled={progressSpinner || !docValue.title.length || !!errors.title || !docValue.file}
                                    onClick={() => {
                                        handleAddDoc();
                                    }}
                                />
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
            setDocuments(content);
        } else {
            setContentShow(false);
        }
    }, [content]);

    useEffect(() => {
        setDocValue({ title: '', description: '', file: null });
    }, [element]);

    return (
        <div>
            <FormModal
                title={'Обновить урок'}
                fetchValue={() => {
                    handleUpdateDoc();
                }}
                clearValues={clearValues}
                visible={visible}
                setVisible={setVisisble}
                start={false}
                footerValue={{ footerState: true, reject: 'Назад', next: 'Сохранить' }}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 items-center justify-center">
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
                        <input
                            type="file"
                            accept="application/pdf"
                            className="border rounded p-1 w-full"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setEditingLesson(
                                        (prev) =>
                                            prev && {
                                                ...prev,
                                                file: file
                                            }
                                    );
                                }
                            }}
                        />
                        {/* <span>{String(editingLesson?.file[0].objectURL)}</span> */}
                        <div className="w-full">
                            <InputText
                                type="text"
                                placeholder="Название"
                                className="w-full"
                                value={editingLesson?.title && editingLesson?.title}
                                onChange={(e) => {
                                    setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                    setValue('title', e.target.value, { shouldValidate: true });
                                }}
                            />
                            <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                        </div>
                        <InputText
                            placeholder="Описание"
                            value={editingLesson?.description !== 'null' ? editingLesson?.description : ''}
                            onChange={(e) => setEditingLesson((prev) => prev && { ...prev, description: e.target.value })}
                            className="w-full"
                        />
                    </div>
                </div>
            </FormModal>
            {!clearProp && documentSection()}
        </div>
    );
}
