'use client';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';

export default function PDFreader({ url }: { url: string }) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const { setMessage } = useContext(LayoutContext);
    const [forUrl, setForUrl] = useState('');

    useEffect(() => {
        // let newUrl = `https://api.mooc.oshsu.kg/public/temprory-file/${url}`;
        const inApiString = process.env.NEXT_PUBLIC_BASE_URL;
        let newUrl = `${inApiString?.substring(0, inApiString?.length - 4)}/temprory-file/${url}`;
        console.log(newUrl);
        
        if (newUrl) {
            setForUrl(newUrl);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка загрузки или отображения документа' }
            });
        }
    }, [url]);

    const loadSection = (error: any | null) => <div className='main-bg text-center'>Не удалось загрузить PDF: <span className='text-sm text-[red] '>{error?.message || ''}</span></div>

    if(!forUrl) return loadSection(null);

    return (
        <div style={{ height: '100vh' }}>
            <Worker workerUrl="/pdf.worker.js">
                <Viewer fileUrl={forUrl} plugins={[defaultLayoutPluginInstance]} renderError={(error) => loadSection(error)} />
            </Worker>
        </div>
    );
}
