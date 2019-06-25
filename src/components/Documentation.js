import React, { Component } from 'react';
import './Documentation.scss';

export class Documentation extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card docs">
                        <h1>Current Version</h1>
                        <p>React 16.8.6 and PrimeReact 3.1.7</p>

                        <h1>Getting Started</h1>
                        <p>Sigma is an application template for React based on the popular <a href="https://github.com/facebookincubator/create-react-app">create-react-app</a> that allows
                            creating React apps with no configuration. To get started, clone the <a href="https://github.com/primefaces/sigma">repository</a> from GitHub and install the dependencies with npm or yarn.</p>
                        <pre>
{
`npm install
`}
</pre>

                        or

                        <pre>
{
`yarn
`}
</pre>

                        <p>Next step is running the application using the start script and navigate to <b>http://localhost:3000/</b> to view the application.
                            That is it, you may now start with the development of your application using the Sigma template.</p>

                        <pre>
{
`npm start
`}
</pre>

                        or

                        <pre>
{
    `yarn start
`}
</pre>

                        <h1>React Scripts</h1>
                        <p>Following commands are derived from create-app-app.</p>
                        <pre>
{
`"npm start" or "yarn start": Starts the development server
"npm test" or "yarn test": Runs the tests.
"npm run build" or "yarn run build": Creates a production build.
`}
</pre>

                        <h1>Structure</h1>
                        <p>Sigma consists of 2 main parts; the application layout and the resources. <b>App.js</b> inside src folder is the main component containing the template for the base layout
                            whereas required resources such as SASS structure for the layout are placed inside the <b>src/layout</b> folder.</p>

                        <h1>Template</h1>
                        <p>Main layout is the JSX template of the App.js, it is divided into a couple of child components such as topbar, profile, menu and footer. Here is render method of the
                            App.js component that implements the logic such as menu state, layout modes and so on.
                        </p>

                        <pre>
{
`<div className={wrapperClass} onClick={this.onWrapperClick}>
    <AppTopbar onToggleMenu={this.onToggleMenu}/>

    <div ref={(el) => this.sidebar = el} className={sidebarClassName} onClick={this.onSidebarClick}>
        <div className="layout-logo">
            <img alt="Logo" src={logo} />
        </div>
        <AppProfile />
        <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
    </div>

    <div className="layout-main">
        <Route path="/" exact component={Dashboard} />
        <Route path="/forms" component={FormsDemo} />
        <Route path="/sample" component={SampleDemo} />
        <Route path="/data" component={DataDemo} />
        <Route path="/panels" component={PanelsDemo} />
        <Route path="/overlays" component={OverlaysDemo} />
        <Route path="/menus" component={MenusDemo} />
        <Route path="/messages" component={MessagesDemo} />
        <Route path="/charts" component={ChartsDemo} />
        <Route path="/misc" component={MiscDemo} />
        <Route path="/empty" component={EmptyPage} />
        <Route path="/documentation" component={Documentation} />
    </div>

    <AppFooter />

    <div className="layout-mask"></div>
</div>
`
}
</pre>

                        <h1>Menu</h1>
                        <p>Menu is a separate component defined in AppMenu.js file based on PrimeReact MenuModel API. In order to define the menuitems,
                            navigate to createMenu() method App.js file and define your own model as a nested structure. Here is the menu component from the demo application.
                            Notice that menu object is bound to the model property of AppMenu component as shown above.</p>

                        <pre>
{
`
createMenu() {
    this.menu = [
        {label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => {window.location = '#/'}},
        {
            label: 'Menu Modes', icon: 'pi pi-fw pi-cog',
            items: [
                {label: 'Static Menu', icon: 'pi pi-fw pi-bars',  command: () => this.setState({layoutMode: 'static'}) },
                {label: 'Overlay Menu', icon: 'pi pi-fw pi-bars',  command: () => this.setState({layoutMode: 'overlay'}) }
            ]
        },
        {
            label: 'Menu Colors', icon: 'pi pi-fw pi-align-left',
            items: [
                {label: 'Dark', icon: 'pi pi-fw pi-bars',  command: () => this.setState({layoutColorMode: 'dark'}) },
                {label: 'Light', icon: 'pi pi-fw pi-bars',  command: () => this.setState({layoutColorMode: 'light'}) }
            ]
        },
        {
            label: 'Components', icon: 'pi pi-fw pi-globe', badge: '9',
            items: [
                {label: 'Sample Page', icon: 'pi pi-fw pi-star-o', command: () => {window.location = '#/sample'}},
                {label: 'Forms', icon: 'pi pi-fw pi-calendar', command: () => {window.location = '#/forms'}},
                {label: 'Data', icon: 'pi pi-fw pi-align-justify', command: () => {window.location = "#/data"}},
                {label: 'Panels', icon: 'pi pi-fw pi-th-large', command: () => {window.location = "#/panels"}},
                {label: 'Overlays', icon: 'pi pi-fw pi-clone', command: () => {window.location = "#/overlays"}},
                {label: 'Menus', icon: 'pi pi-fw pi-bars', command: () => {window.location = "#/menus"}},
                {label: 'Messages', icon: 'pi pi-fw pi-info-circle', command: () => {window.location = "#/messages"}},
                {label: 'Charts', icon: 'pi pi-fw pi-clock', command: () => {window.location = "#/charts"}},
                {label: 'Misc', icon: 'pi pi-fw pi-filter', command: () => {window.location = "#/misc"}}
            ]
        },
        {
            label: 'Template Pages', icon: 'pi pi-fw pi-file',
            items: [
                {label: 'Empty Page', icon: 'pi pi-fw pi-circle-off', command: () => {window.location = "#/empty"}}
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
                                {label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark'},
                                {label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark'},
                                {label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark'},
                            ]
                        },
                        {
                            label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark'},
                                {label: 'Submenu 1.2.2', icon: 'pi pi-fw pi-bookmark'}
                            ]
                        }
                    ]
                },
                {
                    label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark'},
                                {label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark'},
                                {label: 'Submenu 2.1.3', icon: 'pi pi-fw pi-bookmark'},
                            ]
                        },
                        {
                            label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark'},
                                {label: 'Submenu 2.2.2', icon: 'pi pi-fw pi-bookmark'}
                            ]
                        },
                    ]
                }
            ]
        },
        {label: 'Documentation', icon: 'pi pi-fw pi-question', command: () => {window.location = "#/documentation"}}
    ];
}
`}
</pre>

                        <p>Dependencies of Sigma are listed below and needs to be added to package.json. Only required
                            dependency is PrimeReact where optional dependencies exist to enable certain components in PrimeReact.</p>

                        <pre>
{
`"primereact": "^3.1.7",                //required: PrimeReact components
"primeicons": "1.0.00"                  //required: Icons
`
}
</pre>

                        <h1>Nova Theme</h1>
                        <p>Sigma uses the free Nova-Light theme of PrimeReact which is a free theme distributed within PrimeReact, however it can be used with any PrimeReact theme.</p>

                        <h1>SASS Variables</h1>
                        <p>In case you'd like to customize the layout variables, open _variables.scss file under src/layout folder. Saving the changes
                            will be reflected instantly at your browser.
                        </p>

                        <h3>src/layout/layout.scss</h3>
                        <pre>
{
`/* General */
$fontSize:14px;
$bodyBgColor:#edf0f5;
$textColor:#333333;
$textSecondaryColor:#707070;
$borderRadius:3px;
$dividerColor:#e3e3e3;
$transitionDuration:.2s;
$maskBgColor:#424242;

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
`
}
</pre>

                        <h1>Menu Modes</h1>
                        <p>Menu has 2 modes, static and overlay. Main layout container element in App.js is used to define which mode to use by adding specific classes. List
                            below indicates the style classes for each mode.</p>

                        <ul>
                            <li>Static: "layout-wrapper layout-static"</li>
                            <li>Overlay: "layout-wrapper layout-overlay"</li>
                        </ul>

                        <p>For example to create an overlay menu, the div element should be in following form;</p>
                        <pre>
&lt;div className="layout-wrapper layout-overlay"&gt;
</pre>

                        <p>It is also possible to leave the choice to the user by keeping the preference at a component and using an expression to bind it so that user can switch between modes. Sample
                            application has an example implementation of such use case. Refer to App.js for an example.</p>

                        <h1>Menu Color Scheme</h1>
                        <p>There are two alternatives as the menu colors schemes; "light" and "dark". A color scheme is applied using the <i>layout-sidebar-light</i> or <i>layout-sidebar-dark</i>
                        to the sidebar element.</p>

                        <b>Dark Menu</b>
<pre>
&lt;div className="layout-sidebar layout-sidebar-dark"&gt;
</pre>
                
                        <b>Light Menu</b>
<pre>
&lt;div className="layout-sidebar layout-sidebar-light"&gt;
</pre>

                        <h1>Grid CSS</h1>
                        <p>Sigma uses PrimeFlex CSS Grid throughout the samples. Although any grid library can be used, we recommend using PrimeFlex as your layout framework as it is well tested and supported by PrimeVue. PrimeFlex is
                        available at <a href="https://www.npmjs.com/package/primeflex">NPM</a>.</p>

                        <h1>Customizing Styles</h1>
                        <p>It is suggested to write your customizations in <i>src/layout/_overrides.scss</i> file instead of adding them to the
                        scss files under sass folder to avoid maintenance issues after an update.</p>
                    </div>
                </div>
            </div>
        )
    }
}
