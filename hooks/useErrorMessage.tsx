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
                    value: { severity: 'error', summary: 'Ошибка', detail: 'Запрос не корректен' }
                });
                break;

            case 403:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка', detail: 'Нет доступа' }
                });
                break;

            case 409:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка', detail: 'Конфликт данных' }
                });
                break;

            case 422:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка валидации. Проверьте введенные данные' }
                });
                break;

            case 500:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка сервера. Попробуйте позже' }
                });
                break;

            case 503:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка', detail: 'Сервер временно недоступен' }
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
