import Redacting from '../popUp/Redacting';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';

export default function LessonCard({ onSelected, onDelete, cardValue, cardBg, typeColor, type, lessonDate }: 
    {
        onSelected: (id: number, type: string)=> void,
        onDelete: (id: number) => void,
        cardValue: {title: string, id: number, type: string},
        cardBg: string,
        type: {typeValue: string, icon: string},
        typeColor: string,
        lessonDate: string
    }) 
    
    {
        
    return (
        <div className={`w-[180px] sm:w-[70%] md:w-[180px] h-[110px] flex flex-col shadow-xl rounded-sm p-2`} style={{ backgroundColor: cardBg }}>
            <div className="flex items-center justify-between">
                <div className={`flex gap-1 items-center font-bold`} style={{ color: typeColor }}>
                    <i className={`${type.icon}`}></i>
                    <span>{type.typeValue}</span>
                </div>
                <Redacting redactor={getRedactor(cardValue, {onEdit: onSelected, getConfirmOptions, onDelete: onDelete})} textSize={'12px'} />
            </div>
            <div className="bg-[#d6bcbc12] p-1 mt-2 flex flex-col gap-2 justify-between rounded-2xl">
                <div className="flex items-center">
                    <div className={`flex gap-1 items-center`}>
                        <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                        <span>{lessonDate}</span>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-1">{cardValue.title}</div>
            </div>
        </div>
    );
}
