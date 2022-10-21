import getConfig from 'next/config';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        const contextPath = getConfig().publicRuntimeConfig.contextPath;

        return (
            <Html lang="en">
                <Head>
                    <title>Sakai by PrimeReact | Free Admin Template for NextJS</title>
                    <meta charSet="UTF-8" />
                    <meta name="description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                    <meta name="robots" content="index, follow" />
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <meta property="og:type" content="website"></meta>
                    <meta property="og:title" content="Sakai by PrimeReact | Free Admin Template for NextJS"></meta>
                    <meta property="og:url" content="https://www.primefaces.org/sakai-react"></meta>
                    <meta property="og:description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                    <meta property="og:image" content="https://www.primefaces.org/static/social/sakai-nextjs.png"></meta>
                    <meta property="og:ttl" content="604800"></meta>
                    <link id="theme-css" href={`${contextPath}/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
