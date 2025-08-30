'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
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
import PDFViewer from '../PDFBook';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';

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
    const [docValue, setDocValue] = useState<lessonStateType>({
        title: '',
        description: '',
        file: null,
        url: '',
        video_link: ''
    });
    const [docShow, setDocShow] = useState<boolean>(false);
    const [urlPDF, setUrlPDF] = useState('');
    const [PDFVisible, setPDFVisible] = useState<boolean>(false);

    // links
    const [links, setLinks] = useState([]);
    const [linksValue, setLinksValue] = useState<lessonStateType>({
        title: '',
        description: '',
        file: null,
        url: '',
        video_link: ''
    });
    const [linksShow, setLinksShow] = useState<boolean>(false);

    // videos
    const [video, setVideo] = useState([]);
    const [selectedCity, setSelectedCity] = useState({ name: '', status: true, id: 1 });
    const [videoSelect, setVideoSelect] = useState<videoType[]>([]);
    const [videoTypes, setVideoTypes] = useState<videoInsideType[]>([]);
    const [videoValue, setVideoValue] = useState<lessonStateType>({
        title: '',
        description: '',
        file: null,
        url: '',
        video_link: ''
    });
    const [videoShow, setVideoShow] = useState<boolean>(false);

    // auxiliary
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);
    const [selectId, setSelectId] = useState<number | null>(null);
    const [selectType, setSelectType] = useState('');
    const [visible, setVisisble] = useState(false);
    const [editingLesson, setEditingLesson] = useState<EditableLesson | null>(null);

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
        console.log('Открытие окна... ', id, type);

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
                ? { key: 'documents', file: 'document_path', url: '', link: '', video_type_id: 1 }
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

    const clearValues = () => {
        setLinksValue({ title: '', description: '', file: null, url: '', video_link: '' });
        setEditingLesson(null);
        setSelectId(null);
        setSelectType('');
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

    const documentView = (
        <>
            <div className=" flex flex-col gap-1">
                <i className="pi pi-times text-2xl" onClick={() => setPDFVisible(false)}></i>
                <div className="w-full flex flex-col gap-1 items-center justify-center">
                    <PDFViewer url={urlPDF || ''} />
                </div>
            </div>
        </>
    );

    const fileUploadRef = useRef<FileUpload>(null);
    const clearFile = () => {
        fileUploadRef.current?.clear();
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

    const docSection = () => {
        return (
            <div className="py-4 flex flex-col items-center gap-4">
                {PDFVisible ? (
                    documentView
                ) : (
                    <>
                        <div className="w-full flex flex-col justify-center gap-2">
                            <div className="flex gap-1 items-center">
                                <FileUpload
                                    ref={fileUploadRef}
                                    chooseLabel="Документ жүктөө"
                                    mode="basic"
                                    name="demo[]"
                                    customUpload
                                    uploadHandler={() => {}}
                                    accept="application/pdf"
                                    onSelect={(e) =>
                                        setDocValue((prev) => ({
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
                                value={docValue.title}
                                onChange={(e) => {
                                    setDocValue((prev) => ({ ...prev, title: e.target.value }));
                                    setValue('title', e.target.value, { shouldValidate: true });
                                }}
                            />
                            <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>

                            <InputText placeholder="Мазмун" value={docValue.description} onChange={(e) => setDocValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />
                            <div className="flex justify-center">
                                {/* <Button disabled={!!errors.title || !docValue.file} label="Сактоо" onClick={handleAddDoc} /> */}
                                <Button label="Сактоо" disabled={!docValue.title.length || !!errors.title || !docValue.file} onClick={handleAddDoc} />
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center gap-4 py-4">
                            <div className="w-full flex flex-wrap justify-center gap-4">
                                {docShow ? (
                                    <NotFound titleMessage={'Сабак кошуу үчүн талааларды толтурунуз'} />
                                ) : (
                                    documents.map((item: lessonType) => (
                                        <>
                                            <LessonCard
                                                status="working"
                                                onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                                onDelete={(id: number) => handleDeleteDoc(id)}
                                                cardValue={{ title: item?.title, id: item.id, type: 'doc' }}
                                                cardBg={'#ddc4f51a'}
                                                type={{ typeValue: 'doc', icon: 'pi pi-file' }}
                                                typeColor={'var(--mainColor)'}
                                                lessonDate={'xx-xx'}
                                                urlForPDF={() => sentToPDF(item.document || '')}
                                                urlForDownload=""
                                            />
                                        </>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

    // fetch document
    const handleFetchDoc = async () => {
        // skeleton = false

        const data = await fetchLesson('doc', courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);

        if (data?.success) {
            if (data.documents) {
                // Присваиваю себе. Для отображения
                setDocValue({ title: '', description: '', file: null, url: '', video_link: '' });
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
        const token = getToken('access_token');
        const data = await addLesson('doc', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, docValue, 0);

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
            setDocValue({ title: '', description: '', file: null, url: '', video_link: '' });
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
            <div className="py-4 flex flex-col items-center gap-4">
                <div className="w-full flex flex-col justify-center gap-2">
                    <InputText
                        id="usefulLink"
                        type="url"
                        placeholder={'Шилтеме жүктөө'}
                        value={linksValue.url}
                        onChange={(e) => {
                            setLinksValue((prev) => ({ ...prev, url: e.target.value }));
                            setValue('usefulLink', e.target.value, { shouldValidate: true });
                        }}
                    />
                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>

                    <InputText
                        id="title"
                        type="text"
                        placeholder={'Аталышы'}
                        value={linksValue.title}
                        onChange={(e) => {
                            setLinksValue((prev) => ({ ...prev, title: e.target.value }));
                            setValue('title', e.target.value, { shouldValidate: true });
                        }}
                    />
                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>

                    <InputText placeholder="Мазмун" value={linksValue.description} onChange={(e) => setLinksValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />
                    <div className="flex justify-center">
                        <Button label="Сактоо" disabled={!linksValue.title.length || !linksValue.url?.length || !!errors.title || !!errors.usefulLink} onClick={handleAddLink} />
                    </div>
                </div>

                <div className="w-full flex flex-col items-center gap-4 py-4">
                    <div className="w-full flex flex-wrap justify-center gap-4">
                        {linksShow ? (
                            <NotFound titleMessage={'Сабак кошуу үчүн талааларды толтурунуз'} />
                        ) : (
                            links.map((item: lessonType) => (
                                <>
                                    <LessonCard
                                        status={'working'}
                                        onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                        onDelete={(id: number) => handleDeleteLink(id)}
                                        cardValue={{ title: item.title, id: item.id, desctiption: item?.description, type: 'url', photo: item?.photo }}
                                        cardBg={'#7bb78112'}
                                        type={{ typeValue: 'link', icon: 'pi pi-link' }}
                                        typeColor={'var(--mainColor)'}
                                        lessonDate={'xx-xx'}
                                        urlForPDF={() => ''}
                                        urlForDownload=""
                                    />
                                </>
                            ))
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
                setLinksValue({ title: '', description: '', file: null, url: '', video_link: '' });
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
        const token = getToken('access_token');

        const data = await addLesson('url', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, linksValue, 0);
        console.log(data);

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
            setLinksValue({ title: '', description: '', file: null, url: '', video_link: '' });
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
        console.log(e);

        setSelectedCity(e);
        setVideoValue({ title: '', description: '', file: null, url: '', video_link: '' });
    };

    const videoSection = () => {
        return (
            <div className="py-4 flex flex-col items-center gap-4">
                <div className="w-full flex items-start justify-center flex-col sm:flex-row gap-2">
                    {/* <Dropdown
                        value={selectedCity}
                        onChange={(e) => {
                            toggleVideoType(e.value);
                        }}
                        options={videoSelect}
                        optionLabel="name"
                        placeholder="Танданыз"
                        style={{backgroundColor: 'var(--mainColor', color: 'white'}}
                        panelStyle={{color: 'white'}}
                        className="w-[213px] sm:w-full md:w-14rem"
                    /> */}
                    <div className="w-full flex justify-center">
                        {/* {!selectedCity?.status ? ( */}
                            <div className="w-full flex flex-col items-center">
                                <InputText
                                    id="usefulLink"
                                    type="url"
                                    placeholder={'Шилтеме жүктөө'}
                                    value={videoValue.video_link}
                                    className='w-full'
                                    onChange={(e) => {
                                        setVideoValue((prev) => ({ ...prev, video_link: e.target.value }));
                                        setValue('usefulLink', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>
                            </div>
                        {/* // ) : (
                            // <FileUpload */}
                            {/* //     chooseLabel="Видео жүктөө"
                            //     mode="basic"
                            //     name="demo[]"
                            //     customUpload
                            //     uploadHandler={() => {}}
                            //     accept="video/"
                            //     onSelect={(e) =>
                            //         setVideoValue((prev) => ({
                            //             ...prev,
                            //             file: e.files[0]
                            //         }))
                            //     }
                            // />
                        // )} */}
                    </div>
                </div>
                <div className="w-full flex flex-col justify-center gap-2">
                    <InputText
                        id="title"
                        type="text"
                        placeholder={'Аталышы'}
                        value={videoValue.title}
                        onChange={(e) => {
                            setVideoValue((prev) => ({ ...prev, title: e.target.value }));
                            setValue('title', e.target.value, { shouldValidate: true });
                        }}
                    />
                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>

                    <InputText placeholder="Мазмун" value={videoValue.description} onChange={(e) => setVideoValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />
                    <div className="flex justify-center">
                        <Button label="Сактоо" disabled={!videoValue.title.length || !videoValue.video_link?.length || !!errors.title || !!errors.usefulLink} onClick={handleAddVideo} />
                    </div>
                </div>

                <div className="w-full flex flex-col items-center gap-4 py-4">
                    <div className="w-full flex flex-wrap justify-center gap-4">
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
                                        cardValue={{ title: item.title, id: item.id, desctiption: item?.description, type: 'video', photo: item?.photo }}
                                        cardBg={'#f1b1b31a'}
                                        type={{ typeValue: 'video', icon: 'pi pi-video' }}
                                        typeColor={'var(--mainColor)'}
                                        lessonDate={'xx-xx'}
                                        urlForPDF={() => ''}
                                        urlForDownload=""
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
        console.log(data);

        if (data && Array.isArray(data)) {
            setVideoTypes(data);
        }
    };

    // fetch video
    const handleFetchVideo = async () => {
        // skeleton = false
        const data = await fetchLesson('video', courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);
        // console.log(data);

        if (data?.success) {
            if (data.videos) {
                setVideoValue({ title: '', description: '', file: null, url: '', video_link: '' });
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
        const token = getToken('access_token');

        const data = await addLesson('video', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, videoValue, selectedCity?.id);
        console.log(data);

        if (data.success) {
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
            setVideoValue({ title: '', description: '', file: null, url: '', video_link: '' });
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
    }, [links, documents]);

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
            <FormModal title={'Сабакты жанылоо'} fetchValue={handleUpdate} clearValues={clearValues} visible={visible} setVisible={setVisisble} start={false}>
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
                                <InputText placeholder="Мазмун" value={editingLesson?.description && editingLesson?.description} onChange={(e) => setEditingLesson((prev) => prev && { ...prev, description: e.target.value })} className="w-full" />
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
