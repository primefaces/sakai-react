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
    myedu_id?: string | number;
}

const cardClass = 'rounded-[16px] bg-white border border-[#eef2f6] shadow-[0_1px_3px_rgba(0,0,0,0.05)]';

// аннулировать можно только тесты и практические работы
const getSelectableSteps = (course: any): any[] => (course?.lesson_step_answers || []).filter((step: any) => step?.test || step?.practical);

const StudentDetailPage = () => {
    const { id_student } = useParams();
    const { setMessage } = useContext(LayoutContext);
    const { translations } = useLocalization();
    const showError = useErrorMessage();

    const [student, setStudent] = useState<Student | null>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<boolean | null>(null);
    const [answer_ids, setAnswerIds] = useState<string[]>([]);
    const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [instructVisible, setInstructVisible] = useState<boolean>(false);
    const [annulmentReason, setAnnulmentReason] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [skeleton, setSkeleton] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [accrodionIndex, setAccrodionIndex] = useState<number | null>(0);
    const [activityDialogVisible, setActivityDialogVisible] = useState(false);
    const [activityLoading, setActivityLoading] = useState(false);
    const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
    const [courseActivity, setCourseActivity] = useState<ContributionDay[] | null>(null);

    // --- Шаблон для запроса данных ---
    // silent - обновить список без полноэкранного спиннера (после аннулирования)
    const handleFetchStudentData = async (silent = false) => {
        if (!silent) setLoading(true);
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

    const clearSelection = () => {
        setCurrentCourseId(null);
        setAnswerIds([]);
    };

    // --- Выбор работ ---
    // выбор всегда относится только к одному курсу
    const isStepChecked = (courseId: string, stepId: string) => currentCourseId === courseId && answer_ids.includes(stepId);

    const toggleStep = (courseId: string, stepId: string) => {
        if (currentCourseId !== courseId) {
            setCurrentCourseId(courseId);
            setAnswerIds([stepId]);
            return;
        }
        setAnswerIds((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]));
    };

    const toggleAll = (course: any) => {
        const ids = getSelectableSteps(course).map((step: any) => step.id);
        const allChecked = currentCourseId === course.id && ids.length > 0 && ids.every((id: string) => answer_ids.includes(id));
        if (allChecked) {
            clearSelection();
        } else {
            setCurrentCourseId(course.id);
            setAnswerIds(ids);
        }
    };

    const handlestudentCancel = async () => {
        setSubmitting(true);
        setError(null);

        const data = await studentCancel(false, Number(currentCourseId), annulmentReason, answer_ids, Number(id_student), description);
        if (data && data?.status === 'success') {
            setDialogVisible(false);
            setDescription('');
            setAnnulmentReason('');
            clearSelection();
            await handleFetchStudentData(true);
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

        setSubmitting(false);
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

        setSelectedCourseTitle(courseTitle || translations.activity);
        setCourseActivity(null);
        setActivityDialogVisible(true);
        setActivityLoading(true);

        const data = await fetchStudentCoursesActivity(coursesActivityParams);
        if (data) {
            setCourseActivity(prepareCourseActivity(data, course_id));
        }
        setActivityLoading(false);
    };

    useEffect(() => {
        handleFetchStudentData();
        handleFetchStudentDetail();
    }, [id_student]);

    const selectedCourse = courses.find((course) => course.id === currentCourseId);

    // --- Шапка со студентом ---
    const studentInfo = (
        <div className={`${cardClass} p-[14px] sm:p-[18px]`}>
            <div className="flex items-center gap-[14px]">
                <span className="flex items-center justify-center shrink-0 w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-[16px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] text-[18px] sm:text-[20px] font-bold uppercase">
                    {`${student?.last_name?.[0] ?? ''}${student?.name?.[0] ?? ''}` || <i className="pi pi-user text-[18px]"></i>}
                </span>
                <div className="flex flex-col gap-[6px] min-w-0">
                    <h1 className="text-[18px] sm:text-[22px] leading-tight font-bold text-[var(--titleColor)] m-0 break-words">
                        {student?.last_name} {student?.name} {student?.father_name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-[6px]">
                        {student?.myedu_id && (
                            <span className="inline-flex items-center gap-[4px] px-[9px] py-[3px] rounded-full bg-[#f1f5f9] text-[12px] font-semibold text-[var(--bodyColor)]">
                                <i className="pi pi-id-card text-[11px]"></i>
                                {student.myedu_id}
                            </span>
                        )}
                        {typeof student?.email === 'string' && student.email && (
                            <span className="inline-flex items-center gap-[4px] px-[9px] py-[3px] rounded-full bg-[#f1f5f9] text-[12px] font-semibold text-[var(--bodyColor)] break-all">
                                <i className="pi pi-envelope text-[11px]"></i>
                                {student.email}
                            </span>
                        )}
                        {!loading && !error && (
                            <span className="inline-flex items-center gap-[4px] px-[9px] py-[3px] rounded-full bg-[var(--mainColor)]/10 text-[12px] font-semibold text-[var(--mainColor)]">
                                <i className="pi pi-book text-[11px]"></i>
                                {translations.courses}: {courses.length}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Одна работа (тест / практика) ---
    const stepRow = (course: any, step: any) => {
        const isTest = Boolean(step?.test);
        const checked = isStepChecked(course.id, step.id);
        const title = isTest ? step?.test?.content || translations.test : step?.practical?.title || translations.pracicalWork;
        const score = isTest ? step?.test?.score : step?.practical?.score;

        return (
            <label
                key={step.id}
                className={`flex items-center gap-[12px] p-[10px] sm:p-[12px] rounded-[12px] border cursor-pointer select-none transition-colors duration-200 ${
                    checked ? 'border-[var(--mainBorder)] bg-[var(--mainColor)]/5' : 'border-[#eef2f6] bg-white hover:bg-[#f8fbfd]'
                }`}
            >
                <input type="checkbox" className="customCheckbox shrink-0" checked={checked} onChange={() => toggleStep(course.id, step.id)} />

                <span className={`flex items-center justify-center shrink-0 w-[36px] h-[36px] rounded-[10px] ${isTest ? 'bg-[#c38598]/15 text-[#a5607a]' : 'bg-[var(--yellowColor)]/40 text-[#5c7a12]'}`}>
                    <i className={`pi ${isTest ? 'pi-list-check' : 'pi-pen-to-square'} text-[14px]`}></i>
                </span>

                <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                    <span className="text-[14px] font-semibold text-[var(--titleColor)] leading-snug break-words">{title}</span>
                    <span className="text-[12px] text-[var(--text-color-secondary)]">{isTest ? translations.test : translations.pracicalWork}</span>
                </div>

                <span className="inline-flex items-center gap-[4px] shrink-0 px-[9px] py-[3px] rounded-full bg-[#f1f5f9] text-[12px] font-semibold text-[var(--bodyColor)] whitespace-nowrap">
                    <i className="pi pi-star text-[10px]"></i>
                    {score ?? '-'}
                </span>
            </label>
        );
    };

    // --- Заголовок курса в аккордеоне ---
    const courseHeader = (course: any, idx: number, selectableCount: number) => {
        const eduYear = findEduYear(course?.lesson_step_answers?.[0]?.connections?.id_edu_year);
        const selectedCount = currentCourseId === course.id ? answer_ids.length : 0;

        return (
            <div className="flex items-center justify-between gap-[10px] w-full min-w-0">
                <div className="flex items-center gap-[12px] min-w-0 flex-1">
                    <span className="hidden sm:flex items-center justify-center shrink-0 w-[34px] h-[34px] rounded-[10px] bg-[#f1f5f9] text-[13px] font-bold text-[var(--bodyColor)]">{idx + 1}</span>
                    <div className="flex flex-col gap-[4px] min-w-0">
                        <span className="text-[14px] sm:text-[15px] font-semibold text-[var(--titleColor)] leading-snug break-words">{course.title}</span>
                        <div className="flex flex-wrap items-center gap-[6px]">
                            {course?.subject?.name_ru && <span className="text-[12px] font-normal text-[var(--text-color-secondary)] break-words">{course.subject.name_ru}</span>}
                            {eduYear && (
                                <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-[var(--mainColor)]/10 text-[11px] font-semibold text-[var(--mainColor)] whitespace-nowrap">
                                    <i className="pi pi-calendar text-[10px]"></i>
                                    {eduYear}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-[#f1f5f9] text-[11px] font-semibold text-[var(--bodyColor)] whitespace-nowrap">
                                <i className="pi pi-file text-[10px]"></i>
                                {selectedCount > 0 ? `${selectedCount} / ${selectableCount}` : selectableCount}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    aria-label={translations.activity}
                    title={translations.activity}
                    className="flex items-center justify-center shrink-0 w-[34px] h-[34px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)] hover:bg-[var(--mainColor)] hover:text-white transition-colors duration-200 cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFetchCoursesActivity(Number(course?.id), course?.title);
                    }}
                >
                    <i className="pi pi-chart-bar text-[14px]"></i>
                </button>
            </div>
        );
    };

    // --- Вкладка "Аннулировать" ---
    const cancellationPanel = () => {
        if (loading) {
            return (
                <div className={`${cardClass} flex justify-center items-center min-h-[320px]`}>
                    <ProgressSpinner style={{ width: '45px', height: '45px' }} />
                </div>
            );
        }

        if (error) {
            return <Message severity="error" text={translations.dataNotAvailable} className="w-full justify-start" />;
        }

        if (courses.length === 0) {
            return (
                <div className={`${cardClass} flex flex-col items-center justify-center gap-[8px] py-[40px] text-center`}>
                    <span className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#f1f5f9] text-[var(--text-color-secondary)]">
                        <i className="pi pi-book text-[22px]"></i>
                    </span>
                    <span className="text-[14px] text-[var(--text-color-secondary)]">{translations.studentNotCourse}</span>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-[12px]">
                <Accordion
                    className="modern-accordion"
                    activeIndex={accrodionIndex}
                    onTabChange={(e: any) => {
                        setAccrodionIndex(e.index);
                        clearSelection();
                    }}
                >
                    {courses.map((course: any, idx) => {
                        const selectableSteps = getSelectableSteps(course);
                        const isCurrent = currentCourseId === course.id;
                        const allChecked = isCurrent && selectableSteps.length > 0 && selectableSteps.every((step: any) => answer_ids.includes(step.id));

                        return (
                            <AccordionTab key={course.id} header={courseHeader(course, idx, selectableSteps.length)}>
                                {selectableSteps.length === 0 ? (
                                    <div className="flex items-center gap-[8px] p-[12px] rounded-[12px] bg-[#f8fafc] text-[13px] text-[var(--text-color-secondary)]">
                                        <i className="pi pi-info-circle text-[13px]"></i>
                                        {translations.noWorksInCourse}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-[10px]">
                                        {/* панель выбора */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[8px] pb-[10px] border-b border-[#f1f5f9]">
                                            <span className="text-[13px] text-[var(--text-color-secondary)]">{translations.selectWorksHint}</span>
                                            <label className="inline-flex items-center gap-[8px] self-end sm:self-auto cursor-pointer select-none text-[13px] font-semibold text-[var(--titleColor)]">
                                                <input type="checkbox" className="customCheckbox shrink-0" checked={allChecked} onChange={() => toggleAll(course)} />
                                                {translations.selectAll}
                                            </label>
                                        </div>

                                        <div className="flex flex-col gap-[8px]">{selectableSteps.map((step: any) => stepRow(course, step))}</div>
                                    </div>
                                )}
                            </AccordionTab>
                        );
                    })}
                </Accordion>

                {/* панель действий */}
                <div className={`${cardClass} sticky bottom-[12px] z-[2] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] p-[12px] sm:px-[16px]`}>
                    <div className="flex items-center gap-[10px] min-w-0">
                        <span className={`flex items-center justify-center shrink-0 w-[34px] h-[34px] rounded-[10px] ${answer_ids.length ? 'bg-[#fff1f1] text-[#d32f2f]' : 'bg-[#f1f5f9] text-[var(--text-color-secondary)]'}`}>
                            <i className="pi pi-check-square text-[14px]"></i>
                        </span>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[13px] text-[var(--text-color-secondary)]">
                                {translations.selectedWorks}: <b className="text-[var(--titleColor)]">{answer_ids.length}</b>
                            </span>
                            {selectedCourse && answer_ids.length > 0 && <span className="text-[12px] font-semibold text-[var(--titleColor)] truncate">{selectedCourse.title}</span>}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-[8px]">
                        {answer_ids.length > 0 && <Button label={translations.clearSelection} icon="pi pi-times" size="small" text severity="secondary" onClick={clearSelection} />}
                        <Button label={translations.cancellation} icon="pi pi-times-circle" iconPos="right" size="small" className="p-button-danger" style={{ borderRadius: 10 }} disabled={answer_ids.length === 0} onClick={() => setDialogVisible(true)} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-[16px] px-2 sm:px-4">
            {skeleton ? <GroupSkeleton count={1} size={{ width: '100%', height: '100px' }} /> : studentInfo}

            <div className={`${cardClass} p-[10px] sm:p-[16px]`}>
                <TabView onTabChange={(e) => handleTabChange(e)} activeIndex={activeIndex} className={`modern-tabview ${submitting ? 'modern-tabview-busy' : ''}`}>
                    <TabPanel header={translations.cancellation} leftIcon="pi pi-ban">
                        {cancellationPanel()}
                    </TabPanel>

                    <TabPanel header={translations.controll} leftIcon="pi pi-sliders-h">
                        <div className="flex flex-col gap-[12px]">
                            <button
                                type="button"
                                onClick={() => setInstructVisible(true)}
                                className="w-full flex items-start gap-[12px] p-[14px] rounded-[16px] text-left cursor-pointer bg-[var(--mainColor)]/5 border border-[var(--mainColor)]/20 hover:bg-[var(--mainColor)]/10 transition-colors duration-200"
                            >
                                <span className="flex items-center justify-center shrink-0 w-[34px] h-[34px] rounded-[10px] bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                                    <i className="pi pi-info-circle text-[15px]"></i>
                                </span>
                                <span className="flex-1 flex flex-col text-[13px] leading-relaxed text-[var(--bodyColor)] min-w-0">
                                    <span className="mb-[2px] font-semibold text-[var(--titleColor)]">{translations.instruction}</span>
                                    <span className="line-clamp-2">{translations.studentWorkCencalled}</span>
                                </span>
                                <i className="pi pi-angle-right shrink-0 self-center text-[14px] text-[var(--mainColor)]"></i>
                            </button>
                            <CoursesCut id_student={Number(id_student)} />
                        </div>
                    </TabPanel>
                </TabView>
            </div>

            <Dialog
                header={translations.reasonCancellation}
                visible={dialogVisible}
                className="w-[90%] sm:w-[560px]"
                onHide={() => !submitting && setDialogVisible(false)}
                footer={
                    <div>
                        <Button label={translations.cancel} icon="pi pi-times" onClick={() => setDialogVisible(false)} disabled={submitting} className="p-button-secondary reject-button" />
                        <Button label={translations.cancellation} icon="pi pi-check" className="p-button-danger accept-button" loading={submitting} disabled={answer_ids.length === 0} onClick={handlestudentCancel} autoFocus />
                    </div>
                }
            >
                <div className="flex flex-col gap-[12px]">
                    <div className="flex items-start gap-[10px] p-[12px] rounded-[12px] bg-[#fff7f7] border border-[#f5bcbc]">
                        <i className="pi pi-exclamation-triangle text-[#d32f2f] text-[15px] mt-[2px]"></i>
                        <div className="flex flex-col gap-[2px] text-[13px] min-w-0">
                            <span className="font-semibold text-[var(--titleColor)]">
                                {translations.worksWillBeCancelled}: {answer_ids.length}
                            </span>
                            {selectedCourse && <span className="text-[var(--bodyColor)] break-words">{selectedCourse.title}</span>}
                        </div>
                    </div>

                    <div className="p-fluid flex flex-col gap-[8px]">
                        <label htmlFor="reason" className="text-[13px] font-semibold text-[var(--titleColor)]">
                            {translations.reasonFullCancellation}
                        </label>
                        <InputText type="text" value={annulmentReason} placeholder={translations.cancellationSubject} style={{ borderRadius: 10 }} onChange={(e) => setAnnulmentReason(e.target.value)} />
                        <InputTextarea id="reason" value={description} placeholder={translations.description} style={{ borderRadius: 10 }} onChange={(e) => setDescription(e.target.value)} rows={5} />
                    </div>
                </div>
            </Dialog>

            <Dialog header={translations.instruction} visible={instructVisible} className="w-[90%] sm:w-[60%]" onHide={() => setInstructVisible(false)}>
                <p className="m-0 text-[14px] leading-relaxed text-[var(--bodyColor)]">{translations.studentWorkCencalled}</p>
            </Dialog>

            <Dialog header={selectedCourseTitle || translations.activity} visible={activityDialogVisible} className="w-[95vw] sm:w-[80vw]" contentClassName="overflow-x-auto" onHide={() => setActivityDialogVisible(false)}>
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
        </div>
    );
};

export default StudentDetailPage;
