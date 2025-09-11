import Redacting from '../popUp/Redacting';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { Button } from 'primereact/button';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import MyFontAwesome from '../MyFontAwesome';
import useShortText from '@/hooks/useShortText';
import { useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function LessonCard({
    status,
    onSelected,
    onDelete,
    cardValue,
    cardBg,
    typeColor,
    type,
    lessonDate,
    urlForPDF,
    urlForDownload,
    videoVisible
}: {
    status: string;
    onSelected?: (id: number, type: string) => void;
    onDelete?: (id: number) => void;
    cardValue: { title: string; id: number; desctiption?: string; type?: string; photo?: string; url?: string };
    cardBg: string;
    type: { typeValue: string; icon: string };
    typeColor: string;
    lessonDate: string;
    urlForPDF: () => void;
    urlForDownload: string;
    videoVisible?: (id: string | null)=> void;
}) {
    const shortTitle = useShortText(cardValue.title, 20);
    const shortDescription = useShortText(cardValue.desctiption ? cardValue.desctiption : '', 17);
    const shortUrl = useShortText(cardValue?.url ? cardValue?.url : '', 17);
    const [progressSpinner, setProgressSpinner] = useState(false);

    const toggleSpinner = () => {
        setProgressSpinner(true);
        setInterval(() => {
            setProgressSpinner(false);
        }, 2000);
    };

    const toSentPDF = () => {
        toggleSpinner();
        urlForPDF();
    };

    const lessonCardEvents = () => {
        if (type.typeValue === 'doc') {
            toSentPDF();
        } else if (type.typeValue === 'link') {
            // window.location.href = cardValue?.url || '#';
            window.open(cardValue?.url || '#', '_blank');
        }
    };

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
        type.typeValue === 'video' && (
            <div className="relative bg-white shadow w-[70%] max-h-[180px] overflow-hidden rounded-2xl">
                <div className="w-full h-[100%] absolute flex justify-center items-center bg-[rgba(8,9,0,30%)]">
                    <div className="relative flex items-center justify-center" onClick={()=> videoVisible?.(type.typeValue)}>
                        {/* Волна */}
                        {/* <span className="absolute w-full h-full rounded-full border-4 border-blue-500 animate-ping"></span> */}

                        {/* Иконка-кнопка */}
                        <div className="relative z-10 w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] rounded-full bg-white text-[var(--mainColor)] flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
                            <MyFontAwesome icon={faPlay} />
                        </div>
                    </div>
                </div>
                <img src={cardValue.photo || "/layout/images/no-image.png"} className="w-full object-cover" alt="Видео" />
            </div>
        ) 

    const btnLabel = type.typeValue === 'doc' && status === 'working' ? 'Көчүрүү' : type.typeValue === 'doc' && status === 'student' ? 'Ачуу' : type.typeValue === 'link' ? 'Өтүү' : '';

    return (
        <div
            className={`${type.typeValue === 'link' && 'relative'} ${type.typeValue !== 'link' && 'overflow-hidden'} 
            ${type.typeValue === 'video' && status === 'working' ? 'min-h-[200px]' : type.typeValue !== 'video' && status === 'working' ? 'min-h-[160px]' : ''} 
            ${status === 'student' && type.typeValue !== 'video' ? 'min-h-[160px]' : status === 'student' && type.typeValue === 'video' ? 'min-h-[200px]' : ''}
            w-[90%] sm:w-[80%] ${type.typeValue === 'video' ? 'md:w-[30%]' : 'md:w-[160px]'} flex flex-col justify-evenly lesson-card-border sm:rounded-2xl rounded p-2`}
            style={{ backgroundColor: cardBg }}
        >
            {status === 'working' && (
                <div>
                    <div className="flex items-center justify-end">{status === 'working' && <Redacting redactor={getRedactor(status, cardValue, { onEdit: onSelected, getConfirmOptions, onDelete: onDelete })} textSize={'12px'} />}</div>
                    {/* {cardHeader} */}
                </div>
            )}
            <div className={`flex flex-col items-center ${type.typeValue !== 'video' ? 'gap-3' : 'gap-1'}`}>
                <div className="bg-[#d6bcbc12] flex flex-col justify-between rounded-2xl p-1">
                    {/* <div className=''>{!cardValue.photo && <img className="cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSweN5K2yaBwZpz5W9CxY9S41DI-2LawmjzYw&s" alt="" />}</div> */}
                    <div className="flex items-center justify-center text-[15px] sm:text-[17px] mt-1">{shortTitle}</div>
                    {type.typeValue === 'link' && <span className="flex justify-center">{shortUrl}</span>}
                    <div className="flex items-center justify-center text-[13px]">{cardValue?.desctiption && cardValue?.desctiption !== 'null' && shortDescription}</div>
                    {status === 'working' && type.typeValue !== 'video' && (
                        <div className={`flex gap-1 items-center justify-center mt-1`}>
                            <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                            <span className="text-[12px]">{lessonDate}</span>
                        </div>
                    )}
                </div>

                {/* video preview */}
                {videoPreviw}

                {/* button */}
                {btnLabel && (
                    <>
                        {status === 'student' && type.typeValue === 'doc' ? (
                            <div className="flex gap-1 items-center">
                                <div className="flex gap-1 items-center">
                                    <Button onClick={lessonCardEvents} className="w-full" label={btnLabel} disabled={progressSpinner === true ? true : false} />
                                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                                </div>
                                <a href={urlForDownload} download target="_blank" rel="noopener noreferrer">
                                    {' '}
                                    <Button icon="pi pi-file-arrow-up" />
                                </a>
                            </div>
                        ) : (
                            <Button onClick={lessonCardEvents} label={btnLabel} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
