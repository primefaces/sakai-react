'use client';

import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchKafedra } from '@/services/faculty';
import Link from 'next/link';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useContext, useEffect, useState } from 'react';

export default function Faculty() {
    interface City {
        id: number | null;
        name_ru: string;
        id_faculty?: number | null;
    }

    const showError = useErrorMessage();
    const { setMessage, setGlobalLoading } = useContext(LayoutContext);

    const [kafedra, setKafedra] = useState<City[]>([{ name_ru: '', id: null }]);
    const [selectShow, setSelectShow] = useState<boolean>(false);
    const [facultyShow, setFacultyShow] = useState<boolean>(false);
    const [skeleton, setSkeleton] = useState(false);
    const [contentNull, setContentNull] = useState<boolean>(false);

    const handleFetchKafedra = async () => {
        setSkeleton(true);
        const data = await fetchKafedra();
        console.log(data);
        
        if (data && Array.isArray(data)) {
            const r = data?.find((item)=> item?.short_name_kg === 'МИОТжББМ' );
            console.warn(r);
            // data?.forEach((item)=> console.log(item?.short_name_kg));
            
            setSkeleton(false);
            if (data.length > 0) {
                setKafedra(data);
                setFacultyShow(false);
                setContentNull(false);
            } else {
                setContentNull(true);
            }
        } else {
            setSkeleton(false);
            setFacultyShow(true);
        }
    };

    useEffect(() => {
        handleFetchKafedra();

        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 900);
    }, []);

    if(contentNull) return <NotFound titleMessage="Курсы отсутствуют" />

    return (
        <div className="main-bg flex flex-col gap-4">
            {skeleton ? (
                <GroupSkeleton count={5} size={{ width: '100%', height: '3rem' }} />
            ) : (
                !selectShow && (
                    <div>
                        <h3 className="text-xl pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">Кафедры</h3>
                        {facultyShow ? (
                            <NotFound titleMessage="Кафедры не доступны" />
                        ) : (
                            <DataTable value={kafedra} dataKey="id" emptyMessage="Загрузка" key={JSON.stringify('name_ru')} responsiveLayout="stack" breakpoint="960px" rows={5} className="my-custom-table">
                                <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px', display: 'flex', justifyContent: 'center' }} className='start'></Column>
                                <Column
                                    field="name_ru"
                                    header="Название"
                                    style={{ width: '80%' }}
                                    className='start'
                                    body={(rowData) => (
                                        <Link href={`/faculty/${rowData.id}`} key={rowData.id}>
                                            {rowData.name_ru}
                                        </Link>
                                    )}
                                ></Column>
                            </DataTable>
                        )}
                    </div>
                )
            )}
        </div>
    );
}
