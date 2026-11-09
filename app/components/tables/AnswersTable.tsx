import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MobileAnswersTable, { TeacherResponseBadge } from './MobileAnswersTable';
import useMediaQuery from '@/hooks/useMediaQuery';

interface Answer {
    themeName: string;
    submissionDate: string;
    teacherResponse: boolean;
    teacherResponseDate: string;
    answered_at: string | null;
    comment: string | null;
    file: string | null;
}

// строка "иконка — подпись — значение"
const InfoRow = ({ icon, iconClass, label, children }: { icon: string; iconClass: string; label: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-[10px] min-w-0">
        <span className={`flex items-center justify-center shrink-0 w-[32px] h-[32px] rounded-[10px] ${iconClass}`}>
            <i className={`${icon} text-[0.8125rem]`}></i>
        </span>
        <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-[0.6875rem] uppercase tracking-[0.04em] font-semibold text-[var(--text-color-secondary)]">{label}</span>
            <span className="text-[0.875rem] font-semibold text-[var(--titleColor)] truncate">{children}</span>
        </div>
    </div>
);

const AnswersTable = ({ report }: { report: any }) => {
    const media = useMediaQuery(`(max-width: 640px)`);

    return (
        <div className="flex flex-col gap-[12px] pt-[14px] border-t border-[#f1f5f9]">
            <div className="flex items-center gap-[8px]">
                <i className="pi pi-file-check text-[var(--mainColor)]"></i>
                <h3 className="text-[0.9375rem] sm:text-[1.0625rem] font-bold text-[var(--titleColor)] m-0">Отчёт</h3>
            </div>

            {/* сводка */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] p-[12px] rounded-[12px] bg-[#f8fafc]">
                <InfoRow icon="pi pi-calendar" iconClass="bg-[var(--mainColor)]/10 text-[var(--mainColor)]" label="Дата создания">
                    {report?.created_at ? new Date(report.created_at).toLocaleDateString() : '—'}
                </InfoRow>
                {!!report?.my_score && (
                    <>
                        <InfoRow icon="pi pi-check-circle" iconClass="bg-[#effaf0] text-[var(--greenColor)]" label="Статус">
                            Проверено
                        </InfoRow>
                        <InfoRow icon="pi pi-star" iconClass="bg-[#fff7e6] text-[#f59e0b]" label="Балл">
                            <span className="text-[var(--mainColor)]">{report?.my_score}</span>
                        </InfoRow>
                    </>
                )}
            </div>

            {/* ответы преподавателя */}
            {media ? (
                <MobileAnswersTable answers={report} />
            ) : (
                report?.details?.length > 0 && (
                    <DataTable value={report?.details} tableStyle={{ minWidth: '40rem' }} emptyMessage={'...'} rows={5} className="text-sm">
                        <Column field="answered_at" header="Дата ответа"></Column>
                        <Column field="teacherResponse" header="Ответ преподавателя" body={(rowData: Answer) => <TeacherResponseBadge row={rowData} />}></Column>
                        <Column
                            header="Ответ студента"
                            body={(rowData) => (
                                <a
                                    href={rowData?.file}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-[6px] px-[10px] h-[32px] rounded-[8px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.8125rem] font-semibold hover:bg-[var(--mainColor)] hover:text-white transition-colors"
                                >
                                    <i className="pi pi-file-pdf text-[0.8125rem]"></i>
                                    Файл
                                </a>
                            )}
                        ></Column>
                    </DataTable>
                )
            )}
        </div>
    );
};

export default AnswersTable;
