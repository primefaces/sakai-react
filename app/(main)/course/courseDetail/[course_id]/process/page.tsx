'use client';

import { useParams, useRouter } from 'next/navigation';
import { fetchThemes } from '@/services/courses';
import { useEffect, useState } from 'react';
import LessonView from '@/app/features/LessonView';
import { useLocalization } from '@/layout/context/localizationcontext';

export default function CourseProcess() {
    const { course_id } = useParams();
    const router = useRouter();
    const { language } = useLocalization();

    const [lessonId, setLessonId] = useState<string | null>(null);

    const handleFetchLesson = async () => {
        const data = await fetchThemes(Number(course_id) || null, null)

        if(data && data?.lessons?.data?.length > 0){
            const firstLesson = data?.lessons?.data[0];
            if(firstLesson?.id){
                setLessonId(firstLesson.id);
            } else {
                router.replace(`/course/courseDetail/${course_id}/default?lang=${language}`);
            }
        } else {
            router.replace(`/course/courseDetail/${course_id}/default?lang=${language}`);
        }
    }

    useEffect(()=> {
        handleFetchLesson();
    },[]);

    return (
        <div>
            {lessonId && <LessonView defaultValue={true} defaultLessonId={lessonId}/>}
        </div>
    );
}
