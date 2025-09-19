'use client';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useContext, useEffect } from 'react';
import CounterBanner from './CounterBanner';
import Link from 'next/link';
import VideoPlay from './VideoPlay';
import FancyLinkBtn from './buttons/FancyLinkBtn';
import { LayoutContext } from '@/layout/context/layoutcontext';

export default function HomeClient() {
    const { user, setGlobalLoading } = useContext(LayoutContext);

    useEffect(() => {
        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 800);
        AOS.init();
    }, []);

    return (
        <div className="relative mt-[98px] px-2 py-[50px] z-[1]">
            {/* <Link href={`/pdf/1757146212.pdf`}>{"Уроки"}</Link> */}
            <div className="w-full">
                <div className="flex flex-column md:flex-row items-center justify-between">
                    <div className="lg:w-1/2">
                        <div className="text-[16px] text-[var(--mainColor)] block mb-[15px]">
                            <div className="relative">
                                <img src={'/layout/images/shape1.png'} data-aos="fade-up" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true" alt="Фото" className="hidden lg:block absolute top-[-100px] left-[-10px] animateContent" />
                                <span data-aos="fade-up" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true">
                                    УДОБНОЕ ОНЛАЙН-ПРОСТРАНСТВО ДЛЯ ОБУЧЕНИЯ
                                </span>
                            </div>
                            <h2 data-aos="fade-down" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true" className="text-[30px] sm:text-[50px]">
                                Добро пожаловать на портал дистанционного обучения!
                            </h2>
                            <div data-aos="fade-up" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true" className="text-[var(--bodyColor)]">
                                {' '}
                                Мы объединяем проекты университета в сфере онлайн-образования:
                                <ul className="m-4 list-disc">
                                    <li>открытые онлайн-курсы</li>
                                    <li>программы высшего образования</li>
                                </ul>
                                {user && (
                                    <Link href={user.is_working ? '/course' : user.is_student ? '/teaching' : ''}>
                                        <FancyLinkBtn btnWidth={'200px'} backround={'--mainColor'} effectBg={'--titleColor'} title={user.is_working ? 'Преподаватель' : user.is_student ? 'Студент' : ''} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="banner-img" data-speed="0.05" data-revert="true">
                            <div className="relative text-[14px]">
                                <img src="/layout/images/home-two.png" data-aos="fade-up" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true" alt="Пользователь" className="w-full z-10" />

                                <div className="hidden sm:block absolute top-0 left-[-200px] animateContent" data-aos="fade-down" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true">
                                    <img src="/layout/images/shape.png" className="z-[-10]" alt="Shape" />
                                </div>

                                <div className="hidden sm:block absolute top-0 right-0 animateContent" data-aos="fade-up" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true">
                                    <img src="/layout/images/shape2.png" alt="Shape" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Counter Statistics */}
            <CounterBanner />

            {/* Oshgu Video */}
            <div>
                <h2 className="text-[22px] p-4 text-center">
                    Видеоэкскурсия по главному зданию <span className="text-[var(--mainColor)]">ОшГУ</span>
                </h2>
            </div>
            <VideoPlay />
        </div>
    );
}
