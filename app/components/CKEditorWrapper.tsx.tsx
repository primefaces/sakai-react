'use client';
import useTypingEffect from '@/hooks/useTypingEffect';
import { Editor } from 'primereact/editor';
import { useEffect, useState } from 'react';
import { EditorTextChangeEvent } from 'primereact/editor';

export default function CKEditorWrapper({ textValue, insideValue }: { textValue: (e: string) => void; insideValue: string }) {
    const [text, setText] = useState<string | null>('');
    const [toggleTyping, setToggleTyping] = useState(true);

    // const typedText = useTypingEffect(
    //     'Текстти ушул жерге жазыныз',
    //     toggleTyping
    // );

    useEffect(() => {
        // const parser = new DOMParser();
        // const doc = parser.parseFromString(text, 'text/html');
        // const imgs = doc.querySelectorAll('img');
        // console.log(imgs);

        // for (let img of imgs) {
        //     console.log(img.src.startsWith('data:image'));
            
        //     // if (img.src.startsWith('data:image')) {
        //     //     const res = await fetch('/api/upload', {
        //     //         method: 'POST',
        //     //         headers: { 'Content-Type': 'application/json' },
        //     //         body: JSON.stringify({ file: img.src })
        //     //     });

        //     //     const data = await res.json();
        //     //     img.src = data.url;
        //     // }
        // }

        if (text) textValue(text);
    }, [text]);

    return (
        <div className="flex justify-center">
            {insideValue ? (
                <Editor value={insideValue} onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue)} className="w-[800px] h-[300px]" />
            ) : (
                <Editor value={String(text)} onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue)} className="w-[800px] h-[300px]" />
            )}
        </div>
    );
}
