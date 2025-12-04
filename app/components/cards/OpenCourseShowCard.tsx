'use client';

import { OptionsType } from '@/types/OptionsType';
import MyDateTime from '../MyDateTime';
import { myMainCourseType } from '@/types/myMainCourseType';
import { Button } from 'primereact/button';

export default function OpenCourseShowCard({ course, courseSignup }: { course: myMainCourseType; courseSignup: (id: number) => void }) {
    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        hour12: false // 24-часовой формат
    };

    console.log(course);

    return (
        <div className="flex flex-col shadow rounded p-2 sm:p-4 gap-3 w-full">
            {/* header section */}
            <div className="flex items-start gap-2 flex-col shadow-[var(--bottom-shadow)]">
                <b className="w-full text-xl sm:text-2xl break-words text-[var(--mainColor)] underline">{course?.title}</b>
                <span className="w-full break-words">{course?.description}</span>
            </div>

            <div className="flex items-start gap-2 flex-row sm:flex-col">
                <span className="w-full break-words">{course?.audience_type?.description}</span>
                <div className={`flex gap-1 items-center text-white rounded p-1 mb-1 ${course?.audience_type?.name === 'open' ? 'bg-[var(--greenColor)]' : course?.audience_type?.name === 'wallet' ? 'bg-[var(--amberColor)]' : ''}`}>
                    <i className={course?.audience_type?.icon} style={{ fontSize: '14px' }}></i>
                    <i className="text-[13px]">{course?.audience_type?.name === 'open' ? 'Бесплатный' : course?.audience_type?.name === 'wallet' ? 'Платный' : ''}</i>
                </div>
            </div>

            <div className="flex gap-1 items-center justify-center p-1 w-[270px] bg-[var(--mainBgColor)] rounded">
                <span>Автор: </span>
                <div className="flex gap-1 items-center">
                    <span>{course?.user?.last_name}</span>
                    <span>{course?.user?.name}</span>
                </div>
            </div>

            <div className="flex items-end gap-1 justify-between">
                {/* {course?.is_signed ? (
                    <Button label="---" disabled size="small" className="ml-3 bg-[var(--amberColor)] text-sm mini-button" onClick={() => courseSignup(course?.id)} />
                ) : !course?.is_signed ? (
                    <Button label="Записаться на курс" size="small" className="ml-3 text-sm mini-button" onClick={() => courseSignup(course?.id)} />
                ) : (
                    ''
                )} */}

                {/* data */}
                <div className="w-full flex justify-end text-[13px] order-1 sm:order-2">
                    <MyDateTime createdAt={course?.created_at} options={options} />
                </div>
            </div>
        </div>
    );
}
