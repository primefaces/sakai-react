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
                    value: { severity: 'error', summary: 'Некорректный запрос!', detail: 'Пожалуйста, проверьте введённые данные' }
                });
                break;

            case 403:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка!', detail: 'У вас нет прав для выполнения этого действия' }
                });
                break;

            case 409:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Конфликт данных!', detail: 'Возможно, ресурс уже существует или был изменён' }
                });
                break;

            case 422:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка!', detail: 'Данные не прошли проверку. Проверьте правильность заполнения формы.' }
                });
                break;

            case 500:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка!', detail: 'На сервере произошла ошибка' }
                });
                break;

            case 503:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка!', detail: 'Сервис временно недоступен. Попробуйте позже' }
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
