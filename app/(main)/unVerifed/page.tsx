'use client';

import MyDateTime from '@/app/components/MyDateTime';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useLocalization } from '@/layout/context/localizationcontext';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

export default function UnVerifed() {
    type OptionsType = Intl.DateTimeFormatOptions;

    const showError = useErrorMessage();
    const { setMessage, contextFetchVerifed, contextVerifedValue } = useContext(LayoutContext);
    const { language, translations } = useLocalization();

    const [skeleton, setSkeleton] = useState(false);
    const [hasThemes, setHasThemes] = useState(false);
    const [tasks, setTasks] = useState<answerListType[] | null>(null);

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24-часовой формат
    };

    // const fetchVerifedSteps = async () => {
    //     const data = await unVerifedSteps();

    //     setSkeleton(true);
    //     if (data?.success) {
    //         if (data?.lists?.length < 1) {
    //             setHasThemes(true);
    //         } else {
    //             setTasks(data?.lists);
    //             setHasThemes(false);
    //         }

    //         setSkeleton(false);
    //     } else {
    //         setHasThemes(true);
    //         setMessage({
    //             state: true,
    //             value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
    //         });
    //         if (data?.response?.status) {
    //             showError(data.response.status);
    //         }
    //         setSkeleton(false);
    //     }
    // };

    useEffect(() => {
        contextFetchVerifed();
    }, []);

    useEffect(() => {
        setSkeleton(true);
        if (contextVerifedValue && Array.isArray(contextVerifedValue)) {
            if (contextVerifedValue?.length < 1) {
                setHasThemes(true);
            } else {
                setTasks(contextVerifedValue);
                setHasThemes(false);
            }

            setSkeleton(false);
        } else {
            setHasThemes(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (contextVerifedValue?.response?.status) {
                showError(contextVerifedValue.response.status);
            }
        }
        setSkeleton(false);
    }, [contextVerifedValue]);

    return (
        <div className="main-bg">
            {hasThemes ? (
                <NotFound titleMessage={translations.noData} />
            ) : skeleton ? (
                <div className="w-full">
                    <GroupSkeleton count={2} size={{ width: '100%', height: '5rem' }} />
                </div>
            ) : (
                <>
                    <h3 className="text-xl pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">{translations.unverifiedTasks}</h3>
                    {tasks?.map((item) => {
                        return (
                            <div key={item?.answer?.id}>
                                <div key={item?.answer?.id} className="w-full flex flex-col justify-center shadow p-2 gap-2">
                                    <div className="w-full flex justify-between">
                                        <Link
                                            className="cursor-pointer"
                                            onClick={() => console.log(item?.answer?.course_id, item?.connect_id, item?.answer?.id_stream, item?.answer?.student?.myedu_id, item?.answer?.student?.id, item?.answer?.lesson_id, item?.answer?.steps_id)}
                                            href={`/students/${item?.answer?.course_id}/${item?.connect_id}/${item?.answer?.id_stream}/${item?.answer?.student?.myedu_id}/${item?.answer?.student?.id}/${item?.answer?.lesson_id}/${item?.answer?.steps_id}`}
                                        >
                                            <b className="text-[var(--mainColor)] underline">{language === 'ky' ? 'Практикалык тапшырма' : 'Практическое задание'}</b>
                                        </Link>
                                        <span className="text-sm w-[13px] h-[13px] rounded-full bg-[var(--amberColor)]"></span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-end justify-between w-full sm:w-[85%]">
                                            <p className="m-0 text-[13px]">
                                                {item?.answer?.student?.last_name} {item?.answer?.student?.name}
                                            </p>

                                            <Link
                                                href={`/students/${item?.answer?.course_id}/${item?.connect_id}/${item?.answer?.id_stream}/${item?.answer?.student?.myedu_id}/${item?.answer?.student?.id}/${item?.answer?.lesson_id}/${item?.answer?.steps_id}`}
                                                className="cursor-pointer m-0 text-[12px] sm:text-[13px] text-[var(--mainColor)] flex items-center gap-1"
                                            >
                                                <span className="text-[var(--mainColor)]">{translations.goTo}</span> <i style={{ fontSize: '10px' }} className="pi pi-arrow-right text-[var(--mainColor)]"></i>
                                            </Link>
                                        </div>
                                        <div className="w-full relative flex mt-1">
                                            <p className="absolute right-0 -top-3 text-[10px] m-0">
                                                <MyDateTime createdAt={item?.answer?.created_at} options={options} />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}

