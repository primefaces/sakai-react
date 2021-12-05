import React, {useContext, useEffect, useState} from 'react';
import classNames from 'classnames';
import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';

import {AppTopbar} from './AppTopbar';
import {AppFooter} from './AppFooter';
import {AppMenu} from './AppMenu';
import {AppConfig} from './AppConfig';

import {Dashboard} from './components/Dashboard';
import {ButtonDemo} from './components/ButtonDemo';
import {ChartDemo} from './components/ChartDemo';
import {Documentation} from './components/Documentation';
import {FileDemo} from './components/FileDemo';
import {FloatLabelDemo} from './components/FloatLabelDemo';
import {FormLayoutDemo} from './components/FormLayoutDemo';
import {InputDemo} from './components/InputDemo';
import {ListDemo} from './components/ListDemo';
import {MenuDemo} from './components/MenuDemo';
import {MessagesDemo} from './components/MessagesDemo';
import {MiscDemo} from './components/MiscDemo';
import {OverlayDemo} from './components/OverlayDemo';
import {PanelDemo} from './components/PanelDemo';
import {TableDemo} from './components/TableDemo';
import {TreeDemo} from './components/TreeDemo';
import {InvalidStateDemo} from './components/InvalidStateDemo';

import {Crud} from './pages/Crud';
import {EmptyPage} from './pages/EmptyPage';
import {TimelineDemo} from './pages/TimelineDemo';

import PrimeReact from 'primereact/api';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';
import {Login} from "./pages/Login";
import AuthContext from "./AuthProvider";

const App = () => {

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const {isLoggedIn} = useContext(AuthContext);

    PrimeReact.ripple = true;

    let location = useLocation();
    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }


    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location]);

    const menu = [
        {
            label: 'Home',
            items: [{
                label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'
            }]
        },
        {
            label: 'UI Kit', icon: 'pi pi-fw pi-sitemap',
            items: [
                {label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/formlayout'},
                {label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/input'},
                {label: "Float Label", icon: "pi pi-fw pi-bookmark", to: "/floatlabel"},
                {label: "Invalid State", icon: "pi pi-fw pi-exclamation-circle", to: "invalidstate"},
                {label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/button'},
                {label: 'Table', icon: 'pi pi-fw pi-table', to: '/table'},
                {label: 'List', icon: 'pi pi-fw pi-list', to: '/list'},
                {label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/tree'},
                {label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/panel'},
                {label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/overlay'},
                {label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/menu'},
                {label: 'Message', icon: 'pi pi-fw pi-comment', to: '/messages'},
                {label: 'File', icon: 'pi pi-fw pi-file', to: '/file'},
                {label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/chart'},
                {label: 'Misc', icon: 'pi pi-fw pi-circle-off', to: '/misc'},
            ]
        },
        {
            label: 'Pages', icon: 'pi pi-fw pi-clone',
            items: [
                {label: 'Crud', icon: 'pi pi-fw pi-user-edit', to: '/crud'},
                {label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/timeline'},
                {label: 'Empty', icon: 'pi pi-fw pi-circle-off', to: '/empty'},
                {label: 'Login', icon: 'pi pi-fw pi-sign-in', to: '/login'}
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
                        },
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
                        }
                    ]
                }
            ]
        },
        {
            label: 'Get Started',
            items: [
                {
                    label: 'Documentation', icon: 'pi pi-fw pi-question', command: () => {
                        window.location = "#/documentation"
                    }
                },
                {
                    label: 'View Source', icon: 'pi pi-fw pi-search', command: () => {
                        window.location = "https://github.com/primefaces/sakai-react"
                    }
                }
            ]
        }
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });


    const layoutMainContainerClass = classNames(isLoggedIn ? 'layout-main-container' : '')
    const layoutMainClass = classNames(isLoggedIn ? 'layout-main' : '')


    const RequireAuth = ({children}) => {
        if (!isLoggedIn) {
            return <Navigate to="/login" state={{from: location}}/>;
        }
        return children;
    }

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            {isLoggedIn &&
            <>
                <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                           mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}/>
                <div className="layout-sidebar" onClick={onSidebarClick}>
                    <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode}/>
                </div>
            </>}
            <div className={layoutMainContainerClass}>
                <div className={layoutMainClass}>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/" exact="true" element={<RequireAuth><Dashboard/></RequireAuth>}/>
                        <Route path="/formlayout" element={<RequireAuth><FormLayoutDemo/></RequireAuth>}/>
                        <Route path="/input" element={<RequireAuth> <InputDemo/> </RequireAuth>}/>
                        <Route path="/floatlabel" element={<RequireAuth> <FloatLabelDemo/> </RequireAuth>}/>
                        <Route path="/invalidstate" element={<RequireAuth><InvalidStateDemo/></RequireAuth>}/>
                        <Route path="/button" element={<RequireAuth><ButtonDemo/></RequireAuth>}/>
                        <Route path="/table" element={<RequireAuth><TableDemo/></RequireAuth>}/>
                        <Route path="/list" element={<RequireAuth><ListDemo/></RequireAuth>}/>
                        <Route path="/tree" element={<RequireAuth><TreeDemo/></RequireAuth>}/>
                        <Route path="/panel" element={<RequireAuth><PanelDemo/></RequireAuth>}/>
                        <Route path="/overlay" element={<RequireAuth><OverlayDemo/></RequireAuth>}/>
                        <Route path="/menu" element={<RequireAuth><MenuDemo/></RequireAuth>}/>
                        <Route path="/messages" element={<RequireAuth><MessagesDemo/></RequireAuth>}/>
                        <Route path="/file" element={<RequireAuth><FileDemo/></RequireAuth>}/>
                        <Route path="/chart" element={<RequireAuth><ChartDemo/></RequireAuth>}/>
                        <Route path="/misc" element={<RequireAuth><MiscDemo/></RequireAuth>}/>
                        <Route path="/timeline" element={<RequireAuth><TimelineDemo/></RequireAuth>}/>
                        <Route path="/crud" element={<RequireAuth><Crud/></RequireAuth>}/>
                        <Route path="/empty" element={<RequireAuth><EmptyPage/> </RequireAuth>}/>
                        <Route path="/documentation" element={<RequireAuth><Documentation/> </RequireAuth>}/>
                    </Routes>
                </div>
                <AppFooter layoutColorMode={layoutColorMode}/>
            </div>
            {isLoggedIn &&
            <>
                <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                           layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange}/>
                <CSSTransition classNames="layout-mask" timeout={{enter: 200, exit: 200}} in={mobileMenuActive} unmountOnExit>
                    <div className="layout-mask p-component-overlay"></div>
                </CSSTransition>
            </>}

        </div>
    );

}

export default App;
