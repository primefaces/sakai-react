'use client';
import React, { useEffect, useRef } from 'react';
import HeatMap from '@uiw/react-heat-map'; // <-- Новый импорт!
import { ContributionDay } from '@/types/ContributionDay';
import useMediaQuery from '@/hooks/useMediaQuery';

// Интерфейс для данных остается прежним (но у HeatMap используется prop 'value')

const ActivityHeatmap = ({ value }: { value: ContributionDay[] | null }) => {
    const ref = useRef<HTMLDivElement>(null);
    const media = useMediaQuery('(max-width: 640px)');

    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    // const start = new Date('2025-01-01'); // 1 января
    // const end = new Date('2025-12-31'); // 31 декабря

    const end = new Date(); // сегодня
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);

    useEffect(() => {
        if (media) {
            if (ref.current) {
                ref.current.scrollLeft = ref.current.scrollWidth;
            }
        }
    }, [media]);

    return (
        <div ref={ref} className="mx-auto w-full overflow-x-auto scrollbar-thin">
            {value && value?.length && (
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
