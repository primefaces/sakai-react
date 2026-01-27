import React, { useEffect, useState } from 'react';
import { faCircle, faChalkboard, faUserGraduate, faBookOpen, faShieldHeart } from '@fortawesome/free-solid-svg-icons';
import MyFontAwesome from './MyFontAwesome';
import CountUp from 'react-countup';
import { MainPageStatistics } from '@/types/main/MainPageStatistic';

export default function CounterBanner({statisticValue}: {statisticValue: MainPageStatistics | null}) {
    const [statistics, setStatistics] = useState<MainPageStatistics | null>(null);

    useEffect(()=> {
        if(statisticValue){
            setStatistics(statisticValue);
        } else {
            setStatistics(null);
        }
    },[statisticValue]);

    return (
        <div className="w-full h-[300px] relative my-[50px] sm:my-[40px]">
            <div className="absolute left-1/2 top-0 w-screen -translate-x-1/2 grid sm:grid-cols-2 justify-between lg:grid-cols-4 gap-4 bg-[var(--titleColor)] -z-50 p-[40px] lg:p-[80px] text-white">
                   <div className='flex items-center gap-4'>
                <div className='relative w-[55px] flex items-center'>
                    <MyFontAwesome icon={faChalkboard} className='text-[40px] lg:text-[65px] text-white z-10'/>
                    <MyFontAwesome icon={faCircle} className='absolute z-0 bottom-[-25%] left-[25%] md:left-[50%] text-[27px] lg:text-[43px] text-[var(--mainColor)]'/>
                </div>
                <div className='flex flex-col'>
                    <div className='text-[22px] sm:text-[30px]'><CountUp start={0} end={statistics?.course || 0 } duration={4} /><span>+</span></div>
                    <span className='text-[12px] lg:text-[14px]'>Курсы & видео уроки</span>
                </div>
            </div>

            <div className='flex items-center gap-4'>
                <div className='relative w-[55px] flex items-center'>
                    <MyFontAwesome icon={faUserGraduate} className='text-[40px] lg:text-[65px] text-white z-10'/>
                    <MyFontAwesome icon={faCircle} className='absolute z-0 bottom-[-25%] left-[25%] md:left-[50%] text-[27px] lg:text-[43px] text-[var(--mainColor)]'/>
                </div>
                <div className='flex flex-col'>
                    <div className='text-[22px] lg:text-[26px]'><CountUp start={0} end={statistics?.students || 0 } duration={4} /><span>+</span></div>
                    <span className='text-[12px] lg:text-[14px]'>Зарегистрированные студенты</span>
                </div>
            </div>

            <div className='flex items-center gap-4'>
                <div className='relative w-[55px] flex items-center'>
                    <MyFontAwesome icon={faBookOpen} className='text-[40px] lg:text-[65px] text-white z-10'/>
                    <MyFontAwesome icon={faCircle} className='absolute z-0 bottom-[-25%] left-[25%] md:left-[50%] text-[27px] lg:text-[43px] text-[var(--mainColor)]'/>
                </div>
                <div className='flex flex-col'>
                    <div className='text-[22px] lg:text-[26px]'><CountUp start={0} end={statistics?.workers || 0 } duration={4} /><span>+</span></div>
                    <span className='text-[12px] lg:text-[14px]'>Преподаватели</span>
                </div>
            </div>

            <div className='flex items-center gap-4'>
                <div className='relative w-[55px] flex items-center'>
                    <MyFontAwesome icon={faShieldHeart} className='text-[40px] lg:text-[65px] text-white z-10'/>
                    <MyFontAwesome icon={faCircle} className='absolute z-0 bottom-[-25%] left-[25%] md:left-[50%] text-[27px] lg:text-[43px] text-[var(--mainColor)]'/>
                </div>
                <div className='flex flex-col'>
                    <div className='text-[22px] lg:text-[26px]'><CountUp start={0} end={100} duration={4} /><span>%</span></div>
                    <span className='text-[12px] lg:text-[14px]'>Уровень удовлетворённости</span>
                </div>
            </div>
            </div>
        </div>
    );
}
