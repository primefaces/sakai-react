import { localizationData, type Language } from '@/layout/context/localizationcontext';

type ConfirmDialogOptions = {
    message: string;
    header?: string;
    icon?: string;
    defaultFocus?: 'accept' | 'reject';
    accept?: () => void;
    reject?: () => void;
    acceptLabel?: string;
    rejectLabel?: string;
    acceptClassName?: string;
    rejectClassName?: string;
};

const resolveLanguage = (): Language => {
    if (typeof window !== 'undefined') {
        const storedLanguage = localStorage.getItem('language') as Language | null;
        if (storedLanguage === 'ru' || storedLanguage === 'ky') {
            return storedLanguage;
        }
    }
    return 'ru';
};

export const getConfirmOptions = (id: number, onDelete: (id: number) => void): ConfirmDialogOptions => {
    const translations = localizationData[resolveLanguage()];

    return {
        message: translations.confirmDeleteMessage,
        header: translations.deleteHeader,
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger trash-button',
        acceptLabel: translations.delete,
        rejectLabel: translations.back,
        rejectClassName: 'p-button-secondary reject-button',
        accept: () => onDelete(id)
    };
};
