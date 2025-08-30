'use client';

import React, { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip'; // Импортируем flipbook
import GroupSkeleton from './skeleton/GroupSkeleton';

// import * as pdfjsLib from "pdfjs-dist";
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import * as pdfjsLib from 'pdfjs-dist';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Указываем путь к файлу mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

export default function PDFViewer({ url }: { url: string }) {
    const [pages, setPages] = useState<React.JSX.Element[]>([]);
    const [skeleton, setSkeleton] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const [bookSize, setBookSize] = useState({ width: 0, height: 0, aspectRatio: 0 });

    const FIXED_BOOK_HEIGHT = 800; // Фиксированная высота книги

    const media = useMediaQuery('(max-width: 640px)');

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
                const viewport = firstPage.getViewport({ scale: 1.5 });
                const aspectRatio = viewport.width / viewport.height;

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const desiredScale = FIXED_BOOK_HEIGHT / page.getViewport({ scale: 1.0 }).height;
                    const viewport = page.getViewport({ scale: desiredScale });

                    // Создаем элемент <canvas>
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    if (!context) {
                        // в последний раз добавил эту строку если что
                        throw new Error('Canvas context is not supported.');
                    }

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    await page.render({
                        canvas, // в последний раз добавил эту строку если что
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
                if (containerRef.current) { // в последний раз добавил эту проверку если что
                    setBookSize({
                        width: containerRef.current.offsetWidth,
                        height: FIXED_BOOK_HEIGHT,
                        aspectRatio: aspectRatio
                    });
                }
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
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const width = Math.min(containerWidth, 1000);
                const height = width / (bookSize.aspectRatio || 1.5); // пример пропорции, или FIXED_BOOK_HEIGHT
                setBookSize({ width, height, aspectRatio: width / height });
            }
        };

        // Вызываем сразу после монтирования
        updateBookSize();

        window.addEventListener('resize', updateBookSize);
        return () => window.removeEventListener('resize', updateBookSize);
    }, [bookSize.aspectRatio]);

    // useEffect(() => {
    //     const updateBookSize = () => {
    //         if (containerRef.current && bookSize.aspectRatio > 0) {
    //             const containerWidth = containerRef.current.offsetWidth;
    //             const bookHeight = containerWidth / bookSize.aspectRatio; // пропорциональная высота

    //             setBookSize((prev) => ({
    //                 ...prev,
    //                 width: containerWidth,
    //                 height: bookHeight
    //             }));
    //         }
    //     };

    //     updateBookSize(); // сразу после монтирования
    //     window.addEventListener('resize', updateBookSize);
    //     return () => window.removeEventListener('resize', updateBookSize);
    // }, [bookSize.aspectRatio]);

    return (
        // <div ref={containerRef} className="">
        <div
            // className="sm-[500px] sm:w-[500px] md:w-[500px] lg:w-[600px] xl:w-[1000px]"
            ref={containerRef}
            className="w-[800px]"
            style={{
                width: '100%', // или фиксированная ширина, например 800px
                maxWidth: '1000px', // не даём контейнеру быть бесконечно широким
                margin: '0 auto'
            }}
        >
            {/* style={{ width: '100%', backgroundColor: 'red', maxWidth: 1000, margin: '0 auto', border: 'solid 1px' }} */}
            {skeleton ? (
                <GroupSkeleton count={1} size={{ width: '100%', height: '20rem' }} />
            ) : // <HTMLFlipBook className="book-container" width={bookSize.width / 2} height={bookSize.height} size="stretch" minWidth={320} maxWidth={1000} minHeight={300} maxHeight={600} showCover={false} flippingTime={1000} usePortrait={true}>
            //     {pages.map((page, index) => (
            //         <div key={index} className="page">
            //             <div className="page-content">
            //                 {' '}
            //                 {/* Добавляем класс для содержимого страницы */}
            //                 {page}
            //             </div>
            //         </div>
            //     ))}
            // </HTMLFlipBook>
            media ? (
                <>
                    <HTMLFlipBook
                        // width={Math.min(bookSize.width, 600)} // ограничиваем ширину страницы
                        width={300} // ограничиваем ширину страницы
                        height={bookSize.height}
                        size="stretch"
                        minWidth={320}
                        maxWidth={600} // ограничиваем maxWidth для PageFlip
                        minHeight={420}
                        maxHeight={bookSize.height}
                        showCover={false}
                        usePortrait={true}
                        // news
                        startZIndex={0}
                        autoSize={true}
                        maxShadowOpacity={0.5}
                        mobileScrollSupport={true}
                        swipeDistance={30}
                        clickEventForward={true}
                        useMouseEvents={true}
                        renderOnlyPageLengthChange={false}
                        className=""
                        style={{}}
                        onFlip={() => {}}
                        onChangeOrientation={() => {}}
                        onChangeState={() => {}}
                        onInit={() => {}}
                        onUpdate={() => {}}
                        startPage={0}
                        drawShadow={true}
                        flippingTime={900}
                        showPageCorners={true}
                        disableFlipByClick={false}
                    >
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
                </>
            ) : (
                <HTMLFlipBook
                    // width={Math.min(bookSize.width, 600)} // ограничиваем ширину страницы
                    width={Math.min(bookSize.width, 1000)} // ограничиваем ширину страницы
                    height={bookSize.height}
                    size="stretch"
                    minWidth={media ? 320 : 600}
                    maxWidth={600} // ограничиваем maxWidth для PageFlip
                    minHeight={420}
                    maxHeight={bookSize.height}
                    showCover={false}
                    usePortrait={true}
                    // news
                    startZIndex={0}
                    autoSize={true}
                    maxShadowOpacity={0.5}
                    mobileScrollSupport={true}
                    swipeDistance={30}
                    clickEventForward={true}
                    useMouseEvents={true}
                    renderOnlyPageLengthChange={false}
                    className=""
                    style={{}}
                    onFlip={() => {}}
                    onChangeOrientation={() => {}}
                    onChangeState={() => {}}
                    onInit={() => {}}
                    onUpdate={() => {}}
                    startPage={0}
                    drawShadow={true}
                    flippingTime={900}
                    showPageCorners={true}
                    disableFlipByClick={false}
                >
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
        // </div>
    );
}
