import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { InputSwitch } from 'primereact/inputswitch';
import classNames from 'classnames';
import {Button} from "primereact/button";

export const AppConfig = (props) => {

    const [active, setActive] = useState(false);
    const [scale, setScale] = useState(16);
    const [scales] = useState([12,13,14,15,16]);
    const [themeScheme, setThemeScheme] = useState('saga');
    const [themeColor, setThemeColor] = useState('blue');
    const config = useRef(null);
    let outsideClickListener = useRef(null);

    const unbindOutsideClickListener = useCallback(() => {
        if (outsideClickListener.current) {
            document.removeEventListener('click', outsideClickListener.current);
            outsideClickListener.current = null;
        }
    }, []);

    const hideConfigurator = useCallback((event) => {
        setActive(false);
        unbindOutsideClickListener();
        event.preventDefault();
    }, [unbindOutsideClickListener]);

    const bindOutsideClickListener = useCallback(() => {
        if (!outsideClickListener.current) {
            outsideClickListener.current = (event) => {
                if (active && isOutsideClicked(event)) {
                    hideConfigurator(event);
                }
            };
            document.addEventListener('click', outsideClickListener.current);
        }
    }, [active, hideConfigurator]);

    useEffect(() => {
        if (active) {
            bindOutsideClickListener()
        }
        else {
            unbindOutsideClickListener()
        }
    }, [active, bindOutsideClickListener, unbindOutsideClickListener]);

    const isOutsideClicked = (event) => {
        return !(config.current.isSameNode(event.target) || config.current.contains(event.target));
    }

    const decrementScale = () => {
        setScale((prevState) => --prevState);
    }

    const incrementScale = () => {
        setScale((prevState) => ++prevState);
    }

    useEffect(() => {
        document.documentElement.style.fontSize = scale + 'px';
    }, [scale])

    const toggleConfigurator = (event) => {
        setActive(prevState => !prevState);
    }

    const configClassName = classNames('layout-config', {
        'layout-config-active': active
    });

    useEffect(() => {
        let theme = themeScheme + '-' + themeColor;
        let themeElement = document.getElementById('theme-link');
        const themeHref = 'assets/themes/' + theme + '/theme.css';
        replaceLink(themeElement, themeHref);

    })

    const replaceLink = (linkElement, href, callback) => {
        if (isIE()) {
            linkElement.setAttribute('href', href);

            if (callback) {
                callback();
            }
        }
        else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);

                if (callback) {
                    callback();
                }
            });
        }
    }

    const isIE = () => {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent)
    }

    const changeThemeScheme = (e, theme) => {
        props.onColorModeChange(e.value);
        setThemeScheme(theme);
    }

    const changeThemeColor = (e, color) => {
        setThemeColor(color);
    }

    return (
        <div ref={config} className={configClassName} id={"layout-config"}>
            <button className="layout-config-button p-link" id="layout-config-button" onClick={toggleConfigurator}>
                <i className="pi pi-cog"></i>
            </button>
            <Button className="p-button-danger layout-config-close p-button-rounded p-button-text" icon="pi pi-times" onClick={hideConfigurator}/>

            <div className="layout-config-content">
                <h6 className="mt-0">Component Scale</h6>
                <div className="config-scale">
                    <Button icon="pi pi-minus" onClick={decrementScale} className="p-button-text" disabled={scale === scales[0]} />
                    {
                        scales.map((item) => {
                            return <i className={classNames('pi pi-circle-on', {'scale-active': item === scale})} key={item}/>
                        })
                    }
                    <Button icon="pi pi-plus" onClick={incrementScale} className="p-button-text" disabled={scale === scales[scales.length - 1]} />
                </div>

                <h6>Input Style</h6>
                <div className="p-formgroup-inline">
                    <div className="field-radiobutton">
                        <RadioButton inputId="input_outlined" name="inputstyle" value="outlined" onChange={(e) => props.onInputStyleChange(e.value)} checked={props.inputStyle === 'outlined'} />
                        <label htmlFor="input_outlined">Outlined</label>
                    </div>
                    <div className="field-radiobutton">
                        <RadioButton inputId="input_filled" name="inputstyle" value="filled" onChange={(e) => props.onInputStyleChange(e.value)} checked={props.inputStyle === 'filled'} />
                        <label htmlFor="input_filled">Filled</label>
                    </div>
                </div>

                <h6>Ripple Effect</h6>
                <InputSwitch checked={props.rippleEffect} onChange={props.onRippleEffect} />

                <h6>Menu Type</h6>
                <div className="p-formgroup-inline">
                    <div className="field-radiobutton">
                        <RadioButton inputId="static" name="layoutMode" value="static" onChange={(e) => props.onLayoutModeChange(e.value)} checked={props.layoutMode === 'static'} />
                        <label htmlFor="static">Static</label>
                    </div>
                    <div className="field-radiobutton">
                        <RadioButton inputId="overlay" name="layoutMode" value="overlay" onChange={(e) => props.onLayoutModeChange(e.value)} checked={props.layoutMode === 'overlay'} />
                        <label htmlFor="overlay">Overlay</label>
                    </div>
                </div>

                <h6>Color Scheme</h6>
                <div className="p-formgroup-inline">
                    <div className="field-radiobutton">
                        <RadioButton inputId="light" name="layoutColorMode" value="light" onChange={e => changeThemeScheme(e, 'saga')} checked={props.layoutColorMode === 'light'} />
                        <label htmlFor="light">Light</label>
                    </div>
                    <div className="field-radiobutton">
                        <RadioButton inputId="dim" name="layoutColorMode" value="dim" onChange={e => changeThemeScheme(e, 'vela')} checked={props.layoutColorMode === 'dim'} />
                        <label htmlFor="dark">Dim</label>
                    </div>
                    <div className="field-radiobutton">
                        <RadioButton inputId="dark" name="layoutColorMode" value="dark" onChange={e => changeThemeScheme(e, 'arya')} checked={props.layoutColorMode === 'dark'} />
                        <label htmlFor="dark">Dark</label>
                    </div>
                </div>


                <h6>Primary Color</h6>
                <div className="flex">
                    <div style={{width: '2rem', height: '2rem', borderRadius:'6px'}} className="bg-blue-500 mr-3 cursor-pointer" onClick={e => changeThemeColor(e, 'blue')}/>
                    <div style={{width: '2rem', height: '2rem', borderRadius:'6px'}} className="bg-green-500 mr-3 cursor-pointer" onClick={e => changeThemeColor(e, 'green')}/>
                    <div style={{width: '2rem', height: '2rem', borderRadius:'6px'}} className="bg-orange-500 mr-3 cursor-pointer" onClick={e => changeThemeColor(e, 'orange')}/>
                    <div style={{width: '2rem', height: '2rem', borderRadius:'6px'}} className="bg-purple-500 mr-3 cursor-pointer" onClick={e => changeThemeColor(e, 'purple')}/>
                </div>

            </div>
        </div>
    );
}
