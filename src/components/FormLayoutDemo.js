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
                            <InputTextarea rows={4} cols={30} />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="city">City</label>
                            <InputText id="city" type="text" />
                        </div>
                        <div className="p-field p-col-12 p-md-3">
                            <label htmlFor="state">State</label>
                            <Dropdown options={cityOptions} value={city} onChange={(event) => setCity(event.value)} autoWidth={false} />
                        </div>
                        <div className="p-field p-col-12 p-md-3">
                            <label htmlFor="zip">Zip</label>
                            <InputText id="zip" type="text" />
                        </div>
                    </div>
                </div>
            </div>
        </div>


        // <div className="p-grid p-fluid">
        //     <div className="p-col-12 p-md-6">
        //         <div className="card p-fluid">
        //             <h5>Vertical</h5>
        //             <div className="p-field">
        //                 <div className="p-col-12">
        //                     <label>Name</label>
        //                     <InputText />
        //                 </div>
        //                 <div className="p-field">
        //                     <label htmlFor="email1">Email</label>
        //                     <InputText id="email1" type="text" />
        //                 </div>
        //                 <div className="p-field">
        //                     <label htmlFor="age1">Age</label>
        //                     <InputText id="age1" />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="card p-field">
        //             <h5>Vertical Grid</h5>
        //             <div className="p-formgrid p-grid">
        //                 <div className="p-formgrid p-grid">
        //                     <label>Name</label>
        //                     <InputText />
        //                 </div>
        //                 <div className="p-col-6">
        //                     <label>Email</label>
        //                     <InputText />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="p-col-12 p-lg-6">
        //         <div className="card card-w-title">
        //             <h5>Horizontal</h5>
        //             <div className="p-grid">
        //                 <div className="p-col-12">
        //                     <div className="p-field p-grid">
        //                         <label className="p-col-2">Name</label>
        //                         <div className="p-col-10">
        //                             <InputText placeholder="Name" />
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="p-col-12">
        //                     <InputText placeholder="Email" />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="card card-w-title">
        //             <h5>Inline</h5>
        //             <div className="p-grid">
        //                 <div className="p-col-3">
        //                     <InputText placeholder="Firstname" />
        //                 </div>
        //                 <div className="p-col-3">
        //                     <InputText placeholder="Lastname" />
        //                 </div>
        //                 <div className="p-col-2">
        //                     <Button label="submit" />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="card card-w-title">
        //             <h5>Help Text</h5>
        //             <div className="p-grid">
        //                 <div className="p-col-12">
        //                     <label>Username</label>
        //                     <InputText />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="p-col-12">
        //         <div className="card card-w-title">
        //             <h5>Advanced</h5>
        //             <div className="p-grid">
        //                 <div className="p-col-6">
        //                     <label>Firstname</label>
        //                     <InputText />
        //                 </div>
        //                 <div className="p-col-6">
        //                     <label>Lastname</label>
        //                     <InputText />
        //                 </div>
        //                 <div className="p-col-12">
        //                     <label>Address</label>
        //                     <InputTextarea rows={3} cols={30} />
        //                 </div>
        //                 <div className="p-col-6">
        //                     <label>City</label>
        //                     <InputText />
        //                 </div>
        //                 <div className="p-col-3">
        //                     <label>State</label>
        //                     <Dropdown options={cityOptions} value={city} onChange={(event) => setCity(event.value)} autoWidth={false} />
        //                 </div>
        //                 <div className="p-col-3">
        //                     <label>Zip</label>
        //                     <InputText />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

    )
}

