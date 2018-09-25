import React, {Component} from 'react';
import {BreadCrumb} from 'primereact/breadcrumb';
import {Steps} from 'primereact/steps';
import {Menubar} from 'primereact/menubar';
import {Button} from 'primereact/button';
import {Menu} from 'primereact/menu';
import {TieredMenu} from 'primereact/tieredmenu';
import {ContextMenu} from 'primereact/contextmenu';
import {SlideMenu} from 'primereact/slidemenu';
import {PanelMenu} from 'primereact/panelmenu';
import {TabMenu} from 'primereact/tabmenu';
import {MegaMenu} from 'primereact/megamenu';

export class MenusDemo extends Component {

    constructor() {
        super();
        this.state = {
            breadcrumdItems: [
                {label:'Categories'},
                {label:'Sports'},
                {label:'Football'},
                {label:'Countries'},
                {label:'Spain'},
                {label:'F.C. Barcelona'},
                {label:'Squad'},
                {label:'Lionel Messi', url: 'https://en.wikipedia.org/wiki/Lionel_Messi'}
            ],
            home: {
                icon: 'pi pi-home', url: 'https://www.primefaces.org/primereact'
            },
            stepsItems: [
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
            ],
            tieredItems: [
                {
                    label:'File',
                    icon:'pi pi-fw pi-file',
                    items:[
                       {
                          label:'New',
                          icon:'pi pi-fw pi-plus',
                          items:[
                             {
                                label:'Bookmark',
                                icon:'pi pi-fw pi-bookmark'
                             },
                             {
                                label:'Video',
                                icon:'pi pi-fw pi-video'
                             },
              
                          ]
                       },
                       {
                          label:'Delete',
                          icon:'pi pi-fw pi-trash'
                       },
                       {
                          separator:true
                       },
                       {
                          label:'Export',
                          icon:'pi pi-fw pi-external-link'
                       }
                    ]
                 },
                 {
                    label:'Edit',
                    icon:'pi pi-fw pi-pencil',
                    items:[
                       {
                          label:'Left',
                          icon:'pi pi-fw pi-align-left'
                       },
                       {
                          label:'Right',
                          icon:'pi pi-fw pi-align-right'
                       },
                       {
                          label:'Center',
                          icon:'pi pi-fw pi-align-center'
                       },
                       {
                          label:'Justify',
                          icon:'pi pi-fw pi-align-justify'
                       },
              
                    ]
                 },
                 {
                    label:'Users',
                    icon:'pi pi-fw pi-user',
                    items:[
                       {
                          label:'New',
                          icon:'pi pi-fw pi-user-plus',
              
                       },
                       {
                          label:'Delete',
                          icon:'pi pi-fw pi-user-minus',
              
                       },
                       {
                          label:'Search',
                          icon:'pi pi-fw pi-users',
                          items:[
                             {
                                label:'Filter',
                                icon:'pi pi-fw pi-filter',
                                items:[
                                   {
                                      label:'Print',
                                      icon:'pi pi-fw pi-print'
                                   }
                                ]
                             },
                             {
                                icon:'pi pi-fw pi-bars',
                                label:'List'
                             }
                          ]
                       }
                    ]
                 },
                 {
                    label:'Events',
                    icon:'pi pi-fw pi-calendar',
                    items:[
                       {
                          label:'Edit',
                          icon:'pi pi-fw pi-pencil',
                          items:[
                             {
                                label:'Save',
                                icon:'pi pi-fw pi-calendar-plus'
                             },
                             {
                                label:'Delete',
                                icon:'pi pi-fw pi-calendar-minus'
                             }
                          ]
                       },
                       {
                          label:'Archieve',
                          icon:'pi pi-fw pi-calendar-times',
                          items:[
                             {
                                label:'Remove',
                                icon:'pi pi-fw pi-calendar-minus'
                             }
                          ]
                       }
                    ]
                 },
                 {
                    label:'Quit',
                    icon:'pi pi-fw pi-power-off'
                 }
            ],
            items: [
                {
                    label: 'Options',
                    items: [{label: 'New', icon: 'pi pi-fw pi-plus',command:() => window.location.hash="/fileupload"},
                            {label: 'Delete', icon: 'pi pi-fw pi-trash', url: 'http://primetek.com.tr'}]
                }, 
                {
                    label: 'Account',
                    items: [{label: 'Options', icon: 'pi pi-fw pi-cog',command:() => window.location.hash="/"},
                            {label: 'Sign Out', icon: 'pi pi-fw pi-power-off'} ]
                }
            ],
            panelMenuItems: [
                {
                    label:'Documents',
                    icon:'pi pi-fw pi-file',
                    items:[
                       {
                          label:'New',
                          icon:'pi pi-fw pi-plus',
                          items:[
                             {
                                label:'Bookmark',
                                icon:'pi pi-fw pi-bookmark'
                             },
                             {
                                label:'Video',
                                icon:'pi pi-fw pi-video'
                             },
              
                          ]
                       },
                       {
                          label:'Delete',
                          icon:'pi pi-fw pi-trash'
                       },
                       {
                          separator:true
                       },
                       {
                          label:'Export',
                          icon:'pi pi-fw pi-external-link'
                       }
                    ]
                 },
                 {
                    label:'Manage',
                    icon:'pi pi-fw pi-pencil',
                    items:[
                       {
                          label:'Left',
                          icon:'pi pi-fw pi-align-left'
                       },
                       {
                          label:'Right',
                          icon:'pi pi-fw pi-align-right'
                       },
                       {
                          label:'Center',
                          icon:'pi pi-fw pi-align-center'
                       },
                       {
                          label:'Justify',
                          icon:'pi pi-fw pi-align-justify'
                       },
              
                    ]
                 },
                 {
                    label:'Accounts',
                    icon:'pi pi-fw pi-user',
                    items:[
                       {
                          label:'New',
                          icon:'pi pi-fw pi-user-plus',
              
                       },
                       {
                          label:'Delete',
                          icon:'pi pi-fw pi-user-minus',
              
                       },
                       {
                          label:'Search',
                          icon:'pi pi-fw pi-users',
                          items:[
                             {
                                label:'Filter',
                                icon:'pi pi-fw pi-filter',
                                items:[
                                   {
                                      label:'Print',
                                      icon:'pi pi-fw pi-print'
                                   }
                                ]
                             },
                             {
                                icon:'pi pi-fw pi-bars',
                                label:'List'
                             }
                          ]
                       }
                    ]
                 },
                 {
                    label:'Calendar',
                    icon:'pi pi-fw pi-calendar',
                    items:[
                       {
                          label:'Edit',
                          icon:'pi pi-fw pi-pencil',
                          items:[
                             {
                                label:'Save',
                                icon:'pi pi-fw pi-calendar-plus'
                             },
                             {
                                label:'Delete',
                                icon:'pi pi-fw pi-calendar-minus'
                             }
                          ]
                       },
                       {
                          label:'Archieve',
                          icon:'pi pi-fw pi-calendar-times',
                          items:[
                             {
                                label:'Remove',
                                icon:'pi pi-fw pi-calendar-minus'
                             }
                          ]
                       }
                    ]
                 }
            ],
            tabMenuItems: [
                {label: 'Home', icon: 'pi pi-fw pi-home'},
                {label: 'Calendar', icon: 'pi pi-fw pi-calendar'},
                {label: 'Edit', icon: 'pi pi-fw pi-pencil'},
                {label: 'Documentation', icon: 'pi pi-fw pi-file'},
                {label: 'Settings', icon: 'pi pi-fw pi-cog'}
            ],
            megaMenuItems: [
                {
                    label: 'Videos', icon: 'pi pi-fw pi-video',
                    items: [
                        [
                            {
                                label: 'Video 1',
                                items: [{label: 'Video 1.1'}, {label: 'Video 1.2'}]
                            },
                            {
                                label: 'Video 2',
                                items: [{label: 'Video 2.1'}, {label: 'Video 2.2'}]
                            }
                        ],
                        [
                            {
                                label: 'Video 3',
                                items: [{label: 'Video 3.1'}, {label: 'Video 3.2'}]
                            },
                            {
                                label: 'Video 4',
                                items: [{label: 'Video 4.1'}, {label: 'Video 4.2'}]
                            }
                        ]
                    ]
                },
                {
                    label: 'Users', icon: 'pi pi-fw pi-users',
                    items: [
                        [
                            {
                                label: 'User 1',
                                items: [{label: 'User 1.1'}, {label: 'User 1.2'}]
                            },
                            {
                                label: 'User 2',
                                items: [{label: 'User 2.1'}, {label: 'User 2.2'}]
                            },
                        ],
                        [
                            {
                                label: 'User 3',
                                items: [{label: 'User 3.1'}, {label: 'User 3.2'}]
                            },
                            {
                                label: 'User 4',
                                items: [{label: 'User 4.1'}, {label: 'User 4.2'}]
                            }
                        ],
                        [
                            {
                                label: 'User 5',
                                items: [{label: 'User 5.1'}, {label: 'User 5.2'}]
                            },
                            {
                                label: 'User 6',
                                items: [{label: 'User 6.1'}, {label: 'User 6.2'}]
                            }
                        ]
                    ]
                },
                {
                    label: 'Events', icon: 'pi pi-fw pi-calendar',
                    items: [
                        [
                            {
                                label: 'Event 1',
                                items: [{label: 'Event 1.1'}, {label: 'Event 1.2'}]
                            },
                            {
                                label: 'Event 2',
                                items: [{label: 'Event 2.1'}, {label: 'Event 2.2'}]
                            }
                        ],
                        [
                            {
                                label: 'Event 3',
                                items: [{label: 'Event 3.1'}, {label: 'Event 3.2'}]
                            },
                            {
                                label: 'Event 4',
                                items: [{label: 'Event 4.1'}, {label: 'Event 4.2'}]
                            }
                        ]
                    ]
                },
                {
                    label: 'Settings', icon: 'pi pi-fw pi-cog',
                    items: [
                        [
                            {
                                label: 'Setting 1',
                                items: [{label: 'Setting 1.1'}, {label: 'Setting 1.2'}]
                            },
                            {
                                label: 'Setting 2',
                                items: [{label: 'Setting 2.1'}, {label: 'Setting 2.2'}]
                            },
                            {
                                label: 'Setting 3',
                                items: [{label: 'Setting 3.1'}, {label: 'Setting 3.2'}]
                            }
                        ],
                        [
                            {
                                label: 'Technology 4',
                                items: [{label: 'Setting 4.1'}, {label: 'Setting 4.2'}]
                            }
                        ]
                    ]
                }
            ]
        };
    }

    render() {
        return (
            <div className="p-grid p-fluid">
                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1>Breadcrumb</h1>
                        <BreadCrumb model={this.state.breadcrumdItems} home={this.state.home} />
                    </div>
        
                    <div className="card card-w-title">
                        <h1>Steps</h1>
                        <Steps model={this.state.stepsItems} />
                    </div>
                
                    <div className="card card-w-title">
                        <h1>MenuBar</h1>
                        <Menubar model={this.state.tieredItems} />
                    </div>
                </div>

                <div className="p-col-12 p-lg-6">
                    <div className="card card-w-title">
                        <h1>Plain Menu</h1>
                        <Menu model={this.state.items} />
                        <Menu model={this.state.items} ref={(el)=>this.menu=el} popup={true} style={{width:250}} />
                        <Button icon="pi pi-external-link" label="Show" onClick={(event)=>this.menu.toggle(event)} style={{marginTop:'20px', width:'auto'}} />
                    </div>

                    <div className="card card-w-title">
                        <h1>TieredMenu</h1>
                        <TieredMenu model={this.state.tieredItems} style={{width:'250px', marginBottom:'20px'}} />
                    </div>
                </div>

                <div className="p-col-12 p-lg-6">
                    <div className="card card-w-title">
                        <h1 style={{marginTop:'40px'}}>ContextMenu</h1>
                        Right click!
                        <ContextMenu global={true} model={this.state.tieredItems} style={{width:'12.5em'}} />
                    </div>
        
                    <div className="card">
                        <h1>SlideMenu</h1>
                        <SlideMenu model={this.state.items} style={{width:'260px'}} menuWidth={260} />
                    </div>

                    <div className="card">
                        <h1>PanelMenu</h1>
                        <PanelMenu model={this.state.panelMenuItems} />
                    </div>
                </div>

                <div className="p-col-12 p-col-6">
                    <div className="card">
                        <h1>MegaMenu - Horizontal</h1>
                        <MegaMenu model={this.state.megaMenuItems} />

                        <h1>MegaMenu - Vertical</h1>
                        <MegaMenu model={this.state.megaMenuItems} orientation="vertical" style={{width:'200px'}} />
                    </div>
                </div>

                <div className="p-col-12 p-col-6">
                    <div className="card">
                        <h1>TabMenu</h1>
                        <TabMenu model={this.state.tabMenuItems} />
                    </div>
                </div>
            </div>
        )
    }
}