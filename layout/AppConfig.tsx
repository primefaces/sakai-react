'use client';

import { classNames } from 'primereact/utils';
import React, { useContext, useEffect, useState } from 'react';
import { AppConfigProps, LayoutConfig, LayoutState } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import LocalizationSwift from '@/app/components/LocalizationSwift';
import { Dialog } from 'primereact/dialog';
import { useLocalization } from '@/layout/context/localizationcontext';

const AppConfig = (props: AppConfigProps) => {
    const [scales] = useState<number[]>([16, 18, 20, 22]);
    const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const { translations, language } = useLocalization();

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

    return (
        <>
            <button className="layout-config-button config-link bg-[var(--mainColor)]" type="button" onClick={onConfigButtonClick}>
                <i className="pi pi-cog"></i>
            </button>

            <Dialog header={translations.panelTitle} visible={layoutState.configSidebarVisible} position="right" onHide={onConfigSidebarHide} draggable={false} resizable={false} className="w-full sm:w-25rem">
                {!props.simple && (
                    <div className="flex flex-col gap-3">
                        <div className={'flex flex-col gap-2'}>
                            <span className="text-[var(bodyColor)]">{translations.visionBlock}</span>
                            <section>
                                <div className={'flex items-center gap-2 shadow p-2'}>
                                    <div className={'flex items-center text-[var(--mainColor)] font-bold'}><span>A</span> <span className={'h-[30px]'}>+</span></div>
                                    <div className={'flex items-center gap-2'}>
                                        <span>{translations.toggleLargeText}</span>
                                       <label className="custom-radio text-xl leading-none">
                                        <input
                                            type="checkbox"
                                            className={`customCheckbox p-2`}
                                            checked={typeof isA11y === 'string' ? JSON.parse(isA11y) : isA11y}
                                            onChange={(e) => {
                                                localStorage.setItem('isA11y', JSON.stringify(!isA11y));
                                                setIsA11y((prev) => !prev);
                                                setScaleOption(null);
                                            }}
                                        />
                                        <span className="checkbox-mark"></span>
                                    </label>
                                    </div>
                                </div>
                                <div className={'flex items-center gap-2 shadow p-2'}>
                                    <div className={'bg-[black] rounded-lg relative w-[20px] h-[20px]'}><span className={'absolute right-0 top-[10%] rounded-full z-10 bg-[white] w-[12px] h-[12px]'}></span></div>
                                    <div className={'flex items-center gap-2'}>
                                        <span>{translations.toggleHighContrast}</span>
                                        <label className="custom-radio text-xl leading-none">
                                            <input
                                                type="checkbox"
                                                className={`customCheckbox p-2`}
                                                checked={typeof highContrast === 'string' ? JSON.parse(highContrast) : highContrast}
                                                onChange={(e) => {
                                                    localStorage.setItem('highContrast', JSON.stringify(!highContrast));
                                                    setHighContrast((prev)=> !prev);
                                                }}
                                            />
                                            <span className="checkbox-mark"></span>
                                        </label>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section>
                            <span className="text-[var(bodyColor)]">{translations.fontScaleLabel}</span>
                            <div className="flex align-items-center justify-content-between py-2 surface-ground border-round-xl">
                                {/*<Button icon="pi pi-minus" type="button" onClick={decrementScale} rounded text className="w-2rem h-2rem text-600" disabled={layoutConfig.scale === scales[0]} />*/}
                                <div className="flex gap-1 flex-col">
                                    {scales.map((item) => {
                                        return <div key={item} className={'flex gap-2 items-center'}>
                                            <label className="custom-radio p-2">
                                                <input
                                                    type="radio"
                                                    name="scale"
                                                    checked={item === scaleOption}
                                                    className={classNames('custom-radio p-2 text-sm', {'text-primary-500': item === layoutConfig.scale, 'text-300': item !== layoutConfig.scale })}
                                                    onClick={()=> {
                                                        setIsA11y(false);
                                                        localStorage.removeItem('isA11y');
                                                        document.documentElement.removeAttribute('class');
                                                        setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, scale: item }));
                                                        setScaleOption(item);
                                                    }}
                                                />
                                                <span className={`radio-mark min-w-[18px]`}></span>
                                            </label>
                                            <span>{
                                                scaleWidth(item)
                                            }</span>
                                        </div>
                                    })}
                                </div>
                                {/*<Button icon="pi pi-plus" type="button" onClick={incrementScale} rounded text className="w-2rem h-2rem text-600" disabled={layoutConfig.scale === scales[scales.length - 1]} />*/}
                            </div>
                        </section>

                        <section className={'flex flex-col gap-2'}>
                            <span className="text-[var(bodyColor)]">{translations.langSwitcher}</span>
                            <div className="max-w-[200px] flex items-center gap-1">
                                <LocalizationSwift />
                                <span className={'text-sm'}>{language === 'ru' ? 'Русский' : language === 'ky' ? 'Кыргызча' : '' }</span>
                            </div>
                        </section>
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default AppConfig;
