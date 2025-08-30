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
    user_id: number;
    current_page?: number;

    // data?: test[];
}
