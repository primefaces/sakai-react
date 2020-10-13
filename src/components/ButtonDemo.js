import React from 'react';
import { Button } from 'primereact/button';
import './ButtonDemo.scss';
import { SplitButton } from 'primereact/splitbutton';


export function ButtonDemo() {

    const items = [
        {
            label:'Update',
            icon:'pi pi-refresh'
        },
        {
            label:'Delete',
            icon:'pi pi-times'
        },
        {
            label:'Home',
            icon:'pi pi-home'
        },
    ]
    return (
        <div className="button-demo p-grid">
            <div className="p-col-6">
                <div className="card">
                    <h1>Basic</h1>
                    <Button label="Submit" />
                    <Button label="Disabled" disabled />
                </div>
                <div className="card">
                    <h1>Severities</h1>
                    <Button label="Primary" />
                    <Button label="Secondary" className="p-button-secondary" />
                    <Button label="Success" className="p-button-success" />
                    <Button label="Info" className="p-button-info" />
                    <Button label="Warning" className="p-button-warning" />
                    <Button label="Help" className="p-button-help" />
                    <Button label="Danger" className="p-button-danger" />
                </div>
                <div className="card">
                    <h1>Text</h1>
                    <Button label="Primary" className="p-button-text" />
                    <Button label="Secondary" className="p-button-secondary p-button-text" />
                    <Button label="Success" className="p-button-success p-button-text" />
                    <Button label="Info" className="p-button-info p-button-text" />
                    <Button label="Warning" className="p-button-warning p-button-text" />
                    <Button label="Help" className="p-button-help p-button-text" />
                    <Button label="Danger" className="p-button-danger p-button-text" />
                    <Button label="Plain" className="p-button-text p-button-plain" />
                </div>
                <div className="card">
                    <h1>Outlined</h1>
                    <Button label="Primary" className="p-button-outlined" />
                    <Button label="Secondary" className="p-button-outlined p-button-secondary" />
                    <Button label="Success" className="p-button-outlined p-button-success" />
                    <Button label="Info" className="p-button-outlined p-button-info" />
                    <Button label="Warning" className="p-button-outlined p-button-warning" />
                    <Button label="Help" className="p-button-outlined p-button-help" />
                    <Button label="Danger" className="p-button-outlined p-button-danger" />
                </div>
                <div className="card">
                    <h1>Button Group</h1>
                    <span className="p-buttonset">
                        <Button label="Save" icon="pi pi-check" />
                        <Button label="Delete" icon="pi pi-trash" />
                        <Button label="Cancel" icon="pi pi-times" />
                    </span>
                </div>
                <div className="card">
                    <h1>SplitButton</h1>
                    <SplitButton label="Options" model={items} ></SplitButton>
                    <SplitButton label="Options" model={items} ></SplitButton>
                    <SplitButton label="Options" model={items} ></SplitButton>
                    <SplitButton label="Options" model={items} ></SplitButton>
                    <SplitButton label="Options" model={items} ></SplitButton>
                </div>
            </div>
            <div className="p-col-6">
                <div className="card">
                    <h1>Icons</h1>
                    <Button type="button" class="p-button  p-button-icon-only">
                        <span class="pi pi-star p-button-icon"></span>
                        <span class="p-button-label">&nbsp;</span>
                    </Button>
                    <Button type="button" class="p-button ">
                        <span class="pi pi-bookmark p-button-icon p-button-icon-left"></span>
                        <span class="p-button-label">Bookmark</span>
                    </Button>
                    <Button type="button" class="p-button ">
                        <span class="pi pi-bookmark p-button-icon p-button-icon-right"></span>
                        <span class="p-button-label">Bookmark</span>
                    </Button>
                </div>
                <div className="card">
                    <h1>Raised</h1>
                    <Button label="Primary" className="p-button-raised" />
                    <Button label="Secondary" className="p-button-raised p-button-secondary" />
                    <Button label="Success" className="p-button-raised p-button-success" />
                    <Button label="Info" className="p-button-raised p-button-info" />
                    <Button label="Warning" className="p-button-raised p-button-warning" />
                    <Button label="Help" className="p-button-raised p-button-help" />
                    <Button label="Danger" className="p-button-raised p-button-danger" />
                </div>
                <div className="card">
                    <h1>Rounded</h1>
                    <Button label="Primary" className="p-button-rounded" />
                    <Button label="Secondary" className="p-button-rounded p-button-secondary" />
                    <Button label="Success" className="p-button-rounded p-button-success" />
                    <Button label="Info" className="p-button-rounded p-button-info" />
                    <Button label="Warning" className="p-button-rounded p-button-warning" />
                    <Button label="Help" className="p-button-rounded p-button-help" />
                    <Button label="Danger" className="p-button-rounded p-button-danger" />
                </div>
                <div className="card">
                    <h1>Rounded Icons</h1>
                    <Button icon="pi pi-star" className="p-button-rounded p-button-primary" />
                    <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary" />
                    <Button icon="pi pi-check" className="p-button-rounded p-button-success" />
                    <Button icon="pi pi-search" className="p-button-rounded p-button-primary" />
                    <Button icon="pi pi-user" className="p-button-rounded p-button-warning" />
                    <Button icon="pi pi-sign-out" className="p-button-rounded p-button-danger" />
                </div>
                <div className="card">
                    <h1>Rounded Text</h1>
                    <Button icon="pi pi-check" className="p-button-rounded p-button-text" />
                    <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-text" />
                    <Button icon="pi pi-search" className="p-button-rounded p-button-success p-button-text" />
                    <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-text" />
                    <Button icon="pi pi-bell" className="p-button-rounded p-button-warning p-button-text" />
                    <Button icon="pi pi-heart" className="p-button-rounded p-button-help p-button-text" />
                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" />
                    <Button icon="pi pi-filter" className="p-button-rounded p-button-text p-button-plain" />
                </div>
                <div className="card">
                    <h1>Rounded Outlined</h1>
                    <Button icon="pi pi-check" className="p-button-rounded p-button-outlined" />
                    <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-outlined" />
                    <Button icon="pi pi-search" className="p-button-rounded p-button-success p-button-outlined" />
                    <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-outlined" />
                    <Button icon="pi pi-bell" className="p-button-rounded p-button-warning p-button-outlined" />
                    <Button icon="pi pi-heart" className="p-button-rounded p-button-help p-button-outlined" />
                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-outlined" />
                </div>
            </div>
        </div>
    )
}