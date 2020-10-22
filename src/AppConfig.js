import React, { useRef, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { InputSwitch } from 'primereact/inputswitch';
import classNames from 'classnames';

export function AppConfig(props) {

    const [active, setActive] = useState(false);
    const config = useRef(null)


    const toggleConfigurator = (event) => {
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

    const hideConfigurator = (event) => {
        this.setState({ active: false });
        this.unbindOutsideClickListener();
        event.preventDefault();
    }


    const bindOutsideClickListener = () => {
        if (!this.outsideClickListener) {
            this.outsideClickListener = (event) => {
                if (this.state.active && this.isOutsideClicked(event)) {
                    this.hideConfigurator(event);
                }
            };
            document.addEventListener('click', this.outsideClickListener);
        }
    }

    const unbindOutsideClickListener = () => {
        if (this.outsideClickListener) {
            document.removeEventListener('click', this.outsideClickListener);
            this.outsideClickListener = null;
        }
    }

    const isOutsideClicked = (event) => {
        return !(this.config.isSameNode(event.target) || this.config.contains(event.target));
    }


    render() {
        const configClassName = classNames('layout-config', {
            'layout-config-active': this.state.active
        });


        return (
            <div ref={config} className={configClassName}>
                <div className="layout-config-content-wrapper">
                    <button className="layout-config-button p-link" onClick={toggleConfigurator}>
                        <i className="pi pi-cog"></i>
                    </button>
                    <button className="layout-config-close p-link" onClick={hideConfigurator}>
                        <i className="pi pi-times"></i>
                    </button>
                </div>
                <div className="layout-config-content">

                    <h5 style={{ marginTop: '0px' }}>Input Style</h5>
                    <div className="p-formgroup-inline">
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="input_outlined" name="inputstyle" value="outlined" onChange={(e) => props.onInputStyleChange(e.value)} checked={props.inputStyle === 'outlined'} />
                            <label htmlFor="input_outlined">Outlined</label>
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="input_filled" name="inputstyle" value="filled" onChange={(e) => props.onInputStyleChange(e.value)} checked={props.inputStyle === 'filled'} />
                            <label htmlFor="input_filled">Filled</label>
                        </div>
                    </div>

                    <h5>Ripple Effect</h5>
                    <InputSwitch checked={props.rippleEffect} onChange={props.onRippleEffect} />

                    <h5>Menu Type</h5>
                    <div className="p-formgroup-inline">
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="static" name="layoutMode" value="static" onChange={(e) => props.onLayoutModeChange(e.value)} checked={props.layoutMode === 'static'} />
                            <label htmlFor="static">Static</label>
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="overlay" name="layoutMode" value="overlay" onChange={(e) => props.onLayoutModeChange(e.value)} checked={props.layoutMode === 'overlay'} />
                            <label htmlFor="overlay">Overlay</label>
                        </div>
                    </div>

                    <h5>Menu Color</h5>
                    <div className="p-formgroup-inline">
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="dark" name="layoutColorMode" value="dark" onChange={(e) => props.onColorModeChange(e.value)} checked={props.layoutColorMode === 'dark'} />
                            <label htmlFor="dark">Dark</label>
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="light" name="layoutColorMode" value="light" onChange={(e) => props.onColorModeChange(e.value)} checked={props.layoutColorMode === 'light'} />
                            <label htmlFor="light">Light</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}