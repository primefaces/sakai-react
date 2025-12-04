'use client';

import { useContext, useEffect, useState } from 'react';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useRouter } from 'next/navigation';

export default function VideoInstruct() {
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [videoValues, setVideoValues] = useState([
        { title: 'Видеоинструкция по использованию образовательного портала Mooc', src: 'https://youtu.be/9j9vUpNrgDM?si=nqk6tX5JPCyr7znv' },
        { title: 'Подтверждение курсов на портале дистанционного обучения для заведующих кафедрами', src: 'https://www.youtube.com/watch?v=dkjm2fTIQm0' }
    ]);

    const router = useRouter();

    const handleVideoCall = (value: string | null) => {
        if (!value) {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при обработке видео', detail: '' }
            });
        }

        const url = new URL(typeof value === 'string' ? value : '');
        let videoId = null;

        if (url.hostname === 'youtu.be') {
            // короткая ссылка, видео ID — в пути
            videoId = url.pathname.slice(1); // убираем первый слеш
        } else if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
            // стандартная ссылка, видео ID в параметре v
            videoId = url.searchParams.get('v');
        }

        if (!videoId) {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при обработке видео', detail: '' }
            });
            return ''; // не удалось получить ID
        }
        return `https://www.youtube.com/embed/${videoId}`;
    };

    useEffect(() => {
        // handleVideoCall('https://youtu.be/9j9vUpNrgDM?si=nqk6tX5JPCyr7znv');
    }, []);

    return (
        <div>
            <div className="flex items-start flex-col sm:flex-row gap-1">
                <button onClick={() => router.back()} className="text-[var(--mainColor)] underline px-2 flex items-center gap-1">
                    <i className="pi pi-arrow-left text-[13px] cursor-pointer hover:shadow-2xl" style={{ fontSize: '13px' }}></i>
                    <span className="text-[13px] cursor-pointer">Назад</span>
                </button>
                <h2 className="text-center text-lg sm:text-xl w-full m-0 mb-4 flex justify-center">Видеоуроки по использованию платформы Mooc</h2>
            </div>
            <div className="flex items-start justify-evenly">
                {videoValues?.map((item, idx) => {
                    return (
                        <div key={idx} className="p-2 shadow w-[600px]">
                            <div className="w-full flex flex-col justify-center items-center">
                                <iframe
                                    className="w-full h-[200px] md:h-[400px]"
                                    // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                    src={handleVideoCall(item?.src)}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <p className="text-center mt-4">{item?.title}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
