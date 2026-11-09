'use client';

import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useMediaQuery from '@/hooks/useMediaQuery';
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

type CopyFilter = 'all' | 'copy' | 'noCopy';

const cardClass = 'rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]';

const formatDate = (date?: string) => {
    if (!date) return '—';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ArchivePage = () => {
    const [archivedCourses, setArchivedCourses] = useState<ArchivedCourse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState('');
    const [copyFilter, setCopyFilter] = useState<CopyFilter>('all');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { translations } = useLocalization();

    const handleFetchArchivedCourses = async () => {
        setLoading(true);
        const data = await fetchArchivedCourses();
        if (data?.success) {
            setArchivedCourses(data.courses || []);
        } else {
            setArchivedCourses([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        handleFetchArchivedCourses();
    }, []);

    const copyCount = archivedCourses.filter((c) => c?.archive_course?.copy_have).length;
    const query = search.trim().toLowerCase();
    const filtered = archivedCourses.filter((c) => {
        if (query && !c?.title?.toLowerCase().includes(query)) return false;
        if (copyFilter === 'copy') return Boolean(c?.archive_course?.copy_have);
        if (copyFilter === 'noCopy') return !c?.archive_course?.copy_have;
        return true;
    });

    const courseImage = (course: ArchivedCourse, size: string) => (
        <span className={`${size} relative shrink-0 rounded-[12px] overflow-hidden bg-[#f1f5f9] border border-[#eef2f6]`}>
            {typeof course.image === 'string' && course.image ? (
                <img src={course.image} alt={course.title} className="w-full h-full object-cover grayscale-[35%]" />
            ) : (
                <img src={'/layout/images/no-image.png'} alt="No image" className="w-full h-full object-cover opacity-50" />
            )}
            <span className="absolute right-[3px] bottom-[3px] flex items-center justify-center w-[18px] h-[18px] rounded-full bg-white/90 text-[var(--text-color-secondary)] shadow-sm">
                <i className="pi pi-lock text-[0.5625rem]"></i>
            </span>
        </span>
    );

    const copyChip = (course: ArchivedCourse) =>
        course?.archive_course?.copy_have ? (
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#ecfdf3] text-[#16a34a] text-[0.75rem] font-semibold whitespace-nowrap">
                <i className="pi pi-copy text-[0.6875rem]"></i>
                {translations.copyCreated}
            </span>
        ) : (
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#f1f5f9] text-[var(--text-color-secondary)] text-[0.75rem] font-semibold whitespace-nowrap">
                <i className="pi pi-minus-circle text-[0.6875rem]"></i>
                {translations.noCopy}
            </span>
        );

    const dateChip = (course: ArchivedCourse) => (
        <span className="inline-flex items-center gap-[5px] text-[0.75rem] text-[var(--bodyColor)] whitespace-nowrap">
            <i className="pi pi-calendar text-[0.6875rem] text-[var(--text-color-secondary)]"></i>
            {formatDate(course?.archive_course?.created_at)}
        </span>
    );

    // сегментированный фильтр по копии
    const filterButton = (value: CopyFilter, label: string, count: number) => (
        <button
            key={value}
            type="button"
            onClick={() => setCopyFilter(value)}
            className={`inline-flex items-center gap-[6px] h-[32px] px-[12px] rounded-[9px] text-[0.8125rem] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                copyFilter === value ? 'bg-white text-[var(--mainColor)] shadow-[0_1px_3px_rgba(15,23,42,0.08),0_4px_10px_-6px_rgba(8,169,230,0.45)]' : 'bg-transparent text-[var(--bodyColor)] hover:bg-white/70'
            }`}
        >
            {label}
            <span className={`px-[6px] rounded-full text-[0.6875rem] ${copyFilter === value ? 'bg-[var(--mainColor)]/10' : 'bg-black/5'}`}>{count}</span>
        </button>
    );

    const emptyBlock = (icon: string, text: string) => (
        <div className="flex flex-col items-center justify-center gap-[8px] py-[40px] text-center">
            <span className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#f1f5f9] text-[var(--text-color-secondary)]">
                <i className={`${icon} text-[1.375rem]`}></i>
            </span>
            <span className="text-[0.875rem] text-[var(--text-color-secondary)]">{text}</span>
        </div>
    );

    const content = () => {
        if (loading) return <GroupSkeleton count={4} size={{ width: '100%', height: '4.5rem' }} />;
        if (archivedCourses.length === 0) return emptyBlock('pi pi-inbox', translations.noData);
        if (filtered.length === 0) return emptyBlock('pi pi-search', translations.nothingFound);

        if (isMobile) {
            return (
                <div className="flex flex-col gap-[10px]">
                    {filtered.map((course, idx) => (
                        <div key={course.id} className="fade-up flex flex-col gap-[10px] p-[12px] rounded-[14px] border border-[#eef2f6] bg-white" style={{ animationDelay: `${Math.min(idx, 12) * 30}ms` }}>
                            <div className="flex items-center gap-[12px]">
                                {courseImage(course, 'w-[56px] h-[56px]')}
                                <span className="flex-1 min-w-0 text-[0.875rem] font-semibold leading-snug text-[var(--titleColor)] break-words">{course.title}</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-[8px] px-[10px] py-[8px] rounded-[10px] bg-[#f8fafc]">
                                {copyChip(course)}
                                {dateChip(course)}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="overflow-x-auto scrollbar-thin border border-[#eef2f6] rounded-[14px]">
                <table className="w-full min-w-[720px] text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f8fafc] border-b border-[#eef2f6] text-[0.6875rem] uppercase tracking-[0.04em] text-[var(--text-color-secondary)]">
                            <th className="py-[12px] px-[16px] w-[56px] text-center font-semibold">{translations.numberSign}</th>
                            <th className="py-[12px] px-[16px] font-semibold">{translations.title}</th>
                            <th className="py-[12px] px-[16px] font-semibold w-[190px]">{translations.copy}</th>
                            <th className="py-[12px] px-[16px] font-semibold w-[170px]">{translations.archiveDate}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((course, idx) => (
                            <tr key={course.id} className="fade-up border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fbfd] transition-colors" style={{ animationDelay: `${Math.min(idx, 12) * 25}ms` }}>
                                <td className="py-[12px] px-[16px] text-center text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{idx + 1}</td>
                                <td className="py-[12px] px-[16px]">
                                    <div className="flex items-center gap-[12px] min-w-0">
                                        {courseImage(course, 'w-[48px] h-[48px]')}
                                        <span className="text-[0.875rem] font-semibold leading-snug text-[var(--titleColor)] break-words">{course.title}</span>
                                    </div>
                                </td>
                                <td className="py-[12px] px-[16px]">{copyChip(course)}</td>
                                <td className="py-[12px] px-[16px]">{dateChip(course)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-[16px]">
            {/* Заголовок и фильтры */}
            <div className={`${cardClass} p-[14px] sm:p-[18px] flex flex-col gap-[16px]`}>
                <div className="flex items-center gap-[12px]">
                    <span className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-[12px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                        <i className="pi pi-box text-[1.125rem]"></i>
                    </span>
                    <div className="flex flex-col gap-[4px] min-w-0">
                        <div className="flex flex-wrap items-center gap-[10px]">
                            <h3 className="text-[1.25rem] sm:text-[1.375rem] leading-tight font-bold text-[var(--titleColor)] m-0">{translations.archiveCourses}</h3>
                            {!loading && archivedCourses.length > 0 && (
                                <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full bg-[#f1f5f9] text-[0.75rem] font-semibold text-[var(--bodyColor)]">
                                    <i className="pi pi-book text-[0.6875rem]"></i>
                                    {archivedCourses.length}
                                </span>
                            )}
                        </div>
                        <span className="text-[0.8125rem] text-[var(--text-color-secondary)]">{translations.archiveHint}</span>
                    </div>
                </div>

                {/* только чтение */}
                <div className="flex items-start gap-[12px] p-[12px] rounded-[14px] bg-[#fffbeb] border border-[#fde68a]" role="alert">
                    <span className="flex items-center justify-center shrink-0 w-[32px] h-[32px] rounded-[10px] bg-[#fef3c7] text-[#b45309]">
                        <i className="pi pi-lock text-[0.8125rem]"></i>
                    </span>
                    <div className="flex-1 text-[0.8125rem] leading-relaxed text-[#92400e]">
                        <p className="m-0 mb-[2px] font-semibold">{translations.readOnly}</p>
                        <p className="m-0">{translations.archiveReadOnlyNotice}</p>
                    </div>
                </div>

                {!loading && archivedCourses.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center gap-[10px]">
                        <div className="flex items-center relative w-full">
                            <i className="pi pi-search absolute left-[12px] z-[1] text-[0.8125rem] text-[var(--text-color-secondary)] pointer-events-none"></i>
                            <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder={translations.search} className="w-full h-[40px] text-[0.875rem]" style={{ paddingLeft: 36, paddingRight: 36, borderRadius: 10 }} />
                            {search && (
                                <button type="button" aria-label="clear" onClick={() => setSearch('')} className="absolute right-[8px] flex items-center justify-center w-[24px] h-[24px] rounded-full text-[var(--text-color-secondary)] hover:bg-[#f1f5f9] transition-colors">
                                    <i className="pi pi-times text-[0.6875rem]"></i>
                                </button>
                            )}
                        </div>
                        <div className="inline-flex self-start md:self-auto shrink-0 gap-[4px] p-[4px] rounded-[12px] bg-[#f1f5f9] overflow-x-auto max-w-full">
                            {filterButton('all', translations.all, archivedCourses.length)}
                            {filterButton('copy', translations.copyCreated, copyCount)}
                            {filterButton('noCopy', translations.noCopy, archivedCourses.length - copyCount)}
                        </div>
                    </div>
                )}
            </div>

            {/* Список */}
            <div className={`${cardClass} p-[12px] sm:p-[16px]`}>{content()}</div>
        </div>
    );
};

export default ArchivePage;
