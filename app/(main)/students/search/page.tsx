'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { fetchStudentsForTeacher } from '@/services/student/studentSearch';
import SubTitle from '@/app/components/SubTitle';
import Link from 'next/link';
import useMediaQuery from '@/hooks/useMediaQuery';

type Student = {
    id: number;
    name: string;
    last_name: string;
    father_name: string;
    email: string;
    myedu_id: string;
    status: 'active' | 'inactive' | 'suspended';
    registrationDate: string;
};

const StudentSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [studentEmpty, setStudentsEmpty] = useState(false);
    const [startDisplay, setStartDisplay] = useState(true);
    const [mainSpinner, setMainSpinner] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const isMobile = useMediaQuery('(max-width: 640px)');

    const handleStudentSearch = async (term: string) => {
        setProgressSpinner(true);
        setMainSpinner(true);
        const data = await fetchStudentsForTeacher(term);

        if (data && data?.success) {
            setStartDisplay(false);
            if (data?.data.length > 0) {
                setStudents(data?.data);
                setStudentsEmpty(false);
            } else {
                setStudentsEmpty(true);
            }
        } else {
            setStartDisplay(true);
        }
        setProgressSpinner(false);
        setMainSpinner(false);
    };

    // Debounce effect for search input
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 1000);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedTerm) {
            handleStudentSearch(debouncedTerm);
        }
    }, [debouncedTerm]);

    const searchSection = (
        <div className="main-bg flex flex-col gap-1">
            <SubTitle title="Студенты" titleSize="2xl" mobileTitleSize="xl" />
            <span className="p-input-icon-left">
                <div className="flex items-center relative">
                    <InputText placeholder="Поиск..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-inputtext-sm p-inputtext-rounded" />
                    <div className="absolute right-1">{progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                </div>
            </span>
        </div>
    );

    const studentsDesktop = (
        <div className="card" style={{ padding: '2rem' }}>
            <DataTable value={students || []} rows={10} size="small" loading={mainSpinner} dataKey="id" emptyMessage="Студенты не найдены." className="p-datatable-customers text-sm">
                <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px' }} />
                <Column
                    field="name"
                    header={() => <span className="text-sm">ФИО</span>}
                    sortable
                    body={(rowData) => {
                        return (
                            <Link href={`/students/search/studentDetail/${rowData?.id}`} className="cursor-pointer flex flex-col text-[var(--mainColor)] underline">
                                <span>{rowData?.last_name}</span>
                                <span>{rowData?.name}</span>
                                <span>{rowData?.father_name}</span>
                            </Link>
                        );
                    }}
                    style={{ minWidth: '14rem' }}
                />
                <Column field="email" header={() => <span className="text-sm">Email</span>} sortable style={{ minWidth: '14rem' }} />
                <Column field="myedu_id" header={() => <span className="text-sm">Л/н</span>} sortable sortField="status" style={{ minWidth: '8rem' }} />
            </DataTable>
        </div>
    );

    const studentsMobile = (
        <div className="p-4 space-y-4">
            {students.map((student) => (
                <div key={student.id}>
                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                        <Link href={`/students/search/studentDetail/${student?.id}`} className="font-bold text-lg mb-2 text-[var(--mainColor))] underline">
                            {student.last_name} {student.name} {student.father_name}
                        </Link>
                        <div className="text-sm">
                            <span className="font-semibold">Email:</span> {student.email}
                        </div>
                        <div className="text-sm mt-1">
                            <span className="font-semibold">Личный номер:</span> {student.myedu_id}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col gap-2">
            {searchSection}

            {startDisplay ? (
                <div className="main-bg p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i className="pi pi-users text-3xl text-gray-400"></i>
                    </div>
                </div>
            ) : mainSpinner ? (
                <div className="main-bg flex justify-center items-center m-4">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} animationDuration=".5s" />
                </div>
            ) : studentEmpty ? (
                <b className='main-bg text-center '>Студенты не найдены</b>
            ) : isMobile ? (
                studentsMobile
            ) : (
                studentsDesktop
            )}
        </div>
    );
};

export default StudentSearchPage;
