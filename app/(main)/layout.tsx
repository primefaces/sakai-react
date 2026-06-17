import Layout from '../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata = {
    metadataBase: new URL('https://mooc.oshsu.kg'),

    title: {
        default: 'Mooc ОшГУ',
        template: '%s | Mooc ОшГУ'
    },
    description: 'Платформа онлайн обучения ОшГУ',

    robots: {
        index: true,
        follow: true
    },

    openGraph: {
        type: 'website',
        title: 'Mooc ОшГУ',
        description: 'Платформа онлайн обучения ОшГУ',
        url: 'https://mooc.oshsu.kg',
        // images: [
        //     {
        //         url: '/',
        //         width: 1200,
        //         height: 630,
        //         alt: 'Mooc ОшГУ'
        //     }
        // ]
    }
}

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}
