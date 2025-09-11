'use client';

import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useBreadCrumbs from '@/hooks/useBreadCrumbs';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import useShortText from '@/hooks/useShortText';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { itemsCourseInfo } from '@/services/studentMain';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export default function StudentThemes() {
    const [themes, setThemes] = useState<{ image: string; description: string; title: string }>({ image: '', description: '', title: '' });
    const [hasCourses, setHasCourses] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [themesStudentList, setThemesStudentList] = useState([]);

    const params = useParams();
    const courseId = params.studentThemeCourse;
    const streamId = params.studentThemeId;
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
            url: `/teaching/:course_id/:lesson_id`,
            title: 'Темалар',
            parent_id: 2
        }
    ];

    const pathname = usePathname();
    const breadcrumb = useBreadCrumbs(teachingBreadCrumb, pathname);

    const { setMessage, contextFetchStudentThemes, contextStudentThemes, crumbUrls, contextAddCrumb } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const media = useMediaQuery('(max-width: 640px)');
    const titleShort = useShortText(themes?.title, 35);

    const titleInfoClass = `${themes?.image ? 'items-center justify-between' : 'justify-center'}`;
    const titleImageClass = `${true ? 'md:w-1/3' : ''}`;

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    useEffect(()=> {
        const isTopicsChildPage = /^\/teaching\/[^/]+\/[^/]+$/.test(pathname);
        console.log(streamId);
        
        if(isTopicsChildPage && streamId){
            contextAddCrumb({type: 'studentStream', crumbUrl: streamId })
        }
    },[])

    const handleCourseInfo = async () => {
        const data = await itemsCourseInfo(courseId ? Number(courseId) : null, streamId ? Number(streamId) : null);

        if (data && data.course) {
            setHasCourses(false);
            setThemes(data.course);
        } else {
            setHasCourses(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    useEffect(() => {
        handleCourseInfo();
        if (courseId) {
            console.log(courseId);
            contextFetchStudentThemes(courseId);
        }
    }, [courseId]);

    useEffect(() => {
        if (contextStudentThemes?.lessons) {
            setThemesStudentList(contextStudentThemes.lessons.data);
            console.log(contextStudentThemes.lessons.data);
        }
    }, [contextStudentThemes]);

    return (
        <div>
            <div className="py-4 w-full">
                {/* info section */}
                {skeleton ? (
                    <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                ) : (
                    <div className="w-full bg-[var(--titleColor)] relative flex flex-col justify-center items-center gap-1 text-white p-[30px] pb-4 md:p-[40px] mb-4">
                        <div className={`w-full flex flex-col sm:flex-row gap-3 ${titleInfoClass}`}>
                            <div className="w-full flex flex-col items-center">
                                <h1 style={{ color: 'white', fontSize: media ? '24px' : '28px', textAlign: 'center' }} className="">
                                    {titleShort}
                                </h1>
                                <p style={{ color: 'white' }} className="sm:w-[300px] text-[12px] sm:text-[14px] text-center">
                                    {themes?.description}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-5"></div>
                            </div>
                            {themes?.image && (
                                <div className="sm:w-1/2">
                                    <img src={themes?.image} alt="Фото" />
                                </div>
                            )}
                        </div>
                        <div className='w-full'>{breadcrumb}</div>
                    </div>
                )}

                {/* main section */}
                {hasCourses ? (
                    <NotFound titleMessage={'Темалар жеткиликтүү эмес'} />
                ) : (
                    <div>
                        {skeleton ? (
                            <GroupSkeleton count={10} size={{ width: '100%', height: '4rem' }} />
                        ) : (
                            <div className="w-full flex gap-3 items-center justify-center flex-wrap">
                                {themesStudentList?.map((item: { id: number; title: string }) => (
                                    <div key={item.id} className="w-[100%] md:w-[350px] shadow rounded p-3">
                                        <div className="w-full shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] m-2">
                                            <span className="text-[var(--mainColor)]">Теманын аталышы:</span>
                                        </div>
                                        <div className="flex w-full items-center p-2">
                                            <div className="flex w-full flex-col gap-2 p-1 rounded bg-[var(--mainBgColor)]">
                                                <div className="w-full flex gap-1 items-center justify-center">
                                                    <Link href={`/teaching/lesson/${courseId}/${item.id}`} className="text-[16px]">
                                                        {item.title}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
