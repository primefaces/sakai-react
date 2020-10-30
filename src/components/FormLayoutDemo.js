import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

export const FormLayoutDemo = () => {

    const [dropdownItem, setDropdownItem] = useState(null);
    const dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    return (
        <div className="p-grid">
            <div className="p-col-12 p-md-6">
                <div className="card p-fluid">
                    <h5>Vertical</h5>
                    <div className="p-field">
                        <label htmlFor="name1">Name</label>
                        <InputText id="name1" type="text" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email1">Email</label>
                        <InputText id="email1" type="text" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="age1">Age</label>
                        <InputText id="age1" type="text" />
                    </div>
                </div>

                <div className="card p-fluid">
                    <h5>Vertical Grid</h5>
                    <div className="p-formgrid p-grid">
                        <div className="p-field p-col">
                            <label htmlFor="name2">Name</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div className="p-field p-col">
                            <label htmlFor="email2">Email</label>
                            <InputText id="email2" type="text" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-md-6">
                <div className="card p-fluid">
                    <h5>Horizontal</h5>
                    <div className="p-field p-grid">
                        <label htmlFor="name3" className="p-col-12 p-mb-2 p-md-2 p-mb-md-0">Name</label>
                        <div className="p-col-12 p-md-10">
                            <InputText id="name3" type="text" />
                        </div>
                    </div>
                    <div className="p-field p-grid">
                        <label htmlFor="email3" className="p-col-12 p-mb-2 p-md-2 p-mb-md-0">Email</label>
                        <div className="p-col-12 p-md-10">
                            <InputText id="email3" type="text" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h5>Inline</h5>
                    <div className="p-formgroup-inline">
                        <div className="p-field">
                            <label htmlFor="firstname1" className="p-sr-only">Firstname</label>
                            <InputText id="firstname1" type="text" placeholder="Firstname" />
                        </div>
                        <div className="p-field">
                            <label htmlFor="lastname1" className="p-sr-only">Lastname</label>
                            <InputText id="lastname1" type="text" placeholder="Lastname" />
                        </div>
                        <Button label="Submit"></Button>
                    </div>
                </div>

                <div className="card">
                    <h5>Help Text</h5>
                    <div className="p-field p-fluid">
                        <label htmlFor="username">Username</label>
                        <InputText id="username" type="text" />
                        <small>Enter your username to reset your password.</small>
                    </div>
                </div>
            </div>

            <div className="p-col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="firstname2">Firstname</label>
                            <InputText id="firstname2" type="text" />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="lastname2">Lastname</label>
                            <InputText id="lastname2" type="text" />
                        </div>
                        <div className="p-field p-col-12">
                            <label htmlFor="address">Address</label>
                            <InputTextarea id="address" rows="4" />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="city">City</label>
                            <InputText id="city" type="text" />
                        </div>
                        <div className="p-field p-col-12 p-md-3">
                            <label htmlFor="state">State</label>
                            <Dropdown id="state" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="p-field p-col-12 p-md-3">
                            <label htmlFor="zip">Zip</label>
                            <InputText id="zip" type="text" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
