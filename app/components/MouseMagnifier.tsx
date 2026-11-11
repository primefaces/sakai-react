'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Текстовая лупа: показывает текст под курсором крупным шрифтом в плашке рядом с курсором.
// Лежит поверх страницы (fixed + pointer-events: none), поэтому вёрстку и клики не затрагивает.

const MAX_TEXT = 180; // длиннее — показываем кусок вокруг курсора
const OFFSET_X = 28; // отступ от курсора (курсор увеличен, поэтому отступ побольше)
const OFFSET_Y = 44;
const EDGE = 12;

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type LensState = { text: string; x: number; y: number } | null;

const getTextNodeAtPoint = (x: number, y: number): { node: Text; offset: number } | null => {
    const doc = document as any;
    let node: Node | null = null;
    let offset = 0;

    if (doc.caretPositionFromPoint) {
        const pos = doc.caretPositionFromPoint(x, y);
        if (pos) {
            node = pos.offsetNode;
            offset = pos.offset;
        }
    } else if (doc.caretRangeFromPoint) {
        const range: Range | null = doc.caretRangeFromPoint(x, y);
        if (range) {
            node = range.startContainer;
            offset = range.startOffset;
        }
    }

    if (!node || node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) return null;

    // caret*FromPoint возвращает ближайший текст даже на пустом месте — проверяем, что курсор реально над текстом
    const range = document.createRange();
    range.selectNodeContents(node);
    const hit = Array.from(range.getClientRects()).some((r) => x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 2 && y <= r.bottom + 2);
    return hit ? { node: node as Text, offset } : null;
};

const clip = (text: string, offset: number) => {
    if (text.length <= MAX_TEXT) return text;
    const half = Math.floor(MAX_TEXT / 2);
    const start = Math.max(0, Math.min(offset - half, text.length - MAX_TEXT));
    const end = start + MAX_TEXT;
    return (start > 0 ? '… ' : '') + text.slice(start, end).trim() + (end < text.length ? ' …' : '');
};

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

const getTextAtPoint = (x: number, y: number, target: Element | null): string => {
    const hit = getTextNodeAtPoint(x, y);
    if (hit) {
        const parent = hit.node.parentElement;
        const parentText = normalize(parent?.innerText || '');
        if (parentText && parentText.length <= MAX_TEXT) return parentText;
        return clip(normalize(hit.node.data), hit.offset);
    }

    // Иконки-кнопки без текста: берём подпись из aria-label / title
    const labelled = target?.closest('[aria-label], [title]');
    const label = labelled?.getAttribute('aria-label') || labelled?.getAttribute('title');
    return label ? normalize(label) : '';
};

const MouseMagnifier = () => {
    const [lens, setLens] = useState<LensState>(null);
    const [mounted, setMounted] = useState(false);
    const lensRef = useRef<HTMLDivElement>(null);
    const frame = useRef<number | null>(null);
    const lastPoint = useRef<{ x: number; y: number; target: Element | null } | null>(null);

    useEffect(() => {
        setMounted(true);
        // На сенсорных экранах курсора нет — лупа не нужна
        if (!window.matchMedia('(pointer: fine)').matches) return;

        const update = () => {
            frame.current = null;
            const p = lastPoint.current;
            if (!p) return;
            const text = getTextAtPoint(p.x, p.y, p.target);
            setLens((prev) => {
                if (!text) return null;
                if (prev && prev.text === text && prev.x === p.x && prev.y === p.y) return prev;
                return { text, x: p.x, y: p.y };
            });
        };

        const schedule = () => {
            if (frame.current === null) frame.current = requestAnimationFrame(update);
        };

        const onMove = (e: MouseEvent) => {
            lastPoint.current = { x: e.clientX, y: e.clientY, target: e.target as Element };
            schedule();
        };

        const onScroll = () => {
            if (!lastPoint.current) return;
            const { x, y } = lastPoint.current;
            lastPoint.current = { x, y, target: document.elementFromPoint(x, y) };
            schedule();
        };

        const hide = () => {
            lastPoint.current = null;
            setLens(null);
        };

        const onLeave = (e: MouseEvent) => {
            if (!e.relatedTarget) hide();
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true, capture: true });
        document.addEventListener('mouseout', onLeave);
        window.addEventListener('blur', hide);
        window.addEventListener('mousedown', hide);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('scroll', onScroll, { capture: true });
            document.removeEventListener('mouseout', onLeave);
            window.removeEventListener('blur', hide);
            window.removeEventListener('mousedown', hide);
            if (frame.current !== null) cancelAnimationFrame(frame.current);
        };
    }, []);

    // Позиция: справа-снизу от курсора, у края экрана — переносим на другую сторону
    useIsoLayoutEffect(() => {
        const el = lensRef.current;
        if (!el || !lens) return;
        const { width, height } = el.getBoundingClientRect();
        let left = lens.x + OFFSET_X;
        let top = lens.y + OFFSET_Y;
        if (left + width > window.innerWidth - EDGE) left = Math.max(EDGE, lens.x - width - EDGE);
        if (top + height > window.innerHeight - EDGE) top = Math.max(EDGE, lens.y - height - EDGE * 2);
        el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    }, [lens]);

    if (!mounted || !lens) return null;

    return createPortal(
        <div ref={lensRef} className="mouse-magnifier" aria-hidden="true">
            {lens.text}
        </div>,
        document.body
    );
};

export default MouseMagnifier;
