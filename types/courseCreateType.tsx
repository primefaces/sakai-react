export interface CourseCreateType {
    title: string;
    description: string;
    video_url: string;
    image?: string | File;
}