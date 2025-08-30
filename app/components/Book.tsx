'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import React, { useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

export default function Book() {
    console.log('hi');

    const media = useMediaQuery('(max-width: 640px)');

    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => setWindowWidth(window.innerWidth);
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Определяем ширину книги и количество страниц на разворот
    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;

    const bookWidth = isMobile ? 300 : isTablet ? 400 : 600;
    const bookHeight = 500;

    return (
    <div style={{ width: "100%", maxWidth: 800, margin: "0 auto", border: 'solid 1px' }}>
      <HTMLFlipBook
        width={bookWidth}
        height={bookHeight}
        size="stretch"
        minWidth={200}
        maxWidth={800}
        minHeight={300}
        maxHeight={600}
        drawShadow={true}
        flippingTime={700}
        showCover={true}
        className="demoBook"
      >
        <div className="page">
          <h2>Страница 1</h2>
          <p>Тестовая страница книги</p>
        </div>
        <div className="page">
          <h2>Страница 2</h2>
          <p>Ещё одна страница</p>
        </div>
        <div className="page">
          <h2>Страница 3</h2>
          <p>Можно вставлять и картинки</p>
          <img src="/test.jpg" alt="demo" width="100%" />
        </div>
        <div className="page">
          <h2>Страница 4</h2>
          <p>Конец теста 👌</p>
        </div>
      </HTMLFlipBook>
    </div>
  );
}
