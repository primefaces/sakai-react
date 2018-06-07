import React, { Component } from 'react';
import { InputText } from 'primereact/components/inputtext/InputText'
import PropTypes from 'prop-types';

export class AppTopbar extends Component {

    static defaultProps = {
        onToggleMenu: null
    }

    static propTypes = {
        onToggleMenu: PropTypes.func.isRequired
    }

    render() {
        return (
            <div className="layout-topbar clearfix">
                <a className="layout-menu-button" onClick={this.props.onToggleMenu}>
                    <span className="fa fa-bars"/>
                </a>
                <div className="layout-topbar-icons">
                    <span className="layout-topbar-search">
                        <InputText type="text" placeholder="Search" />
                        <span className="layout-topbar-search-icon fa fa-search"/>
                    </span>
                    <a>
                        <span className="layout-topbar-item-text">Messages</span>
                        <span className="layout-topbar-icon fa fa-envelope-o animated swing"/>
                        <span className="layout-topbar-badge animated rubberBand">5</span>
                    </a>
                    <a>
                        <span className="layout-topbar-item-text">Settings</span>
                        <span className="layout-topbar-icon fa fa-gear"/>
                    </a>
                    <a>
                        <span className="layout-topbar-item-text">User</span>
                        <span className="layout-topbar-icon fa fa-user"/>
                    </a>
                </div>
            </div>
        );
    }
}