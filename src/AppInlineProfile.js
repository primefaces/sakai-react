import React, { Component } from 'react';
import classNames from 'classnames';

export class AppInlineProfile extends Component {

    constructor() {
        super();
        this.state = {
            expanded: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        this.setState({expanded: !this.state.expanded});
        event.preventDefault();
    }

    render() {
        return  (
            <div className="profile">
                <img src="assets/layout/images/profile.png" alt="" />
                <a id="profile-button" onClick={this.onClick}>
                    <span className="username">Peggy Olson</span>
                    <i className="fa fa-fw fa-cog"/>
                </a>
                <ul className={classNames({'profile-expanded': this.state.expanded})}>
                    <li><a><i className="fa fa-fw fa-sliders"/><span>Account</span></a></li>
                    <li><a><i className="fa fa-fw fa-bell"/><span>Notifications</span><span className="menu-badge">2</span></a></li>
                    <li><a><i className="fa fa-fw fa-sign-out"/><span>Logout</span></a></li>
                </ul>
            </div>
        );
    }
}