export interface mainStreamsType {
    connect_id: number | null;
    stream_id: number;
    id_curricula: number;
    subject_name: { name_ru: string; name_kg: string; id: number };
    subject_type_name: { name_ru: string; name_kg: string; short_name_ru: string; id: number };
    teacher: { name: string };
    language: { name: string };
    id_edu_year: number;
    id_period: number;
    semester: { name_ru: string; name_kg: string;  };
    edu_form: { name_ru: string; name_kg: string;  };
    period: { name_ru: string; name_kg: string;  };
    courseValue?: number;
    speciality: { id: number; id_faculty: number, name_ru: string; name_kg: string; };
    course_id?: number | null;
}
