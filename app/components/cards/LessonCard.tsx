import React from 'react';
import Redacting from '../popUp/Redacting';

export default function LessonCard({ cardValue, cardBg, typeColor, type, lessonDate }) {
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

    return (
        <div className={`w-[180px] h-[110px] flex flex-col shadow-xl rounded-sm p-2`} style={{ backgroundColor: cardBg }}>
            <div className="flex items-center justify-between">
                <div className={`flex gap-1 items-center font-bold`} style={{ color: typeColor }}>
                    <i className={` ${type.icon}`}></i>
                    <span>{type.typeValue}</span>
                </div>
                <Redacting redactor={redactor} textSize={'12px'} />
                {/* <MySkeleton size={{ width: '12px', height: '15px' }} /> */}
            </div>
            <div className="bg-[#d6bcbc12] p-1 mt-2 flex flex-col gap-2 justify-between rounded-2xl">
                <div className="flex items-center">
                    <div className={`flex gap-1 items-center`}>
                        <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                        <span>{lessonDate}</span>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-1">{cardValue}</div>
            </div>
        </div>
    );
}
