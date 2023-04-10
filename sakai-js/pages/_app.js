import React, { useState } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import AppLoadingScreen from '../layout/loading/AppLoadingScreen';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

export default function MyApp({ Component, pageProps }) {
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
    }

    return !loading ? <AppLoadingScreen /> : <MainContent />;
}
