import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import { Slider } from 'primereact/slider';
import { Knob } from 'primereact/knob';
import { Rating } from 'primereact/rating';
import { ColorPicker } from 'primereact/colorpicker';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { MultiSelect } from 'primereact/multiselect';
import { TreeSelect } from 'primereact/treeselect';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { CountryService } from '../../../demo/service/CountryService';
import { NodeService } from '../../../demo/service/NodeService';

export const InputDemo = () => {
    const [floatValue, setFloatValue] = useState('');
    const [autoValue, setAutoValue] = useState(null);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [calendarValue, setCalendarValue] = useState(null);
    const [inputNumberValue, setInputNumberValue] = useState(null);
    const [chipsValue, setChipsValue] = useState([]);
    const [sliderValue, setSliderValue] = useState('');
    const [ratingValue, setRatingValue] = useState(null);
    const [colorValue, setColorValue] = useState('1976D2');
    const [knobValue, setKnobValue] = useState(20);
    const [radioValue, setRadioValue] = useState(null);
    const [checkboxValue, setCheckboxValue] = useState([]);
    const [switchValue, setSwitchValue] = useState(false);
    const [listboxValue, setListboxValue] = useState(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [multiselectValue, setMultiselectValue] = useState(null);
    const [toggleValue, setToggleValue] = useState(false);
    const [selectButtonValue1, setSelectButtonValue1] = useState(null);
    const [selectButtonValue2, setSelectButtonValue2] = useState(null);
    const [inputGroupValue, setInputGroupValue] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [treeSelectNodes, setTreeSelectNodes] = useState(null);

    const listboxValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    const dropdownValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    const multiselectValues = [
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

    const selectButtonValues1 = [
        { name: 'Option 1', code: 'O1' },
        { name: 'Option 2', code: 'O2' },
        { name: 'Option 3', code: 'O3' }
    ];

    const selectButtonValues2 = [
        { name: 'Option 1', code: 'O1' },
        { name: 'Option 2', code: 'O2' },
        { name: 'Option 3', code: 'O3' }
    ];

    useEffect(() => {
        const countryService = new CountryService();
        const nodeService = new NodeService();
        countryService.getCountries().then((data) => setAutoValue(data));
        nodeService.getTreeNodes().then((data) => setTreeSelectNodes(data));
    }, []);

    const searchCountry = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredValue([...autoValue]);
            } else {
                setAutoFilteredValue(
                    autoValue.filter((country) => {
                        return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                    })
                );
            }
        }, 250);
    };

    const onCheckboxChange = (e) => {
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
    };

    const itemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px', height: '12px' }} />
                <span>{option.name}</span>
            </div>
        );
    };

    return (
        <div className="grid p-fluid">
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>InputText</h5>
                    <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <InputText type="text" placeholder="Default"></InputText>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <InputText type="text" placeholder="Disabled" disabled></InputText>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <InputText type="text" placeholder="Invalid" className="p-invalid" />
                        </div>
                    </div>

                    <h5>Icons</h5>
                    <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <span className="p-input-icon-left">
                                <i className="pi pi-user" />
                                <InputText type="text" placeholder="Username" />
                            </span>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <span className="p-input-icon-right">
                                <InputText type="text" placeholder="Search" />
                                <i className="pi pi-search" />
                            </span>
                        </div>
                        <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                            <span className="p-input-icon-left p-input-icon-right">
                                <i className="pi pi-user" />
                                <InputText type="text" placeholder="Search" />
                                <i className="pi pi-search" />
                            </span>
                        </div>
                    </div>

                    <h5>Float Label</h5>
                    <span className="p-float-label">
                        <InputText id="username" type="text" value={floatValue} onChange={(e) => setFloatValue(e.target.value)} />
                        <label htmlFor="username">Username</label>
                    </span>

                    <h5>Textarea</h5>
                    <InputTextarea placeholder="Your Message" autoResize rows="3" cols="30" />

                    <h5>AutoComplete</h5>
                    <AutoComplete placeholder="Search" id="dd" dropdown multiple value={selectedAutoValue} onChange={(e) => setSelectedAutoValue(e.value)} suggestions={autoFilteredValue} completeMethod={searchCountry} field="name" />

                    <h5>Calendar</h5>
                    <Calendar showIcon showButtonBar value={calendarValue} onChange={(e) => setCalendarValue(e.value)}></Calendar>

                    <h5>InputNumber</h5>
                    <InputNumber value={inputNumberValue} onValueChange={(e) => setInputNumberValue(e.value)} showButtons mode="decimal"></InputNumber>

                    <h5>Chips</h5>
                    <Chips value={chipsValue} onChange={(e) => setChipsValue(e.value)} />
                </div>

                <div className="card">
                    <div className="grid">
                        <div className="col-12">
                            <h5>Slider</h5>
                            <InputText value={sliderValue} onChange={(e) => setSliderValue(parseInt(e.target.value), 10)} />
                            <Slider value={sliderValue} onChange={(e) => setSliderValue(e.value)} />
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Rating</h5>
                            <Rating value={ratingValue} onChange={(e) => setRatingValue(e.value)} />
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>ColorPicker</h5>
                            <ColorPicker value={colorValue} onChange={(e) => setColorValue(e.value)} style={{ width: '2rem' }} />
                        </div>
                        <div className="col-12">
                            <h5>Knob</h5>
                            <Knob value={knobValue} valueTemplate={'{value}%'} onChange={(e) => setKnobValue(e.value)} step={10} min={-50} max={50} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>RadioButton</h5>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="option1" name="option" value="Chicago" checked={radioValue === 'Chicago'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="option1">Chicago</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="option2" name="option" value="Los Angeles" checked={radioValue === 'Los Angeles'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="option2">Los Angeles</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-radiobutton">
                                <RadioButton inputId="option3" name="option" value="New York" checked={radioValue === 'New York'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="option3">New York</label>
                            </div>
                        </div>
                    </div>

                    <h5>Checkbox</h5>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="option" value="Chicago" checked={checkboxValue.indexOf('Chicago') !== -1} onChange={onCheckboxChange} />
                                <label htmlFor="checkOption1">Chicago</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption2" name="option" value="Los Angeles" checked={checkboxValue.indexOf('Los Angeles') !== -1} onChange={onCheckboxChange} />
                                <label htmlFor="checkOption2">Los Angeles</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption3" name="option" value="New York" checked={checkboxValue.indexOf('New York') !== -1} onChange={onCheckboxChange} />
                                <label htmlFor="checkOption3">New York</label>
                            </div>
                        </div>
                    </div>

                    <h5>Input Switch</h5>
                    <InputSwitch checked={switchValue} onChange={(e) => setSwitchValue(e.value)} />
                </div>

                <div className="card">
                    <h5>Listbox</h5>
                    <ListBox value={listboxValue} onChange={(e) => setListboxValue(e.value)} options={listboxValues} optionLabel="name" filter />

                    <h5>Dropdown</h5>
                    <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" />

                    <h5>MultiSelect</h5>
                    <MultiSelect
                        value={multiselectValue}
                        onChange={(e) => setMultiselectValue(e.value)}
                        options={multiselectValues}
                        optionLabel="name"
                        placeholder="Select Countries"
                        filter
                        display="chip"
                        itemTemplate={itemTemplate} />

                    <h5>TreeSelect</h5>
                    <TreeSelect value={selectedNode} onChange={(e) => setSelectedNode(e.value)} options={treeSelectNodes} placeholder="Select Item"></TreeSelect>
                </div>

                <div className="card">
                    <h5>ToggleButton</h5>
                    <ToggleButton checked={toggleValue} onChange={(e) => setToggleValue(e.value)} onLabel="Yes" offLabel="No" />

                    <h5>SelectButton</h5>
                    <SelectButton value={selectButtonValue1} onChange={(e) => setSelectButtonValue1(e.value)} options={selectButtonValues1} optionLabel="name" />

                    <h5>SelectButton - Multiple</h5>
                    <SelectButton value={selectButtonValue2} onChange={(e) => setSelectButtonValue2(e.value)} options={selectButtonValues2} optionLabel="name" multiple />
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <h5>Input Groups</h5>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText placeholder="Username" />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
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

                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <Button label="Search" />
                                <InputText placeholder="Keyword" />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon p-inputgroup-addon-checkbox">
                                    <Checkbox checked={inputGroupValue} onChange={(e) => setInputGroupValue(e.checked)} binary="true" />
                                </span>
                                <InputText placeholder="Confirm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputDemo;
