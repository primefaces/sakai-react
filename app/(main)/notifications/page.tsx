'use client';

import MyDateTime from '@/app/components/MyDateTime';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useLocalization } from '@/layout/context/localizationcontext';
import { statusView } from '@/services/notifications';
import { mainNotification } from '@/types/mainNotification';
import { OptionsType } from '@/types/OptionsType';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { confirmDialog } from 'primereact/confirmdialog';
import React, { useContext, useEffect, useState } from 'react';

const cardClass = 'rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]';

const timeOptions: OptionsType = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24-часовой формат
};

// оформление по типу уведомления
const typeStyle = (type?: string) => {
    if (type === 'practical') return { icon: 'pi pi-pen-to-square', chip: 'bg-[#fff7e6] text-[#b45309]', iconBox: 'bg-[#fff7e6] text-[#d97706]' };
    if (type === 'view') return { icon: 'pi pi-eye', chip: 'bg-[var(--mainColor)]/10 text-[var(--mainColor)]', iconBox: 'bg-[var(--mainColor)]/10 text-[var(--mainColor)]' };
    return { icon: 'pi pi-bell', chip: 'bg-[var(--redBgColor)] text-[var(--redColor)]', iconBox: 'bg-[var(--redBgColor)] text-[var(--redColor)]' };
};

const dayKey = (date: string) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toDateString();
};

export default function MainNotificatoin() {
    const { user, setMessage, contextNotifications, handleNotifications } = useContext(LayoutContext);
    const { translations } = useLocalization();
    const [notification, setNotification] = useState<mainNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const showError = useErrorMessage();

    const handleStatusView = async (notification_id: number | null) => {
        if (notification_id) {
            setDeletingId(notification_id);
            const data = await statusView(Number(notification_id));
            if (data?.success) {
                setMessage({
                    state: true,
                    value: { severity: 'success', summary: translations.deleteSuccess, detail: '' }
                });
            } else {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
                });
                if (data?.response?.status) {
                    showError(data.response.status);
                }
            }
            if (user?.is_working || user?.is_student) {
                await handleNotifications();
            }
            setDeletingId(null);
        }
    };

    const handleDeleteVisible = (id: number) => {
        const options = getConfirmOptions(Number(id), () => handleStatusView(id));
        confirmDialog(options);
    };

    // заголовок группы: Сегодня / Вчера / дата
    const dayLabel = (date: string) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (d.toDateString() === today.toDateString()) return translations.today;
        if (d.toDateString() === yesterday.toDateString()) return translations.yesterday;
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric' });
    };

    const NotificationItem = ({ notificate, idx }: { notificate: mainNotification; idx: number }) => {
        const style = typeStyle(notificate?.type?.type);
        const from = notificate?.from_user;
        const fullName = `${from?.last_name ?? ''} ${from?.name ?? ''} ${from?.father_name ?? ''}`.trim();
        const shortName = `${from?.last_name ?? ''} ${from?.name?.[0] ? from.name[0] + '.' : ''} ${from?.father_name?.trim()?.[0] ? from.father_name.trim()[0] + '.' : ''}`.trim();
        const isDeleting = deletingId === notificate?.id;

        return (
            <div
                className={`${cardClass} fade-up group flex gap-[12px] p-[12px] sm:p-[16px] transition-all duration-200 hover:border-[#e2e8f0] hover:shadow-[0_8px_20px_-14px_rgba(15,23,42,0.35)] ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                style={{ animationDelay: `${Math.min(idx, 12) * 30}ms` }}
            >
                <span className={`hidden sm:flex items-center justify-center shrink-0 w-[42px] h-[42px] rounded-[12px] ${style.iconBox}`}>
                    <i className={`${style.icon} text-[16px]`}></i>
                </span>

                <div className="flex flex-col gap-[8px] min-w-0 flex-1">
                    {/* шапка: отправитель, тип, удалить */}
                    <div className="flex items-start justify-between gap-[8px]">
                        <div className="flex flex-col gap-[4px] min-w-0">
                            <div className="flex flex-wrap items-center gap-[6px]">
                                <span className="text-[14px] font-semibold text-[var(--titleColor)] leading-snug break-words">
                                    <span className="hidden sm:inline">{fullName}</span>
                                    <span className="sm:hidden">{shortName}</span>
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-[6px]">
                                {notificate?.type?.title && (
                                    <span className={`inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[11px] font-semibold ${style.chip}`}>
                                        <i className={`${style.icon} text-[10px] sm:hidden`}></i>
                                        {notificate.type.title}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-[4px] text-[12px] text-[var(--text-color-secondary)]">
                                    <i className="pi pi-clock text-[10px]"></i>
                                    <MyDateTime createdAt={notificate?.created_at} options={timeOptions} />
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            aria-label={translations.delete}
                            title={translations.delete}
                            onClick={() => handleDeleteVisible(notificate?.id)}
                            className="flex items-center justify-center shrink-0 w-[32px] h-[32px] rounded-[10px] text-[var(--text-color-secondary)] bg-[#f8fafc] hover:bg-[var(--redBgColor)] hover:text-[var(--redColor)] transition-colors duration-200 cursor-pointer sm:opacity-60 sm:group-hover:opacity-100"
                        >
                            <i className="pi pi-trash text-[13px]"></i>
                        </button>
                    </div>

                    {/* сообщение */}
                    {notificate?.title && <p className="m-0 text-[14px] leading-relaxed text-[var(--bodyColor)] break-words">{notificate.title}</p>}

                    {/* причина */}
                    {notificate?.meta?.title && (
                        <div className="flex flex-col gap-[4px] p-[10px] sm:p-[12px] rounded-[12px] bg-[#f8fafc] border-l-[3px] border-[var(--mainColor)]">
                            <span className="text-[11px] uppercase tracking-[0.04em] font-semibold text-[var(--text-color-secondary)]">{translations.reason}</span>
                            <span className="text-[13px] sm:text-[14px] font-semibold text-[var(--titleColor)] break-words">{notificate.meta.title}</span>
                            {notificate?.meta?.description && <span className="text-[13px] leading-relaxed text-[var(--bodyColor)] break-words whitespace-pre-line">{notificate.meta.description}</span>}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (contextNotifications) {
            setNotification(contextNotifications);
        }
    }, [contextNotifications]);

    useEffect(() => {
        const load = async () => {
            if (user?.is_working || user?.is_student) {
                setLoading(true);
                await handleNotifications();
            }
            setLoading(false);
        };
        if (user) load();
    }, [user]);

    // группировка по дням
    const groups: { key: string; label: string; items: mainNotification[] }[] = [];
    notification.forEach((item) => {
        const key = dayKey(item?.created_at);
        const last = groups[groups.length - 1];
        if (last && last.key === key) {
            last.items.push(item);
        } else {
            groups.push({ key, label: dayLabel(item?.created_at), items: [item] });
        }
    });

    const content = () => {
        if (loading && notification.length === 0) return <GroupSkeleton count={4} size={{ width: '100%', height: '6rem' }} />;

        if (notification.length === 0) {
            return (
                <div className={`${cardClass} flex flex-col items-center justify-center gap-[10px] py-[48px] px-[16px] text-center`}>
                    <span className="relative flex items-center justify-center w-[60px] h-[60px] rounded-full bg-[#f1f5f9] text-[var(--text-color-secondary)]">
                        <i className="pi pi-bell-slash text-[24px]"></i>
                    </span>
                    <span className="text-[14px] text-[var(--text-color-secondary)]">{translations.noData}</span>
                </div>
            );
        }

        let counter = 0;
        return (
            <div className="flex flex-col gap-[18px]">
                {groups.map((group, gIdx) => (
                    <div key={`${group.key}-${gIdx}`} className="flex flex-col gap-[8px]">
                        {group.label && (
                            <div className="flex items-center gap-[10px] px-[4px]">
                                <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-color-secondary)] whitespace-nowrap">{group.label}</span>
                                <span className="h-[1px] flex-1 bg-[#e8edf3]"></span>
                                <span className="text-[11px] font-semibold text-[var(--text-color-secondary)]">{group.items.length}</span>
                            </div>
                        )}
                        {group.items.map((item) => (
                            <NotificationItem key={item?.id} notificate={item} idx={counter++} />
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-[16px] pb-[16px]">
            {/* шапка */}
            <div className={`${cardClass} p-[14px] sm:p-[18px] flex items-center gap-[12px]`}>
                <span className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                    <i className="pi pi-bell text-[18px]"></i>
                </span>
                <div className="flex flex-col gap-[4px] min-w-0">
                    <div className="flex flex-wrap items-center gap-[10px]">
                        <h3 className="text-[18px] sm:text-[22px] leading-tight font-bold text-[var(--titleColor)] m-0">{translations.notifications}</h3>
                        {notification.length > 0 && <span className="inline-flex items-center px-[10px] py-[3px] rounded-full bg-[#f1f5f9] text-[12px] font-semibold text-[var(--bodyColor)]">{notification.length}</span>}
                    </div>
                    <span className="text-[13px] text-[var(--text-color-secondary)]">{translations.notificationsHint}</span>
                </div>
            </div>

            {content()}
        </div>
    );
}
