'use client';

import FacultyHeader, { FacultyEmpty, facultyCardClass } from '@/app/components/faculty/FacultyHeader';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchKafedra } from '@/services/faculty';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useLocalization } from '@/layout/context/localizationcontext';

interface KafedraType {
    id: number | null;
    name_ru: string;
    id_faculty?: number | null;
}

export default function Faculty() {
    const showError = useErrorMessage();
    const { setMessage, setGlobalLoading } = useContext(LayoutContext);
    const { translations } = useLocalization();

    const [kafedra, setKafedra] = useState<KafedraType[]>([]);
    const [facultyShow, setFacultyShow] = useState<boolean>(false);
    const [skeleton, setSkeleton] = useState(true);
    const [contentNull, setContentNull] = useState<boolean>(false);
    const [search, setSearch] = useState('');

    const handleFetchKafedra = async () => {
        setSkeleton(true);
        const data = await fetchKafedra();
        if (data && Array.isArray(data)) {
            setSkeleton(false);
            if (data.length > 0) {
                setKafedra(data);
                setFacultyShow(false);
                setContentNull(false);
            } else {
                setContentNull(true);
            }
        } else {
            setSkeleton(false);
            setFacultyShow(true);
            setMessage({ state: true, value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater } });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    useEffect(() => {
        handleFetchKafedra();

        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 900);
    }, []);

    const query = search.trim().toLowerCase();
    const filtered = query ? kafedra.filter((item) => item.name_ru?.toLowerCase().includes(query)) : kafedra;

    const content = () => {
        if (skeleton) return <GroupSkeleton count={6} size={{ width: '100%', height: '4rem' }} />;
        if (facultyShow) return <FacultyEmpty icon="pi pi-exclamation-circle" text={translations.kafedrasNotAvailable} />;
        if (contentNull) return <FacultyEmpty icon="pi pi-building" text={translations.noData} />;
        if (filtered.length === 0) return <FacultyEmpty icon="pi pi-search" text={translations.nothingFound} />;

        return (
            <div className="[display:grid] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[10px]">
                {filtered.map((item, idx) => (
                    <Link
                        key={item.id ?? idx}
                        href={`/faculty/${item.id}`}
                        className={`${facultyCardClass} fade-up group flex items-center gap-[12px] p-[14px] hover:border-[var(--mainBorder)] hover:shadow-[0_8px_20px_-12px_rgba(8,169,230,0.6)] hover:-translate-y-[1px] transition-all duration-200`}
                        style={{ animationDelay: `${Math.min(idx, 12) * 30}ms` }}
                    >
                        <span className="flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[12px] bg-[#f1f5f9] text-[0.8125rem] font-bold text-[var(--bodyColor)] group-hover:bg-[var(--mainColor)] group-hover:text-white transition-colors duration-200">
                            {idx + 1}
                        </span>
                        <span className="flex-1 min-w-0 text-[0.875rem] font-semibold leading-snug text-[var(--titleColor)] break-words group-hover:text-[var(--mainColor)] transition-colors">{item.name_ru}</span>
                        <i className="pi pi-arrow-right shrink-0 text-[0.75rem] text-[var(--text-color-secondary)] group-hover:text-[var(--mainColor)] group-hover:translate-x-[3px] transition-all duration-200"></i>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-[16px]">
            <FacultyHeader icon="pi pi-building" title={translations.kafedras} subtitle={translations.kafedrasHint} count={kafedra.length} search={search} onSearch={!skeleton && kafedra.length > 0 ? setSearch : undefined} />
            {content()}
        </div>
    );
}
