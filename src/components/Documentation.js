import React, { Component } from 'react';
import './Documentation.css';

export class Documentation extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="ui-g">
                <div className="ui-g-12">
                    <div className="card docs">
                        <h1>Current Version</h1>
                        <p>React 16.2.0 and PrimeReact 1.6.0</p>

                        <h1>Getting Started</h1>
                        <p>Sigma is an application template for React based on the popular <a href="https://github.com/facebookincubator/create-react-app">create-react-app</a> that allows
                            creating React apps with no configuration. To get started extract the contents of the zip bundle and install the dependencies
                            with npm or yarn.</p>
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
                            That is it, you may now start with the development of your application using the Avalon template.</p>

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
                        <p>Sigma consists of 3 main parts; the application layout, layout resources and theme resources for PrimeReact components. <b>App.js</b> inside src folder is the main component containing the template for the base layout
                            whereas required resources for the layout are placed inside the <b>public/assets/layout</b> folder and similarly theme resources are inside <b>public/assets/theme</b> folder.
                        </p>

                        <h1>Template</h1>
                        <p>Main layout is the JSX template of the App.js, it is divided into a couple of child components such as topbar, profile, menu and footer. Here is render method of the
                            App.js component that implements the logic such as menu state, layout modes and so on.
                        </p>

                        <pre>
{
`render() {
    let wrapperClass = classNames('wrapper', {
        'menu-layout-overlay': this.state.layoutMode === 'overlay',
        'menu-layout-static': this.state.layoutMode === 'static',
        'sidebar-inactive-l': this.state.staticMenuDesktopInactive,
        'sidebar-active-m': this.state.staticMenuMobileActive && this.state.layoutMode === 'static',
        'layout-menu-overlay-active': this.state.overlayMenuActive && this.state.layoutMode === 'overlay'
    });
    let sidebarClassName = classNames("sidebar",{'dark-sidebar': this.state.layoutColorMode === 'dark'});

    return (
        <div className={wrapperClass} onClick={this.onWrapperClick}>
            <AppTopbar onToggleMenu={this.onToggleMenu} onTopbarMobileMenuButtonClick={this.onTopbarMobileMenuButtonClick}
                       topbarMenuActive={this.state.topbarMenuActive} onTopbarItemClick={this.onTopbarItemClick}/>

            <div ref={(el) => this.sidebar = el} className={sidebarClassName} onClick={this.onSidebarClick}>

                <ScrollPanel ref={(el) => this.layoutMenuScroller = el} style={{height:'100%'}}>
                    <div className="sidebar-scroll-content" >
                        <div className="logo"></div>
                        <AppInlineProfile />
                        <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
                    </div>
                </ScrollPanel>
            </div>

            <div className="main">
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
                <Route path="/utils" component={UtilsDemo} />
                <Route path="/documentation" component={Documentation} />
            </div>

            <AppFooter />
        </div>
    );
}
`
}
</pre>

                        <h1>Menu</h1>
                        <p>Menu is a separate component defined in AppMenu.js file based on PrimeReact MenuModel API. In order to define the menuitems,
                            navigate to createMenu() method App.js file and define your own model as a nested structure. Here is the menu component from the demo application.
                            Notice that menu object is bound to the model property of AppMenu component as shown above.</p>

                        <pre>
{
`createMenu() {
    this.menu = [
        {label: 'Dashboard', icon: 'fa fa-fw fa-home', command: () => { window.location = '#/'}},
        {
            label: 'Menu Modes', icon: 'fa fa-fw fa-cog',
            items: [
                {label: 'Static Menu', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutMode: 'static'}) },
                {label: 'Overlay Menu', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutMode: 'overlay'}) }
            ]
        },
        {
            label: 'Layout Options', icon: 'fa fa-fw fa-diamond',
            items: [
                {label: 'Dark', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutColorMode: 'dark'}) },
                {label: 'Light', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutColorMode: 'light'}) }
            ]
        },
        {
            label: 'Components', icon: 'fa fa-fw fa-bars', badge: '2', badgeStyleClass: 'teal-badge',
            items: [
                {label: 'Sample Page', icon: 'fa fa-fw fa-columns', command: () => { window.location = '#/sample'}},
                {label: 'Forms', icon: 'fa fa-fw fa-code', command: () => { window.location = '#/forms'}},
                {label: 'Data', icon: 'fa fa-fw fa-table', command: () => { window.location = "#/data"}},
                {label: 'Panels', icon: 'fa fa-fw fa-list-alt', command: () => { window.location = "#/panels"}},
                {label: 'Overlays', icon: 'fa fa-fw fa-square', command: () => { window.location = "#/overlays"}},
                {label: 'Menus', icon: 'fa fa-fw fa-minus-square-o', command: () => { window.location = "#/menus"}},
                {label: 'Messages', icon: 'fa fa-fw fa-circle-o-notch', command: () => { window.location = "#/messages"}},
                {label: 'Charts', icon: 'fa fa-fw fa-area-chart', command: () => { window.location = "#/charts"}},
                {label: 'Misc', icon: 'fa fa-fw fa-user-secret', command: () => { window.location = "#/misc"}}
            ]
        },
        {
            label: 'Template Pages', icon: 'fa fa-fw fa-life-saver',
            items: [
                {label: 'Empty Page', icon: 'fa fa-fw fa-square-o', command: () => { window.location = "#/empty"}},
                {label: 'Login', icon: 'fa fa-fw fa-sign-in', url: 'assets/pages/login.html', target: '_blank'},
                {label: 'Error', icon: 'fa fa-fw fa-exclamation-circle', url: 'assets/pages/error.html', target: '_blank'},
                {label: '404 Page', icon: 'fa fa-fw fa-times', url: 'assets/pages/404.html', target: '_blank'},
                {label: 'Access Denied', icon: 'fa fa-fw fa-exclamation-triangle', url: 'assets/pages/access.html', target: '_blank'}
            ]
        },
        {
            label: 'Menu Hierarchy', icon: 'fa fa-fw fa-sitemap',
            items: [
                {
                    label: 'Submenu 1', icon: 'fa fa-fw fa-sign-in',
                    items: [
                        {
                            label: 'Submenu 1.1', icon: 'fa fa-fw fa-sign-in',
                            items: [
                                {label: 'Submenu 1.1.1', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 1.1.2', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 1.1.3', icon: 'fa fa-fw fa-sign-in'},
                            ]
                        },
                        {
                            label: 'Submenu 1.2', icon: 'fa fa-fw fa-sign-in',
                            items: [
                                {label: 'Submenu 1.2.1', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 1.2.2', icon: 'fa fa-fw fa-sign-in'}
                            ]
                        },
                    ]
                },
                {
                    label: 'Submenu 2', icon: 'fa fa-fw fa-sign-in',
                    items: [
                        {
                            label: 'Submenu 2.1', icon: 'fa fa-fw fa-sign-in',
                            items: [
                                {label: 'Submenu 2.1.1', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 2.1.2', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 2.1.3', icon: 'fa fa-fw fa-sign-in'},
                            ]
                        },
                        {
                            label: 'Submenu 2.2', icon: 'fa fa-fw fa-sign-in',
                            items: [
                                {label: 'Submenu 2.2.1', icon: 'fa fa-fw fa-sign-in'},
                                {label: 'Submenu 2.2.2', icon: 'fa fa-fw fa-sign-in'}
                            ]
                        },
                    ]
                }
            ]
        },
        {label: 'Documentation', icon: 'fa fa-fw fa-book', command: () => { window.location = "#/documentation"}}
    ];
}   
`}
</pre>

                        <p>Dependencies of Sigma are listed below and needs to be added to package.json. Only required
                            dependency is PrimeReact where optional dependencies exist to enable certain components in PrimeReact.</p>

                        <pre>
{
`"primereact": "^1.5.0",         //required: PrimeReact components
"font-awesome": "^4.7.0"        //required: Icons
`
}
</pre>

                        <h1>Omega Theme</h1>
                        <p>Sigma is a layout for the Omega theme of PrimeReact, Omega is a free theme distributed inside PrimeReact, however it can be used
                            with any PrimeReact theme.</p>

                        <h1>SASS Variables</h1>
                        <p>In case you'd like to customize the layout variables, open layout.scss files under src/layout folder. Saving the changes
                            will be reflected instantly at your browser.
                        </p>

                        <h3>src/layout/layout.scss</h3>
                        <pre>
{
`/* General */
$fontSize: 14px;
$dividerColor: #e3e3e3;
$submenuFontSize: 13px;
$menuitemBadgeBgColor: #007be5;
$menuitemBadgeColor: #ffffff;

/* Menu Dark*/
$menuDarkBgColorFirst: #4d505b;
$menuDarkBgColorLast: #3b3e47;
$menuitemDarkColor: #ffffff;
$menuitemDarkHoverColor: #0388e5;
$menuitemDarkActiveColor: #0388e5;
$menuitemDarkActiveBgColor: #2e3035;
$menuitemDarkBorderColor:  rgba(52, 56, 65, 0.6);
$backgroundDarkImage: url(./images/logo-white.svg) top left no-repeat;

/* Menu Light*/
$menuBgColorFirst: #f3f4f9;
$menuBgColorLast: #d7dbe8;
$menuitemColor: #232428;
$menuitemHoverColor: #0388e5;
$menuitemActiveColor: #0388e5;
$menuitemActiveBgColor: #ffffff;
$menuitemBorderColor: rgba(207, 211, 224, 0.6);
$backgroundImage: url(./images/logo.svg) top left no-repeat;

/* Topbar */
$topbarLeftBgColor:#0388E5;
$topbarRightBgColor:#07BDF4;
$topbarItemBadgeColor: #ef6262;
$topbarItemColor: #ffffff;
$topbarItemHoverColor: #77c7ff;

// === Button Colors === //
/* GreenButton */
$greenButton: #1f9e53;
$greenButtonBorder: #107533;
$greenButtonHover: #2eb971;
$greenButtonActive: #178544;

/* YellowButton */
$yellowButton: #eed511;
$yellowButtonBorder: #cdb80d;
$yellowButtonHover: #f8e653;
$yellowButtonActive: #d4b301;

/* RedButton */
$redButton: #b8312e;
$redButtonBorder: #9c1627;
$redButtonHover: #d2524f;
$redButtonActive: #9c1627;

/* greyButton */
$greyButton: #ECEFF1;
$greyButtonBorder: #CCCFD2;
$greyButtonText: #525252;
$greyButtonHover: #F5FBFF;
$greyButtonActive: #CCCFD2;

/* BlackButton */
$blackButton: #353535;
$blackButtonBorder: #212121;
$blackButtonHover: #4a4a4a;
$blackButtonActive: #212121;

/* BlueButton */
$blueButton: #2c78c7;
$blueButtonBorder: #1a51b0;
$blueButtonHover: #409cdc;
$blueButtonActive: #1a51b0;

/* AquaButton */
$aquaButton: #0084b4;
$aquaButtonBorder: #087298;
$aquaButtonHover: #03A8E4;
$aquaButtonActive: #087298;

/* NavyButton */
$navyButton: #1f3b59;
$navyButtonBorder: #21374f;
$navyButtonHover: #3C6592;
$navyButtonActive: #21374f;

@import "./sass/_layout";
`
}
</pre>

                        <p>In the demo app layout and theme css files are defined using link tags in index.html so the demo can switch them on the fly by changing the path however if this is not a requirement, you may also import them in App.js so that webpack adds them to the bundle.</p>

                        <h1>Menu Item Badges</h1>
                        <p>Badges are numerical indicators associated with a link.
                            The badge property is the value of the badge and badgeStyleClass is style class of the badge.</p>
                        <pre>
label: 'Components', icon: 'list', badge: '2', badgeClassName: 'red-badge'
</pre>
                        <p>Default badge uses the accent color of avalon layout and there are three more alternative colors.</p>
                        <ul>
                            <li>red-badge</li>
                            <li>purple-badge</li>
                            <li>teal-badge</li>
                        </ul>

                        <h1>Menu Modes</h1>
                        <p>Menu has 2 modes, static and overlay. Main layout container element in App.js is used to define which mode to use by adding specific classes. List
                            below indicates the style classes for each mode.</p>

                        <ul>
                            <li>Static: "layout-wrapper menu-layout-static"</li>
                            <li>Overlay: "layout-wrapper menu-layout-overlay"</li>
                        </ul>

                        <p>For example to create an overlay menu, the div element should be in following form;</p>
                        <pre>
&lt;div className="layout-wrapper menu-layout-overlay"&gt;
</pre>

                        <p>It is also possible to leave the choice to the user by keeping the preference at a component and using an expression to bind it so that user can switch between modes. Sample
                            application has an example implementation of such use case. Refer to App.js for an example.</p>

                        <h1>Dark Menu</h1>
                        <p>Default color scheme of menu is light and alternative dark mode can be activated by adding <i>dark-sidebar'</i> style class to the sidebar element.</p>

                        <pre>
&lt;div className="layout-sidebar layout-sidebar-dark"&gt;
</pre>

                        <h1>Grid CSS</h1>
                        <p>Sigma uses PrimeReact Grid CSS (ui-g-*) throughout the samples, although any grid library can be used we suggest using Grid CSS as your layout framework as it is well tested and supported by PrimeReact. Grid CSS is
                            available inside primereact.min.css.</p>

                        <h1>Customizing Styles</h1>
                        <p>It is suggested to write your customizations in <i>App.css</i> file instead of adding them to the
                            scss files under sass folders to avoid maintenance issues after an update.</p>
                    </div>
                </div>
            </div>
        )
    }
}
