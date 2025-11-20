'use client';

import { OptionsType } from '@/types/OptionsType';
import MyDateTime from '../MyDateTime';
import { myMainCourseType } from '@/types/myMainCourseType';
import { Button } from 'primereact/button';
import Link from 'next/link';

// компонент представляет с собой карточку одного курса
// отобр. название, фото, тип (платный, бесплатный), дата, (срок), фио препода

// ?должен вызывать у родителя функцию и передать ид курса для отобр. show
// вызывает у родителя функцию записи на курс передавая ид курса
// получает пропс типа строка для разной позиции отображения названия курса

export default function OpenCourseCard({
    course,
    signBtn,
    link,
    courseShowProp,
    courseSignup
}: {
    course: myMainCourseType;
    signBtn: boolean;
    link: { url: string | null; status: boolean };
    courseShowProp: (course_id: number) => void;
    courseSignup: (course_id: number) => void;
}) {
    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        hour12: false // 24-часовой формат
    };

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

    return (
        <div className="flex flex-col shadow rounded p-2 sm:p-4 gap-3 w-full hover:shadow-lg">
            {/* header section */}
            <div className="flex items-start justify-between gap-2 flex-col sm:flex-row">
                <div className={`w-full flex justify-between gap-1 items-start`}>
                    {imageBodyTemplate(course)}
                    {/* {titlePos === 'left' && <b className="cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline" onClick={()=> courseShowProp(course?.id)}>{course?.title}</b>} */}
                    <div
                        className={`flex sm:hidden gap-1 items-center text-sm text-white rounded p-1 mb-1 ${
                            course?.audience_type?.name === 'open' ? 'bg-[var(--greenColor)]' : course?.audience_type?.name === 'wallet' ? 'bg-[var(--amberColor)]' : ''
                        }`}
                    >
                        <i className={course?.audience_type?.icon} style={{ fontSize: '14px' }}></i>
                        <i className="text-[13px]">{course?.audience_type?.name === 'open' ? 'Бесплатный' : course?.audience_type?.name === 'wallet' ? 'Платный' : ''}</i>
                    </div>
                </div>
                <div className="w-full flex flex-col items-end">
                    <div
                        className={`hidden sm:flex gap-1 items-center text-sm text-white rounded p-1 mb-1 ${
                            course?.audience_type?.name === 'open' ? 'bg-[var(--greenColor)]' : course?.audience_type?.name === 'wallet' ? 'bg-[var(--amberColor)]' : ''
                        }`}
                    >
                        <i className={course?.audience_type?.icon} style={{ fontSize: '14px' }}></i>
                        <i className="text-[13px]">{course?.audience_type?.name === 'open' ? 'Бесплатный' : course?.audience_type?.name === 'wallet' ? 'Платный' : ''}</i>
                    </div>
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

            <div className="flex items-center gap-1 justify-between">
                <div className="w-full">
                    {signBtn ? (
                        course?.is_signed ? (
                            <Button label="---" disabled size="small" className="ml-3 bg-[var(--amberColor)] text-sm mini-button" onClick={() => courseSignup(course?.id)} />
                        ) : !course?.is_signed ? (
                            <Button label="Записаться на курс" size="small" className="ml-3 text-sm mini-button" onClick={() => courseSignup(course?.id)} />
                        ) : (
                            ''
                        )
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
