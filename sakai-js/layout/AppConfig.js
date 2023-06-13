import PrimeReact from 'primereact/api';
import { Sidebar } from 'primereact/sidebar';
import React, { useContext, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';

  



const AppConfig = (props) => {
    const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);


    const onConfigButtonClick = () => {
        setLayoutState((prevState) => ({ ...prevState, configSidebarVisible: true }));
    };

    const onConfigSidebarHide = () => {
        setLayoutState((prevState) => ({ ...prevState, configSidebarVisible: false }));
    };


    const changeTheme = (theme, colorScheme) => {
        PrimeReact.changeTheme(layoutConfig.theme, theme, 'theme-css', () => {
            setLayoutConfig((prevState) => ({ ...prevState, theme, colorScheme }));
        });
    };


    return (
        <>
            <button className="layout-topbar-button p-link" type="button" onClick={onConfigButtonClick}>
                <i className="pi pi-cog"></i>
                <span>Configuraciones</span>
            </button>

            <Sidebar visible={layoutState.configSidebarVisible} onHide={onConfigSidebarHide} position="right" className="layout-config-sidebar w-20rem">
                <h5>Tema</h5>
                <div className="grid">
                    <div className="col-2">
                        <button className="p-link" onClick={() => changeTheme('light-theme', 'light')}>
                            <i className="pi pi-sun"></i>
                        </button>
                    </div><div className="col-2">
                        <button className="p-link" onClick={() => changeTheme('dark-theme', 'dark')}>
                            <i className="pi pi-moon"></i>
                        </button>
                    </div>
                </div>
            </Sidebar>
        </>
    );
};

export default AppConfig;
