import React from 'react';
import { InputText } from 'primereact/inputtext';

export const AppTopbar = (props) => {
    return (
        <div className="layout-topbar clearfix">
            <button type="button" className="p-link layout-menu-button" onClick={props.onToggleMenu}>
                <span className="pi pi-bars" />
            </button>
            <div className="layout-topbar-icons">
                <span className="layout-topbar-search">
                    <InputText type="text" placeholder="Search" />
                    <span className="layout-topbar-search-icon pi pi-search" />
                </span>
                <button type="button" className="p-link">
                    <span className="layout-topbar-item-text">Events</span>
                    <span className="layout-topbar-icon pi pi-calendar" />
                    <span className="layout-topbar-badge">5</span>
                </button>
                <button type="button" className="p-link">
                    <span className="layout-topbar-item-text">Settings</span>
                    <span className="layout-topbar-icon pi pi-cog" />
                </button>
                <button type="button" className="p-link">
                    <span className="layout-topbar-item-text">User</span>
                    <span className="layout-topbar-icon pi pi-user" />
                </button>
            </div>
        </div>
    );
}
