'use client';

import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useMediaQuery from '@/hooks/useMediaQuery';
import { fetchStudentDetail } from '@/services/streams';
import { fetchStudentSearchDetail, fetchStudentSearchImg } from '@/services/student/studentSearch';
import { RoleUserType } from '@/types/roles/RoleUserType';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

interface StudentDetail extends RoleUserType {
    birth_date: string;
}

interface StudentInfo {
    title: string;
    id: number;
    modules: {score: number, id_stream: number}[];
}

const StudentDetailPage = () => {
    const { id_student } = useParams();
    const media = useMediaQuery('(max-width: 640px)');

    const [skeleton, setSkeleton] = useState(true);
    const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(null);
    const [profileImg, setImg] = useState<{ image_url: string; id: number } | null>(null);
    const [courses, setCourses] = useState<StudentInfo[]>([]);

    const handleFetchStudentDetail = async () => {
        // setSkeleton(true);
        const data = await fetchStudentSearchDetail(Number(id_student));
        console.log(data);
        if (data?.success) {
            setStudentDetail(data?.student);
            setCourses(data?.data);
        } else {
        }
        setSkeleton(false);
    };

    const handleFetchStudentImg = async () => {
        const data = await fetchStudentSearchImg(Number(id_student));
        console.log(data);
        if (data?.success) {
            setImg({ image_url: data?.data?.image_url, id: data?.data?.id });
        }
    };

    const coursesTable = (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th scope="col" className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Название курса
                        </th>
                        <th scope="col" className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Модуль
                        </th>
                        <th scope="col" className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Балл
                        </th>
                        <th scope="col" className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                        <tr key={course?.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-4 py-5 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{course?.title}</div>
                            </td>
                            <td className="px-4 py-5 whitespace-nowrap">
                                <div className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full`}>
                                    {course?.modules?.length ? (
                                        <div className="flex items-center gap-1">
                                            <i className="pi pi-check text-[green]" style={{ fontSize: '12px' }}></i>
                                            <span>Сдан</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <i className="pi pi-times text-[red]" style={{ fontSize: '12px' }}></i>
                                            <span>Не сдан</span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-5 whitespace-nowrap">
                                <div className="text-sm text-gray-800">{course?.modules[0]?.score}</div>
                            </td>
                            <td className="px-4 py-5 whitespace-nowrap">
                                <div className="text-sm text-gray-800">{course?.modules[0]?.id_stream}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const coursesMobile = (
        <div className="space-y-4">
            {courses.map((course) => (
                <div key={course?.id} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="text-lg font-bold text-gray-900 mb-3">{course?.title}</div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-500">Балл:</span>
                        <span className="text-sm text-gray-800 font-semibold">{course?.modules[0]?.score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Модуль:</span>
                        <div className={`py-1 inline-flex text-xs leading-5 font-semibold rounded-full`}>
                            {course?.modules?.length ? (
                                <div className="flex items-center gap-1">
                                    <i className="pi pi-check text-[green]" style={{ fontSize: '12px' }}></i>
                                    <b>Сдан</b>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <i className="pi pi-times text-[red]" style={{ fontSize: '12px' }}></i>
                                    <b>Не сдан</b>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-sm text-[var(--mainColor)] flex justify-end mt-1">ID {course?.modules[0]?.id_stream}</div>
                </div>
            ))}
        </div>
    );

    useEffect(() => {
        handleFetchStudentDetail();
        handleFetchStudentImg();
    }, []);

    if (skeleton) {
        return (
            <div className="flex flex-col gap-4 w-full">
                <GroupSkeleton count={1} size={{ width: '100%', height: '150px' }} />
                <GroupSkeleton count={1} size={{ width: '100%', height: '400px' }} />
            </div>
        );
    }

    return (
        <div className="p-2 sm:px-4 bg-gray-50 min-h-screen">
            <div className="sm:max-w-5xl mx-auto">
                {/* Student Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                    <div className="min-w-35 min-h-33 max-w-36 max-h-34 rounded-2xl overflow-hidden border-2 border-white shadow-md ring-2 ring-gray-100 flex items-center justify-center bg-gray-50">
                        <img src={profileImg?.image_url ? profileImg?.image_url : '/layout/images/no-image.png'} alt="Фото студента" className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            {studentDetail?.last_name} {studentDetail?.name} {studentDetail?.father_name}
                        </h1>
                        <p className="text-gray-600 mt-2">{studentDetail?.email}</p>
                        <div className="mt-4 space-y-2 text-gray-700">
                            <p>
                                <strong>Личный номер:</strong> <span className="text-[var(--mainColor)]">{studentDetail?.myedu_id}</span>
                            </p>
                            <p>
                                <strong>Год рождения:</strong> <span className="text-[var(--mainColor)]">{studentDetail?.birth_date || '-'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Курсы</h2>
                    {media ? coursesMobile : coursesTable}
                </div>
            </div>
        </div>
    );
};

export default StudentDetailPage;
