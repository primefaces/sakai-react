import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup.string()
  .email('Неправильный формат email')
  .required('email требуется!')
  // .matches(
  //     /^[a-zA-Z0-9._%+-]+@oshsu\.kg$/,
  //     'email "@oshsu.kg" форматында болуш керек'
  //   )
  ,
  password: yup.string()
  .required('Пароль требуется!')
  // .max(20, 'Максимальная длина пароля 20 символов')
  // .matches(
  //     /^[^!@#$%^&*()_+={}[\]:;"'`<>,.?/\\|]*$/,
  //     'Сырсөздө тыюу салынган символдор камтылбашы керек'
  //   ),
});