'use client';
import React, { useState } from 'react';
import { SplitButton } from 'primereact/splitbutton';
import { Button } from 'primereact/button';
import styles from './index.module.scss';
import { classNames } from 'primereact/utils';

const ButtonDemo = () => {
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [loading4, setLoading4] = useState(false);

    const onLoadingClick1 = () => {
        setLoading1(true);

        setTimeout(() => {
            setLoading1(false);
        }, 2000);
    };

    const onLoadingClick2 = () => {
        setLoading2(true);

        setTimeout(() => {
            setLoading2(false);
        }, 2000);
    };

    const onLoadingClick3 = () => {
        setLoading3(true);

        setTimeout(() => {
            setLoading3(false);
        }, 2000);
    };

    const onLoadingClick4 = () => {
        setLoading4(true);

        setTimeout(() => {
            setLoading4(false);
        }, 2000);
    };

    const items = [
        {
            label: 'Update',
            icon: 'pi pi-refresh'
        },
        {
            label: 'Delete',
            icon: 'pi pi-times'
        },
        {
            label: 'Home',
            icon: 'pi pi-home'
        }
    ];

    return (
        <div className="grid">
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Default</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Submit"></Button>
                        <Button label="Disabled" disabled></Button>
                        <Button label="Link" link></Button>
                    </div>
                </div>

                <div className="card">
                    <h5>Severities</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Primary" />
                        <Button label="Secondary" severity="secondary" />
                        <Button label="Success" severity="success" />
                        <Button label="Info" severity="info" />
                        <Button label="Warning" severity="warning" />
                        <Button label="Help" severity="help" />
                        <Button label="Danger" severity="danger" />
                    </div>
                </div>

                <div className="card">
                    <h5>Text</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Primary" text />
                        <Button label="Secondary" severity="secondary" text />
                        <Button label="Success" severity="success" text />
                        <Button label="Info" severity="info" text />
                        <Button label="Warning" severity="warning" text />
                        <Button label="Help" severity="help" text />
                        <Button label="Danger" severity="danger" text />
                        <Button label="Plain" className="p-button-plain" text />
                    </div>
                </div>

                <div className="card">
                    <h5>Outlined</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Primary" outlined />
                        <Button label="Secondary" severity="secondary" outlined />
                        <Button label="Success" severity="success" outlined />
                        <Button label="Info" severity="info" outlined />
                        <Button label="Warning" severity="warning" outlined />
                        <Button label="Help" severity="help" outlined />
                        <Button label="Danger" severity="danger" outlined />
                    </div>
                </div>

                <div className="card">
                    <h5>Button Group</h5>
                    <span className="p-buttonset flex">
                        <Button label="Save" icon="pi pi-check" />
                        <Button label="Delete" icon="pi pi-trash" />
                        <Button label="Cancel" icon="pi pi-times" />
                    </span>
                </div>

                <div className="card">
                    <h5>SplitButton</h5>
                    <div className="flex flex-wrap gap-2">
                        <SplitButton label="Save" icon="pi pi-check" model={items} severity="secondary"></SplitButton>
                        <SplitButton label="Save" icon="pi pi-check" model={items} severity="success"></SplitButton>
                        <SplitButton label="Save" icon="pi pi-check" model={items} severity="info"></SplitButton>
                        <SplitButton label="Save" icon="pi pi-check" model={items} severity="warning"></SplitButton>
                        <SplitButton label="Save" icon="pi pi-check" model={items} severity="danger"></SplitButton>
                    </div>
                </div>

                <div className="card">
                    <h5>Template</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button className={classNames(styles['p-button'], styles['google'])} aria-label="Google">
                            <span className="flex align-items-center px-2 bg-purple-700 text-white">
                                <i className="pi pi-google"></i>
                            </span>
                            <span className="px-3 py-2 flex align-items-center text-white">Google</span>
                        </Button>
                        <Button className={classNames(styles['p-button'], styles['twitter'])} aria-label="Twitter">
                            <span className="flex align-items-center px-2 bg-blue-500 text-white">
                                <i className="pi pi-twitter"></i>
                            </span>
                            <span className="px-3 py-2 flex align-items-center text-white">Twitter</span>
                        </Button>
                        <Button className={classNames(styles['p-button'], styles['discord'])} aria-label="Discord">
                            <span className="flex align-items-center px-2 bg-bluegray-800 text-white">
                                <i className="pi pi-discord"></i>
                            </span>
                            <span className="px-3 py-2 flex align-items-center text-white">Discord</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Icons</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button icon="pi pi-star-fill"></Button>
                        <Button label="Bookmark" icon="pi pi-bookmark"></Button>
                        <Button label="Bookmark" icon="pi pi-bookmark" iconPos="right"></Button>
                    </div>
                </div>

                <div className="card">
                    <h5>Raised</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Primary" raised />
                        <Button label="Secondary" raised severity="secondary" />
                        <Button label="Success" raised severity="success" />
                        <Button label="Info" raised severity="info" />
                        <Button label="Warning" raised severity="warning" />
                        <Button label="Help" raised severity="help" />
                        <Button label="Danger" raised severity="danger" />
                    </div>
                </div>

                <div className="card">
                    <h5>Rounded</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Primary" rounded />
                        <Button label="Secondary" rounded severity="secondary" />
                        <Button label="Success" rounded severity="success" />
                        <Button label="Info" rounded severity="info" />
                        <Button label="Warning" rounded severity="warning" />
                        <Button label="Help" rounded severity="help" />
                        <Button label="Danger" rounded severity="danger" />
                    </div>
                </div>

                <div className="card">
                    <h5>Rounded Icons</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button icon="pi pi-check" rounded />
                        <Button icon="pi pi-bookmark" rounded severity="secondary" />
                        <Button icon="pi pi-search" rounded severity="success" />
                        <Button icon="pi pi-user" rounded severity="info" />
                        <Button icon="pi pi-bell" rounded severity="warning" />
                        <Button icon="pi pi-heart" rounded severity="help" />
                        <Button icon="pi pi-times" rounded severity="danger" />
                    </div>
                </div>

                <div className="card">
                    <h5>Rounded Text</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button icon="pi pi-check" rounded text />
                        <Button icon="pi pi-bookmark" rounded text severity="secondary" />
                        <Button icon="pi pi-search" rounded text severity="success" />
                        <Button icon="pi pi-user" rounded text severity="info" />
                        <Button icon="pi pi-bell" rounded text severity="warning" />
                        <Button icon="pi pi-heart" rounded text severity="help" />
                        <Button icon="pi pi-times" rounded text severity="danger" />
                        <Button icon="pi pi-filter" rounded text className="p-button-plain" />
                    </div>
                </div>

                <div className="card">
                    <h5>Rounded Outlined</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button icon="pi pi-check" rounded outlined />
                        <Button icon="pi pi-bookmark" rounded outlined severity="secondary" />
                        <Button icon="pi pi-search" rounded outlined severity="success" />
                        <Button icon="pi pi-user" rounded outlined severity="info" />
                        <Button icon="pi pi-bell" rounded outlined severity="warning" />
                        <Button icon="pi pi-heart" rounded outlined severity="help" />
                        <Button icon="pi pi-times" rounded outlined severity="danger" />
                    </div>
                </div>

                <div className="card">
                    <h5>Loading</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Search" icon="pi pi-search" loading={loading1} onClick={onLoadingClick1} />
                        <Button label="Search" icon="pi pi-search" iconPos="right" loading={loading2} onClick={onLoadingClick2} />
                        <Button icon="pi pi-search" loading={loading3} onClick={onLoadingClick3} />
                        <Button label="Search" loading={loading4} onClick={onLoadingClick4} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ButtonDemo;
