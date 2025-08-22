'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function InfoBanner({ title, titleSize }: { title: string; titleSize: { default: string; sm: string } }) {
    const media = useMediaQuery('(max-width: 640px)');

    return (
        <div className="bg-[var(--titleColor)] flex flex-col justify-center items-center w-full text-white p-[30px] md:p-[40px]">
            <h1 style={{ color: 'white', fontSize: media ? titleSize.default : titleSize.sm, textAlign: 'center'}}>{title}</h1>
        </div>
    );
}
