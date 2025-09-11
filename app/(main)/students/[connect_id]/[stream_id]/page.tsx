'use client';

import InfoBanner from '@/app/components/InfoBanner';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useBreadCrumbs from '@/hooks/useBreadCrumbs';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchStreamStudents } from '@/services/streams';
import { useParams, usePathname } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';

export default function StudentList() {
    const studentList = [
        {
            student_name: 'lesha',
            point: 31,
            last_visist: 'xx-xx',
            info: true
        },
        {
            student_name: 'evheni',
            point: 0,
            last_visist: false,
            info: true
        },
        {
            student_name: 'alesha',
            point: 3,
            last_visist: 'xx-xx',
            info: false
        },
        {
            student_name: 'lesha',
            point: 3,
            last_visist: 'xx-xx',
            info: true
        }
    ];
    // const [studentList, setStudentList] = useState([]);
    const [hasList, setHasList] = useState(false);
    const [skeleton, setSkeleton] = useState(false);

    const { setMessage, setGlobalLoading } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const { connect_id, stream_id } = useParams();
    console.log('params: ', connect_id, stream_id);

    const media = useMediaQuery('(max-width: 640px)');
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
            url: `/course/:id`,
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
            url: `/students/${connect_id}/${stream_id}`,
            title: 'Студенттер',
            parent_id: 2
        }
    ];

    const pathname = usePathname();
    const breadcrumb = useBreadCrumbs(teachingBreadCrumb, pathname);

    // functions
    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    const handleFetchStudents = async () => {
        const data = await fetchStreamStudents(connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null);
        console.log(data);

        toggleSkeleton();
        if (data && data.students) {
            setHasList(false);
            // setStudentList(data.students);
        } else {
            setHasList(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    // USEECFFECTS

    useEffect(() => {
        toggleSkeleton();
        handleFetchStudents();
    }, []);

    return (
        <div>
            {skeleton ? (
                <GroupSkeleton count={studentList.length} size={{ width: '100%', height: '5rem' }} />
            ) : (
                <>
                    {/* info section */}
                    <div className="bg-[var(--titleColor)] relative flex flex-col justify-center items-center w-full text-white p-[30px] md:p-[40px] pb-4">
                        <div>
                            <h1 style={{ color: 'white', fontSize: media ? '24px' : '36px', textAlign: 'center' }}>{'Угуучулардын тизмеси'}</h1>
                            <div className="w-full">{breadcrumb}</div>
                        </div>
                    </div>
                </>
            )}

            {/* table section */}
            {hasList ? (
                <NotFound titleMessage={'  ?  '} />
            ) : (
                <div>
                    {skeleton ? (
                        <GroupSkeleton count={studentList.length} size={{ width: '100%', height: '4rem' }} />
                    ) : (
                        <>
                            <DataTable value={studentList} dataKey="id" breakpoint="960px" rows={5} className="mini-table">
                                <Column body={(_, { rowIndex }) => rowIndex + 1} header="Номер" style={{ width: '20px' }}></Column>
                                <Column
                                    field="title"
                                    header="ФАА"
                                    style={{ width: '50%' }}
                                    body={(rowData) => (
                                        <div className="flex gap-1">
                                            <span>{rowData.last_name}</span>
                                            <span>{rowData.name}</span>
                                            <span>{rowData.father_name}</span>
                                        </div>
                                    )}
                                ></Column>

                                <Column
                                    header="Балл"
                                    className="flex items-center border-b-0"
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2" key={rowData.id}>
                                            {rowData?.point && rowData.point > 0 ? (
                                                <div className="flex justify-between items-center gap-1 w-[120px]">
                                                    <span className={`${rowData.point > 30 ? 'bg-[var(--greenColor)] text-white p-1 w-[25px] text-center' : 'bg-amber-400 text-white p-1 w-[25px] text-center '}`}>{rowData.point}</span>
                                                    <Button icon={'pi pi-arrow-right'} style={{ fontSize: '13px', padding: '5px 7px 5px 5px' }} label="Сактоо" />
                                                </div>
                                            ) : (
                                                <span className={'bg-[var(--redColor)] p-1 w-[25px] text-white text-center'}>{rowData.point}</span>
                                            )}
                                        </div>
                                    )}
                                />

                                <Column
                                    header="Акыркы катышуусу"
                                    // style={{ width: '20%' }}
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2" key={rowData.id}>
                                            <span>{rowData.last_visist || <i className="pi pi-minus"></i>}</span>
                                        </div>
                                    )}
                                />

                                <Column
                                    header="Аткарган кадамдары"
                                    className=""
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2" key={rowData.id}>
                                            {rowData.info && <Button label="Маалымат" />}
                                        </div>
                                    )}
                                />
                            </DataTable>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
