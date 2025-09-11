'use client';

import AppTopbar from '@/layout/AppTopbar';
import HomeClient from './HomeClient';
import AppFooter from '@/layout/AppFooter';
import { useEffect } from 'react';

export default function BaseLayout() {
    // useEffect(() => {
    //     window.location.href = 'http://oldmooc.oshsu.kg/'; // твоя ссылка
    // }, []);

    // return null; // ничего не показываем

    return (
      <>
        <div className="max-w-[1440px] m-auto flex flex-col min-h-screen">
          <AppTopbar/>
          <main className="flex-1 w-full flex justify-center">
            <HomeClient/>
          </main>
          <AppFooter/>
        </div>
      </>
    );
}
