'use client';

import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import useMediaQuery from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchDepartament } from '@/services/faculty';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { DataView } from 'primereact/dataview';
import { useContext, useEffect, useState } from 'react';

export default function Kafedra() {
    interface kafedraInfoType {
        birth_date: string | null;
        courses: [];
        created_at: string;
        email: string;
        email_verified_at: string | null;
        father_name: string;
        id: number;
        is_student: boolean;
        is_working: boolean;
        last_name: string;
        myedu_id: number;
        name: string;
        phone: string;
        pin: number;
        updated_at: string;
    }

    const { id_kafedra } = useParams();

    const [courses, setCourses] = useState<kafedraInfoType[]>([]);
    const [contentShow, setContentShow] = useState<boolean>(false);
    const [skeleton, setSkeleton] = useState(false);
    const [contentNull, setContentNull] = useState<boolean>(false);

    const media = useMediaQuery('(max-width: 640px)');
    const tableMedia = useMediaQuery('(max-width: 577px)');

    const { setMessage, setGlobalLoading } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const handleFetchKafedra = async () => {
        setSkeleton(true);
        const data = await fetchDepartament(Number(id_kafedra));
        if (data && Array.isArray(data)) {           
            setSkeleton(false);
            if (data.length > 0) {
                setCourses(data);
                setContentShow(false);
                setContentNull(false);
            } else {
                setContentNull(true);
            }
        } else {
            setSkeleton(false);
            setContentShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const itemTemplate = (rowData: any) => {
        return (
            <div className="col-12">
                <div className={`w-full flex flex-col align-items-center p-1 gap-1 sm:gap-3 `}>
                    {/* Номер (rowIndex) можно добавить через внешний счетчик или props, но для DataView это сложнее */}

                    {/* Заголовок */}
                    <div className={`w-full flex-1 ${tableMedia && 'flex items-center gap-1 justify-between'}`}>
                        <div className="font-bold text-md">
                            <Link href={`/faculty/${id_kafedra}/${rowData.id}`} key={rowData.id} className="text-[16px] hover:underline">
                                {rowData.last_name} {rowData.name} {rowData.father_name}
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-1 items-start">
                        <div className='flex gap-1 items-center sm:justify-between w-full'><span className='text-[var(--mainColor)] text-sm'>Количество курсов:</span><span className="">{rowData.courses}</span></div>
                        <div className='flex gap-1 items-center sm:justify-between w-full'><span className='text-[var(--mainColor)] text-sm'>Утверждённых:</span><span>{rowData.courses_published}</span></div>
                    </div>

                    {/* <div>{imageBodyTemplate(rowData)}</div> */}
                </div>
            </div>
        );
    };

    useEffect(() => {
        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 900);
        handleFetchKafedra();
    }, []);

    if (contentNull) return <NotFound titleMessage="Данные отсутствуют" />;

    return (
        <div className="flex flex-col gap-2 main-bg">
            {skeleton ? (
                <div className="w-full">
                    <GroupSkeleton count={5} size={{ width: '100%', height: '3rem' }} />
                </div>
            ) : contentShow ? (
                <NotFound titleMessage="Данные не доступны" />
            ) : (
                <div>
                    {media ? (
                        <><h3 className="text-lg pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">Преподаватели</h3>
                        <DataView
                            value={courses}
                            itemTemplate={itemTemplate}
                            layout="list" // Отображение в виде сетки, что идеально подходит для карточек
                            rows={5}
                            emptyMessage="Нет данных для отображения"
                        /></>
                    ) : (
                        <DataTable value={courses} emptyMessage="Загрузка" dataKey="id_kafedra" key={JSON.stringify('forStreamId')} responsiveLayout="stack" breakpoint="960px" rows={5} className="my-custom-table">
                            <Column body={(_, { rowIndex }) => rowIndex + 1} header="#"></Column>
                            <Column
                                field="title"
                                header="Преподаватели"
                                body={(rowData) => (
                                    <Link href={`/faculty/${id_kafedra}/${rowData.id}`} key={rowData.id} className="text-[16px] my-3 hover:underline">
                                        {rowData.last_name} {rowData.name} {rowData.father_name}
                                    </Link>
                                )}
                            ></Column>
                            <Column
                                field="title"
                                header="Всего курсов"
                                body={(rowData) => (
                                    <div className="w-full flex justify-center">
                                        <div className="w-[300px] flex gap-1 justify-center items-center">
                                            <b className="w-full flex justify-end">{rowData.courses}</b>
                                            <div className="w-full flex items-center gap-1">(<span>{rowData.courses_published}</span> <span>утверждённых</span>)</div>
                                        </div>
                                    </div>
                                )}
                            ></Column>
                        </DataTable>
                    )}
                </div>
            )}
        </div>
    );
}
