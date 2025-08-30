'use client';

import LessonCard from '@/app/components/cards/LessonCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchDocuments, fetchLinks } from '@/services/studentLessons';
import { fetchMainLesson } from '@/services/studentMain';
import { lessonType } from '@/types/lessonType';
import { TabViewChange } from '@/types/tabViewChange';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { TabPanel, TabView } from 'primereact/tabview';
import { useContext, useEffect, useState } from 'react';

export default function StudentLessons() {
    const { lesson_id } = useParams();
    const router = useRouter();

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [mainLesson, setMainLesson] = useState({});
    const [hasLessons, setHasLessons] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [contentShow, setContentShow] = useState<boolean>(false);

    // doc
    const [documents, setDocuments] = useState([]);
    const [docShow, setDocShow] = useState<boolean>(false);

    // link
    const [link, setLink] = useState([]);
    const [linkShow, setLinkShow] = useState<boolean>(false);

    const [navigaion, setNavigation] = useState({ prev: null, next: null });

    const { setMessage, contextFetchStudentThemes, contextStudentThemes } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const media = useMediaQuery('(max-width: 640px)');

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    const handleMainLesson = async () => {
        const data = await fetchMainLesson(lesson_id ? Number(lesson_id) : null);
        console.log(data);
        if (data && data?.id) {
            if (data.next_id) {
                setNavigation((prev) => ({ ...prev, next: data.next_id }));
            }
            if (data.previous_id) {
                setNavigation((prev) => ({ ...prev, prev: data.previous_id }));
            }
            setHasLessons(false);
            setMainLesson(data);
        } else {
            setHasLessons(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    // fetch document
    const handleFetchDoc = async () => {
        // skeleton = false

        const data = await fetchDocuments(lesson_id ? Number(lesson_id) : null);
        console.log(data);
        setSkeleton(true);
        if (data && Array.isArray(data)) {
            setDocuments(data);
            setDocShow(false);
            setSkeleton(false);
        } else {
            setSkeleton(false);
            setDocShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    // fetch link
    const handleFetchLink = async () => {
        const data = await fetchLinks(lesson_id ? Number(lesson_id) : null);
        console.log(data);
        setSkeleton(true);
        if (data && Array.isArray(data)) {
            setLink(data);
            setLinkShow(false);
            setSkeleton(false);
        } else {
            setSkeleton(false);
            setLinkShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const navigateMainLesson = async (id: number) => {
        setSkeleton(true);
        router.push(`/teaching/lesson/${id}`);
    };

    const handleTabChange = (e: TabViewChange) => {
        if (e.index === 0) {
            handleFetchDoc();
        } else if (e.index === 1) {
            handleFetchLink();
        }
        setActiveIndex(e.index);
    };

    useEffect(() => {
        handleMainLesson();
        handleFetchDoc();
    }, []);

    useEffect(() => {
        console.log('Навигация ', navigaion);
    }, [navigaion]);

    useEffect(() => {
        link.length < 1 ? setLinkShow(true) : setLinkShow(false);
        documents.length < 1 ? setDocShow(true) : setDocShow(false);
    }, [link, documents]);

    // doc section
    const sentToPDF = (url) => {
        console.log(url);
        router.push(`/pdf/${url}`);
    };

    const docSection = (
        <div>
            <div className="w-full flex flex-col items-center gap-4 py-4">
                <div className="w-full flex flex-wrap justify-center gap-4">
                    {docShow ? (
                        <NotFound titleMessage={'Сабак убактылуу жеткиликтүү эмес'} />
                    ) : (
                        documents.map((item: lessonType) => (
                            <>
                                <LessonCard
                                    status="student"
                                    // onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                    // onDelete={(id: number) => handleDeleteDoc(id)}
                                    cardValue={{ title: item?.title, id: item.id, type: 'doc' }}
                                    cardBg={'#ddc4f51a'}
                                    type={{ typeValue: 'doc', icon: 'pi pi-file' }}
                                    typeColor={'var(--mainColor)'}
                                    lessonDate={'xx-xx'}
                                    urlForPDF={() => sentToPDF(item.document)}
                                />
                            </>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    // link section
    const linkSecion = (
        <div>
            <div className="w-full flex flex-col items-center gap-4 py-4">
                <div className="w-full flex flex-wrap justify-center gap-4">
                    {docShow ? (
                        <NotFound titleMessage={'Сабак убактылуу жеткиликтүү эмес'} />
                    ) : (
                        link.map((item: lessonType) => (
                            <>
                                <LessonCard
                                    status="student"
                                    // onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                    // onDelete={(id: number) => handleDeleteDoc(id)}
                                    cardValue={{ title: item?.title, id: item.id, type: 'doc', url: item?.url && item.url }}
                                    cardBg={'#ddc4f51a'}
                                    type={{ typeValue: 'link', icon: 'pi pi-file' }}
                                    typeColor={'var(--mainColor)'}
                                    lessonDate={'xx-xx'}
                                    urlForPDF={() => {}}
                                />
                            </>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="main-bg">
            {/* info section */}
            {skeleton ? (
                <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
            ) : (
                <div className="w-full bg-[var(--titleColor)] relative flex flex-col justify-center items-center rounded text-white p-[30px] md:p-[40px] mb-4 mt-2">
                    <div className={`w-full flex justify-center`}>
                        <h1 style={{ color: 'white', fontSize: media ? '28px' : '36px', textAlign: 'center' }}>{mainLesson?.title}</h1>
                    </div>
                    <div className="text-center">Home/theme</div>
                </div>
            )}

            <div className="max-h-[500px] shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] overflow-y-scroll">
                <div className="w-[250px] sm:w-[500px] m-auto ">
                    <span className="text-center block">Аткарылды:</span>
                    <div className="w-[250px] sm:w-[500px] m-auto p-1 bg-white">
                        <ProgressBar value={50} style={{ backgroundColor: '', color: 'green', height: '13px', fontSize: '12px' }}>
                            Аткарылды
                        </ProgressBar>
                    </div>
                </div>
                <TabView
                    onTabChange={(e) => handleTabChange(e)}
                    activeIndex={activeIndex}
                    pt={{
                        nav: { className: 'flex flex-wrap justify-around' },
                        panelContainer: { className: 'flex-1 pl-4' }
                    }}
                >
                    {/* DOC */}
                    <TabPanel
                        pt={{
                            headerAction: { className: 'font-italic text-[12px] sm:text-[14px]' }
                        }}
                        header="Документ"
                        className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                    >
                        {skeleton ? <GroupSkeleton count={5} size={{ width: '100%', height: '3rem' }} /> : docSection}
                    </TabPanel>

                    {/* USEFUL LINKS */}
                    <TabPanel
                        pt={{
                            headerAction: { className: 'font-italic text-center text-[12px] sm:text-[14px]' }
                        }}
                        header="Шилтеме"
                        className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                    >
                        {skeleton ? <GroupSkeleton count={5} size={{ width: '100%', height: '3rem' }} /> : linkSecion}
                    </TabPanel>

                    {/* VIDEO */}
                    <TabPanel
                        pt={{
                            headerAction: { className: 'font-italic text-[12px] sm:text-[14px]' }
                        }}
                        header="Видео"
                        className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                    >
                        {/* {contentShow && <LessonTyping mainType="video" courseId={courseId} lessonId={lessonId} />} */}
                        {/* && (
                             <div className="flex flex-col items-center gap-4 py-4">
                                 <div className="flex justify-center">
                                     <LessonCard cardValue={'vremenno'} cardBg={'#f1b1b31a'} type={{ typeValue: 'Видео', icon: 'pi pi-video' }} typeColor={'var(--mainColor)'} lessonDate={'xx-xx-xx'} />
                                 </div>
                             </div>
                         ) */}
                    </TabPanel>
                </TabView>
            </div>

            {/* navigaion section */}
            {skeleton ? (
                <GroupSkeleton count={1} size={{ width: '100%', height: '1rem' }} />
            ) : (
                <div className="w-[240px] py-2 m-auto flex justify-center items-center gap-1">
                    {navigaion.next && navigaion.prev && (
                        <div className="w-full flex justify-between gap-1">
                            <Button label="Артка" onClick={() => navigateMainLesson(navigaion.prev)} className="w-1/2" icon="pi pi-arrow-left" />
                            <Button label="Кийинки" onClick={() => navigateMainLesson(navigaion.next)} className="w-1/2" iconPos="right" icon="pi pi-arrow-right" />
                        </div>
                    )}

                    {navigaion.prev && !navigaion.next ? (
                        <div className="w-full">
                            <Button label="Артка" onClick={() => navigateMainLesson(navigaion.prev)} className="w-full duration-75" icon="pi pi-arrow-left" />{' '}
                        </div>
                    ) : (
                        ''
                    )}

                    {navigaion.next && !navigaion.prev ? (
                        <div className="w-full">
                            <Button label="Кийинки" onClick={() => navigateMainLesson(navigaion.next)} className="w-full duration-75" iconPos="right" icon="pi pi-arrow-right" />
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            )}
        </div>
    );
}
