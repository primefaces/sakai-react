'use client';

import React, { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip'; // Импортируем flipbook
import GroupSkeleton from './skeleton/GroupSkeleton';

// import * as pdfjsLib from "pdfjs-dist";
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import * as pdfjsLib from 'pdfjs-dist';

// Указываем путь к файлу mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

export default function PDFViewer({ url }: { url: string }) {
    const [pages, setPages] = useState([]);
    const [skeleton, setSkeleton] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const [bookSize, setBookSize] = useState({ width: 0, height: 0, aspectRatio: 0 });

    const FIXED_BOOK_HEIGHT = 800; // Фиксированная высота книги

    useEffect(() => {
        const renderPDF = async () => {
            if (!url) return;

            setSkeleton(true);
            try {
                // Проверяем, одна ли страница в документе

                const newUrl = `http://api.mooc.oshsu.kg/temprory-file/${url}`;
                const pdf = await pdfjsLib.getDocument(newUrl).promise;
                const tempPages = [];
                const firstPage = await pdf.getPage(1);

                // Получаем оригинальное соотношение сторон первой страницы
                const viewport = firstPage.getViewport({ scale: 1.0 });
                const aspectRatio = viewport.width / viewport.height;

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const desiredScale = FIXED_BOOK_HEIGHT / page.getViewport({ scale: 1.0 }).height;
                    const viewport = page.getViewport({ scale: desiredScale });

                    // Создаем элемент <canvas>
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    await page.render({
                        canvasContext: context,
                        viewport
                    }).promise;

                    // Превращаем canvas в изображение (Data URL) и добавляем в массив
                    const imageDataUrl = canvas.toDataURL();
                    tempPages.push(
                        <div key={i} className="page">
                            <img src={imageDataUrl} alt={`Page ${i}`} style={{ width: '100%', height: 'auto' }} />
                        </div>
                    );
                }

                // Обновляем состояние с данными только после успешной загрузки
                setPages(tempPages);
                setBookSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetWidth,
                    aspectRatio: aspectRatio
                });
                setSkeleton(false);
            } catch (error) {
                console.error('Ошибка при загрузке или рендеринге PDF:', error);
            } finally {
                setSkeleton(false);
            }
        };

        renderPDF();
    }, [url]);

    useEffect(() => {
        const updateBookSize = () => {
            if (containerRef.current && bookSize.aspectRatio > 0) {
                const containerWidth = containerRef.current.offsetWidth;
                const bookHeight = containerWidth;

                setBookSize((prev) => ({
                    ...prev,
                    width: containerWidth,
                    height: bookHeight
                }));
            }
        };
        // Вызываем один раз сразу после монтирования, чтобы получить начальные размеры
        if (containerRef.current && bookSize.aspectRatio > 0) {
            updateBookSize();
        }

        window.addEventListener('resize', updateBookSize);
        return () => window.removeEventListener('resize', updateBookSize);
    }, [bookSize.aspectRatio]); // Зависит от соотношения сторон

    // if (isSinglePage) {
    //     return (
    //         <div
    //             style={{
    //                 width: `${FIXED_BOOK_WIDTH}px`,
    //                 height: `${300}px`,
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 border: '1px solid #ccc',
    //                 borderRadius: '5px',
    //                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    //             }}
    //         >
    //             {pages[0]}
    //         </div>
    //     );
    // }

    return (
        <div ref={containerRef} className="">
            <div
                className="sm-[500px] sm:w-[500px] md:w-[500px] lg:w-[600px] xl:w-[1000px]"
                style={{
                    height: `${bookSize.height}px`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'start'
                }}
            >
                {/* style={{ width: '100%', backgroundColor: 'red', maxWidth: 1000, margin: '0 auto', border: 'solid 1px' }} */}
                {skeleton ? (
                    <GroupSkeleton count={1} size={{ width: '100%', height: '20rem' }} />
                ) : (
                    <HTMLFlipBook className="book-container" width={bookSize.width / 2} height={bookSize.height} size="stretch" minWidth={320} maxWidth={1000} minHeight={300} maxHeight={600} showCover={false} flippingTime={1000}>
                        {pages.map((page, index) => (
                            <div key={index} className="page">
                                <div className="page-content">
                                    {' '}
                                    {/* Добавляем класс для содержимого страницы */}
                                    {page}
                                </div>
                            </div>
                        ))}
                    </HTMLFlipBook>
                )}
            </div>
        </div>
    );
}
