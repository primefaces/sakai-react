import React from 'react';

interface Details {
    answered_at: string | null;
    comment: string | null;
    file?: string | null;
}

// Статус ответа преподавателя: на проверке / есть замечание / ответил
export const TeacherResponseBadge = ({ row }: { row: Details }) => {
    const answered = !!(row.answered_at && row.answered_at?.length);

    if (!answered) {
        return (
            <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-[#fff7e6] text-[#b45309] text-[0.75rem] font-semibold">
                <i className="pi pi-clock text-[0.6875rem]"></i>
                Пока проверка не завершена
            </span>
        );
    }

    if (row.comment) {
        return (
            <div className="flex items-start gap-[8px] p-[10px] rounded-[10px] bg-[#fef2f2] text-[#b91c1c] text-[0.8125rem] leading-snug">
                <i className="pi pi-comment text-[0.8125rem] mt-[2px] shrink-0"></i>
                <span className="break-words min-w-0">{row.comment}</span>
            </div>
        );
    }

    return (
        <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-[#effaf0] text-[var(--greenColor)] text-[0.75rem] font-semibold">
            <i className="pi pi-check text-[0.6875rem]"></i>
            Ответил
        </span>
    );
};

const MobileAnswersTable = ({ answers }: { answers: any }) => {
    const detail: Details | undefined = answers?.details?.[0];
    if (!detail) return null;

    return (
        <div className="flex flex-col gap-[8px] p-[12px] rounded-[12px] border border-[#eef2f6] bg-white">
            <div className="flex items-center justify-between gap-[8px]">
                <span className="text-[0.6875rem] uppercase tracking-[0.04em] font-semibold text-[var(--text-color-secondary)]">Ответ преподавателя</span>
                {detail.answered_at && <span className="text-[0.75rem] text-[var(--text-color-secondary)] whitespace-nowrap">{detail.answered_at}</span>}
            </div>
            <TeacherResponseBadge row={detail} />
        </div>
    );
};

export default MobileAnswersTable;
