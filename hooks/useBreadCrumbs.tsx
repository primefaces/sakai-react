'use client';

import { breadCrumbType } from '@/types/breadCrumbType';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function useBreadCrumbs(insideBreadCrumb: breadCrumbType[], currentUrl: string) {
    const pathname = usePathname();

    const [breadCrumb, setBreadCrumb] = useState<breadCrumbType[]>([]);

    const matchUrl = (pattern: string, url: string) => {
        // Заменяем все ":что-то" на "([^/]+)" (регулярка: один сегмент)
        const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$');
        return regex.test(url);
    };

    const getBreadcrumbs = (data: breadCrumbType[], currentUrl: string) => {
        
        // 1. Находим текущую страницу по URL (с учётом динамики)
        const currentPage = data.find((item) => matchUrl(item.url, currentUrl));
        if (!currentPage) return [];

        const breadcrumbs = [];
        let currentItem: breadCrumbType = currentPage;
        const visited = new Set();

        while (currentItem) {
            if (visited.has(currentItem.id)) {
                // Зацикленность → выходим
                console.warn('Цикл в дереве хлебных крошек!');
                break;
            }
            visited.add(currentItem.id);

            breadcrumbs.unshift(currentItem);
            const parent = data.find((item) => item.id === currentItem.parent_id);
            if (parent) currentItem = parent;
            else break;
        }

        return breadcrumbs;
    };

    useEffect(() => {
        console.log(insideBreadCrumb, currentUrl);
        
        const forBreadcrumb = getBreadcrumbs(insideBreadCrumb, currentUrl);
        setBreadCrumb(forBreadcrumb);
    }, [pathname]);

    return (
        <div className="flex w-full sm:justify-center items-center flex-wrap">
            {breadCrumb?.map((crumb: breadCrumbType, index) => (
                <div key={crumb.id} className="flex items-center">
                    <div className="text-[12px] sm:text-sm">
                        {index < breadCrumb.length - 1 ? (
                            <Link className={`text-white mainColor-hover ${crumb.icon && 'pi pi-home text-white'}`} href={crumb.url}>
                                {crumb.title}
                            </Link>
                        ) : (
                            <span className={`text-[var(--mainColor)]`}>{crumb.title}</span>
                        )}
                    </div>
                    {index < breadCrumb.length - 1 && <span className="text-white px-1 sm:text-2xl"> / </span>}
                </div>
            ))}
        </div>
    );
}
