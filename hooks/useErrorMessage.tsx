'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { useContext } from 'react';

export default function useErrorMessage() {
    const { setMessage } = useContext(LayoutContext);

    return (code: number | null) => {
        console.log('Код ошибки ', code);

        switch (code) {
            case 400:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Катаа!', detail: 'Суроо туура эмес' }
                });
                break;

            case 403:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Катаа!', detail: 'Кирүү укугу жок' }
                });
                break;

            case 409:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Катаа!', detail: 'Маалыматтарда карама-каршылык бар' }
                });
                break;

            case 422:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Катаа!', detail: 'Текшерүү катасы. Киргизилген маалыматтарды текшериңиз' }
                });
                break;

            case 500:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Катаа!', detail: 'Сервер катасы. Кийинчерээк кайра аракет кылыңыз' }
                });
                break;

            case 503:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Катаа!', detail: 'Сервер убактылуу жеткиликсиз' }
                });
                break;

            // default:
            //     setMessage({
            //         state: true,
            //         value: { severity: 'error', summary: 'Ошибка', detail: 'Попробуйте позже' }
            //     });
        }

    };
}
