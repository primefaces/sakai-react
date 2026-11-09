import * as yup from 'yup';

export const lessonSchema = yup.object().shape({
    videoReq: yup
        .string()
        .required('Требуется!')
        .matches(/^https?:\/\/.+/, 'Формат видео ссылки "http://" "https://"')
        .max(200, 'Максимальная длина 200 символов'),
    usefulLink: yup
        .string()
        .required('Требуется!')
        .matches(/^https?:\/\/.+/, 'Формат ссылки "http://" "https://"')
        .max(200, 'Максимальная длина 200 символов'),
    usefulLinkNotReq: yup
        .string()
        .matches(/^https?:\/\/.+/, 'Формат ссылки "http://" "https://"'),
    title: yup.string().required('Требуется!')
    // .max(50, 'Аталыштын узундугу макс 50 тамга')
});