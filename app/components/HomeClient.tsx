'use client';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useContext, useEffect, useState } from 'react';
import CounterBanner from './CounterBanner';
import Link from 'next/link';
import VideoPlay from './VideoPlay';
import FancyLinkBtn from './buttons/FancyLinkBtn';
import { LayoutContext } from '@/layout/context/layoutcontext';
import useMediaQuery from '@/hooks/useMediaQuery';
import { MainPageStatistics } from '@/types/main/MainPageStatistic';
import { mainPageStatistics } from '@/services/main/main';
import useErrorMessage from '@/hooks/useErrorMessage';
import { fetchOpenCoursesMainPage, openCourseShow, openCourseSignup, signupList } from '@/services/openCourse';
import { myMainCourseType } from '@/types/myMainCourseType';
import MyDateTime from './MyDateTime';
import { OptionsType } from '@/types/OptionsType';
import GroupSkeleton from './skeleton/GroupSkeleton';
import { Sidebar } from 'primereact/sidebar';
import OpenCourseShowCard from './cards/OpenCourseShowCard';
import { CourseCategoryOption } from '@/types/openCourse/CourseCategoryOption';
import { useLocalization } from '@/layout/context/localizationcontext';
import AppConfig from '@/layout/AppConfig';
import { getToken } from '@/utils/auth';

export default function HomeClient() {
    // types

    const params = new URLSearchParams();
    const { translations } = useLocalization();
    const { user, setGlobalLoading, setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [statistics, setStatistics] = useState<MainPageStatistics | null>(null);
    const [skeleton, setSkeleton] = useState(false);
    const [showVisisble, setShowVisible] = useState(false);
    const [hasCourses, setHasCourses] = useState(false);
    const [coursesValue, setValueCourses] = useState<myMainCourseType[]>([]);
    const [courseDetail, setCourseDetail] = useState<CourseCategoryOption | null>(null);
    const [signUpList, setSignupList] = useState<number[]>([]);
    const [newCourses, setNewCourses] = useState<CourseCategoryOption[]>([]);
    const [bestCourses, setBestCourses] = useState<CourseCategoryOption[]>([]);
    const [popularCourses, setPopular_courses] = useState<CourseCategoryOption[]>([]);

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        hour12: false // 24-часовой формат
    };
    const media = useMediaQuery('(max-width: 640px)');

    const handleMainPageStatistics = async () => {
        const data = await mainPageStatistics();
        if ((data && data?.students) || data?.workers || data?.course) setStatistics(data);
    };

    const handleFetchNewCourse = async () => {
        setSkeleton(true);
        const data = await fetchOpenCoursesMainPage();
        if (data && data?.new_courses) {
            setHasCourses(false);
            MainCoursesPreperation(data);
            setNewCourses(data?.new_courses);
            setBestCourses(data?.best_courses);
            setPopular_courses(data?.popular_courses);
        }
        setSkeleton(false);
    };

    const MainCoursesPreperation = (data: Record<string, CourseCategoryOption[]>)=> {
        const forMainCourses = [];
        for (const key in data) {
            const coureseTypeItems = data[key];
            forMainCourses.push(...coureseTypeItems);
        }
        if(forMainCourses?.length){
            setValueCourses(forMainCourses);
        }
    }

    const imageBodyTemplate = (product: CourseCategoryOption) => {
        const image = typeof product.image === 'string' ? product.image : '/layout/images/no-image.png';

        return (
            <img
                src={image}
                alt="Course image"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => ((e.target as HTMLImageElement).src = '/layout/images/no-image.png')}
            />
        );
    };

    const OpenCourse = ({ course }: { course: CourseCategoryOption; index: number }) => {
        const audience = course?.audience_type?.name;
        const author = !media
            ? [course?.user?.last_name, course?.user?.name, course?.user?.father_name].filter(Boolean).join(' ')
            : [course?.user?.last_name, course?.user?.name && course?.user?.name[0] + '.', course?.user?.father_name && course?.user?.father_name[0] + '.'].filter(Boolean).join(' ');
        const initials = `${course?.user?.last_name?.[0] || ''}${course?.user?.name?.[0] || ''}`.toUpperCase();

        return (
            <div
                onClick={() => course.status && handleCourseShow(course?.id)}
                className={`group relative bg-white w-full h-full border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(33,34,95,0.06)] transition-all duration-300 hover:shadow-[0_14px_34px_rgba(8,169,230,0.18)] hover:-translate-y-1 hover:border-[var(--mainBorder)] flex flex-col ${
                    course.status ? 'cursor-pointer' : ''
                }`}
            >
                {/* image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {imageBodyTemplate(course)}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {audience === 'open' || audience === 'wallet' ? (
                        <div
                            className={`absolute top-3 left-3 flex gap-1 items-center text-[0.72rem] font-semibold text-white rounded-full px-2.5 py-1 shadow-md ${
                                audience === 'open' ? 'bg-[var(--greenColor)]' : 'bg-[var(--amberColor)]'
                            }`}
                        >
                            <i className={course?.audience_type?.icon} style={{ fontSize: '11px' }}></i>
                            <span>{audience === 'open' ? 'Бесплатный' : 'Платный'}</span>
                        </div>
                    ) : null}

                    {course?.is_featured ? (
                        <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/95 shadow-md" title="Рекомендован департаментом">
                            <i className="pi pi-verified text-[var(--greenColor)]" style={{ fontSize: '15px' }}></i>
                        </div>
                    ) : null}
                </div>

                {/* body */}
                <div className="flex flex-col gap-2 p-4 flex-1">
                    {course?.category?.title ? (
                        <span className="self-start text-[0.7rem] font-medium uppercase tracking-wide text-[var(--mainColor)] bg-[var(--mainColor)]/10 rounded-md px-2 py-0.5 max-w-full truncate">
                            {course?.category.title}
                        </span>
                    ) : null}

                    <h4 className="m-0 text-[1rem] leading-snug font-bold text-[var(--titleColor)] line-clamp-2 break-words group-hover:text-[var(--mainColor)] transition-colors">{course?.title}</h4>

                    {course?.description ? <p className="m-0 text-[0.82rem] leading-relaxed text-slate-500 line-clamp-2 break-words">{course?.description}</p> : null}

                    {/* footer */}
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--mainColor)] to-[var(--titleColor)] text-white text-[0.7rem] font-bold flex items-center justify-center">
                                {initials || <i className="pi pi-user" style={{ fontSize: '12px' }}></i>}
                            </div>
                            <span className="text-[0.8rem] text-[var(--titleColor)] truncate author_font" title={author}>
                                {author}
                            </span>
                        </div>
                        <div className="shrink-0 flex items-center gap-1 text-[0.7rem] text-slate-400">
                            <i className="pi pi-calendar" style={{ fontSize: '10px' }}></i>
                            <MyDateTime createdAt={course?.created_at} options={options} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const coursesSkeleton = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white border border-slate-100">
                    <GroupSkeleton count={1} size={{ width: '100%', height: '320px' }} />
                </div>
            ))}
        </div>
    );

    const CourseSection = ({ title, icon, courses }: { title: string; icon: string; courses: CourseCategoryOption[] }) => {
        if (!courses?.length) return null;
        return (
            <section className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--mainColor)]/10 text-[var(--mainColor)] flex items-center justify-center">
                            <i className={icon} style={{ fontSize: '18px' }}></i>
                        </div>
                        <div>
                            <h3 className="m-0 text-lg sm:text-2xl font-bold text-[var(--titleColor)]">{title}</h3>
                            <div className="h-[3px] w-10 mt-1 rounded-full bg-gradient-to-r from-[var(--mainColor)] to-transparent"></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">{courses.length}</span>
                    </div>
                    <Link href={'/openCourse/1'} className="group/link flex items-center gap-1 text-sm font-medium text-[var(--mainColor)] hover:text-[var(--titleColor)] transition-colors">
                        <span>{translations.allOpenCourses}</span>
                        <i className="pi pi-arrow-right transition-transform group-hover/link:translate-x-1" style={{ fontSize: '12px' }}></i>
                    </Link>
                </div>
                {skeleton ? (
                    coursesSkeleton
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {courses.map((item, idx) => (
                            <OpenCourse key={item?.id} course={item} index={idx} />
                        ))}
                    </div>
                )}
            </section>
        );
    };

    const handleCourseShow = async (course_id: number) => {
        setShowVisible(true);
        setSkeleton(true);
        const data = await openCourseShow(course_id);

        if (data && Object.values(data)?.length) {
            setCourseDetail(data);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setSkeleton(false);
    };

    // signUp
    const сourseSignup = async (course_id: number) => {
        const data = await openCourseSignup(course_id);
        if (data?.success) {
            handleSendSingup();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешное добавление!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: translations.errorTitle, detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    // signup courses list
    const handleSignupList = async (course: any) => {
        course?.forEach((i: { id: number }) => params.append('course_Ids[]', String(i?.id)));
        const data = await signupList(params);
        if (data && data?.signed_courses) {
            return data?.signed_courses;
        } else {
            return null;
        }
    };

    const handleSendSingup = async () => {
        const token = getToken('access_token');
        if(token){
            const list: any | null = await handleSignupList(coursesValue);
            if (list) {
                setSignupList(list);
            }
        }
    };

    useEffect(() => {
        if (coursesValue?.length) {
            handleSendSingup();
        }
    }, [coursesValue]);

    useEffect(() => {
        // открытые курсы временно отключены на главной
        // handleFetchNewCourse();
        // handleFetchOpenCourse(pageState, '', '');
        setGlobalLoading(true);
        handleMainPageStatistics();
        setTimeout(() => {
            setGlobalLoading(false);
        }, 800);
        AOS.init();
    }, []);

    const hasAnyCourses = newCourses?.length || bestCourses?.length || popularCourses?.length;

    return (
        <div className="relative w-full">
            {/* ===== HERO ===== */}
            <section className="relative left-1/2 w-screen -translate-x-1/2 mt-[96px] overflow-hidden">
                {/* background */}
                <div className="absolute inset-0 home-bg !opacity-100 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/75 to-white/55 pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-[var(--titleColor)]/15 to-transparent pointer-events-none"></div>

                <div className="relative z-[1] max-w-[1100px] mx-auto px-4 py-[56px] sm:py-[72px] flex flex-col items-center text-center">
                    <div
                        data-aos="fade-down"
                        data-aos-duration="800"
                        data-aos-once="true"
                        className="flex items-center gap-3 text-[0.85rem] sm:text-[1rem] font-medium tracking-wide text-[var(--mainColor)]"
                    >
                        <span className="hidden sm:block h-[1px] w-[40px] bg-gradient-to-r from-transparent to-[var(--mainColor)]"></span>
                        {translations.convenientOnlineLearningSpace}
                        <span className="hidden sm:block h-[1px] w-[40px] bg-gradient-to-l from-transparent to-[var(--mainColor)]"></span>
                    </div>

                    <h1
                        data-aos="fade-up"
                        data-aos-delay="150"
                        data-aos-duration="900"
                        data-aos-once="true"
                        className="mt-4 mb-0 text-[1.8rem] sm:text-[2.6rem] lg:text-[3.1rem] leading-[1.15] font-bold tracking-tight text-[var(--titleColor)]"
                    >
                        {translations.welcomeToDistanceLearningPortal}
                    </h1>

                    <p data-aos="fade-up" data-aos-delay="300" data-aos-duration="900" data-aos-once="true" className="mt-4 mb-0 max-w-[640px] text-[0.95rem] sm:text-[1.05rem] leading-relaxed text-[var(--bodyColor)]">
                        {translations.weUniteUniversityProjects}
                    </p>

                    <ul data-aos="fade-up" data-aos-delay="450" data-aos-duration="900" data-aos-once="true" className="list-none p-0 mt-5 mb-0 flex flex-col sm:flex-row items-center gap-[10px] sm:gap-[28px]">
                        {[translations.openOnlineHome, translations.higherEducationPrograms].map((text) => (
                            <li key={text} className="flex items-center gap-2 text-[0.95rem] text-[var(--mainColor)] sm:text-[1.05rem] font-bold text-[var(--titleColor)]">
                                <i className="pi pi-check-circle text-[var(--mainColor)]" style={{ fontSize: '16px' }}></i>
                                {text}
                            </li>
                        ))}
                    </ul>

                    {user || media ? (
                        <div data-aos="fade-up" data-aos-delay="600" data-aos-duration="900" data-aos-once="true" className="mt-7">
                            {user ? (
                                <Link href={user.is_working ? '/course/1' : user.is_student ? '/teaching' : ''}>
                                    <FancyLinkBtn btnWidth={'220px'} backround={'--mainColor'} effectBg={'--titleColor'} title={user.is_working ? translations.teacherBtn : user.is_student ? translations.studentBtn : ''} btnType={false} />
                                </Link>
                            ) : (
                                <Link href={'/auth/login'}>
                                    <FancyLinkBtn btnWidth={'220px'} backround={'--mainColor'} effectBg={'--titleColor'} title={translations.login} btnType={false} />
                                </Link>
                            )}
                        </div>
                    ) : null}
                </div>
            </section>

            {/* ===== STATISTICS ===== */}
            <CounterBanner statisticValue={statistics} />

            <AppConfig />

            <div className="relative z-[1] pt-[56px] sm:pt-[72px] pb-[56px] flex flex-col gap-14 sm:gap-20">

                {/* ===== OPEN COURSES (временно отключены) ===== */}
                {/* {hasAnyCourses ? (
                    <div className="flex flex-col gap-14">
                        <CourseSection title={translations.newCourses} icon="pi pi-bolt" courses={newCourses} />
                        <CourseSection title={translations.popularCourses} icon="pi pi-star" courses={popularCourses} />
                        <CourseSection title={translations.recommendedByDepartment} icon="pi pi-verified" courses={bestCourses} />
                    </div>
                ) : skeleton ? (
                    coursesSkeleton
                ) : null}

                <Sidebar visible={showVisisble} position="bottom" style={{ height: '90vh' }} onHide={() => setShowVisible(false)}>
                    {skeleton ? (
                        <GroupSkeleton count={1} size={{ width: '100%', height: '12rem' }} />
                    ) : courseDetail ? (
                        <OpenCourseShowCard course={courseDetail} courseSignup={сourseSignup} signUpList={signUpList} btnDisabled={false} />
                    ) : (
                        <b className="flex justify-center">{translations.dataNotAvailable}</b>
                    )}
                </Sidebar> */}

                {/* ===== VIDEO ===== */}
                <section className="flex flex-col items-center gap-6" data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
                    <div className="text-center">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--mainColor)] bg-[var(--mainColor)]/10 rounded-full px-3 py-1">
                            <i className="pi pi-video" style={{ fontSize: '12px' }}></i>
                            Video
                        </span>
                        <h2 className="mt-3 mb-0 text-[1.5rem] sm:text-[2rem] font-bold text-[var(--titleColor)]">
                            {translations.videoTourMainBuilding} <span className="text-[var(--mainColor)]">{translations.oshSU}</span>
                        </h2>
                    </div>
                    <VideoPlay />
                </section>
            </div>
        </div>
    );
}
