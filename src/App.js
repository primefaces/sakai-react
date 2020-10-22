import React, { Component } from 'react';
import classNames from 'classnames';
import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppProfile } from './AppProfile';
import { Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { MiscDemo } from './components/MiscDemo';
import { EmptyPage } from './components/EmptyPage';
import { Documentation } from "./components/Documentation";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './layout/flags/flags.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import './layout/layout.scss';
import './App.scss';
import { InputDemo } from './components/InputDemo';
import { FormLayoutDemo } from './components/FormLayoutDemo';
import { ButtonDemo } from './components/ButtonDemo';
import { PanelDemo } from "./components/PanelDemo";
import { MessageDemo } from './components/MessageDemo';
import { MenuDemo } from './components/MenuDemo';
import { OverlayDemo } from './components/OverlayDemo';
import { FileDemo } from './components/FileDemo';
import { ChartDemo } from './components/ChartDemo';
import { TableDemo } from './components/TableDemo';
import { ListDemo } from './components/ListDemo';
import { TreeDemo } from './components/TreeDemo';
import { Crud } from './components/Crud';
import { CSSTransition } from 'react-transition-group';
import { AppConfig } from './AppConfig';
import PrimeReact from 'primereact/utils';


class App extends Component {

    constructor() {
        super();
        this.state = {
            layoutMode: 'static',
            layoutColorMode: 'dark',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            inputStyle: 'outlined',
            rippleEffect: false,
        };
        PrimeReact.ripple = false;

        this.onWrapperClick = this.onWrapperClick.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onSidebarClick = this.onSidebarClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.onInputStyleChange = this.onInputStyleChange.bind(this);
        this.onRippleEffect = this.onRippleEffect.bind(this);
        this.onLayoutModeChange = this.onLayoutModeChange.bind(this);
        this.onColorModeChange = this.onColorModeChange.bind(this);

        this.createMenu();
    }


    onInputStyleChange(inputStyle) {
        this.setState({ inputStyle: inputStyle });
    }

    onRippleEffect(e) {
        PrimeReact.ripple = e.value;
        this.setState({ rippleEffect: e.value })
    }

    onLayoutModeChange(mode) {
        this.setState({ layoutMode: mode });
    }

    onColorModeChange(mode) {
        this.setState({ layoutColorMode: mode });
    }

    onWrapperClick(event) {
        if (!this.menuClick) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            });
        }

        this.menuClick = false;
    }

    onToggleMenu(event) {
        this.menuClick = true;

        if (this.isDesktop()) {
            if (this.state.layoutMode === 'overlay') {
                this.setState({
                    overlayMenuActive: !this.state.overlayMenuActive
                });
            }
            else if (this.state.layoutMode === 'static') {
                this.setState({
                    staticMenuInactive: !this.state.staticMenuInactive
                });
            }
        }
        else {
            const mobileMenuActive = this.state.mobileMenuActive;
            this.setState({
                mobileMenuActive: !mobileMenuActive
            });
        }
        event.preventDefault();
    }

    onSidebarClick(event) {
        this.menuClick = true;
    }

    onMenuItemClick(event) {
        if (!event.item.items) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            })
        }
    }

    createMenu() {
        this.menu = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => { window.location = '#/' } },
            {
                label: 'Menu Modes', icon: 'pi pi-fw pi-cog',
                items: [
                    { label: 'Static Menu', icon: 'pi pi-fw pi-bars', command: () => this.setState({ layoutMode: 'static' }) },
                    { label: 'Overlay Menu', icon: 'pi pi-fw pi-bars', command: () => this.setState({ layoutMode: 'overlay' }) }
                ]
            },
            {
                label: 'Menu Colors', icon: 'pi pi-fw pi-align-left',
                items: [
                    { label: 'Dark', icon: 'pi pi-fw pi-bars', command: () => this.setState({ layoutColorMode: 'dark' }) },
                    { label: 'Light', icon: 'pi pi-fw pi-bars', command: () => this.setState({ layoutColorMode: 'light' }) }
                ]
            },
            {
                label: 'Components', icon: 'pi pi-fw pi-globe', badge: '9',
                items: [

                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/formlayout' },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/input' },
                    { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/button' },
                    { label: 'Table', icon: 'pi pi-fw pi-table', to: '/table' },
                    { label: 'List', icon: 'pi pi-fw pi-list', to: '/list' },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/tree' },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/panel' },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/overlay' },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/menu' },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/message' },
                    { label: 'File', icon: 'pi pi-fw pi-file', to: '/file' },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/chart' },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle-off', to: '/misc' }
                ]
            },
            {
                label: 'Template Pages', icon: 'pi pi-fw pi-file',
                items: [
                    { label: 'Empty Page', icon: 'pi pi-fw pi-circle-off', to: '/empty' },
                    { label: 'Crud', icon: 'pi pi-fw pi-circle-off', to: '/crud' }
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
            { label: 'View Source', icon: 'pi pi-fw pi-search', command: () => { window.location = "https://github.com/primefaces/sigma" } }
        ];
    }

    addClass(element, className) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    removeClass(element, className) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    componentDidUpdate() {
        if (this.state.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    }

    isSidebarVisible() {
        if (this.isDesktop()) {
            if (this.state.layoutMode === 'static')
                return !this.state.staticMenuInactive;
            else if (this.state.layoutMode === 'overlay')
                return this.state.overlayMenuActive;
            else
                return true;
        }
        else {
            return true;
        }
    }

    render() {
        const logo = this.state.layoutColorMode === 'dark' ? 'assets/layout/images/logo-white.svg' : 'assets/layout/images/logo.svg';

        const wrapperClass = classNames('layout-wrapper', {
            'layout-overlay': this.state.layoutMode === 'overlay',
            'layout-static': this.state.layoutMode === 'static',
            'layout-static-sidebar-inactive': this.state.staticMenuInactive && this.state.layoutMode === 'static',
            'layout-overlay-sidebar-active': this.state.overlayMenuActive && this.state.layoutMode === 'overlay',
            'layout-mobile-sidebar-active': this.state.mobileMenuActive,
            'p-input-filled': this.state.inputStyle === 'filled',
            'p-ripple-disabled': this.state.rippleEffect === false
        });

        const sidebarClassName = classNames("layout-sidebar", {
            'layout-sidebar-dark': this.state.layoutColorMode === 'dark',
            'layout-sidebar-light': this.state.layoutColorMode === 'light'
        });

        return (
            <div className={wrapperClass} onClick={this.onWrapperClick}>
                <AppTopbar onToggleMenu={this.onToggleMenu} />

                <CSSTransition classNames="layout-sidebar" timeout={{ enter: 200, exit: 200 }} in={this.isSidebarVisible()} unmountOnExit>
                    <div ref={(el) => this.sidebar = el} className={sidebarClassName} onClick={this.onSidebarClick}>
                        <div className="layout-logo">
                            <img alt="Logo" src={logo} />
                        </div>
                        <AppProfile />
                        <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
                    </div>
                </CSSTransition>

                <AppConfig rippleEffect={this.state.rippleEffect} onRippleEffect={this.onRippleEffect}
                    inputStyle={this.state.inputStyle} onInputStyleChange={this.onInputStyleChange}
                    layoutMode={this.state.layoutMode} onLayoutModeChange={this.onLayoutModeChange}
                    layoutColorMode={this.state.layoutColorMode} onColorModeChange={this.onColorModeChange} />

                <div className="layout-main">
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/empty" component={EmptyPage} />
                    <Route path="/documentation" component={Documentation} />
                    <Route path="/formlayout" component={FormLayoutDemo} />
                    <Route path="/input" component={InputDemo} />
                    <Route path="/button" component={ButtonDemo} />
                    <Route path="/panel" component={PanelDemo} />
                    <Route path="/message" component={MessageDemo} />
                    <Route path="/menu" component={MenuDemo} />
                    <Route path="/overlay" component={OverlayDemo} />
                    <Route path="/file" component={FileDemo} />
                    <Route path="/chart" component={ChartDemo} />
                    <Route path="/misc" component={MiscDemo} />
                    <Route path="/table" component={TableDemo} />
                    <Route path="/list" component={ListDemo} />
                    <Route path="/tree" component={TreeDemo} />
                    <Route path="/crud" component={Crud} />
                </div>

                <AppFooter />

                <div className="layout-mask"></div>
            </div>
        );
    }
}

export default App;
