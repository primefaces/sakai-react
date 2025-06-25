'use client';
import useTypingEffect from '@/hooks/useTypingEffect';
import { Editor } from 'primereact/editor';
import { useEffect, useState } from 'react';

export default function CKEditorWrapper() {
    const [text, setText] = useState('');
    const [toggleTyping, setToggleTyping] = useState(true);
    
    const typedText = useTypingEffect(
        'Текстти ушул жерге жазыныз',
        toggleTyping
    );

    useEffect(()=> {
        // console.log(typedText, typedText.length);
    },[typedText]);

    return (
        <div className="flex justify-center">
            {typedText.length > 0 ? <Editor key={typedText.length === 0 ? 'reset' : 'typing'} value={`<strong>${typedText}</strong>`} onClick={()=> setToggleTyping(false)} className='w-[800px] h-[300px]' />
                : <Editor value={text} onTextChange={(  e) => setText(e.htmlValue)} className='w-[800px] h-[300px]'/>
            }
        </div>
    );
}
