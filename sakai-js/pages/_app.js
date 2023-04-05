import React, { useState, useRef } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import PrimeReact from 'primereact/api';

export default function MyApp({ Component }) {
    const [dark, setDark] = useState(false);
    const [theme, setTheme] = useState('lara-light-indigo');
    const [newsActive, setNewsActive] = useState(false);
    const storageKey = 'primereact-news';
    const announcement = useRef(null);

    const props = {
        dark: dark,
        theme: theme,
        newsActive: newsActive && announcement.current,
        announcement: announcement.current,
        onNewsClose: () => {
            setNewsActive(false);

            const item = {
                hiddenNews: announcement.current.id
            };

            localStorage.setItem(storageKey, JSON.stringify(item));
        },
        onThemeChange: (newTheme, dark) => {
            PrimeReact.changeTheme(theme, newTheme, 'theme-css', () => {
                setDark(dark);
                setTheme(newTheme);
            });
        },
        onTableThemeChange: (currentTableTheme, newTableTheme) => {
            changeTableTheme(currentTableTheme, newTableTheme);
        }
    };

    if (Component.getLayout) {
        return <LayoutProvider>{Component.getLayout(<Component {...props} />)}</LayoutProvider>;
    } else {
        return (
            <LayoutProvider>
                <Layout {...props}>
                    <Component {...props} />
                </Layout>
            </LayoutProvider>
        );
    }
}
