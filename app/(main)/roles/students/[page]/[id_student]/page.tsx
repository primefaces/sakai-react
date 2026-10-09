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
import { fetchStudentCoursesActivity, fetchStudentSearchDetail } from '@/services/student/studentSearch';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import { TabPanel, TabView } from 'primereact/tabview';
import { TabViewChange } from '@/types/tabViewChange';
import CoursesCut from '@/app/components/tables/coursesCut';
import { useLocalization } from '@/layout/context/localizationcontext';
import ActivityHeatmap from '@/app/components/Contribution';
import { ContributionDay } from '@/types/ContributionDay';
import { findEduYear } from '@/utils/findEdyYear';

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
    const { translations } = useLocalization();
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
    const [activityDialogVisible, setActivityDialogVisible] = useState(false);
    const [activityLoading, setActivityLoading] = useState(false);
    const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
    const [courseActivity, setCourseActivity] = useState<ContributionDay[] | null>(null);

    // --- Шаблон для запроса данных ---
    const handleFetchStudentData = async () => {
        setLoading(true);
        setError(null);
        const data = await fetchStudentData(Number(id_student));
        console.log('data ', data);

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
        if (data && data?.status === 'success') {
            setAnswerIds([]);
            handleFetchStudentData();
            setMessage({
                state: true,
                value: { severity: 'success', summary: data?.message, detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }

        setLoading(false);
    };

    const prepareCourseActivity = (activityData: any, course_id: number): ContributionDay[] => {
        const courseActivityData = activityData?.data?.[course_id] || activityData?.[course_id] || {};

        const getActivityLevel = (count: number) => {
            if (count <= 0) return 0;
            if (count < 10) return 1;
            if (count < 50) return 2;
            if (count < 100) return 3;
            return 4;
        };

        return Object.entries(courseActivityData).map(([date, count]) => ({
            date,
            count: getActivityLevel(Number(count))
        }));
    };

    const handleFetchCoursesActivity = async (course_id: number, courseTitle?: string) => {
        const coursesActivityParams = new URLSearchParams();

        coursesActivityParams.append('id_student', String(id_student));
        coursesActivityParams.append('course_ids[]', String(course_id));

        setSelectedCourseTitle(courseTitle || 'Activity');
        setCourseActivity(null);
        setActivityDialogVisible(true);
        setActivityLoading(true);

        const data = await fetchStudentCoursesActivity(coursesActivityParams);
        if(data) {
            setCourseActivity(prepareCourseActivity(data, course_id));
        }
        setActivityLoading(false);
    }

    useEffect(() => {
        handleFetchStudentData();
    }, [params.student_id]);

    useEffect(() => {
        console.log(courses);
    }, [courses]);

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
                        header={translations.cancellation}
                        className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                    >
                        {courses.length === 0 ? (
                            <b className="main-bg w-full flex justify-center">{translations.studentNotCourse}</b>
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
                                                <div className="flex items-center justify-between gap-3 w-full min-w-0">
                                                    <div className="flex  items-center gap-x-5 gap-y-2 min-w-0 flex-1">
                                                        <span className="font-bold min-w-0">
                                                            {idx + 1}. Курс: {course.title}
                                                        </span>

                                                        <span className="inline-flex shrink-0 items-center gap-2 text-[12px] rounded-xl bg-[var(--mainColor)] px-2 py-2 text-white whitespace-nowrap">
                                                            <i className="pi pi-calendar text-[12px]"></i>
                                                            {findEduYear(course?.lesson_step_answers[0]?.connections?.id_edu_year)}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        aria-label="Open activity"
                                                        className="inline-flex  shrink-0 items-center justify-center rounded-full text-[var(--mainColor)] transition-colors duration-200 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleFetchCoursesActivity(Number(course?.id), course?.title);
                                                        }}
                                                    >
                                                        <i className="pi pi-chart-bar" style={{ fontSize: '16px' }}></i>
                                                    </button>
                                                </div>
                                            }
                                            className={`w-full p-accordion my-accardion-icon`}
                                            style={{ width: '100%', backgroundColor: 'white' }}
                                        >
                                            <div className="flex flex-col">
                                                {/* {course?.lesson_step_answers.length > 0 ? ( */}
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
                                                                {translations.selectAll}
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
                                                                                    <i className={`pi pi-list-check text-[var(--whiteColor)]`}></i>
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
                                                                                    <i className={`pi pi-pen-to-square text-[var(--whiteColor)]`}></i>
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
                                                {/* ) : (
                                                    <div className="col-12">
                                                        <Message severity="info" text={translations.inCourseNoStep} />
                                                    </div>
                                                )} */}
                                            </div>
                                        </AccordionTab>
                                    ))}
                                </Accordion>
                                <div className="w-full flex justify-end mt-4">
                                    <Button label={translations.cancellation} icon="pi pi-times-circle" iconPos="right" size="small" className="p-button-danger" disabled={answer_ids.length === 0} onClick={() => setDialogVisible(true)} />
                                </div>
                            </div>
                        )}
                    </TabPanel>

                    <TabPanel
                        pt={{
                            headerAction: { className: 'font-italic' }
                        }}
                        header={translations.controll}
                        className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                    >
                        <div className="w-full block sm:w-1/2 font-sans text-sm">
                            <div onClick={() => setInstructVisible(true)} className="cursor-pointer flex items-center gap-1 justify-end text-[var(--mainColor)] ">
                                <i className="pi pi-info-circle p-1 rounded-full"></i>
                                <span className="underline">Инструкция</span>
                            </div>
                            <CoursesCut id_student={Number(id_student)} />
                        </div>
                    </TabPanel>
                </TabView>

                <Dialog
                    header={translations.reasonCancellation}
                    visible={dialogVisible}
                    className="w-[90%] sm:w-[60%]"
                    onHide={() => setDialogVisible(false)}
                    footer={
                        <div>
                            <Button label={translations.cancel} icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-secondary reject-button" />
                            <Button
                                label={translations.cancellation}
                                icon="pi pi-check"
                                className="p-button-danger accept-button"
                                onClick={() => {
                                    setDialogVisible(false);
                                    handlestudentCancel();
                                }}
                                autoFocus
                            />
                        </div>
                    }
                >
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="reason">{translations.reasonFullCancellation}</label>
                            <InputText type="text" value={annulmentReason} placeholder="Тема" className="my-2" onChange={(e) => setAnnulmentReason(e.target.value)} />
                            <InputTextarea id="reason" value={description} placeholder={translations.description} onChange={(e) => setDescription(e.target.value)} rows={5} />
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Инструкция" visible={instructVisible} className="w-[90%] sm:w-[60%]" onHide={() => setInstructVisible(false)}>
                    <div className="main-bg">
                        <p>
                            {translations.studentWorkCencalled}
                        </p>
                    </div>
                </Dialog>
                <Dialog
                    header={selectedCourseTitle || 'Activity'}
                    visible={activityDialogVisible}
                    className="w-[95vw] sm:w-[80vw]"
                    contentClassName="overflow-x-auto"
                    onHide={() => setActivityDialogVisible(false)}
                >
                    <div className="min-w-[920px] p-2">
                        {activityLoading ? (
                            <div className="flex justify-content-center align-items-center py-5">
                                <ProgressSpinner style={{ width: '35px', height: '35px' }} />
                            </div>
                        ) : (
                            <ActivityHeatmap value={courseActivity} />
                        )}
                    </div>
                </Dialog>
            </>
        </div>
    );
};

export default StudentDetailPage;
