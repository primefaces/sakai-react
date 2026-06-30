import React from 'react';

interface Answer {
    details: {
        answered_at: string | null;
        comment: string | null;
    }[];
}

interface Details {
    answered_at: string | null;
    comment: string | null;
}

const MobileAnswersTable = ({ answers }: { answers: any }) => {

    const teacherResponseTemplate = (rowData: Details) => {
        return rowData.answered_at && rowData.answered_at?.length ? (
            rowData.comment ? (
                <div className="flex items-center">
                    <i className="pi pi-times text-[red]" style={{ fontSize: '12px' }}></i>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{rowData.comment}</span>
                </div>
            ) : (
                <div className="flex items-center">
                    <i className="pi pi-check text-[green]" style={{ fontSize: '12px' }}></i>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ответил</span>
                </div>
            )
        ) : (
            <div className="flex items-center">
                <i className="pi pi-times text-[red]" style={{ fontSize: '12px' }}></i>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Пока проверка не завершена</span>
            </div>
        );
    };

    return (
        <div className='flex flex-col gap-2'>
            {answers?.details?.length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        <li>
                            <div className="px-4 py-4 sm:px-6 flex flex-col gap-2">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">{answers?.details[0]?.answered_at && <span className="font-medium mr-1">Дата ответа: {answers?.details[0]?.answered_at}</span>}</p>
                                </div>
                                {answers?.details?.length > 0 && teacherResponseTemplate(answers?.details[0])}
                            </div>
                        </li>
                    </ul>
                </div>
            ) : (
                ''
            )}
            <div className="inline-flex flex-col gap-2 p-1 border-gray-200 rounded bg-white font-sans">
                <div className="flex items-center gap-2">
                    <div className="tracking-wider text-gray-400 font-semibold">Дата создания: {answers?.created_at ? new Date(answers.created_at).toLocaleDateString() : '—'}</div>
                    <i className="pi pi-calendar-clock text-[var(--mainColor)]"></i>
                </div>

                <div className="flex items-center gap-2">
                    {/* {answers?.my_score ? ( */}
                    {/* // Вариант: Проверено (Строго, без лишних красок) */}
                    {answers?.my_score && (
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">Статус: Проверено</span>
                                <i className="pi pi-check-circle ml-1 text-[green]"></i>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">
                                    Балл: <b className="text-[var(--mainColor)]">{answers?.my_score}</b>
                                </span>
                            </div>
                        </div>
                    )}
                    {/* // ) : (
                                //     // Вариант: Ожидание (С мягкой анимацией точки)
                                //     <div className="flex items-center gap-2">
                                //         <span className="font-medium text-blue-900">Статус: На проверке</span>
                                //         <i className="pi pi-spinner-dotted pi-spin ml-1"></i>
                                //     </div>
                                // )} */}
                </div>
            </div>
        </div>
    );
};

export default MobileAnswersTable;
