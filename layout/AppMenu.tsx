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
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { addLocale } from 'primereact/api';

import { useLocalization } from './context/localizationcontext';

const AppMenu = () => {
    const { translations } = useLocalization();
    // types
    interface LessonInfoUi {
        title: string;
        sequence_number: number | null;
        from: Nullable<Date> | null;
        to: Nullable<Date> | null;
    }

    interface test {
        label: string;
        id: number;
        to?: string;
        items?: [];
        command?: () => void;
    }

    interface ForLinkRole {
        name: string;
        id: number | null;
        active: boolean;
        read: boolean;
    }

    interface MyApMenuType {
        label?: string;
        to?: string;
        icon?: string;
        profilact: string;
    }

    const { user, setMessage, setDeleteQuery, setUpdateeQuery, contextFetchThemes, contextThemes, departament, contextNewStudentThemes, contextVerifedValue, setContextVerifedValue, contextFetchVerifed } = useContext(LayoutContext);

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
    const [editingLesson, setEditingLesson] = useState<LessonInfoUi | null>(null);
    const [themeValue, setThemeValue] = useState<{ title: string; sequence_number: number | null }>({ title: '', sequence_number: null });
    const [courseInfo, setCourseInfo] = useState<{ title: string } | null>(null);
    const [forDepartamentLength, setForDepartamentLength] = useState(false);
    const [additional, setAdditional] = useState(false);
    const [zamDekanRole, setZamDekanRole] = useState<MyApMenuType>({ profilact: '' });
    const [adminRole, setAdminRole] = useState<MyApMenuType>({ profilact: '' });
    const [depRole, setDepRole] = useState<MyApMenuType>({ profilact: '' });
    const [testRole, setTestRole] = useState<MyApMenuType>({ profilact: '' });

    const [themesStudentList, setThemesStudentList] = useState<{ key?: string; label: string; id: number; to: string; items?: AppMenuItem[] }[]>([]);
    const [startDeadline, setStartDeadline] = useState<Nullable<Date>>(null);
    const [endDeadline, setEndDeadline] = useState<Nullable<Date>>(null);

    const showError = useErrorMessage();

    const ruLocale = {
        firstDayOfWeek: 1, // Monday
        dayNames: translations.dayNames,
        dayNamesShort: translations.dayNamesShort,
        dayNamesMin: translations.dayNamesMin,
        monthNames: translations.monthNames,
        monthNamesShort: translations.monthNamesShort,
        today: translations.today,
        clear: translations.clear,
        dateFormat: 'dd.mm.yy', // Your preferred format
        weekHeader: translations.weekHeader
    };

    addLocale('ru', ruLocale);

    const byStatus: AppMenuItem[] = user?.is_working
        ? pathname.startsWith('/course/detail/')
            ? [
                  {
                      // key: 'prev',
                      label: `${courseInfo?.title}`,
                      icon: 'pi pi-fw pi-arrow-left',
                      //   to: '/course/'
                      command: () => {
                          router.back();
                      }
                  },
                  {
                      label: translations.themes,
                      icon: 'pi pi-fw pi-calendar-clock',
                      items: courseList?.length > 0 ? courseList : []
                  }
              ]
            : !forDepartamentLength
            ? (user?.is_working && pathname.startsWith('/course/')) ||
              pathname.startsWith('/students/') ||
              pathname.startsWith('/unVerifed') ||
              pathname.startsWith('/pdf/') ||
              pathname.startsWith('/videoInstruct/') ||
              pathname.startsWith('/notification') ||
              pathname.startsWith('/dashboard') ||
              pathname.startsWith('/openCourse/') ||
              pathname.startsWith('/roles/') ||
              pathname.startsWith('/archive')
                ? ([
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
                          label: translations.mainPage,
                          icon: 'pi pi-home',
                          to: '/'
                      },
                      {
                          label: translations.controlPanel,
                          icon: 'pi pi-th-large',
                          to: '/dashboard'
                      },
                      zamDekanRole?.label ? zamDekanRole : null,
                      adminRole?.label ? adminRole : null,
                      depRole?.label ? depRole : null,
                      testRole?.label ? testRole : null,
                      {
                          label: translations.courses,
                          icon: 'pi pi-fw pi-book',
                          to: '/course/1'
                      },
                      {
                          label: translations.videoInstruction,
                          icon: 'pi pi-fw pi-video',
                          to: '/videoInstruct'
                      },
                      {
                          label: translations.unverifiedTasks,
                          icon: 'pi pi-fw pi-clock',
                          to: '/unVerifed',
                          extra: (
                              <div className="p-overlay-badge">
                                  {/* Условное отображение красного кружка (бэйджа) */}
                                  {contextVerifedValue?.length ? (
                                      <div className="relative">
                                          <div className={`absolute -right-3 -top-3 px-1 bg-[var(--amberColor)] rounded text-white text-[11px]`}>{contextVerifedValue?.length}</div>
                                          <button className={`cursor-pointer flex gap-2 items-center px-0 bg-white text-blue-300 p-2 font-bold`} />
                                      </div>
                                  ) : (
                                      ''
                                  )}
                              </div>
                          )
                      },
                      {
                          label: translations.openOnlineCourses,
                          icon: 'pi pi-fw pi-globe',
                          to: '/openCourse/1'
                      },
                      {
                          label: translations.myActiveCourses,
                          icon: 'pi pi-play-circle',
                          to: '/openCourse/activeCourse'
                      },
                      {
                          label: translations.notifications,
                          icon: 'pi pi-bell',
                          to: '/notifications'
                      },
                      {
                          label: translations.searchStudents,
                          icon: 'pi pi-search',
                          to: '/students/search'
                      },
                      {
                          label: translations.archiveCourses,
                          icon: 'pi pi-inbox',
                          to: '/archive'
                      }
                  ].filter(Boolean) as AppMenuItem[])
                : []
            : []
        : user?.is_student
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
                  label: translations.mainPage,
                  icon: 'pi pi-home',
                  to: '/'
              },
              {
                  label: translations.controlPanel,
                  icon: 'pi pi-th-large',
                  to: '/studentHome'
              },
              { label: translations.trainingPlan, icon: 'pi pi-fw pi-calendar-clock', to: '/teaching' },
              {
                  label: translations.openOnlineCourses,
                  icon: 'pi pi-fw pi-globe',
                  to: '/openCourse/1'
              },
              {
                  label: translations.myActiveCourses,
                  icon: 'pi pi-play-circle',
                  to: '/openCourse/activeCourse'
              },
              {
                  label: translations.notifications,
                  icon: 'pi pi-bell',
                  to: '/notifications'
              }
              //   pathname.startsWith('/teaching/lesson/') ? { label: 'Темы', icon: 'pi pi-fw pi-book', items: themesStudentList?.length > 0 ? themesStudentList : [] } : { label: '' },
          ]
        : [];

    const forDepartament = forDepartamentLength
        ? !pathname.startsWith('/course//') && !pathname.startsWith('/pdf/')
            ? ([
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
                      label: translations.mainPage,
                      icon: 'pi pi-home',
                      to: '/'
                  },
                  {
                      label: translations.controlPanel,
                      icon: 'pi pi-th-large',
                      to: '/dashboard'
                  },
                  zamDekanRole?.label ? zamDekanRole : null,
                  adminRole?.label ? adminRole : null,
                  depRole?.label ? depRole : null,
                  testRole?.label ? testRole : null,
                  {
                      label: translations.approveCourses,
                      icon: 'pi pi-graduation-cap',
                      to: '/faculty'
                  },
                  {
                      label: translations.courses,
                      icon: 'pi pi-fw pi-book',
                      to: '/course/1'
                  },
                  {
                      label: translations.videoInstruction,
                      icon: 'pi pi-fw pi-video',
                      to: '/videoInstruct'
                  },
                  {
                      label: translations.unverifiedTasks,
                      icon: 'pi pi-fw pi-clock',
                      to: '/unVerifed',
                      extra: (
                          <div className="p-overlay-badge">
                              {/* Условное отображение красного кружка (бэйджа) */}
                              {contextVerifedValue?.length ? (
                                  <div className="relative">
                                      <div className={`absolute -right-3 -top-3 px-1 bg-[var(--amberColor)] rounded text-white text-[11px]`}>{contextVerifedValue?.length}</div>
                                      <button className={`cursor-pointer flex gap-2 items-center px-0 bg-white text-blue-300 p-2 font-bold`} />
                                  </div>
                              ) : (
                                  ''
                              )}
                          </div>
                      )
                  },
                  {
                      label: translations.openOnlineCourses,
                      icon: 'pi pi-fw pi-globe',
                      to: '/openCourse/1'
                  },
                  {
                      label: translations.myActiveCourses,
                      icon: 'pi pi-play-circle',
                      to: '/openCourse/activeCourse'
                  },
                  {
                      label: translations.notifications,
                      icon: 'pi pi-bell',
                      to: '/notifications'
                  },
                  {
                      label: translations.searchStudents,
                      icon: 'pi pi-search',
                      to: '/students/search'
                  },
                  {
                      label: translations.archiveCourses,
                      icon: 'pi pi-inbox',
                      to: '/archive'
                  }
              ].filter(Boolean) as AppMenuItem[])
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
            setEditingLesson({ title: data.lesson.title, sequence_number: data.lesson.sequence_number, from: data.lesson.from ? new Date(data.lesson.from) : null, to: data.lesson.to ? new Date(data.lesson.to) : null });
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
        setAdditional(false);
        setEndDeadline(null);
        setStartDeadline(null);
    };

    // add theme
    const handleAddTheme = async () => {
        const deadline = { from: startDeadline, to: endDeadline };

        const data = await addThemes(Number(course_Id), themeValue?.title ? themeValue?.title : '', themeValue.sequence_number, deadline);
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
        const deadline = { from: editingLesson?.from, to: editingLesson?.to };

        const data = await updateTheme(Number(course_Id), selectId, editingLesson?.title ? editingLesson?.title : '', editingLesson?.sequence_number ? editingLesson?.sequence_number : null, deadline);
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
        // unverifed
        if (user && user?.is_working) {
            contextFetchVerifed();
        }

        if (user && user?.roles?.length > 0) {
            const roles = user.roles;
            const forRole: ForLinkRole[] = [];
            roles.forEach((role) => {
                if (role?.pivot?.active) {
                    const timeRole: ForLinkRole = {
                        name: role.title,
                        id: role.id,
                        active: true,
                        read: role?.pivot?.read
                    };

                    forRole.push(timeRole);
                }
            });
            if (forRole && forRole?.length > 0) {
                const forAdmin = forRole.find((item) => item.id === 1);
                if (forAdmin) {
                    setAdminRole({ label: translations.admin, icon: 'pi pi-shield', to: '/roles/1', profilact: '' });
                    setZamDekanRole({ label: translations.teacherCheck, icon: 'pi pi-check-square', to: '/roles/teacherCheck', profilact: '' });
                }

                const forDep = forRole.find((item) => item.id === 2);
                if (forDep) {
                    setDepRole({ label: translations.department, icon: 'pi pi-briefcase', to: '/roles/departament/1', profilact: '' });
                }

                const forReduct = forRole.find((item) => item.id === 3);
                if (forReduct && forReduct?.read) {
                    setTestRole({ label: translations.cancellationOfWorks, icon: 'pi pi-users', to: '/roles/students/1', profilact: '' });
                }
            }
        }
    }, [user, studentThemeCourse]);

    useEffect(() => {
        if (contextThemes && contextThemes?.lessons) {
            const newThemes = contextThemes.lessons?.data?.map((item: any, idx: number) => ({
                label: `${idx + 1}. ${item.title}`,
                id: item.id,
                to: `/course/detail/${course_Id}/${item.id}`,
                score: `${translations.score}: ${item.steps_sum_score == null ? 0 : item.steps_sum_score}`,
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
                title={translations.edit}
                fetchValue={() => {
                    handleUpdate();
                }}
                clearValues={clearValues}
                visible={visible}
                setVisible={setVisisble}
                start={false}
                footerValue={{ footerState: true, reject: translations.back, next: translations.save }}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col w-full items-center gap-2">
                        <div className="w-full flex flex-col justify-center items-center">
                            <span>{translations.position}:</span>
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
                                placeholder={translations.courseName}
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
                    <span className="w-[90%] cursor-pointer ml-1 text-[13px] sm:text-sm text-[var(--mainColor)] flex justify-end" onClick={() => setAdditional((prev) => !prev)}>
                        {translations.addAdditionally} {additional ? '-' : '+'}
                    </span>
                    {additional && (
                        <>
                            <p className="text-sm sm:text-[16px] py-2 text-center">{translations.lessonsAvailableUntilDate}</p>
                            <div className="w-full flex flex-col">
                                <div className="w-full flex flex-col sm:flex-row justify-evenly items-center gap-1">
                                    <div className="flex flex-col items-center">
                                        {/* {editingLesson.from} */}
                                        <span className="text-sm">{translations.start}</span>
                                        <Calendar
                                            value={editingLesson ? editingLesson.from : null}
                                            locale="ru" // Указываем русскую локаль
                                            dateFormat="yy.mm.yy"
                                            className="p-inputtext-sm"
                                            onChange={(e) => {
                                                setEditingLesson((prev) => prev && { ...prev, from: e.value });
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        {/* {editingLesson.to} */}
                                        <span className="text-sm">{translations.end}</span>
                                        <Calendar
                                            value={editingLesson ? editingLesson.to : null}
                                            locale="ru" // Указываем русскую локаль
                                            dateFormat="dd.mm.yy"
                                            className="p-inputtext-sm"
                                            onChange={(e) => {
                                                setEditingLesson((prev) => prev && { ...prev, to: e.value });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </FormModal>

            <FormModal
                title={translations.add}
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
                        <span>{translations.position}:</span>
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
                        <span>{translations.title}</span>
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
                    <span className="w-[90%] cursor-pointer ml-1 text-[13px] sm:text-sm text-[var(--mainColor)] flex justify-end" onClick={() => setAdditional((prev) => !prev)}>
                        {translations.addAdditionally} {additional ? '-' : '+'}
                    </span>
                    {additional && (
                        <>
                            <p className="text-sm sm:text-[16px] py-2 text-center">{translations.lessonsAvailableUntilDate}</p>
                            <div className="w-full flex flex-col">
                                <div className="w-full flex flex-col sm:flex-row justify-evenly items-center gap-1">
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm">{translations.start}</span>
                                        <Calendar
                                            value={startDeadline}
                                            locale="ru" // Указываем русскую локаль
                                            dateFormat="dd.mm.yy"
                                            className="p-inputtext-sm"
                                            onChange={(e) => setStartDeadline(e.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm">{translations.end}</span>
                                        <Calendar
                                            value={endDeadline}
                                            locale="ru" // Указываем русскую локаль
                                            dateFormat="dd.mm.yy"
                                            className="p-inputtext-sm"
                                            onChange={(e) => setEndDeadline(e.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </FormModal>

            {/* <div className="flex flex-col h-screen"> */}
            <ul className={`layout-menu max-h-[80%] overflow-y-auto scrollbar-thin-y`}>
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
            {pathname.startsWith('/course/detail/') && (
                <div>
                    <div className="p-4 mt-auto">
                        <Button label={translations.add} icon={'pi pi-plus'} className="cursor-pointer w-full py-2 px-4 rounded-lg transition" onClick={() => setThemeAddVisisble(true)}></Button>
                    </div>
                    <div className="flex justify-center gap-1 items-center">
                        <b>{translations.totalPointsForCourse}</b>
                        <span className="text-[var(--mainColor)]">{contextThemes?.max_sum_score}</span>
                    </div>
                </div>
            )}
            {/* </div> */}
        </MenuProvider>
    );
};

export default AppMenu;
