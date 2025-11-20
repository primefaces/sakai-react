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
    steps: { id: number; chills: boolean; type: { name: string; logo: string, title: string }; content: { id:number; title: string; description: string; url: string; document: string; document_path: string, link: string }; lesson_id: number; id_parent?: number | null; score: number, ListAnswer: any, is_opened?: boolean }[]
    isLoadingSteps:boolean;
    document?: string;
    document_path?: string;
    url?: string;
    cover_url?: string; 
    link?:string;
    is_opened?: boolean
}
