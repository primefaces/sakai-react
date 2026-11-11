'use client';

import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import React, { useEffect, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { MenuContext } from './context/menucontext';
import { AppMenuItemProps } from '@/types';
import { usePathname, useSearchParams } from 'next/navigation';

// NOTE: primeflex подключён без слоя и с !important, поэтому для отступов/размеров
// здесь используются произвольные значения Tailwind (px-[12px] и т.п.), чтобы не было конфликтов.
const AppMenuitem = (props: AppMenuItemProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item!.to && pathname === item!.to;
    const active = activeMenu === key || activeMenu?.startsWith(key + '-');
    const onRouteChange = (url: string) => {
        // if (item!.to && item!.to === url) {
        //     setActiveMenu(key);
        // }
        if (item!.to && item!.to === url) {
            setActiveMenu(key);
        } else if(pathname.includes('process')) {
            setActiveMenu('1-1-0');
        }
    };

    useEffect(() => {
        onRouteChange(pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    const itemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        //avoid processing disabled items
        if (item!.disabled) {
            event.preventDefault();
            return;
        }

        //execute command
        if (item!.command) {
            item!.command({ originalEvent: event, item: item });
        }

        // toggle active state
        if (item!.items) setActiveMenu(active ? (props.parentKey as string) : key);
        else setActiveMenu(key);
    };

    // заголовок курса со стрелкой "назад" — только для оформления
    const isBackItem = !!item!.command && !item!.items;
    const hasActions = !!item!.onEdit || !!item!.onDelete;

    const iconBox = (highlighted: boolean) =>
        item!.icon ? (
            <span
                className={classNames(
                    'menu-icon-box flex items-center justify-center shrink-0 w-[30px] h-[30px] rounded-[9px] transition-colors duration-200',
                    highlighted
                        ? 'bg-[var(--mainColor)] text-white shadow-[0_4px_12px_rgba(8,169,230,0.35)]'
                        : 'bg-[var(--surface-100)] text-[var(--text-color-secondary)] group-hover:bg-[var(--surface-card)] group-hover:text-[var(--mainColor)] group-hover:shadow-[0_2px_6px_rgba(0,0,0,0.06)]'
                )}
            >
                <i className={classNames('layout-menuitem-icon text-[14px] leading-none', item!.icon)} style={{ margin: 0, width: 'auto' }}></i>
            </span>
        ) : null;

    const subMenu = item!.items && item!.visible !== false && (
        <CSSTransition timeout={{ enter: 1000, exit: 450 }} classNames="layout-submenu" in={props.root ? true : active} key={item!.label}>
            <ul className={classNames('flex flex-col gap-[1px]', { 'menu-nested-list ml-[22px] pl-[6px] border-l border-[var(--surface-border)]': !props.root })}>
                {item!.items.map((child, i) => {
                    return <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />;
                })}
            </ul>
        </CSSTransition>
    );

    return (
        <li className={' '+ classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
            {props.root && item!.visible !== false && item!.label?.trim() && <div className="layout-menuitem-root-text">{item!.label}</div>}
            {!props.root && (!item!.to || item!.items) && item!.visible !== false ? (
                <a
                    href={item!.url}
                    onClick={(e) => itemClick(e)}
                    className={classNames(
                        item!.class,
                        'p-ripple group relative flex items-center gap-[10px] px-[8px] py-[5px] rounded-[10px] cursor-pointer select-none transition-colors duration-200 hover:bg-[var(--surface-hover)]',
                        isBackItem ? 'mb-[2px] text-[var(--titleColor)] font-semibold' : 'text-[var(--text-color)] font-medium'
                    )}
                    target={item!.target}
                    tabIndex={0}
                >
                    {iconBox(false)}
                    <span className="layout-menuitem-text flex-1 min-w-0 truncate text-[14px]" title={item!.label}>
                        {item!.label}
                    </span>
                    {item!.items && (
                        <i className="pi pi-fw pi-angle-down layout-submenu-toggler text-[12px] text-[var(--text-color-secondary)] transition-transform duration-200"></i>
                    )}
                    <Ripple />
                </a>
            ) : null}
            {/* {item!.to && !item!.items && item!.visible !== false ? (
                <Link href={item!.to} replace={item!.replaceUrl} target={item!.target} onClick={(e) => itemClick(e)} className={classNames(item!.class, 'p-ripple', { 'active-route': isActiveRoute })} tabIndex={0}>
                    <i className={classNames('layout-menuitem-icon', item!.icon)}></i>
                    <span className="layout-menuitem-text">{item!.label}</span>
                    {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </Link>
            ) : null} */}
            {item!.to && !item!.items && item!.visible !== false ? (
                <div
                    className={classNames('group relative flex items-center gap-[4px] rounded-[10px] transition-colors duration-200', {
                        'bg-[var(--mainColor)]/10': isActiveRoute,
                        'hover:bg-[var(--surface-hover)]': !isActiveRoute
                    })}
                >
                    {/* индикатор активного пункта */}
                    <span
                        className={classNames('absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-[var(--mainColor)] transition-all duration-200', isActiveRoute ? 'h-[60%] opacity-100' : 'h-0 opacity-0')}
                    />
                    <Link
                        href={item!.to}
                        replace={item!.replaceUrl}
                        target={item!.target}
                        onClick={(e) => itemClick(e)}
                        className={classNames(
                            item!.class,
                            'p-ripple relative flex flex-1 min-w-0 items-center gap-[10px] rounded-[10px] transition-colors duration-200',
                            !item!.icon ? 'px-[10px] py-[6px]' : 'px-[8px] py-[5px]',
                            isActiveRoute ? 'active-route text-[var(--mainColor)] font-semibold' : 'text-[var(--text-color)] font-medium group-hover:text-[var(--titleColor)]'
                        )}
                        tabIndex={0}
                    >
                        {iconBox(!!isActiveRoute)}
                        <span className="layout-menuitem-text flex-1 min-w-0 truncate text-[14px]" title={item!.label}>
                            {item!.label}
                        </span>
                        {item?.extra && <span className="menu-extra shrink-0">{item.extra}</span>}

                        <Ripple />
                    </Link>
                    {item?.score !== undefined && item?.score !== null && (
                        <span
                            className={classNames(
                                'shrink-0 min-w-[28px] px-[8px] py-[2px] rounded-full text-center text-[12px] font-semibold leading-[18px]',
                                isActiveRoute ? 'bg-[var(--mainColor)] text-white' : 'bg-[var(--mainColor)]/10 text-[var(--mainColor)]'
                            )}
                        >
                            {item.score}
                        </span>
                    )}
                    {hasActions && (
                        <div className="flex items-center gap-[2px] pr-[4px] shrink-0">
                            {/* Кнопки редактирования и удаления */}
                            {item!.onEdit && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        item?.onEdit?.();
                                    }}
                                    title="Редактировать"
                                    className="flex items-center justify-center w-[26px] h-[26px] rounded-[7px] border-none bg-transparent cursor-pointer text-[var(--text-color-secondary)] transition-colors duration-200 hover:bg-[var(--mainColor)]/10 hover:text-[var(--mainColor)]"
                                >
                                    <i className="pi pi-pencil text-[13px]"></i>
                                </button>
                            )}
                            {item!.onDelete && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        item?.onDelete?.();
                                    }}
                                    title="Удалить"
                                    className="flex items-center justify-center w-[26px] h-[26px] rounded-[7px] border-none bg-transparent cursor-pointer text-[var(--text-color-secondary)] transition-colors duration-200 hover:bg-[var(--redBgColor)] hover:text-[var(--redColor)]"
                                >
                                    <i className="pi pi-trash text-[13px]"></i>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : null}

            {subMenu}
        </li>
    );
};

export default AppMenuitem;
