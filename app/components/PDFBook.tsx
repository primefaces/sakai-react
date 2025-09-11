'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip'; // Импортируем flipbook
import GroupSkeleton from './skeleton/GroupSkeleton';

// import * as pdfjsLib from "pdfjs-dist";
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import * as pdfjsLib from 'pdfjs-dist';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { NotFound } from './NotFound';

// Указываем путь к файлу mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

export default function PDFViewer({ url }: { url: string }) {
    const { setMessage } = useContext(LayoutContext);

    const [pages, setPages] = useState<React.JSX.Element[]>([]);
    const [skeleton, setSkeleton] = useState(false);
    const [hasPdf, setHasPdf] = useState(false);

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

                const newUrl = `https://api.mooc.oshsu.kg/temprory-file/${url}`;
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
                        setHasPdf(true);
                        setMessage({
                            state: true,
                            value: { severity: 'error', summary: 'Ошибка', detail: 'Документти жүктөө же көрсөтүү катасы' }
                        });
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
                if (containerRef.current) {
                    // в последний раз добавил эту проверку если что
                    setBookSize({
                        width: containerRef.current.offsetWidth,
                        height: FIXED_BOOK_HEIGHT,
                        aspectRatio: aspectRatio
                    });
                    setHasPdf(false);
                }
                setSkeleton(false);
            } catch (error) {
                console.error('Ошибка при загрузке или рендеринге PDF:', error);
                setHasPdf(true);
                setSkeleton(false);
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка', detail: 'Документти жүктөө же көрсөтүү катасы' }
                });
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
        updateBookSize();
        window.addEventListener('resize', updateBookSize);
        return () => window.removeEventListener('resize', updateBookSize);
    }, [bookSize.aspectRatio]);

    return (
        <div
            ref={containerRef}
            className="w-[800px]"
            style={{
                width: '100%', // или фиксированная ширина, например 800px
                maxWidth: '1000px', // не даём контейнеру быть бесконечно широким
                margin: '0 auto'
            }}
        >
            {hasPdf ? (
                <NotFound titleMessage={'Кийинчерээк кайра аракет кылыңыз'} />
            ) : (
                <>
                    {skeleton ? (
                        <div className='w-[300px] sm:w-[800px]'>
                            <GroupSkeleton count={1} size={{ width: '100%', height: '20rem' }} />
                        </div>
                    ) : media ? (
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
                </>
            )}
        </div>
        // </div>
    );
}
