'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { useContext } from 'react';
import { useLocalization } from '@/layout/context/localizationcontext';

export default function useErrorMessage() {
    const { setMessage } = useContext(LayoutContext);
    const { translations } = useLocalization();

    return (code: number | null) => {
        switch (code) {
            case 400:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.noCorrectQuery, detail: translations.pleaceRepeat }
                });
                break;

            case 403:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.errorTitle + '!', detail: translations.accessError }
                });
                break;

            case 409:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.dataConflict, detail: translations.resourseAllreadyExist}
                });
                break;

            case 422:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.errorTitle + '!', detail: translations.dataNotValid }
                });
                break;

            case 500:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.errorTitle + '!', detail: translations.serverError }
                });
                break;

            case 503:
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: translations.errorTitle + '!', detail: translations.serviceNoAvialable }
                });
                break;
        }

    };
}
