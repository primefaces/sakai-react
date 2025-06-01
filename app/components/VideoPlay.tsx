'use client';

import { faPlay} from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import { useState } from "react";
import { Dialog } from 'primereact/dialog';
// import 'primereact/resources/themes/lara-light-blue/theme.css'; // или другая тема
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import MyFontAwesome from "./MyFontAwesome";

export default function VideoPlay() {
    const [videoCall, setVideoCall] = useState(false);

    return (
        <div className="relative">
            <Dialog header={''} className="w-[80%] h-[300px] sm:h-[500px]" visible={videoCall} onHide={() => {if (!videoCall) return; setVideoCall(false); }}>
                <div className="flex justify-center items-center">
                    <iframe
                        width="100%"
                        height="200px"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="encrypted-media"
                        allowFullScreen
                    ></iframe>
                </div>
            </Dialog>
            <div className="relative bg-white shadow w-[70%] h-[200px] sm:h-[500px] m-auto flex justify-center items-center">
                <div className="w-full h-[100%] absolute flex justify-center items-center bg-[rgba(8,9,0,50%)]">
                    <div 
                        className="relative w-20 h-20 flex items-center justify-center"
                        onClick={() => setVideoCall(true)}
                    >
                        {/* Волна */}
                        <span className="absolute w-full h-full rounded-full border-4 border-blue-500 animate-ping"></span>

                        {/* Иконка-кнопка */}
                        <div className="relative z-10 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white text-[var(--mainColor)] flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
                            <MyFontAwesome icon={faPlay}/>
                        </div>
                    </div>
                </div>
                <Image src={'/img/logo-remove.png'} width={400} height={400} className="w-[200px] sm:w-[400px]" alt="Логотип ОшГУ"/>
            </div>
        </div>
    )
}
