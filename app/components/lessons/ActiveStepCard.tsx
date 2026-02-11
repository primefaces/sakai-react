'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import useMediaQuery from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { openChillsUpdate } from '@/services/openCourse';
import { lessonStateType } from '@/types/lessonStateType';
import { mainStepsType } from '@/types/mainStepType';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useState } from 'react';

export default function ActiveStepCard({
    type,
    icon,
    title,
    course_id,
    stepId,
    // chills,
    fetchProp,
    // contentId,
    // id_parent,
    // forumValueAdd,
    lessonItem,
    stepItem
}: {
    type: string;
    icon: string;
    title?: string;
    course_id: number;
    description?: string;
    link?: string;
    stepId: number;
    // chills: boolean;
    fetchProp: () => void;
    lessonItem: lessonStateType;
    // {
    //     id: number;
    //     chills: boolean;
    //     type: { name: string; logo: string };
    //     content: { id: number; title: string; description: string; url: string; document: string; document_path: string };
    //     score: number;
    // }
    stepItem: mainStepsType;
}) {
    const media = useMediaQuery('(max-width: 640px)');
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);
    const [progressSpinner, setProgressSpinner] = useState(false);

    const handleChills = async () => {
        const newChills = !stepItem?.chills;
        setProgressSpinner(true);
        const data = await openChillsUpdate(course_id, stepId, newChills);
        
        if (data?.success) {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'success', summary: '', detail: data?.message }
            });
            fetchProp();
        } else {
            setProgressSpinner(false);
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    const cheelseBtn = (type: string) => (
        <div>
            {stepItem?.chills ? (
                <div className="flex items-center gap-1">
                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                    {type === 'test' || type === 'practical' ? (
                        <Link href={`/openCourse/activeCourse/${course_id}/${lessonItem?.id}/${stepId}`}>
                            <Button
                                disabled={progressSpinner}
                                label="Выполнено"
                                icon="pi pi-check"
                                size="small"
                                className={`w-full success-button px-2 py-1 flex items-center justify-center gap-1 ${progressSpinner && 'opacity-50'} ${media ? 'mini-button' : ''}`}
                            />
                        </Link>
                    ) : (
                        <Button
                            disabled={progressSpinner}
                            label="Выполнено"
                            icon="pi pi-check"
                            onClick={handleChills}
                            size="small"
                            className={`w-full success-button px-2 py-1 flex items-center justify-center gap-2 ${progressSpinner && 'opacity-50'} ${media ? 'mini-button' : ''}`}
                        />
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-1">
                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                    {type === 'test' || type === 'practical' ? (
                        <Link href={`/openCourse/activeCourse/${course_id}/${lessonItem?.id}/${stepId}`}>
                            <Button disabled={progressSpinner} label="Отметить как выполненный" size="small" className={`w-full px-2 py-1 ${progressSpinner && 'opacity-50'} ${media ? 'mini-button' : ''}`} />
                        </Link>
                    ) : (
                        <Button disabled={progressSpinner} label="Отметить как выполненный" onClick={handleChills} size="small" className={`w-full px-2 py-1 ${progressSpinner && 'opacity-50'} ${media ? 'mini-button' : ''}`} />
                    )}
                </div>
            )}
        </div>
    );

    const docCard = (
        <div className="w-full flex items-end py-1 flex-col gap-2 sm:flex-row">
            <div className="w-full flex flex-col sm:flex-row gap-1">
                <div className="w-full flex items-center gap-2">
                    <div className="p-2 bg-[var(--mainColor)] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                        <i className={`${icon} text-white`}></i>
                    </div>
                    <Link
                        href={`/openCourse/activeCourse/${course_id}/${lessonItem?.id}/${stepId}`}
                        // onClick={() => videoStart && videoStart(video_link || '')}
                        className="cursor-pointer max-w-[800px] text-[16px] break-words hover:underline"
                    >
                        {title}
                    </Link>
                </div>
            </div>
            <div className="w-full flex justify-center sm:justify-end">{cheelseBtn('')}</div>
        </div>
    );

    const linkCard = (
        <div className="w-full py-1 flex items-center flex-col gap-2 sm:flex-row">
            <div className="w-full flex sm:flex-row gap-2">
                <div className="p-2 bg-[var(--greenColor)] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[800px] break-words">
                    <Link
                        href={`/openCourse/activeCourse/${course_id}/${lessonItem?.id}/${stepId}`}
                        // onClick={() => videoStart && videoStart(video_link || '')}
                        className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline"
                    >
                        {title}
                    </Link>
                </div>
            </div>
            <div className="w-full flex justify-center sm:justify-end">{cheelseBtn('')}</div>
        </div>
    );

    const videoCard = (
        <div className="w-full flex items-center flex-col gap-2 sm:flex-row py-1">
            <div className="w-full flex items-center gap-2">
                <div className="p-2 bg-[var(--amberColor)] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                    <Link
                        href={`/openCourse/activeCourse/${course_id}/${lessonItem?.id}/${stepId}`}
                        // onClick={() => videoStart && videoStart(video_link || '')}
                        className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline"
                    >
                        {title}
                    </Link>
                </div>
            </div>
            <div className="w-full flex justify-center sm:justify-end">{cheelseBtn('')}</div>
        </div>
    );

    const testCard = (
        <div className="w-full flex items-center flex-col gap-2 sm:flex-row py-1">
            <div className="w-full flex items-center gap-2">
                <div className="p-2 bg-[#c38598] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="w-full flex justify-between gap-1 max-w-[800px] text-wrap break-all">
                    <Link href={`/openCourse/activeCourse/${course_id}/${lessonItem?.id}/${stepId}`} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                        Тест
                    </Link>
                </div>
            </div>
            <div className="w-full flex items-center sm:justify-end flex-col sm:flex-row gap-2 sm:max-w-[350px]">
                <div className="w-1/2 text-sm">
                    <span>Балл:</span>
                    <span className="text-[var(--mainColor)]">
                        {' '}
                        {stepItem?.answer_score || 0} / {stepItem?.score || 0}
                    </span>
                </div>
                <div className="w-full flex justify-center sm:justify-end">{cheelseBtn('test')}</div>
            </div>
        </div>
    );

    const practicaCard = (
        <div className="w-full flex items-center flex-col gap-1 sm:flex-row py-1">
            <div className="w-full flex items-center gap-2">
                <div className="p-2 bg-[var(--yellowColor)] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <Link href={`/openCourse/activeCourse/${course_id}/${lessonItem?.id}/${stepId}`} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                    Практическое задание
                </Link>
            </div>
            <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2 sm:max-w-[350px]">
                <div className="w-1/2 text-sm">
                    <span>Балл:</span>{' '}
                    <span className="text-[var(--mainColor)]">
                        {' '}
                        <span className="text-[var(--mainColor)]">
                            {' '}
                            {0} / {stepItem?.score || 0}
                        </span>
                    </span>
                </div>
                <div className="w-full flex justify-center sm:justify-end">{cheelseBtn('practical')}</div>
            </div>
        </div>
    );

    const forumCard = (
        <div className="w-full flex items-center flex-col sm:flex-row py-1">
            <div className="w-full flex items-center gap-2">
                <div className="p-2 bg-[#6099a8] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[1000px]">
                    {/* <Link onClick={forumValueAdd} href={stepId && id_parent && contentId ? `/students/forum/${stepId}/${id_parent}/${contentId}` : '#'} className="cursor-pointer max-w-[1000px] text-[14px] sm:text-[16px] hover:underline">
                        Оставьте отзыв или задайте вопрос по материалам урока
                    </Link> */}
                </div>
            </div>
            <div className="flex justify-end"></div>
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex items-center">{type === 'document' && docCard}</div>
            <div className="flex items-center">{type === 'link' && linkCard}</div>
            <div className="flex items-center">{type === 'video' && videoCard}</div>
            <div className="flex items-center">{type === 'test' && testCard}</div>
            <div className="flex items-center">{type === 'practical' && practicaCard}</div>
            {/* <div className="flex items-center">{type === 'forum' && forumCard}</div> */}
        </div>
    );
}
