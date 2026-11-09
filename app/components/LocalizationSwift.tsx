'use client';

import { Language, useLocalization } from '@/layout/context/localizationcontext';

const languages: { code: Language; short: string; full: string }[] = [
    { code: 'ru', short: 'RU', full: 'Русский' },
    { code: 'ky', short: 'KY', full: 'Кыргызча' }
];

export default function LocalizationSwift({ full = false }: { full?: boolean }) {
    const { language, setLanguage } = useLocalization();
    const activeIndex = Math.max(
        languages.findIndex((l) => l.code === language),
        0
    );

    // Стили контейнера и бегунка: полная версия (настройки) без изменений, компактная (топбар ПК) — обновлённая
    const wrapperClass = full
        ? 'w-full gap-1 bg-[var(--mainBgColor)] border-[var(--borderBottomColor)] p-[3px]'
        : 'gap-[6px] bg-[var(--whiteColor)] border-[var(--borderBottomColor)] p-[4px] shadow-[0_2px_10px_rgba(33,34,95,0.06)] transition-shadow duration-200 hover:shadow-[0_4px_14px_rgba(33,34,95,0.1)]';

    const thumbClass = full ? 'bg-[var(--whiteColor)] shadow-[0_1px_4px_rgba(33,34,95,0.15)]' : 'bg-[var(--mainColor)] shadow-[0_2px_8px_rgba(33,34,95,0.25)]';

    return (
        <div className={`lang-switch inline-flex items-center rounded-full border select-none ${wrapperClass}`}>
            {!full && (
                <span className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-[var(--mainBgColor)] text-[var(--mainColor)] shrink-0">
                    <i className="pi pi-globe" style={{ fontSize: '13px' }} />
                </span>
            )}
            <div className="relative flex flex-1 items-center" role="radiogroup" aria-label="Language">
                <span
                    className={`lang-switch-thumb absolute inset-y-0 left-0 rounded-full transition-transform duration-300 ease-out ${thumbClass}`}
                    style={{ width: `${100 / languages.length}%`, transform: `translateX(${activeIndex * 100}%)` }}
                />
                {languages.map((l) => {
                    const active = l.code === language;
                    const colorClass = full
                        ? active
                            ? 'text-[var(--mainColor)] font-semibold'
                            : 'text-[var(--bodyColor)] hover:text-[var(--titleColor)]'
                        : active
                        ? 'text-white font-semibold'
                        : 'text-[var(--bodyColor)] font-medium hover:text-[var(--mainColor)]';
                    return (
                        <button
                            key={l.code}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => !active && setLanguage(l.code)}
                            className={`relative z-10 flex-1 rounded-full whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                                full ? 'py-2 px-3 text-base' : 'h-[28px] px-[12px] text-[12px] tracking-[0.04em] min-w-[40px]'
                            } ${colorClass}`}
                        >
                            {full ? l.full : l.short}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
