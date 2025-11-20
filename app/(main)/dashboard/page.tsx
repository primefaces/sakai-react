'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { ContributionDay } from '@/types/ContributionDay';
import ActivityPage from '@/app/components/Contribution';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

export default function Dashboard() {
    const { user, departament, setMessage } = useContext(LayoutContext);

    const [videoLink, setVideoLink] = useState('');
    const [contribution, setContribution] = useState<ContributionDay[] | null>([{date: 'xxx', count: 3}]);

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
            return null; // не удалось получить ID
        }
        // return `https://www.youtube.com/embed/${videoId}`;
        setVideoLink(`https://www.youtube.com/embed/${videoId}`);
        // setVideoCall(true);
        // setVisisble(true);
    };

    useEffect(() => {
        window.location.href = '/';
        // handleVideoCall('https://youtu.be/9j9vUpNrgDM?si=nqk6tX5JPCyr7znv');
    }, []);

    return null;

    // return (
    //     <div className="flex flex-col gap-2">
    //         {/* user info */}
    //         <div className="main-bg">
    //             <h1 className="text-lg sm:text-xl m-0">{user?.last_name} {user?.name && user.name[0] + '.'} {user?.father_name && user.father_name[0] + '.'}</h1>
    //             <small>Преподаватель {user?.is_working && departament?.name && '• Зав. кафедрой'}</small>
    //         </div>

    //         <div className="flex items-start gap-2 justify-around lg:justify-between flex-wrap mb-2">
    //             <div className="main-bg flex flex-col gap-2 w-full md:!w-[250px] px-4 min-h-[132px]">
    //                 <div className="flex justify-between gap-1 items-center">
    //                     <b>Кол-о курсов</b>
    //                     <i className="pi pi-fw pi-book text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
    //                 </div>
    //                 <div className="text-lg mb-1">30</div>
    //                 <small>
    //                     <b className="text-[var(--greenColor)]">4</b> созданы за последние 30 дней
    //                 </small>
    //             </div>
    //             <div className="main-bg flex flex-col gap-2 w-full md:!w-[250px] px-4 min-h-[132px]">
    //                 <div className="flex justify-between gap-1 items-center">
    //                     <b>Кол-о курсов</b>
    //                     <i className="pi pi-fw pi-book text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
    //                 </div>
    //                 <div className="text-lg mb-1">30</div>
    //                 <small>
    //                     <b className="text-[var(--greenColor)]">4</b> созданы за последние 30 дней
    //                 </small>
    //             </div>
    //             <div className="main-bg flex flex-col gap-2 w-full md:!w-[250px] px-4 min-h-[132px]">
    //                 <div className="flex justify-between gap-1 items-center">
    //                     <b>Кол-о курсов</b>
    //                     <i className="pi pi-fw pi-book text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
    //                 </div>
    //                 <div className="text-lg mb-1">30</div>
    //                 <small>
    //                     <b className="text-[var(--greenColor)]">4</b> созданы за последние 30 дней
    //                 </small>
    //             </div>
    //             <div className="main-bg flex flex-col gap-2 w-full md:!w-[250px] px-4 min-h-[132px]">
    //                 <div className="flex justify-between gap-1 items-center">
    //                     <b>Уведомления</b>
    //                     <i className="pi pi-fw pi-bell text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
    //                 </div>
    //                 <div className="text-lg">30 сообщений</div>
    //                 <Link href="#">
    //                     <small className="flex items-center gap-1 underline">
    //                         перейти <i className="pi pi-arrow-right text-sm"></i>
    //                     </small>
    //                 </Link>
    //             </div>
    //         </div>

    //         <div className='flex flex-col gap-4 items-center'>
    //             {/* video instruct */}
    //             <div className="w-full flex flex-col justify-center items-center main-bg p-2 bg-white shadow">
    //                 <iframe
    //                     className="w-full h-[200px] md:h-[400px]"
    //                     // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
    //                     src={videoLink}
    //                     title="YouTube video player"
    //                     frameBorder="0"
    //                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //                     allowFullScreen
    //                 ></iframe>
    //             </div>
                
    //             {/* activity */}
    //             <div className='w-full main-bg p-2'>
    //                 <ActivityPage value={contribution} recipient='Активность преподавателя' />
    //             </div>
    //         </div>
    //     </div>
    // );
}
