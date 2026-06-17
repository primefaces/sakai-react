'use client';

import MyDateTime from '../MyDateTime';

interface DateType {
    from: string | null,
    to: string | null,
}

type ModuleChartCardProps = {
    title?: string;
    connectId: number;
    handleEdit: (id: number, checked: { checked: boolean }) => void;
    allIds: number[] | null;
    date?: DateType;
    dateUpdate?: (id: number)=> void;
};

type OptionsType = Intl.DateTimeFormatOptions;

export default function ModuleChartCard({ title = 'Название карточки', connectId, handleEdit, allIds, date, dateUpdate }: ModuleChartCardProps) {
    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour12: false // 24-часовой формат
    };

    return (
        <div className="group w-full bg-white border border-slate-100 shadow-sm hover:shadow-md rounded px-2 py-1 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer">
            <div className="flex justify-end text-[11px] font-bold">
                ID: <span> {connectId}</span>
            </div>
            <div className="flex gap-1 flex-col w-full">
                <div className="flex items-center gap-2 ">
                    {/* Секция с чекбоксом (Label не тронут) */}
                    <div className="flex items-center shrink-0">
                        <label className="custom-radio text-xl leading-none">
                            <input
                                type="checkbox"
                                className={`customCheckbox p-2`}
                                checked={allIds ? allIds.some((s) => s === connectId) : false}
                                onChange={(e) => {
                                    handleEdit(connectId, e.target);
                                }}
                            />
                            <span className="checkbox-mark"></span>
                        </label>
                    </div>

                    {/* Заголовок */}
                    <div className="flex-1 min-w-0 sm:m-0">
                        <span className="text-[14px] font-medium text-slate-700 tracking-tight max-w-[80%] break-words">{title}</span>
                    </div>
                </div>
                {/* Секция с датой */}
                <div className="w-full flex items-center gap-1">
                    <div className="flex items-center justify-end sm:ml-auto">
                        <div className="flex items-center gap-2 text-[10px]">
                            <span className="">{date ? <MyDateTime createdAt={date?.from} options={options} /> : '---'}</span>
                            <i>-</i>
                            <span className="">{date ? <MyDateTime createdAt={date?.to} options={options} /> : '---'}</span>
                        </div>
                    </div>
                    {date?.from && date?.to  ?
                        <i
                            className={'pi pi-pencil p-2 rounded-full text-[var(--mainColor)] hover:shadow hover:bg-[var(--borderBottomColor)] transition'}
                            style={{ fontSize: '14px' }}
                            onClick={() => {
                                dateUpdate ? dateUpdate(connectId) : '';
                            }}
                        ></i> : ''
                    }
                </div>
            </div>
        </div>
    );
}
