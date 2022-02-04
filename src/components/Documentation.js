import React from 'react';
import { CodeHighlight } from './CodeHighlight';

const Documentation = () => {

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card docs">
                    <h4>Current Version</h4>
                    <p>React 17.x and PrimeReact 7.x</p>

                    <h5>Getting Started</h5>
                    <p>Sakai is an application template for React based on the popular <a href="https://github.com/facebook/create-react-app">create-react-app</a> that allows
                            creating React apps with no configuration. To get started, clone the <a href="https://github.com/primefaces/sakai-react">repository</a> from GitHub and install the dependencies with npm or yarn.</p>
<CodeHighlight>
{`
"npm install" or "yarn"
`}
</CodeHighlight>

                    <p>Next step is running the application using the start script and navigate to <b>http://localhost:3000/</b> to view the application.
                            That is it, you may now start with the development of your application using the Sakai template.</p>

<CodeHighlight>
{`
"npm start" or "yarn start"
`}
</CodeHighlight>

                    <h5>React Scripts</h5>
                    <p>Following commands are derived from create-app-app.</p>
<CodeHighlight>
{`
"npm start" or "yarn start": Starts the development server
"npm test" or "yarn test": Runs the tests.
"npm run build" or "yarn run build": Creates a production build.
`}
</CodeHighlight>

                    <h5>Dependencies</h5>
                    <p>Dependencies of Sakai are listed below and needs to be defined at package.json.</p>

<CodeHighlight lang="js">
{`
"primereact": "...",                    //required: PrimeReact components
"primeicons": "...",                    //required: Icons
"primeflex": "...",                     //optional: Sample pages
"react-transition-group": "^4.4.1",     //required: PrimeReact animations
`}
</CodeHighlight>

                    <h5>Structure</h5>
                    <p>Sakai consists of 2 main parts; the application layout and the resources. <b>App.js</b> inside src folder is the main component containing the template for the base layout
                            whereas required resources such as SASS structure for the layout are placed inside the <b>src/layout</b> folder.</p>

                    <h5>Application Template</h5>
                    <p>Main layout is the JSX template of the App.js, it is divided into a couple of child components such as topbar, profile, menu and footer. Here is render method of the
                    App.js component that implements the logic such as menu state, layout modes and so on.
                        </p>

                    <h5>Menu</h5>
                    <p>Menu is a separate component defined in AppMenu.js file based on PrimeReact MenuModel API. In order to define the menuitems,
                    navigate to App.js file and define your own model as a nested structure. Here is the menu component from the demo application.</p>

                    <h5>PrimeReact Theme</h5>
                    <p>Sakai theming is based on the PrimeReact theme being used. Default theme is <b>lara-light-indigo</b>.</p>

                    <h5>SASS Variables</h5>
                    <p>In case you'd like to customize the main layout variables, open <b>_variables.scss</b> file under src/layout folder. Saving the changes
                    will be reflected instantly at your browser.
                        </p>

                    <h6>src/layout/_variables.scss</h6>
<CodeHighlight lang="scss">
{`
/* General */
$fontSize:14px;
$borderRadius:12px;
$transitionDuration:.2s;
`}
</CodeHighlight>
                </div>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Documentation, comparisonFn);
