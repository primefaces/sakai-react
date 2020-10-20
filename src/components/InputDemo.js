import React, { useEffect, useState } from "react";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
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
import { InputNumber } from 'primereact/inputnumber';
import { CountryService } from '../service/CountryService';
import './InputDemo.scss';


export function InputDemo() {
    const [sliderValue, setSliderValue] = useState('');
    const [ratingValue, setRatingValue] = useState(0);
    const [color, setColor] = useState('1976D2');
    const [inputSwitch, setInputSwitch] = useState(false);
    const [toggleCheck, setToggleCheck] = useState(false);
    const [listBoxCountry, setListBoxCountry] = useState(null)
    const [dropdownCountry, setDropdownCountry] = useState(null)
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [filteredCountries, setFilteredCountries] = useState(null);
    const [multiSelectedCountries, setMultiSelectedCountries] = useState(null);
    const [city, setCity] = useState(null);
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [checkbox3, setCheckbox3] = useState(false);
    const [inputNumber, setnputNumber] = useState(0);
    const [selectButton, setSelectButton] = useState(null);
    const [multipleButton, setMultipleButton] = useState(null);
    const [inputGroupCheck, setInputGroupCheck] = useState(false);
    const countryService = new CountryService();

    useEffect(() => {
        countryService.getCountries().then(data => setCountries(data));
    }, [])

    const searchCountry = (event) => {
        setTimeout(() => {
            let filteredCountries;
            if (!event.query.trim().length) {
                filteredCountries = [...countries];
            }
            else {
                filteredCountries = countries.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            setFilteredCountries(filteredCountries);
        }, 250);
    }

    const singleCountries = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ]

    const multiSelectCountries = [
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

    const countryTemplate = (option) => {
        return (
            <div className="country-item">
                <img alt={option.name} src="assets/layout/flags/flag_placeholder.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${option.code.toLowerCase()}`} />
                <div>{option.name}</div>
            </div>
        );
    }
    const selectedCountriesTemplate = (option) => {
        if (option) {
            return (
                <div className="country-item country-item-value">
                    <img alt={option.name} src="assets/layout/flags/flag_placeholder.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${option.code.toLowerCase()}`} />
                    <div>{option.name}</div>
                </div>
            );
        }

        return "Select Countries";
    }

    return (
        <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
                <div className="card">
                    <h5>InputText</h5>
                    <div className="p-grid p-formgrid">
                        <div className="p-col-12 p-mb-2 p-lg-4 p-mb-lg-0">
                            <InputText placeholder="Default" />
                        </div>
                        <div className="p-col-12 p-mb-2 p-lg-4 p-mb-lg-0">
                            <InputText placeholder="Disabled" disabled={true} />
                        </div>
                        <div className="p-col-12 p-mb-2 p-lg-4 p-mb-lg-0">
                            <InputText placeholder="Invalid" className="p-error" />
                        </div>
                    </div>
                    <h5>Icons</h5>
                    <div className="p-grid p-formgrid">
                        <div className="p-col-12 p-mb-2 p-lg-4 p-mb-lg-0">
                            <span className="p-input-icon-left">
                                <i className="pi pi-user" />
                                <InputText placeholder="Username" />
                            </span>
                        </div>
                        <div className="p-col-12 p-mb-2 p-lg-4 p-mb-lg-0">
                            <span className="p-input-icon-right">
                                <i className="pi pi-search" />
                                <InputText placeholder="Search" />
                            </span>
                        </div>
                        <div className="p-col-12 p-mb-2 p-lg-4 p-mb-lg-0">
                            <span className="p-input-icon-left p-input-icon-right">
                                <i className="pi pi-user" />
                                <i className="pi pi-search" />
                                <InputText placeholder="Search" />
                            </span>
                        </div>
                    </div>
                    <h5>Float Label</h5>
                    <span className="p-float-label">
                        <InputText id="username" type="text" v-model="floatValue" />
                        <label htmlFor="username">Username</label>
                    </span>
                    <h5>Textarea</h5>
                    <InputTextarea rows={3} cols={30} placeholder="Your Message" autoResize={true} />
                    <h5>AutoComplete</h5>
                    <AutoComplete placeholder="Search" value={selectedCountry} suggestions={filteredCountries} completeMethod={searchCountry} field="name" dropdown onChange={(e) => setSelectedCountry(e.value)} />
                    <h5>Calender</h5>
                    <Calendar id="icon" showIcon />
                    <h5>Input Number</h5>
                    <InputNumber id="minmax-buttons" value={inputNumber} onValueChange={(e) => setnputNumber(e.value)} mode="decimal" showButtons min={0} max={100} />
                    <h5>Chips</h5>
                    <Chips />
                </div>

                <div className="card">
                    <h5>Slider</h5>
                    <InputText value={sliderValue} onChange={e => setSliderValue(e.target.value)} />
                    <Slider value={sliderValue} onChange={e => setSliderValue(e.value)} />
                    <h5>Rating</h5>
                    <Rating value={ratingValue} onChange={e => setRatingValue(e.value)} />
                    <h5>ColorPicker</h5>
                    <ColorPicker value={color} onChange={e => setColor(e.value)} />
                </div>
            </div>

            <div className="p-col-12 p-md-6">
                <div className="card">
                    <h5>RadioButton</h5>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-4 ">
                            <div className="p-field-radiobutton">
                                <RadioButton name="rb" inputId="rb1" value="Chicago" onChange={e => setCity(e.value)} checked={city === 'Chicago'} />
                                <label htmlFor="rb1" className="p-radiobutton-label">Chicago</label>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="p-field-radiobutton">
                                <RadioButton name="rb" inputId="rb2" value='Los Angeles' onChange={e => setCity(e.value)} checked={city === 'Los Angeles'} />
                                <label htmlFor="rb2" className="p-radiobutton-label">Los Angeles</label>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="p-field-radiobutton">
                                <RadioButton name="rb" inputId="rb3" value='New York' onChange={e => setCity(e.value)} checked={city === 'New York'} />
                                <label htmlFor="rb3" className="p-radiobutton-label">New York</label>
                            </div>
                        </div>
                    </div>
                    <h5 style={{ marginTop: '0' }}>Checkbox</h5>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-4 ">
                            <div className="p-field-checkbox">
                                <Checkbox checked={checkbox1} inputId="cb1" onChange={e => setCheckbox1(e.checked)} />
                                <label htmlFor="cb1" className="p-checkbox-label">Chicago</label>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="p-field-checkbox">
                                <Checkbox checked={checkbox2} inputId="cb2" onChange={e => setCheckbox2(e.checked)} />
                                <label htmlFor="cb2" className="p-checkbox-label">Los Angeles</label>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="p-field-checkbox">
                                <Checkbox checked={checkbox3} inputId="cb3" onChange={e => setCheckbox3(e.checked)} />
                                <label htmlFor="cb3" className="p-checkbox-label">New York</label>
                            </div>
                        </div>
                    </div>
                    <h5 style={{ marginTop: '0' }}>Input Switch</h5>
                    <InputSwitch checked={inputSwitch} onChange={e => setInputSwitch(e.value)} />
                </div>
                <div className="multiselect-demo">
                    <div className="card">
                        <h5>Listbox</h5>
                        <ListBox value={listBoxCountry} options={singleCountries} onChange={e => setListBoxCountry(e.value)} filter optionLabel="name" />
                        <h5>Dropdown</h5>
                        <Dropdown value={dropdownCountry} options={singleCountries} onChange={e => setDropdownCountry(e.value)} optionLabel="name" placeholder="Select" />
                        <h5> MultiSelect</h5>
                        <MultiSelect value={multiSelectedCountries} options={multiSelectCountries} selectedItemTemplate={selectedCountriesTemplate} itemTemplate={countryTemplate} onChange={e => setMultiSelectedCountries(e.value)} optionLabel="name" placeholder="Select Countries" filter className="multiselect-custom" />
                    </div>
                    <div className="card">
                        <h5> ToggleButton</h5>
                        <ToggleButton checked={toggleCheck} onChange={e => setToggleCheck(e.value)} />
                        <h5>SelectButton</h5>
                        <SelectButton value={selectButton} options={selectButtonOptions} onChange={e => setSelectButton(e.value)} optionLabel="name" />
                        <h5>MultipleButton</h5>

                        <SelectButton value={multipleButton} options={multipleButtonOptions} onChange={e => setMultipleButton(e.value)} optionLabel="name" multiple />
                    </div>
                </div>
            </div>
            <div className="p-col-12">
                <div className="card">
                    <h5>Input Groups</h5>
                    <div className="p-grid p-fluid">
                        <div className="p-col-12 p-md-6">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText placeholder="Username" />
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6">
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

                        <div className="p-col-12 p-md-6">
                            <div className="p-inputgroup">
                                <Button label="Search" />
                                <InputText placeholder="Keyword" />
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6">
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