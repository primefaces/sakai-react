import React, { useEffect, useState } from 'react';
import { faChalkboard, faUserGraduate, faBookOpen, faShieldHeart } from '@fortawesome/free-solid-svg-icons';
import MyFontAwesome from './MyFontAwesome';
import CountUp from 'react-countup';
import { MainPageStatistics } from '@/types/main/MainPageStatistic';
import { useLocalization } from '@/layout/context/localizationcontext';

export default function CounterBanner({statisticValue}: {statisticValue: MainPageStatistics | null}) {
    const { translations } = useLocalization();

    const [statistics, setStatistics] = useState<MainPageStatistics | null>(null);

    useEffect(()=> {
        if(statisticValue){
            setStatistics(statisticValue);
        } else {
            setStatistics(null);
        }
    },[statisticValue]);

    const items = [
        { icon: faChalkboard, value: statistics?.course || 0, suffix: '+', label: translations.coursesAndVideoLessons },
        { icon: faUserGraduate, value: statistics?.students || 0, suffix: '+', label: translations.registeredStudents },
        { icon: faBookOpen, value: statistics?.workers || 0, suffix: '+', label: translations.teachers },
        { icon: faShieldHeart, value: 100, suffix: '%', label: translations.satisfactionLevel }
    ];

    return (
        <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-[var(--titleColor)] via-[#1d2b78] to-[#0b6fa0] px-4 py-6 sm:px-10 sm:py-8 lg:px-16 lg:py-10">
            {/* decor */}
            <div className="absolute -top-20 -right-16 w-[260px] h-[260px] rounded-full bg-[var(--mainColor)]/30 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-10 w-[220px] h-[220px] rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-center">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        data-aos="fade-up"
                        data-aos-delay={idx * 120}
                        data-aos-duration="700"
                        data-aos-once="true"
                        className="group flex items-center gap-3 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-sm p-3 sm:p-4 transition-all duration-300 hover:bg-white/[0.12] hover:-translate-y-1"
                    >
                        <div className="shrink-0 w-[44px] h-[44px] lg:w-[50px] lg:h-[50px] rounded-xl bg-gradient-to-br from-[var(--mainColor)] to-[#0a7fb0] flex items-center justify-center shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-110">
                            <MyFontAwesome icon={item.icon} className="text-[18px] lg:text-[20px] text-white" />
                        </div>
                        <div className="flex flex-col text-white min-w-0">
                            <div className="text-[20px] lg:text-[24px] font-bold leading-none tracking-tight">
                                <CountUp start={0} end={item.value} duration={4} separator=" " enableScrollSpy scrollSpyOnce />
                                <span className="text-[var(--mainColor)]">{item.suffix}</span>
                            </div>
                            <span className="mt-1 text-[11px] lg:text-[13px] text-white/75 leading-snug">{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
