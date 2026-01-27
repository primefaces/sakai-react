/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import axiosInstance from '@/utils/axiosInstance';

const AppFooter = () => {
    const [univer, setUniver] = useState<{ address_ru: string; contact_ru: string, info_ru: string, info_en: string }>({ address_ru: '', contact_ru: '', info_ru: '', info_en:'' });
    // dark mode
    // <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" />

    const fetchInfo = async () => {
        try {
            const res = await axiosInstance.get('https://api.myedu.oshsu.kg/public/api/open/universities');
            const data = res.data;
            return data;
        } catch (err) {
            console.log('Ошибка при получении данных', err);
        }
    };

    useEffect(() => {
        const handleInfo = async ()=> {
            const data = await fetchInfo();
            if(data){
                setUniver({
                    address_ru: data[1]?.address_ru,
                    contact_ru: data[1]?.contact_ru,
                    info_ru: data[1]?.info_ru,
                    info_en: data[1]?.info_en,
                });
            }
        }
        handleInfo();
    }, []);

    return (
        <footer className="text-white">
            <div className="w-full absolute left-0 bg-[#A00e07]">
                <div className="flex flex-col md:flex-row gap-2 md:gap-8 border-b-1 border-white p-[30px] md:px-14 md:py-10">
                    <div>
                        <img src={'/layout/images/logo-remove-white.png'} width={70} height={80} alt="Логотип" />
                        <div className="flex flex-col text-[14px] sm:text-[16px]">
                            <span>{univer.address_ru}</span>
                            <span>{univer.contact_ru}</span>
                        </div>
                    </div>
                </div>
                <p style={{ color: 'white' }} className="flex flex-col p-1 sm:p-5 text-[12px] sm:text=[14px] sm:w-[400px] m-auto text-center ">
                    <span>©{univer.info_ru} | {univer.info_en} IT Academy</span>
                    <span>Ошский Государственный Университет oshsu.kg</span>
                </p>
            </div>
        </footer>
    );
};

export default AppFooter;
