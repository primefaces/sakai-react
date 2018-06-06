import React, { Component } from 'react';
import {InputText} from 'primereact/components/inputtext/InputText'
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class AppTopbar extends Component {

    static defaultProps = {
        topbarMenuActive: null,
        onToggleMenu: null,
        onTopbarMobileMenuButtonClick: null
    }

    static propTypes = {
        topbarMenuActive: PropTypes.bool,
        onToggleMenu: PropTypes.func.isRequired,
        onTopbarMobileMenuButtonClick: PropTypes.func.isRequired
    }

    render() {
        let topbarClass = classNames('animated',{'topbar-icons-visible flipInX':this.props.topbarMenuActive, 'flipOutX':!this.props.topbarMenuActive})

        return (
            <div className="topbar clearfix">
                <a id="omega-menu-button" onClick={this.props.onToggleMenu}>
                    <span className="fa fa-bars"/>
                </a>
                <span className="topbar-title"/>
                <a id="options-menu-button" onClick={this.props.onTopbarMobileMenuButtonClick}>
                    <span className="fa fa-ellipsis-h"/>
                </a>
                <div id="topbar-icons" className={topbarClass}>
                    <span className="topbar-search">
                        <InputText type="text" placeholder="Search" />
                        <span className="topbar-search-icon fa fa-search"/>
                    </span>
                    <a>
                        <span className="topbar-item-text">Messages</span>
                        <span className="topbar-icon fa fa-envelope-o animated swing"/>
                        <span className="topbar-badge animated rubberBand">5</span>
                    </a>
                    <a>
                        <span className="topbar-item-text">Settings</span>
                        <span className="topbar-icon fa fa-gear"/>
                    </a>
                    <a>
                        <span className="topbar-item-text">User</span>
                        <span className="topbar-icon fa fa-user"/>
                    </a>
                </div>
            </div>
        );
    }
}