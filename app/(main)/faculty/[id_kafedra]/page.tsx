'use client';

import FacultyHeader, { FacultyEmpty, facultyCardClass } from '@/app/components/faculty/FacultyHeader';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchDepartament } from '@/services/faculty';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useLocalization } from '@/layout/context/localizationcontext';

interface TeacherType {
    id: number;
    name: string;
    last_name: string;
    father_name: string;
    myedu_id: number;
    courses: number;
    courses_published: number;
}

export default function Kafedra() {
    const { id_kafedra } = useParams();
    const { translations } = useLocalization();

    const [teachers, setTeachers] = useState<TeacherType[]>([]);
    const [contentShow, setContentShow] = useState<boolean>(false);
    const [skeleton, setSkeleton] = useState(true);
    const [contentNull, setContentNull] = useState<boolean>(false);
    const [search, setSearch] = useState('');

    const { setMessage, setGlobalLoading } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const handleFetchKafedra = async () => {
        setSkeleton(true);
        const data = await fetchDepartament(Number(id_kafedra));
        if (data && Array.isArray(data)) {
            setSkeleton(false);
            if (data.length > 0) {
                setTeachers(data);
                setContentShow(false);
                setContentNull(false);
            } else {
                setContentNull(true);
            }
        } else {
            setSkeleton(false);
            setContentShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    useEffect(() => {
        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 900);
        handleFetchKafedra();
    }, []);

    const fullName = (t: TeacherType) => `${t.last_name ?? ''} ${t.name ?? ''} ${t.father_name ?? ''}`.trim();
    const query = search.trim().toLowerCase();
    const filtered = query ? teachers.filter((t) => fullName(t).toLowerCase().includes(query) || String(t.myedu_id ?? '').includes(query)) : teachers;

    const avatar = (t: TeacherType) => (
        <span className="flex items-center justify-center shrink-0 w-[38px] h-[38px] rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[0.8125rem] font-bold uppercase">
            {`${t.last_name?.[0] ?? ''}${t.name?.[0] ?? ''}` || <i className="pi pi-user text-[0.8125rem]"></i>}
        </span>
    );

    // прогресс утверждённых курсов
    const approvedBar = (t: TeacherType) => {
        const total = Number(t.courses) || 0;
        const published = Number(t.courses_published) || 0;
        const percent = total > 0 ? Math.round((published / total) * 100) : 0;
        const full = total > 0 && published >= total;

        return (
            <div className="flex flex-col gap-[6px] w-full min-w-[160px]">
                <div className="flex items-center justify-between gap-[8px] text-[0.75rem]">
                    <span className="text-[var(--text-color-secondary)]">
                        {translations.approved}: <b className="text-[var(--titleColor)]">{published}</b> / {total}
                    </span>
                    <span className={`font-semibold ${full ? 'text-[#16a34a]' : 'text-[var(--mainColor)]'}`}>{percent}%</span>
                </div>
                <div className="h-[6px] w-full rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div className={`h-full rounded-full transition-[width] duration-500 ${full ? 'bg-[#22c55e]' : 'bg-[var(--mainColor)]'}`} style={{ width: `${percent}%` }}></div>
                </div>
            </div>
        );
    };

    const coursesChip = (t: TeacherType) => (
        <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#f1f5f9] text-[0.75rem] font-semibold text-[var(--bodyColor)] whitespace-nowrap">
            <i className="pi pi-book text-[0.6875rem]"></i>
            {t.courses ?? 0}
        </span>
    );

    const content = () => {
        if (skeleton) return <GroupSkeleton count={6} size={{ width: '100%', height: '4rem' }} />;
        if (contentShow) return <FacultyEmpty icon="pi pi-exclamation-circle" text={translations.dataNotAvailable} />;
        if (contentNull) return <FacultyEmpty icon="pi pi-users" text={translations.noData} />;
        if (filtered.length === 0) return <FacultyEmpty icon="pi pi-search" text={translations.nothingFound} />;

        return (
            <>
                {/* mobile */}
                <div className="flex flex-col gap-[10px] md:hidden">
                    {filtered.map((t, idx) => (
                        <Link key={t.id} href={`/faculty/${id_kafedra}/${t.id}`} className={`${facultyCardClass} fade-up flex flex-col gap-[12px] p-[14px] active:scale-[0.99] transition-transform`} style={{ animationDelay: `${Math.min(idx, 12) * 30}ms` }}>
                            <div className="flex items-center gap-[10px]">
                                {avatar(t)}
                                <span className="flex-1 min-w-0 text-[0.875rem] font-semibold leading-snug text-[var(--titleColor)] break-words">{fullName(t)}</span>
                                {coursesChip(t)}
                            </div>
                            {approvedBar(t)}
                        </Link>
                    ))}
                </div>

                {/* desktop */}
                <div className={`${facultyCardClass} hidden md:block p-[16px]`}>
                    <div className="overflow-x-auto scrollbar-thin border border-[#eef2f6] rounded-[14px]">
                        <table className="w-full min-w-[720px] text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f8fafc] border-b border-[#eef2f6] text-[0.6875rem] uppercase tracking-[0.04em] text-[var(--text-color-secondary)]">
                                    <th className="py-[12px] px-[16px] w-[48px] text-center font-semibold">#</th>
                                    <th className="py-[12px] px-[16px] font-semibold">{translations.teachers}</th>
                                    <th className="py-[12px] px-[16px] font-semibold text-center w-[120px]">{translations.courses}</th>
                                    <th className="py-[12px] px-[16px] font-semibold w-[260px]">{translations.approved}</th>
                                    <th className="py-[12px] px-[20px] w-[60px]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((t, idx) => (
                                    <tr key={t.id} className="group fade-up border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fbfd] transition-colors" style={{ animationDelay: `${Math.min(idx, 12) * 25}ms` }}>
                                        <td className="py-[14px] px-[16px] text-center text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{idx + 1}</td>
                                        <td className="py-[14px] px-[16px]">
                                            <Link href={`/faculty/${id_kafedra}/${t.id}`} className="flex items-center gap-[10px] min-w-0">
                                                {avatar(t)}
                                                <span className="text-[0.875rem] font-semibold leading-snug text-[var(--titleColor)] group-hover:text-[var(--mainColor)] transition-colors break-words">{fullName(t)}</span>
                                            </Link>
                                        </td>
                                        <td className="py-[14px] px-[16px] text-center">{coursesChip(t)}</td>
                                        <td className="py-[14px] px-[16px]">{approvedBar(t)}</td>
                                        <td className="py-[14px] px-[20px] text-right">
                                            <Link
                                                href={`/faculty/${id_kafedra}/${t.id}`}
                                                aria-label={translations.courses}
                                                className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] hover:bg-[var(--mainColor)] hover:text-white transition-colors duration-200"
                                            >
                                                <i className="pi pi-arrow-right text-[0.6875rem]"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="flex flex-col gap-[16px]">
            <FacultyHeader icon="pi pi-users" title={translations.teachers} subtitle={translations.teachersHint} count={teachers.length} backHref="/faculty" search={search} onSearch={!skeleton && teachers.length > 0 ? setSearch : undefined} />
            {content()}
        </div>
    );
}
