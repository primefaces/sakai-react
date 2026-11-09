'use client';

import FacultyHeader, { FacultyEmpty, facultyCardClass } from '@/app/components/faculty/FacultyHeader';
import RoleSwitch from '@/app/components/roles/RoleSwitch';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { publishCourse } from '@/services/courses';
import { depCourse } from '@/services/faculty';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useLocalization } from '@/layout/context/localizationcontext';

interface DepCourseType {
    id: number;
    title: string;
    image: string | null;
    is_published: boolean;
}

interface TeacherType {
    id: number;
    myedu_id: number;
    name?: string;
    last_name?: string;
    father_name?: string;
}

export default function CoursesDep() {
    const { translations } = useLocalization();
    const { id_kafedra, myedu_id } = useParams();

    const [courses, setCourses] = useState<DepCourseType[]>([]);
    const [contentShow, setContentShow] = useState<boolean>(false);
    const [contentNull, setContentNull] = useState<boolean>(false);
    const [teacher, setTeacher] = useState<TeacherType | null>(null);
    const [forDisabled, setForDisabled] = useState(false);
    const [skeleton, setSkeleton] = useState(true);
    const [search, setSearch] = useState('');

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const fetchDepartamentCourse = async () => {
        const data = await depCourse(Number(myedu_id), Number(id_kafedra));

        if (data && data?.courses) {
            if (data.courses?.length < 1) {
                setContentNull(true);
            } else {
                setContentNull(false);
            }
            setTeacher(data);
            setCourses(data.courses);
            setContentShow(false);
        } else {
            setContentShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            }); // messege - Ошибка при добавлении
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setSkeleton(false);
    };

    const publish = async (id_kafedra: number, course_id: number, status: boolean) => {
        setForDisabled(true);
        const data = await publishCourse(id_kafedra, teacher ? teacher.id : null, course_id, status);
        if (data) {
            // сразу показываем новое состояние, затем синхронизируемся с сервером
            setCourses((prev) => prev.map((c) => (c.id === course_id ? { ...c, is_published: status } : c)));
            await fetchDepartamentCourse();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: translations.errorTitle, detail: translations.tryAgainLater }
            }); // messege - Ошибка при добавлении
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setForDisabled(false);
    };

    useEffect(() => {
        fetchDepartamentCourse();
    }, []);

    const teacherName = `${teacher?.last_name ?? ''} ${teacher?.name ?? ''} ${teacher?.father_name ?? ''}`.trim();
    const publishedCount = courses.filter((c) => c.is_published).length;
    const query = search.trim().toLowerCase();
    const filtered = query ? courses.filter((c) => c.title?.toLowerCase().includes(query)) : courses;

    const courseHref = (course: DepCourseType) => `/faculty/${id_kafedra}/${teacher?.myedu_id}/${course.id}`;

    const courseImage = (course: DepCourseType, size: string) => (
        <span className={`${size} shrink-0 rounded-[12px] overflow-hidden bg-[#f1f5f9] border border-[#eef2f6]`}>
            {typeof course.image === 'string' ? (
                <img src={course.image} alt="Course" className="w-full h-full object-cover" />
            ) : (
                <img src={'/layout/images/no-image.png'} alt="No image" className="w-full h-full object-cover opacity-50" />
            )}
        </span>
    );

    const publishedChip = (isPublished: boolean) =>
        isPublished ? (
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#ecfdf3] text-[#16a34a] text-[0.75rem] font-semibold whitespace-nowrap">
                <i className="pi pi-check-circle text-[0.75rem]"></i>
                {translations.published}
            </span>
        ) : (
            <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[var(--redBgColor)] text-[var(--redColor)] text-[0.75rem] font-semibold whitespace-nowrap">
                <i className="pi pi-times-circle text-[0.75rem]"></i>
                {translations.notPublished}
            </span>
        );

    const publishSwitch = (course: DepCourseType) => <RoleSwitch isActive={Boolean(course.is_published)} disabled={forDisabled} onClick={() => publish(Number(id_kafedra), course.id, !course.is_published)} />;

    const content = () => {
        if (skeleton) return <GroupSkeleton count={5} size={{ width: '100%', height: '4.5rem' }} />;
        if (contentShow) return <FacultyEmpty icon="pi pi-exclamation-circle" text={translations.dataNotAvailable} />;
        if (contentNull) return <FacultyEmpty icon="pi pi-book" text={translations.coursesNotFound} />;
        if (filtered.length === 0) return <FacultyEmpty icon="pi pi-search" text={translations.nothingFound} />;

        return (
            <>
                {/* mobile */}
                <div className="flex flex-col gap-[10px] md:hidden">
                    {filtered.map((course, idx) => (
                        <div key={course.id} className={`${facultyCardClass} fade-up flex flex-col gap-[12px] p-[14px]`} style={{ animationDelay: `${Math.min(idx, 12) * 30}ms` }}>
                            <Link href={courseHref(course)} className="flex items-center gap-[12px] min-w-0">
                                {courseImage(course, 'w-[56px] h-[56px]')}
                                <span className="flex-1 min-w-0 text-[0.875rem] font-semibold leading-snug text-[var(--titleColor)] break-words">{course.title}</span>
                                <i className="pi pi-angle-right shrink-0 text-[0.875rem] text-[var(--text-color-secondary)]"></i>
                            </Link>
                            <div className="flex items-center justify-between gap-[8px] px-[10px] py-[8px] rounded-[10px] bg-[#f8fafc]">
                                {publishedChip(course.is_published)}
                                {publishSwitch(course)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* desktop */}
                <div className={`${facultyCardClass} hidden md:block p-[16px]`}>
                    <div className="overflow-x-auto scrollbar-thin border border-[#eef2f6] rounded-[14px]">
                        <table className="w-full min-w-[720px] text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f8fafc] border-b border-[#eef2f6] text-[0.6875rem] uppercase tracking-[0.04em] text-[var(--text-color-secondary)]">
                                    <th className="py-[12px] px-[16px] w-[48px] text-center font-semibold">#</th>
                                    <th className="py-[12px] px-[16px] font-semibold">{translations.title}</th>
                                    <th className="py-[12px] px-[16px] font-semibold w-[180px]">{translations.publication}</th>
                                    <th className="py-[12px] px-[20px] font-semibold w-[90px] text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((course, idx) => (
                                    <tr key={course.id} className="group fade-up border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fbfd] transition-colors" style={{ animationDelay: `${Math.min(idx, 12) * 25}ms` }}>
                                        <td className="py-[12px] px-[16px] text-center text-[0.75rem] font-semibold text-[var(--text-color-secondary)]">{idx + 1}</td>
                                        <td className="py-[12px] px-[16px]">
                                            <Link href={courseHref(course)} className="flex items-center gap-[12px] min-w-0">
                                                {courseImage(course, 'w-[48px] h-[48px]')}
                                                <span className="text-[0.875rem] font-semibold leading-snug text-[var(--titleColor)] group-hover:text-[var(--mainColor)] transition-colors break-words">{course.title}</span>
                                            </Link>
                                        </td>
                                        <td className="py-[12px] px-[16px]">{publishedChip(course.is_published)}</td>
                                        <td className="py-[12px] px-[20px]">
                                            <div className="flex justify-center">{publishSwitch(course)}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="flex flex-col gap-[16px]">
            <FacultyHeader
                icon="pi pi-book"
                title={translations.courses}
                count={courses.length}
                backHref={`/faculty/${id_kafedra}`}
                subtitle={
                    <span className="flex flex-wrap items-center gap-[8px]">
                        <span>{teacherName || translations.teacherCoursesHint}</span>
                        {courses.length > 0 && (
                            <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-[#ecfdf3] text-[0.6875rem] font-semibold text-[#16a34a]">
                                <i className="pi pi-check-circle text-[0.625rem]"></i>
                                {publishedCount} / {courses.length}
                            </span>
                        )}
                    </span>
                }
                search={search}
                onSearch={!skeleton && courses.length > 0 ? setSearch : undefined}
            />
            {content()}
        </div>
    );
}
