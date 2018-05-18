import React, { Component } from 'react';
import {BreadCrumb} from 'primereact/components/breadcrumb/BreadCrumb';
import {Steps} from 'primereact/components/steps/Steps';
import {Menubar} from 'primereact/components/menubar/Menubar';
import {Button} from 'primereact/components/button/Button';
import {Menu} from 'primereact/components/menu/Menu';
import {TieredMenu} from 'primereact/components/tieredmenu/TieredMenu';
import {ContextMenu} from 'primereact/components/contextmenu/ContextMenu';
import {SlideMenu} from 'primereact/components/slidemenu/SlideMenu';
import {PanelMenu} from 'primereact/components/panelmenu/PanelMenu';
import {TabMenu} from 'primereact/components/tabmenu/TabMenu';
import {MegaMenu} from 'primereact/components/megamenu/MegaMenu';

export class MenusDemo extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {

        let breadcrumdItems = [
            {label:'Categories'},
            {label:'Sports'},
            {label:'Football'},
            {label:'Countries'},
            {label:'Spain'},
            {label:'F.C. Barcelona'},
            {label:'Squad'},
            {label:'Lionel Messi', url: 'https://en.wikipedia.org/wiki/Lionel_Messi'}
        ];

        let stepsItems = [
            {
                label: 'Personal'
            },
            {
                label: 'Seat'
            },
            {
                label: 'Payment'
            },
            {
                label: 'Confirmation'
            }
        ];

        let tieredItems = [
            {
                label: 'File',
                icon: 'fa-file-o',
                items: [{
                        label: 'New', 
                        icon: 'fa-plus',
                        items: [
                            {label: 'Project'},
                            {label: 'Other'},
                        ]
                    },
                    {label: 'Open'},
                    {label: 'Quit'}
                ]
            },
            {
                label: 'Edit',
                icon: 'fa-edit',
                items: [
                    {label: 'Undo', icon: 'fa-mail-forward'},
                    {label: 'Redo', icon: 'fa-mail-reply'}
                ]
            },
            {
                label: 'Help',
                icon: 'fa-question',
                items: [
                    {
                        label: 'Contents'
                    },
                    {
                        label: 'Search', 
                        icon: 'fa-search', 
                        items: [
                            {
                                label: 'Text', 
                                items: [
                                    {
                                        label: 'Workspace'
                                    }
                                ]
                            },
                            {
                                label: 'File'
                            }
                    ]}
                ]
            },
            {
                label: 'Actions',
                icon: 'fa-gear',
                items: [
                    {
                        label: 'Edit',
                        icon: 'fa-refresh',
                        items: [
                            {label: 'Save', icon: 'fa-save'},
                            {label: 'Update', icon: 'fa-save'},
                        ]
                    },
                    {
                        label: 'Other',
                        icon: 'fa-phone',
                        items: [
                            {label: 'Delete', icon: 'fa-minus'}
                        ]
                    }
                ]
            },
            {
                label: 'Quit', icon: 'fa-minus'
            }
        ];

        let items = [
            {
                label: 'File',
                items: [
                    {label: 'New', icon: 'fa-plus'},
                    {label: 'Open', icon: 'fa-download'}
                ]
            },
            {
                label: 'Edit',
                items: [
                    {label: 'Undo', icon: 'fa-refresh'},
                    {label: 'Redo', icon: 'fa-repeat'}
                ]
            }];

        let panelMenuItems = [
            {
                label: 'File',
                icon: 'fa-file-o',
                items: [{
                        label: 'New', 
                        icon: 'fa-plus',
                        items: [
                            {label: 'Project'},
                            {label: 'Other'},
                        ]
                    },
                    {label: 'Open'},
                    {label: 'Quit'}
                ]
            },
            {
                label: 'Edit',
                icon: 'fa-edit',
                items: [
                    {label: 'Undo', icon: 'fa-mail-forward'},
                    {label: 'Redo', icon: 'fa-mail-reply'}
                ]
            },
            {
                label: 'Help',
                icon: 'fa-question',
                items: [
                    {
                        label: 'Contents'
                    },
                    {
                        label: 'Search', 
                        icon: 'fa-search', 
                        items: [
                            {
                                label: 'Text', 
                                items: [
                                    {
                                        label: 'Workspace'
                                    }
                                ]
                            },
                            {
                                label: 'File'
                            }
                    ]}
                ]
            },
            {
                label: 'Actions',
                icon: 'fa-gear',
                items: [
                    {
                        label: 'Edit',
                        icon: 'fa-refresh',
                        items: [
                            {label: 'Save', icon: 'fa-save'},
                            {label: 'Update', icon: 'fa-save'},
                        ]
                    },
                    {
                        label: 'Other',
                        icon: 'fa-phone',
                        items: [
                            {label: 'Delete', icon: 'fa-minus'}
                        ]
                    }
                ]
            }
        ];

        let tabMenuItems = [
            {label: 'Stats', icon: 'fa-bar-chart'},
            {label: 'Calendar', icon: 'fa-calendar'},
            {label: 'Documentation', icon: 'fa-book'},
            {label: 'Support', icon: 'fa-support'},
            {label: 'Social', icon: 'fa-twitter'}
        ];

        let megaMenuItems = [
            {
                label: 'TV', icon: 'fa-check',
                items: [
                    [
                        {
                            label: 'TV 1',
                            items: [{label: 'TV 1.1'},{label: 'TV 1.2'}]
                        },
                        {
                            label: 'TV 2',
                            items: [{label: 'TV 2.1'},{label: 'TV 2.2'}]
                        }
                    ],
                    [
                        {
                            label: 'TV 3',
                            items: [{label: 'TV 3.1'},{label: 'TV 3.2'}]
                        },
                        {
                            label: 'TV 4',
                            items: [{label: 'TV 4.1'},{label: 'TV 4.2'}]
                        }
                    ]
                ]
            },
            {
                label: 'Sports', icon: 'fa-soccer-ball-o',
                items: [
                    [
                        {
                            label: 'Sports 1',
                            items: [{label: 'Sports 1.1'},{label: 'Sports 1.2'}]
                        },
                        {
                            label: 'Sports 2',
                            items: [{label: 'Sports 2.1'},{label: 'Sports 2.2'}]
                        },

                    ],
                    [
                        {
                            label: 'Sports 3',
                            items: [{label: 'Sports 3.1'},{label: 'Sports 3.2'}]
                        },
                        {
                            label: 'Sports 4',
                            items: [{label: 'Sports 4.1'},{label: 'Sports 4.2'}]
                        }
                    ],
                    [
                        {
                            label: 'Sports 5',
                            items: [{label: 'Sports 5.1'},{label: 'Sports 5.2'}]
                        },
                        {
                            label: 'Sports 6',
                            items: [{label: 'Sports 6.1'},{label: 'Sports 6.2'}]
                        }
                    ]
                ]
            },
            {
                label: 'Entertainment', icon: 'fa-child',
                items: [
                    [
                        {
                            label: 'Entertainment 1',
                            items: [{label: 'Entertainment 1.1'},{label: 'Entertainment 1.2'}]
                        },
                        {
                            label: 'Entertainment 2',
                            items: [{label: 'Entertainment 2.1'},{label: 'Entertainment 2.2'}]
                        }
                    ],
                    [
                        {
                            label: 'Entertainment 3',
                            items: [{label: 'Entertainment 3.1'},{label: 'Entertainment 3.2'}]
                        },
                        {
                            label: 'Entertainment 4',
                            items: [{label: 'Entertainment 4.1'},{label: 'Entertainment 4.2'}]
                        }
                    ]
                ]
            },
            {
                label: 'Technology', icon: 'fa-gears',
                items: [
                    [
                        {
                            label: 'Technology 1',
                            items: [{label: 'Technology 1.1'},{label: 'Technology 1.2'}]
                        },
                        {
                            label: 'Technology 2',
                            items: [{label: 'Technology 2.1'},{label: 'Technology 2.2'}]
                        },
                    ],
                    [
                        {
                            label: 'Technology 4',
                            items: [{label: 'Technology 3.1'},{label: 'Technology 3.2'}]
                        }
                    ]
                ]
            }
        ];

        return(
            <div className="ui-g ui-fluid">
                <div className="ui-g-12">
                    <div className="card card-w-title">
                        <h1>Breadcrumb</h1>
                        <BreadCrumb model={breadcrumdItems}/>
                    </div>
        
                    <div className="card card-w-title">
                        <h1>Steps</h1>
                        <Steps model={stepsItems}/>
                    </div>
                
                    <div className="card card-w-title">
                        <h1>MenuBar</h1>
                        <Menubar model={tieredItems}/>
                    </div>
                </div>

                <div className="ui-g-12 ui-lg-6">
                    {/* Left Colum */}
                    <div className="card card-w-title">
                        <h1>Plain Menu</h1>
                        <Menu model={items}/>
                        <Menu model={items} ref={(el)=>this.menu=el} popup={true} style={{width:250}}/>
                        <Button icon="fa-external-link" label="Show" onClick={(event)=>this.menu.toggle(event)} style={{marginTop:'20px', width:'auto'}}/>
                    </div>

                    <div className="card card-w-title">
                        <h1>TieredMenu</h1>
                        <TieredMenu model={tieredItems} style={{width:'250px',marginBottom:'20px'}}/>
                    </div>
                </div>

                <div className="ui-g-12 ui-lg-6">
                    {/* Right Colum */}
                    <div className="card card-w-title">
                        <h1 style={{marginTop:'40px'}}>ContextMenu</h1>
                        Right click!
                        <ContextMenu global={true} model={tieredItems} style={{width:'12.5em'}}/>
                    </div>
        
                    <div className="card">
                        <h1>SlideMenu</h1>
                        <SlideMenu model={items} style={{width:'260px'}} menuWidth={260}/>
                    </div>

                    <div className="card">
                        <h1>PanelMenu</h1>
                        <PanelMenu model={panelMenuItems}/>
                    </div>
                </div>

                <div className="ui-g-12 ui-g-6">
                    <div className="card">
                        <h1>TabMenu</h1>
                        <TabMenu model={tabMenuItems}/>
                    </div>
                </div>
    
                <div className="ui-g-12 ui-g-6">
                    <div className="card">
                        <h1>MegaMenu - Horizontal</h1>
                        <MegaMenu model={megaMenuItems}/>

                        <h1>MegaMenu - Vertical</h1>
                        <MegaMenu model={megaMenuItems} orientation="vertical" style={{width:'200px'}}/>
                    </div>
                </div>
            </div>
        )
    }
}