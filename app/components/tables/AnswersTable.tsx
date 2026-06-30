import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MobileAnswersTable from './MobileAnswersTable';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';

interface Answer {
    themeName: string;
    submissionDate: string;
    teacherResponse: boolean;
    teacherResponseDate: string;
    answered_at: string | null;
    comment: string | null;
    file: string | null;
}

const AnswersTable = ({ report }: { report: any }) => {
    const media = useMediaQuery(`(max-width: 640px)`);

    const [pageState, setPageState] = useState<number>(1);

    useEffect(() => {
        console.log(report);
    }, [report]);

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        // handleFetchOpenCourse(page, free === 'paid' ? '3' : free === 'free' ? '2' : '', search, categorySelectedId?.id || null, language_id);
        setPageState(page);
    };

    const teacherResponseTemplate = (rowData: Answer) => {
        console.log(rowData);

        return rowData.answered_at && rowData.answered_at?.length ? (
            rowData.comment ? (
                <div className="flex items-center">
                    <i className="pi pi-times text-[red]" style={{ fontSize: '12px' }}></i>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{rowData.comment}</span>
                </div>
            ) : (
                <div className="flex items-center">
                    <i className="pi pi-check text-[green]" style={{ fontSize: '12px' }}></i>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ответил</span>
                </div>
            )
        ) : (
            <div className="flex items-center">
                <i className="pi pi-times text-[red]" style={{ fontSize: '12px' }}></i>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Пока проверка не завершена</span>
            </div>
        );
    };

    return (
        <div>
            <h3 className="text-xl m-0 pb-2">Отчёт</h3>
            {media ? (
                <MobileAnswersTable answers={report} />
            ) : (
                <div className="my-2">
                    {report?.details?.length > 0 && (
                        <DataTable value={report?.details} tableStyle={{ minWidth: '50rem' }} emptyMessage={'...'} rows={5} className="text-sm">
                            <Column field="answered_at" header="Дата ответа"></Column>
                            <Column field="teacherResponse" header="Ответ преподавателя" body={teacherResponseTemplate}></Column>
                            <Column
                                header="Ответ студента"
                                className='flex justify-center'
                                body={(rowData) => {
                                    return (
                                        <>
                                            <a href={rowData?.file} download target="_blank" rel="noopener noreferrer">
                                                {' '}
                                                <i className='pi pi-file-arrow-up p-2 rounded bg-[var(--mainColor)] text-white'></i>
                                            </a>
                                        </>
                                    );
                                }}
                            ></Column>
                        </DataTable>
                    )}

                    {/* {report?.map((item: any) => { */}
                    {/* return (  */}
                    <div className="inline-flex flex-col gap-2 p-1 border-gray-200 rounded bg-white font-sans">
                        <div className="flex items-center gap-2">
                            <div className="tracking-wider text-gray-400 font-semibold">Дата создания: {report?.created_at ? new Date(report.created_at).toLocaleDateString() : '—'}</div>
                            <i className="pi pi-calendar-clock text-[var(--mainColor)]"></i>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* {report?.my_score ? ( */}
                            {/* // Вариант: Проверено (Строго, без лишних красок) */}
                            {report?.my_score && (
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">Статус: Проверено</span>
                                        <i className="pi pi-check-circle ml-1 text-[green]"></i>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">
                                            Балл: <b className="text-[var(--mainColor)]">{report?.my_score}</b>
                                        </span>
                                    </div>
                                </div>
                            )}
                            {/* // ) : (
                                //     // Вариант: Ожидание (С мягкой анимацией точки)
                                //     <div className="flex items-center gap-2">
                                //         <span className="font-medium text-blue-900">Статус: На проверке</span>
                                //         <i className="pi pi-spinner-dotted pi-spin ml-1"></i>
                                //     </div>
                                // )} */}
                        </div>
                    </div>
                    {/* );
                })} */}
                </div>
            )}
        </div>
    );
};

export default AnswersTable;
