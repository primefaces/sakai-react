/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Image from 'next/image';
import { faChalkboard, faPhone,} from "@fortawesome/free-solid-svg-icons";
import MyFontAwesome from '@/app/components/MyFontAwesome';
import Link from 'next/link';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    
    // dark mode
    // <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" />

    return (
       <footer className="left-0 bg-[var(--redColor)] text-white">
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 border-b-1 border-white p-[30px] md:p-10">
            <div>
                <Image src={'/layout/images/logo-remove-white.png'} width={70} height={80} alt="Логотип"/>
                <div className="flex flex-col text-[14px] sm:text-[16px]">
                    <span>Кыргызстан, 723500, г. Ош, ул. Ленина, 331, ОшГУ Главный корпус</span>
                    <span>Общий отдел: +996 3222 7-07-12,</span>
                    <span>факс +996 3222 7-09-15,</span>
                    <span>edu@oshsu.kg</span>
                </div>
            </div>
            <div className="flex flex-col items-start gap-4 w-[200px]">
                <div className="flex items-center gap-2">
                    <MyFontAwesome icon={faChalkboard} className="text-white text-[18px] sm:text-2xl"/>
                    <h4 style={{color:'white'}} className="text-[18px] sm:text-[22px]">Курстар</h4>
                </div>
                <div className="flex flex-col justify-center items-center gap-2 text-[14px] sm:text-[16px]">
                    <Link href={'#'}>lorem ipsum</Link>
                    <Link href={'#'}>lorem ipsum</Link>
                    <Link href={'#'}>lorem ipsum</Link>
                </div>
            </div>
            <div className="flex flex-col items-start gap-4 w-[200px]">
                <div className="flex items-center gap-2">
                    <MyFontAwesome icon={faPhone} className="text-white text-[18px] sm:text-2xl"/>
                    <h4 style={{color:'white'}} className="text-[18px] sm:text-[22px]">Байланыш</h4>
                </div>
                <div className="flex flex-col justify-center items-center gap-2 text-[14px] sm:text-[16px]">
                    <Link href={'#'}>lorem ipsum</Link>
                    <Link href={'#'}>lorem ipsum</Link>
                    <Link href={'#'}>lorem ipsum</Link>
                </div>
            </div>
        </div>
        <p 
            style={{color:'white'}} 
            className="p-1 sm:p-5 text-[12px] sm:text=[14px] sm:w-[400px] m-auto text-center "
        >
            © 2025 ОшГУ | 2025 OshSU - IT Academy Ошский Государственный Университет oshsu.kg
        </p>
    </footer>
    );
};

export default AppFooter;
