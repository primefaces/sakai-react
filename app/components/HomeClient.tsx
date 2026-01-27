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

export default function HomeClient() {
    // types 

    const params = new URLSearchParams();
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

    const imageBodyTemplate = (product: any, idx: number) => {
        const image = product.image;

        if (typeof image === 'string') {
            return (
                <div className="flex justify-center w-[70%] sm:w-[80%] sm:max-h-[200px] rounded" key={product.id}>
                    <img src={image} alt="Course image" className="w-full object-cover shadow-2 border-round" />
                </div>
            );
        }

        return (
            // <div className="flex justify-center min-w-[100px] w-[100px] min-h-[100px] h-[100px] sm:w-[120px] sm:min-w-[120px] sm:h-[120px] sm:min-h-[120px] mx-4" key={product.id}>
            <div className="flex justify-center w-[70%] sm:w-[80%] sm:max-h-[200px] rounded" key={product.id}>
                <img src={'/layout/images/no-image.png'} alt="Course image" className="w-full object-cover shadow-2 border-round" />
                {/* <div ></div> */}
            </div>
        );
    };

    const OpenCourse = ({ course, index }: { course: CourseCategoryOption; index: number }) => {
        return (
            <div key={course?.id} className="max-h-[410px] min-h-[350px] bg-white w-full sm:min-w-[280px] sm:max-w-[280px] shadow-md rounded p-2 flex flex-col gap-2 justify-between">
                <div className="relative">
                    <div className="flex justify-center items-center">{imageBodyTemplate(course, index)}</div>
                    <div
                        className={`absolute top-0 right-0 sm:flex gap-1 items-center text-sm text-white rounded p-1 mb-1 ${course?.audience_type?.name === 'open' ? 'bg-[var(--greenColor)]' : course?.audience_type?.name === 'wallet' ? 'bg-[var(--amberColor)]' : ''
                            }`}
                    >
                        <i className={course?.audience_type?.icon} style={{ fontSize: '13px' }}></i>
                        <i className="text-[12px]">{course?.audience_type?.name === 'open' ? 'Бесплатный' : course?.audience_type?.name === 'wallet' ? 'Платный' : ''}</i>
                    </div>
                </div>

                <div className="flex justify-center flex-col">
                    {course.status ? (
                        <b
                            onClick={() => handleCourseShow(course?.id)}
                            className="cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline"
                        >
                            {course?.title}
                        </b>
                    ) : (
                        <b
                            className="cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline"
                        >
                            {course?.title}
                        </b>
                    )}

                    <div className="max-h-[20px] overflow-hidden text-ellipsis block">
                        <small className="max-w-[170px] overflow-hidden text-nowrap text-ellipsis block">{course?.description}</small>
                    </div>
                </div>

                <div className='flex items-center flex-wrap gap-2 justify-between'>
                    {
                        course?.category?.title ?
                            <div className='p-1 bg-[var(--redWeakColor)]'>
                                <p className='text-sm max-w-[300px] break-words'>{course?.category.title}</p>
                            </div>
                            : ''
                    }

                    {
                        course?.is_featured ?
                            <i className='pi pi-verified text-[green] shadow ml-2 p-1 rounded-full' title='Рекомендован департаментом'></i>
                            : ''
                    }
                </div>

                <div>
                    <div className="flex items-center justify-center text-[15px] text-[var(--titleColor)] author_font">
                        {/* <span className="">Автор: </span> */}
                        <div className="flex gap-1 items-start max-w-[230px] break-words text-wrap flex-wrap">
                            {!media ? (
                                <>
                                    <span>{course?.user?.last_name}</span>
                                    <span>{course?.user?.name}</span>
                                    <span>{course?.user?.father_name}</span>
                                </>
                            ) : (
                                <>
                                    <span>{course?.user?.last_name}</span>
                                    <span>{course?.user?.name[0]}.</span>
                                    <span>{course?.user?.father_name && course?.user?.father_name[0] + '.'}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* data */}
                    <div className="w-full flex justify-end text-[11px] order-1 sm:order-2">
                        <MyDateTime createdAt={course?.created_at} options={options} />
                    </div>
                </div>
            </div>
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
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
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
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
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
        // current course 
        const list: any | null = await handleSignupList(coursesValue);
        if (list) {
            setSignupList(list);
        }
    };

    useEffect(() => {
        if (coursesValue?.length) {
            handleSendSingup();
        }
    }, [coursesValue]);

    useEffect(() => {
        handleFetchNewCourse();
        // handleFetchOpenCourse(pageState, '', '');
        setGlobalLoading(true);
        handleMainPageStatistics();
        setTimeout(() => {
            setGlobalLoading(false);
        }, 800);
        AOS.init();
    }, []);

    return (
        <>
            <div className="absolute left-0 right-0 top-[96px] w-full home-bg min-h-[500px] max-h-[500px]"></div>
            <div className="relative mt-[98px] px-2 py-[50px] z-[1]">
                {/* <Link href={`/pdf/1757146212.pdf`}>{"Уроки"}</Link> */}
                <div className="w-full">
                    <div className="flex flex-column md:flex-row items-center justify-center overflow-hidden">
                        <div className="w-full">
                            <div className="w-full m-auto overflow-hidden text-[16px] text-[var(--mainColor)] block mb-[15px]">
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
                                            <FancyLinkBtn btnWidth={'200px'} backround={'--mainColor'} effectBg={'--titleColor'} title={user.is_working ? 'Преподаватель' : user.is_student ? 'Студент' : ''} btnType={false} />
                                        </Link>
                                    ) : media ? (
                                        <Link href={'/auth/login'}>
                                            <FancyLinkBtn btnWidth={'200px'} backround={'--mainColor'} effectBg={'--titleColor'} title={'Вход'} btnType={false} />
                                        </Link>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Counter Statistics */}
                <CounterBanner statisticValue={statistics} />

                {/* open courses */}

                <div className={`flex flex-col gap-4 ${newCourses?.length || bestCourses?.length || popularCourses?.length ? 'main-bg' : ''}`}>
                    {newCourses?.length > 0 ? (
                        skeleton ? (
                            <div className="flex flex-wrap gap-2 flex-col sm:flex-row justify-center">
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                            </div>
                        ) : (
                            <div className="m-auto">
                                <h3 className="text-lg sm:text-xl text-center mb-4 font-bold">Новые курсы</h3>
                                <div className="w-full flex flex-wrap justify-center gap-4 mt-5 sm:m-0">
                                    {newCourses?.map((item, idx) => {
                                        return <OpenCourse key={item?.id} course={item} index={idx} />;
                                    })}
                                </div>
                            </div>
                        )
                    ) : (
                        ''
                    )}

                    {popularCourses?.length > 0 ? (
                        skeleton ? (
                            <div className="flex flex-wrap gap-2 flex-col sm:flex-row justify-center">
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                            </div>
                        ) : (
                            <div className="">
                                <h3 className="text-lg sm:text-xl text-center mb-4 font-bold">Популярные курсы</h3>
                                <div className="w-full flex flex-wrap justify-center gap-4 mt-5 sm:m-0">
                                    {popularCourses?.map((item, idx) => {
                                        return <OpenCourse key={item?.id} course={item} index={idx} />;
                                    })}
                                </div>
                            </div>
                        )
                    ) : (
                        ''
                    )}

                    {bestCourses?.length > 0 ? (
                        skeleton ? (
                            <div className="flex flex-wrap gap-2 flex-col sm:flex-row justify-center">
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                                <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                            </div>
                        ) : (
                            <div className="">
                                <h3 className="text-lg sm:text-xl text-center mb-4 font-bold">Рекомендованные департаментом</h3>
                                <div className="w-full flex flex-wrap justify-center gap-4 mt-5 sm:m-0">
                                    {bestCourses?.map((item, idx) => {
                                        return <OpenCourse key={item?.id} course={item} index={idx} />;
                                    })}
                                </div>
                            </div>
                        )
                    ) : (
                        ''
                    )}

                    {newCourses?.length || bestCourses?.length || popularCourses?.length ? <Link href={'/openCourse'} className='cursor-pointer flex gap-1 items-center justify-end font-[italic] text-[var(--mainColor)]'>
                        <span className='underline'>Все открытые курсы</span>
                        <i className='pi pi-arrow-right text-sm font-[italic]'></i>
                    </Link> : ''}
                </div>

                <Sidebar visible={showVisisble} position="bottom" style={{ height: '90vh' }} onHide={() => setShowVisible(false)}>
                    {skeleton ? (
                        <GroupSkeleton count={1} size={{ width: '100%', height: '12rem' }} />
                    ) : courseDetail ? (
                        <OpenCourseShowCard course={courseDetail} courseSignup={сourseSignup} signUpList={signUpList} btnDisabled={false} />
                    ) : (
                        <b className="flex justify-center">Данные не доступны</b>
                    )}
                </Sidebar>

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
