'use client';

import React from 'react';
import Link from 'next/link';
import { useLocalization } from '@/layout/context/localizationcontext';

export const NotFound = ({ titleMessage }: { titleMessage: string }) => {
    const { translations } = useLocalization();
    return (
        <div>
            <div className="flex flex-col gap-2 justify-center items-center m-4">
                <p className="text-[1rem] text-center font-bold">{titleMessage}</p>
                <Link href={'/'} className="block sm:hidden text-center text-[0.75rem] sm:text-[0.9rem]">
                    {translations?.backHome}
                </Link>
            </div>
        </div>
    );
};
