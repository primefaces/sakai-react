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

    return (
        <div className={`lang-switch inline-flex items-center gap-1 rounded-full bg-[var(--mainBgColor)] border border-[var(--borderBottomColor)] p-[3px] select-none ${full ? 'w-full' : ''}`}>
            {!full && <i className="pi pi-globe px-2 text-[var(--mainColor)]" style={{ fontSize: '14px' }} />}
            <div className="relative flex flex-1 items-center" role="radiogroup" aria-label="Language">
                <span
                    className="lang-switch-thumb absolute inset-y-0 left-0 rounded-full bg-[var(--whiteColor)] shadow-[0_1px_4px_rgba(33,34,95,0.15)] transition-transform duration-300 ease-out"
                    style={{ width: `${100 / languages.length}%`, transform: `translateX(${activeIndex * 100}%)` }}
                />
                {languages.map((l) => {
                    const active = l.code === language;
                    return (
                        <button
                            key={l.code}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => !active && setLanguage(l.code)}
                            className={`relative z-10 flex-1 rounded-full whitespace-nowrap transition-colors duration-200 cursor-pointer ${full ? 'py-2 px-3 text-base' : 'py-1 px-[10px] text-[13px] min-w-[38px]'} ${
                                active ? 'text-[var(--mainColor)] font-semibold' : 'text-[var(--bodyColor)] hover:text-[var(--titleColor)]'
                            }`}
                        >
                            {full ? l.full : l.short}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
