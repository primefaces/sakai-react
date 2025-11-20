interface answerListType {
    connect_id: number;
    answer: {
        answer_id: number | null;
        chills: boolean;
        count_attempt: number | null;
        course_id: number;
        created_at: string;
        file: string;
        id: number;
        id_curricula: number;
        id_parent: number;
        id_stream: number;
        lesson_id: number;
        score: number | null;
        steps_id: number;
        time: number | null;
        type_id: number;
        updated_at: string;
        user_id: number;

        student?: {
            father_name: string;
            id: number;
            last_name: string;
            myedu_id: number;
            name: string;
        };
    };
}
