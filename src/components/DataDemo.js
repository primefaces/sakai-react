import React, {Component} from 'react';
import {CarService} from '../service/CarService';
import {NodeService} from '../service/NodeService';
import {EventService} from '../service/EventService';
import {OrganizationChart} from 'primereact/organizationchart';
import {DataTable} from 'primereact/datatable';
import {FullCalendar} from 'primereact/fullcalendar';
import {Tree} from 'primereact/tree';
import {TreeTable} from 'primereact/treetable';
import {Column} from 'primereact/column'
import {PickList} from 'primereact/picklist';
import {OrderList} from 'primereact/orderlist';
import {Panel} from 'primereact/panel';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export class DataDemo extends Component {

    constructor() {
        super();
        this.state = {
            dataTableValue:[],
            dataViewValue:[],
            picklistSourceCars:[],
            picklistTargetCars:[],
            orderlistCars:[],
            treeData1:[],
            treeData2:[],
            selectedFile:null,
            selectedFiles:null,
            documents:[],
            documentsSelection:null,
            fullCalendarEvents:[],
            layout: 'list',
            sortOptions: [
                {label: 'Newest First', value: '!year'},
                {label: 'Oldest First', value: 'year'},
                {label: 'Brand', value: 'brand'}
            ],
            organizationChartValue: [{
                label: 'F.C Barcelona',
                expanded: true,
                children: [
                    {
                        label: 'F.C Barcelona',
                        expanded: true,
                        children: [
                            {
                                label: 'Chelsea FC'
                            },
                            {
                                label: 'F.C. Barcelona'
                            }
                        ]
                    },
                    {
                        label: 'Real Madrid',
                        expanded: true,
                        children: [
                            {
                                label: 'Bayern Munich'
                            },
                            {
                                label: 'Real Madrid'
                            }
                        ]
                    }
                ]
            }]
        };

        this.carService = new CarService();
        this.nodeService = new NodeService();
        this.eventService = new EventService();

        this.dataViewItemTemplate = this.dataViewItemTemplate.bind(this);
        this.pickListTemplate = this.pickListTemplate.bind(this);
        this.orderListTemplate = this.orderListTemplate.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
    }

    componentDidMount() {
        this.carService.getCarsMedium().then(data => this.setState({dataTableValue: data}));
        this.nodeService.getTreeNodes(this).then(nodes => this.setState({treeData1: nodes}));
        this.nodeService.getTreeNodes(this).then(nodes => this.setState({treeData2: nodes}));
        this.carService.getCarsLarge().then(data => this.setState({dataViewValue: data}));
        this.nodeService.getTreeTableNodes().then(files => this.setState({documents: files}));
        this.carService.getCarsMedium().then(data => this.setState({picklistSourceCars: data}));
        this.carService.getCarsSmall().then(data => this.setState({orderlistCars: data}));
        this.eventService.getEvents().then(events => this.setState({fullCalendarEvents: events}));
    }

    pickListTemplate(car){
        if (!car) {
            return;
        }
        
        return <div className="p-clearfix">
            <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} style={{display:'inline-block', margin:'2px 0 2px 2px', width: '50px'}}/>
            <div style={{fontSize:'16px', float:'right', margin:'15px 5px 0 0'}}>{car.brand}</div>
        </div>
    }

    orderListTemplate(car){
        if (!car) {
            return;
        }

        return (
            <div className="p-clearfix">
                <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} style={{display:'inline-block',margin:'2px 0 2px 2px', width: '50px'}}/>
                <div style={{fontSize:14,float:'right',margin:'15px 5px 0 0'}}>{car.year} - {car.color}</div>
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
                        <img src={src} alt={car.brand}/>
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
                        <Button icon="pi pi-search"></Button>
                    </Panel>
                </div>
            );
        }
    }

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0)
            this.setState({sortOrder: -1, sortField:value.substring(1, value.length), sortKey: value});
        else
            this.setState({sortOrder: 1, sortField:value, sortKey: value});
    }

    render() {
		let fullcalendarOptions = {
			plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            defaultView: 'dayGridMonth',
            defaultDate: '2016-02-01',
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: true
		};

        const header = (
            <div className="p-grid">
                <div className="p-col-12 p-md-4" style={{textAlign:'left'}}>
                    <Dropdown options={this.state.sortOptions} value={this.state.sortKey} placeholder="Sort By" onChange={this.onSortChange} />
                </div>
                <div className="p-col-6 p-md-4">
                    <InputText placeholder="Search by brand" onKeyUp={event => this.dv.filter(event.target.value)} />
                </div>
                <div className="p-col-6 p-md-4" style={{textAlign: 'right'}}>
                    <DataViewLayoutOptions layout={this.state.layout} onChange={event => this.setState({layout: event.value})} />
                </div>
            </div>
        );

        return (
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1>DataTable</h1>
                        <DataTable value={this.state.dataTableValue} paginatorPosition="both" selectionMode="single" header="List of Cars" paginator={true} rows={10}
                            responsive={true} selection={this.state.dataTableSelection} onSelectionChange={event => this.setState({dataTableSelection: event.value})}>
                            <Column field="vin" header="Vin" sortable={true}/>
                            <Column field="year" header="Year" sortable={true}/>
                            <Column field="brand" header="Brand" sortable={true}/>
                            <Column field="color" header="Color" sortable={true}/>
                        </DataTable>
                    </div>
                </div>

                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1>DataView</h1>
                        <DataView ref={el => this.dv = el} value={this.state.dataViewValue} filterBy="brand" itemTemplate={this.dataViewItemTemplate} layout={this.state.layout}
                                  paginatorPosition={'both'} paginator={true} rows={10} header={header} sortOrder={this.state.sortOrder} sortField={this.state.sortField}/>
                    </div>
                </div>

                <div className="p-col-12 p-md-8">
                    <div className="card card-w-title">
                        <h1>PickList</h1>
                        <PickList source={this.state.picklistSourceCars} target={this.state.picklistTargetCars} sourceHeader="Available" targetHeader="Selected"
                                        responsive={true} itemTemplate={this.pickListTemplate} sourceStyle={{height:250}} targetStyle={{height:250}}
                                        onChange={event => this.setState({picklistSourceCars: event.source, picklistTargetCars: event.target})} />
                    </div>
                </div>

                <div className="p-col-12 p-md-4">
                    <div className="card card-w-title">
                        <h1>OrderList</h1>
                        <OrderList value={this.state.orderlistCars} responsive={true} header="OrderList" listStyle={{height:250}}
                                itemTemplate={this.orderListTemplate} onChange={event => this.setState({orderlistCars: event.value})}/>
                    </div>
                </div>

                <div className="p-col-12">
                    <div className="card card-w-title">
                        <div className="p-grid">
                            <div className="p-col-12 p-md-6">
                                <h1>Tree</h1>
                                <Tree value={this.state.treeData1} selectionMode="single" selectionKeys={this.state.selectedFile}
                                      onSelectionChange={event => this.setState({selectedFile: event.value})}/>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <h1>Checkbox Tree</h1>
                                <Tree value={this.state.treeData2} selectionMode="checkbox" selectionKeys={this.state.selectedFiles}
                                      onSelectionChange={event => this.setState({selectedFiles: event.value})}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1>Organization Chart</h1>
                        <OrganizationChart value={this.state.organizationChartValue} />
                    </div>
                </div>

                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1>TreeTable</h1>
                        <TreeTable value={this.state.documents} header="Documents" selectionMode="single"
                            selectionKeys={this.state.documentsSelection} onSelectionChange={event => this.setState({documentsSelection: event.value})}>
                            <Column field="name" header="Name" expander></Column>
                            <Column field="size" header="Size"></Column>
                            <Column field="type" header="Type"></Column>
                        </TreeTable>
                    </div>
                </div>

                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1>Schedule</h1>
                        <FullCalendar events={this.state.fullCalendarEvents} options={fullcalendarOptions}/>
                    </div>
                </div>
            </div>
        );
    }
}