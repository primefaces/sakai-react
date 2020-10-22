import React, { Component } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { InputSwitch } from 'primereact/inputswitch';
import classNames from 'classnames';



export class AppConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false
        }

        this.toggleConfigurator = this.toggleConfigurator.bind(this);
        this.hideConfigurator = this.hideConfigurator.bind(this);
    }

    toggleConfigurator(event) {
        this.setState((prevState) => ({
            active: !prevState.active
        }), () => {
            if (this.state.active)
                this.bindOutsideClickListener();
            else
                this.unbindOutsideClickListener();
        });

        event.preventDefault();
    }

    hideConfigurator(event) {
        this.setState({ active: false });
        this.unbindOutsideClickListener();
        event.preventDefault();
    }


    bindOutsideClickListener() {
        if (!this.outsideClickListener) {
            this.outsideClickListener = (event) => {
                if (this.state.active && this.isOutsideClicked(event)) {
                    this.hideConfigurator(event);
                }
            };
            document.addEventListener('click', this.outsideClickListener);
        }
    }

    unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            document.removeEventListener('click', this.outsideClickListener);
            this.outsideClickListener = null;
        }
    }

    isOutsideClicked(event) {
        return !(this.config.isSameNode(event.target) || this.config.contains(event.target));
    }


    render() {
        const configClassName = classNames('layout-config', {
            'layout-config-active': this.state.active
        });


        return (
            <div ref={(el) => this.config = el} className={configClassName}>
                <div className="layout-config-content-wrapper">
                    <button className="layout-config-button p-link" onClick={this.toggleConfigurator}>
                        <i className="pi pi-cog"></i>
                    </button>
                    <button className="layout-config-close p-link" onClick={this.hideConfigurator}>
                        <i className="pi pi-times"></i>
                    </button>
                </div>
                <div className="layout-config-content">

                    <h5 style={{ marginTop: '0px' }}>Input Style</h5>
                    <div className="p-formgroup-inline">
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="input_outlined" name="inputstyle" value="outlined" onChange={(e) => this.props.onInputStyleChange(e.value)} checked={this.props.inputStyle === 'outlined'} />
                            <label htmlFor="input_outlined">Outlined</label>
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="input_filled" name="inputstyle" value="filled" onChange={(e) => this.props.onInputStyleChange(e.value)} checked={this.props.inputStyle === 'filled'} />
                            <label htmlFor="input_filled">Filled</label>
                        </div>
                    </div>

                    <h5>Ripple Effect</h5>
                    <InputSwitch checked={this.props.rippleEffect} onChange={this.props.onRippleEffect} />

                    <h5>Menu Type</h5>
                    <div className="p-formgroup-inline">
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="static" name="layoutMode" value="static" onChange={(e) => this.props.onLayoutModeChange(e.value)} checked={this.props.layoutMode === 'static'} />
                            <label htmlFor="static">Static</label>
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="overlay" name="layoutMode" value="overlay" onChange={(e) => this.props.onLayoutModeChange(e.value)} checked={this.props.layoutMode === 'overlay'} />
                            <label htmlFor="overlay">Overlay</label>
                        </div>
                    </div>

                    <h5>Menu Color</h5>
                    <div className="p-formgroup-inline">
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="dark" name="layoutColorMode" value="dark" onChange={(e) => this.props.onColorModeChange(e.value)} checked={this.props.layoutColorMode === 'dark'} />
                            <label htmlFor="dark">Dark</label>
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="light" name="layoutColorMode" value="light" onChange={(e) => this.props.onColorModeChange(e.value)} checked={this.props.layoutColorMode === 'light'} />
                            <label htmlFor="light">Light</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}