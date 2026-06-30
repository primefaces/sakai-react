export interface mainNotification {
    id: number;
    title: string;
    from_id: number;
    adresed_type_id: number;
    addressed_id: number;
    notification_type_id: number;
    meta: {
        id_curricula: number;
        course_id: number;
        connect_id: number;
        stream_id: number;
        student_id: number;
        lesson_id: number;
        step_id: number;
        title: string;
        description: string;
    };
    redirect_url: string;
    is_view: boolean;
    created_at: string;
    updated_at: string;
    from_user: {
        id: number;
        myedu_id: number;
        name: string;
        last_name: string;
        father_name: string;
        email: string;
        email_verified_at: null;
        is_working: boolean;
        is_student: boolean;
        birth_date: string;
        created_at: string;
        updated_at: string;
    };
    type: {
        id: 1;
        title: string;
        is_redirect: boolean;
        is_view: boolean;
        type: string;
        created_at: string;
        updated_at: string;
    };
}
