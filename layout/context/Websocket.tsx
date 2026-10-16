'use client';

import { ChildContainerProps } from '@/types';
import { createContext, useContext, useEffect } from 'react';
export const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }: ChildContainerProps) {
    // Здесь будет логика сокета

    useEffect(() => {
        const socket = new WebSocket('wss://example.com/ws');

        socket.onopen = () => console.log('✅ Соединение установлено');
        socket.onclose = () => console.log('❌ Соединение закрыто');
        socket.onerror = (err) => console.error('Ошибка сокета:', err);

        // Возвращаем функцию очистки
        return () => {
            socket.close();
        };
    }, []);

    return <WebSocketContext.Provider value={null}>{children}</WebSocketContext.Provider>;
}
