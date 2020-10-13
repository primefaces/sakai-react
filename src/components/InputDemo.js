import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
// import { Spinner } from 'primereact/spinner';
import { Chips } from "primereact/chips";
import { Slider } from 'primereact/slider';
import { Rating } from 'primereact/rating';
import { ColorPicker } from 'primereact/colorpicker';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from "primereact/button";



export function InputDemo() {
    const [sliderValue, setSliderValue] = useState('');
    const [ratingValue, setRatingValue] = useState(0);
    const [color, setColor] = useState('1976D2');
    const [inputSwitch, setInputSwitch] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [toggleCheck, setToggleCheck] = useState(false);
    const [selectedCountries, setSelectedCountries] = useState(null);
    const [city, setCity] = useState(null);
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [checkbox3, setCheckbox3] = useState(false);
    const [selectButton, setSelectButton] = useState(null);
    const [multipleButton, setMultipleButton] = useState(null);
    const [inputGroupCheck, setInputGroupCheck] = useState(false);

    const countries = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];

    const selectButtonOptions = [
        { name: 'Option 1', value: 1 },
        { name: 'Option 2', value: 2 },
        { name: 'Option 3', value: 3 }
    ];

    const multipleButtonOptions = [
        { name: 'Option 1', value: 1 },
        { name: 'Option 2', value: 2 },
        { name: 'Option 3', value: 3 }
    ];

    return (
        <div className="p-grid p-fluid">
            <div className="p-col-12 p-lg-6">
                <div className="card card-w-title">
                    <h1>InputText</h1>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-4">
                            <InputText placeholder="Name" />
                        </div>
                        <div className="p-col-12 p-md-4">
                            <InputText placeholder="Disabled" disabled={true} />
                        </div>
                        <div className="p-col-12 p-md-4">
                            <InputText placeholder="Invalid" className="p-error" />
                        </div>
                    </div>
                    <h1>Icons</h1>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-4">
                            <span className="p-input-icon-left">
                                <i className="pi pi-user" />
                                <InputText placeholder="Username" />
                            </span>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText placeholder="Search" />
                            </span>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <span className="p-input-icon-left p-input-icon-right">
                                <i className="pi pi-user" />
                                <i className="pi pi-search" />
                                <InputText placeholder="Search" />
                            </span>
                        </div>
                    </div>
                    <h1>Float Label</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <InputText placeholder="Username" />
                        </div>
                    </div>
                    <h1>Textarea</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <InputTextarea rows={3} cols={30} placeholder="Your Message" autoResize={true} />
                        </div>
                    </div>
                    <h1>AutoComplete</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <AutoComplete dropdown placeholder="Search" />
                        </div>
                    </div>
                    <h1>Calender</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <Calendar id="icon" showIcon />
                        </div>
                    </div>
                    {/* <h1>Spinner</h1>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <Spinner />
                            </div>
                        </div> */}
                    <h1>Chips</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <Chips />
                        </div>
                    </div>
                </div>

                <div className="card card-w-title">
                    <h1>Slider</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <InputText value={sliderValue} onChange={e => setSliderValue(e.target.value)} />
                            <Slider value={sliderValue} onChange={e => setSliderValue(e.value)} />
                        </div>
                    </div>
                    <h1>Rating</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <Rating value={ratingValue} onChange={e => setRatingValue(e.value)} />
                        </div>
                    </div>
                    <h1>ColorPicker</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <ColorPicker value={color} onChange={e => setColor(e.value)} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-col-12 p-lg-6">
                <div className="card card-w-title">
                    <h1>RadioButtons</h1>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-4 p-field-radiobutton">
                            <RadioButton name="rb" inputId="rb1" value="Chicago" onChange={e => setCity(e.value)} checked={city === 'Chicago'} />
                            <label htmlFor="rb1" className="p-radiobutton-label">Chicago</label>
                        </div>
                        <div className="p-col-12 p-md-4 p-field-radiobutton">
                            <RadioButton name="rb" inputId="rb2" value='Los Angeles' onChange={e => setCity(e.value)} checked={city === 'Los Angeles'} />
                            <label htmlFor="rb2" className="p-radiobutton-label">Los Angeles</label>
                        </div>
                        <div className="p-col-12 p-md-4 p-field-radiobutton">
                            <RadioButton name="rb" inputId="rb3" value='New York' onChange={e => setCity(e.value)} checked={city === 'New York'} />
                            <label htmlFor="rb3" className="p-radiobutton-label">New York</label>
                        </div>
                    </div>
                    <h1>Checkboxes</h1>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-4 p-field-checkbox">
                            <Checkbox checked={checkbox1} inputId="cb1" onChange={e => setCheckbox1(e.checked)} />
                            <label htmlFor="cb1" className="p-checkbox-label">Chicago</label>
                        </div>
                        <div className="p-col-12 p-md-4 p-field-checkbox ">
                            <Checkbox checked={checkbox2} inputId="cb2" onChange={e => setCheckbox2(e.checked)} />
                            <label htmlFor="cb2" className="p-checkbox-label">Los Angeles</label>
                        </div>
                        <div className="p-col-12 p-md-4 p-field-checkbox ">
                            <Checkbox checked={checkbox3} inputId="cb3" onChange={e => setCheckbox3(e.checked)} />
                            <label htmlFor="cb3" className="p-checkbox-label">New York</label>
                        </div>
                    </div>
                    <h1>Input Switch</h1>
                    <div className="p-col-12">
                        <InputSwitch checked={inputSwitch} onChange={e => setInputSwitch(e.value)} />
                    </div>
                </div>
                <div className="card card-w-title">
                    <h1>Listbox</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <ListBox value={selectedCountry} options={countries} onChange={e => setSelectedCountry(e.value)} filter optionLabel="name"
                                listStyle={{ maxHeight: '250px' }} />
                        </div>
                    </div>
                    <h1>Dropdown</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <Dropdown value={selectedCountry} options={countries} onChange={e => setSelectedCountry(e.value)} optionLabel="name" placeholder="Select a City" />
                        </div>
                    </div>
                    <h1> MultiSelect</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <MultiSelect value={selectedCountries} options={countries} onChange={e => setSelectedCountries(e.value)} optionLabel="name" placeholder="Select Countries" filter className="multiselect-custom" />
                        </div>
                    </div>
                </div>
                <div className="card card-w-title">
                    <h1> Toggle Button</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <ToggleButton checked={toggleCheck} onChange={e => setToggleCheck(e.value)} />
                        </div>
                    </div>
                    <h1>Select Button</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <SelectButton value={selectButton} options={selectButtonOptions} onChange={e => setSelectButton(e.value)} optionLabel="name" />
                        </div>
                    </div>
                    <h1>Multiple Button</h1>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <SelectButton value={multipleButton} options={multipleButtonOptions} onChange={e => setMultipleButton(e.value)} optionLabel="name" multiple />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-col-12">
                <div className="card card-w-title">
                    <h1>Input Groups</h1>
                    <div className="p-grid">
                        <div className="p-col-6">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText placeholder="Username" />
                            </div>
                        </div>
                        <div className="p-col-6">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-shopping-cart"></i>
                                </span>
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-globe"></i>
                                </span>
                                <InputText placeholder="Price" />
                                <span className="p-inputgroup-addon">$</span>
                                <span className="p-inputgroup-addon">.00</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-grid">
                        <div className="p-col-6">
                            <div className="p-inputgroup">
                                <Button label="Search" />
                                <InputText placeholder="Keyword" />
                            </div>
                        </div>
                        <div className="p-col-6">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <Checkbox checked={inputGroupCheck} onChange={(e) => setInputGroupCheck(!inputGroupCheck)} />
                                </span>
                                <InputText placeholder="Confirm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}