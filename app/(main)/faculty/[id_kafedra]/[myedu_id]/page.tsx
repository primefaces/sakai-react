'use client';

import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { publishCourse } from '@/services/courses';
import { depCourse } from '@/services/faculty';
import { CourseType } from '@/types/courseType';
import { mainStepsType } from '@/types/mainStepType';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useContext, useEffect, useState } from 'react';

export default function CoursesDep() {
    interface kafedraInfoType {
        birth_date: string | null;
        courses: [];
        created_at: string;
        email: string;
        email_verified_at: string | null;
        father_name: string;
        id: number;
        is_student: boolean;
        is_working: boolean;
        last_name: string;
        myedu_id: number;
        name: string;
        phone: string;
        pin: number;
        updated_at: string;
    }

    const { id_kafedra, myedu_id } = useParams();

    const [courses, setCourses] = useState<kafedraInfoType[]>([]);
    const [contentShow, setContentShow] = useState<boolean>(false);
    const [contentNull, setContentNull] = useState<boolean>(false);
    const [teacher, setTeacher] = useState<{id: number; myedu_id: number;} | null>(null);
    const [forDisabled, setForDisabled] = useState(false);
    const [skeleton, setSkeleton] = useState(false);

    const { setMessage, setGlobalLoading } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const fetchDepartamentCourse = async () => {
        const data = await depCourse(Number(myedu_id), Number(id_kafedra));
        console.log(data);
        
        if (data && data?.courses) {
            if(data.courses?.length < 1){
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
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            }); // messege - Ошибка при добавлении
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const publish = async (id_kafedra: number, course_id: number, status: boolean) => {
        setForDisabled(true);
        const data = await publishCourse(id_kafedra, teacher ? teacher.id : null, course_id, status);
        if (data) {
            setForDisabled(false);
            fetchDepartamentCourse();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setForDisabled(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            }); // messege - Ошибка при добавлении
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const imageBodyTemplate = (product: CourseType) => {
        const image = product.image;

        if (typeof image === 'string') {
            return (
                <div className="flex justify-center w-[50px] h-[50px] mx-4" key={product.id}>
                    <img src={image} alt="Course image" className="w-full object-cover shadow-2 border-round" />
                </div>
            );
        }

        return (
            <div className="flex justify-center w-[50px] h-[50px] mx-4" key={product.id}>
                <img src={'/layout/images/no-image.png'} alt="Course image" className="w-full object-cover shadow-2 border-round" />
            </div>
        );
    };

    useEffect(() => {
        fetchDepartamentCourse();
    }, []);

    if(contentNull) return <NotFound titleMessage="Курсы отсутствуют" />

    return (
        <div className='main-bg'>
            {skeleton ? <div className="w-full"><GroupSkeleton count={5} size={{ width: '100%', height: '3rem' }} /></div>
             : contentShow ? (
                <NotFound titleMessage="Курсы не доступны" />
            ) : (
                <>
                    <h3 className="text-xl sm:text-2xl pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">Курсы</h3>
                    <DataTable value={courses} dataKey="id" emptyMessage="Загрузка" key={JSON.stringify(forDisabled)} responsiveLayout="stack" breakpoint="960px" rows={5} className="my-custom-table">
                        <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px' }}></Column>
                        <Column body={imageBodyTemplate}></Column>
                        <Column
                            field="title"
                            header="Название"
                            style={{ width: '80%' }}
                            body={(rowData) => (
                                <Link href={`/faculty/${id_kafedra}/${teacher?.myedu_id}/${rowData.id}`} key={rowData.id}>
                                    {rowData.title}
                                </Link>
                            )}
                        ></Column>
                        <Column
                            header="Публикация"
                            body={(rowData) => (
                                <div key={rowData.id} className='flex justify-center items-center'>
                                    {!rowData.is_published ? (
                                        <button className={`theme-toggle ${forDisabled && 'opacity-5'}`} disabled={forDisabled} onClick={() => publish(Number(id_kafedra), rowData.id, true)} aria-pressed="false">
                                            <span className="right">
                                                <span className="option option-left" aria-hidden></span>
                                                <span className="option option-right" aria-hidden></span>
                                                <span className="knob" aria-hidden></span>
                                            </span>
                                        </button>
                                    ) : (
                                        <button className={`theme-toggle ${forDisabled && 'opacity-5'}`} disabled={forDisabled} onClick={() => publish(Number(id_kafedra), rowData.id, false)} aria-pressed="false">
                                            <span className="track">
                                                <span className="option option-left" aria-hidden></span>

                                                <span className="option option-right" aria-hidden>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-label="Опубликовано">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <path d="M9 12l2 2 4-4"></path>
                                                    </svg>
                                                </span>

                                                <span className="knob" aria-hidden></span>
                                            </span>
                                        </button>
                                    )}
                                </div>
                            )}
                        ></Column>
                    </DataTable>
                </>
            )}
        </div>
    );
}
