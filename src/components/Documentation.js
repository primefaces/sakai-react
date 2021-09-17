import React from 'react';
import { CodeHighlight } from './CodeHighlight';

export const Documentation = () => {

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card docs">
                    <h4>Current Version</h4>
                    <p>React 17.x and PrimeReact 6.x</p>

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

                    <h5>Structure</h5>
                    <p>Sakai consists of 2 main parts; the application layout and the resources. <b>App.js</b> inside src folder is the main component containing the template for the base layout
                            whereas required resources such as SASS structure for the layout are placed inside the <b>src/layout</b> folder.</p>

                    <h5>Template</h5>
                    <p>Main layout is the JSX template of the App.js, it is divided into a couple of child components such as topbar, profile, menu and footer. Here is render method of the
                    App.js component that implements the logic such as menu state, layout modes and so on.
                        </p>

<CodeHighlight>
{`
<div className={wrapperClass} onClick={onWrapperClick}>
    <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
               mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}/>

    <div className="layout-sidebar" onClick={onSidebarClick}>
        <AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
    </div>

    <div className="layout-main-container">
        <div className="layout-main">
            <Route path="/" exact component={Dashboard}/>
            <Route path="/formlayout" component={FormLayoutDemo}/>
            <Route path="/input" component={InputDemo}/>
            <Route path="/floatlabel" component={FloatLabelDemo}/>
            <Route path="/invalidstate" component={InvalidStateDemo}/>
            <Route path="/button" component={ButtonDemo}/>
            <Route path="/table" component={TableDemo}/>
            <Route path="/list" component={ListDemo}/>
            <Route path="/tree" component={TreeDemo}/>
            <Route path="/panel" component={PanelDemo}/>
            <Route path="/overlay" component={OverlayDemo}/>
            <Route path="/menu" component={MenuDemo}/>
            <Route path="/messages" component={MessagesDemo}/>
            <Route path="/file" component={FileDemo}/>
            <Route path="/chart" component={ChartDemo}/>
            <Route path="/misc" component={MiscDemo}/>
            <Route path="/timeline" component={TimelineDemo}/>
            <Route path="/crud" component={Crud}/>
            <Route path="/empty" component={EmptyPage}/>
            <Route path="/documentation" component={Documentation}/>
        </div>

        <AppFooter layoutColorMode={layoutColorMode}/>
    </div>

    <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
               layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

    <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
        <div className="layout-mask p-component-overlay"></div>
    </CSSTransition>

</div>
`}
</CodeHighlight>

                    <h5>Menu</h5>
                    <p>Menu is a separate component defined in AppMenu.js file based on PrimeReact MenuModel API. In order to define the menuitems,
                    navigate to createMenu() method App.js file and define your own model as a nested structure. Here is the menu component from the demo application.
                            Notice that menu object is bound to the model property of AppMenu component as shown above.</p>

<CodeHighlight lang="js">
{`
const menu = [
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
    {
        label: 'UI Kit', icon: 'pi pi-fw pi-sitemap',
        items: [
            { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/formlayout' },
            { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/input' },
            { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/floatlabel' },
            { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/button' },
            { label: 'Table', icon: 'pi pi-fw pi-table', to: '/table' },
            { label: 'List', icon: 'pi pi-fw pi-list', to: '/list' },
            { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/tree' },
            { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/panel' },
            { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/overlay' },
            { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/menu' },
            { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/messages' },
            { label: 'File', icon: 'pi pi-fw pi-file', to: '/file' },
            { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/chart' },
            { label: 'Misc', icon: 'pi pi-fw pi-circle-off', to: '/misc' },
        ]
    },
    {
        label: 'Pages', icon: 'pi pi-fw pi-clone',
        items: [
            { label: 'Crud', icon: 'pi pi-fw pi-user-edit', to: '/crud' },
            {label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/timeline'},
            { label: 'Empty Page', icon: 'pi pi-fw pi-circle-off', to: '/empty' }
        ]
    },
    {
        label: 'Menu Hierarchy', icon: 'pi pi-fw pi-search',
        items: [
            {
                label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                        ]
                    },
                    {
                        label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.2.2', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                ]
            },
            {
                label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 2.1.3', icon: 'pi pi-fw pi-bookmark' },
                        ]
                    },
                    {
                        label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 2.2.2', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    }
                ]
            }
        ]
    },
    { label: 'Documentation', icon: 'pi pi-fw pi-question', command: () => { window.location = "#/documentation" } },
    { label: 'View Source', icon: 'pi pi-fw pi-search', command: () => { window.location = "https://github.com/primefaces/sakai-react" } }
];

`}
</CodeHighlight>

                    <p>Dependencies of Sakai are listed below and needs to be added to package.json. Only required
                            dependency is PrimeReact where optional dependencies exist to enable certain components in PrimeReact.</p>

<CodeHighlight lang="js">
{`
"primereact": "...",                //required: PrimeReact components
"primeicons": "...",                  //required: Icons
"primeflex": "..."
`}
</CodeHighlight>

                    <h5>PrimeReact Theme</h5>
                    <p>Sakai uses the free Saga, Arya and Vela themes which are distributed within PrimeReact, however it can be used with any PrimeReact theme as well such as material, tailwind and bootstrap.</p>

                    <h5>SASS Variables</h5>
                    <p>In case you'd like to customize the layout variables, open _variables.scss file under src/layout folder. Saving the changes
                    will be reflected instantly at your browser.
                        </p>

                    <h5>src/layout/_variables.scss</h5>
<CodeHighlight lang="scss">
{`
/* General */
$fontSize:1rem;
$borderRadius:12px;
$transitionDuration:.2s;
$maskBg:rgba(0, 0, 0, 0.4);
`}
</CodeHighlight>
                </div>
            </div>
        </div>
    )
}
