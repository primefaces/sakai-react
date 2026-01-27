'use client';

import { OptionsType } from '@/types/OptionsType';
import MyDateTime from '../MyDateTime';
import { Button } from 'primereact/button';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useEffect, useState } from 'react';
import { CourseCategoryOption } from '@/types/openCourse/CourseCategoryOption';

export default function OpenCourseShowCard({ course, courseSignup, signUpList, btnDisabled }: { course: CourseCategoryOption; courseSignup: (id: number) => void, signUpList: number[], btnDisabled: boolean }) {
    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        hour12: false // 24-часовой формат
    };

    const media = useMediaQuery('(max-width: 640px)');
    const [isSigned, setIsSigned] = useState<number | null | undefined>(null);

    useEffect(() => {
        // console.log(signUpList);
        if (signUpList?.length) {
            const signupId: number | undefined = signUpList?.find((id) => id === course?.id);
            setIsSigned(signupId);
        }
    }, [signUpList]);

    return (
        <div className="flex flex-col shadow rounded p-2 sm:p-4 gap-3 w-full">
            {/* header section */}
            <div className="flex items-start gap-2 flex-col shadow-[var(--bottom-shadow)]">
                <b className="w-full text-xl sm:text-2xl break-words text-[var(--mainColor)] underline">{course?.title}</b>
                <span className="w-full break-words">{course?.description}</span>
            </div>

            <div className="flex items-start gap-2 flex-row sm:flex-col">
                <span className="w-full break-words">{course?.audience_type?.description}</span>
                <div className='flex flex-col'>
                    <div className={`flex gap-1 items-center text-white rounded p-1 mb-1 ${course?.audience_type?.name === 'open' ? 'bg-[var(--greenColor)]' : course?.audience_type?.name === 'wallet' ? 'bg-[var(--amberColor)]' : ''}`}>
                        <i className={course?.audience_type?.icon} style={{ fontSize: '14px' }}></i>
                        <i className="text-[13px]">{course?.audience_type?.name === 'open' ? 'Бесплатный' : course?.audience_type?.name === 'wallet' ? 'Платный' : ''}</i>
                    </div>
                    {
                        course?.category?.title ?
                            <div className=' flex justify-start'>
                                <p className='p-1 bg-[var(--redWeakColor)] text-sm max-w-[300px] break-words'>{course?.category.title}</p>
                            </div>
                            : ''
                    }
                </div>
            </div>

            <div className='flex flex-wrap justify-between gap-2 items-center'>
                <div className='flex flex-col gap-1'>
                    <div className="flex items-center text-sm">
                        <span className="text-[var(--mainColor)] p-1">Автор:</span>
                        <div className=" flex p-1 gap-1 items-center">
                            {!media ? (
                                <>
                                    <span>{course?.user?.last_name}</span>
                                    <span>{course?.user?.name}</span>
                                    <span>{course?.user?.father_name}</span>
                                </>
                            ) : (
                                <>
                                    <span>{course?.user?.last_name}</span>
                                    <span>{course?.user?.name[0]}.</span>
                                    <span>{course?.user?.father_name && course?.user?.father_name[0] + '.'}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* lang */}
                    <div className='flex gap-1 items-center'>
                        <span className="text-[var(--mainColor)] text-sm p-1">Язык обучения:</span>
                        <div className='flex gap-1 items-center'>
                            <img src={`/layout/images/flags/${course?.language?.logo}`} alt="flag" className='w-[20px] h-[20px]' />
                            <span className="font-medium text-[13px] sm:text-md">{course?.language?.title}</span>
                        </div>
                    </div>
                </div>

                {/* рекомендация */}
                {
                    course?.is_featured ?
                        <i className='pi pi-verified text-[green] shadow ml-2 p-1 rounded-full' title='Рекомендован департаментом'></i>
                        : ''
                }
            </div>

            <div className='main-bg'>
                <b>Содержание курса</b>
                <ul className='flex flex-col gap-2'>
                    {
                        course?.lessons?.map((item) => {
                            return <li key={item?.id} className='list-disc ml-4'>{item?.title}</li>
                        })
                    }
                </ul>
            </div>

            <div className="flex items-end gap-1 justify-between">
                <div className="w-full">
                    {typeof isSigned === 'number' ? (
                        <Button label="Вы записаны" disabled size="small" className=" bg-[var(--amberColor)] text-sm mini-button" onClick={() => courseSignup(course?.id)} />
                    ) : !course?.is_signed ? (
                        <Button label="Записаться на курс" disabled={btnDisabled} size="small" className=" text-sm mini-button" onClick={() => courseSignup(course?.id)} />
                    ) : (
                        ''
                    )}
                </div>

                {/* data */}
                <div className="w-full flex justify-end text-[13px] order-1 sm:order-2">
                    <MyDateTime createdAt={course?.created_at} options={options} />
                </div>
            </div>
        </div>
    );
}
