'use client';
import useTypingEffect from '@/hooks/useTypingEffect';
import { Editor } from 'primereact/editor';
import { useEffect, useState } from 'react';
import { EditorTextChangeEvent } from 'primereact/editor';

export default function CKEditorWrapper({textValue, insideValue}: {textValue: (e: string | null)=> void, insideValue: string | null}) {
    const [text, setText] = useState<string | null>('');
    const [toggleTyping, setToggleTyping] = useState(true);
    
    // const typedText = useTypingEffect(
    //     'Текстти ушул жерге жазыныз',
    //     toggleTyping
    // );

    useEffect(()=> {        
        textValue(text);
    },[text]);

    return (
        <div className="flex justify-center">
            {insideValue ? 
                <Editor value={insideValue} onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue)} className='w-[800px] h-[300px]'/>
                : <Editor value={String(text)} onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue)} className='w-[800px] h-[300px]'/>
            }
        </div>
    );
}