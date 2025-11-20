import { AudenceType } from "./courseTypes/AudenceTypes";
import { lessonStateType } from "./lessonStateType";

export interface test {
    title: string;
    id: number;

    current_page?: number;
    total?: number;
    per_page?: number;
}

export interface myMainCourseType {
    created_at: string;
    id: number;
    image: string;
    status: true;
    title: string;
    description: string | null; 
    user_id: number;
    current_page?: number;
    user:{name:string, last_name:string, father_name: string};
    audience_type: AudenceType;
    is_signed: boolean;

    lessons?: lessonStateType

    // data?: test[];
}
