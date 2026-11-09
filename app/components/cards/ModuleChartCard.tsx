'use client';

import MyDateTime from '../MyDateTime';
import { useLocalization } from '@/layout/context/localizationcontext';

interface DateType {
    from: string | null;
    to: string | null;
}

type ModuleChartCardProps = {
    title?: string;
    connectId: number;
    handleEdit: (id: number, checked: { checked: boolean }) => void;
    allIds: number[] | null;
    date?: DateType;
    dateUpdate?: (id: number) => void;
    active?: boolean; // график потока уже активен на сервере
};

type OptionsType = Intl.DateTimeFormatOptions;

const options: OptionsType = {
    year: '2-digit',
    month: 'short', // 'long', 'short', 'numeric'
    day: '2-digit',
    hour12: false // 24-часовой формат
};

export default function ModuleChartCard({ title = 'Название карточки', connectId, handleEdit, allIds, date, dateUpdate, active }: ModuleChartCardProps) {
    const { translations } = useLocalization();
    const checked = allIds ? allIds.some((s) => s === connectId) : false;
    const hasDate = Boolean(date?.from || date?.to);

    return (
        // вся строка — label, клик по ней переключает чекбокс
        <label
            className={`group w-full flex items-center gap-[12px] p-[10px] sm:p-[12px] rounded-[12px] border cursor-pointer select-none transition-colors duration-200 ${
                checked ? 'border-[var(--mainBorder)] bg-[var(--mainColor)]/5' : 'border-[#eef2f6] bg-white hover:bg-[#f8fbfd]'
            }`}
        >
            <input
                type="checkbox"
                className="customCheckbox shrink-0"
                checked={checked}
                onChange={(e) => {
                    handleEdit(connectId, e.target);
                }}
            />

            <div className="flex flex-col gap-[6px] min-w-0 flex-1">
                <span className="text-[14px] font-semibold leading-snug text-[var(--titleColor)] break-words">{title}</span>
                <div className="flex flex-wrap items-center gap-[6px]">
                    <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[#f1f5f9] text-[11px] font-semibold text-[var(--bodyColor)]">ID {connectId}</span>
                    {active ? (
                        <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-[#ecfdf3] text-[11px] font-semibold text-[#16a34a]">
                            <i className="pi pi-check-circle text-[10px]"></i>
                            {translations.isActive}
                        </span>
                    ) : (
                        checked && (
                            <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-[var(--mainColor)]/10 text-[11px] font-semibold text-[var(--mainColor)]">
                                <i className="pi pi-plus-circle text-[10px]"></i>
                                {translations.newLabel}
                            </span>
                        )
                    )}
                    {hasDate && (
                        <span className="inline-flex items-center gap-[4px] text-[12px] text-[var(--bodyColor)] whitespace-nowrap">
                            <i className="pi pi-calendar text-[11px] text-[var(--text-color-secondary)]"></i>
                            {date?.from ? <MyDateTime createdAt={date.from} options={options} /> : '—'}
                            <span>–</span>
                            {date?.to ? <MyDateTime createdAt={date.to} options={options} /> : '—'}
                        </span>
                    )}
                </div>
            </div>

            {date?.from && date?.to && dateUpdate && (
                <button
                    type="button"
                    aria-label={translations.dateUpdate}
                    title={translations.dateUpdate}
                    className="flex items-center justify-center shrink-0 w-[32px] h-[32px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] hover:bg-[var(--mainColor)] hover:text-white transition-colors duration-200 cursor-pointer"
                    onClick={(e) => {
                        // не переключать чекбокс строки
                        e.preventDefault();
                        e.stopPropagation();
                        dateUpdate(connectId);
                    }}
                >
                    <i className="pi pi-pencil text-[12px]"></i>
                </button>
            )}
        </label>
    );
}
