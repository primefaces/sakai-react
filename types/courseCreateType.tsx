export interface CourseCreateType {
    title: string;
    description: string;
    video_url: string;
    image?: string | File;
    created_at?: string | null;
}