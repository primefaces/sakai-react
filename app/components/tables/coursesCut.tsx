'use client';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { cutStudentConnect, fetchStudentCut } from '@/services/student/studentSearch';
import { confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useContext, useEffect, useState } from 'react';

interface ConnectType {
    active: boolean;
    course_name: string;
    earned_score: number;
    final_mark: number;
    potential_score: number;
    course_id: number;
    id_stream: number;
}

interface CurricullaType {
    connects: ConnectType[];
    id_curricula: number;
    is_score_exceeded: boolean;
    total_earned: number;
    total_potential: number;
    subject_name: string;
}    

export default function CoursesCut({ id_student }: { id_student: number | null }) {
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [student, setStudent] = useState<CurricullaType[] | null>(null);
    const [skeleton, setSkeleton] = useState(true);

    const handleFetchStudentDetail = async () => {
        const data = await fetchStudentCut(Number(id_student));
        if (data?.success) {
            setStudent(data?.data);
        }
        setSkeleton(false);
    };

    const handleCut = async (id_student: number, course_id: number, id_stream: number) => {
        setSkeleton(true);
        const data = await cutStudentConnect(Number(id_student), course_id, id_stream);
        if (data?.success) {
            handleFetchStudentDetail();
            setMessage({
                state: true,
                value: { severity: 'success', summary: data?.message, detail: '' }
            });
        } else {
            setSkeleton(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const confirm1 = (item: ConnectType) => {
        confirmDialog({
            message: (
                <div className="flex flex-col gap-2">
                    <b>Вы точно хотите удалить?</b> <span>Все данные потока и курса будут без возможности восстановления разорваны</span>
                </div>
            ),
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',

            acceptLabel: 'Удалить',
            rejectLabel: 'Назад',
            rejectClassName: 'p-button-secondary reject-button',
            acceptClassName: 'p-button-danger accept-button',
            accept: () => handleCut(Number(id_student), item?.course_id, item?.id_stream)
        });
    };

    const renderStatusBadge = (hasIssue: boolean) => {
        const baseClasses = 'inline-flex items-center px-2 py-1 rounded text-[13px] font-medium';
        if (hasIssue) {
            return <span className={`pi pi-times-circle text-[red] ${baseClasses}`}></span>;
        }
        return <span className={`pi pi-check-circle text-[green] ${baseClasses}`}></span>;
    };

    const renderConnects = (connects: ConnectType[], item: CurricullaType) => {
        if (!connects || connects?.length < 1) {
            return <span className="text-[13px] text-[#7a7a7a]">Нет связанных потоков</span>;
        }

        return (
            <div className="flex flex-col gap-2">
                {connects?.map((item, idx) => (
                    <div key={`${item?.course_name}-${idx}`} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 rounded border-2 sm:border border-[#efefef]">
                        <div className="flex flex-col gap-1 p-2 ">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[13px] text-[#7a7a7a]">Курс:</span>
                                <span className="font-semibold text-[14px]">{item?.course_name}</span>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px] font-semibold ${item?.active ? 'bg-[#e8fff1] text-[#0f7b36]' : 'bg-[#f4f4f4] text-[#7a7a7a]'}`}>
                                    <span className={`pi ${item?.active ? 'pi-check-circle' : 'pi-pause-circle'} text-[11px]`}></span>
                                    {item?.active ? 'Активен' : 'Неактивен'}
                                </span>
                                <span className="text-[12px] text-[var(--mainColor)]">ID {item?.id_stream}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 ">
                                <span className="text-[13px] text-[#7a7a7a]">Собрал:</span>
                                <span className="text-[14px] font-semibold">{item?.earned_score}</span>
                                <span className="text-[13px] text-[#7a7a7a]">Потенциал:</span>
                                <span className="text-[14px]">{item?.potential_score}</span>
                                <span className="text-[13px] text-[#7a7a7a]">Модуль:</span>
                                <span className="text-[14px] font-semibold">{item?.final_mark || '-'}</span>
                            </div>
                        </div>
                        <div className="pr-2 flex justify-end sm:justify-start">
                            <button
                                type="button"
                                className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-[#f5bcbc] bg-[#fff7f7] px-2 py-[4px] sm:py-[6px] text-[12px] font-semibold text-[#b00020] transition-colors duration-200 hover:bg-[#ffe9e9]"
                                title="Удалить поток"
                                aria-label="Удалить поток"
                                onClick={() => confirm1(item)}
                            >
                                <span className="pi pi-trash text-[12px]"></span>
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderMobileCards = () => {
        if (skeleton) {
            return (
                <div className="py-6 text-center text-[14px] text-[#7a7a7a]">
                    <ProgressSpinner style={{ width: '45px', height: '45px' }} />
                </div>
            );
        }

        if (!student || student.length < 1) {
            return <div className="py-6 text-center text-[14px] text-[#7a7a7a]">Данные отсутствуют</div>;
        }

        return (
            <div className="flex flex-col gap-3">
                {student.map((item, index) => {
                    const cardAlert = item?.is_score_exceeded === true ? 'border-[#f5bcbc] bg-[#fff7f7]' : 'border-[#ededed]';
                    return (
                        <div key={`${item?.id_curricula}-${index}`} className={`rounded border p-2 ${cardAlert}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[14px] font-semibold text-[#4B4563]">#{index + 1}</span>
                                {renderStatusBadge(Boolean(item?.is_score_exceeded))}
                            </div>
                            <div className="flex flex-col gap-1 mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-[#7a7a7a]">Собрал баллов</span>
                                    <span className="text-[15px] font-semibold">{item?.total_earned}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-[#7a7a7a]">Макс. возможный балл</span>
                                    <span className="text-[15px] font-semibold">{item?.total_potential}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[13px] text-[#7a7a7a]">Предмет</span>
                                <div className='flex items-center'>
                                    <b>{item?.subject_name}</b>
                                    <span className="ml-3 text-[12px] text-[var(--mainColor)]">{item?.id_curricula}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-1">
                                <span className="text-[13px] text-[#7a7a7a]">Связанные потоки</span>
                                {renderConnects(item?.connects || [], item)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderTableBody = () => {
        if (skeleton) {
            return (
                <tr>
                    <td colSpan={4} className="w-full py-6 text-center text-[14px] text-[#7a7a7a]">
                        <div className="w-full flex justify-center">
                            <ProgressSpinner style={{ width: '45px', height: '45px' }} />
                        </div>
                    </td>
                </tr>
            );
        }

        if (!student || student.length < 1) {
            return (
                <tr>
                    <td colSpan={4} className="py-6 text-center text-[14px] text-[#7a7a7a]">
                        Данные отсутствуют
                    </td>
                </tr>
            );
        }

        return student.map((item, index) => {
            const rowAlert = item?.is_score_exceeded === true ? 'bg-[#fff7f7]' : '';
            return (
                <tr key={`${item?.id_curricula}-${index}`} className={`border-b border-[#f0f0f0] ${rowAlert} hover:bg-green-50 transition-colors duration-200`}>
                    <td className="p-3 align-top text-[14px] text-[#4B4563] font-semibold">{index + 1}</td>
                    <td className="font-semibold p-3 align-top">
                        <div>
                            <span>{item?.subject_name}</span> <span className="ml-3 text-[12px] text-[var(--mainColor)]">{item?.id_curricula}</span>{' '}
                        </div>
                    </td>
                    <td className="p-3 align-top text-[14px]">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-[#7a7a7a]">Собрал баллов</span>
                                <span className="font-semibold text-[15px]">{item?.total_earned}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-[#7a7a7a]">Макс. возможный балл</span>
                                <span className="font-semibold text-[15px]">{item?.total_potential}</span>
                            </div>
                        </div>
                    </td>
                    {/* <td className="p-3 align-top">{item?.subject_name}</td> */}
                    <td className="p-3 align-top">{renderStatusBadge(Boolean(item?.is_score_exceeded))}</td>
                    <td className="p-3 align-top">{renderConnects(item?.connects || [], item)}</td>
                </tr>
            );
        });
    };

    useEffect(() => {
        handleFetchStudentDetail();
    }, []);

    return (
        <div>
            <div></div>
            <div className="w-full mt-4">
                <div className="block sm:hidden">{renderMobileCards()}</div>
                <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-lg hidden sm:block">
                    <table className=" w-full min-w-[760px] border-collapse text-[14px] divide-y divide-gray-200">
                        <thead className="text-[#4B4563]">
                            <tr>
                                <th className="text-left font-semibold p-3 w-[60px]">#</th>
                                <th className="text-left font-semibold p-3">Предметы</th>
                                <th className="text-left font-semibold p-3 w-[180px]">Итоги</th>
                                <th className="text-left font-semibold p-3 w-[180px]">Лимит баллов</th>
                                <th className="text-left font-semibold p-3">Связанные потоки</th>
                            </tr>
                        </thead>
                        <tbody>{renderTableBody()}</tbody>
                    </table>
                </div>
                <div className="hidden sm:flex items-center gap-2 mt-2 text-[13px] text-[#7a7a7a]">
                    <span className="w-[10px] h-[10px] rounded-sm bg-[#fff7f7] border border-[#f5bcbc]"></span>
                    <span>Строки с отметкой выделены, если есть проблемы по лимиту</span>
                </div>
            </div>
        </div>
    );
}
