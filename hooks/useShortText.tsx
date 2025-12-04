'use client';

import { useEffect, useState } from 'react';
import { Tooltip } from 'primereact/tooltip';

export default function useShortText(text: string, textLength: number, pos?:string) {
    const [resultText, setResultText] = useState('');
    const [isLength, setIsLength] = useState<boolean>(false);

    useEffect(() => {
        if (text?.length > textLength) {
            setIsLength(true);
            return setResultText(text.slice(0, textLength));
        } else {
            setResultText(text);
            setIsLength(false);
        }
    }, [text]);

    return (
        <>
            <Tooltip target=".hasTooltip" />
            {isLength ? (   
                <div className={`hasTooltip flex ${pos && pos.length > 0 ? 'flex-row items-end' : 'flex-col items-center'} justify-start gap-1 px-1 max-w-4xl break-words`} data-pr-tooltip={text} data-pr-position="right">
                    {resultText}
                    <i className="pi pi-ellipsis-h"></i>
                </div>
            ) : (
                <div className='flex max-w-2xl break-words'>{resultText}</div>
            )}
        </>
    );
}
