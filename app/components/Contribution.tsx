'use client';
import React from 'react';
import HeatMap from '@uiw/react-heat-map'; // <-- Новый импорт!
import { ContributionDay } from '@/types/ContributionDay';
import { User } from '@/types/user';

// Интерфейс для данных остается прежним (но у HeatMap используется prop 'value')

const ActivityHeatmap = ({ value, recipient, userInfo }: { value: ContributionDay[] | null; recipient: string, userInfo: User | null}) => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    console.log(userInfo);

    // const start = new Date('2025-01-01'); // 1 января
    // const end = new Date('2025-12-31'); // 31 декабря

    const end = new Date(); // сегодня
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);

    return (
        <div className="mx-auto w-full overflow-x-auto scrollbar-thin">
            <h2 style={{ marginBottom: 20 }} className="text-md sm:text-lg flex items-center justify-center gap-2">
                <span>{recipient}: </span>
                {userInfo && <div className='flex gap-1 items-center text-[var(--mainColor)]'>
                        <span>{userInfo?.last_name}</span>
                        <span>{userInfo?.name && userInfo?.name[0] + '.'}</span>
                        <span>{userInfo?.father_name && userInfo?.father_name[0] + '.'}</span>
                    </div>}
            </h2>
            {value && (
                <HeatMap
                    value={value} // <-- Используется пропс 'value'
                    startDate={start}
                    endDate={end}
                    legendCellSize={16} // Размер ячейки
                    rectSize={14}
                    space={2}
                    panelColors={{
                        0: '#ebedf0',
                        1: '#9be9a8',
                        2: '#40c463',
                        3: '#30a14e',
                        4: '#216e39'
                    }}
                    rectRender={(props, data) => {
                        // data = { date, count, column, row, index }
                        return (
                            <rect {...props}>
                                <title>{`${data?.date && String(data.date ?? '—')}: ${data?.count || 0} активностей`}</title>
                            </rect>
                        );
                    }}
                    monthLabels={months}
                    weekLabels={weekdays}
                    className="w-full min-w-[900px] m-auto flex "
                    // onClick в этой библиотеке называется rectRender или нужно использовать обертку
                    // Здесь мы его пока опустим, чтобы сфокусироваться на отображении
                />
            )}
        </div>
    );
};

export default ActivityHeatmap;
