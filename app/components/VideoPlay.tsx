'use client';

import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
// import 'primereact/resources/themes/lara-light-blue/theme.css'; // или другая тема
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import MyFontAwesome from './MyFontAwesome';

export default function VideoPlay() {
    const [videoCall, setVideoCall] = useState(false);

    return (
        <div className="relative w-full">
            <Dialog
                header={''}
                className="w-[92%] md:w-[80%] max-w-[1100px]"
                contentClassName="!p-0 sm:!p-3"
                visible={videoCall}
                dismissableMask
                onHide={() => {
                    if (!videoCall) return;
                    setVideoCall(false);
                }}
            >
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                    {videoCall && (
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/x9YiXbSQFMA?autoplay=1"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
            </Dialog>

            <div
                onClick={() => setVideoCall(true)}
                className="group relative w-full md:w-[85%] lg:w-[75%] aspect-video max-h-[560px] m-auto rounded-3xl overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(33,34,95,0.25)] bg-gradient-to-br from-[var(--titleColor)] via-[#1d2b78] to-[#0b6fa0]"
            >
                {/* decor */}
                <div className="absolute -top-16 -left-16 w-[260px] h-[260px] rounded-full bg-[var(--mainColor)]/30 blur-3xl"></div>
                <div className="absolute -bottom-20 -right-10 w-[260px] h-[260px] rounded-full bg-white/10 blur-3xl"></div>

                <img
                    src={'/layout/images/logo-remove-white.png'}
                    width={400}
                    height={400}
                    className="absolute inset-0 m-auto w-[45%] max-w-[380px] opacity-15 transition-transform duration-700 group-hover:scale-105"
                    alt="Логотип ОшГУ"
                />

                <div className="absolute inset-0 flex flex-col justify-center items-center gap-4">
                    <div className="relative w-[80px] h-[80px] md:w-[110px] md:h-[110px] flex items-center justify-center">
                        {/* Волна */}
                        <span className="absolute w-full h-full rounded-full bg-white/25 animate-ping"></span>
                        <span className="absolute w-[80%] h-[80%] rounded-full bg-white/20"></span>

                        {/* Иконка-кнопка */}
                        <div className="relative z-10 w-[56px] h-[56px] md:w-[76px] md:h-[76px] rounded-full bg-white text-[var(--mainColor)] text-[18px] md:text-[24px] flex items-center justify-center pl-1 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                            <MyFontAwesome icon={faPlay} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
