'use client';

import { classNames } from 'primereact/utils';
import React, { useContext, useEffect, useState } from 'react';
import { AppConfigProps, LayoutConfig, LayoutState } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import LocalizationSwift from '@/app/components/LocalizationSwift';
import { Dialog } from 'primereact/dialog';
import { useLocalization } from '@/layout/context/localizationcontext';
import MouseMagnifier from '@/app/components/MouseMagnifier';

const AppConfig = (props: AppConfigProps) => {
    const [scales] = useState<number[]>([16, 18, 20, 22]);
    const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const { translations } = useLocalization();

    const [isA11y, setIsA11y] = useState(()=> {
        if(typeof window !== 'undefined') {
            return localStorage.getItem('isA11y') || false
        }
        return false;
    });
    const [highContrast, setHighContrast] = useState(()=> {
        if(typeof window !== 'undefined') {
            return localStorage.getItem('highContrast') || false
        }
        return false;
    });
    const [magnifier, setMagnifier] = useState(()=> {
        if(typeof window !== 'undefined') {
            return localStorage.getItem('magnifier') || false
        }
        return false;
    });
    const [scaleOption, setScaleOption] = useState<number | null>(null);

    const onConfigButtonClick = () => {
        setLayoutState((prevState: LayoutState) => ({ ...prevState, configSidebarVisible: true }));
    };

    const onConfigSidebarHide = () => {
        setLayoutState((prevState: LayoutState) => ({ ...prevState, configSidebarVisible: false }));
    };

    const scaleWidth = (item: number) => {
        let word = ''
        switch (item) {
            case 16 :
                word = translations.scaleDefault
                break;
            case 18 :
                word = translations.scaleMd
                break;
            case 20 :
                word = translations.scaleLg
                break;
            case 22 :
                word = translations.scaleXl
                break;
            default :
                word = ''
                break;
        }
        return word
    }

    const a11yOn: boolean = typeof isA11y === 'string' ? JSON.parse(isA11y) : isA11y;
    const contrastOn: boolean = typeof highContrast === 'string' ? JSON.parse(highContrast) : highContrast;
    const magnifierOn: boolean = typeof magnifier === 'string' ? JSON.parse(magnifier) : magnifier;
    // Крупный курсор нужен и тем, кто выбрал увеличенный текст или большой / очень большой шрифт
    const bigCursorOn = magnifierOn || a11yOn || layoutConfig.scale >= 20;
    const activeScale = scaleOption ?? (a11yOn ? null : layoutConfig.scale);

    const toggleA11y = () => {
        localStorage.setItem('isA11y', JSON.stringify(!a11yOn));
        setIsA11y(!a11yOn);
        setScaleOption(null);
    };

    const toggleContrast = () => {
        localStorage.setItem('highContrast', JSON.stringify(!contrastOn));
        setHighContrast(!contrastOn);
    };

    const toggleMagnifier = () => {
        localStorage.setItem('magnifier', JSON.stringify(!magnifierOn));
        setMagnifier(!magnifierOn);
    };

    const selectScale = (item: number) => {
        setIsA11y(false);
        localStorage.removeItem('isA11y');
        document.documentElement.removeAttribute('class');
        setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, scale: item }));
        setScaleOption(item);
    };

    const applyScale = () => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    };

    useEffect(() => {
        applyScale();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutConfig.scale]);

    useEffect(() => {
        document.documentElement.removeAttribute('style');
        document.documentElement.classList.toggle('a11y', typeof isA11y === 'string' ? JSON.parse(isA11y) : isA11y);
    }, [isA11y]);

    useEffect(() => {
        document.body.classList.toggle('high-contrast', typeof highContrast === 'string' ? JSON.parse(highContrast) : highContrast);
    }, [highContrast]);

    useEffect(() => {
        document.body.classList.toggle('big-cursor', bigCursorOn);
    }, [bigCursorOn]);

    return (
        <>
            {magnifierOn && <MouseMagnifier />}
            <button className="layout-config-button config-link bg-[var(--mainColor)]" type="button" onClick={onConfigButtonClick}>
                <i className="pi pi-cog"></i>
            </button>

            <Dialog
                header={
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-[38px] h-[38px] rounded-xl bg-[var(--mainBgColor)] text-[var(--mainColor)]">
                            <i className="pi pi-sliders-h" style={{ fontSize: '18px' }} />
                        </span>
                        <span className="text-xl font-semibold text-[var(--titleColor)]">{translations.panelTitle}</span>
                    </div>
                }
                visible={layoutState.configSidebarVisible}
                position="right"
                onHide={onConfigSidebarHide}
                draggable={false}
                resizable={false}
                className="config-panel w-full sm:w-25rem"
            >
                {!props.simple && (
                    <div className="flex flex-col gap-5">
                        <section className="flex flex-col gap-2">
                            <span className="config-section-title">{translations.visionBlock}</span>
                            <div className="flex flex-col gap-2">
                                <button type="button" role="switch" aria-checked={a11yOn} onClick={toggleA11y} className={classNames('config-option', { 'config-option-active': a11yOn })}>
                                    <span className="config-option-icon font-bold">
                                        A<sup className="text-[11px]">+</sup>
                                    </span>
                                    <span className="flex-1 text-left">{translations.toggleLargeText}</span>
                                    <span className="config-switch" />
                                </button>
                                <button type="button" role="switch" aria-checked={contrastOn} onClick={toggleContrast} className={classNames('config-option', { 'config-option-active': contrastOn })}>
                                    <span className="config-option-icon">
                                        <i className="pi pi-eye" style={{ fontSize: '17px' }} />
                                    </span>
                                    <span className="flex-1 text-left">{translations.toggleHighContrast}</span>
                                    <span className="config-switch" />
                                </button>
                                <button type="button" role="switch" aria-checked={magnifierOn} onClick={toggleMagnifier} className={classNames('config-option', { 'config-option-active': magnifierOn })}>
                                    <span className="config-option-icon">
                                        <i className="pi pi-search-plus" style={{ fontSize: '17px' }} />
                                    </span>
                                    <span className="flex-1 text-left">{translations.toggleMagnifier}</span>
                                    <span className="config-switch" />
                                </button>
                            </div>
                        </section>

                        <section className="flex flex-col gap-2">
                            <span className="config-section-title">{translations.fontScaleLabel}</span>
                            <div className="grid grid-cols-4 gap-2" role="radiogroup">
                                {scales.map((item, idx) => {
                                    const active = item === activeScale;
                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            role="radio"
                                            aria-checked={active}
                                            title={scaleWidth(item)}
                                            onClick={() => selectScale(item)}
                                            className={classNames('config-scale', { 'config-scale-active': active })}
                                        >
                                            <span className="font-semibold leading-none" style={{ fontSize: `${16 + idx * 3}px` }}>
                                                Aa
                                            </span>
                                            <span className="text-[13px] leading-tight text-center">{scaleWidth(item)}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="flex flex-col gap-2">
                            <span className="config-section-title">{translations.langSwitcher}</span>
                            <LocalizationSwift full />
                        </section>
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default AppConfig;
