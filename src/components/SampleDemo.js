import React, { Component } from 'react';
import {CountryService} from '../service/CountryService';
import {CarService} from '../service/CarService';
import {NodeService} from '../service/NodeService';
import {InputText} from 'primereact/components/inputtext/InputText';
import {InputTextarea} from 'primereact/components/inputtextarea/InputTextarea';
import {AutoComplete} from 'primereact/components/autocomplete/AutoComplete';
import {MultiSelect} from 'primereact/components/multiselect/MultiSelect';
import {Calendar} from 'primereact/components/calendar/Calendar';
import {DataTable} from 'primereact/components/datatable/DataTable';
import {DataGrid} from 'primereact/components/datagrid/DataGrid';
import {Tree} from 'primereact/components/tree/Tree';
import {Checkbox} from 'primereact/components/checkbox/Checkbox';
import {Menu} from 'primereact/components/menu/Menu';
import {PanelMenu} from 'primereact/components/panelmenu/PanelMenu';
import {InputMask} from 'primereact/components/inputmask/InputMask';
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import {Password} from 'primereact/components/password/Password';
import {Spinner} from 'primereact/components/spinner/Spinner';
import {Slider} from 'primereact/components/slider/Slider';
import {ListBox} from 'primereact/components/listbox/ListBox';
import {RadioButton} from 'primereact/components/radiobutton/RadioButton';
import {PickList} from 'primereact/components/picklist/PickList';
import {OrderList} from 'primereact/components/orderlist/OrderList';
import {ToggleButton} from 'primereact/components/togglebutton/ToggleButton';
import {SelectButton} from 'primereact/components/selectbutton/SelectButton';
import {Button} from 'primereact/components/button/Button';
import {SplitButton} from 'primereact/components/splitbutton/SplitButton';
import {Accordion,AccordionTab} from 'primereact/components/accordion/Accordion';
import {Panel} from 'primereact/components/panel/Panel';
import {ProgressBar} from 'primereact/components/progressbar/ProgressBar';
import {Dialog} from 'primereact/components/dialog/Dialog';
import {Column} from 'primereact/components/column/Column';

export class SampleDemo extends Component {

    constructor() {
        super();
        this.state = {
            countriesData: [],
            carOptions: [],
            checkboxValue: [],
            dialogValue: false,
            dataTableValue: [],
            dataGridValue: [],
            treeData: [],
            picklistSourceCars: [],
            picklistTargetCars: [],
            orderlistCars: []
        };
        this.countryService = new CountryService();
        this.carService = new CarService();
        this.nodeService = new NodeService();
        this.onDropdownChange = this.onDropdownChange.bind(this);
        this.onSpinnerChange = this.onSpinnerChange.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onMultiSelectCarChange = this.onMultiSelectCarChange.bind(this);
        this.onToggleChange = this.onToggleChange.bind(this);
        this.onSelectButtonChange = this.onSelectButtonChange.bind(this);
        this.onListBoxChange = this.onListBoxChange.bind(this);
        this.dataGridTemplate = this.dataGridTemplate.bind(this);
        this.orderListTemplate = this.orderListTemplate.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);
    }

    componentDidMount(){
        this.setState({countriesData: this.countryService.getCountries(this)});
        this.carService.getCarsSmall().then(data => this.setState({dataTableValue: data}));
        this.carService.getCarsLarge().then(data => this.setState({dataGridValue: data}));
        this.nodeService.getFiles(this).then(files => this.setState({treeData: files}));
        this.carService.getCarsSmall().then(data => this.setState({picklistSourceCars: data}));
        this.carService.getCarsSmall().then(data => this.setState({orderlistCars: data}));
    }

    onCountryValueChange(e) {
        this.setState({ country: e.value, filteredCountries: null });
    }

    filterCountry(event) {
        let results = this.state.countriesData.filter((country) => {
            return country.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({ filteredCountries: results });
    }

    onDropdownChange(event){
        this.setState({dropdownCity: event.value})
    }

    onSpinnerChange(event){
        this.setState({spinnerValue: event.value})
    }

    onCheckboxChange(event){
        var selected = [...this.state.checkboxValue];
        if(event.checked)
            selected.push(event.value);
        else
            selected.splice(selected.indexOf(event.value), 1);

        this.setState({checkboxValue: selected});

    }

    onRadioChange(event){
        this.setState({radioValue: event.value})
    }

    onSliderChange(event){
        this.setState({sliderValue:event.value})
    }

    onMultiSelectCarChange(e) {
        this.setState({carOptions: e.value});
    }

    onToggleChange(event){
        this.setState({toggleButtonValue: event.value})
    }

    onSelectButtonChange(event){
        this.setState({types: event.value})
    }

    onListBoxChange(e) {
        this.setState({listBoxCity: e.value});
    }

    dataGridTemplate(car) {
        if (!car) {
            return;
        }

        return (
            <div style={{padding: '3px'}} className="ui-g-12 ui-md-4">
                <Panel header={car.vin} style={{ textAlign: 'center' }}>
                    <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} style={{width: '75%'}}/>
                    <div className="car-detail">{car.year} - {car.color}</div>
                </Panel>
            </div>
        );
    }

    orderListTemplate(car){
        if (!car) {
            return;
        }

        return (
            <div className="ui-helper-clearfix">
                <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} style={{display:'inline-block',margin:'2px 0 2px 2px', width: '50px'}}/>
                <div style={{fontSize:14,float:'right',margin:'15px 5px 0 0'}}>{car.brand} - {car.year} - {car.color}</div>
            </div>
        );
    }

    render(){

        let carOptions=[
            {label: 'Audi', value: 'Audi'},
            {label: 'BMW', value: 'BMW'},
            {label: 'Fiat', value: 'Fiat'},
            {label: 'Honda', value: 'Honda'},
            {label: 'Jaguar', value: 'Jaguar'},
            {label: 'Mercedes', value: 'Mercedes'},
            {label: 'Renault', value: 'Renault'},
            {label: 'VW', value: 'VW'},
            {label: 'Volvo', value: 'Volvo'}
        ];

        let cities = [
            {label: 'Select City', value: null},
            {label: 'New York', value: 'New York'},
            {label: 'Rome', value: 'Rome'},
            {label: 'London', value: 'London'},
            {label: 'Istanbul', value: 'Istanbul'},
            {label: 'Paris', value: 'Paris'},
        ];

        let listBoxCities = cities.slice(1,6);

        let types = [
            {label: 'Apartment', value: 'Apartment'},
            {label: 'House', value: 'House'},
            {label: 'Studio', value: 'Studio'}
        ];

        let splitButtonItems = [
            {label: 'Update', icon: 'fa-refresh'},
            {label: 'Delete', icon: 'fa-close'},
            {label: 'Home', icon: 'fa-home', url: 'http://www.primefaces.org/primereact'}
        ];

        let dialogFooter= <div className="ui-dialog-buttonpane ui-helper-clearfix">
                    <Button label="Login" icon="fa-user" onClick={()=>this.setState({dialogValue:false})}/>
                </div>;

        let menuItems = [
            {
                label: 'File',
                items: [
                    {label: 'New', icon: 'fa-plus'},
                    {label: 'Open', icon: 'fa-external-link-square'}
                ]
            },
            {
                label: 'Edit',
                items: [
                    {label: 'Undo', icon: 'fa-undo'},
                    {label: 'Redo', icon: 'fa-repeat'}
                ]
            }
        ];

        let panelMenuItems = [
            {
                label: 'File',
                icon: 'fa-file-o',
                items: [{
                        label: 'New', 
                        icon: 'fa-plus',
                        items: [
                            {label: 'Project'},
                            {label: 'Other'},
                        ]
                    },
                    {label: 'Open'},
                    {label: 'Quit'}
                ]
            },
            {
                label: 'Edit',
                icon: 'fa-edit',
                items: [
                    {label: 'Undo', icon: 'fa-mail-forward'},
                    {label: 'Redo', icon: 'fa-mail-reply'}
                ]
            },
            {
                label: 'Help',
                icon: 'fa-question',
                items: [
                    {
                        label: 'Contents'
                    },
                    {
                        label: 'Search', 
                        icon: 'fa-search', 
                        items: [
                            {
                                label: 'Text', 
                                items: [
                                    {
                                        label: 'Workspace'
                                    }
                                ]
                            },
                            {
                                label: 'File'
                            }
                    ]}
                ]
            },
            {
                label: 'Actions',
                icon: 'fa-gear',
                items: [
                    {
                        label: 'Edit',
                        icon: 'fa-refresh',
                        items: [
                            {label: 'Save', icon: 'fa-save'},
                            {label: 'Update', icon: 'fa-save'},
                        ]
                    },
                    {
                        label: 'Other',
                        icon: 'fa-phone',
                        items: [
                            {label: 'Delete', icon: 'fa-minus'}
                        ]
                    }
                ]
            }
        ];

        return <div className="ui-fluid">
            <div className="ui-g">
                <div className="ui-g-12">
                    <div className="card card-w-title">
                        <h1>Form Elements</h1>
                        <div className="ui-g form-group">
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="input">Input</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <InputText id="input" />
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="textarea">Textarea</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <InputTextarea id="textarea" rows={3} cols={30} autoResize={true}></InputTextarea>
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="calendar">Calendar</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <Calendar id="calendar"></Calendar>
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="autocomplete">AutoComplete</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <AutoComplete minLength={1} placeholder="Countries" id="autocomplete" field="name" suggestions={this.state.filteredCountries}
                                              completeMethod={this.filterCountry.bind(this)} value={this.state.country}
                                              onChange={this.onCountryValueChange.bind(this)}
                                />
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="dropdown">Dropdown</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <Dropdown options={cities} value={this.state.dropdownCity} onChange={this.onDropdownChange} autoWidth={false}/>
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <Password id="password" />
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="mask">Mask</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <InputMask id="mask" mask="99/99/9999" slotChar="dd/mm/yyyy" placeholder="Date" />
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="spinner">Spinner</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <Spinner value={this.state.spinnerValue} onChange={this.onSpinnerChange}/>
                            </div>

                            <div className="ui-g-12 ui-md-2">
                                Checkbox
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <div className="ui-g">
                                    <div className="ui-g-12">
                                        <Checkbox value="Ultima" inputId="cb1" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Ultima')>-1?true:false}/>
                                        <label htmlFor="cb1">Ultima</label>
                                    </div>
                                    <div className="ui-g-12">
                                        <Checkbox value="Icarus" inputId="cb2" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Icarus')>-1?true:false}/>
                                        <label htmlFor="cb2">Icarus</label>
                                    </div>
                                    <div className="ui-g-12">
                                        <Checkbox value="Omega" inputId="cb3" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Omega')>-1?true:false}/>
                                        <label htmlFor="cb3">Omega</label>
                                    </div>
                                </div>
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                RadioButton
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <div className="ui-g">
                                    <div className="ui-g-12">
                                        <RadioButton value="Ultima" inputId="rb1" onChange={this.onRadioChange} checked={this.state.radioValue === "Ultima"}/>
                                        <label htmlFor="rb1">Ultima</label>
                                    </div>
                                    <div className="ui-g-12">
                                        <RadioButton value="Icarus" inputId="rb2" onChange={this.onRadioChange} checked={this.state.radioValue === "Icarus"}/>
                                        <label htmlFor="rb2">Icarus</label>
                                    </div>
                                    <div className="ui-g-12">
                                        <RadioButton value="Omega" inputId="rb3" onChange={this.onRadioChange} checked={this.state.radioValue === "Omega"}/>
                                        <label htmlFor="rb3">Omega</label>
                                    </div>
                                </div>
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="slider">Slider</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <Slider id="slider" onChange={this.onSliderChange}/>
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                Button
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <Button label="Edit" icon="fa-pencil" />
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                SplitButton
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <SplitButton label="Save" icon="fa-check" model={splitButtonItems}/>
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="multiselect">MultiSelect</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <MultiSelect id="multiselect" value={this.state.carOptions} options={carOptions} onChange={this.onMultiSelectCarChange}/>
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                ToggleButton
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <ToggleButton checked={this.state.toggleButtonValue} onChange={this.onToggleChange}/>
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                SelectButton
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <SelectButton value={this.state.types} options={types} onChange={this.onSelectButtonChange}/>
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                <label htmlFor="listbox">ListBox</label>
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <ListBox value={this.state.listBoxCity} options={listBoxCities} onChange={this.onListBoxChange} filter={true} />
                            </div>
                            <div className="ui-g-12 ui-md-2">
                                Dialog
                            </div>
                            <div className="ui-g-12 ui-md-4">
                                <Button label="Login" icon="fa-external-link" onClick={()=>this.setState({dialogValue:true})}/>
                            </div>
                        </div>

                        <Dialog header="Login" visible={this.state.dialogValue} footer={dialogFooter} onHide={()=>this.setState({dialogValue:false})}>
                            <div className="ui-g form-group" style={{marginBottom: 16}}>
                                <div className="ui-g-12">
                                    <InputText placeholder="Username" />
                                </div>
                                <div className="ui-g-12">
                                    <InputText placeholder="Password" />
                                </div>
                            </div>
                        </Dialog>
                    </div>

                    <div className="card card-w-title">
                        <h1>DataTable</h1>
                        <DataTable value={this.state.dataTableValue} selectionMode="single" header="DataTable" selection={this.state.dataTableSelectValue}
                                   onSelectionChange={(e) => this.setState({dataTableSelectValue: e.data})}>
                            <Column field="vin" header="Vin" sortable={true}/>
                            <Column field="year" header="Year" sortable={true}/>
                            <Column field="brand" header="Brand" sortable={true}/>
                            <Column field="color" header="Color" sortable={true}/>
                        </DataTable>
                    </div>
                </div>
                <div className="ui-g-12 ui-lg-6">
                    <div className="card card-w-title">
                        <h1>DataGrid</h1>
                        <DataGrid value={this.state.dataGridValue} itemTemplate={this.dataGridTemplate} paginator={true} rows={18} header='List of Cars' />
                    </div>

                    <div className="card card-w-title">
                        <h1>Tree</h1>
                        <Tree value={this.state.treeData}/>
                    </div>

                    <div className="card card-w-title">
                        <h1>Menu</h1>
                        <Menu model={menuItems}/>
                    </div>

                    <div className="card card-w-title">
                        <h1>PanelMenu</h1>
                        <PanelMenu model={panelMenuItems}/>
                    </div>

                    <div className="card card-w-title">
                        <h1>Heading 1</h1>

                        <h2>Heading 2</h2>

                        <h3>Heading 3</h3>

                        <h4>Heading 4</h4>
                    </div>
                </div>
                <div className="ui-g-12 ui-lg-6">
                    {/* Right Side */}
                    <div className="card card-w-title">
                        <h1>PickList</h1>
                        <PickList source={this.state.picklistSourceCars} target={this.state.picklistTargetCars} sourceHeader="Available" targetHeader="Selected"
                                  responsive={true} itemTemplate={(car)=><span>{car.brand}</span>} 
                                  onChange={(e) => this.setState({picklistSourceCars: e.source, picklistTargetCars: e.target})}/>
                    </div>

                    <div className="card card-w-title">
                        <h1>OrderList</h1>
                        <OrderList value={this.state.orderlistCars} responsive={true} header="OrderList" listStyle={{height:250}}
                                   itemTemplate={this.orderListTemplate}
                                   onChange={(e) => this.setState({orderlistCars: e.value})}/>
                    </div>

                    <div className="card card-w-title">
                        <h1>Accordion Panel</h1>
                        <Accordion>
                            <AccordionTab header="Godfather I">
                                The story begins as Don Vito Corleone, the head of a New York Mafia family, oversees his daughters wedding.
                                His beloved son Michael has just come home from the war, but does not intend to become part of his fathers business.
                                Through Michaels life the nature of the family business becomes clear. The business of the family is just like the head
                                of the family, kind and benevolent to those who give respect,
                                but given to ruthless violence whenever anything stands against the good of the family.
                            </AccordionTab>
                            <AccordionTab header="Godfather II">
                                Francis Ford Coppolas legendary continuation and sequel to his landmark 1972 film, The_Godfather parallels the young
                                Vito Corleone's rise with his son Michael's spiritual fall, deepening The_Godfathers depiction of the dark side of
                                the American dream. In the early 1900s, the child Vito flees his Sicilian village for America after the local Mafia kills his family.
                                Vito struggles to make a living, legally or illegally, for his wife and growing brood in Little Italy, killing the local Black Hand
                                Fanucci after he demands his customary cut of the tyro's business. With Fanucci gone, Vito's communal stature grows.
                            </AccordionTab>
                            <AccordionTab header="Godfather III">
                                After a break of more than 15 years, director Francis Ford Coppola and writer Mario Puzo returned to the well for this
                                third and final story of the fictional Corleone crime family. Two decades have passed, and crime kingpin Michael Corleone,
                                now divorced from his wife Kay has nearly succeeded in keeping his promise that his family would one day be completely legitimate.
                            </AccordionTab>
                        </Accordion>
                    </div>

                    <div className="card card-w-title">
                        <h1>Panel</h1>
                        <Panel header="Godfather I" toggleable={true}>
                            The story begins as Don Vito Corleone, the head of a New York Mafia family, oversees his daughter's wedding.
                            His beloved son Michael has just come home from the war, but does not intend to become part of his father's business.
                            Through Michael's life the nature of the family business becomes clear. The business of the family is just like the head of the family,
                            kind and benevolent to those who give respect, but given to ruthless violence whenever anything stands against the good of the family.
                        </Panel>
                    </div>

                    <div className="card card-w-title">
                        <h1>ProgressBar - Static Display</h1>
                        <ProgressBar value={50}/>
                    </div>
                </div>
            </div>
        </div>
    }
}