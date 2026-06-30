import { myMainCourseType } from "../myMainCourseType";

export interface PaginationType {
    title: string;
    id: number;
    data: myMainCourseType;
    current_page: number;
    total: number;
    per_page: number;
}
