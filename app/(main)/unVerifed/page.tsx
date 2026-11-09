'use client';

import MyDateTime from '@/app/components/MyDateTime';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useLocalization } from '@/layout/context/localizationcontext';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

const cardClass = 'rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]';

const DAY = 24 * 60 * 60 * 1000;

// цвет по времени ожидания: до суток / до 3 дней / дольше
const ageStyle = (createdAt?: string) => {
    const diff = createdAt ? Date.now() - new Date(createdAt).getTime() : 0;
    if (!diff || isNaN(diff) || diff < DAY) return { bar: 'bg-[var(--mainColor)]', chip: 'bg-[var(--mainColor)]/10 text-[var(--mainColor)]', long: false };
    if (diff < 3 * DAY) return { bar: 'bg-[#f59e0b]', chip: 'bg-[#fff7e6] text-[#b45309]', long: false };
    return { bar: 'bg-[var(--redColor)]', chip: 'bg-[var(--redBgColor)] text-[var(--redColor)]', long: true };
};

export default function UnVerifed() {
    type OptionsType = Intl.DateTimeFormatOptions;

    const showError = useErrorMessage();
    const { setMessage, contextFetchVerifed, contextVerifedValue } = useContext(LayoutContext);
    const { language, translations } = useLocalization();

    const [skeleton, setSkeleton] = useState(true);

    // список берём напрямую из контекста, чтобы не было лишнего кадра с устаревшим состоянием
    const tasks: answerListType[] = Array.isArray(contextVerifedValue) ? contextVerifedValue : [];

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24-часовой формат
    };

    // "2 ч. назад", "3 дн. назад"
    const relativeTime = (createdAt?: string) => {
        if (!createdAt) return '';
        const diff = new Date(createdAt).getTime() - Date.now();
        if (isNaN(diff)) return '';
        try {
            const rtf = new Intl.RelativeTimeFormat(language === 'ky' ? 'ky' : 'ru', { numeric: 'auto', style: 'short' });
            const minutes = Math.round(diff / 60000);
            if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
            const hours = Math.round(minutes / 60);
            if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
            const days = Math.round(hours / 24);
            if (Math.abs(days) < 30) return rtf.format(days, 'day');
            return rtf.format(Math.round(days / 30), 'month');
        } catch {
            return '';
        }
    };

    useEffect(() => {
        // контекст изначально хранит [], поэтому ждём ответа, чтобы не мигало "Нет данных"
        const load = async () => {
            setSkeleton(true);
            await contextFetchVerifed();
            setSkeleton(false);
        };
        load();
    }, []);

    useEffect(() => {
        if (!Array.isArray(contextVerifedValue)) {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (contextVerifedValue?.response?.status) {
                showError(contextVerifedValue.response.status);
            }
        }
    }, [contextVerifedValue]);

    const taskItem = (item: answerListType, idx: number) => {
        const href = `/students/${item?.answer?.course_id}/${item?.connect_id}/${item?.answer?.id_stream}/${item?.answer?.student?.myedu_id}/${item?.answer?.student?.id}/${item?.answer?.lesson_id}/${item?.answer?.steps_id}`;
        const student = item?.answer?.student;
        const fullName = `${student?.last_name ?? ''} ${student?.name ?? ''} ${student?.father_name ?? ''}`.trim();
        const age = ageStyle(item?.answer?.created_at);
        const ago = relativeTime(item?.answer?.created_at);

        return (
            <Link
                key={item?.answer?.id}
                href={href}
                className={`${cardClass} fade-up group relative flex items-center gap-[12px] p-[12px] sm:p-[16px] overflow-hidden transition-all duration-200 hover:border-[var(--mainBorder)] hover:shadow-[0_8px_20px_-12px_rgba(8,169,230,0.6)]`}
                style={{ animationDelay: `${Math.min(idx, 12) * 30}ms` }}
            >
                {/* индикатор времени ожидания */}
                <span className={`absolute left-0 top-0 bottom-0 w-[4px] ${age.bar}`}></span>

                <span className="flex items-center justify-center shrink-0 w-[42px] h-[42px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.875rem] font-bold uppercase">
                    {`${student?.last_name?.[0] ?? ''}${student?.name?.[0] ?? ''}` || <i className="pi pi-user text-[0.875rem]"></i>}
                </span>

                <div className="flex flex-col gap-[6px] min-w-0 flex-1">
                    <span className="text-[0.875rem] sm:text-[0.9375rem] font-semibold leading-snug text-[var(--titleColor)] break-words group-hover:text-[var(--mainColor)] transition-colors">{fullName || '—'}</span>
                    <div className="flex flex-wrap items-center gap-[6px]">
                        <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-[#fff7e6] text-[#b45309] text-[0.6875rem] font-semibold">
                            <i className="pi pi-pen-to-square text-[0.625rem]"></i>
                            {translations.practicalTask}
                        </span>
                        {ago && (
                            <span className={`inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[0.6875rem] font-semibold ${age.chip}`} title={age.long ? translations.waitingLong : undefined}>
                                <i className="pi pi-clock text-[0.625rem]"></i>
                                {ago}
                            </span>
                        )}
                        <span className="text-[0.6875rem] text-[var(--text-color-secondary)]">
                            <MyDateTime createdAt={item?.answer?.created_at} options={options} />
                        </span>
                    </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-[6px] shrink-0 h-[34px] px-[12px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.8125rem] font-semibold whitespace-nowrap group-hover:bg-[var(--mainColor)] group-hover:text-white transition-colors duration-200">
                    {translations.toCheck}
                    <i className="pi pi-arrow-right text-[0.6875rem] transition-transform duration-200 group-hover:translate-x-[2px]"></i>
                </span>
                <i className="sm:hidden pi pi-angle-right shrink-0 text-[0.875rem] text-[var(--text-color-secondary)]"></i>
            </Link>
        );
    };

    const content = () => {
        if (skeleton) return <GroupSkeleton count={4} size={{ width: '100%', height: '5rem' }} />;

        if (tasks.length === 0) {
            return (
                <div className={`${cardClass} flex flex-col items-center justify-center gap-[10px] py-[48px] px-[16px] text-center`}>
                    <span className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-[#ecfdf3] text-[#16a34a]">
                        <i className="pi pi-check-circle text-[1.5rem]"></i>
                    </span>
                    <span className="text-[0.875rem] text-[var(--text-color-secondary)]">{translations.noData}</span>
                </div>
            );
        }

        return <div className="flex flex-col gap-[8px]">{tasks.map((item, idx) => taskItem(item, idx))}</div>;
    };

    const count = skeleton ? 0 : tasks.length;

    return (
        <div className="flex flex-col gap-[16px] pb-[16px]">
            {/* шапка */}
            <div className={`${cardClass} p-[14px] sm:p-[18px] flex items-center gap-[12px]`}>
                <span className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                    <i className="pi pi-inbox text-[1.125rem]"></i>
                </span>
                <div className="flex flex-col gap-[4px] min-w-0">
                    <div className="flex flex-wrap items-center gap-[10px]">
                        <h3 className="text-[1.125rem] sm:text-[1.375rem] leading-tight font-bold text-[var(--titleColor)] m-0">{translations.unverifiedTasks}</h3>
                        {count > 0 && <span className="inline-flex items-center px-[10px] py-[3px] rounded-full bg-[#f1f5f9] text-[0.75rem] font-semibold text-[var(--bodyColor)]">{count}</span>}
                    </div>
                    <span className="text-[0.8125rem] text-[var(--text-color-secondary)]">{translations.unverifiedHint}</span>
                </div>
            </div>

            {content()}
        </div>
    );
}
