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
    const [textValue, setTextValue] = useState<string>('');
    const [videoLink, setVideoLink] = useState<string>('');
    const [usefulLink, setUsefullLink] = useState<string>('');

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

        setVideoLink(value);
        setValue('videoReq', value, { shouldValidate: true }); // ✅ обновляем форму и запускаем валидацию
    };

    const videoTyped = useTypingEffect('lreomlroemlfjslj sdlfkjlksdjk ksjdf l', videoTyping);
    const linkTyped = useTypingEffect('lreomlroemlfjslj sdlfkjlksdjk ksjdf lldfd', linkTyping);
    const docTyped = useTypingEffect('lreo lfjs djf lks sdjf lsdfk sdjfks ', docTyping);

    useEffect(() => {
        switch (activeIndex) {
            case 3:
                setVideoTyping(true); // включить эффект
                break;
            case 2:
                setLinkTyping(true);
                break;
            case 1:
                console.log(activeIndex);
                setDocTyping(true);
                break;
            default:
                setLinkTyping(false);
                setDocTyping(false);
                setVideoTyping(false); // выключить при уходе
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

    const typedJsx = (registrName, ) => (
        <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-full py-4 flex flex-col items-center gap-2">
                <div className="flex flex-col w-full">
                    <InputText
                        {...register('videoReq')}
                        type="text"
                        value={videoTyping ? videoTyped : videoLink}
                        onClick={() => setVideoTyping(false)}
                        onChange={(e) => {
                            setVideoLink(e.target.value);
                            setValue('videoReq', e.target.value, { shouldValidate: true });
                        }}
                        placeholder="https://..."
                        className="w-full p-2 sm:p-3"
                    />
                    {errors.videoReq && <b className="text-[red] text-[12px] ml-2">{errors.videoReq.message}</b>}
                </div>
                <InputText placeholder="Мазмун" className="w-full" />
                <Button type="submit" onClick={addVideo} label="Сактоо" disabled={!!errors.videoReq} />
            </div>
            <div className="flex justify-center">
                {/* <PrototypeCard value={linkTyping ? linkTyped : usefulLink}/> */}
                <LessonCard cardValue={'vremenno'} cardBg={'#f1b1b31a'} type={{ typeValue: 'Видео', icon: 'pi pi-video' }} typeColor={'var(--mainColor)'} lessonDate={'xx-xx-xx'} />
            </div>
        </div>
    );

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
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis porro dolore alias. Dignissimos, quis labore officiis aliquam consectetur ipsa quae. Voluptas a veniam sit quibusdam asperiores labore neque id
                                        maxime? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis porro dolore alias. Dignissimos, quis labore officiis aliquam consectetur ipsa quae. Voluptas a veniam sit quibusdam asperiores labore
                                        neque id maxime? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis porro dolore alias. Dignissimos, quis labore officiis aliquam consectetur ipsa quae. Voluptas a veniam sit quibusdam asperiores
                                        labore neque id maxime? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis porro dolore alias. Dignissimos, quis labore officiis aliquam consectetur ipsa quae. Voluptas a veniam sit quibusdam
                                        asperiores labore neque id maxime? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis porro dolore alias. Dignissimos, quis labore officiis aliquam consectetur ipsa quae. Voluptas a veniam sit
                                        quibusdam asperiores labore neque id maxime? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis porro dolore alias. Dignissimos, quis labore officiis aliquam consectetur ipsa quae. Voluptas a
                                        veniam sit quibusdam asperiores labore neque id maxime? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis porro dolore alias. Dignissimos, quis labore officiis aliquam consectetur ipsa quae.
                                        Voluptas a veniam sit quibusdam asperiores labore neque id maxime? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis porro dolore alias. Dignissimos, quis labore officiis aliquam consectetur
                                        ipsa quae. Voluptas a veniam sit quibusdam asperiores labore neque id maxime?
                                    </div>
                                    {/* <div className="px-2 py-4 w-full h-[100%] overflow-x-scroll  text-[16px] break-words whitespace-normal">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, at molestiae quam repellendus sapiente perferendis? Eius ducimus, quaerat neque illo quo dolorum repellat, culpa ratione est in nesciunt tempora quia.
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, at molestiae quam repellendus sapiente perferendis? Eius ducimus, quaerat neque illo quo dolorum repellat, culpa ratione est in nesciunt tempora quia.
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, at molestiae quam repellendus sapiente perferendis? Eius ducimus, quaerat neque illo quo dolorum repellat, culpa ratione est in nesciunt tempora quia.
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, at molestiae quam repellendus sapiente perferendis? Eius ducimus, quaerat neque illo quo dolorum repellat, culpa ratione est in nesciunt tempora quia.
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, at molestiae quam repellendus sapiente perferendis? Eius ducimus, quaerat neque illo quo dolorum repellat, culpa ratione est in nesciunt tempora quia.
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, at molestiae quam repellendus sapiente perferendis? Eius ducimus, quaerat neque illo quo dolorum repellat, culpa ratione est in nesciunt tempora quia.
                                    {
                                        // <div dangerouslySetInnerHTML={{__html: textValue}}/>
                                    }
                                </div> */}
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
                            <div className="w-full">
                                <div className="flex gap-2 items-center">
                                    <FileUpload chooseLabel="Загрузить документ" mode="basic" name="demo[]" url="/api/upload" accept="document/*" />
                                    <span>{docTyping ? docTyped : ''}</span>
                                </div>
                                <div className="py-4 flex flex-col items-center gap-2">
                                    <InputText placeholder="Мазмун" className="w-full" />
                                    <Button type="submit" onClick={addVideo} label="Сактоо" className="" disabled={!!errors.videoReq} />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                {/* <PrototypeCard value={linkTyping ? linkTyped : usefulLink}/> */}
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
                            <div className="w-full flex flex-col items-center gap-2">
                                <div className="flex flex-col w-full">
                                    <InputText
                                        {...register('usefulLink')}
                                        type="text"
                                        value={linkTyping ? linkTyped : usefulLink}
                                        onClick={() => setLinkTyping(false)}
                                        onChange={(e) => {
                                            setUsefullLink(e.target.value);
                                            setValue('usefulLink', e.target.value, { shouldValidate: true });
                                        }}
                                        placeholder="https://..."
                                        className="w-full p-2 sm:p-3"
                                    />
                                    {errors.usefulLink && <b className="text-[red] text-[12px] ml-2">{errors.usefulLink.message}</b>}
                                </div>
                                <InputText placeholder="Мазмун" className="w-full" />
                                <Button type="submit" onClick={addVideo} label="Сактоо" disabled={!!errors.videoReq} />
                            </div>
                            <div className="flex justify-center">
                                {/* <PrototypeCard value={linkTyping ? linkTyped : usefulLink}/> */}
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
                            <div className="w-full py-4 flex flex-col items-center gap-2">
                                <div className="flex flex-col w-full">
                                    <InputText
                                        {...register('videoReq')}
                                        type="text"
                                        value={videoTyping ? videoTyped : videoLink}
                                        onClick={() => setVideoTyping(false)}
                                        onChange={(e) => {
                                            setVideoLink(e.target.value);
                                            setValue('videoReq', e.target.value, { shouldValidate: true });
                                        }}
                                        placeholder="https://..."
                                        className="w-full p-2 sm:p-3"
                                    />
                                    {errors.videoReq && <b className="text-[red] text-[12px] ml-2">{errors.videoReq.message}</b>}
                                </div>
                                <InputText placeholder="Мазмун" className="w-full" />
                                <Button type="submit" onClick={addVideo} label="Сактоо" disabled={!!errors.videoReq} />
                            </div>
                            <div className="flex justify-center">
                                {/* <PrototypeCard value={linkTyping ? linkTyped : usefulLink}/> */}
                                <LessonCard cardValue={'vremenno'} cardBg={'#f1b1b31a'} type={{ typeValue: 'Видео', icon: 'pi pi-video' }} typeColor={'var(--mainColor)'} lessonDate={'xx-xx-xx'} />
                            </div>
                        </div>
                    )}
                </TabPanel>
            </TabView>
        </div>
    );
}
