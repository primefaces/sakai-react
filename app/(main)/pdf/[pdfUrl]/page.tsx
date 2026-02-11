'use client';
import dynamic from 'next/dynamic';

const PDFreader = dynamic(() => import('@/app/components/pdfComponents/PDFreader'), { ssr: false });

import { useParams, useRouter } from 'next/navigation';

export default function PdfUrlViewer() {
    const { pdfUrl } = useParams();
    const router = useRouter();

    return (
        <div className="my-2">
            <div className="max-w-[90%] m-auto mb-3">
                <button onClick={() => router.back()} className="text-[var(--mainColor)] underline px-2 mb-2 flex items-center gap-1">
                    <i className="pi pi-arrow-left text-[13px] cursor-pointer hover:shadow-2xl" style={{ fontSize: '13px' }}></i>
                    <span className="text-[13px] cursor-pointer">Назад</span>
                </button>
                <div className='w-[85%] m-auto'><PDFreader url={pdfUrl && String(pdfUrl) || ''} /></div>
            </div>
        </div>
    );
}
