'use client';

import LessonCard from '@/app/components/cards/LessonCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useBreadCrumbs from '@/hooks/useBreadCrumbs';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import useShortText from '@/hooks/useShortText';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchDocuments, fetchLinks, fetchVideo } from '@/services/studentLessons';
import { fetchMainLesson } from '@/services/studentMain';
import { lessonType } from '@/types/lessonType';
import { TabViewChange } from '@/types/tabViewChange';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { TabPanel, TabView } from 'primereact/tabview';
import { useContext, useEffect, useState } from 'react';

export default function StudentLessons() {
    const { lesson_id, studentThemeId } = useParams();
    const params = useParams();
    const router = useRouter();

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [mainLesson, setMainLesson] = useState<{ title: string }>({ title: '' });
    const [hasLessons, setHasLessons] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const x = localStorage.getItem('currentBreadCrumb');
    const parseX = JSON.parse('x');
    const [streamId, setStreamId] = useState<string>(parseX.studentStream || '');

    // doc
    const [documents, setDocuments] = useState<lessonType[]>([]);
    const [docShow, setDocShow] = useState<boolean>(false);

    // link
    const [link, setLink] = useState<lessonType[]>([]);
    const [linkShow, setLinkShow] = useState<boolean>(false);

    // video
    const [video, setVideo] = useState<lessonType[]>([]);
    const [videoShow, setVideoShow] = useState<boolean>(false);
    const [videoCall, setVideoCall] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const [navigaion, setNavigation] = useState<{ prev: number | null; next: number | null }>({ prev: null, next: null });

    const { setMessage, contextFetchStudentThemes, contextStudentThemes, crumbUrls } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const teachingBreadCrumb = [
        {
            id: 1,
            url: '/',
            title: '',
            icon: true,
            parent_id: null
        },
        {
            id: 2,
            url: '/teaching',
            title: 'Окуу план',
            parent_id: 1
        },
        {
            id: 3,
            url: `/teaching/${studentThemeId}/${streamId && streamId}`,
            title: 'Темалар',
            parent_id: 2
        },
        {
            id: 4,
            url: '/teaching/lesson/:course_id/:lesson_id',
            title: 'Сабактар',
            parent_id: 3
        }
    ];

    const pathname = usePathname();
    const breadcrumb = useBreadCrumbs(teachingBreadCrumb, pathname);

    const media = useMediaQuery('(max-width: 640px)');
    const titleShort = useShortText(mainLesson?.title, 35);

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
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

    const handleMainLesson = async () => {
        const data = await fetchMainLesson(lesson_id ? Number(lesson_id) : null);
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

    // fetch link
    const handleFetchVideo = async () => {
        const data = await fetchVideo(lesson_id ? Number(lesson_id) : null);
        setSkeleton(true);
        if (data && Array.isArray(data)) {
            setVideo(data);
            setVideoShow(false);
            setSkeleton(false);
        } else {
            setSkeleton(false);
            setVideoShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const navigateMainLesson = async (id: number | null) => {
        setSkeleton(true);
        router.push(`/teaching/lesson/${lesson_id}/${id}`);
    };

    const handleTabChange = (e: TabViewChange) => {
        if (e.index === 0) {
            handleFetchDoc();
        } else if (e.index === 1) {
            handleFetchLink();
        } else if (e.index === 2) {
            handleFetchVideo();
        }
        setActiveIndex(e.index);
    };

    useEffect(() => {
        // const x = localStorage.getItem('currentBreadCrumb');
        // const parseX = JSON.parse(x);
        // console.log('Eto x', parseX);
        // console.log('Eto x', x);

        setStreamId(parseX.studentStream);
    }, [pathname]);

    useEffect(() => {
        handleMainLesson();
        handleFetchDoc();
    }, []);

    useEffect(() => {
        console.log('streamId ', streamId);
    }, [streamId]);

    useEffect(() => {
        link.length < 1 ? setLinkShow(true) : setLinkShow(false);
        documents.length < 1 ? setDocShow(true) : setDocShow(false);
        video.length < 1 ? setVideoShow(true) : setVideoShow(false);
    }, [link, documents, video]);

    // doc section
    const sentToPDF = (url: string) => {
        console.log(url);
        router.push(`/pdf/${url}`);
    };

    const docSection = (
        <div>
            <div className="w-full flex flex-col items-center gap-4 py-4">
                <div className="w-full flex flex-wrap justify-center gap-4">
                    {docShow ? (
                        <NotFound titleMessage={'Документтер жеткиликтүү эмес'} />
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
                                    urlForPDF={() => sentToPDF(item?.document ? item.document : '')}
                                    urlForDownload={item?.document_path || ''}
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
                    {linkShow ? (
                        <NotFound titleMessage={'Шилтемелер жеткиликтүү эмес'} />
                    ) : (
                        link.map((item: lessonType) => (
                            <>
                                <LessonCard
                                    status="student"
                                    // onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                    // onDelete={(id: number) => handleDeleteDoc(id)}
                                    cardValue={{ title: item?.title, id: item.id, type: 'link', url: item?.url && item.url }}
                                    cardBg={'#ddc4f51a'}
                                    type={{ typeValue: 'link', icon: 'pi pi-file' }}
                                    typeColor={'var(--mainColor)'}
                                    lessonDate={'xx-xx'}
                                    urlForPDF={() => {}}
                                    urlForDownload={item?.document_path || ''}
                                />
                            </>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    // video section
    const videoSecion = (
        <div>
            <div className="w-full flex flex-col items-center gap-4 py-4">
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
                        <NotFound titleMessage={'Видеолор жеткиликтүү эмес'} />
                    ) : (
                        video.map((item: lessonType) => (
                            <>
                                <LessonCard
                                    status="student"
                                    // onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                    // onDelete={(id: number) => handleDeleteDoc(id)}
                                    cardValue={{ title: item?.title, id: item.id, type: 'video', url: item?.url && item.url, photo: item?.cover_url }}
                                    cardBg={'#fff'}
                                    type={{ typeValue: 'video', icon: 'pi pi-video' }}
                                    typeColor={'var(--mainColor)'}
                                    lessonDate={'xx-xx'}
                                    urlForPDF={() => {}}
                                    urlForDownload={item?.document_path || ''}
                                    videoVisible={() => handleVideoCall(String(item?.link))}
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
                <div className="w-full bg-[var(--titleColor)] relative flex flex-col justify-center items-center rounded text-white pb-4 p-[30px] md:p-[40px] mb-4 mt-2">
                    <div className={`w-full flex justify-center`}>
                        <h1 style={{ color: 'white', fontSize: media ? '24px' : '28px', textAlign: 'center' }}>{titleShort}</h1>
                    </div>
                    <div className="w-full">{breadcrumb}</div>
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
                            headerAction: { className: 'cursor-pointer font-italic text-[12px] sm:text-[14px]' }
                        }}
                        header="Документ"
                        className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                    >
                        {skeleton ? <GroupSkeleton count={5} size={{ width: '100%', height: '3rem' }} /> : docSection}
                    </TabPanel>

                    {/* USEFUL LINKS */}
                    <TabPanel
                        pt={{
                            headerAction: { className: 'cursor-pointer font-italic text-center text-[12px] sm:text-[14px]' }
                        }}
                        header="Шилтеме"
                        className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                    >
                        {skeleton ? <GroupSkeleton count={5} size={{ width: '100%', height: '3rem' }} /> : linkSecion}
                    </TabPanel>

                    {/* VIDEO */}
                    <TabPanel
                        pt={{
                            headerAction: { className: 'cursor-pointer font-italic text-[12px] sm:text-[14px]' }
                        }}
                        header="Видео"
                        className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                    >
                        {skeleton ? <GroupSkeleton count={5} size={{ width: '100%', height: '3rem' }} /> : videoSecion}
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
