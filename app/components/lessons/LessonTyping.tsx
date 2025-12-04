'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import LessonCard from '../cards/LessonCard';
import { getToken } from '@/utils/auth';
import { addLesson, deleteLesson, fetchLesson, fetchVideoType, updateLesson } from '@/services/courses';
import useErrorMessage from '@/hooks/useErrorMessage';
import FormModal from '../popUp/FormModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { lessonStateType } from '@/types/lessonStateType';
import { lessonSchema } from '@/schemas/lessonSchema';
import { lessonType } from '@/types/lessonType';
import { NotFound } from '../NotFound';
import { EditableLesson } from '@/types/editableLesson';
import { Dropdown } from 'primereact/dropdown';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { FileWithPreview } from '@/types/fileuploadPreview';

export default function LessonTyping({ mainType, courseId, lessonId }: { mainType: string; courseId: string | null; lessonId: string | null }) {
    // types
    interface editingType {
        key: string;
        file: string;
        url: string;
        link: string;
        video_type_id?: number | null;
    }

    interface videoType {
        name: string;
        status: boolean;
        id: number;
    }

    interface videoInsideType {
        id: number;
        is_link: boolean;
        short_title: string;
        title: string;
    }
    // validate
    const {
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(lessonSchema),
        mode: 'onChange'
    });

    const media = useMediaQuery('(max-width: 640px)');
    const router = useRouter();

    // doc
    const [documents, setDocuments] = useState([]);
    const [docValue, setDocValue] = useState<lessonStateType | null>(null);
    const [docShow, setDocShow] = useState<boolean>(false);
    const [urlPDF, setUrlPDF] = useState('');
    const [PDFVisible, setPDFVisible] = useState<boolean>(false);

    // links
    const [links, setLinks] = useState([]);
    const [linksValue, setLinksValue] = useState<lessonStateType | null>(null);
    const [linksShow, setLinksShow] = useState<boolean>(false);

    // videos
    const [video, setVideo] = useState([]);
    const [selectedCity, setSelectedCity] = useState({ name: '', status: true, id: 1 });
    const [videoSelect, setVideoSelect] = useState<videoType[]>([]);
    const [videoTypes, setVideoTypes] = useState<videoInsideType[]>([]);
    const [videoCall, setVideoCall] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const [videoValue, setVideoValue] = useState<lessonStateType | null>(null);
    const [videoShow, setVideoShow] = useState<boolean>(false);
    const [imageState, setImageState] = useState<string | null>(null);

    // auxiliary
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);
    const [selectId, setSelectId] = useState<number | null>(null);
    const [selectType, setSelectType] = useState('');
    const [visible, setVisisble] = useState(false);
    const [editingLesson, setEditingLesson] = useState<EditableLesson | null>(null);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [additional, setAdditional] = useState<{ doc: boolean; link: boolean; video: boolean }>({ doc: false, link: false, video: false });

    // functions
    const handleUpdate = () => {
        if (selectType === 'doc') {
            handleUpdateLesson();
        } else if (selectType === 'url') {
            handleUpdateLink();
        } else if (selectType === 'video') {
            handleUpdateVideo();
        }
    };

    const selectedForEditing = (id: number, type: string) => {
        setSelectId(id);
        setSelectType(type);
        editing(type, id);
        setVisisble(true);
    };

    // Предоставляю данные из сервера для изменения
    const editing = async (type: string, selected: number) => {
        console.log(type, selected);

        const data = await fetchLesson(type, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);
        console.log(data);

        const lesson: editingType =
            type === 'doc'
                ? { key: 'documents', file: 'document', url: '', link: '', video_type_id: 1 }
                : type === 'url'
                ? { key: 'links', file: '', url: 'url', link: '', video_type_id: 1 }
                : type === 'video'
                ? { key: 'videos', file: '', url: '', link: 'link', video_type_id: 1 }
                : { key: '', file: '', url: '', link: '', video_type_id: 1 };
        // console.log(lesson);
        // console.log(data[lesson.key]);

        if (data.success) {
            if (data[lesson.key]) {
                const arr = data[lesson.key].find((item: lessonType) => item.id === selected);
                // console.log(arr);

                setEditingLesson({
                    title: arr.title,
                    description: arr?.description,
                    document: arr[lesson.file],
                    url: arr[lesson.url],
                    video_link: arr[lesson.link],
                    video_type_id: arr?.video_type_id
                });
            }
        }
    };

    const fileUploadRef = useRef<FileUpload>(null);
    const clearFile = () => {
        fileUploadRef.current?.clear();
        setAdditional((prev) => ({ ...prev, video: false }))
        setImageState(null);
        if (visible) {
            setEditingLesson(
                (prev) =>
                    prev && {
                        ...prev,
                        file: null
                    }
            );
        } else {
            setDocValue((prev) => prev && ({
                ...prev,
                file: null
            }));
        }
    };

    const clearValues = () => {
        clearFile();
        setDocValue(null);
        setLinksValue(null);
        setEditingLesson(null);
        setSelectId(null);
        setSelectType('');
    };

    const toggleSpinner = () => {
        setProgressSpinner(true);
        setInterval(() => {
            setProgressSpinner(false);
        }, 1000);
    };

    // DOC SECTION

    const sentToPDF = (url: string) => {
        setUrlPDF(url);
        if (media) {
            router.push(`/pdf/${url}`);
        } else {
            setPDFVisible(true);
        }
    };

    const docSection = () => {
        return (
            <div className="py-1 sm:py-4 flex flex-col items-center gap-4">
                (
                    <>
                        <div className="w-full flex flex-col justify-center gap-2">
                            <div className="flex gap-1 items-center">
                                <FileUpload
                                    className="text-[12px]"
                                    ref={fileUploadRef}
                                    chooseLabel="Документ жүктөө"
                                    mode="basic"
                                    name="demo[]"
                                    customUpload
                                    uploadHandler={() => {}}
                                    accept="application/pdf"
                                    onSelect={(e) =>
                                        setDocValue((prev) => prev && ({
                                            ...prev,
                                            file: e.files[0]
                                        }))
                                    }
                                />
                                <Button icon={'pi pi-trash'} onClick={clearFile} />
                            </div>

                            <InputText
                                id="title"
                                type="text"
                                placeholder={'Аталышы'}
                                value={docValue && docValue.title}
                                onChange={(e) => {
                                    setDocValue((prev) => prev && ({ ...prev, title: e.target.value }));
                                    setValue('title', e.target.value, { shouldValidate: true });
                                }}
                            />
                            <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                            {additional.doc && <InputText placeholder="Мазмун" value={docValue && docValue.description} onChange={(e) => setDocValue((prev) => prev && ({ ...prev, description: e.target.value }))} className="w-full" />}

                            <div className="flex relative">
                                {/* <Button disabled={!!errors.title || !docValue && docValue.file} label="Сактоо" onClick={handleAddDoc} /> */}
                                <div className="absolute">
                                    <span className="cursor-pointer ml-1 text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, doc: !prev.doc }))}>
                                        Кошумча {additional.doc ? '-' : '+'}
                                    </span>
                                </div>
                                <div className="w-full flex gap-1 justify-center items-center">
                                    <Button label="Сактоо" disabled={progressSpinner || !!errors.title || !docValue} onClick={handleAddDoc} />
                                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center gap-4 py-2 sm:py-4">
                            <div className="w-full flex flex-wrap justify-center gap-4">
                                {docShow ? (
                                    <NotFound titleMessage={'Сабак кошуу үчүн талааларды толтурунуз'} />
                                ) : (
                                    documents.map((item: lessonType) => {
                                        return (
                                            <>
                                                <LessonCard
                                                    status="working"
                                                    onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                                    onDelete={(id: number) => handleDeleteDoc(id)}
                                                    cardValue={{ title: item?.title, id: item.id, desctiption: item?.description, type: 'doc' }}
                                                    cardBg={'#ddc4f51a'}
                                                    type={{ typeValue: 'doc', icon: 'pi pi-file' }}
                                                    typeColor={'var(--mainColor)'}
                                                    lessonDate={new Date(item.created_at).toISOString().slice(0, 10)}
                                                    urlForPDF={() => sentToPDF(item.document || '')}
                                                    urlForDownload=""
                                                />
                                            </>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </>
                )
            </div>
        );
    };

    // fetch document
    const handleFetchDoc = async () => {
        // skeleton = false
        const data = await fetchLesson('doc', courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);
        console.log(data);
        
        if (data?.success) {
            if (data.documents) {
                // Присваиваю себе. Для отображения
                setDocValue(null);
                setDocuments(data.documents);
                setDocShow(false);
            } else {
                setDocShow(true);
            }
        } else {
            setDocShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            // skeleton = false
        }
    };

    // add document
    const handleAddDoc = async () => {
        toggleSpinner();
        const token = getToken('access_token');
        const data = await addLesson('doc', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, docValue || '', 0);

        if (data.success) {
            handleFetchDoc();
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

    useEffect(() => {
        console.log(documents);
    }, [documents]);

    // update document
    const handleUpdateLesson = async () => {
        const token = getToken('access_token');

        const data = await updateLesson('doc', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, Number(selectId), editingLesson);
        console.log(data);

        if (data?.success) {
            handleFetchDoc();
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            });
        } else {
            setDocValue(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при изменении урока' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    useEffect(() => {
        console.log('editing lesson ', editingLesson);
    }, [editingLesson]);

    // delete document
    const handleDeleteDoc = async (id: number) => {
        const token = getToken('access_token');
        const data = await deleteLesson('doc', Number(courseId), Number(lessonId), id);

        if (data.success) {
            handleFetchDoc();
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

    // LINKS SECTION
    const linkSection = () => {
        return (
            <div className="py-1 sm:py-4 flex flex-col items-center gap-4">
                <div className="w-full flex flex-col justify-center gap-2">
                    <InputText
                        id="usefulLink"
                        type="url"
                        placeholder={'Шилтеме жүктөө'}
                        value={linksValue && linksValue.url}
                        onChange={(e) => {
                            setLinksValue((prev) => prev && ({ ...prev, url: e.target.value }));
                            setValue('usefulLink', e.target.value, { shouldValidate: true });
                        }}
                    />
                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>

                    <InputText
                        id="title"
                        type="text"
                        placeholder={'Аталышы'}
                        value={linksValue && linksValue.title}
                        onChange={(e) => {
                            setLinksValue((prev) => prev && ({ ...prev, title: e.target.value }));
                            setValue('title', e.target.value, { shouldValidate: true });
                        }}
                    />
                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                    {additional.link && <InputText placeholder="Мазмун" value={linksValue && linksValue.description} onChange={(e) => setLinksValue((prev) => prev && ({ ...prev, description: e.target.value }))} className="w-full" />}

                    <div className="flex relative">
                        {/* <Button disabled={!!errors.title || !docValue && docValue.file} label="Сактоо" onClick={handleAddDoc} /> */}
                        <div className="absolute">
                            <span className="cursor-pointer ml-1 text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, link: !prev.link }))}>
                                Кошумча {additional.link ? '-' : '+'}
                            </span>
                        </div>
                        <div className="w-full flex gap-1 justify-center items-center">
                            <div className="flex gap-1 items-center">
                                <Button label="Сактоо" disabled={progressSpinner || !linksValue || !!errors.title || !!errors.usefulLink} onClick={handleAddLink} />
                                {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center gap-4 py-2 sm:py-4">
                    <div className="w-full flex flex-wrap justify-center gap-4">
                        {linksShow ? (
                            <NotFound titleMessage={'Сабак кошуу үчүн талааларды толтурунуз'} />
                        ) : (
                            links.map((item: lessonType) => {
                                console.log(item);
                                return (
                                    <>
                                        <LessonCard
                                            status={'working'}
                                            onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                            onDelete={(id: number) => handleDeleteLink(id)}
                                            cardValue={{ title: item.title, id: item.id, desctiption: item?.description, type: 'url', photo: item?.cover_url }}
                                            cardBg={'#7bb78112'}
                                            type={{ typeValue: 'link', icon: 'pi pi-link' }}
                                            typeColor={'var(--mainColor)'}
                                            lessonDate={new Date(item.created_at).toISOString().slice(0, 10)}
                                            urlForPDF={() => ''}
                                            urlForDownload=""
                                        />
                                    </>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // fetch link
    const handleFetchLink = async () => {
        // skeleton = false
        const data = await fetchLesson('url', courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);
        console.log(data);

        if (data?.success) {
            if (data.links) {
                // Присваиваю себе. Для отображения
                setLinksValue(null);
                setLinks(data.links);
                setLinksShow(false);
            } else {
                setLinksShow(true);
            }
        } else {
            setLinksShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            // skeleton = false
        }
    };

    // add link
    const handleAddLink = async () => {
        toggleSpinner();
        const token = getToken('access_token');
        const data = await addLesson('url', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, linksValue || '', 0);

        if (data.success) {
            handleFetchLink();
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

    // delete link
    const handleDeleteLink = async (id: number) => {
        const data = await deleteLesson('url', Number(courseId), Number(lessonId), id);

        if (data.success) {
            handleFetchLink();
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

    // update link
    const handleUpdateLink = async () => {
        const token = getToken('access_token');

        const data = await updateLesson('url', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, Number(selectId), editingLesson);
        console.log(data);

        if (data.success) {
            handleFetchLink();
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            });
        } else {
            setLinksValue(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при изменении урока' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    // VIDEO SECTIONS
    const toggleVideoType = (e: videoType) => {
        setSelectedCity(e);
        setVideoValue(null);
    };

    const handleVideoCall = (value: string | null) => {
        if (!value) {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Видеону иштетүүдө ката', detail: '' }
            });
        }

        const url = new URL(typeof value === 'string' ? value : '');
        let videoId = null;

        if (url.hostname === 'youtu.be') {
            // короткая ссылка, видео ID — в пути
            videoId = url.pathname.slice(1); // убираем первый слеш
        } else if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
            // стандартная ссылка, видео ID в параметре v
            videoId = url.searchParams.get('v');
        }

        if (!videoId) {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Видеону иштетүүдө ката', detail: '' }
            });
            return null; // не удалось получить ID
        }
        // return `https://www.youtube.com/embed/${videoId}`;

        console.log('value', videoId);
        setVideoLink(`https://www.youtube.com/embed/${videoId}`);
        setVideoCall(true);
    };

    const onSelect = (e: FileUploadSelectEvent & { files: FileWithPreview[] }) => {
        if (e.files.length > 0) {
            setImageState(e.files[0].objectURL);
            setVideoValue((prev) => prev && ({
                ...prev,
                cover: e.files[0]
            }));
        }
    };

    const videoSection = () => {
        return (
            <div className="py-1 sm:py-4 flex flex-col items-center gap-3">
                <div className="w-full flex items-center justify-center flex-col sm:flex-row gap-2">
                    <Dropdown
                        value={selectedCity}
                        onChange={(e) => {
                            toggleVideoType(e.value);
                        }}
                        options={videoSelect}
                        optionLabel="name"
                        placeholder="Танданыз"
                        // style={{backgroundColor: 'var(--mainColor', color: 'white'}}
                        panelStyle={{ color: 'white' }}
                        className="w-[213px] sm:w-full md:w-14rem"
                    />
                    <div className="w-full flex justify-center">
                        {selectedCity?.status ? (
                            <div className="w-full flex flex-col items-center">
                                <InputText
                                    id="usefulLink"
                                    type="url"
                                    placeholder={'Шилтеме жүктөө'}
                                    value={videoValue && videoValue.video_link}
                                    className="w-full"
                                    onChange={(e) => {
                                        setVideoValue((prev) => prev && ({ ...prev, video_link: e.target.value }));
                                        setValue('usefulLink', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>
                            </div>
                        ) : (
                            <div className="w-full flex justify-center sm:justify-start">
                                <FileUpload
                                    chooseLabel="Видео жүктөө"
                                    mode="basic"
                                    name="demo[]"
                                    customUpload
                                    uploadHandler={() => {}}
                                    accept="video/"
                                    onSelect={(e) =>
                                        setVideoValue((prev) => prev && ({
                                            ...prev,
                                            file: e.files[0]
                                        }))
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full flex flex-col justify-center gap-2">
                    <InputText
                        id="title"
                        type="text"
                        placeholder={'Аталышы'}
                        value={videoValue && videoValue.title}
                        onChange={(e) => {
                            setVideoValue((prev) => prev && ({ ...prev, title: e.target.value }));
                            setValue('title', e.target.value, { shouldValidate: true });
                        }}
                    />
                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                    {additional.video && (
                        <div>
                            <InputText placeholder="Мазмун" value={videoValue && videoValue.description} onChange={(e) => setVideoValue((prev) => prev && ({ ...prev, description: e.target.value }))} className="w-full" />
                            <div className="flex flex-col sm:flex-row gap-2 items-center sm:w-xl h-[140px] my-2">
                                <div className="flex items-center gap-1">
                                    <FileUpload ref={fileUploadRef} mode="basic" chooseLabel="Превью" style={{ fontSize: '12px' }} customUpload name="demo[]" accept="image/*" maxFileSize={1000000} onSelect={onSelect} />
                                    {imageState && <Button icon={'pi pi-trash'} onClick={clearFile} />}
                                </div>
                                <div className="w-1/2 order-2 sm:order-1 max-h-[150px] max-w-[250px] border overflow-hidden flex justify-center items-center">
                                    {imageState ? <img className="w-full object-cover" src={imageState} alt="" /> : <img className="w-full object-cover" src={'/layout/images/no-image.png'} alt="" />}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex relative">
                        {/* <Button disabled={!!errors.title || !docValue && docValue.file} label="Сактоо" onClick={handleAddDoc} /> */}
                        <div className="absolute">
                            <span className="cursor-pointer ml-1 text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, video: !prev.video }))}>
                                Кошумча {additional.video ? '-' : '+'}
                            </span>
                        </div>
                        <div className="w-full flex gap-1 justify-center items-center">
                            <Button label="Сактоо" disabled={progressSpinner || !videoValue || !videoValue || !!errors.title || !!errors.usefulLink} onClick={handleAddVideo} />
                            {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center gap-4 py-2 sm:py-4">
                    <div className="w-full flex flex-wrap justify-center gap-4">
                        <Dialog
                            header={''}
                            className="w-[80%] h-[300px] md:h-[500px]"
                            visible={videoCall}
                            onHide={() => {
                                if (!videoCall) return;
                                setVideoCall(false);
                            }}
                        >
                            <div className="flex justify-center items-center">
                                <iframe
                                    className="w-full h-[200px] md:h-[400px]"
                                    // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                    src={videoLink}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </Dialog>
                        {videoShow ? (
                            <NotFound titleMessage={'Сабак кошуу үчүн талааларды толтурунуз'} />
                        ) : (
                            video.map((item: lessonType) => (
                                <>
                                    {/* {
                                    status: 'student',
                                    description: item.desctiption,
                                    lessonType: item.role? // lecture/lab
                                } */}
                                    <LessonCard
                                        status={'working'}
                                        onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                        onDelete={(id: number) => handleDeleteVideo(id)}
                                        cardValue={{ title: item.title, id: item.id, desctiption: item?.description, type: 'video', photo: item?.cover_url }}
                                        cardBg={'#f1b1b31a'}
                                        type={{ typeValue: 'video', icon: 'pi pi-video' }}
                                        typeColor={'var(--mainColor)'}
                                        lessonDate={'xx-xx'}
                                        urlForPDF={() => ''}
                                        urlForDownload=""
                                        videoVisible={() => handleVideoCall(String(item?.link))}
                                    />
                                </>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const handleVideoType = async () => {
        const data = await fetchVideoType();

        if (data && Array.isArray(data)) {
            setVideoTypes(data);
        }
    };

    // fetch video
    const handleFetchVideo = async () => {
        // skeleton = false
        const data = await fetchLesson('video', courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);

        if (data?.success) {
            if (data.videos) {
                setVideoValue(null);
                setVideo(data.videos);
                setVideoShow(false);
            } else {
                setVideoShow(true);
            }
        } else {
            setVideoShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            // skeleton = false
        }
    };

    // add vieo
    const handleAddVideo = async () => {
        toggleSpinner();
        const token = getToken('access_token');
        const data = await addLesson('video', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, videoValue || '', selectedCity?.id );
        if (data.success) {
            clearFile();
            handleFetchVideo();
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

    // update video
    const handleUpdateVideo = async () => {
        const token = getToken('access_token');

        const data = await updateLesson('video', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, Number(selectId), editingLesson);

        if (data.success) {
            handleFetchVideo();
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            });
        } else {
            setVideoValue(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при изменении урока' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    // delete video
    const handleDeleteVideo = async (id: number) => {
        const data = await deleteLesson('video', Number(courseId), Number(lessonId), id);

        if (data.success) {
            handleFetchVideo();
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

    // USEEFFECTS

    useEffect(() => {
        if (mainType === 'doc') handleFetchDoc();
        if (mainType === 'link') handleFetchLink();
        if (mainType === 'video') {
            console.log(video);

            handleFetchVideo();
            handleVideoType();
        }
    }, []);

    useEffect(() => {
        console.log('selected id ', selectId);
    }, [selectId]);

    useEffect(() => {
        links.length < 1 ? setLinksShow(true) : setLinksShow(false);
        documents.length < 1 ? setDocShow(true) : setDocShow(false);
        video.length < 1 ? setVideoShow(true) : setVideoShow(false);
    }, [links, documents, video]);

    useEffect(() => {
        console.log(videoTypes);

        if (videoTypes) {
            const forSelect = videoTypes.map((item) => {
                return { name: item.title, status: item.is_link, id: item.id };
            });

            setVideoSelect(forSelect);
            setSelectedCity(forSelect[0]);
        }
    }, [videoTypes]);

    return (
        <div>
            <FormModal title={'Сабакты жаңылоо'} fetchValue={handleUpdate} clearValues={clearValues} visible={visible} setVisible={setVisisble} start={false}>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 items-center justify-center">
                        {selectType === 'doc' ? (
                            <>
                                <div className="flex gap-1 items-center">
                                    <FileUpload
                                        ref={fileUploadRef}
                                        chooseLabel="Жаңылоо"
                                        mode="basic"
                                        name="demo[]"
                                        customUpload
                                        uploadHandler={() => {}}
                                        accept="application/pdf"
                                        onSelect={(e) => {
                                            if (e.files[0]) setEditingLesson((prev) => prev && { ...prev, file: e.files[0] });
                                        }}
                                    />
                                    <Button icon={'pi pi-trash'} onClick={clearFile} />
                                </div>
                                <span>{String(editingLesson?.document)}</span>
                                <InputText
                                    type="text"
                                    placeholder="Аталышы"
                                    className="w-full"
                                    value={editingLesson?.title && editingLesson?.title}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                        setValue('title', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                                <InputText
                                    placeholder="Мазмун"
                                    value={editingLesson?.description !== 'null' ? editingLesson?.description : ''}
                                    onChange={(e) => setEditingLesson((prev) => prev && { ...prev, description: e.target.value })}
                                    className="w-full"
                                />
                            </>
                        ) : selectType === 'url' ? (
                            <>
                                <InputText
                                    type="url"
                                    value={editingLesson?.url && editingLesson?.url}
                                    className="w-full"
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, url: e.target.value });
                                        setValue('usefulLink', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <InputText
                                    type="text"
                                    placeholder="Аталышы"
                                    className="w-full"
                                    value={editingLesson?.title && editingLesson?.title}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                        setValue('title', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                                <InputText placeholder="Мазмун" value={editingLesson?.description && editingLesson?.description} onChange={(e) => setEditingLesson((prev) => prev && { ...prev, description: e.target.value })} className="w-full" />
                            </>
                        ) : selectType === 'video' ? (
                            <>
                                {editingLesson?.video_type_id ? (
                                    <div className="w-full flex flex-col items-center">
                                        <InputText
                                            type="url"
                                            value={editingLesson?.video_link && editingLesson?.video_link}
                                            className="w-full"
                                            onChange={(e) => {
                                                setEditingLesson((prev) => prev && { ...prev, video_link: e.target.value });
                                                setValue('usefulLink', e.target.value, { shouldValidate: true });
                                            }}
                                        />
                                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>
                                    </div>
                                ) : (
                                    <>
                                        <FileUpload
                                            chooseLabel="Видео жүктөө"
                                            mode="basic"
                                            name="demo[]"
                                            customUpload
                                            uploadHandler={() => {}}
                                            accept="video/"
                                            onSelect={(e) =>
                                                setEditingLesson(
                                                    (prev) =>
                                                        prev && {
                                                            ...prev,
                                                            file: e.files[0]
                                                        }
                                                )
                                            }
                                        />
                                        <span>{String(editingLesson?.video_link)}</span>
                                    </>
                                )}
                                <InputText
                                    type="text"
                                    placeholder="Аталышы"
                                    className="w-full"
                                    value={editingLesson?.title && editingLesson?.title}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                        setValue('title', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                                <InputText placeholder="Мазмун" value={editingLesson?.description && editingLesson?.description} onChange={(e) => setEditingLesson((prev) => prev && { ...prev, description: e.target.value })} className="w-full" />
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </FormModal>

            {mainType === 'doc' && docSection()}
            {mainType === 'link' && linkSection()}
            {mainType === 'video' && videoSection()}
        </div>
    );
}
