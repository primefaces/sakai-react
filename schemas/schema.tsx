import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup.string()
  .email('email туура эмес форматта')
  .required('email талап кылынат!')
  .matches(
      /^[a-zA-Z0-9._%+-]+@oshsu\.kg$/,
      'email "@oshsu.kg" форматында болуш керек'
    )
  .matches(
    /^[a-zA-Z0-9._%+-]+@oshsu\.kg$/, // Стандартный формат email (только буквы, цифры, точки, подчеркивания и плюсы)
    'email "@oshsu.kg" форматында жана тыюу салынган символдор камтылбашы керек'
  )
  ,
  password: yup.string()
  .required('Сырсөз талап кылынат!')
  .max(20, 'Сырсөз эң көп дегенде 20 белгиден турушу керек')
  .matches(
      /^[^!@#$%^&*()_+={}[\]:;"'`<>,.?/\\|]*$/,
      'Сырсөздө тыюу салынган символдор камтылбашы керек'
    ),
  videoReq: yup.string()
  .required('Талап кылынат!')
  .matches(
      /^https?:\/\/.+/,
      'Видео шилтеме  "http://" "https://" форматында болуш керек'
    ),
  usefulLink: yup.string()
  .required('Талап кылынат!')
  .matches(
      /^[^!@#$%^&*()_+={}[\]:;"'`<>,.?/\\|]*$/,
      'Сырсөздө тыюу салынган символдор камтылбашы керек'
    ),
});