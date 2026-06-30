export interface mainStepsType {
    connections: any;
    id: number;
    id_parent: number | null;
    type_id: number;
    user_id: number;
    lesson_id: number;
    step: number;
    type: { active: true; created_at: string; id: 1; logo: string; description?: string | null; modelName: string; name: string; title: string; updated_at: string };
    updated_at: string;
    content?: {document: string, document_path: string, description: string | null, title: string, link: string, url: string,cover_url: string | null, content: string, answers: [{text: string, is_correct: boolean, id: number | null}], score: number}
    score?: number | null;
    chills?: boolean;
    count_attempt?: number;
    answer_id?: boolean | null;
    answer_score?: number | null;
}
