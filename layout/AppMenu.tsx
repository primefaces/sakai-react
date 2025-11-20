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
import { addThemes, deleteTheme, fetchCourseInfo, fetchLessonShow, updateTheme } from '@/services/courses';
import FormModal from '@/app/components/popUp/FormModal';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { lessonSchema } from '@/schemas/lessonSchema';
import useErrorMessage from '@/hooks/useErrorMessage';
import { Button } from 'primereact/button';

const AppMenu = () => {
    const { user, setDeleteQuery, setUpdateeQuery, contextFetchThemes, contextThemes, contextFetchStudentThemes, contextStudentThemes, departament, contextNewStudentThemes } = useContext(LayoutContext);
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
    const { studentThemeCourse, subject_id } = useParams();
    const params = useParams();
    const course_Id = params.course_Id;
    const id_kafedra = params?.id_kafedra ? params.id_kafedra : null;

    const [courseList, setCourseList] = useState<test[]>([]);
    const [selectId, setSelectId] = useState<number | null>(null);
    const [visible, setVisisble] = useState(false);
    const [themeAddvisible, setThemeAddVisisble] = useState(false);
    const [editingLesson, setEditingLesson] = useState<{ title: string; sequence_number: number | null } | null>(null);
    const [themeValue, setThemeValue] = useState<{ title: string; sequence_number: number | null }>({ title: '', sequence_number: null });
    const [courseInfo, setCourseInfo] = useState<{ title: string } | null>(null);
    const [forDepartamentLength, setForDepartamentLength] = useState(false);

    const [themesStudentList, setThemesStudentList] = useState<{ key?: string; label: string; id: number; to: string; items?: AppMenuItem[] }[]>([]);

    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const byStatus: AppMenuItem[] = user?.is_working
        ? pathname.startsWith('/course/')
            ? [
                  {
                      // key: 'prev',
                      label: `${courseInfo?.title}`,
                      icon: 'pi pi-fw pi-arrow-left',
                      to: '/course'
                  },
                  {
                      label: 'Темы',
                      icon: 'pi pi-fw pi-calendar-clock',
                      items: courseList?.length > 0 ? courseList : []
                  }
              ]
            : !forDepartamentLength
            ? (user?.is_working && pathname.startsWith('/course')) ||
              pathname.startsWith('/students/') ||
              pathname.startsWith('/unVerifed') ||
              pathname.startsWith('/pdf/') ||
              pathname.startsWith('/videoInstruct/') ||
              pathname.startsWith('/notification') ||
              pathname.startsWith('/dashboard') ||
              pathname.startsWith('/openCourse')
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
                          label: 'Курсы',
                          icon: 'pi pi-fw pi-book',
                          to: '/course'
                      },
                      {
                          label: 'Видеоинструкция',
                          icon: 'pi pi-fw pi-video',
                          to: '/videoInstruct'
                      },
                      {
                          label: 'Непроверенные задания',
                          icon: 'pi pi-fw pi-clock',
                          to: '/unVerifed'
                      },
                    //   {
                    //       label: 'Общедоступные курсы',
                    //       icon: 'pi pi-fw pi-globe',
                    //       to: '/openCourse'
                    //   }
                  ]
                : []
            : []
        : user?.is_student
        ? pathname.startsWith('/teaching/lessonView/')
            ? [
                  {
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
                  { label: 'План обучения', icon: 'pi pi-fw pi-calendar-clock', to: '/teaching' },
                  //   pathname.startsWith('/teaching/lesson/') ? { label: 'Темы', icon: 'pi pi-fw pi-book', items: themesStudentList?.length > 0 ? themesStudentList : [] } : { label: '' },
                  pathname.startsWith('/teaching/lessonView/') ? { label: 'Темы', icon: 'pi pi-fw pi-book', items: themesStudentList?.length > 0 ? themesStudentList : [] } : { label: '' }
              ]
            : [
                  {
                      label: 'Главная страница',
                      icon: 'pi pi-home',
                      to: '/'
                  },
                  { label: 'План обучения', icon: 'pi pi-fw pi-calendar-clock', to: '/teaching' }
                  //   pathname.startsWith('/teaching/lesson/') ? { label: 'Темы', icon: 'pi pi-fw pi-book', items: themesStudentList?.length > 0 ? themesStudentList : [] } : { label: '' },
              ]
        : [];

    const forDepartament = forDepartamentLength
        ? !pathname.startsWith('/course/') && !pathname.startsWith('/pdf/')
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
                      label: 'Утвердить курсы',
                      icon: 'pi pi-graduation-cap',
                      to: '/faculty'
                  },
                  {
                      label: 'Курсы',
                      icon: 'pi pi-fw pi-book',
                      to: '/course'
                  },
                  {
                      label: 'Видеоинструкция',
                      icon: 'pi pi-fw pi-video',
                      to: '/videoInstruct'
                  },
                  {
                      label: 'Непроверенные задания',
                      icon: 'pi pi-fw pi-clock',
                      to: '/unVerifed'
                  },
                //   {
                //       label: 'Общедоступные курсы',
                //       icon: 'pi pi-fw pi-globe',
                //       to: '/openCourse'
                //   }
              ]
            : []
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

    const handleCourseInfo = async () => {
        const data = await fetchCourseInfo(Number(course_Id));
        if (data && data?.success) {
            setCourseInfo(data.course);
        }
    };

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

    const sentDelete = (item: any) => {
        const options = getConfirmOptions(Number(), () => handleDeleteTheme(item.id));
        confirmDialog(options);
    };

    useEffect(() => {
        if (user?.is_student) {
            const isTopicsChildPage = pathname.startsWith('/teaching/');
            if (isTopicsChildPage) {
                if (studentThemeCourse) {
                    contextFetchStudentThemes(1);
                }
            }
        }
    }, [user, studentThemeCourse]);

    useEffect(() => {
        if (contextThemes && contextThemes?.lessons) {
            const newThemes = contextThemes.lessons?.data?.map((item: any, idx: number) => ({
                label: `${idx + 1}. ${item.title}`,
                id: item.id,
                to: `/course/${course_Id}/${item.id}`,
                score: `Балл: ${item.steps_sum_score == null ? 0 : item.steps_sum_score}`,
                onEdit: () => {
                    selectedForEditing(item.id);
                },
                onDelete: () => sentDelete(item)
            }));

            setCourseList(newThemes);
        }
    }, [contextThemes]);

    useEffect(() => {
        if (course_Id) {
            handleCourseInfo();
        }

        if (contextNewStudentThemes) {
            const forThemes: any = [];
            contextNewStudentThemes?.map((item: any, idx) =>
                forThemes.push({
                    label: `${idx + 1}. ${item.title}` || '',
                    id: item.id,
                    to: `/teaching/lessonView/another/${subject_id}/${item.id}`
                })
            );
            if (forThemes.length > 0) {
                setThemesStudentList(forThemes || []);
            }
        }
    }, [contextNewStudentThemes, pathname]);

    useEffect(() => {
        if (departament.info.length < 1) {
            setForDepartamentLength(false);
        } else {
            setForDepartamentLength(true);
        }
    }, [departament, pathname]);

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
                footerValue={{ footerState: true, reject: 'Назад', next: 'Сохранить' }}
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
                                setThemeValue((prev) => prev && { ...prev, title: e.target.value });
                                setValue('title', e.target.value, { shouldValidate: true });
                            }}
                        />
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                    </div>
                </div>
            </FormModal>

            {/* <div className="flex flex-col h-screen"> */}
            <ul className="layout-menu max-h-[80%] overflow-y-auto scrollbar-thin-y">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
            {pathname.startsWith('/course/') && (
                <div className="">
                    <div className="p-4 mt-auto">
                        <Button label="Добавить тему" icon={'pi pi-plus'} className="cursor-pointer w-full py-2 px-4 rounded-lg transition" onClick={() => setThemeAddVisisble(true)}></Button>
                    </div>
                    <div className="flex justify-center gap-1 items-center">
                        <b>Всего баллов за курс</b>
                        <span className="text-[var(--mainColor)]">{contextThemes?.max_sum_score}</span>
                    </div>
                </div>
            )}
            {/* </div> */}
        </MenuProvider>
    );
};

export default AppMenu;
