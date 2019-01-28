import React, {Component} from 'react';
import {CountryService} from '../service/CountryService';
import {CarService} from '../service/CarService';
import {NodeService} from '../service/NodeService';
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import {AutoComplete} from 'primereact/autocomplete';
import {MultiSelect} from 'primereact/multiselect';
import {Calendar} from 'primereact/calendar';
import {DataTable} from 'primereact/datatable';
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {Tree} from 'primereact/tree';
import {Checkbox} from 'primereact/checkbox';
import {Menu} from 'primereact/menu';
import {PanelMenu} from 'primereact/panelmenu';
import {InputMask} from 'primereact/inputmask';
import {Dropdown} from 'primereact/dropdown';
import {Password} from 'primereact/password';
import {Spinner} from 'primereact/spinner';
import {Slider} from 'primereact/slider';
import {ListBox} from 'primereact/listbox';
import {RadioButton} from 'primereact/radiobutton';
import {PickList} from 'primereact/picklist';
import {OrderList} from 'primereact/orderlist';
import {ToggleButton} from 'primereact/togglebutton';
import {SelectButton} from 'primereact/selectbutton';
import {Button} from 'primereact/button';
import {SplitButton} from 'primereact/splitbutton';
import {Accordion,AccordionTab} from 'primereact/accordion';
import {Panel} from 'primereact/panel';
import {TabView, TabPanel} from 'primereact/tabview';
import {ProgressBar} from 'primereact/progressbar';
import {Dialog} from 'primereact/dialog';
import {Column} from 'primereact/column';

export class SampleDemo extends Component {

    constructor() {
        super();
        this.state = {
            date: null,
            country: null,
            filteredCountries: null,
            countriesData: [],
            dropdownCity: null,
			selectedNodeKey: null,
            cities: [
                {label: 'Select City', value: null},
                {label: 'New York', value: 'New York'},
                {label: 'Rome', value: 'Rome'},
                {label: 'London', value: 'London'},
                {label: 'Istanbul', value: 'Istanbul'},
                {label: 'Paris', value: 'Paris'},
            ],
            spinnerValue: null,
            checkboxValue: [],
            radioValue: null,
            sliderValue: null,
            toggleButtonValue: null,
            dialogVisible: false,
            dataTableValue: [],
            dataTableSelection: null,
            dataViewValue: [],
            treeData: [],
            picklistSourceCars: [],
            picklistTargetCars: [],
            orderlistCars: [],
            layout: 'list',
            selectedCars: [],
            carOptions: [
                {label: 'Audi', value: 'Audi'},
                {label: 'BMW', value: 'BMW'},
                {label: 'Fiat', value: 'Fiat'},
                {label: 'Honda', value: 'Honda'},
                {label: 'Jaguar', value: 'Jaguar'},
                {label: 'Mercedes', value: 'Mercedes'},
                {label: 'Renault', value: 'Renault'},
                {label: 'VW', value: 'VW'},
                {label: 'Volvo', value: 'Volvo'}
            ],
            listBoxCity: null,
            listBoxCities: [
                {label: 'Madrid', value: 'Madrid'},
                {label: 'Geneva', value: 'Geneva'},
                {label: 'Los Angeles', value: 'Los Angeles'},
                {label: 'Monaco', value: 'Monaco'},
                {label: 'Berlin', value: 'Berlin'}
            ],
            selectedType: null,
            types: [
                {label: 'Apartment', value: 'Apartment'},
                {label: 'House', value: 'House'},
                {label: 'Studio', value: 'Studio'}
            ],    
            splitButtonItems: [
                {label: 'Update', icon: 'pi pi-refresh'},
                {label: 'Delete', icon: 'pi pi-times'},
                {label: 'Home', icon: 'pi pi-home', url: 'http://www.primefaces.org/primereact'}
            ],
            menuItems: [
                {
                    label: 'Options',
                    items: [{label: 'New', icon: 'pi pi-fw pi-plus',command:() => window.location.hash="/fileupload"},
                            {label: 'Delete', icon: 'pi pi-fw pi-trash', url: 'http://primetek.com.tr'}]
                }, 
                {
                    label: 'Account',
                    items: [{label: 'Options', icon: 'pi pi-fw pi-cog',command:() => window.location.hash="/"},
                            {label: 'Sign Out', icon: 'pi pi-fw pi-power-off'} ]
                }
            ],
            panelMenuItems: [
                {
                    label:'Documents',
                    icon:'pi pi-fw pi-file',
                    items:[
                       {
                          label:'New',
                          icon:'pi pi-fw pi-plus',
                          items:[
                             {
                                label:'Bookmark',
                                icon:'pi pi-fw pi-bookmark'
                             },
                             {
                                label:'Video',
                                icon:'pi pi-fw pi-video'
                             },
              
                          ]
                       },
                       {
                          label:'Delete',
                          icon:'pi pi-fw pi-trash'
                       },
                       {
                          separator:true
                       },
                       {
                          label:'Export',
                          icon:'pi pi-fw pi-external-link'
                       }
                    ]
                 },
                 {
                    label:'Manage',
                    icon:'pi pi-fw pi-pencil',
                    items:[
                       {
                          label:'Left',
                          icon:'pi pi-fw pi-align-left'
                       },
                       {
                          label:'Right',
                          icon:'pi pi-fw pi-align-right'
                       },
                       {
                          label:'Center',
                          icon:'pi pi-fw pi-align-center'
                       },
                       {
                          label:'Justify',
                          icon:'pi pi-fw pi-align-justify'
                       },
              
                    ]
                 },
                 {
                    label:'Accounts',
                    icon:'pi pi-fw pi-user',
                    items:[
                       {
                          label:'New',
                          icon:'pi pi-fw pi-user-plus',
              
                       },
                       {
                          label:'Delete',
                          icon:'pi pi-fw pi-user-minus',
              
                       },
                       {
                          label:'Search',
                          icon:'pi pi-fw pi-users',
                          items:[
                             {
                                label:'Filter',
                                icon:'pi pi-fw pi-filter',
                                items:[
                                   {
                                      label:'Print',
                                      icon:'pi pi-fw pi-print'
                                   }
                                ]
                             },
                             {
                                icon:'pi pi-fw pi-bars',
                                label:'List'
                             }
                          ]
                       }
                    ]
                 },
                 {
                    label:'Calendar',
                    icon:'pi pi-fw pi-calendar',
                    items:[
                       {
                          label:'Edit',
                          icon:'pi pi-fw pi-pencil',
                          items:[
                             {
                                label:'Save',
                                icon:'pi pi-fw pi-calendar-plus'
                             },
                             {
                                label:'Delete',
                                icon:'pi pi-fw pi-calendar-minus'
                             }
                          ]
                       },
                       {
                          label:'Archieve',
                          icon:'pi pi-fw pi-calendar-times',
                          items:[
                             {
                                label:'Remove',
                                icon:'pi pi-fw pi-calendar-minus'
                             }
                          ]
                       }
                    ]
                 }
            ]
        };

        this.countryService = new CountryService();
        this.carService = new CarService();
        this.nodeService = new NodeService();

        this.onCheckboxChange = this.onCheckboxChange.bind(this);
        this.filterCountry = this.filterCountry.bind(this);
        
        this.dataViewItemTemplate = this.dataViewItemTemplate.bind(this);
        this.orderListTemplate = this.orderListTemplate.bind(this);
    }

    componentDidMount(){
        this.setState({countriesData: this.countryService.getCountries(this)});
        this.carService.getCarsSmall().then(data => this.setState({dataTableValue: data}));
        this.carService.getCarsLarge().then(data => this.setState({dataViewValue: data}));
        this.nodeService.getTreeNodes(this).then(nodes => this.setState({treeData: nodes}));
        this.carService.getCarsSmall().then(data => this.setState({picklistSourceCars: data}));
        this.carService.getCarsSmall().then(data => this.setState({orderlistCars: data}));
    }

    filterCountry(event) {
        const results = this.state.countriesData.filter((country) => {
            return country.name.toLowerCase().startsWith(event.query.toLowerCase());
        });

        this.setState({filteredCountries: results});
    }

    onCheckboxChange(event){
        let selected = [...this.state.checkboxValue];

        if(event.checked)
            selected.push(event.value);
        else
            selected.splice(selected.indexOf(event.value), 1);

        this.setState({checkboxValue: selected});
    }

    orderListTemplate(car){
        if (!car) {
            return;
        }

        return (
            <div className="p-clearfix">
                <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} style={{display:'inline-block',margin:'2px 0 2px 2px', width: '50px'}} />
                <div style={{fontSize:14,float:'right',margin:'15px 5px 0 0'}}>{car.brand} - {car.year} - {car.color}</div>
            </div>
        );
    }

    dataViewItemTemplate(car,layout) {
        if (!car) {
            return;
        }

        let src = "assets/demo/images/car/" + car.brand + ".png";

        if (layout === 'list') {
            return (
                <div className="p-grid" style={{padding: '2em', borderBottom: '1px solid #d9d9d9'}}>
                    <div className="p-col-12 p-md-3">
                        <img src={src} alt={car.brand} />
                    </div>
                    <div className="p-col-12 p-md-8 car-details">
                        <div className="p-grid">
                            <div className="p-col-2 p-sm-6">Vin:</div>
                            <div className="p-col-10 p-sm-6">{car.vin}</div>

                            <div className="p-col-2 p-sm-6">Year:</div>
                            <div className="p-col-10 p-sm-6">{car.year}</div>

                            <div className="p-col-2 p-sm-6">Brand:</div>
                            <div className="p-col-10 p-sm-6">{car.brand}</div>

                            <div className="p-col-2 p-sm-6">Color:</div>
                            <div className="p-col-10 p-sm-6">{car.color}</div>
                        </div>
                    </div>

                    <div className="p-col-12 p-md-1 search-icon" style={{marginTop:'40px'}}>
                        <Button icon="pi pi-search"></Button>
                    </div>
                </div>
            );
        }

        if (layout === 'grid') {
            return (
                <div style={{ padding: '.5em' }} className="p-col-12 p-md-3">
                    <Panel header={car.vin} style={{ textAlign: 'center' }}>
                        <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} />
                        <div className="car-detail">{car.year} - {car.color}</div>
                        <i className="pi pi-search" style={{ cursor: 'pointer' }}></i>
                    </Panel>
                </div>
            );
        }
    }

    render() {
        const dialogFooter = (
            <Button label="Login" icon="pi pi-user" onClick={() => this.setState({dialogValue:false})} />
        );
        
        const dataViewHeader = (
            <div className="p-grid">
                <div className="p-col-6 p-md-8 filter-container">
                    <div style={{position:'relative'}}>
                        <InputText placeholder="Search by brand" onKeyUp={e => this.dv.filter(e.target.value)} />
                    </div>
                </div>
                <div className="p-col-6 p-md-4" style={{textAlign: 'right'}}>
                    <DataViewLayoutOptions layout={this.state.layout} onChange={(e) => this.setState({layout: e.value})} />
                </div>
            </div>
        );

        return (
            <div className="p-fluid">
                <div className="p-grid">
                    <div className="p-col-12">
                        <div className="p-messages p-component p-messages-success" style={{margin: '0 0 1em 0', display: 'block'}}>
                            <div className="p-messages-wrapper">
                                <span className="p-messages-icon pi pi-fw pi-2x pi-check"></span>
                                <ul>
                                    <li>
                                        <span className="p-messages-detail">Designer API is a theme engine for the complete PrimeReact UI Suite and includes this demo application 
                                        to test the commonly used components while designing your theme.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="card card-w-title">
                            <h1>Form Elements</h1>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Input</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="textarea">Textarea</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputTextarea id="textarea" rows={3} cols={30} autoResize={true}></InputTextarea>
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="calendar">Calendar</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Calendar id="calendar" value={this.state.date} onChange={event => this.setState({date: event.value})}></Calendar>
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="autocomplete">AutoComplete</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <AutoComplete minLength={1} placeholder="Countries" id="autocomplete" field="name" suggestions={this.state.filteredCountries}
                                                completeMethod={this.filterCountry} value={this.state.country}
                                                onChange={event => this.setState({country: event.value, filteredCountries: null})}
                                    />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="dropdown">Dropdown</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Dropdown options={this.state.cities} value={this.state.dropdownCity} onChange={event => this.setState({dropdownCity: event.value})} autoWidth={false} />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="password">Password</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Password id="password" />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="mask">Mask</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputMask id="mask" mask="99/99/9999" slotChar="dd/mm/yyyy" placeholder="Date" />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="spinner">Spinner</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Spinner value={this.state.spinnerValue} onChange={event => this.setState({spinnerValue: event.value})} />
                                </div>

                                <div className="p-col-12 p-md-2">
                                    Checkbox
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <div className="p-grid">
                                        <div className="p-col-12">
                                            <Checkbox value="Ultima" inputId="cb1" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Ultima') > -1} />
                                            <label htmlFor="cb1" className="p-checkbox-label">Ultima</label>
                                        </div>
                                        <div className="p-col-12">
                                            <Checkbox value="Avalon" inputId="cb2" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Avalon') > -1} />
                                            <label htmlFor="cb2" className="p-checkbox-label">Avalon</label>
                                        </div>
                                        <div className="p-col-12">
                                            <Checkbox value="Serenity" inputId="cb3" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Serenity') > -1} />
                                            <label htmlFor="cb3" className="p-checkbox-label">Serenity</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-col-12 p-md-2">
                                    RadioButton
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <div className="p-grid">
                                        <div className="p-col-12">
                                            <RadioButton value="Ultima" inputId="rb1" onChange={event => this.setState({radioValue: event.value})} checked={this.state.radioValue === "Ultima"} />
                                            <label htmlFor="rb1" className="p-radiobutton-label">Ultima</label>
                                        </div>
                                        <div className="p-col-12">
                                            <RadioButton value="Avalon" inputId="rb2" onChange={event => this.setState({radioValue: event.value})} checked={this.state.radioValue === "Avalon"} />
                                            <label htmlFor="rb2" className="p-radiobutton-label">Avalon</label>
                                        </div>
                                        <div className="p-col-12">
                                            <RadioButton value="Serenity" inputId="rb3" onChange={event => this.setState({radioValue: event.value})} checked={this.state.radioValue === "Serenity"} />
                                            <label htmlFor="rb3" className="p-radiobutton-label">Serenity</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="slider">Slider</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Slider id="slider" value={this.state.sliderValue} onChange={event => this.setState({sliderValue: event.value})} />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    Button
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Button label="Edit" icon="pi pi-pencil" />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    SplitButton
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <SplitButton label="Save" icon="pi pi-plus" model={this.state.splitButtonItems} />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="multiselect">MultiSelect</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <MultiSelect id="multiselect" placeholder="Choose" value={this.state.selectedCars} options={this.state.carOptions} onChange={event => this.setState({selectedCars: event.value})} />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    ToggleButton
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <ToggleButton checked={this.state.toggleButtonValue} onChange={event => this.setState({toggleButtonValue: event.value})} />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    SelectButton
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <SelectButton value={this.state.selectedType} options={this.state.types} onChange={event => this.setState({selectedType: event.value})} />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="listbox">ListBox</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <ListBox value={this.state.listBoxCity} options={this.state.listBoxCities} onChange={event => this.setState({listBoxCity: event.value})} filter={true} />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    Dialog
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Button label="Login" icon="pi pi-external-link" onClick={() => this.setState({dialogVisible:true})} />
                                </div>
                            </div>

                            <Dialog header="Login" visible={this.state.dialogVisible} footer={dialogFooter} onHide={() => this.setState({dialogVisible:false})}>
                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <InputText placeholder="Username" />
                                    </div>
                                    <div className="p-col-12">
                                        <InputText placeholder="Password" />
                                    </div>
                                </div>
                            </Dialog>
                        </div>

                        <div className="card card-w-title">
                            <h1>DataTable</h1>
                            <DataTable value={this.state.dataTableValue} selectionMode="single" header="DataTable" selection={this.state.dataTableSelection}
                                    onSelectionChange={event => this.setState({dataTableSelection: event.value})}>
                                <Column field="vin" header="Vin" sortable={true} />
                                <Column field="year" header="Year" sortable={true} />
                                <Column field="brand" header="Brand" sortable={true} />
                                <Column field="color" header="Color" sortable={true} />
                            </DataTable>
                        </div>
                    </div>
                    <div className="p-col-12">
                        <div className="card card-w-title">
                            <h1>DataView</h1>
                            <DataView ref={el => this.dv = el} value={this.state.dataViewValue} filterBy="brand" itemTemplate={this.dataViewItemTemplate}
                                    paginatorPosition="both" paginator={true} rows={10} header={dataViewHeader} layout={this.state.layout} />
                        </div>
                    </div>
                    <div className="p-col-12 p-lg-6">
                        <div className="card card-w-title">
                            <h1>PickList</h1>
                            <PickList source={this.state.picklistSourceCars} target={this.state.picklistTargetCars} sourceHeader="Available" targetHeader="Selected"
                                    responsive={true} itemTemplate={(car) => <span>{car.brand}</span>} 
                                    onChange={event => this.setState({picklistSourceCars: event.source, picklistTargetCars: event.target})} />
                        </div>

                        <div className="card card-w-title">
                            <h1>OrderList</h1>
                            <OrderList value={this.state.orderlistCars} responsive={true} header="OrderList" listStyle={{height:250}}
                                    itemTemplate={this.orderListTemplate} onChange={event => this.setState({orderlistCars: event.value})} />
                        </div>

                        <div className="card card-w-title">
                            <h1>ProgressBar</h1>
                            <ProgressBar value={50} />
                        </div>

                        <div className="card card-w-title">
                            <h1>PanelMenu</h1>
                            <PanelMenu model={this.state.panelMenuItems} />
                        </div>
                    </div>
                    <div className="p-col-12 p-lg-6">
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

                            <h1>TabView</h1>
                            <TabView>
                                <TabPanel header="Godfather I" leftIcon="pi pi-check">
                                    The story begins as Don Vito Corleone, the head of a New York Mafia family, overseeshis daughter's wedding. His beloved son ichael has just come home from the war, but does not intend to become part of his father's business. Through Michael's life the nature of the family business becomes clear. The business of the family is just like the head of the family, kind and benevolent to those who give respect, but given to ruthless violence whenever anything stands against the good of the family.
                                </TabPanel>
                                <TabPanel header="Godfather II" leftIcon="pi pi-user">
                                    Francis Ford Coppola's legendary continuation and sequel to his landmark 1972 film, The_Godfather parallels the young Vito Corleone's rise with his son Michael's spiritual fall, deepening The_Godfather's depiction of the dark side of the American dream. In the early 1900s, the child Vito flees his Sicilian village for America after the local Mafia kills his family. Vito struggles to make a living, legally or illegally, for his wife and growing brood in Little Italy.
                                </TabPanel>
                                <TabPanel header="Godfather III">
                                    The Godfather Part III is set in 1979 and 1980. Michael has moved back to New York and taken great strides to remove the family from crime. He turns over his New York criminal interests to longtime enforcer Joey Zasa. He uses his wealth in an attempt to rehabilitate his reputation through numerous philanthropic acts, administered by a foundation named after his father. A decade earlier, he gave custody of his two children to Kay, who has since remarried.
                                </TabPanel>
                            </TabView>
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
                            <h1>Tree</h1>
                            <Tree value={this.state.treeData} selectionMode="single" selectionKeys={this.state.selectedNodeKey} onSelectionChange={e => this.setState({selectedNodeKey: e.value})}/>
                        </div>

                        <div className="card card-w-title">
                            <h1>Menu</h1>
                            <Menu model={this.state.menuItems} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}