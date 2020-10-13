import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

export function FormLayoutDemo() {

    const [city, setCity] = useState(null);

    const cityOptions = [
        { label: 'Select City', value: null },
        { label: 'New York', value: 'New York' },
        { label: 'Rome', value: 'Rome' },
        { label: 'London', value: 'London' },
        { label: 'Istanbul', value: 'Istanbul' },
        { label: 'Paris', value: 'Paris' }
    ]

    return (
        <div className="p-grid p-fluid">
            <div className="p-col-12 p-lg-6">
                <div className="card card-w-title">
                    <h1>Vertical</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <label>Name</label>
                            <InputText />
                        </div>
                        <div className="p-col-12">
                            <label>Email</label>
                            <InputText />
                        </div>
                        <div className="p-col-12">
                            <label>Age</label>
                            <InputText />
                        </div>
                    </div>
                </div>
                <div className="card card-w-title">
                    <h1>Vertical Grid</h1>
                    <div className="p-grid">
                        <div className="p-col-6">
                            <label>Name</label>
                            <InputText />
                        </div>
                        <div className="p-col-6">
                            <label>Email</label>
                            <InputText />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-col-12 p-lg-6">
                <div className="card card-w-title">
                    <h1>Horizontal</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <div className="p-field p-grid">
                                <label className="p-col-2">Name</label>
                                <div className="p-col-10">
                                    <InputText placeholder="Name" />
                                </div>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <InputText placeholder="Email" />
                        </div>
                    </div>
                </div>
                <div className="card card-w-title">
                    <h1>Inline</h1>
                    <div className="p-grid">
                        <div className="p-col-3">
                            <InputText placeholder="Firstname" />
                        </div>
                        <div className="p-col-3">
                            <InputText placeholder="Lastname" />
                        </div>
                        <div className="p-col-2">
                            <Button label="submit" />
                        </div>
                    </div>
                </div>
                <div className="card card-w-title">
                    <h1>Help Text</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <label>Username</label>
                            <InputText />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-col-12">
                <div className="card card-w-title">
                    <h1>Advanced</h1>
                    <div className="p-grid">
                        <div className="p-col-6">
                            <label>Firstname</label>
                            <InputText />
                        </div>
                        <div className="p-col-6">
                            <label>Lastname</label>
                            <InputText />
                        </div>
                        <div className="p-col-12">
                            <label>Address</label>
                            <InputTextarea rows={3} cols={30} />
                        </div>
                        <div className="p-col-6">
                            <label>City</label>
                            <InputText />
                        </div>
                        <div className="p-col-3">
                            <label>State</label>
                            <Dropdown options={cityOptions} value={city} onChange={(event) => setCity(event.value)} autoWidth={false} />
                        </div>
                        <div className="p-col-3">
                            <label>Zip</label>
                            <InputText />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

