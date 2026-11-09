import * as yup from 'yup';

export const baseSchema = yup.object().shape({
    title: yup
        .string()
        .required('Требуется!')
        .max(20, 'Максимальная длина 20 символов')
});
