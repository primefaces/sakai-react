'use client';

import PDFViewer from '@/app/components/PDFBook';
import { useParams } from 'next/navigation';

export default function PdfUrlViewer() {
    const { pdfUrl } = useParams();

    return <div>
        <PDFViewer url={pdfUrl || ''} />
    </div>;
}
