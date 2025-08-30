import * as yup from 'yup';

export const baseSchema = yup.object().shape({
    title: yup
        .string()
        .required('Талап кылынат!')
        .max(20, 'Аталыштын узундугу макс 20 тамга')
});
