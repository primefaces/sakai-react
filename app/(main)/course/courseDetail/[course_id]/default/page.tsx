export default function CourseDefault({ searchParams }: { searchParams: { lang?: string } }) {
    const lang = searchParams.lang || 'ru';

    const ruText = <h2 className="hidden sm:block text-2xl font-semibold text-gray-800 tracking-tight">
        Выберите существующую тему из списка слева, <br />
        либо создайте новую для начала обучения.
        </h2>

    const ruMoblieText = (
        <h2 className="block sm:hidden text-2xl font-semibold text-gray-800 tracking-tight">
            Выберите существующую тему, <br />
            либо создайте новую для начала обучения. <br />
            <span className={'text-sm text-[var(--mainColor)]'}>Нажмите на меню</span>
        </h2>
    );

    const kyText = <h2 className="hidden sm:block text-2xl font-semibold text-gray-800 tracking-tight">Окутууну баштоо үчүн сол жактагы тизмеден бар болгон теманы тандаңыз же жаңысын түзүңүз.</h2>;

    const kyMobileText = <h2 className="block sm:hidden text-2xl font-semibold text-gray-800 tracking-tight">Окутууну баштоо үчүн бар болгон теманы тандаңыз же жаңысын түзүңүз.</h2>;

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4 sm:p-8">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>
                    <div className="relative bg-white/40 backdrop-blur-sm border border-gray-100 rounded-2xl p-3 sm:p-6 shadow-sm">
                        <i className="pi pi-book text-4xl text-blue-500/80 mb-4 block"></i>
                        {lang === 'ru' ? ruText : lang === 'ky' ? kyText : ''}
                        {lang === 'ru' ? ruMoblieText : lang === 'ky' ? kyMobileText : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}
