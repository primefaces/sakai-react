import Redacting from '../popUp/Redacting';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { Button } from 'primereact/button';
import { faPlay} from "@fortawesome/free-solid-svg-icons";
import MyFontAwesome from '../MyFontAwesome';

export default function LessonCard({
    status,
    onSelected,
    onDelete,
    cardValue,
    cardBg,
    typeColor,
    type,
    lessonDate,
    urlForPDF
}: {
    status: string;
    onSelected?: (id: number, type: string) => void;
    onDelete?: (id: number) => void;
    cardValue: { title: string; id: number; desctiption?: string; type?: string; photo?: string };
    cardBg: string;
    type: { typeValue: string; icon: string };
    typeColor: string;
    lessonDate: string;
    urlForPDF: ()=> void;
}) {

    const toSentPDF = () => {
        console.log('privet ');
        urlForPDF();
    }

    const cardHeader = 
        type.typeValue === 'video' && status === 'working' ? (
            <div className={`flex gap-2 justify-around items-center font-bold text-[12px]`} style={{ color: typeColor }}>
                <div className={`${type.icon} text-2xl text-[${typeColor}]`}></div>
                <div className={`flex gap-1 items-center`}>
                    <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                    <span className="text-[14px]">{lessonDate}</span>
                </div>
            </div>
        ) : (
            <div className="w-full flex justify-center">
                <i className={`${type.icon} text-4xl sm:text-5xl text-[${typeColor}]`}></i>
            </div>
        );

    const videoPreviw =
        type.typeValue === 'video' && status === 'working' ? (
            <div className="w-[100%] h-[100px] overflow-hidden rounded-2xl">
                <img src="/layout/images/no-image.png" className="w-full h-[100px] object-cover" alt="Видео" />
            </div>
        ) : type.typeValue === 'video' && status === 'student' ? (
            <div className="relative bg-white shadow w-[100%] h-[100px] overflow-hidden rounded-2xl">
                <div className="w-[100%] h-[100%] absolute flex justify-center items-center bg-[rgba(8,9,0,30%)]">
                    <div className="relative flex items-center justify-center">
                        {/* Волна */}
                        {/* <span className="absolute w-full h-full rounded-full border-4 border-blue-500 animate-ping"></span> */}

                        {/* Иконка-кнопка */}
                        <div className="relative z-10 w-[40px] h-[40px] rounded-full bg-white text-[var(--mainColor)] flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
                            <MyFontAwesome icon={faPlay} />
                        </div>
                    </div>
                </div>
                <img src="/layout/images/no-image.png" className="w-full h-[100px] object-cover" alt="Видео" />
            </div>
        ) : ''

    const btnLabel = type.typeValue === 'doc' && status === 'working' ? 'Көчүрүү' : type.typeValue === 'doc' && status === 'student' ? 'Ачуу' : type.typeValue === 'link' ? 'Өтүү' : '';

    return (
        <div
            className={`${type.typeValue === 'link' && 'relative'} ${type.typeValue !== 'link' && 'overflow-hidden'} ${
                type.typeValue === 'video' && status === 'working' ? 'h-[230px]' : 'h-[200px]'
            } w-[160px] sm:w-[70%] md:w-[160px] flex flex-col justify-evenly shadow-xl rounded-3xl p-2`}
            style={{ backgroundColor: cardBg }}
        >
            {type.typeValue === 'link' && <span className="card-link"></span>}
            <div>
                <div className="flex items-center justify-end">{status === 'working' && <Redacting redactor={getRedactor(status, cardValue, { onEdit: onSelected, getConfirmOptions, onDelete: onDelete })} textSize={'12px'} />}</div>
                {cardHeader}
            </div>
            <div className={`flex flex-col items-center ${type.typeValue !== 'video' ? 'gap-3' : 'gap-1'}`}>
                <div className="bg-[#d6bcbc12] flex flex-col justify-between rounded-2xl">
                    {/* <div className=''>{!cardValue.photo && <img className="cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSweN5K2yaBwZpz5W9CxY9S41DI-2LawmjzYw&s" alt="" />}</div> */}
                    <div className="flex items-center justify-center text-[16px] sm:text-2xl mt-1">{cardValue.title}</div>
                    <div className="flex items-center justify-center text-[13px]">{cardValue?.desctiption && cardValue.desctiption} lore10lfkjslk</div>
                    {status === 'working' && type.typeValue !== 'video' && (
                        <div className={`flex gap-1 items-center justify-center`}>
                            <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                            <span className="text-[14px]">{lessonDate}</span>
                        </div>
                    )}
                </div>

                {/* video preview */}
                {videoPreviw}

                {/* button */}
                {btnLabel && <Button onClick={toSentPDF} label={btnLabel} />}
            </div>
        </div>
    );
}
