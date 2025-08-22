export interface EditableLesson {
        title: string;
        description?: string;
        document?: File | null;
        url?: string | null;
        video_link: string;
        video_type_id: number | null;
    }