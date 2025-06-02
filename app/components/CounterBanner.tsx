import React from 'react'
import { faCircle, 
    faChalkboard, 
    faUserGraduate,
    faBookOpen,
    faShieldHeart,
} from "@fortawesome/free-solid-svg-icons";
import MyFontAwesome from './MyFontAwesome';
import CountUp from 'react-countup';    

export default function CounterBanner() {
  return (
    <div>
        <div className='w-full grid sm:grid-cols-2 justify-between lg:grid-cols-4 gap-4 bg-[var(--titleColor)] -z-50 p-[40px] lg:p-[80px] text-white'>
            <div className='flex items-center gap-4'>
                <div className='relative w-[55px] flex items-center'>
                    <MyFontAwesome icon={faChalkboard} className='text-[40px] lg:text-[55px] text-white z-10'/>
                    <MyFontAwesome icon={faCircle} className='absolute z-0 right-0 bottom-[-25%] lg:right-[-25%] text-[27px] lg:text-[43px] text-[var(--mainColor)]'/>
                </div>
                <div className='flex flex-col'>
                    <div className='text-[22px] sm:text-[30px]'><CountUp start={14.000} end={15000} duration={2} /><span>+</span></div>
                    <span className='text-[12px] lg:text-[14px]'>Курстар & видеосабактар</span>
                </div>
            </div>

            <div className='flex items-center gap-4'>
                <div className='relative w-[55px] flex items-center'>
                    <MyFontAwesome icon={faUserGraduate} className='text-[40px] lg:text-[55px] text-white z-10'/>
                    <MyFontAwesome icon={faCircle} className='absolute z-0 right-0 bottom-[-25%] lg:right-[-25%] text-[27px] lg:text-[43px] text-[var(--mainColor)]'/>
                </div>
                <div className='flex flex-col'>
                    <div className='text-[22px] lg:text-[26px]'><CountUp start={130.000} end={145000} duration={2} /><span>+</span></div>
                    <span className='text-[12px] lg:text-[14px]'>Катталган студенттер</span>
                </div>
            </div>
        
            <div className='flex items-center gap-4'>
                <div className='relative w-[55px] flex items-center'>
                    <MyFontAwesome icon={faBookOpen} className='text-[40px] lg:text-[55px] text-white z-10'/>
                    <MyFontAwesome icon={faCircle} className='absolute z-0 right-0 bottom-[-25%] lg:right-[-25%] text-[27px] lg:text-[43px] text-[var(--mainColor)]'/>
                </div>
                <div className='flex flex-col'>
                    <div className='text-[22px] lg:text-[26px]'><CountUp start={5000} end={10000} duration={2} /><span>+</span></div>
                    <span className='text-[12px] lg:text-[14px]'>Окутуучулар</span>
                </div>
            </div>
        
            <div className='flex items-center gap-4'>
                <div className='relative w-[55px] flex items-center'>
                    <MyFontAwesome icon={faShieldHeart} className='text-[40px] lg:text-[55px] text-white z-10'/>
                    <MyFontAwesome icon={faCircle} className='absolute z-0 right-0 bottom-[-25%] lg:right-[-25%] text-[27px] lg:text-[43px] text-[var(--mainColor)]'/>
                </div>
                <div className='flex flex-col'>
                    <div className='text-[22px] lg:text-[26px]'><CountUp start={0} end={100} duration={2} /><span>%</span></div>
                    <span className='text-[12px] lg:text-[14px]'>Канааттануу деңгээли</span>
                </div>
            </div>
        </div>
    </div>
  )
}
