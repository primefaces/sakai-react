import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';

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
    }

    const onLoadingClick2 = () => {
        setLoading2(true);

        setTimeout(() => {
            setLoading2(false);
        }, 2000);
    }

    const onLoadingClick3 = () => {
        setLoading3(true);

        setTimeout(() => {
            setLoading3(false);
        }, 2000);
    }

    const onLoadingClick4 = () => {
        setLoading4(true);

        setTimeout(() => {
            setLoading4(false);
        }, 2000);
    }

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
                    <Button label="Submit" className="mr-2 mb-2"></Button>
                    <Button label="Disabled" className="mr-2 mb-2" disabled></Button>
                    <Button label="Link" className="p-button-link mb-2 mr-2"></Button>
                </div>

                <div className="card">
                    <h5>Severities</h5>
                    <Button label="Primary" className="mr-2 mb-2" />
                    <Button label="Secondary" className="p-button-secondary mr-2 mb-2" />
                    <Button label="Success" className="p-button-success mr-2 mb-2" />
                    <Button label="Info" className="p-button-info mr-2 mb-2" />
                    <Button label="Warning" className="p-button-warning mr-2 mb-2" />
                    <Button label="Danger" className="p-button-danger mr-2 mb-2" />
                </div>

                <div className="card">
                    <h5>Text</h5>
                    <Button label="Primary" className="p-button-text mr-2 mb-2" />
                    <Button label="Secondary" className="p-button-secondary p-button-text mr-2 mb-2" />
                    <Button label="Success" className="p-button-success p-button-text mr-2 mb-2" />
                    <Button label="Info" className="p-button-info p-button-text mr-2 mb-2" />
                    <Button label="Warning" className="p-button-warning p-button-text mr-2 mb-2" />
                    <Button label="Help" className="p-button-help p-button-text mr-2 mb-2" />
                    <Button label="Danger" className="p-button-danger p-button-text mr-2 mb-2" />
                    <Button label="Plain" className="p-button-plain p-button-text mr-2 mb-2" />
                </div>

                <div className="card">
                    <h5>Outlined</h5>
                    <Button label="Primary" className="p-button-outlined mr-2 mb-2" />
                    <Button label="Secondary" className="p-button-outlined p-button-secondary mr-2 mb-2" />
                    <Button label="Success" className="p-button-outlined p-button-success mr-2 mb-2" />
                    <Button label="Info" className="p-button-outlined p-button-info mr-2 mb-2" />
                    <Button label="Warning" className="p-button-outlined p-button-warning mr-2 mb-2" />
                    <Button label="Help" className="p-button-outlined p-button-help mr-2 mb-2" />
                    <Button label="Danger" className="p-button-outlined p-button-danger mr-2 mb-2" />
                </div>

                <div className="card">
                    <h5>Button Group</h5>
                    <span className="p-buttonset">
                        <Button label="Save" icon="pi pi-check" />
                        <Button label="Delete" icon="pi pi-trash" />
                        <Button label="Cancel" icon="pi pi-times" />
                    </span>
                </div>

                <div className="card">
                    <h5>SplitButton</h5>
                    <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-secondary mr-2 mb-2"></SplitButton>
                    <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-success mr-2 mb-2"></SplitButton>
                    <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-info mr-2 mb-2"></SplitButton>
                    <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-warning mr-2 mb-2"></SplitButton>
                    <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-danger mr-2 mb-2"></SplitButton>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Icons</h5>
                    <Button icon="pi pi-star-fill" className="mr-2 mb-2"></Button>
                    <Button label="Bookmark" icon="pi pi-bookmark" className="mr-2 mb-2"></Button>
                    <Button label="Bookmark" icon="pi pi-bookmark" iconPos="right" className="mr-2 mb-2"></Button>
                </div>

                <div className="card">
                    <h5>Raised</h5>
                    <Button label="Primary" className="p-button-raised mr-2 mb-2" />
                    <Button label="Secondary" className="p-button-raised p-button-secondary mr-2 mb-2" />
                    <Button label="Success" className="p-button-raised p-button-success mr-2 mb-2" />
                    <Button label="Info" className="p-button-raised p-button-info mr-2 mb-2" />
                    <Button label="Warning" className="p-button-raised p-button-warning mr-2 mb-2" />
                    <Button label="Danger" className="p-button-raised p-button-danger mr-2 mb-2" />
                </div>

                <div className="card">
                    <h5>Rounded</h5>
                    <Button label="Primary" className="p-button-rounded mr-2 mb-2" />
                    <Button label="Secondary" className="p-button-rounded p-button-secondary mr-2 mb-2" />
                    <Button label="Success" className="p-button-rounded p-button-success mr-2 mb-2" />
                    <Button label="Info" className="p-button-rounded p-button-info mr-2 mb-2" />
                    <Button label="Warning" className="p-button-rounded p-button-warning mr-2 mb-2" />
                    <Button label="Danger" className="p-button-rounded p-button-danger mr-2 mb-2" />
                </div>

                <div className="card">
                    <h5>Rounded Icons</h5>
                    <Button icon="pi pi-star" className="p-button-rounded mr-2 mb-2" />
                    <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary mr-2 mb-2" />
                    <Button icon="pi pi-check" className="p-button-rounded p-button-success mr-2 mb-2" />
                    <Button icon="pi pi-search" className="p-button-rounded p-button-info mr-2 mb-2" />
                    <Button icon="pi pi-user" className="p-button-rounded p-button-warning mr-2 mb-2" />
                    <Button icon="pi pi-sign-out" className="p-button-rounded p-button-danger mr-2 mb-2" />
                </div>

                <div className="card">
                    <h5>Rounded Text</h5>
                    <Button icon="pi pi-check" className="p-button-rounded p-button-text mr-2 mb-2" />
                    <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-text mr-2 mb-2" />
                    <Button icon="pi pi-search" className="p-button-rounded p-button-success p-button-text mr-2 mb-2" />
                    <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" />
                    <Button icon="pi pi-bell" className="p-button-rounded p-button-warning p-button-text mr-2 mb-2" />
                    <Button icon="pi pi-heart" className="p-button-rounded p-button-help p-button-text mr-2 mb-2" />
                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text mr-2 mb-2" />
                    <Button icon="pi pi-filter" className="p-button-rounded p-button-plain p-button-text mr-2 mb-2" />
                </div>

                <div className="card">
                    <h5>Rounded Outlined</h5>
                    <Button icon="pi pi-check" className="p-button-rounded p-button-outlined mr-2 mb-2" />
                    <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-outlined mr-2 mb-2" />
                    <Button icon="pi pi-search" className="p-button-rounded p-button-success p-button-outlined mr-2 mb-2" />
                    <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-outlined mr-2 mb-2" />
                    <Button icon="pi pi-bell" className="p-button-rounded p-button-warning p-button-outlined mr-2 mb-2" />
                    <Button icon="pi pi-heart" className="p-button-rounded p-button-help p-button-outlined mr-2 mb-2" />
                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2" />
                </div>

                <div className="card">
                    <h5>Loading</h5>
                    <Button className="mr-2 mb-2" label="Search" icon="pi pi-search" loading={loading1} onClick={onLoadingClick1} />
                    <Button className="mr-2 mb-2" label="Search" icon="pi pi-search" iconPos="right" loading={loading2} onClick={onLoadingClick2} />
                    <Button className="mr-2 mb-2" icon="pi pi-search" loading={loading3} onClick={onLoadingClick3} />
                    <Button className="mr-2 mb-2" label="Search" loading={loading4} onClick={onLoadingClick4} />
                </div>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ButtonDemo, comparisonFn);