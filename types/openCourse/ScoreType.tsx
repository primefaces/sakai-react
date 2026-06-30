export interface ScoreType {
    max_score: {
        course_id: number,
        course_title: string,
        total_score: number
    },
    total_score: number | null
}