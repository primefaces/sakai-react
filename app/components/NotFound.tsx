'use client';

import React from 'react';
import Link from 'next/link';
import { useLocalization } from '@/layout/context/localizationcontext';

export const NotFound = ({ titleMessage }: { titleMessage: string }) => {
    const { translations } = useLocalization();
    return (
        <div>
            <div className="flex flex-col gap-2 justify-center items-center m-4">
                <p className="text-[16px] text-center font-bold">{titleMessage}</p>
                <Link href={'/'} className="text-center text-[12px] sm:text-[14px]">
                    {translations?.backHome}
                </Link>
            </div>
        </div>
    );
};
