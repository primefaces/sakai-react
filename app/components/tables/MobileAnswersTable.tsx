import React from 'react';

interface Answer {
    themeName: string;
    submissionDate: string;
    teacherResponse: boolean;
    teacherResponseDate: string;
}

const MobileAnswersTable = () => {
    const answers: Answer[] = [
        { themeName: 'Введение в React', submissionDate: '2024-01-15', teacherResponse: true, teacherResponseDate: '2024-01-16' },
        { themeName: 'Компоненты и пропсы', submissionDate: '2024-01-22', teacherResponse: true, teacherResponseDate: '2024-01-23' },
        { themeName: 'Состояние и жизненный цикл', submissionDate: '2024-01-29', teacherResponse: false, teacherResponseDate: '-' },
        { themeName: 'Обработка событий', submissionDate: '2024-02-05', teacherResponse: true, teacherResponseDate: '2024-02-06' },
        { themeName: 'Условный рендеринг', submissionDate: '2024-02-12', teacherResponse: false, teacherResponseDate: '-' },
    ];

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {answers.map((answer, index) => (
                    <li key={index}>
                        <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                    {answer.themeName}
                                </p>
                                {answer.teacherResponse ? (
                                    <div className='flex items-center gap-1'>
                                        <i className='pi pi-check text-[green]]' style={{fontSize: '12px'}}></i>
                                        <span className="flex-shrink-0 inline-block py-0.5 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                                            Ответил
                                        </span>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-1'>
                                        <i className='pi pi-times text-[red]' style={{fontSize: '12px'}}></i>
                                        <span className="flex-shrink-0 inline-block py-0.5 text-xs font-semibold leading-5 rounded-full bg-red-100 text-red-800">
                                            Нет ответа
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        <span className="font-medium mr-1">Дата отправки:</span>
                                        {answer.submissionDate}
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <p>
                                        <span className="font-medium mr-1">Дата ответа:</span>
                                        {answer.teacherResponseDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MobileAnswersTable;
