'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { fetchStudentData, studentCancel } from '@/services/roles/roles';
import { useParams } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { LayoutContext } from '@/layout/context/layoutcontext';
import useErrorMessage from '@/hooks/useErrorMessage';
import { fetchStudentSearchDetail } from '@/services/student/studentSearch';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import { TabPanel, TabView } from 'primereact/tabview';
import { TabViewChange } from '@/types/tabViewChange';
import CoursesCut from '@/app/components/tables/coursesCut';

// Типизация данных (можно вынести в отдельные файлы в /types)
interface Student {
    id: string;
    name: string;
    last_name: string;
    father_name: string;
    email: string;
    avatar: string;
    faculty: string;
}

interface Step {
    id: string;
    type: 'lesson' | 'test' | 'assignment';
    title: string;
    completed: boolean;
}

interface Course {
    id: string;
    title: string;
    progress: number;
    steps: Step[];
}

const StudentDetailPage = ({ params }: { params: { student_id: string } }) => {
    const { id_student } = useParams();
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [student, setStudent] = useState<Student | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean | null>(null);
    const [answer_ids, setAnswerIds] = useState<string[]>([]);
    const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [instructVisible, setInstructVisible] = useState<boolean>(false);
    const [annulmentReason, setAnnulmentReason] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [skeleton, setSkeleton] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [fakeCheck, setFakeCheck] = useState(false);
    const [accrodionIndex, setAccrodionIndex] = useState(0);

    // --- Шаблон для запроса данных ---
    const handleFetchStudentData = async () => {
        setLoading(true);
        setError(null);
        const data = await fetchStudentData(Number(id_student));
        if (data && Array.isArray(data)) {
            setCourses(data);
        } else {
            setError(true);
        }
        setLoading(false);
    };

    const handleTabChange = (e: TabViewChange) => {
        setActiveIndex(e.index);
    };

    const handleFetchStudentDetail = async () => {
        setSkeleton(true);
        const data = await fetchStudentSearchDetail(Number(id_student));

        if (data?.success) {
            setStudent(data?.student);
        }
        setSkeleton(false);
    };

    const handlestudentCancel = async () => {
        setLoading(true);
        setError(null);
        setDescription('');
        setAnnulmentReason('');

        const data = await studentCancel(false, Number(currentCourseId), annulmentReason, answer_ids, Number(id_student), description);
        if (data) {
            setAnswerIds([]);
            handleFetchStudentData();
            setMessage({
                state: true,
                value: { severity: 'success', summary: data?.message, detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        handleFetchStudentData();
    }, [params.student_id]);

    // useEffect(()=> {
    //     console.log(answer_ids);
    // },[answer_ids])

    useEffect(() => {
        handleFetchStudentDetail();
    }, []);

    // Рендер контента
    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <ProgressSpinner style={{ width: '45px', height: '45px' }} />
            </div>
        );
    }

    if (error) {
        return <Message severity="error" text={error} />;
    }

    const StudentInfo = () => {
        return (
            <div className="mb-4">
                <div className="bg-white rounded-2xl shadow-lg border-gray-200 p-4">
                    <div className="flex flex-col gap-2">
                        {/* ФИО Студента */}
                        <div className="space-y-1">
                            <h1 className="sm:text-xl font-bold text-gray-800 m-0">
                                {student?.last_name} {student?.name} {student?.father_name}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="px-2 sm:px-4">
            {skeleton ? <GroupSkeleton count={1} size={{ width: '100%', height: '100px' }} /> : <StudentInfo />}

            <>
                <TabView
                    onTabChange={(e) => handleTabChange(e)}
                    activeIndex={activeIndex}
                    // className="main-bg"
                    pt={{
                        nav: { className: 'flex flex-wrap text-sm' },
                        panelContainer: { className: 'flex-1 pl-4' }
                    }}
                >
                    <TabPanel
                        pt={{
                            headerAction: { className: 'font-italic' }
                        }}
                        header={'Аннулирование'}
                        className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                    >
                        {courses.length === 0 ? (
                            <b className="main-bg w-full flex justify-center">У студента пока нет назначенных курсов</b>
                        ) : (
                            <div className="w-full block sm:w-1/2">
                                <Accordion
                                    activeIndex={accrodionIndex}
                                    onTabChange={(e: any) => {
                                        setAccrodionIndex(e.index);
                                        setFakeCheck(false);
                                        setCurrentCourseId(null);
                                        setAnswerIds([]);
                                    }}
                                >
                                    {courses.map((course: any, idx) => (
                                        <AccordionTab
                                            key={course.id}
                                            header={
                                                <>
                                                    <span className="font-bold">
                                                        {idx + 1}. Курс: {course.title}
                                                    </span>
                                                </>
                                            }
                                            className={`w-full p-accordion my-accardion-icon`}
                                            style={{ width: '100%', backgroundColor: 'white' }}
                                        >
                                            <div className="flex flex-col">
                                                {course?.lesson_step_answers.length > 0 ? (
                                                    <>
                                                        <div className="w-full flex justify-between gap-2 items-start mb-4 flex-col sm:flex-row">
                                                            {/* Предмет  */}
                                                            <div className="space-y-1 ml-2 w-full">
                                                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Предмет</p>
                                                                <div className="flex items-center gap-2 w-full">
                                                                    <span className="w-1 h-2 rounded-full bg-[var(--mainColor)]"></span>
                                                                    <p className="text-lg text-slate-800 font-semibold text-[14px] sm:text-[16px]">{course?.subject?.name_ru}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center mb-2 w-full justify-end">
                                                                <label className="custom-radio">
                                                                    <input
                                                                        type="checkbox"
                                                                        className={`customCheckbox`}
                                                                        checked={currentCourseId === course.id && answer_ids.length === course.lesson_step_answers.length}
                                                                        onChange={(e) => {
                                                                            setCurrentCourseId(course.id);
                                                                            if (e.target.checked) {
                                                                                setAnswerIds(course.lesson_step_answers.map((step: any) => step.id));
                                                                                setFakeCheck(true);
                                                                            } else {
                                                                                setAnswerIds([]);
                                                                                setFakeCheck(false);
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span className="checkbox-mark"></span>
                                                                </label>
                                                                <label htmlFor={`select-all-${course.id}`} className="ml-2 font-bold">
                                                                    Выбрать все
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="w-full">
                                                            {course.lesson_step_answers.map((step: any) => (
                                                                <div key={step.id} className="flex w-full flex-col">
                                                                    {step?.test && (
                                                                        <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-2 rounded-sm h-full w-full shadow p-2 hover:bg-slate-50/50 transition-colors">
                                                                            <div className="flex items-center w-full gap-2">
                                                                                {fakeCheck ? (
                                                                                    <>
                                                                                        <label className="custom-radio">
                                                                                            <input
                                                                                                key={fakeCheck ? 'fake' : 'real'}
                                                                                                type="checkbox"
                                                                                                className={`customCheckbox`}
                                                                                                value={step.id}
                                                                                                checked={true}
                                                                                                onChange={(e) => {
                                                                                                    setFakeCheck(false);
                                                                                                    setAnswerIds([]);
                                                                                                }}
                                                                                            />
                                                                                            <span className="checkbox-mark"></span>
                                                                                        </label>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <label className="custom-radio">
                                                                                            <input
                                                                                                key={fakeCheck ? 'fake' : 'real'}
                                                                                                type="checkbox"
                                                                                                className={`customCheckbox`}
                                                                                                value={step.id}
                                                                                                onChange={(e) => {
                                                                                                    if (currentCourseId !== course.id) {
                                                                                                        setAnswerIds([step.id]);
                                                                                                        setCurrentCourseId(course.id);
                                                                                                    } else {
                                                                                                        const selectedIds = [...answer_ids];
                                                                                                        if (e.target.checked) {
                                                                                                            selectedIds.push(step.id);
                                                                                                        } else {
                                                                                                            const index = selectedIds.indexOf(step.id);
                                                                                                            if (index > -1) {
                                                                                                                selectedIds.splice(index, 1);
                                                                                                            }
                                                                                                        }
                                                                                                        setAnswerIds(selectedIds);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                            <span className="checkbox-mark"></span>
                                                                                        </label>
                                                                                    </>
                                                                                )}
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="flex p-2 bg-[#c38598] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] justify-center items-center rounded">
                                                                                        <i className={`pi pi-list-check text-white`}></i>
                                                                                    </div>
                                                                                    <span className="font-bold max-w-[70%] sm:max-w-[90%] break-words">{step?.test?.content || 'Тест'}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex sm:w-full justify-end">
                                                                                <span className="text-sm">Балл: {step?.test?.score}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {step?.practical && (
                                                                        <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-2 rounded-sm h-full w-full shadow p-2 hover:bg-slate-50/50 transition-colors">
                                                                            <div className="flex items-center w-full gap-2">
                                                                                {/* <label className="custom-radio">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className={`customCheckbox`}
                                                                                        value={step.id}
                                                                                        // checked={answer_ids.includes(step.id)}
                                                                                        onChange={(e) => {
                                                                                            if (currentCourseId !== course.id) {
                                                                                                setAnswerIds([step.id]);
                                                                                                setCurrentCourseId(course.id);
                                                                                            } else {
                                                                                                const selectedIds = [...answer_ids];
                                                                                                if (e.target.checked) {
                                                                                                    selectedIds.push(step.id);
                                                                                                } else {
                                                                                                    const index = selectedIds.indexOf(step.id);
                                                                                                    if (index > -1) {
                                                                                                        selectedIds.splice(index, 1);
                                                                                                    }
                                                                                                }
                                                                                                setAnswerIds(selectedIds);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <span className="checkbox-mark"></span>
                                                                                </label> */}
                                                                                {fakeCheck ? (
                                                                                    <>
                                                                                        <label className="custom-radio">
                                                                                            <input
                                                                                                key={fakeCheck ? 'fake' : 'real'}
                                                                                                type="checkbox"
                                                                                                className={`customCheckbox`}
                                                                                                value={step.id}
                                                                                                checked={true}
                                                                                                onChange={(e) => {
                                                                                                    setFakeCheck(false);
                                                                                                }}
                                                                                            />
                                                                                            <span className="checkbox-mark"></span>
                                                                                        </label>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <label className="custom-radio">
                                                                                            <input
                                                                                                key={fakeCheck ? 'fake' : 'real'}
                                                                                                type="checkbox"
                                                                                                className={`customCheckbox`}
                                                                                                value={step.id}
                                                                                                onChange={(e) => {
                                                                                                    if (currentCourseId !== course.id) {
                                                                                                        setAnswerIds([step.id]);
                                                                                                        setCurrentCourseId(course.id);
                                                                                                    } else {
                                                                                                        const selectedIds = [...answer_ids];
                                                                                                        if (e.target.checked) {
                                                                                                            selectedIds.push(step.id);
                                                                                                        } else {
                                                                                                            const index = selectedIds.indexOf(step.id);
                                                                                                            if (index > -1) {
                                                                                                                selectedIds.splice(index, 1);
                                                                                                            }
                                                                                                        }
                                                                                                        setAnswerIds(selectedIds);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                            <span className="checkbox-mark"></span>
                                                                                        </label>
                                                                                    </>
                                                                                )}
                                                                                <div className="flex items-start sm:items-center gap-2">
                                                                                    <div className="flex p-2 bg-[var(--yellowColor)] shadow-xl min-w-[40px] min-h-[40px] w-[40px] h-[40px] justify-center items-center rounded">
                                                                                        <i className={`pi pi-pen-to-square text-white`}></i>
                                                                                    </div>
                                                                                    <span className="font-bold max-w-[70%] sm:max-w-[90%] break-words">{step?.practical?.title || 'Практическая работа'}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex sm:w-full justify-end">
                                                                                <span className="text-sm">Балл: {step?.practical?.score}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="col-12">
                                                        <Message severity="info" text="В этом курсе пока нет шагов." />
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionTab>
                                    ))}
                                </Accordion>
                                <div className="w-full flex justify-end mt-4">
                                    <Button label="Аннулировать" icon="pi pi-times-circle" iconPos="right" size="small" className="p-button-danger" disabled={answer_ids.length === 0} onClick={() => setDialogVisible(true)} />
                                </div>
                            </div>
                        )}
                    </TabPanel>

                    <TabPanel
                        pt={{
                            headerAction: { className: 'font-italic' }
                        }}
                        header={'Управление'}
                        className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                    >
                        <div className="w-full block sm:w-1/2 font-sans text-sm">
                            <div onClick={()=> setInstructVisible(true)} className="cursor-pointer flex items-center gap-1 justify-end text-[var(--mainColor)] ">
                                <i className="pi pi-info-circle p-1 rounded-full"></i>
                                <span className="underline">Инструкция</span>
                            </div>
                            <CoursesCut id_student={Number(id_student)} />
                        </div>
                    </TabPanel>
                </TabView>

                <Dialog
                    header="Причина аннулирования"
                    visible={dialogVisible}
                    className='w-[90%] sm:w-[60%]'
                    onHide={() => setDialogVisible(false)}
                    footer={
                        <div>
                            <Button label="Отмена" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-secondary reject-button" />
                            <Button
                                label="Аннулировать"
                                icon="pi pi-check"
                                className="p-button-danger accept-button"
                                onClick={() => {
                                    setDialogVisible(false);
                                    handlestudentCancel();
                                    // setAnnulmentReason('');
                                    // setAnswerIds([]);
                                    // setCurrentCourseId(null);
                                }}
                                autoFocus
                            />
                        </div>
                    }
                >
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="reason">Пожалуйста, опишите причину аннулирования.</label>
                            <InputText type="text" value={annulmentReason} placeholder="Тема" className="my-2" onChange={(e) => setAnnulmentReason(e.target.value)} />
                            <InputTextarea id="reason" value={description} placeholder="Описание" onChange={(e) => setDescription(e.target.value)} rows={5} />
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Инструкция" visible={instructVisible} className='w-[90%] sm:w-[60%]' onHide={() => setInstructVisible(false)}>
                    <div className="main-bg">
                        <p>
                            В данном разделе отображается список предметов, потоков и курсов, связанных со студентами. При изменении потока студента (например, при переводе в другой поток) в системе могут остаться лишние или некорректные связи — так
                            называемые «мусорные» данные. Эти данные могут мешать корректной работе системы, в том числе при <b>назначении модулей студенту</b>. В этом разделе вы можете просмотреть все связанные предметы, потоки и курсы, проверить их
                            актуальность и удалить лишние или ошибочные связи, чтобы избежать проблем в дальнейшем
                        </p>
                    </div>
                </Dialog>
            </>
        </div>
    );
};

export default StudentDetailPage;
