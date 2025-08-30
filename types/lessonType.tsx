export interface lessonType {
    id: number;
    course_id: number | null;
    created_at: string;
    description: string;
    lesson_id: number;
    status: boolean;
    title: string;
    updated_at: string;
    user_id: number;
    document?: string;
    document_path?: string;
    url?: string;
    photo?: string; 
}
