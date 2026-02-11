'use client';

import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { CourseType } from '@/types/courseType';
import { fetchCourseInfo } from '@/services/courses';

// Mock data as requested
const mockCourseData = {
    title: 'Введение в веб-разработку: HTML, CSS и JavaScript',
    teacher: {
        name: 'Профессор Андрей Смирнов',
        avatar: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
    },
    lessons: [
        {
            id: 1,
            title: 'Тема 1: Основы HTML',
            content:
                '<p>В этом уроке мы изучим фундаментальные концепции HTML, структуру документа и основные теги для создания веб-страниц.</p><ul><li>Структура HTML-документа</li><li>Основные теги: &lt;h1&gt;, &lt;p&gt;, &lt;a&gt;, &lt;img&gt;</li><li>Создание списков и таблиц</li></ul>'
        },
        {
            id: 2,
            title: 'Тема 2: Стилизация с помощью CSS',
            content:
                '<p>Узнайте, как придавать стиль вашим веб-страницам с помощью каскадных таблиц стилей (CSS). Мы рассмотрим селекторы, свойства и основы адаптивного дизайна.</p><p>Ключевые моменты: селекторы, свойства `color`, `font-size`, `margin`, `padding`, Flexbox.</p>'
        },
        {
            id: 3,
            title: 'Тема 3: Введение в JavaScript',
            content: '<p>Этот урок знакомит с основами JavaScript, делая ваши страницы интерактивными. Вы изучите переменные, типы данных, операторы и функции.</p>'
        },
        {
            id: 4,
            title: 'Тема 4: Продвинутый JavaScript и DOM',
            content: '<p>Погрузитесь глубже в JavaScript, научившись манипулировать объектной моделью документа (DOM) для динамического изменения содержимого и стиля веб-страниц.</p>'
        }
    ]
};

// A simple component to render lesson content safely
const LessonContent = ({ content }: { content: string }) => {
    return <div className="p-4" dangerouslySetInnerHTML={{ __html: content }} />;
};

const StudentCheckPage = ({ params }: { params: { course_id: string; id: string } }) => {
    const [mainSkeleton, mainSetSkeleton] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const [courseShow, setCourseShow] = useState<CourseType | null>(null);

    const { title, teacher, lessons } = mockCourseData;

    // Получаем данные о курсе
    const handleCourseShow = async () => {
        mainSetSkeleton(true);
        const data = await fetchCourseInfo(null);
        if (data?.success) {
            setCourseShow(data?.course);
        }
        mainSetSkeleton(false);
    };

    // Получаем уроки?
    const handle = async () => {
        mainSetSkeleton(true);
        const data = await fetchCourseInfo(null);
        if (data?.success) {
            setCourseShow(data?.course);
        }
        mainSetSkeleton(false);
    };

    // const header = !courseShow && !courseShow?.title ? <h1 className="text-2xl bg-[var(--titleColor)] text-white text-center p-3">{'courseShow?.title'}</h1> : '';

    return (
        <div className="grid">
            <div className="col-12">
                {/* {header} */}
                <div className="card">
                    <h3 className="font-bold text-xl mb-3">Темы Курса</h3>
                    <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index as number | null)}>
                        {lessons.map((lesson) => (
                            <AccordionTab header={`Тема ${lesson.id}: ${lesson.title}`} key={lesson.id} className="w-full p-accordion">
                                <LessonContent content={lesson.content} />
                            </AccordionTab>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default StudentCheckPage;
