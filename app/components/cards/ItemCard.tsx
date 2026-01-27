'use client';
import React, { useEffect, useState } from 'react';

export default function ItemCard({
    lessonName,
    subject
}: {
    lessonName: string;
    streams: { id: number; teacher?: { name: string; last_name?: string }; subject_type_name?: { name_kg: string; short_name_kg: string } }[];
    connection: { id: number; course_id: number; id_myedu_stream: number }[];
    subject: { connect: boolean; progress: { chills_percent: number; max_score: number; score: number; export: boolean; export_score: number } };
}) {
    function ProgressBar({ value = 0, max = 100, height = 'h-3', className = '' }) {
        const safeMax = typeof max === 'number' && max > 0 ? max : 100;
        const safeValue = typeof value === 'number' ? Math.max(0, Math.min(value, safeMax)) : 0;
        const pct = (safeValue / safeMax) * 100;

        return (
            <div style={{ height: height }} className={`w-full bg-white dark:bg-gray-700 rounded-full overflow-hidden ${className}`} role="progressbar" aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue} aria-label="Course progress">
                <div style={{ width: `${pct}%`, transition: 'width 400ms ease' }} className="bg-[var(--greenColor)] h-full" />
                <style jsx>{`
                    /* If you prefer a custom height using the height prop (e.g. 'h-4'),
                    apply it by targeting\ the inner bar via a wrapper class: */
                `}</style>
            </div>
        );
    }

    const myProgress = () => {
        return (
            <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row items-start">
                <div className="bg-[var(--greenColor)] flex flex-col text-[13px] rounded sm:min-w-[200px] w-full order-2 sm:order-1 shadow">
                    <span className="text-white pl-2">Ваш балл: ({subject?.progress?.score})</span>
                    <span className="bg-white text-[var(--titleColor)] w-full p-1 pl-2 border-t-1 border-l-1 border-t-white border-l-white rounded-[7%_86%_0%_100%_/_100%_0%_100%_0%]">Всего баллов: ({subject?.progress?.max_score})</span>
                </div>
                <div className="w-full flex flex-col items-center justify-between order-0 sm:order-2 shadow px-1">
                    <div>
                        <span className="text-[var(--titleColor)] text-sm">Статус завершения</span>
                    </div>
                    <div className="w-full flex items-center gap-1 justify-between order-0 sm:order-2 ">
                        <div className="flex items-center text-[var(--titleColor)]">
                            <b className="sm:text-md block sm:w-full">{Math.floor(subject?.progress?.chills_percent)}</b>
                            <b>%</b>
                        </div>
                        <div className="w-full border-1 rounded border-[green]">
                            <ProgressBar value={subject?.progress?.chills_percent} max={100} height="7px" className="h-3 sm:min-w-[150px] max-w-[80%]" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`w-full shadow-md rounded p-3 ${subject.connect && ''}`}>
            <div className="flex flex-col gap-1">
                <div className={`w-full flex flex-col sm:flex-row justify-between`}>
                    <b className={`text-md ${subject.connect && 'font-bold underline text-[var(--mainColor)]'}`}>{lessonName}</b>
                    {subject?.connect && <div>{myProgress()}</div>}
                </div>
                {subject?.connect && subject?.progress?.export && (
                    <div className="mt-2 h-full flex sm:justify-end border-l-2 border-white">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <div className="flex gap-1 items-center">
                                <div className="rounded-full shadow p-[3px] bg-[var(--mainGreenColor)] flex justify-center items-center">
                                    <i className="pi pi-check bg-white rounded-full p-[3px]" style={{ fontSize: '11px' }}></i>
                                </div>
                                <span className="text-[var(--titleColor)] text-[12px]">Модуль поставлен</span>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex items-center gap-1">   
                                    <div className="rounded-full p-[6px] bg-[orange] shadow flex justify-center items-center">
                                        <i className="pi pi-star-fill text-white" style={{ fontSize: '12px' }}></i>
                                    </div>
                                    <span className="text-[var(--titleColor)] text-[12px]">Итог за модуль:</span>
                                </div>
                                <div className="flex items-center gap-1 justify-center">
                                    <b className="text-[13px] text-[var(--mainColor)]">{subject.progress?.export_score}</b>
                                    <span className="text-[var(--titleColor)] text-[12px]">Баллов</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
