import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import styles from './index.module.scss';

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
                        <Button label="Link" className="p-button-link"></Button>
                    </div>
                </div>

                <div className="card">
                    <h5>Severities</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Primary" />
                        <Button label="Secondary" className="p-button-secondary" />
                        <Button label="Success" className="p-button-success" />
                        <Button label="Info" className="p-button-info" />
                        <Button label="Warning" className="p-button-warning" />
                        <Button label="Help" className="p-button-help" />
                        <Button label="Danger" className="p-button-danger" />
                    </div>
                </div>

                <div className="card">
                    <h5>Text</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Primary" className="p-button-text" />
                        <Button label="Secondary" className="p-button-secondary p-button-text" />
                        <Button label="Success" className="p-button-success p-button-text" />
                        <Button label="Info" className="p-button-info p-button-text" />
                        <Button label="Warning" className="p-button-warning p-button-text" />
                        <Button label="Help" className="p-button-help p-button-text" />
                        <Button label="Danger" className="p-button-danger p-button-text" />
                        <Button label="Plain" className="p-button-plain p-button-text" />
                    </div>
                </div>

                <div className="card">
                    <h5>Outlined</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Primary" className="p-button-outlined" />
                        <Button label="Secondary" className="p-button-outlined p-button-secondary" />
                        <Button label="Success" className="p-button-outlined p-button-success" />
                        <Button label="Info" className="p-button-outlined p-button-info" />
                        <Button label="Warning" className="p-button-outlined p-button-warning" />
                        <Button label="Help" className="p-button-outlined p-button-help" />
                        <Button label="Danger" className="p-button-outlined p-button-danger" />
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
                        <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-secondary"></SplitButton>
                        <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-success"></SplitButton>
                        <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-info"></SplitButton>
                        <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-warning"></SplitButton>
                        <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-danger"></SplitButton>
                    </div>
                </div>

                <div className="card">
                    <h5>Template</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button className={styles.google} aria-label="Google">
                            <span className="flex align-items-center px-2 bg-purple-700 text-white">
                                <i className="pi pi-google"></i>
                            </span>
                            <span className="px-3 py-2 flex align-items-center text-white">Google</span>
                        </Button>
                        <Button className={styles.twitter} aria-label="Twitter">
                            <span className="flex align-items-center px-2 bg-blue-500 text-white">
                                <i className="pi pi-twitter"></i>
                            </span>
                            <span className="px-3 py-2 flex align-items-center text-white">Twitter</span>
                        </Button>
                        <Button className={styles.discord} aria-label="Discord">
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
                        <Button label="Primary" className="p-button-raised" />
                        <Button label="Secondary" className="p-button-raised p-button-secondary" />
                        <Button label="Success" className="p-button-raised p-button-success" />
                        <Button label="Info" className="p-button-raised p-button-info" />
                        <Button label="Warning" className="p-button-raised p-button-warning" />
                        <Button label="Danger" className="p-button-raised p-button-danger" />
                    </div>
                </div>

                <div className="card">
                    <h5>Rounded</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button label="Primary" className="p-button-rounded" />
                        <Button label="Secondary" className="p-button-rounded p-button-secondary" />
                        <Button label="Success" className="p-button-rounded p-button-success" />
                        <Button label="Info" className="p-button-rounded p-button-info" />
                        <Button label="Warning" className="p-button-rounded p-button-warning" />
                        <Button label="Danger" className="p-button-rounded p-button-danger" />
                    </div>
                </div>

                <div className="card">
                    <h5>Rounded Icons</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button icon="pi pi-star" className="p-button-rounded" />
                        <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary" />
                        <Button icon="pi pi-check" className="p-button-rounded p-button-success" />
                        <Button icon="pi pi-search" className="p-button-rounded p-button-info" />
                        <Button icon="pi pi-user" className="p-button-rounded p-button-warning" />
                        <Button icon="pi pi-sign-out" className="p-button-rounded p-button-danger" />
                    </div>
                </div>

                <div className="card">
                    <h5>Rounded Text</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button icon="pi pi-check" className="p-button-rounded p-button-text" />
                        <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-text" />
                        <Button icon="pi pi-search" className="p-button-rounded p-button-success p-button-text" />
                        <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-text" />
                        <Button icon="pi pi-bell" className="p-button-rounded p-button-warning p-button-text" />
                        <Button icon="pi pi-heart" className="p-button-rounded p-button-help p-button-text" />
                        <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" />
                        <Button icon="pi pi-filter" className="p-button-rounded p-button-plain p-button-text" />
                    </div>
                </div>

                <div className="card">
                    <h5>Rounded Outlined</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button icon="pi pi-check" className="p-button-rounded p-button-outlined" />
                        <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-outlined" />
                        <Button icon="pi pi-search" className="p-button-rounded p-button-success p-button-outlined" />
                        <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-outlined" />
                        <Button icon="pi pi-bell" className="p-button-rounded p-button-warning p-button-outlined" />
                        <Button icon="pi pi-heart" className="p-button-rounded p-button-help p-button-outlined" />
                        <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-outlined" />
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
