/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { confirmDialog } from 'primereact/confirmdialog';
import { addThemes, deleteTheme, fetchLessonShow, updateTheme } from '@/services/courses';
import FormModal from '@/app/components/popUp/FormModal';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { lessonSchema } from '@/schemas/lessonSchema';
import useErrorMessage from '@/hooks/useErrorMessage';
import { Button } from 'primereact/button';

const AppMenu = () => {
    const { user, setDeleteQuery, setUpdateeQuery, contextFetchThemes, contextThemes, contextFetchStudentThemes, contextStudentThemes, departament } = useContext(LayoutContext);
    interface test {
        label: string;
        id: number;
        to?: string;
        items?: [];
        command?: () => void;
    }

    // validate
    const {
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(lessonSchema),
        mode: 'onChange'
    });

    const router = useRouter();
    const location = usePathname();
    const pathname = location;
    const { studentThemeCourse } = useParams();
    const params = useParams();
    const course_Id = params.course_Id;
    const id_kafedra = params?.id_kafedra ? params.id_kafedra : null;

    const [courseList, setCourseList] = useState<test[]>([]);
    const [selectId, setSelectId] = useState<number | null>(null);
    const [visible, setVisisble] = useState(false);
    const [themeAddvisible, setThemeAddVisisble] = useState(false);
    const [editingLesson, setEditingLesson] = useState<{ title: string; sequence_number: number | null } | null>(null);
    const [themeValue, setThemeValue] = useState<{ title: string; sequence_number: number | null }>({ title: '', sequence_number: null });

    const [themesStudentList, setThemesStudentList] = useState<{ key?: string; label: string; id: number; to: string; items?: AppMenuItem[] }[]>([]);

    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const byStatus: AppMenuItem[] = user?.is_working
        ? pathname.startsWith('/course/')
            ? [
                  {
                      // key: 'prev',
                      label: '',
                      icon: 'pi pi-fw pi-arrow-left',
                      to: '/course'
                  },
                  {
                      label: 'Темы',
                      icon: 'pi pi-fw pi-calendar-clock',
                      items: courseList?.length > 0 ? courseList : []
                  }
              ]
            : []
        : user?.is_student
        ? [
              { label: 'План обучения', icon: 'pi pi-fw pi-calendar-clock', to: '/teaching' },
              pathname.startsWith('/teaching/lesson/') ? { label: 'Темы', icon: 'pi pi-fw pi-book', items: themesStudentList?.length > 0 ? themesStudentList : [] } : { label: '' }
          ]
        : [];

    const forDepartament =
        !pathname.startsWith('/course/') && departament.info.length > 0
            ? [
                  {
                      // key: 'prev',
                      label: '',
                      icon: 'pi pi-fw pi-arrow-left',
                      to: '#',
                      command: () => {
                          router.back();
                      }
                  },
                  {
                      label: 'Главная страница',
                      icon: 'pi pi-home',
                      to: '/'
                  },
                  {
                      label: 'Факультет',
                      icon: 'pi pi-graduation-cap',
                      to: '/faculty'
                  },
                  {
                      label: 'Курсы',
                      icon: 'pi pi-fw pi-book',
                      to: '/course'
                  }
              ]
            : [];

    const model: AppMenuItem[] = [
        {
            // key: 'Департамент',
            label: ' ',
            items: forDepartament
        },
        {
            // key: 'Основной',
            label: '  ',
            items: byStatus
        }
    ];

    const selectedForEditing = (id: number) => {
        setSelectId(id);
        setVisisble(true);
        editing(id);
    };

    const editing = async (id: number) => {
        const data = await fetchLessonShow(id);
        if (data.lesson) {
            setEditingLesson({ title: data.lesson.title, sequence_number: data.lesson.sequence_number });
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

    const clearValues = () => {
        setThemeValue({ title: '', sequence_number: null });
        setEditingLesson(null);
        setSelectId(null);
    };

    // add theme
    const handleAddTheme = async () => {
        const data = await addThemes(Number(course_Id), themeValue?.title ? themeValue?.title : '', themeValue.sequence_number);
        if (data?.success) {
            contextFetchThemes(Number(course_Id), id_kafedra ? Number(id_kafedra) : null);
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setEditingLesson(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при добавлении!', detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleDeleteTheme = async (id: number) => {
        const data = await deleteTheme(id);
        if (data.success) {
            contextFetchThemes(Number(course_Id), id_kafedra ? Number(id_kafedra) : null);
            setDeleteQuery(true);
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
                showError(data.response.status);
            }
        }
    };

    // update document
    const handleUpdate = async () => {
        const data = await updateTheme(Number(course_Id), selectId, editingLesson?.title ? editingLesson?.title : '', editingLesson?.sequence_number ? editingLesson?.sequence_number : null);
        if (data?.success) {
            setUpdateeQuery(true);
            contextFetchThemes(Number(course_Id), id_kafedra ? Number(id_kafedra) : null);
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно изменено!', detail: '' }
            });
        } else {
            setEditingLesson(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при изменении!', detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const sentDelete = (item: any) => {
        console.log('Delete theme ID:', item.id);
        const options = getConfirmOptions(Number(), () => handleDeleteTheme(item.id));
        confirmDialog(options);
    };

    useEffect(() => {
        if (user?.is_student) {
            const isTopicsChildPage = pathname.startsWith('/teaching/');
            if (isTopicsChildPage) {
                console.log('Вызов функции тем студента');
                if (studentThemeCourse) {
                    console.log(studentThemeCourse);
                    contextFetchStudentThemes(1);
                }
            }
        }
    }, [user, studentThemeCourse]);

    useEffect(() => {
        if (contextThemes && contextThemes.lessons) {
            const newThemes = contextThemes.lessons.data.map((item: any, idx: number) => ({
                label: `${idx + 1}. ${item.title}`,
                id: item.id,
                to: `/course/${course_Id}/${item.id}`,
                onEdit: () => {
                    selectedForEditing(item.id);
                },
                onDelete: () => sentDelete(item)
            }));

            setCourseList(newThemes);
        }
    }, [contextThemes]);

    useEffect(() => {
        if (contextStudentThemes?.lessons) {
            const forThemes: any = [];
            contextStudentThemes.lessons.data?.map((item: any) =>
                forThemes.push({
                    label: item.title || '',
                    id: item.id,
                    to: `/teaching/${studentThemeCourse}/${item.id}`
                })
            );
            if (forThemes.length > 0) {
                setThemesStudentList(forThemes || []);
            }
        }
    }, [contextStudentThemes, pathname]);

    return (
        <MenuProvider>
            <FormModal
                title={'Обновить тему'}
                fetchValue={() => {
                    handleUpdate();
                }}
                clearValues={clearValues}
                visible={visible}
                setVisible={setVisisble}
                start={false}
            >
                <div className="flex flex-col w-full items-center gap-2">
                    <div className="w-full flex flex-col justify-center items-center">
                        <span>Позиция:</span>
                        <InputText
                            type="number"
                            value={String(editingLesson?.sequence_number)}
                            className="w-[90%]"
                            onChange={(e) => {
                                setEditingLesson((prev) => prev && { ...prev, sequence_number: Number(e.target.value) });
                            }}
                        />
                    </div>
                    <div className="w-full flex flex-col gap-1 items-center justify-center">
                        <InputText
                            type="text"
                            placeholder="Название"
                            className="w-[90%]"
                            value={editingLesson?.title && editingLesson?.title}
                            onChange={(e) => {
                                console.log(editingLesson);
                                setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                setValue('title', e.target.value, { shouldValidate: true });
                            }}
                        />
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                    </div>
                </div>
            </FormModal>

            <FormModal
                title={'Добавить тему'}
                fetchValue={() => {
                    handleAddTheme();
                }}
                clearValues={clearValues}
                visible={themeAddvisible}
                setVisible={setThemeAddVisisble}
                start={false}
            >
                <div className="flex flex-col w-full items-center gap-2">
                    <div className="w-full flex flex-col justify-center items-center">
                        <span>Позиция:</span>
                        <InputText
                            type="number"
                            // className="w-[50px] sm:w-[70px]"
                            className="w-[90%]"
                            onChange={(e) => {
                                setThemeValue((prev) => prev && { ...prev, sequence_number: Number(e.target.value) });
                            }}
                        />
                    </div>
                    <div className="w-full flex flex-col gap-1 items-center justify-center">
                        <span>Название</span>
                        <InputText
                            type="text"
                            className="w-[90%]"
                            value={themeValue?.title && themeValue?.title}
                            onChange={(e) => {
                                console.log(e.target.value, themeValue);
                                setThemeValue((prev) => prev && { ...prev, title: e.target.value });
                                setValue('title', e.target.value, { shouldValidate: true });
                            }}
                        />
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                    </div>
                </div>
            </FormModal>

            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
            {pathname.startsWith('/course/') && (
                <div className="p-4 mt-auto">
                    <Button label="Добавить тему" icon={'pi pi-plus'} className="cursor-pointer w-full py-2 px-4 rounded-lg transition" onClick={() => setThemeAddVisisble(true)}></Button>
                </div>
            )}
        </MenuProvider>
    );
};

export default AppMenu;
