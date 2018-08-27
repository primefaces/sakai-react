import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class AppSubmenu extends Component {

    static defaultProps = {
        className: null,
        items: null,
        onMenuItemClick: null,
        root: false
    }

    static propTypes = {
        className: PropTypes.string,
        items: PropTypes.array,
        onMenuItemClick: PropTypes.func,
        root: PropTypes.bool
    }
    
    constructor(props) {
        super(props);
        this.state = {activeIndex: null};
    }
    
    onMenuItemClick(event, item, index) {
        //avoid processing disabled items
        if(item.disabled) {
            event.preventDefault();
            return true;
        }
                        
        //execute command
        if(item.command) {
            item.command({originalEvent: event, item: item});
        }

        //prevent hash change
        if(item.items || !item.url) {
            event.preventDefault();
        }

        if(index === this.state.activeIndex)
            this.setState({activeIndex: null});    
        else
            this.setState({activeIndex: index});

        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick({
                originalEvent: event,
                item: item
            });
        }
    } 
    
    render() {
        let items = this.props.items && this.props.items.map((item, i) => {
            let active = this.state.activeIndex === i;
            let styleClass = classNames(item.badgeStyleClass, {'active-menuitem': active});
            let badge = item.badge && <span className="menuitem-badge">{item.badge}</span>;
            let submenuIcon = item.items && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>;

            return (
                <li className={styleClass} key={i}>
                    {item.items && this.props.root===true && <div className='arrow'></div>}
                    <a href={item.url} onClick={(e) => this.onMenuItemClick(e, item, i)} target={item.target}>
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                        {submenuIcon}
                        {badge}
                    </a>
                    <AppSubmenu items={item.items} onMenuItemClick={this.props.onMenuItemClick}/>
                </li>
            );
        });
        
        return items ? <ul className={this.props.className}>{items}</ul> : null;
    }
}

export class AppMenu extends Component {

    static defaultProps = {
        model: null,
        onMenuItemClick: null
    }

    static propTypes = {
        model: PropTypes.array,
        onMenuItemClick: PropTypes.func
    }

    render() {
        return <div className="menu"><AppSubmenu items={this.props.model} className="layout-main-menu" onMenuItemClick={this.props.onMenuItemClick} root={true}/></div>
    }
}