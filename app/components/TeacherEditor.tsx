'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'; // Import Dialog
import { PrimeIcons } from 'primereact/api';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import LessonCard from '@/app/components/cards/LessonCard';
import { InputText } from 'primereact/inputtext';
import { faSquareRootVariable } from '@fortawesome/free-solid-svg-icons'; // Import PrimeIcons

export default function TeacherEditor({state, onSave, defaultValueProp}: {state: boolean, onSave: (text: string) => void, defaultValueProp: string | null}) {
    const MATH_TEMPLATES = [
        { label: 'Формула в тексте', before: '$', after: '$' },
        { label: 'Блок формулы', before: '$$\n', after: '\n$$' },
        { label: 'Дробь', before: '\\frac{', after: '}{}' },
        { label: 'Корень √', before: '\\sqrt{', after: '}' },
        { label: 'Корень ³√', before: '\\sqrt[3]{', after: '}' },
        { label: 'Степень x²', before: '^', after: '' },
        { label: 'Не равно (≠)', before: '\\neq ', after: '' },
        { label: 'Приближенно (≈)', before: '\\approx ', after: '' },
    ];

    const parseText = (html: any) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const defaultValue = defaultValueProp ? parseText(defaultValueProp) : '### Пример задание №1\nНайдите корни уравнения: $$x^2 - 5x + 6 = 0$$\n\n*Подсказка: используйте формулу дискриминанта $D = b^2 - 4ac$.*';

    // Начальный текст-пример для преподавателя
    const [text, setText] = useState<string>(defaultValue);
    const [isSaving, setIsSaving] = useState(false);
    const [displayDialog, setDisplayDialog] = useState(false); // State for Dialog visibility
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Функция для быстрой вставки формул по кнопкам
    const insertTemplate = (before: string, after: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value;

        const selectedText = currentText.substring(start, end);
        const replacement = before + selectedText + after;

        const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

        setText(newText);

        // Возвращаем фокус на поле ввода
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 10);
    };

    const katex_info = (
        <div className="space-y-6 text-sm text-gray-800">
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                    Правила написания формул
                </h2>

                <ul className="list-disc pl-5 space-y-1">
                    <li>
                        Формулы писать только внутри <code>$...$</code> или <code>$$...$$</code>
                    </li>

                    <li>
                        Обычный текст и определения писать вне знаков доллара
                    </li>

                    <li>
                        Каждую формулу писать отдельно
                    </li>

                    <li>
                        Нельзя писать несколько формул внутри одного <code>$...$</code>
                    </li>
                </ul>
            </div>

            <div className="space-y-3">
                <h2 className="text-lg font-semibold">
                    Примеры
                </h2>

                <div className="rounded-xl border p-3 space-y-3 bg-gray-50">
                    <div>
                        <small className="">Приблизительно равно</small>

                        <div className="grid grid-cols-2 justify-content-between items-center gap-2 mt-1">
                            <code className="bg-white p-2 rounded border">
                                $x \approx y$
                            </code>

                            <div>
                                x≈y
                            </div>
                        </div>
                    </div>

                    <div>
                        <small className="">Дробь</small>

                        <div className="grid grid-cols-2 justify-content-between items-center gap-2 mt-1">
                            <code className="bg-white p-2 rounded border">
                                $\frac{"{3}"}{"{2}"}$
                            </code>

                            <div>
                                3/2
                            </div>
                        </div>
                    </div>

                    <div>
                        <small className="">Квадратный корень</small>

                        <div className="grid grid-cols-2 justify-content-between items-center gap-2 mt-1">
                            <code className="bg-white p-2 rounded border">
                                $\sqrt{"{3}"}$
                            </code>

                            <div>
                                √3
                            </div>
                        </div>
                    </div>

                    <div>
                        <small className="">Корень с индексом</small>

                        <div className="grid grid-cols-2 justify-content-between items-center gap-2 mt-1">
                            <code className="bg-white p-2 rounded border">
                                $\sqrt[2]{"{4}"}$
                            </code>

                            <div>
                                √4
                            </div>
                        </div>
                    </div>

                    <div>
                        <small className="">Степень</small>

                        <div className="grid grid-cols-2 justify-content-between items-center gap-2 mt-1">
                            <code className="bg-white p-2 rounded border">
                                $x^3$
                            </code>

                            <div>
                                x³
                            </div>
                        </div>
                    </div>

                    <div>
                        <small className="">Не равно</small>

                        <div className="grid grid-cols-2 justify-content-between items-center gap-2 mt-1">
                            <code className="bg-white p-2 rounded border">
                                $4 \neq 5$
                            </code>

                            <div>
                                4≠5
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <span className="text-lg font-semibold text-[red]">
                    Неправильно
                </span>

                <code className="block bg-red-50 border border-red-200 p-3 rounded">
                    $x^2 y^2 \frac{"{1}"}{"{2}"}$
                </code>

                <p>
                    Несколько формул внутри одного блока
                </p>
            </div>

            <div className="space-y-2">
                <span className="text-lg font-semibold text-[green]">
                    Правильно
                </span>

                <code className="block bg-green-50 border border-green-200 p-3 rounded">
                    $x^2$ $y^2$ $\frac{"{1}"}{"{2}"}$
                </code>

                <p>
                    Каждая формула отдельно
                </p>
            </div>
        </div>
    );

    useEffect(() => {
        if(!state) {
            onSave(text);
        }
    }, [text]);

    return (
        <div className="w-full bg-white rounded-xl">
            {/* Панель быстрых кнопок-шаблонов */}
            <div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center mb-2 px-1"> {/* Flex container for icon and span */}
                    <i
                        className={`${PrimeIcons.INFO_CIRCLE} text-gray-400 cursor-pointer mr-2`}
                        onClick={() => setDisplayDialog(true)}
                    ></i>
                    <span className="text-xs font-semibold text-gray-400 uppercase w-full">Формулы:</span>
                </div>
                <div className={'flex flex-wrap gap-1 sm:gap-2 md:justify-center'}>
                    {MATH_TEMPLATES.map((tmpl, idx) => (
                        <button key={idx} type="button" onClick={() => insertTemplate(tmpl.before, tmpl.after)} className="cursor-pointer px-3 bg-[var(--amberColor)] hover:opacity-50 border rounded text-white text-sm font-medium">
                            {tmpl.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Две колонки: Редактор и Предпросмотр */}
            <div className="flex flex-col gap-3 items-center">
                {/* Левая колонка: Ввод */}
                <div className="w-full flex flex-col gap-2">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-[240px] p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50"
                        placeholder="Пишите текст задания здесь..."
                    />
                </div>

                {/* Правая колонка: Живой рендеринг */}
                <div className="w-full flex flex-col border border-dashed border-gray-300 rounded-lg p-3 bg-white overflow-y-auto h-[300px]">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block border-b pb-1">Как это увидит студент:</span>
                    {/* Стили prose помогут сделать стандартные отступы для тегов Markdown */}
                    <div className="prose max-w-none text-gray-800">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {text}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
            {
                state ? <div className={'w-full flex gap-1 justify-center items-center mt-2'}>
                    <Button
                        // label={translations.save}
                        label="Сохранить"
                        disabled={isSaving}
                        onClick={() => {
                            onSave(text);
                        }}
                    />
                </div> : ''
            }

            {/* PrimeReact Dialog */}
            <Dialog header="Информация по формулам" visible={displayDialog} onHide={() => setDisplayDialog(false)} className={'max-w-[90%]'}>
                {katex_info}
            </Dialog>
        </div>
    );
}
