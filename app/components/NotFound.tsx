'use client';

import React from 'react';
import Link from 'next/link';
import FancyLinkBtn from '@/app/components/buttons/FancyLinkBtn';

export const NotFound = ({ titleMessage }: { titleMessage: string }) => {
    return (
        <div>
            <div className="flex flex-col gap-2 justify-center items-center m-4">
                <p className="text-[16px] text-center font-bold">{titleMessage}</p>
                <Link href={'/'}>
                    {/* <FancyLinkBtn btnWidth={'240px'} backround={'--mainColor'} effectBg={'--titleColor'} title={''} /> */}
                    Башкы баракчага кайтуу
                </Link>
            </div>
        </div>
    );
};
