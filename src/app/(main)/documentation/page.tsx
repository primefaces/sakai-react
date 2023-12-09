/* eslint-disable @next/next/no-sync-scripts */
import React from 'react';

const Documentation = () => {
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card docs">
                        <h4>Current Version</h4>
                        <p>Next v13, React v18 with PrimeReact v9</p>

                        <h5>Getting Started</h5>
                        <p>
                            Sakai is an application template for React based on the popular{' '}
                            <a href="https://nextjs.org/" className="font-medium hover:underline">
                                NextJS
                            </a>{' '}
                            framework with new{' '}
                            <a href="https://nextjs.org/docs/app" className="font-medium hover:underline">
                                App Router
                            </a>
                            . To get started, clone the{' '}
                            <a href="https://github.com/primefaces/sakai-react" className="font-medium hover:underline">
                                repository
                            </a>{' '}
                            from GitHub and install the dependencies with npm or yarn.
                        </p>
                        <pre className="app-code">
                            <code>{`"npm install" or "yarn"`}</code>
                        </pre>

                        <p>
                            Next step is running the application using the start script and navigate to <b>http://localhost:3000/</b> to view the application. That is it, you may now start with the development of your application using the Sakai
                            template.
                        </p>

                        <pre className="app-code">
                            <code>{`"npm run dev" or "yarn dev"`}</code>
                        </pre>

                        <h5>Dependencies</h5>
                        <p>Dependencies of Sakai are listed below and needs to be defined at package.json.</p>

                        <pre className="app-code">
                            <code>{`"primereact": "^9.6.2",                    //required: PrimeReact components
"primeicons": "^6.0.1",                    //required: Icons
"primeflex": "^3.3.0",                     //required: Utility CSS classes
`}</code>
                        </pre>

                        <h5>Structure</h5>
                        <p>Sakai consist of a couple of folders where demos and core layout have been separated.</p>
                        <p>
                            There are two{' '}
                            <a href="https://nextjs.org/docs/app/building-your-application/routing/route-groups" className="font-medium hover:underline">
                                root groups
                            </a>{' '}
                            under the app folder; <span className="text-primary font-medium">{`(main)`}</span> represents the pages that reside in the main dashboard layout whereas <span className="text-primary font-medium">{`(full-page)`}</span>{' '}
                            groups the pages with full page content such as landing page or a login page.
                        </p>
                        <ul className="line-height-3">
                            <li>
                                <span className="text-primary font-medium">layout/</span>: Main layout files
                            </li>
                            <li>
                                <span className="text-primary font-medium">demo/</span>: Contains demo related utilities and helpers
                            </li>
                            <li>
                                <span className="text-primary font-medium">app/</span>: Demo pages
                            </li>
                            <li>
                                <span className="text-primary font-medium">public/demo</span>: Assets used in demos
                            </li>
                            <li>
                                <span className="text-primary font-medium">public/layout</span>: Assets used in layout such as a logo
                            </li>
                            <li>
                                <span className="text-primary font-medium">styles/demo</span>: Styles used in demos only
                            </li>
                            <li>
                                <span className="text-primary font-medium">styles/layout</span>: SCSS files of the core layout
                            </li>
                        </ul>
                        <h5>Route Groups</h5>
                        <p>
                            Root Layout is the main of the application and it is defined at <span className="text-primary font-medium">app/layout.tsx</span> file. It contains the style imports and layout context provider.
                        </p>
                        <pre className="app-code">
                            <code>
                                {`"use client"
import { LayoutProvider } from "./layout/context/layoutcontext";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
...
import "../styles/layout/layout.scss";
import "../styles/demo/Demos.scss";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          id="theme-css"
          href={\`/themes/lara-light-indigo/theme.css\`}
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <PrimeReactProvider>
            <LayoutProvider>{children}</LayoutProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}

`}
                            </code>
                        </pre>
                        <p>
                            The pages that are using the layout elements need to be defined under the <span className="text-primary font-medium">app/{'(main)'}/</span> folder. Those pages use the{' '}
                            <span className="text-primary font-medium">app/{'(main)'}/layout.tsx</span> as the root layout.
                        </p>
                        <pre className="app-code">
                            <code>
                                {`import { Metadata } from 'next';
import Layout from "../../layout/layout";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "Sakai by PrimeReact | Free Admin Template for NextJS",
    ...
  };

export default function MainLayout({ children }: MainLayoutProps) {
  return <Layout>{children}</Layout>;
}
`}
                            </code>
                        </pre>
                        <p>
                            Only the pages that are using config sidebar wihout layout elements need to be defined under the <span className="text-primary font-medium">app/{'(full-page)'}/</span> folder. Those pages use the{' '}
                            <span className="text-primary font-medium">app/{'(full-page)'}/layout.tsx</span> as the root layout.
                        </p>
                        <pre className="app-code">
                            <code>
                                {`import { Metadata } from 'next';
import AppConfig from "../../layout/AppConfig";
import React from "react";

interface FullPageLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "Sakai by PrimeReact | Free Admin Template for NextJS",
    ...
  };

export default function FullPageLayout({ children }: FullPageLayoutProps) {
  return (
    <React.Fragment>
      {children}
      <AppConfig minimal />
    </React.Fragment>
  );
}
`}
                            </code>
                        </pre>
                        <h5>Default Configuration</h5>
                        <p>
                            Initial layout configuration can be defined at the <span className="text-primary font-medium">layout/context/layoutcontext.js</span> file, this step is optional and only necessary when customizing the defaults.
                        </p>

                        <pre className="app-code">
                            <code>
                                {`"use client";
import React, { useState } from 'react';
import Head from 'next/head';
export const LayoutContext = React.createContext();

export const LayoutProvider = (props) => {
    const [layoutConfig, setLayoutConfig] = useState({
        ripple: false,                          //toggles ripple on and off
        inputStyle: 'outlined',                 //default style for input elements
        menuMode: 'static',                     //layout mode of the menu, valid values are "static" or "overlay"
        colorScheme: 'light',                   //color scheme of the template, valid values are "light", "dim" and "dark"
        theme: 'lara-light-indigo',             //default component theme for PrimeReact
        scale: 14                               //size of the body font size to scale the whole application
    });
}`}
                            </code>
                        </pre>

                        <h5>Menu</h5>
                        <p>
                            Main menu is defined at <span className="text-primary font-medium">AppMenu.js</span> file based on{' '}
                            <a href="https://www.primefaces.org/primereact/menumodel/" className="font-medium hover:underline">
                                MenuModel API
                            </a>
                            .
                        </p>

                        <h5>Integration with Existing NextJS Applications</h5>
                        <p>Only the folders related to the layout need to be moved into your project. Integration of pages involves moving the files under those folders. Make sure that the using page is defined under the related group layout.</p>

                        <h5>PrimeReact Theme</h5>
                        <p>
                            Sakai theming is based on the PrimeReact theme being used. Default theme is <b>lara-light-indigo</b>.
                        </p>

                        <h5>SASS Variables</h5>
                        <p>
                            In case you&apos;d like to customize the main layout variables, open <b>_variables.scss</b> file under layout folder. Saving the changes will be reflected instantly at your browser.
                        </p>

                        <h6>layout/_variables.scss</h6>
                        <pre className="app-code" lang="scss">
                            <code>
                                {`
/* General */
$scale:14px;                    /* initial font size */ 
$borderRadius:12px;             /* border radius of layout element e.g. card, sidebar */ 
$transitionDuration:.2s;        /* transition duration of layout elements e.g. sidebar */ 
`}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Documentation;
