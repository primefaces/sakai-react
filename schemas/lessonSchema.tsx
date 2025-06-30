import * as yup from 'yup';

export const lessonSchema = yup.object().shape({
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