import React, { useRef } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { TabView, TabPanel } from 'primereact/tabview';
import { Panel } from 'primereact/panel';
import { Fieldset } from 'primereact/fieldset';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Password } from 'primereact/password';
import { Menu } from 'primereact/menu';

const PanelDemo = () => {
    const menu1 = useRef(null);
    const toolbarItems = [
        {
            label: 'Save',
            icon: 'pi pi-check'
        },
        {
            label: 'Update',
            icon: 'pi pi-sync'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            label: 'Home Page',
            icon: 'pi pi-home'
        }
    ];

    const toolbarLeftTemplate = () => {
        return (
            <>
                <Button label="New" icon="pi pi-plus" style={{ marginRight: '.5em' }} />
                <Button label="Open" icon="pi pi-folder-open" severity="secondary" />

                <i className="pi pi-bars p-toolbar-separator" style={{ marginRight: '.5em' }}></i>

                <Button icon="pi pi-check" severity="sucess" style={{ marginRight: '.5em' }} />
                <Button icon="pi pi-trash" severity="warning" style={{ marginRight: '.5em' }} />
                <Button icon="pi pi-print" severity="danger" />
            </>
        );
    };
    const toolbarRightTemplate = <SplitButton label="Options" icon="pi pi-check" model={toolbarItems} menuStyle={{ width: '12rem' }}></SplitButton>;
    const cardHeader = (
        <div className="flex align-items-center justify-content-between mb-0 p-3 pb-0">
            <h5 className="m-0">Card</h5>
            <Button icon="pi pi-plus" text onClick={(event) => menu1.current.toggle(event)} />
            <Menu
                ref={menu1}
                popup
                model={[
                    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                    { label: 'Remove', icon: 'pi pi-fw pi-minus' },
                    { label: 'Update', icon: 'pi pi-fw pi-sync' }
                ]}
            />
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Toolbar</h5>
                    <Toolbar left={toolbarLeftTemplate} right={toolbarRightTemplate}></Toolbar>
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>AccordionPanel</h5>
                    <Accordion activeIndex={0}>
                        <AccordionTab header="Header I">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                                id est laborum.
                            </p>
                        </AccordionTab>
                        <AccordionTab header="Header II">
                            <p>
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                            </p>
                        </AccordionTab>
                        <AccordionTab header="Header III">
                            <p>
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt
                                in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
                                minus.
                            </p>
                        </AccordionTab>
                    </Accordion>
                </div>
                <div className="card">
                    <h5>TabView</h5>
                    <TabView>
                        <TabPanel header="Header I">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                                id est laborum.
                            </p>
                        </TabPanel>
                        <TabPanel header="Header II">
                            <p>
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                            </p>
                        </TabPanel>
                        <TabPanel header="Header III">
                            <p>
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt
                                in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
                                minus.
                            </p>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Panel</h5>
                    <Panel header="Header" toggleable>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                            laborum.
                        </p>
                    </Panel>
                </div>
                <div className="card">
                    <h5>Fieldset</h5>
                    <Fieldset legend="Legend" toggleable>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                            laborum.
                        </p>
                    </Fieldset>
                </div>
                <Card header={cardHeader}>
                    <p className="line-height-3 m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </Card>
            </div>

            <div className="col-12">
                <div className="card">
                    <h5>Divider</h5>
                    <div className="grid">
                        <div className="col-5 flex align-items-center justify-content-center">
                            <div className="p-fluid">
                                <div className="field">
                                    <label htmlFor="username">Username</label>
                                    <InputText id="username" type="text" />
                                </div>
                                <div className="field">
                                    <label htmlFor="password">Password</label>
                                    <InputText id="password" type="password" />
                                </div>
                                <Button label="Login"></Button>
                            </div>
                        </div>
                        <div className="col-1">
                            <Divider layout="vertical">
                                <b>OR</b>
                            </Divider>
                        </div>
                        <div className="col-5 align-items-center justify-content-center">
                            <p>
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                            </p>

                            <Divider layout="horizontal" align="center">
                                <span className="p-tag">Badge</span>
                            </Divider>

                            <p>
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt
                                in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
                                minus.
                            </p>

                            <Divider align="right">
                                <Button label="Button" icon="pi pi-search" outlined></Button>
                            </Divider>

                            <p>
                                Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut
                                reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Donec vel volutpat ipsum. Integer nunc magna, posuere ut tincidunt eget, egestas vitae sapien. Morbi dapibus luctus odio.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <h5>Splitter</h5>
                    <Splitter style={{ height: '300px' }}>
                        <SplitterPanel size={30} minSize={10}>
                            <div className="h-full flex align-items-center justify-content-center">Panel 1</div>
                        </SplitterPanel>
                        <SplitterPanel size={70}>
                            <Splitter layout="vertical">
                                <SplitterPanel size={50} minSize={10}>
                                    <div className="h-full flex align-items-center justify-content-center">Panel 2</div>
                                </SplitterPanel>
                                <SplitterPanel size={50} minSize={10}>
                                    <div className="h-full flex align-items-center justify-content-center">Panel 3</div>
                                </SplitterPanel>
                            </Splitter>
                        </SplitterPanel>
                    </Splitter>
                </div>
            </div>
        </div>
    );
};

export default PanelDemo;
