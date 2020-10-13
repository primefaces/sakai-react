import React, { useState, useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { TabMenu } from 'primereact/tabmenu';
import { TieredMenu } from 'primereact/tieredmenu';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { ContextMenu } from 'primereact/contextmenu';
import { MegaMenu } from 'primereact/megamenu';
import { PanelMenu } from 'primereact/panelmenu';

export function MenuDemo() {

    const toast = useRef();
    const cm = useRef();
    const menu = useRef();

    const [menuBarItems, setMenubarItems] = useState([
        {
            label: 'Customers',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    items: [
                        {
                            label: 'Customer',
                            icon: 'pi pi-fw pi-plus'
                        },
                        {
                            label: 'Duplicate',
                            icon: 'pi pi-fw pi-copy'
                        },
                    ]
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-user-edit'
                }
            ]
        },
        {
            label: 'Orders',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search'
                }
            ]
        },
        {
            label: 'Shipments',
            icon: 'pi pi-fw pi-envelope',
            items: [
                {
                    label: 'Tracker',
                    icon: 'pi pi-fw pi-compass',

                },
                {
                    label: 'Map',
                    icon: 'pi pi-fw pi-map-marker',

                },
                {
                    label: 'Manage',
                    icon: 'pi pi-fw pi-pencil',

                }
            ]
        },
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-fw pi-cog',
                },
                {
                    label: 'Billing',
                    icon: 'pi pi-fw pi-file',
                }
            ]
        },
        {
            label: 'Quit',
            icon: 'pi pi-fw pi-sign-out'
        }
    ]);

    const [breadCrumbItems, setBreadCrumbItems] = useState(
        [
            { label: 'Computer' },
            { label: 'Notebook' },
            { label: 'Accessories' },
            { label: 'Backpacks' },
            { label: 'Item' }
        ]
    );

    const [stepItems, setStepsItems] = useState(
        [
            {
                label: 'Personal',
                command: (event) => {
                    toast.current.show({ severity: 'info', summary: 'First Step', detail: event.item.label });
                }
            },
            {
                label: 'Seat',
                command: (event) => {
                    toast.current.show({ severity: 'info', summary: 'Seat Selection', detail: event.item.label });
                }
            },
            {
                label: 'Payment',
                command: (event) => {
                    toast.current.show({ severity: 'info', summary: 'Pay with CC', detail: event.item.label });
                }
            },
            {
                label: 'Confirmation',
                command: (event) => {
                    toast.current.show({ severity: 'info', summary: 'Last Step', detail: event.item.label });
                }
            }
        ]
    )

    const [activeIndex, setActiveIndex] = useState(1)

    const [tabMenuItems, setTabMenuItems] = useState([
        { label: 'Personal' },
        { label: 'Seat' },
        { label: 'Payment' },
        { label: 'Confirmation' },
    ])

    const [tieredItems, setTieredItems] = useState([
        {
            label: 'Customers',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    items: [
                        {
                            label: 'Customer',
                            icon: 'pi pi-fw pi-plus'
                        },
                        {
                            label: 'Video',
                            icon: 'pi pi-fw pi-copy'
                        },

                    ]
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-user-edit'
                }
            ]
        },
        {
            label: 'Orders',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search'
                }
            ]
        },
        {
            label: 'Shipment',
            icon: 'pi pi-fw pi-envelope',
            items: [
                {
                    label: 'Tracker',
                    icon: 'pi pi-fw pi-compass',

                },
                {
                    label: 'Map',
                    icon: 'pi pi-fw pi-map-marker',

                },
                {
                    label: 'Manage',
                    icon: 'pi pi-fw pi-pencil'
                }]
        },
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-fw pi-cog',
                },
                {
                    label: 'Billing',
                    icon: 'pi pi-fw pi-file',
                }
            ]
        },
        {
            separator: true
        },
        {
            label: 'Quit',
            icon: 'pi pi-fw pi-sign-out'
        }
    ])

    const [menuItems, setMenuItems] = useState([
        {
            label: 'Customers',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-plus',

                },
                {
                    label: 'Edit',
                    icon: 'pi pi-pencil',
                }
            ]
        },
        {
            label: 'Navigate',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-list',
                    url: 'https://reactjs.org/'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-search',
                }
            ]
        }
    ]);

    const [overlayMenuItems, setOverlayMenuItems] = useState([
        {
            label: 'Save',
            icon: 'pi pi-save'
        },
        {
            label: 'Update',
            icon: 'pi pi-refresh'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            separator: true
        },
        {
            label: 'Update',
            icon: 'pi pi-home'
        }

    ]);

    const [contextMenuItems, setContextMenuItems] = useState([
        {
            label: 'Save',
            icon: 'pi pi-fw pi-save',

        },
        {
            label: 'Update',
            icon: 'pi pi-fw pi-refresh',

        },
        {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash',
        },
        {
            separator: true
        },
        {
            label: 'Options',
            icon: 'pi pi-fw pi-cog'
        }
    ]);

    const [megaMenuItems, setMegaMenuItems] = useState(
        [
            {
                label: 'Fashion', icon: 'pi pi-fw pi-tag',
                items: [
                    [
                        {
                            label: 'Woman',
                            items: [{ label: 'Woman Item' }, { label: 'Woman Item' }, { label: 'Woman Item' }]
                        },
                        {
                            label: 'Men',
                            items: [{ label: 'Men Item' }, { label: 'Men Item' }, { label: 'Men Item' }]
                        }
                    ],
                    [
                        {
                            label: 'Kids',
                            items: [{ label: 'Kids Item' }, { label: 'Kids Item' }]
                        },
                        {
                            label: 'Luggage',
                            items: [{ label: 'Luggage Item' }, { label: 'Luggage Item' }, { label: 'Luggage Item' }]
                        }
                    ]
                ]
            },
            {
                label: 'Electronics', icon: 'pi pi-fw pi-desktop',
                items: [
                    [
                        {
                            label: 'Computer Item',
                            items: [{ label: 'Computer Item' }, { label: 'Computer Item' }]
                        },
                        {
                            label: 'Camcorder',
                            items: [{ label: 'Camcorder Item' }, { label: 'Camcorder Item' }, { label: 'Camcorder Item' }]
                        },
                    ],
                    [
                        {
                            label: 'TV',
                            items: [{ label: 'TV Item' }, { label: 'TV Item' }]
                        },
                        {
                            label: 'Audio',
                            items: [{ label: 'Audio Item' }, { label: 'Audio Item' }, { label: 'Audio Item' }]
                        }
                    ],
                    [
                        {
                            label: 'Sports 7',
                            items: [{ label: 'Sports 7.1' }, { label: 'Sports 7.2' }]
                        }
                    ]
                ]
            },
            {
                label: 'Furniture', icon: 'pi pi-fw pi-image',
                items: [
                    [
                        {
                            label: 'Living Room',
                            items: [{ label: 'Living Room Item' }, { label: 'Living Room Item' }]
                        },
                        {
                            label: 'Kitchen',
                            items: [{ label: 'Kitchen Item' }, { label: 'Kitchen Item' }, { label: 'Kitchen Item' }]
                        }
                    ],
                    [
                        {
                            label: 'Bedroom',
                            items: [{ label: 'Bedroom Item' }, { label: 'Bedroom Item' }]
                        },
                        {
                            label: 'Outdoor',
                            items: [{ label: 'Outdoor Item' }, { label: 'Outdoor Item' }, { label: 'Outdoor Item' }]
                        }
                    ]
                ]
            },
            {
                label: 'Sports', icon: 'pi pi-fw pi-star-o',
                items: [
                    [
                        {
                            label: 'Basketball',
                            items: [{ label: 'Basketball Item' }, { label: 'Basketball Item' }]
                        },
                        {
                            label: 'Football',
                            items: [{ label: 'Football Item' }, { label: 'Football Item' }, { label: 'Football Item' }]
                        }
                    ],
                    [
                        {
                            label: 'Tennis',
                            items: [{ label: 'Tennis Item' }, { label: 'Tennis Item' }]
                        }
                    ]
                ]
            }
        ]
    );

    const [panelMenuItems, setPanelMenuItems] = useState(
        [
            {
                label: 'Customers',
                icon: 'pi pi-fw pi-table',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-fw pi-user-plus',
                        items: [
                            {
                                label: 'Customer',
                                icon: 'pi pi-fw pi-plus'
                            },
                            {
                                label: 'Duplicate',
                                icon: 'pi pi-fw pi-copy'
                            }
                        ]
                    },
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-user-edit'
                    }
                ]
            },
            {
                label: 'Orders',
                icon: 'pi pi-fw pi-shopping-cart',
                items: [
                    {
                        label: 'View',
                        icon: 'pi pi-fw pi-list'
                    },
                    {
                        label: 'Search',
                        icon: 'pi pi-fw pi-search'
                    }
                ]
            },
            {
                label: 'Shipments',
                icon: 'pi pi-fw pi-envelope',
                items: [
                    {
                        label: 'Tracker',
                        icon: 'pi pi-fw pi-compass'
                    },
                    {
                        label: 'Map',
                        icon: 'pi pi-fw pi-map-marker'
                    },
                    {
                        label: 'Manage',
                        icon: 'pi pi-fw pi-pencil',
                    }
                ]
            },
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-fw pi-cog',
                    },
                    {
                        label: 'Billing',
                        icon: 'pi pi-fw pi-file',
                    }
                ]
            }
        ]
    );


    const endMenuBar = <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Search" />
    </span>;

    const home = { icon: 'pi pi-home', url: 'https://www.primefaces.org/primereact' }


    return (


        <div className="p-grid p-fluid">
            <div className="p-col-12">
                <div className="card card-w-title">
                    <h5>Menubar</h5>
                    <Menubar model={menuBarItems} end={endMenuBar} />
                </div>
            </div>

            <div className="p-col-12">
                <div className="card card-w-title">
                    <h5>Breadcrumb</h5>
                    <BreadCrumb model={breadCrumbItems} home={home} />
                </div>
            </div>
            <div className="p-col-12 p-md-6">
                <div className="card card-w-title">
                    <h5>Steps</h5>

                    <Toast ref={toast}></Toast>
                    <Steps model={stepItems} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                </div>
            </div>
            <div className="p-col-12 p-md-6">
                <div className="card card-w-title">
                    <h5>TabMenu</h5>

                    <TabMenu model={tabMenuItems} />
                </div>
            </div>
            <div className="p-col-12 p-md-4">
                <div className="card">
                    <h5>Tiered Menu</h5>
                    <TieredMenu model={tieredItems} />
                </div>
            </div>

            <div className="p-col-12 p-md-4">
                <div className="card">
                    <h5>Plain Menu</h5>
                    <Menu model={menuItems} />
                </div>
            </div>

            <div className="p-col-12 p-md-4">
                <div className="card">
                    <h5>Overlay Menu</h5>
                    <Menu model={overlayMenuItems} popup ref={menu} id="popup_menu" />
                    <Button label="Show" style={{width:'auto'}} icon="pi pi-angle-down" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup />
                </div>

                <div className="card">
                    <h5>ContextMenu</h5>

                    <ContextMenu model={contextMenuItems} ref={cm}></ContextMenu>
                    <p onContextMenu={(e) => cm.current.show(e)}>Right click to display.</p>
                </div>
            </div >

            <div className="p-col-12 p-md-6">
                <div className="card">
                    <h5>MegaMenu - Horizontal</h5>
                    <MegaMenu model={megaMenuItems} />
                    <h5>MegaMenu - Vertical</h5>
                    <MegaMenu model={megaMenuItems} orientation="vertical" />
                </div>
            </div>

            <div className="p-col-12 p-md-6">
                <div className="card">
                    <h5>PanelMenu</h5>
                    <PanelMenu model={panelMenuItems} style={{ width: '22rem' }} />
                </div>
            </div>

        </div >
    )
}