'use client';

import { OptionsType } from '@/types/OptionsType';
import MyDateTime from '../MyDateTime';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { CourseCategoryOption } from '@/types/openCourse/CourseCategoryOption';
import { confirmDialog } from 'primereact/confirmdialog';

// компонент представляет с собой карточку одного курса
// отобр. название, фото, тип (платный, бесплатный), дата, (срок), фио препода

// ?должен вызывать у родителя функцию и передать ид курса для отобр. show
// вызывает у родителя функцию записи на курс передавая ид курса
// получает пропс типа строка для разной позиции отображения названия курса

export default function OpenCourseCard({
    course,
    link,
    courseShowProp,
    courseSignup,
    signUpList,
    btnDisabled
}: {
    course: CourseCategoryOption;
    link: { url: string | null; status: boolean };
    courseShowProp: (course_id: number) => void;
    courseSignup: (id: number) => void;
    signUpList: number[];
    btnDisabled: boolean;
}) {
    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        hour12: false // 24-часовой формат
    };

    const pathname = usePathname();
    const [isSigned, setIsSigned] = useState<number | null | undefined>(null);
    const [selectCourseId, setSelectedCourseId] = useState<number | null>(null);

    useEffect(() => {
        if (signUpList?.length) {
            const signupId: number | undefined = signUpList?.find((id) => id === course?.id);
            setIsSigned(signupId);
        }
    }, [signUpList]);

    const imageBodyTemplate = (product: any) => {
        const image = product.image;

        if (typeof image === 'string') {
            return (
                <div className="flex justify-center min-w-[60px] w-[60px] min-h-[60px] h-[60px] sm:w-[80px] sm:min-w-[80px] sm:h-[80px] sm:min-h-[80px] mx-4" key={product.id}>
                    <img src={image} alt="Course image" className="w-full object-cover shadow-2 border-round" />
                </div>
            );
        }

        return (
            <div className="flex justify-center min-w-[60px] w-[60px] min-h-[60px] h-[60px] sm:w-[80px] sm:min-w-[80px] sm:h-[80px] sm:min-h-[80px] mx-4" key={product.id}>
                <img src={'/layout/images/no-image.png'} alt="Course image" className="w-full object-cover shadow-2 border-round" />
            </div>
        );
    };

    const confirm1 = (id: number) => {
        confirmDialog({
            message: 'Вы точно хотите записаться на курс?',
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptLabel: 'Записаться',
            rejectLabel: 'Назад',
            rejectClassName: 'p-button-secondary reject-button',
            accept: () => courseSignup(id)
        });
    };

    return (
        <div className="flex flex-col shadow rounded p-2 sm:p-4 sm:pb-2 gap-4 w-full hover:shadow-lg">

            {/* header section */}
            <div className="flex items-start justify-between gap-2 flex-col sm:flex-row">
                <div className={`w-full flex justify-between gap-1 items-start`}>
                    <Link href={link.url || '#'}>{imageBodyTemplate(course)}</Link>
                    {/* {titlePos === 'left' && <b className="cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline" onClick={()=> courseShowProp(course?.id)}>{course?.title}</b>} */}
                    <div
                        className={`flex sm:hidden gap-1 items-center text-sm text-white rounded p-1 mb-1 ${course?.audience_type?.name === 'open' ? 'bg-[var(--greenColor)]' : course?.audience_type?.name === 'wallet' ? 'bg-[var(--amberColor)]' : ''
                            }`}
                    >
                        <i className={course?.audience_type?.icon} style={{ fontSize: '14px' }}></i>
                        <i className="text-[13px]">{course?.audience_type?.name === 'open' ? 'Бесплатный' : course?.audience_type?.name === 'wallet' ? 'Платный' : ''}</i>
                    </div>
                </div>
                <div className="w-full flex flex-col items-end">
                    <div
                        className={`hidden sm:flex gap-1 items-center text-sm text-white rounded p-1 mb-1 ${course?.audience_type?.name === 'open' ? 'bg-[var(--greenColor)]' : course?.audience_type?.name === 'wallet' ? 'bg-[var(--amberColor)]' : ''
                            }`}
                    >
                        <i className={course?.audience_type?.icon} style={{ fontSize: '14px' }}></i>
                        <i className="text-[13px]">{course?.audience_type?.name === 'open' ? 'Бесплатный' : course?.audience_type?.name === 'wallet' ? 'Платный' : ''}</i>
                    </div>
                    {
                        course?.category?.title ?
                            <div className='flex justify-start'>
                                <p className='p-1 bg-[var(--redWeakColor)] text-[13px] max-w-[300px] break-words'>{course?.category.title}</p>
                            </div>
                            : ''
                    }
                    {link.status ? (
                        <Link href={link.url || '#'}>
                            <b className="cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline" onClick={() => courseShowProp(course?.id)}>
                                {course?.title}
                            </b>
                        </Link>
                    ) : (
                        <b className="cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline" onClick={() => courseShowProp(course?.id)}>
                            {course?.title}
                        </b>
                    )}
                </div>
            </div>

            <div className='flex flex-col gap-1'>
                <div className="flex items-center gap-1 justify-between">
                    {pathname !== '/openCourse/activeCourse' ?
                        <div className="w-full">
                            {typeof isSigned === 'number' ? (
                                <Button label="Вы записаны" disabled size="small" className=" bg-[var(--amberColor)] text-sm mini-button" />
                            ) : !course?.is_signed ? (
                                <Button label="Записаться на курс" disabled={btnDisabled} size="small" className=" text-sm mini-button" onClick={() => {
                                    setSelectedCourseId(course?.id);
                                    confirm1(course?.id);
                                }} />
                            ) : (
                                ''
                            )}
                        </div>
                        : ''
                    }

                    {pathname !== '/openCourse/activeCourse' ? <div className="cursor-pointer flex justify-end text-sm w-full text-[var(--mainColor)]" onClick={() => courseShowProp(course?.id)}>
                        Подробнее...
                    </div> : ''}
                </div>
                {/* data */}
                <div className="w-full flex justify-end text-[11px] order-1 sm:order-2">
                    <MyDateTime createdAt={course?.created_at} options={options} />
                </div>
            </div>
        </div>
    );
}
