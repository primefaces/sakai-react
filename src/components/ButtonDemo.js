import React from 'react';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';

export const ButtonDemo = () => {

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
        <div className="p-grid">
            <div className="p-col-12 p-md-6">
                <div className="card">
                    <h5>Default</h5>
                    <Button label="Submit" className="p-mr-2 p-mb-2"></Button>
                    <Button label="Disabled" className="p-mr-2 p-mb-2" disabled></Button>
                </div>

                <div className="card">
                    <h5>Severities</h5>
                    <Button label="Primary" className="p-mr-2 p-mb-2" />
                    <Button label="Secondary" className="p-button-secondary p-mr-2 p-mb-2" />
                    <Button label="Success" className="p-button-success p-mr-2 p-mb-2" />
                    <Button label="Info" className="p-button-info p-mr-2 p-mb-2" />
                    <Button label="Warning" className="p-button-warning p-mr-2 p-mb-2" />
                    <Button label="Danger" className="p-button-danger p-mr-2 p-mb-2" />
                </div>

                <div className="card">
                    <h5>Text</h5>
                    <Button label="Primary" className="p-button-text p-mr-2 p-mb-2" />
                    <Button label="Secondary" className="p-button-secondary p-button-text p-mr-2 p-mb-2" />
                    <Button label="Success" className="p-button-success p-button-text p-mr-2 p-mb-2" />
                    <Button label="Info" className="p-button-info p-button-text p-mr-2 p-mb-2" />
                    <Button label="Warning" className="p-button-warning p-button-text p-mr-2 p-mb-2" />
                    <Button label="Help" className="p-button-help p-button-text p-mr-2 p-mb-2" />
                    <Button label="Danger" className="p-button-danger p-button-text p-mr-2 p-mb-2" />
                    <Button label="Plain" className="p-button-plain p-button-text p-mr-2 p-mb-2" />
                </div>

                <div className="card">
                    <h5>Outlined</h5>
                    <Button label="Primary" className="p-button-outlined p-mr-2 p-mb-2" />
                    <Button label="Secondary" className="p-button-outlined p-button-secondary p-mr-2 p-mb-2" />
                    <Button label="Success" className="p-button-outlined p-button-success p-mr-2 p-mb-2" />
                    <Button label="Info" className="p-button-outlined p-button-info p-mr-2 p-mb-2" />
                    <Button label="Warning" className="p-button-outlined p-button-warning p-mr-2 p-mb-2" />
                    <Button label="Help" className="p-button-outlined p-button-help p-mr-2 p-mb-2" />
                    <Button label="Danger" className="p-button-outlined p-button-danger p-mr-2 p-mb-2" />
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
                    <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-secondary p-mr-2 p-mb-2"></SplitButton>
                    <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-success p-mr-2 p-mb-2"></SplitButton>
                    <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-info p-mr-2 p-mb-2"></SplitButton>
                    <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-warning p-mr-2 p-mb-2"></SplitButton>
                    <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-danger p-mr-2 p-mb-2"></SplitButton>
                </div>
            </div>

            <div className="p-col-12 p-md-6">
                <div className="card">
                    <h5>Icons</h5>
                    <Button icon="pi pi-star" className="p-mr-2 p-mb-2"></Button>
                    <Button label="Bookmark" icon="pi pi-bookmark" className="p-mr-2 p-mb-2"></Button>
                    <Button label="Bookmark" icon="pi pi-bookmark" iconPos="right" className="p-mr-2 p-mb-2"></Button>
                </div>

                <div className="card">
                    <h5>Raised</h5>
                    <Button label="Primary" className="p-button-raised p-mr-2 p-mb-2" />
                    <Button label="Secondary" className="p-button-raised p-button-secondary p-mr-2 p-mb-2" />
                    <Button label="Success" className="p-button-raised p-button-success p-mr-2 p-mb-2" />
                    <Button label="Info" className="p-button-raised p-button-info p-mr-2 p-mb-2" />
                    <Button label="Warning" className="p-button-raised p-button-warning p-mr-2 p-mb-2" />
                    <Button label="Danger" className="p-button-raised p-button-danger p-mr-2 p-mb-2" />
                </div>

                <div className="card">
                    <h5>Rounded</h5>
                    <Button label="Primary" className="p-button-rounded p-mr-2 p-mb-2" />
                    <Button label="Secondary" className="p-button-rounded p-button-secondary p-mr-2 p-mb-2" />
                    <Button label="Success" className="p-button-rounded p-button-success p-mr-2 p-mb-2" />
                    <Button label="Info" className="p-button-rounded p-button-info p-mr-2 p-mb-2" />
                    <Button label="Warning" className="p-button-rounded p-button-warning p-mr-2 p-mb-2" />
                    <Button label="Danger" className="p-button-rounded p-button-danger p-mr-2 p-mb-2" />
                </div>

                <div className="card">
                    <h5>Rounded Icons</h5>
                    <Button icon="pi pi-star" className="p-button-rounded p-mr-2 p-mb-2" />
                    <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-mr-2 p-mb-2" />
                    <Button icon="pi pi-check" className="p-button-rounded p-button-success p-mr-2 p-mb-2" />
                    <Button icon="pi pi-search" className="p-button-rounded p-button-info p-mr-2 p-mb-2" />
                    <Button icon="pi pi-user" className="p-button-rounded p-button-warning p-mr-2 p-mb-2" />
                    <Button icon="pi pi-sign-out" className="p-button-rounded p-button-danger p-mr-2 p-mb-2" />
                </div>

                <div className="card">
                    <h5>Rounded Text</h5>
                    <Button icon="pi pi-check" className="p-button-rounded p-button-text p-mr-2 p-mb-2" />
                    <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-text p-mr-2 p-mb-2" />
                    <Button icon="pi pi-search" className="p-button-rounded p-button-success p-button-text p-mr-2 p-mb-2" />
                    <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-text p-mr-2 p-mb-2" />
                    <Button icon="pi pi-bell" className="p-button-rounded p-button-warning p-button-text p-mr-2 p-mb-2" />
                    <Button icon="pi pi-heart" className="p-button-rounded p-button-help p-button-text p-mr-2 p-mb-2" />
                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text p-mr-2 p-mb-2" />
                    <Button icon="pi pi-filter" className="p-button-rounded p-button-plain p-button-text p-mr-2 p-mb-2" />
                </div>

                <div className="card">
                    <h5>Rounded Outlined</h5>
                    <Button icon="pi pi-check" className="p-button-rounded p-button-outlined p-mr-2 p-mb-2" />
                    <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-outlined p-mr-2 p-mb-2" />
                    <Button icon="pi pi-search" className="p-button-rounded p-button-success p-button-outlined p-mr-2 p-mb-2" />
                    <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2" />
                    <Button icon="pi pi-bell" className="p-button-rounded p-button-warning p-button-outlined p-mr-2 p-mb-2" />
                    <Button icon="pi pi-heart" className="p-button-rounded p-button-help p-button-outlined p-mr-2 p-mb-2" />
                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-outlined p-mr-2 p-mb-2" />
                </div>
            </div>
        </div>
    )
}
