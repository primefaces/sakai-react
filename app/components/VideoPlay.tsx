'use client';

import { faPlay } from '@fortawesome/free-solid-svg-icons';

import Image from 'next/image';
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
// import 'primereact/resources/themes/lara-light-blue/theme.css'; // или другая тема
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import MyFontAwesome from './MyFontAwesome';

export default function VideoPlay() {
    const [videoCall, setVideoCall] = useState(false);

    return (
        <div className="relative my-4">
            <Dialog
                header={'Аталышы'}
                className="w-[80%] h-[300px] md:h-[500px]"
                visible={videoCall}
                onHide={() => {
                    if (!videoCall) return;
                    setVideoCall(false);
                }}
            >
                <div className="flex justify-center items-center">
                    <iframe
                        className="w-full h-[200px] md:h-[400px]"
                        // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        src="https://www.youtube.com/embed/x9YiXbSQFMA"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </Dialog>
            <div className="relative bg-white shadow w-[70%] h-[300px] md:h-[500px] m-auto flex justify-center items-center">
                <div className="w-full h-[100%] absolute flex justify-center items-center bg-[rgba(8,9,0,50%)]">
                    <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex items-center justify-center" onClick={() => setVideoCall(true)}>
                        {/* Волна */}
                        <span className="absolute w-full h-full rounded-full border-4 border-blue-500 animate-ping"></span>

                        {/* Иконка-кнопка */}
                        <div className="relative z-10  w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full bg-white text-[var(--mainColor)] flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
                            <MyFontAwesome icon={faPlay} />
                        </div>
                    </div>
                </div>
                <img src={'/layout/images/logo-remove.png'} width={400} height={400} className="w-[200px] sm:w-[400px]" alt="Логотип ОшГУ" />
            </div>
        </div>
    );
}
