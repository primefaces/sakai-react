'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { DataView } from 'primereact/dataview';
import useMediaQuery from '@/hooks/useMediaQuery';
import SubTitle from '@/app/components/SubTitle';
import { fetchArchivedCourses } from '@/services/courses';
import { myMainCourseType } from '@/types/myMainCourseType';
import { useLocalization } from '@/layout/context/localizationcontext';

interface ArchivedCourse extends myMainCourseType {
    archive_course: {
        copy_course_id: number;
        copy_have: boolean;
        course_id: number;
        id: number;
        created_at: string;
    };
    archived: boolean;
}

const ArchivePage = () => {
    const [archivedCourses, setArchivedCourses] = useState<ArchivedCourse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedRows, setExpandedRows] = useState<any>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { translations } = useLocalization();

    // Обновленная функция запроса с новыми моковыми данными
    const handleFetchArchivedCourses = async () => {
        setLoading(true);
        const data = await fetchArchivedCourses();
        if (data?.success) {
            setArchivedCourses(data.courses);
        } else {
            setArchivedCourses([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        handleFetchArchivedCourses();
    }, []);

    // Шаблоны для колонок DataTable
    const imageBodyTemplate = (rowData: ArchivedCourse) => <img src={rowData.image || '/layout/images/no-image.png'} alt={rowData.title} className="w-16 h-16 object-cover shadow-lg rounded-md" />;

    // const statusBodyTemplate = (rowData: ArchivedCourse) => {
    //     const statusMap = {
    //         open: { label: 'Открытый', severity: 'success' },
    //         closed: { label: 'Закрытый', severity: 'warning' },
    //         paid: { label: 'Платный', severity: 'info' }
    //     };
    //     // const statusInfo = statusMap[rowData.status] as { label: string; severity: any };
    //     // return <Tag value={statusInfo.label} severity={statusInfo.severity} />;
    // };

    // const reviewBodyTemplate = (rowData: ArchivedCourse) => (
    //     <label className="custom-radio opacity-60">
    //         <input type="checkbox" className="customCheckbox" checked={rowData.status} disabled />
    //         <span className="checkbox-mark"></span>
    //     </label>
    // );

    // const rowExpansionTemplate = (data: ArchivedCourse) => (
    //     <div className="p-3 bg-gray-100 dark:bg-gray-800">
    //         <h5 className="font-bold">История изменений для: {data.title}</h5>
    //         <DataTable value={data.history} dataKey="id" size="small" emptyMessage="...">
    //             <Column field="action" header="Действие" />
    //             <Column field="user" header="Пользователь" />
    //             <Column field="changedAt" header="Дата" body={(h) => new Date(h.changedAt).toLocaleDateString()} />
    //         </DataTable>
    //     </div>
    // );

    const publishedBodyTemplate = (rowData: ArchivedCourse) => (rowData.archive_course.copy_have ? <i className="pi pi-check-circle text-[var(--greenColor)] text-md"></i> : <i className="pi pi-times-circle text-[var(--redColor)] text-md"></i>);

    // Шаблон для мобильного вида DataView
    const itemTemplate = (course: ArchivedCourse) => {
        return (
            <div className="col-12 p-2">
                <div className="p-4 shadow  border-round filter">
                    <div className="flex flex-column align-items-center gap-3 py-5 sm:flex-row">
                        <div className="md:w-1/4 relative">
                            <img className="block xl:block mx-auto border-round rounded w-full" src={course.image || '/layout/images/no-image.png'} alt={course.title} />
                        </div>
                        <div className="md:w-3/4 text-center md:text-left">
                            <div className="text-xl font-bold">{course.title}</div>
                            <div className="mb-3 text-gray-500">{translations.archiveDate}: {new Date(course?.archive_course?.created_at).toLocaleDateString()}</div>
                            <div className="flex align-items-center justify-content-center md:justify-content-start gap-4">
                                <div>
                                    <span className="font-semibold">{translations.copy}: </span>
                                    {publishedBodyTemplate(course)}
                                </div>
                                {/* <div> */}
                                    {/* <span className="font-semibold">Балл: </span> */}
                                    {/* {course.max_score} */}
                                {/* </div> */}
                                {/* <div> */}
                                    {/* <span className="font-semibold">Потоки: </span> */}
                                    {/* {course.streams_count} */}
                                {/* </div> */}
                            </div>
                            {/* <div className="flex align-items-center justify-content-center md:justify-content-start gap-4 mt-2">
                                <div>
                                    <span className="font-semibold opacity-60">На рассмотрении: </span>
                                    {reviewBodyTemplate(course)}
                                </div>
                                <div>
                                    <span className="font-semibold">Публикация: </span>
                                    {publishedBodyTemplate(course)}
                                </div>
                            </div> */}
                            {/* <Button 
                                label="Показать историю" 
                                icon="pi pi-chevron-down" 
                                className="p-button-text mt-3" 
                                onClick={() => {
                                    const newExpandedRows = expandedRows && expandedRows[course.id] ? null : { [course.id]: true };
                                    setExpandedRows(newExpandedRows);
                                }} 
                            /> */}
                        </div>
                    </div>
                    {/* {expandedRows && expandedRows[course.id] && rowExpansionTemplate(course)} */}
                </div>
            </div>
        );
    };

    const header = <SubTitle title={translations.archiveCourses} mobileTitleSize="xl" titleSize="2xl" />;

    if (loading) {
        return (
            <div className="main-bg flex justify-center items-center h-[50vh]">
                <ProgressSpinner style={{ width: '60px', height: '60px' }} />
            </div>
        );
    }

    return (
        <div className="main-bg bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-4 rounded-md" role="alert">
                <div className="flex items-center">
                    <i className="pi pi-info-circle mr-3 "></i>
                    <div>
                        <p className="font-bold">{translations.readOnly}</p>
                        <p className="text-sm">{translations.archiveReadOnlyNotice}</p>
                    </div>
                </div>
            </div>

            {isMobile ? (
                <DataView value={archivedCourses} itemTemplate={itemTemplate} header={header} rows={5} emptyMessage="..." />
            ) : (
                <DataTable
                    value={archivedCourses}
                    header={header}
                    dataKey="id"
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    // rowExpansionTemplate={rowExpansionTemplate}
                    loading={loading}
                    emptyMessage="..."
                    className="p-datatable-striped filter transition-all duration-300 text-sm my-custom-table"
                    removableSort
                    rows={5}
                >
                    {/* <Column expander style={{ width: '3em' }} /> */}
                    <Column body={(_, { rowIndex }) => rowIndex + 1} header={translations.numberSign} style={{ width: '20px' }}></Column>
                    <Column header={translations.photo} body={imageBodyTemplate} style={{ width: '10%' }} />
                    <Column field="title" header={translations.title} />
                    <Column header={translations.copy} body={publishedBodyTemplate} />
                    <Column header={translations.archiveDate} body={(rowData)=> new Date(rowData?.archive_course?.created_at).toLocaleDateString()} />
                    {/* <Column field="max_score" header="Балл" />
                    <Column header="На рассмотрение" body={reviewBodyTemplate} />
                    <Column header="Публикация" body={publishedBodyTemplate} />
                    <Column field="streams_count" header="Потоки" /> */}
                </DataTable>
            )}
        </div>
    );
};

export default ArchivePage;

