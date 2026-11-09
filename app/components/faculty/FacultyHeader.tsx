'use client';

import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { useLocalization } from '@/layout/context/localizationcontext';

export const facultyCardClass = 'rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]';

// общая шапка для страниц faculty/: иконка, заголовок, счётчик, назад и поиск
export default function FacultyHeader({
    icon,
    title,
    subtitle,
    count,
    backHref,
    search,
    onSearch
}: {
    icon: string;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    count?: number;
    backHref?: string;
    search?: string;
    onSearch?: (value: string) => void;
}) {
    const { translations } = useLocalization();

    return (
        <div className={`${facultyCardClass} p-[14px] sm:p-[18px] flex flex-col gap-[14px]`}>
            <div className="flex items-center gap-[12px]">
                {backHref && (
                    <Link
                        href={backHref}
                        aria-label={translations.back}
                        title={translations.back}
                        className="group flex items-center justify-center shrink-0 w-[36px] h-[36px] rounded-[10px] bg-[#f1f5f9] text-[var(--bodyColor)] hover:bg-[var(--mainColor)] hover:text-white transition-colors duration-200"
                    >
                        <i className="pi pi-arrow-left text-[0.8125rem] transition-transform duration-200 group-hover:-translate-x-[2px]"></i>
                    </Link>
                )}
                <span className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                    <i className={`${icon} text-[1.125rem]`}></i>
                </span>
                <div className="flex flex-col gap-[4px] min-w-0">
                    <div className="flex flex-wrap items-center gap-[10px]">
                        <h3 className="text-[1.125rem] sm:text-[1.375rem] leading-tight font-bold text-[var(--titleColor)] m-0 break-words">{title}</h3>
                        {typeof count === 'number' && count > 0 && (
                            <span className="inline-flex items-center px-[10px] py-[3px] rounded-full bg-[#f1f5f9] text-[0.75rem] font-semibold text-[var(--bodyColor)]">{count}</span>
                        )}
                    </div>
                    {subtitle && <span className="text-[0.8125rem] text-[var(--text-color-secondary)]">{subtitle}</span>}
                </div>
            </div>

            {onSearch && (
                <div className="flex items-center relative w-full">
                    <i className="pi pi-search absolute left-[12px] z-[1] text-[0.8125rem] text-[var(--text-color-secondary)] pointer-events-none"></i>
                    <InputText value={search ?? ''} onChange={(e) => onSearch(e.target.value)} placeholder={translations.search} className="w-full h-[40px] text-[0.875rem]" style={{ paddingLeft: 36, paddingRight: 36, borderRadius: 10 }} />
                    {search && (
                        <button
                            type="button"
                            aria-label="clear"
                            onClick={() => onSearch('')}
                            className="absolute right-[8px] flex items-center justify-center w-[24px] h-[24px] rounded-full text-[var(--text-color-secondary)] hover:bg-[#f1f5f9] transition-colors"
                        >
                            <i className="pi pi-times text-[0.6875rem]"></i>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// общий блок "пусто / не найдено"
export const FacultyEmpty = ({ icon, text }: { icon: string; text: string }) => (
    <div className={`${facultyCardClass} flex flex-col items-center justify-center gap-[8px] py-[40px] px-[16px] text-center`}>
        <span className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#f1f5f9] text-[var(--text-color-secondary)]">
            <i className={`${icon} text-[1.375rem]`}></i>
        </span>
        <span className="text-[0.875rem] text-[var(--text-color-secondary)]">{text}</span>
    </div>
);
