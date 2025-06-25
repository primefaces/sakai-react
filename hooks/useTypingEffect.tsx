'use client';

import { useEffect, useRef, useState } from 'react';

export default function useTypingEffect(word: string, stop: boolean) {
    const [typedText, setTypedText] = useState('');
    const stopRef = useRef(stop);
    const indexRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        stopRef.current = stop;

        if (!stop) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTypedText('');
            indexRef.current = 0;
            return;
        }

        intervalRef.current = setInterval(() => {
            if (indexRef.current >= word.length) {
                clearInterval(intervalRef.current!);
                return;
            }

            setTypedText((prev) => {
                const nextChar = word[indexRef.current];
                indexRef.current++;
                const nextText = prev + nextChar;

                if (nextText.length > 50) {
                    clearInterval(intervalRef.current!);
                    alert('baby');
                    return '';
                }

                return nextText;
            });
        }, 30);

        return () => clearInterval(intervalRef.current!);
    }, [stop, word]);

    return typedText
}