'use client';

import { lessonSchema } from '@/schemas/lessonSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NotFound } from '../NotFound';
import LessonCard from '../cards/LessonCard';
import { addTest, deleteTest, fetchElement, generateDoc, generateQuiz, stepSequenceUpdate, updateTest } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import FormModal from '../popUp/FormModal';
import { InputTextarea } from 'primereact/inputtextarea';
import { testType } from '@/types/testType';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { FileUpload } from 'primereact/fileupload';

export default function LessonTest({
    preparation,
    docPreparationTrue,
    docPreparationFalse,
    aiTestStat,
    docGenerageState,
    aiTestSet,
    forAiTestId,
    aiTestSteps,
    element,
    content,
    fetchPropElement,
    fetchPropThemes,
    clearProp
}: {
    preparation: () => void;
    docPreparationTrue: () => void;
    docPreparationFalse: () => void;
    aiTestStat: boolean;
    docGenerageState: boolean;
    aiTestSet: () => void;
    forAiTestId: number | string;
    aiTestSteps: mainStepsType[];
    element: mainStepsType;
    content: any;
    fetchPropElement: (id: number) => void;
    fetchPropThemes: () => void;
    clearProp: boolean;
}) {
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);
    const media = useMediaQuery('(max-width: 640px)');
    const fileUploadRef = useRef<FileUpload>(null);

    const [editingLesson, setEditingLesson] = useState<{ title: string; score: number; stepPos?: number } | null>({ title: '', score: 0 });
    const [visible, setVisisble] = useState(false);
    const [contentShow, setContentShow] = useState(false);
    // doc
    const [answer, setAnswer] = useState<{ id: number | null; text: string; is_correct: boolean }[]>([
        { text: '', is_correct: false, id: null },
        { text: '', is_correct: false, id: null }
    ]);
    const [test, setTests] = useState<testType>({ answers: [{ id: null, text: '', is_correct: false }], id: null, content: '', score: 0, image: null, title: '', created_at: '' });
    const [aiOptions, setAiOptions] = useState<testType[]>([]);
    const [docOptions, setdocOptions] = useState<testType[]>([]);
    const [testValue, setTestValue] = useState<{ title: string; score: number; aiCreate: boolean, isDoc: boolean }>({ title: '', score: 0, aiCreate: false, isDoc: false });
    const [testShow, setTestShow] = useState<boolean>(false);
    const [myFile, setMyFile] = useState<File | null>(null);

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [testChecked, setTestChecked] = useState<{ idx: null | number; check: boolean }>({ idx: null, check: false });
    const [selectId, setSelectId] = useState<number | null>(null);
    const [skeleton, setSkeleton] = useState(false);

    const clearValues = () => {
        setTestValue({ title: '', score: 0, aiCreate: false , isDoc: false});
        setAnswer([
            { text: '', is_correct: false, id: null },
            { text: '', is_correct: false, id: null }
        ]);
        setEditingLesson(null);
        setSelectId(null);
    };

    // validate
    const {
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(lessonSchema),
        mode: 'onChange'
    });

    const selectedForEditing = (id: number) => {
        setSelectId(id);
        setVisisble(true);
        editing();
    };

    const editing = async () => {
        const data = await fetchElement(element.lesson_id, element.id);
        if (data.success) {
            setEditingLesson({ title: data.content.content, score: data.content.score, stepPos: data?.step?.step });
            if (data.content.answers && Array.isArray(data.content.answers)) {
                setAnswer(data.content.answers);
            }
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleAddTest = async () => {
        setProgressSpinner(true);
        const data = await addTest(answer, testValue.title, element?.lesson_id && Number(element?.lesson_id), element.type.id, element.id, testValue.score, testValue?.aiCreate, testValue?.isDoc);
        if (data?.success) {
            fetchPropElement(element.id);
            fetchPropThemes();
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setTestValue({ title: '', score: 0, aiCreate: false, isDoc: false });
            setEditingLesson(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при добавлении!', detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setProgressSpinner(false);
    };

    const addOption = () => {
        setAnswer((prev) => [...prev, { text: '', is_correct: false, id: null }]);
    };

    const deleteOption = (index: number) => {
        setAnswer((prev) => prev.filter((_, i) => i !== index));
        if (index === testChecked.idx) {
            setTestChecked({ idx: null, check: false });
        }
    };

    // update test
    const handleUpdateTest = async () => {
        setSkeleton(true);
        const data = await updateTest(answer, editingLesson?.title || '', element.lesson_id, Number(selectId), element.type.id, element.id, editingLesson?.score || 0);
        const steps: { id: number; step: number | null }[] = [{ id: element?.id, step: editingLesson?.stepPos || 0 }];
        const secuence = await stepSequenceUpdate(content?.lesson_id ? Number(content?.lesson_id) : null, steps);

        if (data?.success && secuence.success) {
            setSkeleton(false);
            fetchPropElement(element.id);
            fetchPropThemes();
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно изменено!', detail: '' }
            });
        } else {
            setSkeleton(false);
            // setDocValue({ title: '', description: '', file: null });
            setEditingLesson(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при изменении!', detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    // delete document
    const handleDeleteTest = async (id: number) => {
        const data = await deleteTest(element.lesson_id, id, element.type.id, element.id);
        if (data.success) {
            clearValues();
            fetchPropElement(element.id);
            fetchPropThemes();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно удалено!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при удалении!', detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    const handleDrop = async () => {
        setProgressSpinner(true);
        console.log('Был перетащен элемент с id:', forAiTestId);
        const data = await generateQuiz(element?.lesson_id && Number(element?.lesson_id), forAiTestId);
        console.log(data);
        
        if (data.status === 'success') {
            setProgressSpinner(false);
            setAiOptions(data?.quiz?.questions);
        } else {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleDocGenerate = async () => {
        setProgressSpinner(true);
        const data = await generateDoc(myFile);
        console.log(data);

        if (data?.questions) {
            console.warn('he he');
            setProgressSpinner(false);
            setdocOptions(data?.questions);
        } else {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const aiOptionsSection = (param: 'doc' | 'ai') => {
        const arr = param === 'ai' ? aiOptions : docOptions;
        if (arr?.length < 1) {
            return <b>Результатов нет, повторите позже</b>;
        }

        return (
            <div className="w-full flex flex-col gap-2">
                <h3 className="text-lg text-center">Выберите один тест для дальнейшей работы</h3>
                {arr?.map((item) => {
                    return (
                        <div key={item?.id} className="w-full lesson-card-border shadow rounded p-2">
                            <div className="flex items-start justify-between gap-2">
                                <b className="text-[14px] sm:text-[16px]">{item?.content}</b>
                                <div className="flex items-center justify-start gap-1">
                                    <span className="text-[var(--mainColor)]">Балл: </span>
                                    <b className="text-[16px]">{`${item?.score}`}</b>
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-1">
                                {item?.answers?.map((opt) => {
                                    return (
                                        <div key={opt?.id}>
                                            <label className="custom-radio opacity-[60%]">
                                                <input disabled type="radio" checked={opt.is_correct} />
                                                <span className="radio-mark min-w-[18px]"></span>
                                                <span>{opt?.text}</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    label="Выбрать и редактировать"
                                    size="small"
                                    className="text-sm"
                                    onClick={() => {
                                        setTestValue((prev) => ({ ...prev, title: item?.content, score: item?.score, aiCreate: param === 'ai' ? true : false, isDoc: param === 'doc' ? true : false }));
                                        setAnswer(item.answers);
                                        const correctIndex = item.answers?.findIndex((answer) => answer?.is_correct);

                                        if (correctIndex !== -1) {
                                            // findIndex возвращает -1, если элемент не найден
                                            setTestChecked({ check: true, idx: correctIndex });
                                        }
                                        aiTestSet();
                                        docPreparationFalse();
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const optionAddBtn = answer.length > 2 && answer[answer.length - 1].text.length < 1;
    const testSection = () => {
        return (
            <div className="py-1 sm:py-3 flex flex-col items-center gap-4">
                {docGenerageState ? (
                    docOptions && docOptions?.length > 0 ? (
                        aiOptionsSection('doc')
                    ) : (
                        <>
                            <h3 className="text-lg m-0 text-center">Формат вопроса в Word:</h3>
                            <div className="flex flex-col gap-2 p-2 lesson-card-border shadow rounded ">
                                <li className="ml-4 text-sm">Пишите текст вопроса и затем блок вариантов</li>
                                <li className="ml-4 text-sm">Поставьте звёздочку [*] в конце правильного варианта</li>
                                <div className="text-sm">
                                    <b>Пример: </b>Столица Франции?|Париж[*]|Лондон|Берлин
                                </div>

                                <div className="flex flex-col gap-2 p-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <FileUpload
                                            ref={fileUploadRef}
                                            mode="basic"
                                            onSelect={(e) => {
                                                const file = e.files?.[0];
                                                setMyFile(file);
                                            }}
                                            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            maxFileSize={1000000}
                                            customUpload
                                            auto={false}
                                            chooseLabel="Загрузить документ"
                                        />

                                        {myFile && (
                                            <Button
                                                icon="pi pi-trash"
                                                className="trash-button"
                                                size="small"
                                                onClick={() => {
                                                    fileUploadRef.current?.clear();
                                                    setMyFile(null);
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex justify-center">
                                        <Button icon="pi pi-play" disabled={myFile ? false : true} iconPos="right" onClick={handleDocGenerate}>
                                            Начать генерацию
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                ) : aiTestStat ? (
                    <div className="">
                        {aiOptions && aiOptions?.length > 0 ? (
                            aiOptionsSection('ai')
                        ) : progressSpinner ? (
                            <ProgressSpinner className="max-w-[50px] sm:max-w-[70px]" />
                        ) : aiTestSteps?.length > 0 ? (
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()} // обязательно!
                                className="flex flex-col gap-2 items-center"
                            >
                                <b>Далее вам будет предложено несколько вариантов теста</b>
                                {media ? (
                                    forAiTestId ? (
                                        <Button icon="pi pi-play" iconPos="right" size="small" onClick={handleDrop}>
                                            Начать генерацию
                                        </Button>
                                    ) : (
                                        <div className="lesson-card-border shadow rounded p-1 text-sm flex gap-1 items-center">
                                            <i className="pi pi-file-export"></i>
                                            <span>Выберите документ из списка</span>
                                        </div>
                                    )
                                ) : (
                                    <div className="lesson-card-border shadow rounded p-2 onDropAnimate flex gap-1 items-center">
                                        <i className="pi pi-file-export"></i> <span>Перетащите документ сюда</span>
                                    </div>
                                )}
                                <Button icon="pi pi-play" iconPos="right" size="small" onClick={handleDrop}>
                                    Начать генерацию без документа
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 items-center lesson-card-border shadow rounded p-3">
                                <b>Далее вам будет предложено несколько вариантов теста</b>
                                <Button icon="pi pi-play" iconPos="right" size="small" onClick={handleDrop}>
                                    Начать генерацию
                                </Button>
                            </div>
                        )}
                    </div>
                ) : contentShow ? (
                    <div className="w-full flex flex-col items-center gap-4 py-2">
                        <div className="w-full flex flex-wrap gap-4">
                            {testShow ? (
                                <NotFound titleMessage={'Заполните поля для добавления теста'} />
                            ) : (
                                <>
                                    {skeleton ? (
                                        <div className="w-full">
                                            <GroupSkeleton count={1} size={{ width: '100%', height: '6rem' }} />
                                        </div>
                                    ) : (
                                        test && (
                                            <LessonCard
                                                status="working"
                                                onSelected={(id: number, type: string) => selectedForEditing(id)}
                                                onDelete={(id: number) => handleDeleteTest(id)}
                                                cardValue={{ title: test?.content || '', id: Number(test!.id), desctiption: '', type: 'test', score: test.score, aiCreate: testValue?.aiCreate }}
                                                cardBg={'#ddc4f51a'}
                                                type={{ typeValue: 'test', icon: 'pi pi-doc' }}
                                                typeColor={'var(--mainColor)'}
                                                lessonDate={test.created_at && new Date(test.created_at).toISOString().slice(0, 10)}
                                                urlForPDF={() => {}}
                                                urlForDownload={''}
                                                answers={test.answers}
                                            />
                                        )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col justify-center gap-2 my-2">
                        <div className="lesson-card-border shadow rounded p-2">
                            <div className="w-[99%] sm:w-full flex flex-col gap-2 sm:items-center  p-1 sm:p-2">
                                <div className="w-full flex items-start gap-1">
                                    <div className="w-full">
                                        <InputTextarea
                                            id="title"
                                            placeholder={'Вопрос...'}
                                            value={testValue.title}
                                            style={{ resize: 'none', width: '100%' }}
                                            onChange={(e) => {
                                                setTestValue((prev) => ({ ...prev, title: e.target.value }));
                                                setValue('title', e.target.value, { shouldValidate: true });
                                            }}
                                        />
                                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                                    </div>
                                    <div className="flex flex-col justify-center items-start">
                                        <InputText
                                            type="number"
                                            placeholder="Балл"
                                            className="w-[50px] sm:w-[70px]"
                                            onChange={(e) => {
                                                setTestValue((prev) => ({ ...prev, score: Number(e.target.value) }));
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex flex-col justify-start items-start gap-2">
                                    {answer.map((item, index) => {
                                        return (
                                            <div className="w-full flex items-center gap-1" key={index}>
                                                <label className="custom-radio">
                                                    <input
                                                        type="radio"
                                                        name="testRadio"
                                                        checked={testChecked.idx === index}
                                                        onChange={() => {
                                                            setAnswer((prev) => prev.map((ans, i) => (i === index ? { ...ans, is_correct: true } : { ...ans, is_correct: false })));
                                                            setTestChecked({ idx: index, check: true });
                                                        }}
                                                    />
                                                    {/* <input type="radio" name="radio" /> */}
                                                    <span className="radio-mark min-w-[18px]"></span>
                                                </label>
                                                <InputText
                                                    type="text"
                                                    value={item.text}
                                                    className="p-inputtext-sm w-[90%] sm:w-full"
                                                    onChange={(e) => {
                                                        setAnswer((prev) => prev.map((ans, i) => (i === index ? { ...ans, text: e.target.value } : ans)));
                                                    }}
                                                />
                                                <Button icon="pi pi-trash" onClick={() => deleteOption(index)} className="p-[0px] w-2 trash-button" style={{ fontSize: '14px', maxWidth: '50px' }} />
                                            </div>
                                        );
                                    })}
                                    <div className="w-full flex gap-1 sm:gap-3 sm:items-center flex-col sm:flex-row">
                                        <Button label="Добавить вариант" onClick={addOption} disabled={optionAddBtn} icon="pi pi-plus" className="sm:ml-4 text-sm" size="small" />
                                        <Button label="Создать с ИИ" size="small" className="text-sm" icon="pi pi-microchip-ai" onClick={preparation} />
                                        <Button label="Создать тест из документа" size="small" className="text-sm" icon="pi pi-file-word" onClick={() => docPreparationTrue()} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 sm:gap-2 flex-col sm:flex-row items-start">
                                {!testValue.title?.length && <span className="text-[12px] text-[var(--amberColor)]">*Добавтье вопрос</span>}
                                {!testChecked.check && <span className="text-[12px] text-[var(--amberColor)]">*Добавтье правильный ответ</span>}
                                <span className="text-[12px] text-[var(--amberColor)]">*Балл за тест ({testValue?.score || '0'})</span>
                            </div>
                        </div>
                        <div className="flex relative">
                            <div className="w-full flex gap-1 justify-center items-center">
                                <Button
                                    label="Сохранить"
                                    disabled={progressSpinner || !testValue.title?.length || !!errors.title || !testChecked.check}
                                    onClick={() => {
                                        handleAddTest();
                                    }}
                                />
                                {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (content) {
            setContentShow(true);
            setTests(content);
        } else {
            setContentShow(false);
        }
    }, [content]);

    useEffect(() => {
        setTestValue({ title: '', score: 0, aiCreate: false, isDoc: false });
    }, [element]);

    useEffect(() => {
        console.log(myFile);
    }, [myFile]);

    return (
        <div>
            <FormModal
                title={'Обновить урок'}
                fetchValue={() => {
                    handleUpdateTest();
                }}
                clearValues={clearValues}
                visible={visible}
                setVisible={setVisisble}
                start={false}
                footerValue={{ footerState: true, reject: 'Назад', next: 'Сохранить' }}
            >
                <div className="flex flex-col gap-1">
                    <div className="w-full lesson-card-border flex flex-col gap-2 sm:items-center shadow rounded p-1 sm:p-2">
                        <div className="w-full flex flex-col">
                            <span>Позиция шага:</span>
                            <InputText
                                type="number"
                                value={String(editingLesson?.stepPos) || ''}
                                className="sm:w-full p-1"
                                onChange={(e) => {
                                    setEditingLesson(
                                        (prev) =>
                                            prev && {
                                                ...prev,
                                                stepPos: Number(e.target.value)
                                            }
                                    );
                                }}
                            />
                        </div>
                        <div className="w-full flex items-start gap-1">
                            <div className="w-full">
                                <InputTextarea
                                    id="title"
                                    placeholder={'Вопрос...'}
                                    value={editingLesson?.title && editingLesson.title}
                                    style={{ resize: 'none', width: '100%' }}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                        setValue('title', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <InputText
                                    type="number"
                                    className="w-[70px]"
                                    placeholder="Балл"
                                    value={String(editingLesson?.score)}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, score: Number(e.target.value) });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-start items-start gap-2">
                            {answer.map((item, index) => {
                                return (
                                    <div className="flex items-center gap-1" key={index}>
                                        <label className="custom-radio">
                                            <input
                                                type="radio"
                                                name="testRadio"
                                                checked={item.is_correct}
                                                onChange={() => {
                                                    setAnswer((prev) => prev.map((ans, i) => (i === index ? { ...ans, is_correct: true } : { ...ans, is_correct: false })));
                                                }}
                                            />
                                            <span className="radio-mark min-w-[18px]"></span>
                                        </label>
                                        <InputText
                                            type="text"
                                            value={item.text}
                                            className="w-[200px] sm:w-full"
                                            onChange={(e) => {
                                                setAnswer((prev) => prev.map((ans, i) => (i === index ? { ...ans, text: e.target.value } : ans)));
                                            }}
                                        />
                                        <Button icon="pi pi-trash" onClick={() => deleteOption(index)} className="p-[0px] w-2 trash-button" style={{ fontSize: '14px' }} />
                                    </div>
                                );
                            })}

                            <Button label="Добавить вариант" onClick={addOption} disabled={optionAddBtn} icon="pi pi-plus" className="p-1 ml-4" style={{ fontSize: '14px' }} />
                        </div>
                    </div>
                </div>
            </FormModal>
            {!clearProp && testSection()}
        </div>
    );
}
