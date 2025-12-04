'use client';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useContext, useEffect, useState } from 'react';
import CounterBanner from './CounterBanner';
import Link from 'next/link';
import VideoPlay from './VideoPlay';
import FancyLinkBtn from './buttons/FancyLinkBtn';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MainPageStatistics } from '@/types/main/MainPageStatistic';
import { mainPageStatistics } from '@/services/main/main';

export default function HomeClient() {
    const { user, setGlobalLoading } = useContext(LayoutContext);
    const [statistics, setStatistics] = useState<MainPageStatistics | null>(null);

    const media = useMediaQuery('(max-width: 640px)');

    const handleMainPageStatistics = async ()=> {
        const data = await mainPageStatistics();
        console.log(data);
        if(data && data?.students || data?.workers || data?.course ){
            setStatistics(data);
        } else {

        }
    }

    useEffect(() => {
        setGlobalLoading(true);
        handleMainPageStatistics();
        setTimeout(() => {
            setGlobalLoading(false);
        }, 800);
        AOS.init();
    }, []);

    return (
        <>
            {/* <div className='relative  h-[100px] overflow-hidden'><div className='home-bg'></div></div> */}
            <div className='absolute left-0 right-0 top-[96px] w-full home-bg min-h-[500px] max-h-[500px]'></div>
            <div className="relative mt-[98px] px-2 py-[50px] z-[1]">
                {/* <Link href={`/pdf/1757146212.pdf`}>{"Уроки"}</Link> */}
                <div className="w-full">
                    <div className="flex flex-column md:flex-row items-center justify-center overflow-hidden">
                        <div className="w-full">
                            <div
                                className="w-full m-auto overflow-hidden text-[16px] text-[var(--mainColor)] block mb-[15px]"
                            >
                                <div className="relative flex">
                                    <img
                                        src={'/layout/images/shape1.png'}
                                        data-aos="fade-up"
                                        data-aos-delay="900"
                                        data-aos-duration="1000"
                                        data-aos-once="true"
                                        alt="Фото"
                                        className="hidden lg:block absolute top-[-100px] left-[-10px] animateContent"
                                    />
                                    <span className="w-full text-center" data-aos="fade-up" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true">
                                        УДОБНОЕ ОНЛАЙН-ПРОСТРАНСТВО ДЛЯ ОБУЧЕНИЯ
                                    </span>
                                </div>
                                <h2 data-aos="fade-down" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true" className="text-center text-[30px] sm:text-[50px]">
                                    Добро пожаловать на портал дистанционного обучения!
                                </h2>
                                <div data-aos="fade-up" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true" className="text-center text-[var(--titleColor)]">
                                    {' '}
                                    Мы объединяем проекты университета в сфере онлайн-образования:
                                    <ul className="list-disc m-auto my-4 max-w-[300px] flex flex-col items-start">
                                        <li>открытые онлайн-курсы</li>
                                        <li>программы высшего образования</li>
                                    </ul>
                                    {user ? (
                                        <Link href={user.is_working ? '/course' : user.is_student ? '/teaching' : ''}>
                                            <FancyLinkBtn btnWidth={'200px'} backround={'--mainColor'} effectBg={'--titleColor'} title={user.is_working ? 'Преподаватель' : user.is_student ? 'Студент' : ''} />
                                        </Link>
                                    ) : media ? <Link href={'/auth/login'}>
                                            <FancyLinkBtn btnWidth={'200px'} backround={'--mainColor'} effectBg={'--titleColor'} title={'Вход'} />
                                        </Link> : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Counter Statistics */}
                <CounterBanner statisticValue={statistics}/>

                {/* Oshgu Video */}
                <div>
                    <h2 className="text-[22px] p-4 text-center">
                        Видеоэкскурсия по главному зданию <span className="text-[var(--mainColor)]">ОшГУ</span>
                    </h2>
                </div>
                <VideoPlay />
            </div>
        </>
    );
}
