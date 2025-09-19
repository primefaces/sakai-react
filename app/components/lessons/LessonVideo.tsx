'use client';

import { lessonSchema } from '@/schemas/lessonSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NotFound } from '../NotFound';
import LessonCard from '../cards/LessonCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { getToken } from '@/utils/auth';
import { addDocument, addVideo, deleteDocument, deleteVideo, fetchElement, updateDocument, updateVideo } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import FormModal from '../popUp/FormModal';
import { FileWithPreview } from '@/types/fileuploadPreview';

export default function LessonVideo({ element, content, fetchPropElement, clearProp }: { element: mainStepsType; content: any; fetchPropElement: (id: number) => void; clearProp: boolean }) {
    interface contentType {
        course_id: number | null;
        created_at: string;
        description: string | null;
        document: string;
        id: number;
        lesson_id: number;
        status: true;
        title: string;
        updated_at: string;
        user_id: number;
        link: File | null;
        cover: string | null;
        cover_url: string;
    }

    interface videoType {
        name: string;
        status: boolean;
        id: number;
    }

    interface videoValueType {
        title: string;
        description: string | null; // вместо ? → строго string | null
        document?: File | null;
        url?: string | null;
        video_link: string;
        video_type_id: number; // без null
        cover: File | null;
    }

    const fileUploadRef = useRef<FileUpload>(null);

    // videos
    const [video, setVideo] = useState<contentType>();
    const [selectedCity, setSelectedCity] = useState({ name: '', status: true, id: 1 });
    const [videoCall, setVideoCall] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const [videoValue, setVideoValue] = useState<{ title: string; description: string; file: null; url: string; video_link: string; cover: File | null; link: null }>({
        title: '',
        description: '',
        file: null,
        url: '',
        video_link: '',
        cover: null,
        link: null
    });
    const [videoShow, setVideoShow] = useState<boolean>(false);
    const [imageState, setImageState] = useState<string | null>(null);

    // auxiliary
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);
    const [visible, setVisisble] = useState(false);
    const [editingLesson, setEditingLesson] = useState<videoValueType | null>(null);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [additional, setAdditional] = useState<{ doc: boolean; link: boolean; video: boolean }>({ doc: false, link: false, video: false });
    const [selectType, setSelectType] = useState('');
    const [selectId, setSelectId] = useState<number | null>(null);
    const [contentShow, setContentShow] = useState(false);

    const clearFile = () => {
        fileUploadRef.current?.clear();
        setAdditional((prev) => ({ ...prev, video: false }));
        setImageState(null);
        setVideoValue((prev) => ({
            ...prev,
            cover: null
        }));
    };

    const clearValues = () => {
        clearFile();
        setEditingLesson(null);
        setVideoValue({ title: '', description: '', file: null, url: '', video_link: '', cover: null, link: null });
        setSelectId(null);
        setSelectType('');
    };

    const toggleSpinner = () => {
        setProgressSpinner(true);
        setInterval(() => {
            setProgressSpinner(false);
        }, 1000);
    };

    const handleVideoCall = (value: string | null) => {
        console.log(value);

        if (!value) {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при обработке видео', detail: '' }
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
                value: { severity: 'error', summary: 'Ошибка при обработке видео', detail: '' }
            });
            return null; // не удалось получить ID
        }
        // return `https://www.youtube.com/embed/${videoId}`;
        setVideoLink(`https://www.youtube.com/embed/${videoId}`);
        setVideoCall(true);
        // setVisisble(true);
    };

    // validate
    const {
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(lessonSchema),
        mode: 'onChange'
    });

    const toggleVideoType = (e: videoType) => {
        setSelectedCity(e);
        setVideoValue({ title: '', description: '', file: null, url: '', video_link: '', cover: null, link: null });
    };

    const selectedForEditing = (id: number, type: string) => {
        console.log(id, type);
        setSelectType(type);
        setSelectId(id);
        setVisisble(true);
        editing();
    };

    const onSelect = (e: FileUploadSelectEvent & { files: FileWithPreview[] }) => {
        if (e.files.length > 0) {
            setImageState(e.files[0].objectURL);
            setVideoValue((prev) => ({
                ...prev,
                cover: e.files[0]
            }));
        }
    };

    const editing = async () => {
        const data = await fetchElement(element.lesson_id, element.id);
        if (data.success) {
            // setElement({ content: data.content, step: data.step });
            setEditingLesson({ title: data.content.title, video_type_id: data.content.video_type_id, video_link: data.content.link, cover: null, description: data.content.description });
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

    const handleAddVideo = async () => {
        toggleSpinner();
        const data = await addVideo(videoValue, element.lesson_id, 1, element.type_id, element.id);
        console.log(data);

        if (data.success) {
            fetchPropElement(element.id);
            clearValues();
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
    };

    // delete video
    const handleDeleteVideo = async (id: number) => {
        const data = await deleteVideo(element.lesson_id, id);
        console.log(data);

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
    const handleUpdateVideo = async () => {
        const token = getToken('access_token');
        const data = await updateVideo(token, editingLesson, video?.lesson_id ? Number(video?.lesson_id) : null, Number(selectId), 1, element.type.id, element.type.id);

        if (data?.success) {
            fetchPropElement(element.id);
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно изменено!', detail: '' }
            });
        } else {
            setEditingLesson(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при изменении!', detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const videoSection = () => {
        return (
            <div className="py-1 sm:py-3 flex flex-col items-center gap-3">
                {!contentShow ? (
                    <div className="w-full flex flex-col items-center gap-1">
                        <div className="w-full flex items-center justify-center flex-col sm:flex-row gap-2">
                            <div className="w-full flex justify-center">
                                <div className="w-full flex flex-col items-center">
                                    <InputText
                                        id="usefulLink"
                                        type="url"
                                        placeholder={'Загрузить ссылку'}
                                        value={videoValue.video_link}
                                        className="w-full"
                                        onChange={(e) => {
                                            setVideoValue((prev) => ({ ...prev, video_link: e.target.value }));
                                            setValue('usefulLink', e.target.value, { shouldValidate: true });
                                        }}
                                    />
                                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-center gap-2">
                            <div>
                                <InputText
                                    id="title"
                                    type="text"
                                    placeholder={'Название'}
                                    className='w-full'
                                    value={videoValue.title}
                                    onChange={(e) => {
                                        setVideoValue((prev) => ({ ...prev, title: e.target.value }));
                                        setValue('title', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                            </div>
                            {additional.video && (
                                <div>
                                    <InputText placeholder="Описание" value={videoValue.description} onChange={(e) => setVideoValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />
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
                                {/* <Button disabled={!!errors.title || !docValue.file} label="Добавить" onClick={handleAddDoc} /> */}
                                <div className="absolute">
                                    <span className="cursor-pointer ml-1 text-[13px] sm:text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, video: !prev.video }))}>
                                        Дополнительно {additional.video ? '-' : '+'}
                                    </span>
                                </div>
                                <div className="w-full flex gap-1 justify-center items-center mt-4 sm:m-0">
                                    <Button label="Сохранить" disabled={progressSpinner || !videoValue.title.length || !videoValue.video_link?.length || !!errors.title || !!errors.usefulLink} onClick={() => handleAddVideo()} />
                                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center gap-4 py-2">
                        <div className="w-full flex flex-wrap justify-center gap-4">
                            {/* <Dialog
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
                            </Dialog> */}
                            {videoShow ? (
                                <NotFound titleMessage={'Заполните поля для добавления урока'} />
                            ) : (
                                <>
                                    {!videoCall ? (
                                        video && (
                                            <LessonCard
                                                status={'working'}
                                                onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                                onDelete={(id: number) => handleDeleteVideo(id)}
                                                cardValue={{ title: video.title, id: video.id, desctiption: video?.description || '', type: 'video', photo: video?.cover_url }}
                                                cardBg={'#ddc4f51a'}
                                                type={{ typeValue: 'video', icon: 'pi pi-video' }}
                                                typeColor={'var(--mainColor)'}
                                                lessonDate={new Date(video.created_at).toISOString().slice(0, 10)}
                                                urlForPDF={() => ''}
                                                urlForDownload=""
                                                videoVisible={() => handleVideoCall(String(video?.link))}
                                            />
                                        )
                                    ) : (
                                        <div className="w-full flex flex-col justify-center items-center">
                                            <div className="w-[90%] flex justify-start">
                                                <i className="pi pi-times sm:text-2xl my-2 cursor-pointer" onClick={() => setVideoCall(false)}></i>
                                            </div>
                                            <iframe
                                                className="w-[90%] h-[200px] md:h-[400px]"
                                                // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                                src={videoLink}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (content) {
            setContentShow(true);
            setVideo(content);
        } else {
            setContentShow(false);
        }
    }, [content]);

    useEffect(() => {
        setVideoValue({ title: '', description: '', file: null, url: '', video_link: '', cover: null, link: null });
    }, [element]);

    return (
        <div>
            <FormModal title={'Обновить урок'} fetchValue={() => handleUpdateVideo()} clearValues={clearValues} visible={visible} setVisible={setVisisble} start={false}>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 items-center justify-center">
                        {
                            <>
                                {/* {editingLesson?.video_type_id ? ( */}
                                <div className="w-full flex flex-col items-center">
                                    <InputText
                                        type="url"
                                        placeholder="Ссылка"
                                        value={String(editingLesson?.video_link)}
                                        className="w-full"
                                        onChange={(e) => {
                                            setEditingLesson((prev) => prev && { ...prev, video_link: e.target.value });
                                            setValue('usefulLink', e.target.value, { shouldValidate: true });
                                        }}
                                    />
                                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>
                                </div>
                                {/* ) : ( */}
                                <>
                                    {/* <FileUpload
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
                                        <span>{String(editingLesson?.video_link)}</span> */}
                                </>
                                {/* )} */}
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
                                <InputText placeholder="Описание" value={editingLesson?.description && editingLesson?.description} onChange={(e) => setEditingLesson((prev) => prev && { ...prev, description: e.target.value })} className="w-full" />
                            </>
                        }
                    </div>
                </div>
            </FormModal>
            {!clearProp && videoSection()}
        </div>
    );
}
