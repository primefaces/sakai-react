import Head from "next/head";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-dark.css";
import "../src/assets/demo/flags/flags.css";
import "../src/assets/demo/Demos.scss";
import "../src/assets/layout/layout.scss";
// import "../public/assets/themes/lara-light-indigo/theme.css";
import Layout from "../src/components/Layout";
import React from "react";

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>PrimeReact - Sakai</title>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <link id="theme-link" rel="stylesheet" href="/assets/themes/lara-light-indigo/theme.css" />
                <link rel="icon" type="image/x-icon" href="favicon.ico" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}
