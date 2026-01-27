export interface mainStreamsType {
    connect_id: number | null;
    stream_id: number;
    id_curricula: number;
    subject_name: { name_ru: string; id: number };
    subject_type_name: { name_ru: string; short_name_ru: string; id: number };
    teacher: { name: string };
    language: { name: string };
    id_edu_year: number;
    id_period: number;
    semester: { name_ru: string };
    edu_form: { name_ru: string };
    period: { name_ru: string };
    courseValue?: number;
    speciality: { id: number; id_faculty: number, name_ru: string};
    course_id?: number | null;
}
