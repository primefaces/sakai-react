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
import useMediaQuery from '@/hooks/useMediaQuery';
import { addPractica, deletePractica, fetchElement, stepSequenceUpdate, updatePractica } from '@/services/steps';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import FormModal from '../popUp/FormModal';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { contentType } from '@/types/contentType';
import { useLocalization } from '@/layout/context/localizationcontext';
import { mainStepsType } from '@/types/mainStepType';
import TeacherEditor from '@/app/components/TeacherEditor';
import { faSquareRootVariable } from '@fortawesome/free-solid-svg-icons';
import MyFontAwesome from '@/app/components/MyFontAwesome';

export default function LessonPractica({ element, content, fetchPropElement, fetchPropThemes, clearProp }: { element: mainStepsType; content: any; fetchPropElement: (id: number) => void; fetchPropThemes: () => void; clearProp: boolean }) {
    interface docValueType {
        title: string;
        description: string;
        document: File | null;
        url: string;
        score: number | null;
        stepPos?: number;
    }

    const { translations } = useLocalization();

    const router = useRouter();
    const media = useMediaQuery('(max-width: 640px)');
    const fileUploadRef = useRef<FileUpload>(null);
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
            </span>
        );
    };

    const header = renderHeader();

    const [editingLesson, setEditingLesson] = useState<docValueType>({ title: '', description: '', document: null, url: '', score: 0 });
    const [visible, setVisisble] = useState(false);
    const [contentShow, setContentShow] = useState(false);
    // doc
    const [document, setDocuments] = useState<contentType>();
    const [docValue, setDocValue] = useState<docValueType>({ title: '', description: '', document: null, url: '', score: 0 });
    const [urlPDF, setUrlPDF] = useState('');
    const [PDFVisible, setPDFVisible] = useState<boolean>(false);

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [additional, setAdditional] = useState<{ doc: boolean; link: boolean; video: boolean }>({ doc: false, link: false, video: false });
    const [selectId, setSelectId] = useState<number | null>(null);
    const [skeleton, setSkeleton] = useState(false);
    const [descriptionTypeState, setDescriptionTypeState] = useState<'text' | 'math'>('text');

    const clearFile = () => {
        fileUploadRef.current?.clear();
        setAdditional((prev) => ({ ...prev, video: false }));
        if (visible) {
            setEditingLesson(
                (prev) =>
                    prev && {
                        ...prev,
                        document: null
                    }
            );
        } else {
            setDocValue((prev) => ({
                ...prev,
                document: null
            }));
        }
    };

    const documentView = (
        <>
            <div className="flex flex-col gap-1">
                <i className="pi pi-times text-2xl" onClick={() => setPDFVisible(false)}></i>
                <div className="w-full flex flex-col gap-1 items-center justify-center"></div>
            </div>
        </>
    );

    const clearValues = () => {
        clearFile();
        setDocValue({ title: '', description: '', document: null, url: '', score: 0 });
        setEditingLesson({ title: '', description: '', document: null, url: '', score: 0 });
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

    const sentToPDF = (url: string) => {
        setUrlPDF(url);
        if (media) {
            router.push(`/pdf/${url}`);
        } else {
            setPDFVisible(true);
        }
    };

    const editing = async () => {
        const data = await fetchElement(element.lesson_id, element.id);

        if (data.success) {
            setEditingLesson({ title: data.content.title, document: null, description: data.content.description, url: '', score: data.step.score, stepPos: data?.step?.step });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleAddPracica = async (text: string | null) => {
        setProgressSpinner(true);
        const data = await addPractica(text ? text : docValue?.description, docValue, element.lesson_id, element.type_id, element.id);
        if (data.success) {
            fetchPropElement(element.id);
            fetchPropThemes();
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.successAdd, detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.addError, detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
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
        const data = await deletePractica(Number(document?.lesson_id), id, element.type.id, element.id);
        if (data.success) {
            fetchPropElement(element.id);
            fetchPropThemes();
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.deleteSuccess, detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.deleteError, detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
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
        const data = await updatePractica(editingLesson, document?.lesson_id ? Number(document?.lesson_id) : null, Number(selectId), element.type.id, element.id);
        const steps: { id: number; step: number | null }[] = [{ id: element?.id, step: editingLesson?.stepPos || 0 }];
        const secuence = await stepSequenceUpdate(document?.lesson_id ? Number(document?.lesson_id) : null, steps);

        if (data?.success && secuence.success) {
            setSkeleton(false);
            fetchPropElement(element.id);
            fetchPropThemes();
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: translations.updateSuccess, detail: '' }
            });
        } else {
            setSkeleton(false);
            setDocValue({ title: '', description: '', document: null, url: '', score: 0 });
            setEditingLesson({ title: '', description: '', document: null, url: '', score: 0 });
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.updateError, detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    const practicaSection = () => {
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
                                            cardValue={{ title: document?.title, id: document.id, desctiption: document?.description || '', type: 'practica', url: document.url, document: document.document, score: element?.score || 0 }}
                                            cardBg={'#ddc4f51a'}
                                            type={{ typeValue: 'practica', icon: 'pi pi-list' }}
                                            typeColor={'var(--mainColor)'}
                                            lessonDate={new Date(document.created_at).toISOString().slice(0, 10)}
                                            urlForPDF={() => sentToPDF('')}
                                            urlForDownload={document.document ? document.document_path : ''}

                                            mathDescriptionState={()=> {
                                                const check = document?.description?.includes('$$');
                                                if(check){
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            }}
                                        />
                                    )
                                )}
                            </>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col justify-center gap-2">
                        <div className="flex gap-1 items-center">
                            <div className="w-full">
                                <div className="w-full flex gap-1 items-center">
                                    <InputText
                                        value={docValue.title}
                                        id="title"
                                        className="w-full"
                                        placeholder={translations.questionPlaceholder}
                                        onChange={(e) => {
                                            setDocValue((prev) => ({ ...prev, title: e.target.value }));
                                            setValue('title', e.target.value, { shouldValidate: true });
                                        }}
                                    />
                                </div>
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                            </div>
                            <div className="flex flex-col">
                                <InputText
                                    type="number"
                                    id="title"
                                    placeholder={translations.score}
                                    // value={String(docValue?.score)}
                                    className="w-[50px] sm:w-[70px] h-auto"
                                    onChange={(e) => {
                                        setDocValue((prev) => prev && { ...prev, score: Number(e.target.value) });
                                        setValue('title', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                            </div>
                            <div
                                onClick={() => {
                                    if (descriptionTypeState === 'text') setDescriptionTypeState('math');
                                    if (descriptionTypeState === 'math') setDescriptionTypeState('text');
                                }}
                                className={'flex items-center'}
                            >
                                <MyFontAwesome
                                    icon={faSquareRootVariable}
                                    className={`cursor-pointer p-[10px] sm:p-3 border border-[var(--borderBottomColor)] rounded hover:opacity-50 transition ${descriptionTypeState === 'math' ? 'text-white bg-[var(--amberColor)]' : ''} `}
                                />
                            </div>
                        </div>
                        <div>
                            {descriptionTypeState === 'math' ? (
                                <TeacherEditor
                                    state={true}
                                    onSave={(text: string) => {
                                        console.log(text);
                                        setDocValue((prev) => ({ ...prev, description: text }));
                                        handleAddPracica(text);
                                    }}
                                    defaultValueProp={null}
                                />

                            ) : descriptionTypeState === 'text' ? (
                                <Editor
                                    value={docValue.description}
                                    onTextChange={(e: EditorTextChangeEvent) => {
                                        setDocValue((prev) => ({ ...prev, description: String(e.htmlValue) }));
                                        setValue('title', String(e.htmlValue), { shouldValidate: true });
                                    }}
                                    headerTemplate={header}
                                    style={{ height: '220px' }}
                                />
                            ) : (
                            ''
                            )}
                            <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                        </div>
                        {additional.doc && (
                            <input
                                type="file"
                                accept="application/pdf"
                                className="border rounded p-1"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setDocValue((prev) => ({
                                            ...prev,
                                            document: file
                                        }));
                                    }
                                }}
                            />
                        )}
                        {additional.doc && (
                            <div className="w-full flex flex-col items-center">
                                <InputText
                                    id="usefulLinkNotReq"
                                    type="url"
                                    placeholder={translations.linkLabel}
                                    value={docValue.url}
                                    className="w-full"
                                    onChange={(e) => {
                                        setDocValue((prev) => ({ ...prev, url: e.target.value }));
                                        setValue('usefulLinkNotReq', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLinkNotReq?.message}</b>
                            </div>
                        )}

                        <div className="flex relative">
                            {/* <Button disabled={!!errors.title || !docValue.file} label="Сохранить" onClick={handleAddDoc} /> */}
                            <div className="absolute">
                                <span className="cursor-pointer ml-1 text-[13px] sm:text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, doc: !prev.doc }))}>
                                    {translations.addAdditionally} {additional.doc ? '-' : '+'}
                                </span>
                            </div>
                            {
                                descriptionTypeState === 'text' ? <div className="w-full flex gap-1 justify-center items-center mt-4 sm:m-0">
                                    <Button
                                        label={translations.save}
                                        disabled={progressSpinner || !docValue.title.length || !!errors.title || !docValue.description.length || !docValue.score}
                                        onClick={() => {
                                            handleAddPracica(null);
                                        }}
                                    />
                                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                                </div> : ''
                            }
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
        setDocValue({ title: '', description: '', document: null, url: '', score: 0 });
    }, [element]);

    useEffect(()=> {
        setDocValue((prev)=> ({ ...prev, description: '' }));
    },[descriptionTypeState]);

    return (
        <div>
            <FormModal
                title={translations.updateLesson}
                fetchValue={() => {
                    handleUpdateDoc();
                }}
                clearValues={clearValues}
                visible={visible}
                setVisible={setVisisble}
                start={false}
                footerValue={{ footerState: true, reject: translations.back, next: translations.save }}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <div className="w-full flex flex-col">
                            <span>{translations.stepPosition}:</span>
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
                        <div className="w-full flex gap-1 items-center">
                            <div className="w-full">
                                <div className="w-full flex gap-1 items-center">
                                    <InputText
                                        id="title"
                                        className="w-full"
                                        value={editingLesson?.title && editingLesson.title}
                                        onChange={(e) => {
                                            setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                            setValue('title', e.target.value, { shouldValidate: true });
                                        }}
                                    />
                                </div>
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                            </div>
                            <div className="flex flex-col justify-center">
                                <InputText
                                    type="number"
                                    className="w-[70px]"
                                    placeholder={translations.score}
                                    value={String(editingLesson?.score)}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, score: Number(e.target.value) });
                                    }}
                                />
                            </div>
                            <div
                                onClick={() => {
                                    if (descriptionTypeState === 'text') setDescriptionTypeState('math');
                                    if (descriptionTypeState === 'math') setDescriptionTypeState('text');
                                }}
                                className={'flex items-center'}
                            >
                                <MyFontAwesome
                                    icon={faSquareRootVariable}
                                    className={`cursor-pointer p-[10px] sm:p-3 border border-[var(--borderBottomColor)] rounded hover:opacity-50 transition ${descriptionTypeState === 'math' ? 'text-white bg-[var(--amberColor)]' : ''} `}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <div className="w-full">
                                {
                                    descriptionTypeState === 'math' ? (
                                        <TeacherEditor
                                            state={false}
                                            onSave={(text: string) => {
                                                console.log(text);
                                                setEditingLesson((prev) => ({ ...prev, description: text }));
                                            }}
                                            defaultValueProp={editingLesson.description}
                                        />
                                    ) : descriptionTypeState === 'text' ? (
                                        <Editor
                                            value={editingLesson.description}
                                            onTextChange={(e: EditorTextChangeEvent) => {
                                                setEditingLesson((prev) => ({ ...prev, description: String(e.htmlValue) }));
                                                setValue('title', String(e.htmlValue), { shouldValidate: true });
                                            }}
                                            headerTemplate={header}
                                        />
                                    ) : ''
                                }
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                            </div>
                            {additional.doc && (
                                <div className="w-full flex gap-1 flex-col items-center">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="w-full border rounded p-1"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setEditingLesson((prev) => ({
                                                    ...prev,
                                                    document: file
                                                }));
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {additional.doc && (
                                <div className="w-full flex flex-col items-center">
                                    <InputText
                                        id="usefulLink"
                                        type="url"
                                        placeholder={translations.linkLabel}
                                        value={editingLesson?.url}
                                        className="w-full"
                                        onChange={(e) => {
                                            setEditingLesson((prev) => prev && { ...prev, url: e.target.value });
                                            setValue('usefulLink', e.target.value, { shouldValidate: true });
                                        }}
                                    />
                                </div>
                            )}

                            <div className="flex justify-center relative">
                                <div className="">
                                    <span className="cursor-pointer ml-1 text-[13px] sm:text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, doc: !prev.doc }))}>
                                        {translations.addAdditionally} {additional.doc ? '-' : '+'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FormModal>
            {!clearProp && practicaSection()}
        </div>
    );
}
