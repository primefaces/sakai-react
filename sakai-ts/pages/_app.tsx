import type { AppProps } from 'next/app';
import type { Page } from '../types/types';
import React, { useState } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import AppLoadingScreen from '../layout/loading/AppLoadingScreen';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

type Props = AppProps & {
    Component: Page;
};

export default function MyApp({ Component, pageProps }: Props) {
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        setLoading(true);
    }, []);

    const MainContent = () => {
        if (Component.getLayout) {
            return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
        } else {
            return (
                <LayoutProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </LayoutProvider>
            );
        }
    };

    return !loading ? <AppLoadingScreen /> : <MainContent />;
}
