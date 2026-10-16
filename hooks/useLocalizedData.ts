import { useLocalization } from '@/layout/context/localizationcontext';

export const useLocalizedData = () => {
    const { language } = useLocalization();

    const getLocalized = (item: any, key: string) => {
        if (!item) return '';

        const langKey = language === 'ky' ? `${key}_kg` : `${key}_ru`;

        if (item[langKey]) {
            return item[langKey];
        }

        if (item[key]) {
            return item[key];
        }

        return '';
    };

    return { getLocalized };
};
