import React from 'react';
import { CodeHighlight } from './CodeHighlight';

export const Documentation = () => {

    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card docs">
                    <h4>Current Version</h4>
                    <p>React 17.x and PrimeReact 6.x</p>

                    <h4>Getting Started</h4>
                    <p>Sigma is an application template for React based on the popular <a href="https://github.com/facebookincubator/create-react-app">create-react-app</a> that allows
                            creating React apps with no configuration. To get started, clone the <a href="https://github.com/primefaces/sigma-react">repository</a> from GitHub and install the dependencies with npm or yarn.</p>
<CodeHighlight>
{`
"npm install" or "yarn"
`}
</CodeHighlight>

                    <p>Next step is running the application using the start script and navigate to <b>http://localhost:3000/</b> to view the application.
                            That is it, you may now start with the development of your application using the Sigma template.</p>

<CodeHighlight>
{`
"npm start" or "yarn start"
`}
</CodeHighlight>

                    <h4>React Scripts</h4>
                    <p>Following commands are derived from create-app-app.</p>
<CodeHighlight>
{`
"npm start" or "yarn start": Starts the development server
"npm test" or "yarn test": Runs the tests.
"npm run build" or "yarn run build": Creates a production build.
`}
</CodeHighlight>

                    <h4>Structure</h4>
                    <p>Sigma consists of 2 main parts; the application layout and the resources. <b>App.js</b> inside src folder is the main component containing the template for the base layout
                            whereas required resources such as SASS structure for the layout are placed inside the <b>src/layout</b> folder.</p>

                    <h4>Template</h4>
                    <p>Main layout is the JSX template of the App.js, it is divided into a couple of child components such as topbar, profile, menu and footer. Here is render method of the
                    App.js component that implements the logic such as menu state, layout modes and so on.
                        </p>

<CodeHighlight>
{`
<div className={wrapperClass} onClick={onWrapperClick}>
    <AppTopbar onToggleMenu={onToggleMenu} />

    <CSSTransition classNames="layout-sidebar" timeout={{ enter: 200, exit: 200 }} in={isSidebarVisible()} unmountOnExit>
        <div ref={sidebar} className={sidebarClassName} onClick={onSidebarClick}>
            <div className="layout-logo">
                <img alt="Logo" src={logo} />
            </div>
            <AppProfile />
            <AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
        </div>
    </CSSTransition>

    <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
        layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

    <div className="layout-main">
        <Route path="/" exact component={Dashboard} />
        <Route path="/formlayout" component={FormLayoutDemo} />
        <Route path="/input" component={InputDemo} />
        <Route path="/floatlabel" component={FloatLabelDemo} />
        <Route path="/button" component={ButtonDemo} />
        <Route path="/table" component={TableDemo} />
        <Route path="/list" component={ListDemo} />
        <Route path="/tree" component={TreeDemo} />
        <Route path="/panel" component={PanelDemo} />
        <Route path="/overlay" component={OverlayDemo} />
        <Route path="/menu" component={MenuDemo} />
        <Route path="/messages" component={MessageDemo} />
        <Route path="/file" component={FileDemo} />
        <Route path="/chart" component={ChartDemo} />
        <Route path="/misc" component={MiscDemo} />
        <Route path="/display" component={DisplayDemo} />
        <Route path="/elevation" component={ElevationDemo} />
        <Route path="/flexbox" component={FlexBoxDemo} />
        <Route path="/icons" component={IconsDemo} />
        <Route path="/grid" component={GridDemo} />
        <Route path="/spacing" component={SpacingDemo} />
        <Route path="/typography" component={TypographyDemo} />
        <Route path="/text" component={TextDemo} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/crud" component={Crud} />
        <Route path="/empty" component={EmptyPage} />
        <Route path="/documentation" component={Documentation} />
    </div>

    <AppFooter />

</div>
`}
</CodeHighlight>

                    <h4>Menu</h4>
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
        label: 'Utilities', icon: 'pi pi-fw pi-globe',
        items: [
            { label: 'Display', icon: 'pi pi-fw pi-desktop', to: '/display' },
            { label: 'Elevation', icon: 'pi pi-fw pi-external-link', to: '/elevation' },
            { label: 'Flexbox', icon: 'pi pi-fw pi-directions', to: '/flexbox' },
            { label: 'Icons', icon: 'pi pi-fw pi-search', to: '/icons' },
            { label: 'Grid System', icon: 'pi pi-fw pi-th-large', to: '/grid' },
            { label: 'Spacing', icon: 'pi pi-fw pi-arrow-right', to: '/spacing' },
            { label: 'Typography', icon: 'pi pi-fw pi-align-center', to: '/typography' },
            { label: 'Text', icon: 'pi pi-fw pi-pencil', to: '/text' },
        ]
    },
    {
        label: 'Pages', icon: 'pi pi-fw pi-clone',
        items: [
            { label: 'Crud', icon: 'pi pi-fw pi-user-edit', to: '/crud' },
            { label: 'Calendar', icon: 'pi pi-fw pi-calendar-plus', to: '/calendar' },
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
    { label: 'View Source', icon: 'pi pi-fw pi-search', command: () => { window.location = "https://github.com/primefaces/sigma-react" } }
];

`}
</CodeHighlight>

                    <p>Dependencies of Sigma are listed below and needs to be added to package.json. Only required
                            dependency is PrimeReact where optional dependencies exist to enable certain components in PrimeReact.</p>

<CodeHighlight lang="js">
{`
"primereact": "...",                //required: PrimeReact components
"primeicons": "..."                  //required: Icons
`}
</CodeHighlight>

                    <h4>Saga Theme</h4>
                    <p>Sigma uses the free Saga-Blue theme of PrimeReact which is a free theme distributed within PrimeReact, however it can be used with any PrimeReact theme.</p>

                    <h4>SASS Variables</h4>
                    <p>In case you'd like to customize the layout variables, open _variables.scss file under src/layout folder. Saving the changes
                    will be reflected instantly at your browser.
                        </p>

                    <h5>src/layout/_variables.scss</h5>
<CodeHighlight lang="scss">
{`
/* General */
$fontSize:14px;
$bodyBgColor:#edf0f5;
$textColor:#333333;
$textSecondaryColor:#707070;
$borderRadius:3px;
$dividerColor:#e3e3e3;
$transitionDuration:.2s;
$maskBgColor:#424242;
$focusShadowColor:#8dcdff;

/* Menu Common */
$menuitemBadgeBgColor:#007be5;
$menuitemBadgeColor:#ffffff;
$submenuFontSize:13px;
$menuitemActiveRouteColor:#1fa1fc;

/* Menu Light */
$menuBgColorFirst:#f3f4f9;
$menuBgColorLast:#d7dbe8;
$menuitemColor:#232428;
$menuitemHoverColor:#0388e5;
$menuitemActiveColor:#0388e5;
$menuitemActiveBgColor:#ffffff;
$menuitemBorderColor:rgba(207, 211, 224, 0.6);

/* Menu Dark */
$menuDarkBgColorFirst:#4d505b;
$menuDarkBgColorLast:#3b3e47;
$menuitemDarkColor:#ffffff;
$menuitemDarkHoverColor:#0388e5;
$menuitemDarkActiveColor:#0388e5;
$menuitemDarkActiveBgColor:#2e3035;
$menuitemDarkBorderColor:rgba(52, 56, 65, 0.6);

/* Topbar */
$topbarLeftBgColor:#0388E5;
$topbarRightBgColor:#07BDF4;
$topbarItemBadgeBgColor:#ef6262;
$topbarItemBadgeColor:#ffffff;
$topbarItemColor:#ffffff;
$topbarItemHoverColor:#c3e8fb;
$topbarSearchInputBorderBottomColor:#ffffff;
$topbarSearchInputColor:#ffffff;

/* Footer */
$footerBgColor:#ffffff;
`}
</CodeHighlight>

                    <h4>Menu Modes</h4>
                    <p>Menu has 2 modes, static and overlay. Main layout container element in App.js is used to define which mode to use by adding specific classes. List
                            below indicates the style classes for each mode.</p>

                    <ul>
                        <li>Static: "layout-wrapper layout-static"</li>
                        <li>Overlay: "layout-wrapper layout-overlay"</li>
                    </ul>

                    <p>For example to create an overlay menu, the div element should be in following form;</p>
<CodeHighlight>
{`
<div className="layout-wrapper layout-overlay">
`}
</CodeHighlight>

                    <p>It is also possible to leave the choice to the user by keeping the preference at a component and using an expression to bind it so that user can switch between modes. Sample
                            application has an example implementation of such use case. Refer to App.js for an example.</p>

                    <h4>Menu Color Scheme</h4>
                    <p>There are two alternatives as the menu colors schemes; "light" and "dark". A color scheme is applied using the <i>layout-sidebar-light</i> or <i>layout-sidebar-dark </i>
                         to the sidebar element.</p>

                    <b>Dark Menu</b>
<CodeHighlight>
{`
<div className="layout-sidebar layout-sidebar-dark">
`}
</CodeHighlight>

                    <b>Light Menu</b>
<CodeHighlight>
{`
<div className="layout-sidebar layout-sidebar-light">
`}
</CodeHighlight>

                    <h4>Grid CSS</h4>
                    <p>Sigma uses PrimeFlex CSS Grid throughout the samples. Although any grid library can be used, we recommend using PrimeFlex as your layout framework as it is well tested and supported by PrimeReact. PrimeFlex is
                        available at <a href="https://www.npmjs.com/package/primeflex">NPM</a>.</p>

                    <h4>Customizing Styles</h4>
                    <p>It is suggested to write your customizations in <i>src/layout/_overrides.scss</i> file instead of adding them to the
                        scss files under sass folder to avoid maintenance issues after an update.</p>
                </div>
            </div>
        </div>
    )
}
