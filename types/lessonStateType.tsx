export interface lessonStateType {
    course_id: number;
    id:number;
    title: string;
    description: string | null;
    file: File | null;
    url: string | null;
    video_link: string | null;
    cover?: File | null;
    is_published: true;
    published_at: null;
    sequence_number: 0;
}
