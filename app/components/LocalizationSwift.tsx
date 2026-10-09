'use client';

import { useLocalization } from '@/layout/context/localizationcontext';

export default function LocalizationSwift(  ) {
    const { language, setLanguage } = useLocalization();

    return <div className={'cursor-pointer flex justify-center items-center gap-2 rounded-2xl p-2 shadow hover:shadow-md transition'} onClick={() => setLanguage(language === 'ru' ? 'ky' : 'ru')}>
            <i className={'pi pi-globe text-[var(--mainColor)]'} style={{fontSize: '14px'}}></i>
        <span className={'text-[13px] text-[var(--mainColor)]'}>{language.toUpperCase()}</span>
    </div>
}
