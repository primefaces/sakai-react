import { LangType } from "../language/LangType";
import { myMainCourseType } from "../myMainCourseType";
import { ProgressType } from "../progress/ProgressType";
import { ScoreType } from "./ScoreType";

export interface CourseCategoryOption extends myMainCourseType, Partial<ScoreType>, Partial<ProgressType> {
    category: { title: string, id: number | null, description: string | null, },
    is_featured: boolean
    language: LangType
}