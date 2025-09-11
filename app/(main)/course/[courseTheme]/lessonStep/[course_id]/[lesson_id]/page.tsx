'use client';

import useBreadCrumbs from '@/hooks/useBreadCrumbs';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchLessonShow } from '@/services/courses';
import { useParams, usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export default function LessonStep() {
    const { course_id, lesson_id } = useParams();

    const [lessonInfoState, setLessonInfoState] = useState<{ title: string; documents_count: string; usefullinks_count: string; videos_count: string } | null>(null);
    const media = useMediaQuery('(max-width: 640px)');
    const { setMessage } = useContext(LayoutContext);
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
            url: '/course',
            title: 'Курстар',
            parent_id: 1
        },
        {
            id: 3,
            url: `/course/${''}`,
            title: 'Темалар',
            parent_id: 2
        },
        {
            id: 4,
            url: '/course/:course_id/:lesson_id',
            title: 'Сабактар',
            parent_id: 3
        },
        {
            id: 5,
            url: '/students/:course_id/:stream_id',
            title: 'Студенттер',
            parent_id: 2
        }
    ];

    const pathname = usePathname();
    const breadcrumb = useBreadCrumbs(teachingBreadCrumb, pathname);

    const handleShow = async () => {
        // skeleton = false

        const data = await fetchLessonShow(lesson_id ? Number(lesson_id) : null);
        console.log(data);

        if (data?.lesson) {
            setLessonInfoState({ title: data.lesson.title, videos_count: data.lesson.videos_count, usefullinks_count: data.lesson.usefullinks_count, documents_count: data.lesson.documents_count });
        } else {
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

    const lessonInfo = (
        <div>
            <div className="bg-[var(--titleColor)] relative flex flex-col justify-center items-center w-full text-white p-5 md:p-10 pb-4">
                <span className="absolute left-2 sm:left-4 top-2 text-2xl sm:text-4xl pi pi-bookmark-fill "></span>
                <div>
                    <h1 style={{ color: 'white', fontSize: media ? '24px' : '36px', textAlign: 'center' }}>{lessonInfoState?.title}</h1>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5 m-4">
                        <span className="flex items-center gap-3">
                            <span className="w-[8px] h-[8px] block bg-[var(--mainColor)]"></span>
                            <span className="cursor-pointer hover:text-[var(--mainColor)] transition-all">
                                {/* Документтердин саны: <span className="text-[var(--mainColor)] font-bold">{lessonInfoState?.documents_count}</span> */}
                            </span>
                        </span>
                        <span className="flex items-center gap-3">
                            <span className="w-[8px] h-[8px] block bg-[var(--mainColor)]"></span>
                            <span className="cursor-pointer hover:text-[var(--mainColor)] transition-all">
                                {/* Шилтемелердин саны: <span className="text-[var(--mainColor)] font-bold">{lessonInfoState?.usefullinks_count}</span> */}
                            </span>
                        </span>
                        <span className="flex items-center gap-3">
                            <span className="w-[8px] h-[8px] block bg-[var(--mainColor)]"></span>
                            <span className="cursor-pointer hover:text-[var(--mainColor)] transition-all">
                                {/* Видеолордун саны: <span className="text-[var(--mainColor)] font-bold">{lessonInfoState?.videos_count}</span> */}
                            </span>
                        </span>
                    </div>
                    <div className="w-full">{breadcrumb}</div>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        handleShow();
    }, []);

    return (
        <div>
            {/* info section */}
            {lessonInfo}
        </div>
    );
}
