'use client';

import { OptionsType } from "@/types/OptionsType";
import { useEffect, useState } from "react";

export default function MyDateTime({createdAt, options}: {createdAt: string | null, options: OptionsType}){
    const [result, setResult] = useState<string>('');

    useEffect(()=> {
        if (createdAt) {
            const dateObject = new Date(createdAt);
            if (dateObject) {
                const formattedString = dateObject.toLocaleString('ru-RU', options);
                const forResult = formattedString?.replace(/,/g, '');
                if (formattedString) {
                    setResult(forResult);
                } else {
                    return setResult('----');
                }
            } else {
                return setResult('----');
            }
        } else {
            return setResult('----');
        }
    },[createdAt]);

    return (
        <span>{result}</span>
    );
}
