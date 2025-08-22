// 'use client';

// import { Button } from 'primereact/button';
// import React from 'react';

// export default function ItemCard({lessonName, teacherName, teacherLastName, lessonType}:{lessonName: string, teacherName: string,teacherLastName: string, lessonType: string}) {

//     return (
//         // <div className="w-[350px] sm:w-[300px] shadow rounded p-3 ">
//         <div className="w-[100%] md:w-[300px] shadow rounded p-3 ">
//             <div className="w-full shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
//                 <h3 className="text-[16px] ">{lessonName}</h3>
//             </div>
//             <div className='flex flex-col gap-1'>
//                 <div className="flex flex-col gap-1 p-1 rounded  bg-[var(--mainBgColor)]">
//                     <div className="flex gap-1 items-center">
//                         <span className="text-[var(--mainColor)]">Окутуучу:</span>
//                         <span>{teacherName}</span>
//                         <span>{teacherLastName}</span>
//                     </div>
//                     <div className='flex sm:items-center gap-1 justify-between '>
//                         <div className="flex gap-1 items-center">
//                             <span className="text-[var(--mainColor)]">Тип:</span>
//                             <span>{lessonType}</span>
//                         </div>
//                         {
//                             // <div className="relative">
//                             <Button label="Курс" icon="pi pi-arrow-right text-sm" iconPos="right"/>
//                             // <span className='text-[var(--mainColor)] underline'>Курска өтүү -></span>
//                         }
//                     </div>
//                 </div>
//             </div>

//         </div>
//     );
// }

'use client';
import { itemsCourseInfo } from '@/services/studentMain';
import Link from 'next/link';
import { Button } from 'primereact/button';
import React from 'react';

export default function ItemCard({
    lessonName,
    streams,
    connection
}: {
    lessonName: string;
    streams: { teacher?: { name: string; last_name?: string }; subject_type_name?: { name_kg: string } }[];
    connection: { id: number; course_id: number; id_myedu_stream: number }[];
}) {
    console.log('conn',connection);
    
    return (
        <div className="w-[100%] md:w-[300px] shadow rounded p-3">
            <div className="w-full shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                <h3 className="text-[16px] ">{lessonName}</h3>
            </div>

            <div className="flex flex-col gap-1">
                {streams.map((stream, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-1 rounded bg-[var(--mainBgColor)]">
                        <div className="flex gap-1 items-center">
                            <span className="text-[var(--mainColor)]">Окутуучу:</span>
                            <span>{stream.teacher?.name}</span>
                            <span>{stream.teacher?.last_name}</span>
                        </div>
                        <div className="flex sm:items-center gap-1 justify-between ">
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">Тип:</span>
                                <span>{stream.subject_type_name?.short_name_kg}</span>
                            </div>
                            {connection.map((item) => {                                
                                if (item.id_myedu_stream === stream.id) {
                                    return <Link href={`teaching/${item.course_id}/${stream.id}`}><Button label="Курс" icon="pi pi-arrow-right text-sm" iconPos="right" />;</Link>
                                }
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
