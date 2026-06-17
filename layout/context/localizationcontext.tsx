'use client';
import React, { useState, createContext, useContext, useEffect } from 'react';

// IMPORTANT: The Kyrgyz translations are machine-translated and should be reviewed by a native speaker.
export const localizationData = {
    ru: {
        oshSU: 'ОшГУ',

        // General
        search: 'Поиск',
        profile: 'Профиль',
        settings: 'Настройки',
        logout: 'Выйти',
        welcome: 'Добро пожаловать',
        all: 'Все',
        save: 'Сохранить',
        add: 'Добавить',
        edit: 'Редактировать',
        update: 'Обновить',
        delete: 'Удалить',
        cancel: 'Отмена',
        back: 'Назад',
        next: 'Далее',
        send: 'Отправить',
        close: 'Закрыть',
        open: 'Открыть',
        goTo: 'Перейти',
        linkLabel: 'Ссылка',
        videoAlt: 'Видео',
        copy: 'Копировать',
        copied: 'Скопировано',
        description: 'Описание',
        error: 'Ошибка',
        success: 'Успех',
        loading: 'Загрузка',
        noData: 'Нет данных',
        reason: 'Причина',
        yes: 'Да',
        no: 'Нет',
        confirmation: 'Подтверждение',
        confirmationWindow: 'Окно подтверждения',
        deleteHeader: 'Удаление',
        confirmDeleteMessage: 'Вы действительно хотите удалить?',
        fullName: 'ФИО',
        lastVisit: 'Последнее посещение',
        completedActions: 'Выполненные действия',
        dataLabel: 'Данные',
        idLabel: 'Id',
        saveToMyedu: 'Сохранить в myedu',
        periodExportShedule: 'Период экспорта',
        accessExportStatus: 'Экспорт доступен',
        accessExportStatusFalse: 'Экспорт не доступен',

        // Home
        convenientOnlineLearningSpace: 'Удобное онлайн-пространство для обучения',
        welcomeToDistanceLearningPortal: 'Добро пожаловать на портал дистанционного обучения!',
        weUniteUniversityProjects: 'Мы объединяем проекты университета в сфере онлайн-образования:',
        openOnlineHome: 'Открытые онлайн-курсы',
        higherEducationPrograms: 'Программы высшего образования',
        backHome: 'Перейти в главную страницу',

        // AppTopbar
        oldMooc: 'Старый Mooc',
        digitalCampusOshSU: 'Цифровой кампус ОшГУ',
        login: 'Вход',
        exit: 'Выход',
        notification: 'Уведомление',

        // AppMenu
        mainPage: 'Главная страница',
        controlPanel: 'Панель управления',
        courses: 'Курсы',
        videoInstruction: 'Видеоинструкция',
        unverifiedTasks: 'Непроверенные задания',
        openOnlineCourses: 'Открытые онлайн курсы',
        myActiveCourses: 'Мои активные курсы',
        notifications: 'Уведомления',
        searchStudents: 'Поиск студентов',
        archiveCourses: 'Архив курсов',
        approveCourses: 'Утвердить курсы',
        admin: 'Админ',
        teacherCheck: 'Проверка преподавателей',
        department: 'Департамент',
        themes: 'Темы',
        module: 'График модулей',
        courseCategoryInfo: 'Здесь вы можете создавать собственные категории для курсов и добавлять их в общие категории',
        scoreControle: 'Управление статусами курсов',
        scoreDiapazon: 'Диапазон баллов',

        // Calendar
        firstDayOfWeek: 'Понедельник',
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        dayNamesMin: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        today: 'Сегодня',
        clear: 'Очистить',

        // Course page
        addCourse: 'Добавить курс',
        courseName: 'Название курса',
        courseDescription: 'Описание курса',
        courseStatus: 'Статус курса',
        courseType: 'Тип курса',
        closed: 'Закрытый',
        openCourse: 'Открытый',
        published: 'Опубликован',
        notPublished: 'Не опубликован',
        onReview: 'На рассмотрении',
        notOnReview: 'Не на рассмотрении',
        streams: 'Потоки',
        connects: 'Связан',
        archiveCourse: 'Архивировать курс',
        archiveCourseConfirmation: 'Курс будет сохранён в текущем состоянии и навсегда перемещён в архив без возможности восстановления.',
        archiveCourseNote: 'Курс будет доступен только в архиве',
        leaveCopy: 'Оставить копию курса',
        filters: 'Фильтры',
        courseAudienceType: 'Статус курса',
        isPublished: 'Публикация',
        reset: 'Сбросить',
        noCourses: 'Курсы отсутствуют',
        addStream: 'Добавить поток',
        audit: 'Аудиторные потоки',
        notAudit: 'Внеаудиторные потоки',
        auditItem: 'Аудиторный',
        notAuditItem: 'Внеаудиторный',
        defaultPage: 'Выберите существующую тему из списка слева либо создайте новую для начала обучения.',
        defaultMobilePage: 'Выберите существующую тему, либо создайте новую для начала обучения',

        // Roles page
        active: 'Активные',
        create: 'Создать',
        change: 'Изменить',
        view: 'Смотреть',

        // Messages
        successAdd: 'Успешно добавлен!',
        errorTitle: 'Ошибка!',
        addCourseError: 'Не удалось добавить курс',
        tryAgainLater: 'Повторите позже',
        addError: 'Ошибка при добавлении!',
        deleteSuccess: 'Успешно удалено!',
        deleteError: 'Ошибка при удалении!',
        updateSuccess: 'Успешно изменено!',
        updateError: 'Ошибка при изменении!',
        errorTryAgainLater: 'Ошибка, повторите позже',
        archiveSuccess: 'Архивирование прошло успешно',
        sendSuccess: 'Успешно отправлен!',

        pleaceRepeat: 'Пожалуйста, проверьте введённые данные',
        noCorrectQuery: 'Некорректный запрос',
        accessError: 'У вас нет прав для выполнения этого действия',
        dataConflict: 'Конфликт данных',
        resourseAllreadyExist: 'Возможно, ресурс уже существует или был изменён',
        dataNotValid: 'Данные не прошли проверку. Проверьте правильность заполнения формы.',
        serverError: 'На сервере произошла ошибка',
        serviceNoAvialable: 'Сервис временно недоступен. Попробуйте позже',

        // table
        numberSign: '#',
        publication: 'Публикация',
        score: 'Балл',

        // Stream list
        streamName: 'Название',
        speciality: 'Специальность',
        languageOfStudy: 'Язык обучения',
        studyYear: 'Год обучения',
        period: 'Период',
        semester: 'Семестр',
        studyForm: 'Форма обучения',
        studyType: 'Тип обучения',
        streamConnection: 'Связь к потоку',
        students: 'Студенты',
        noLinkedStreams: 'Нет связанных потоков',
        dataTemporarilyUnavailable: 'Данные временно недоступны',
        noStreamsOrNotLinked: 'Потоков пока нет или курс не связан с потоками',
        courseStreamConnect: 'Данный поток связан с курсом',
        notCourseConnections: 'Не связан с курсом',
        streamConnectConfirm: 'Поток связан с курсом, вы уверены что хотите связать новый курс?',

        // buttons
        archive: 'Архивировать',
        addPhoto: 'Добавить фото',
        photo: 'Фото',
        teacherBtn: 'Преподаватель',
        studentBtn: 'Студент',

        // others
        status: 'Статус',
        connected: 'Связан',

        // lesson page
        lessonAvailability: 'Этот урок будет доступен до определённой даты. После окончания срока доступ к материалам будет закрыт',
        availableFrom: 'Доступен с:',
        courseScore: 'Балл за курс',
        scoreUnit: 'балл',
        noThemes: 'Темы отсутствуют',
        selectStepType: 'Выберите тип шага',
        position: 'Позиция',
        wordTestGeneration: 'Выберите свой документ в формате Word — из его содержания будет автоматически создан тест.',
        aiTestGeneration: 'Тест генерируется искусственным интеллектом',
        testVariantsHint: 'Варианты тестов будут более продуманными если передать ваш документ',
        optional: '(необязательно)',
        noSteps: 'Шаги отсутствует',
        positionUnit: 'позиция',
        deleteStep: 'Удалить шаг',
        updateLesson: 'Обновить урок',
        stepPosition: 'Позиция шага',
        questionPlaceholder: 'Вопрос...',
        addVariant: 'Добавить вариант',
        fileTooLarge: 'Файл слишком большой!',
        maxFileSize10mb: 'Разрешено максимум 10 MB.',
        trainingPlan: 'План обучения',
        cancellationOfWorks: 'Аннулирование работ',
        addAdditionally: 'Дополнительно',
        lessonsAvailableUntilDate: 'Уроки будут доступны только до указанного срока',
        start: 'Начало',
        end: 'Конец',
        title: 'Название',
        totalPointsForCourse: 'Всего баллов за курс',
        weekHeader: 'Нд',

        // counterbanner
        coursesAndVideoLessons: 'Курсы и видеоуроки',
        registeredStudents: 'Зарегистрированные студенты',
        satisfactionLevel: 'Уровень удовлетворённости',

        // open courses
        newCourses: 'Новые курсы',
        popularCourses: 'Популярные курсы',
        recommendedByDepartment: 'Рекомендованные департаментом',
        allOpenCourses: 'Все открытые курсы',
        dataNotAvailable: 'Данные недоступны',
        videoTourMainBuilding: 'Видеоэкскурсия по главному зданию',
        readOnly: 'Только для чтения',
        archiveReadOnlyNotice: 'Эти курсы были заархивированы. Данные хранятся как история и не могут быть изменены или восстановлены.',
        archiveDate: 'Дата архивации',

        // user
        personalShortNumber: 'Л/н',
        personalNumber: 'Личный номер',
        yearBirdth: 'Год рождения',
        passed: 'Сдан',
        failed: 'Не сдан',

        // Dashboard
        teacher: 'Преподаватель',
        headOfDepartment: 'Зав. кафедрой',
        allCourses: 'Все курсы',
        createdLast30Days: 'созданы за последние 30 дней',
        closedCourses: 'Закрытые курсы',
        openCoursesTitle: 'Открытые курсы',
        paidCourses: 'Платные курсы',
        activity: 'Активность',
        reportFor: 'Отчёт за:',
        formula: 'Формула:',
        coursesCount: 'Количество курсов :',
        notificationsCount: 'Количество уведомлений :',
        statistics: 'Статистика',
        coursesConnection: 'Курсы(связь) ',
        notificationsConnection: 'Уведом-я(связь) ',
        totalRating: 'Общий рейтинг ',
        telegramNotifications: 'Telegram уведомления',

        // OpenCourse Page
        selectCategory: 'Выберите категорию для курса',
        selectLanguage: 'Выберите язык для курса',
        resetFilter: 'Сбросить фильтр',
        free: 'Бесплатные',
        paid: 'Платные',
        showAllCourses: 'Отобразить все курсы',
        selectCategoryPlaceholder: 'Выберите категорию',

        // Roles Page
        adminTitle: 'Админ',
        myeduIdPlaceholder: 'myedu id',
        administrator: 'Администратор',
        successChanged: 'Успешно изменено!',

        // OpenCourseCard & OpenCourseShowCard
        youAreEnrolled: 'Вы записаны',
        enrollInCourse: 'Записаться на курс',
        moreDetails: 'Подробнее...',
        confirmEnrollment: 'Вы точно хотите записаться на курс?',
        enroll: 'Записаться',
        author: 'Автор:',
        languageOfInstruction: 'Язык обучения:',
        courseContent: 'Содержание курса',

        // ActiveCourseList
        completionStatus: 'Статус завершения',
        empty: 'Пусто',

        // ActiveStepCard
        completed: 'Выполнено',
        markAsCompleted: 'Отметить как выполненный',
        test: 'Тест',
        practicalTask: 'Практическое задание',
        theme: 'Тема',

        // VideoInstruct
        videoInstructionsTitle: 'Видеоуроки по использованию платформы Mooc',

        // Module
        moduleSchedule: 'Модульный график',
        selectFaculty: 'Выберите факультет',
        selectSpeciality: 'Выберите специальность',
        selectPeriod: 'Выберите период',
        selectSemester: 'Выберите семестр',
        allSpecialities: 'По всем специальностям',
        confirmChange: 'Вы точно хотите изменить?',
        changeModuleSchedule: 'Изменить график модулей',
        moduleStart: 'Начало модуля',
        moduleEnd: 'Конец модуля',
        summer: 'Летний',
        winter: 'Зимний',
        dateUpdate: 'Обновить дату',
        dateChangeWarn: 'Внимание! Если вы измените дату для специальностей в целом, это изменение будет применено ко всем выбранным специальностям.',

        // RolesDepartment
        access: 'Доступ',
        check: 'Проверка',
        courseCategories: 'Категории курсов',
        publishCourse: 'Опубликовать курс',
        cancelCourse: 'Отменить курс',
        selectCourseCategory: 'Выберите категорию для курса',
        selectCourseLanguage: 'Выберите язык для курса',
        recommend: 'Рекомендую',
        confirmRejectCourse: 'Вы уверены что хотите отказать курс?',
        rejectReason: 'Укажите причину вашего отказа',
        createCategory: 'Создать категорию',
        editCategory: 'Изменить категорию',
        categoryName: 'Название категории',
        categoryDescription: 'Описание',
        createCategoryTitle: 'Создать категорию',
        editCategoryTitle: 'Изменить категорию',
        publish: 'Опубликовать',
        actions: 'Действия',
        teachers: 'Преподаватели',

        // TeacherCheckPage
        teacherReport: 'Отчет по преподавателям',
        uncheckedAssignments: 'Непроверенные задания',
        loadingError: 'Ошибка загрузки',
        nothingFound: 'Ничего не найдено',

        // StudentHome
        connectTelegramNotifications: 'Подключить уведомления в Telegram',
        upcomingEvents: 'Предстоящие события',
        noUpcomingEvents: 'В ближайщее время событий нет',
        daysVisitedStreak: 'Дней посещено без перерыва',
        daysVisitedTotal: 'Дней посещено в общем',
        telegramConnectHeader: 'Чтобы получать уведомления в Telegram, свяжитесь здесь',
        openInTelegram: 'Открыть в Telegram',

        // ItemCard
        yourScore: 'Ваш балл',
        totalPoints: 'Всего баллов',
        moduleSet: 'Модуль поставлен',
        moduleResult: 'Итог за модуль',
        points: 'Баллов',

        // LessonTest
        step: 'Шаг',
        from: 'Из',
        yourTotalScore: 'Ваш итоговый балл',
        attempt: 'Попытка',
        correct: 'Верно',
        incorrect: 'Неверно',
        answerHistory: 'История ответов',
        openSeparately: 'Открыть отдельно',
        taskInstruction: 'Задание после изучения материала, загрузи свой файл с решением.',
        taskCompleted: 'Задание выполнено',

        // lessons, cards
        leaveFeedbackOrQuestion: 'Оставьте отзыв или задайте вопрос по материалам урока',

        // reductor
        studentsNotFound: 'Студенты не найдены',
        fullNameStudent: 'ФИО студента',
        checkingWork: 'Просмотреть работы',
        viewStudents: 'Показано студентов',
        reductorInstruction: 'Инструкция для редуктора',
        reductorWorkingInstruction: 'Выберите студента из списка ниже, чтобы просмотреть все его работы. На странице студента вы сможете аннулировать работы, если были выявлены нарушения академической честности или другие причины для аннулирования.',
        reductorPanel: 'Панель редуктора',
        studentControl: 'Управление работами студентов',
        searchByFullName: 'Поиск по ФИО',
        selectAll: 'Выбрать все',
        pracicalWork: 'Практическая работа',
        inCourseNoStep: 'В этом курсе пока нет шагов.',
        cancellation: 'Аннулировать',
        controll: 'Управление',
        reasonCancellation: 'Причина аннулирования',
        reasonFullCancellation: 'Пожалуйста, опишите причину аннулирования',
        studentWorkCencalled: `В данном разделе отображается список предметов, потоков и курсов, связанных со студентами. При изменении потока студента (например, при переводе в другой поток) в системе могут остаться лишние или некорректные связи — так называемые «мусорные» данные. Эти данные могут мешать корректной работе системы, в том числе при назначении модулей студенту. В этом разделе вы можете просмотреть все связанные предметы, потоки и курсы, проверить их актуальность и удалить лишние или ошибочные связи, чтобы избежать проблем в дальнейшем`,
        studentNotCourse: 'У студента пока нет назначенных курсов',

        // course cut
        confirmDelete: 'Вы точно хотите удалить?',
        confirmDeleteResult: 'Все данные потока и курса будут без возможности восстановления разорваны',
        isActive: 'Активен',
        noActive: 'Неактивен',
        Collected: 'Собрал',
        deleteStream: 'Удалить поток',
        collectedScore: 'Собрал баллов',
        maxScore: 'Макс. возможный балл',
        connectStreams: 'Связанные потоки',
        items: 'Предметы',
        output: 'Итог',
        scoreLimit: 'Лимит баллов',
        warningWorks: 'Строки с отметкой выделены, если есть проблемы по лимиту',

        // bottomNav
        mainPageLink: 'Главная',
        panelPage: 'Панель',
        learnPage: 'Обучение',

        // App config
        panelTitle: 'Настройки интерфейса',
        visionBlock: 'Зрение',
        toggleLargeText: 'Увеличенный текст',
        toggleHighContrast: 'Высокий контраст',
        fontScaleLabel: 'Размер шрифта',
        scaleDefault: 'Обычный',
        scaleMd: 'Средний',
        scaleLg: 'Большой',
        scaleXl: 'Очень большой',
        langSwitcher: 'Язык',

        // Video
        videoProccessError: 'Ошибка при обработке видео',
    },
    ky: {
        oshSU: 'ОшМУ',

        // General
        search: 'Издөө',
        profile: 'Профиль',
        settings: 'Орнотуулар',
        logout: 'Чыгуу',
        welcome: 'Кош келиңиз',
        all: 'Баары',
        save: 'Сактоо',
        add: 'Кошуу',
        edit: 'Оңдоо',
        update: 'Өзгөртүү',
        delete: 'Өчүрүү',
        cancel: 'Жокко чыгаруу',
        back: 'Артка',
        next: 'Андан ары',
        send: 'Жөнөтүү',
        close: 'Жабуу',
        open: 'Ачуу',
        goTo: 'Өтүү',
        linkLabel: 'Шилтеме',
        videoAlt: 'Видео',
        copy: 'Көчүрүү',
        copied: 'Көчүрүлдү',
        description: 'Сүрөттөмө',
        error: 'Ката',
        success: 'Ийгилик',
        loading: 'Жүктөлүүдө',
        noData: 'Маалымат жок',
        reason: 'Себеби',
        yes: 'Ооба',
        no: 'Жок',
        confirmation: 'Ырастоо',
        confirmationWindow: 'Ырастоо терезеси',
        deleteHeader: 'Өчүрүү',
        confirmDeleteMessage: 'Чын эле өчүргүңүз келеби?',
        fullName: 'Аты жөнү',
        lastVisit: 'Акыркы кирүү',
        completedActions: 'Аткарылган аракеттер',
        dataLabel: 'Маалыматтар',
        idLabel: 'Id',
        saveToMyedu: "myedu'га сактоо",
        periodExportShedule: 'Экспорттоо мөөнөтү',
        accessExportStatus: 'Экспорттоо жеткиликтүү',
        accessExportStatusFalse: 'Экспорттоо жеткиликтүү эмес',

        // Home
        convenientOnlineLearningSpace: 'Окуу үчүн ыңгайлуу онлайн мейкиндик',
        welcomeToDistanceLearningPortal: 'Аралыктан окутуу порталына кош келиңиз!',
        weUniteUniversityProjects: 'Биз университеттин онлайн-билим берүү багытындагы долбоорлорун бириктиребиз:',
        openOnlineHome: 'Ачык онлайн курстар',
        higherEducationPrograms: 'Жогорку билим программалары',
        backHome: 'Башкы бетке кайтуу',
        // AppTopbar
        oldMooc: 'Эски Mooc',
        digitalCampusOshSU: 'ОшМУнун санариптик кампусу',
        login: 'Кирүү',
        exit: 'Чыгуу',
        notification: 'Билдирүү',

        // AppMenu
        mainPage: 'Башкы бет',
        controlPanel: 'Башкаруу панели',
        courses: 'Курстар',
        videoInstruction: 'Видео нускама',
        unverifiedTasks: 'Текшериле элек тапшырмалар',
        openOnlineCourses: 'Ачык онлайн курстар',
        myActiveCourses: 'Менин активдүү курстарым',
        notifications: 'Билдирүүлөр',
        searchStudents: 'Студенттерди издөө',
        archiveCourses: 'Курстардын архиви',
        approveCourses: 'Курстарды бекитүү',
        admin: 'Админ',
        teacherCheck: 'Окутуучуларды текшерүү',
        department: 'Департамент',
        themes: 'Темалар',
        module: 'Модулдук график',
        courseCategoryInfo: 'Бул жерде сиз курстар үчүн өз категорияларыңызды түзүп, аларды жалпы категорияларга кошо аласыз.',
        scoreControle: 'Курстун статусун башкаруу',
        scoreDiapazon: 'Баллдардын диапазону',

        // Calendar
        firstDayOfWeek: 'Дүйшөмбү',
        dayNames: ['Жекшемби', 'Дүйшөмбү', 'Шейшемби', 'Шаршемби', 'Бейшемби', 'Жума', 'Ишемби'],
        dayNamesShort: ['Жш', 'Дш', 'Шш', 'Шр', 'Бш', 'Жм', 'Иш'],
        dayNamesMin: ['Ж', 'Д', 'Ш', 'Ш', 'Б', 'Ж', 'И'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        today: 'Бүгүн',
        clear: 'Тазалоо',

        // Course page
        addCourse: 'Курс кошуу',
        courseName: 'Курстун аталышы',
        courseDescription: 'Курстун сүрөттөлүшү',
        courseStatus: 'Курстун статусу',
        courseType: 'Курстун түрү',
        closed: 'Жабык',
        openCourse: 'Ачык',
        published: 'Жарыяланды',
        notPublished: 'Жарыяланган жок',
        onReview: 'Кароодо',
        notOnReview: 'Кароодо эмес',
        streams: 'Агымдар',
        connects: 'Байланышкан',
        archiveCourse: 'Курсту архивдөө',
        archiveCourseConfirmation: 'Курс учурдагы абалында сакталат жана калыбына келтирүү мүмкүнчүлүгү жок биротоло архивге жылдырылат.',
        archiveCourseNote: 'Курс архивде гана жеткиликтүү болот',
        leaveCopy: 'Курстун көчүрмөсүн калтыруу',
        filters: 'Чыпкалар',
        courseAudienceType: 'Курстун статусу',
        isPublished: 'Жарыялоо',
        reset: 'Тазалоо',
        noCourses: 'Курстар жок',
        addStream: 'Агым кошуу',
        audit: 'Аудитордук агымдар',
        notAudit: 'Аудитордук эмес агымдар',
        auditItem: 'Аудитордук',
        notAuditItem: 'Аудитордук эмес',
        defaultPage: 'Окутууну баштоо үчүн сол жактагы тизмеден бар болгон теманы тандаңыз же жаңысын түзүңүз.',
        defaultMobilePage: 'Окутууну баштоо үчүн бар болгон теманы тандаңыз же жаңысын түзүңүз.',

        // Roles page
        active: 'Активдүүлөр',
        create: 'Түзүү',
        change: 'Өзгөртүү',
        view: 'Көрүү',

        // Messages
        successAdd: 'Ийгиликтүү кошулду!',
        errorTitle: 'Ката!',
        addCourseError: 'Курсту кошуу мүмкүн болгон жок',
        tryAgainLater: 'Кийинчерээк кайталаңыз',
        addError: 'Кошууда ката кетти!',
        deleteSuccess: 'Ийгиликтүү өчүрүлдү!',
        deleteError: 'Өчүрүүдө ката кетти!',
        updateSuccess: 'Ийгиликтүү өзгөртүлдү!',
        updateError: 'Өзгөртүүдө ката кетти!',
        errorTryAgainLater: 'Ката кетти, кийинчерээк кайталаңыз',
        archiveSuccess: 'Архивдөө ийгиликтүү аяктады',
        sendSuccess: 'Ийгиликтүү жөнөтүлдү!',
        pleaceRepeat: 'Сураныч, киргизилген маалыматтарды текшериңиз',
        noCorrectQuery: 'Туура эмес сурам',
        accessError: 'Бул аракетти аткарууга укугуңуз жок',
        dataConflict: 'Маалыматтардын карама-каршылыгы',
        resourseAllreadyExist: 'Мүмкүн, ресурс мурун эле бар же өзгөртүлгөн',
        dataNotValid: 'Маалыматтар текшерүүдөн өткөн жок. Форманын туура толтурулганын текшериңиз.',
        serverError: 'Серверде ката кетти',
        serviceNoAvialable: 'Кызмат убактылуу иштебейт. Кийинчерээк аракет кылып көрүңүз',

        // table
        numberSign: '#',
        publication: 'Публикация',
        score: 'Балл',

        // Stream list
        streamName: 'Аталышы',
        speciality: 'Адистик',
        languageOfStudy: 'Окуу тили',
        studyYear: 'Окуу жылы',
        period: 'Период',
        semester: 'Семестр',
        studyForm: 'Окуу формасы',
        studyType: 'Окуу түрү',
        streamConnection: 'Агымга байланыш',
        students: 'Студенттер',
        noLinkedStreams: 'Байланышкан агымдар жок',
        dataTemporarilyUnavailable: 'Маалымат убактылуу жеткиликсиз',
        noStreamsOrNotLinked: 'Азырынча агымдар жок же курс агымдарга байланышкан эмес',
        courseStreamConnect: 'Бул агым төмөндөгү курска байланган',
        notCourseConnections: 'Курсака байланыш жок',
        streamConnectConfirm: 'Агым курска байланышкан. Чын эле жаңы курсту байланыштыргыңыз келеби?',

        // buttons
        archive: 'Архивдөө',
        addPhoto: 'Сүрөт кошуу',
        photo: 'Фото',
        teacherBtn: 'Окутуучу',
        studentBtn: 'Студент',
        // others
        status: 'Абалы',
        connected: 'Байланышкан',

        // lesson page
        lessonAvailability: 'Бул сабак белгиленген күнгө чейин гана жеткиликтүү болот. Мөөнөт бүткөндөн кийин материалдарга кирүү жабылат',
        availableFrom: 'Жеткиликтүү болгон күн:',
        courseScore: 'Курс үчүн балл',
        scoreUnit: 'балл',
        noThemes: 'Темалар жок',
        selectStepType: 'Кадамдын түрүн тандаңыз',
        position: 'Орду',
        wordTestGeneration: 'Word форматындагы документиңизди тандаңыз — анын мазмунунун негизинде тест автоматтык түрдө түзүлөт.',
        aiTestGeneration: 'Тест жасалма интеллект тарабынан түзүлөт',
        testVariantsHint: 'Документиңизди жиберсеңиз, тест варианттары сапаттуу болот',
        optional: '(милдеттүү эмес)',
        noSteps: 'Кадамдар жок',
        positionUnit: 'орун',
        deleteStep: 'Өчүрүү',
        updateLesson: 'Сабакты жаңыртуу',
        stepPosition: 'Кадамдын орду',
        questionPlaceholder: 'Суроо...',
        addVariant: 'Вариант кошуу',
        fileTooLarge: 'Файл өтө чоң!',
        maxFileSize10mb: 'Эң көбү 10 MB уруксат.',
        trainingPlan: 'Окуу планы',
        cancellationOfWorks: 'Жумуштарды жокко чыгаруу',
        addAdditionally: 'Кошумча кошуу',
        lessonsAvailableUntilDate: 'Сабактар белгиленген күнгө чейин гана жеткиликтүү болот',
        start: 'Башталышы',
        end: 'Аягы',
        title: 'Аталышы',
        totalPointsForCourse: 'Курс үчүн жалпы баллдар',
        weekHeader: 'Апта',

        // counterbanner
        coursesAndVideoLessons: 'Курстар жана видео сабактар',
        registeredStudents: 'Катталган студенттер',
        satisfactionLevel: 'Канааттануу деңгээли',

        // open courses
        newCourses: 'Жаңы курстар',
        popularCourses: 'Популярдуу курстар',
        recommendedByDepartment: 'Департамент тарабынан сунушталган',
        allOpenCourses: 'Бардык ачык курстар',
        dataNotAvailable: 'Маалымат жеткиликтүү эмес',
        videoTourMainBuilding: 'Башкы корпус боюнча видеоэкскурсия',
        readOnly: 'Окуу үчүн гана',
        archiveReadOnlyNotice: 'Бул курстар архивделген. Маалыматтар тарых катары сакталат жана өзгөртүүгө же калыбына келтирүүгө болбойт.',
        archiveDate: 'Архивделген күнү',

        // user
        personalShortNumber: 'Ж/н',
        personalNumber: 'Жеке номер',
        yearBirdth: 'Туулган жылы',
        passed: 'Тапшырды',
        failed: 'Тапшырган жок',

        // Dashboard
        teacher: 'Окутуучу',
        headOfDepartment: 'Кафедра башчысы',
        allCourses: 'Бардык курстар',
        createdLast30Days: 'акыркы 30 күндө түзүлгөн',
        closedCourses: 'Жабык курстар',
        openCoursesTitle: 'Ачык курстар',
        paidCourses: 'Акылуу курстар',
        activity: 'Активдүүлүк',
        reportFor: 'Отчет:',
        formula: 'Формула:',
        coursesCount: 'Курстардын саны :',
        notificationsCount: 'Билдирүүлөрдүн саны :',
        statistics: 'Статистика',
        coursesConnection: 'Курстар(байланыш) ',
        notificationsConnection: 'Билдирүүлөр(байланыш) ',
        totalRating: 'Жалпы рейтинг ',
        telegramNotifications: 'Telegram билдирүүлөрү',

        // OpenCourse Page
        selectCategory: 'Курс үчүн категорияны тандаңыз',
        selectLanguage: 'Курс үчүн тилди тандаңыз',
        resetFilter: 'Фильтрди тазалоо',
        free: 'Акысыз',
        paid: 'Акылуу',
        showAllCourses: 'Бардык курстарды көрсөтүү',
        selectCategoryPlaceholder: 'Категорияны тандаңыз',

        // Roles Page
        adminTitle: 'Админ',
        myeduIdPlaceholder: 'myedu id',
        administrator: 'Администратор',
        successChanged: 'Ийгиликтүү өзгөртүлдү!',

        // OpenCourseCard & OpenCourseShowCard
        youAreEnrolled: 'Сиз жазылгансыз',
        enrollInCourse: 'Курска жазылуу',
        moreDetails: 'Кененирээк...',
        confirmEnrollment: 'Сиз чын эле курска жазылгыңыз келеби?',
        enroll: 'Жазылуу',
        author: 'Автор:',
        languageOfInstruction: 'Окутуу тили:',
        courseContent: 'Курстун мазмуну',

        // ActiveCourseList
        completionStatus: 'Аяктоо статусу',
        empty: 'Бош',

        // ActiveStepCard
        completed: 'Аткарылды',
        markAsCompleted: 'Аткарылды деп белгилөө',
        test: 'Тест',
        practicalTask: 'Практикалык тапшырма',
        theme: 'Тема',

        // VideoInstruct
        videoInstructionsTitle: 'Mooc платформасын колдонуу боюнча видео сабактар',

        // Module
        moduleSchedule: 'Модулдук график',
        selectFaculty: 'Факультетти тандаңыз',
        selectSpeciality: 'Адистикти тандаңыз',
        selectPeriod: 'Мезгилди тандаңыз',
        selectSemester: 'Семестрди тандаңыз',
        allSpecialities: 'Бардык адистиктер боюнча',
        confirmChange: 'Сиз чын эле өзгөрткүңүз келеби?',
        changeModuleSchedule: 'Модулдардын графигин өзгөртүү',
        moduleStart: 'Модулдун башталышы',
        moduleEnd: 'Модулдун аягы',
        summer: 'Жайкы',
        winter: 'Кышкы',
        dateUpdate: 'Датаны өзгөртүү',
        dateChangeWarn: 'Көңүл буруңуз! Эгер адистиктердин датасын жалпы өзгөртсөңүз, анда бул өзгөртүү тандалган бардык адистиктерге колдонулат.',

        // RolesDepartment
        access: 'Кирүү',
        check: 'Текшерүү',
        courseCategories: 'Курс категориялары',
        publishCourse: 'Курсту жарыялоо',
        cancelCourse: 'Курсту жокко чыгаруу',
        selectCourseCategory: 'Курс үчүн категорияны тандаңыз',
        selectCourseLanguage: 'Курс үчүн тилди тандаңыз',
        recommend: 'Сунуштайм',
        confirmRejectCourse: 'Сиз чын эле курстан баш тарткыңыз келеби?',
        rejectReason: 'Баш тартууңуздун себебин көрсөтүңүз',
        createCategory: 'Категория түзүү',
        editCategory: 'Категорияны өзгөртүү',
        categoryName: 'Категориянын аталышы',
        categoryDescription: 'Сүрөттөмө',
        createCategoryTitle: 'Категория түзүү',
        editCategoryTitle: 'Категорияны өзгөртүү',
        publish: 'Жарыялоо',
        actions: 'Аракеттер',
        teachers: 'Окутуучулар',

        // TeacherCheckPage
        teacherReport: 'Окутуучулар боюнча отчет',
        uncheckedAssignments: 'Текшерилбеген тапшырмалар',
        loadingError: 'Жүктөө катасы',
        nothingFound: 'Эч нерсе табылган жок',

        // StudentHome
        connectTelegramNotifications: 'Telegram билдирүүлөрүн туташтыруу',
        upcomingEvents: 'Алдыдагы иш-чаралар',
        noUpcomingEvents: 'Жакынкы арада иш-чаралар жок',
        daysVisitedStreak: 'Үзгүлтүксүз кирген күндөр',
        daysVisitedTotal: 'Жалпы кирген күндөр',
        telegramConnectHeader: 'Telegram аркылуу билдирүүлөрдү алуу үчүн бул жерге байланышыңыз',
        openInTelegram: 'Telegram аркылуу ачуу',

        // ItemCard
        yourScore: 'Сиздин балл',
        totalPoints: 'Жалпы балл',
        moduleSet: 'Модуль коюлду',
        moduleResult: 'Модуль жыйынтыгы',
        points: 'Балл',

        // LessonTest
        step: 'Кадам',
        from: '-',
        yourTotalScore: 'Сиздин жыйынтык баллыңыз',
        attempt: 'Аракет',
        correct: 'Туура',
        incorrect: 'Туура эмес',
        answerHistory: 'Жооптордун тарыхы',
        openSeparately: 'Өзүнчө ачуу',
        taskInstruction: 'Материалды окуп чыккандан кийин, чечимиңиз менен файлды жүктөңүз.',
        taskCompleted: 'Тапшырма аткарылды',

        // lessons, cards
        leaveFeedbackOrQuestion: 'Сабактын материалдары боюнча пикир калтырыңыз же суроо бериңиз',

        // reductor
        studentsNotFound: 'Студенттер табылган жок',
        fullNameStudent: 'Студенттин аты-жөнү',
        checkingWork: 'Иштерин көрүү',
        viewStudents: 'Көрсөтүлгөн студенттер',
        reductorInstruction: 'Редуктор үчүн нускама',
        reductorWorkingInstruction: 'Төмөнкү тизмеден студентти тандап, анын бардык иштерин көрө аласыз. Студенттин баракчасында академиялык чынчылдык бузулган же башка себептер менен иштерди жокко чыгара аласыз.',
        reductorPanel: 'Редуктор панели',
        studentControl: 'Студенттердин иштерин башкаруу',
        searchByFullName: 'Аты-жөнү боюнча издөө',
        selectAll: 'Баарын тандоо',
        pracicalWork: 'Практикалык иш',
        inCourseNoStep: 'Бул курста азырынча кадамдар жок.',
        cancellation: 'Жокко чыгаруу',
        controll: 'Башкаруу',
        reasonCancellation: 'Жокко чыгаруунун себеби',
        reasonFullCancellation: 'Сураныч, жокко чыгаруунун себебин толук жазыңыз',
        studentWorkCencalled: `Бул бөлүмдө студенттерге байланышкан предметтердин, агымдардын жана курстардын тизмеси көрсөтүлөт. Студенттин агымы өзгөргөндө (мисалы, башка агымга которулганда) системада керексиз же туура эмес байланыштар — «ашыкча» маалыматтар калып калышы мүмкүн. Бул маалыматтар системанын туура иштешине, айрыкча студентке модулдарды дайындоодо, тоскоолдук жаратышы мүмкүн. Бул бөлүмдө сиз бардык байланышкан предметтерди, агымдарды жана курстарды көрүп, алардын актуалдуулугун текшерип, керексиз же ката байланыштарды өчүрө аласыз, бул келечекте көйгөйлөрдүн алдын алууга жардам берет.`,
        studentNotCourse: 'Студентке азырынча эч кандай курс дайындала элек.',

        // course cut
        confirmDelete: 'Чын эле өчүргүңүз келеби?',
        confirmDeleteResult: 'Агым жана курс боюнча бардык маалыматтар кайра калыбына келтирүү мүмкүнчүлүгү жок ажыратылат',
        isActive: 'Активдүү',
        noActive: 'Активдүү эмес',
        Collected: 'Топтогон',
        deleteStream: 'Агымды өчүрүү',
        collectedScore: 'Топтогон балл',
        maxScore: 'Максималдуу мүмкүн болгон балл',
        connectStreams: 'Байланышкан агымдар',
        items: 'Предметтер',
        output: 'Жыйынтык',
        scoreLimit: 'Балл лимити',
        warningWorks: 'Белгиленген саптар лимит боюнча көйгөйлөр бар болсо белгиленип көрсөтүлөт',

        // bottomNav
        mainPageLink: 'Башкы бет',
        panelPage: 'Панель',
        learnPage: 'Окуу планы',

        // App config
        panelTitle: 'Интерфейс жөндөөлөрү',
        visionBlock: 'Көрүү',
        toggleLargeText: 'Чоңойтулган текст',
        toggleHighContrast: 'Жогорку контраст',
        fontScaleLabel: 'Шрифттин өлчөмү',
        scaleDefault: 'Кадимки',
        scaleMd: 'Орточо',
        scaleLg: 'Чоң',
        scaleXl: 'Өтө чоң',
        langSwitcher: 'Тил',

        // Video
        videoProccessError: 'Видеону иштетүүдө ката кетти',
    }
};

export type Language = 'ru' | 'ky';

interface LocalizationContextType {
    language: Language;
    translations: typeof localizationData.ru;
    setLanguage: (language: Language) => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>('ru');

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') as Language;
        if (storedLanguage && (storedLanguage === 'ru' || storedLanguage === 'ky')) {
            setLanguage(storedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const translations = localizationData[language];

    return <LocalizationContext.Provider value={{ language, translations, setLanguage: handleSetLanguage }}>{children}</LocalizationContext.Provider>;
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
