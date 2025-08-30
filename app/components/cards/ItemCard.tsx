'use client';
import Link from 'next/link';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';

export default function ItemCard({
    lessonName,
    streams,
    connection
}: {
    lessonName: string;
    streams: { id: number; teacher?: { name: string; last_name?: string }; subject_type_name?: { name_kg: string; short_name_kg: string } }[];
    connection: { id: number; course_id: number; id_myedu_stream: number }[];
}) {
    const [activeStreamIdx, setActiveStreamIdx] = useState<number | null>(null);
    const matchedIdx = streams.findIndex((stream) => connection.some((item) => item.id_myedu_stream === stream.id));

    useEffect(() => {
        if (matchedIdx !== -1) {            
            setActiveStreamIdx(matchedIdx);
        }
    }, [streams, connection]);
    
    return (
        <div className="w-[100%] md:w-[300px] shadow-md rounded p-3">
            <div className="w-full shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                <h3 className="text-[16px]">{lessonName}</h3>   
            </div>

            <div className="flex flex-col gap-1">
                {streams.map((stream, idx) => {
                    const isActive = idx === activeStreamIdx;
                    return (
                        <div key={idx} className={`${isActive && 'bg-[var(--greenBgColor)]'} flex flex-col gap-2 p-1 rounded ${streams.length !== idx + 1 && 'border-b border-[gray]'}`}>
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">Окутуучу:</span>
                                <span>{stream.teacher?.name}</span>
                                <span>{stream.teacher?.last_name}</span>
                            </div>
                            <div className="flex sm:items-center gap-1 justify-between">
                                <div className="flex gap-1 items-center">
                                    <span className="text-[var(--mainColor)]">Тип:</span>
                                    <span>{stream.subject_type_name?.short_name_kg}</span>
                                </div>
                                {connection.map((item) => {
                                    if (item.id_myedu_stream === stream.id) {
                                        return (
                                            <Link key={item.id} href={`teaching/${item.course_id}/${stream.id}`}>
                                                <Button className='px-2 py-1' style={{fontSize: '14px'}} label="Курс" icon="pi pi-arrow-right text-sm" iconPos="right" />
                                            </Link>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
