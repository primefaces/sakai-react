'use client';

import { useEffect, useRef, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import CKEditorWrapper from '@/app/components/CKEditorWrapper.tsx';
import { Button } from 'primereact/button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { lessonSchema } from '@/schemas/lessonSchema';
import { InputText } from 'primereact/inputtext';
import FancyLinkBtn from '@/app/components/buttons/FancyLinkBtn';
import { LoginType } from '@/types/login';
import useTypingEffect from '@/hooks/useTypingEffect';
import Test from '@/app/components/Test';
import { FileUpload } from 'primereact/fileupload';
import PrototypeCard from '@/app/components/cards/PrototypeCard';
import LessonCard from '@/app/components/cards/LessonCard';
import Tiered from '@/app/components/popUp/Tiered';
import { Menu } from 'primereact/menu';
import Redacting from '@/app/components/popUp/Redacting';

export default function Lesson() {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [contentShow, setContentShow] = useState<boolean>(true);
    const [textShow, setTextShow] = useState<boolean>(false);

    // for typing effects
    const [videoTyping, setVideoTyping] = useState(true);
    const [linkTyping, setLinkTyping] = useState(true);
    const [docTyping, setDocTyping] = useState(true);

    const handleTabChange = (e) => {
        // console.log('Переход на шаг:', e);
        //     // fetchDataForStep(e.index);
        setActiveIndex(e.index);
    };

    const handleText = (e: string) => {
        setTextValue(e);
    };

    const addVideo = () => {};

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(lessonSchema),
        mode: 'onChange'
    });

    const handleVideoChange = (value: string) => {
        console.log(value);
        setValue('videoReq', value, { shouldValidate: true });
    };

    const videoTyped = useTypingEffect('this is video', videoTyping);
    const linkTyped = useTypingEffect('ёп тыгыдык дыгыдык', linkTyping);
    const docTyped = useTypingEffect('this is document ', docTyping);

    const [sentValues, setSentValues] = useState({
        text: { typingId: '', text: '', register: '' },
        doc: { typingId: 'docTyping', doc: '', register: '' },
        link: { typingId: 'linkTyping', link: '', register: 'usefulLink' },
        video: { typingId: 'videoTyping', video: '', register: 'videoReq' }
    });

    useEffect(() => {
        switch (activeIndex) {
            case 3:
                setVideoTyping((prev) => !prev); // включить эффект
                break;
            case 2:
                setLinkTyping((prev) => !prev);
                break;
            case 1:
                setDocTyping((prev) => !prev);
                break;
            default:
                setLinkTyping((prev) => !prev);
                setDocTyping((prev) => !prev);
                setVideoTyping((prev) => !prev); // выключить при уходе
        }
    }, [activeIndex]);

    const redactor = [
        {
            label: '',
            icon: 'pi pi-pencil',
            command: () => {
                alert('redactor');
            }
        },
        {
            label: '',
            icon: 'pi pi-user',
            command: () => {
                alert('delete');
            }
        }
    ];

    useEffect(() => {
        console.log(sentValues['video'].register);
    }, [sentValues]);

    const typedJsx = (type: string) => {
        const typingMap: Record<string, string | false> = {
            videoTyping: videoTyping && videoTyped,
            linkTyping: linkTyping && linkTyped,
            docTyping: docTyping && docTyped
        };
        const value = sentValues[type]?.[type] ?? '';

        const currentTypingId = sentValues[type].typingId;
        const placeholder = typingMap[currentTypingId] || '';
        return (
            <div className="w-full py-4 flex flex-col items-center gap-2">
                <div className="flex flex-col w-full">
                    {type === 'doc' ? (
                        <>
                            <FileUpload chooseLabel="Загрузить документ" mode="basic" name="demo[]" url="/api/upload" accept="document/*" />
                            <span>{sentValues[type].typingId === 'docTyping' && docTyping ? docTyped : ''}</span>
                        </>
                    ) : (
                        <>
                            <InputText
                                {...register(sentValues[type].register)}
                                type="text"
                                placeholder={placeholder}
                                value={value}
                                onClick={() => {
                                    if (type === 'video') setVideoTyping(false);
                                    if (type === 'link') setLinkTyping(false);
                                }}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSentValues((prev) => ({
                                        ...prev,
                                        [type]: {
                                            ...prev[type],
                                            [type]: val
                                        }
                                    }));

                                    if (type === 'video') setVideoLink(val);
                                    if (type === 'link') setUsefullLink(val);

                                    setValue(sentValues[type].register, val, { shouldValidate: true });
                                }}
                                className="w-full p-2 sm:p-3"
                            />
                            {errors[sentValues[type].register] && <b className="text-[red] text-[12px] ml-2">{errors[sentValues[type].register].message}</b>}
                        </>
                    )}
                </div>
                <InputText placeholder="Мазмун" className="w-full" />
                <Button type="submit" label="Сактоо" onClick={addVideo} disabled={!!errors.videoReq} />
            </div>
        );
    };

    return (
        <div>
            <TabView
                onTabChange={(e) => handleTabChange(e)}
                activeIndex={activeIndex}
                className=""
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
                            <button onClick={() => setTextShow((prev) => !prev)}>click</button>
                            {textShow ? (
                                <div className="w-[800px] h-[340px] m-auto p-2 rounded" style={{ boxShadow: '2px 2px 21px -8px rgba(34, 60, 80, 0.2) inset' }}>
                                    <div className="flex flex-col gap-2 border-b p-1 border-[var(--borderBottomColor)]">
                                        <div className="flex items-center justify-between">
                                            <div className={`flex gap-1 items-center font-bold text-[var(--mainColor)]`}>
                                                <i className={`pi pi-pen-to-square`}></i>
                                                <span>Текст</span>
                                            </div>

                                            <Redacting redactor={redactor} textSize={'14px'} />
                                            {/* <MySkeleton size={{ width: '12px', height: '15px' }} /> */}
                                        </div>
                                        <div className={`flex gap-1 items-center`}>
                                            <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                                            <span>xx-xx-xx</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-[80%] break-words whitespace-normal overflow-scroll">
                                    </div>
                                </div>
                            ) : (
                                <div className="py-4 flex flex-col gap-16 items-center m-0">
                                    <CKEditorWrapper textValue={handleText} />
                                    <Button label="Сактоо" />
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
                    {contentShow && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            {typedJsx('doc')}
                            <div className="flex justify-center">
                                <LessonCard cardValue={'vremenno'} cardBg={'#ddc4f51a'} type={{ typeValue: 'Документтер', icon: 'pi pi-folder' }} typeColor={'var(--mainColor)'} lessonDate={'xx-xx-xx'} />
                            </div>
                        </div>
                    )}
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
                    {contentShow && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            {typedJsx('link')}
                            <div className="flex justify-center">
                                <LessonCard cardValue={'vremenno'} cardBg={'#7bb78112'} type={{ typeValue: 'Шилтеме', icon: 'pi pi-link' }} typeColor={'var(--mainColor)'} lessonDate={'xx-xx-xx'} />
                            </div>
                        </div>
                    )}
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
                            {typedJsx('video')}
                            <div className="flex justify-center">
                                <LessonCard cardValue={'vremenno'} cardBg={'#f1b1b31a'} type={{ typeValue: 'Видео', icon: 'pi pi-video' }} typeColor={'var(--mainColor)'} lessonDate={'xx-xx-xx'} />
                            </div>
                        </div>
                    )}
                </TabPanel>
            </TabView>
        </div>
    );
}
