import * as yup from 'yup';

export const lessonSchema = yup.object().shape({
    videoReq: yup
        .string()
        .required('Талап кылынат!')
        .matches(/^https?:\/\/.+/, 'Видео шилтеме  "http://" "https://" форматында болуш керек'),
    usefulLink: yup
        .string()
        .required('Талап кылынат!')
        .matches(/^https?:\/\/.+/, 'Шилтеме "http://" "https://" форматында болуш керек'),
    title: yup.string().required('Талап кылынат!').max(30, 'Аталыштын узундугу макс 30 тамга')
});