export interface testType {
    answers: { id: number | null; text: string; is_correct: boolean }[];
    id: number | null;
    content: string;
    score: number;
    image: string | null;
    title: string;
    created_at: string;
}
