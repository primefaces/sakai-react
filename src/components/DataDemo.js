import React, { Component } from 'react';
import {CarService} from '../service/CarService';
import {NodeService} from '../service/NodeService';
import {EventService} from '../service/EventService';
import {OrganizationChart} from 'primereact/components/organizationchart/OrganizationChart';
import {DataTable} from 'primereact/components/datatable/DataTable';
import {DataView, DataViewLayoutOptions} from 'primereact/components/dataview/DataView';
import {Tree} from 'primereact/components/tree/Tree';
import {TreeTable} from 'primereact/components/treetable/TreeTable';
import {Column} from 'primereact/components/column/Column'
import {PickList} from 'primereact/components/picklist/PickList';
import {OrderList} from 'primereact/components/orderlist/OrderList';
import {Schedule} from 'primereact/components/schedule/Schedule';
import {Panel} from 'primereact/components/panel/Panel';
import {Button} from 'primereact/components/button/Button';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Dropdown} from 'primereact/components/dropdown/Dropdown';

export class DataDemo extends Component {

    constructor() {
        super();
        this.state = {
            dataTableValue: [],
            treeData: [],
            treeTableData: [],
            picklistSourceCars: [],
            picklistTargetCars: [],
            orderlistCars: [],
            scheduleEvents: [],
            organizationSelect: null
        };
        this.carService = new CarService();
        this.nodeService = new NodeService();
        this.eventService = new EventService();
        this.pickListTemplate = this.pickListTemplate.bind(this);
        this.orderListTemplate = this.orderListTemplate.bind(this);
        this.onOrganizationChange = this.onOrganizationChange.bind(this);
        this.onTreeTableChange = this.onTreeTableChange.bind(this);
        this.dataViewItemTemplate = this.dataViewItemTemplate.bind(this);
        this.dataViewHeaderTemplate = this.dataViewHeaderTemplate.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
    }

    componentDidMount() {
        this.carService.getCarsMedium().then(data => this.setState({dataTableValue: data}));
        this.nodeService.getFiles(this).then(files => this.setState({treeData: files}));
        this.nodeService.getFilesystem(this).then(files => this.setState({treeTableData: files}));
        this.carService.getCarsMedium().then(data => this.setState({picklistSourceCars: data}));
        this.carService.getCarsSmall().then(data => this.setState({orderlistCars: data}));
        this.eventService.getEvents().then(events => this.setState({scheduleEvents: events}));
    }

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0) {
            this.setState({sortOrder: -1, sortField:value.substring(1, value.length), sortKey: value});
        }
        else {
            this.setState({sortOrder: 1, sortField:value, sortKey: value});
        }
    }

    dataViewItemTemplate(car,layout) {
        if(!car) {
            return;
        }

        let src = "assets/demo/images/car/" + car.brand + ".png";

        if(layout === 'list') {
            return (
                <div className="ui-g" style={{padding: '0.5em', borderBottom: '1px solid #d9d9d9'}}>
                    <div className="ui-g-12 ui-md-3">
                        <img src={src} alt={car.brand}/>
                    </div>
                    <div className="ui-g-12 ui-md-8 car-details">
                        <div className="ui-g">
                            <div className="ui-g-2 ui-sm-6">Vin:</div>
                            <div className="ui-g-10 ui-sm-6">{car.vin}</div>

                            <div className="ui-g-2 ui-sm-6">Year:</div>
                            <div className="ui-g-10 ui-sm-6">{car.year}</div>

                            <div className="ui-g-2 ui-sm-6">Brand:</div>
                            <div className="ui-g-10 ui-sm-6">{car.brand}</div>

                            <div className="ui-g-2 ui-sm-6">Color:</div>
                            <div className="ui-g-10 ui-sm-6">{car.color}</div>
                        </div>
                    </div>

                    <div className="ui-g-12 ui-md-1 search-icon" style={{marginTop:'40px'}}>
                        <Button icon="fa-search" onClick={(e) => this.setState({ selectedCar: car, visible: true })}></Button>
                    </div>
                </div>
            );
        }
        if(layout === 'grid') {
            return (
                <div style={{ padding: '.5em' }} className="ui-g-12 ui-md-4">
                    <Panel header={car.vin} style={{ textAlign: 'center' }}>
                        <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} />
                        <div className="car-detail">{car.year} - {car.color}</div>
                        <hr className="ui-widget-content" style={{ borderTop: 0 }} />
                        <Button icon="fa-search"></Button>
                    </Panel>
                </div>
            );
        }
    }

    dataViewHeaderTemplate() {
        let sortOptions = [
            {label: 'Newest First', value: '!year'},
            {label: 'Oldest First', value: 'year'},
            {label: 'Brand', value: 'brand'}
        ];

        return <div className="ui-g">
                    <div className="ui-g-12 ui-md-4">
                        <Dropdown options={sortOptions} value={this.state.sortKey} placeholder="Sort By" onChange={this.onSortChange} autoWidth={false} style={{minWidth:'15em'}}/>
                    </div>
                    <div className="ui-g-6 ui-md-4 filter-container">
                        <div style={{position:'relative'}}>
                            <InputText placeholder="Search by brand" onKeyUp={e=>this.dv.filter(e.target.value)}/>
                        </div>
                    </div>
                    <div className="ui-g-6 ui-md-4" style={{textAlign: 'right'}}>
                        <DataViewLayoutOptions onClick={(e)=>this.dv.changeLayout(e.originalEvent,e.layout)}/>
                    </div>
                </div>;
    }

    pickListTemplate(car){
        if (!car) {
            return;
        }
        return <div className="ui-helper-clearfix">
            <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} style={{display:'inline-block', margin:'2px 0 2px 2px', width: '50px'}}/>
            <div style={{fontSize:'16px', float:'right', margin:'15px 5px 0 0'}}>{car.brand}</div>
        </div>
    }

    orderListTemplate(car){
        if (!car) {
            return;
        }

        return (
            <div className="ui-helper-clearfix">
                <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} style={{display:'inline-block',margin:'2px 0 2px 2px', width: '50px'}}/>
                <div style={{fontSize:14,float:'right',margin:'15px 5px 0 0'}}>{car.year} - {car.color}</div>
            </div>
        );
    }

    onOrganizationChange(select){
        this.setState({organizationSelect: select});
    }

    onTreeTableChange(event){
        this.setState({treeTableSelect: event.selection});
    }

    render(){

        let organizationValue = [{
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
        }];

        let scheduleHeader = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        };

        let dataViewHeader = this.dataViewHeaderTemplate();

        return (
            <div className="ui-g">
                <div className="ui-g-12">
                    <div className="card card-w-title">
                        <h1>DataTable</h1>
                        <DataTable value={this.state.dataTableValue} selectionMode="single" header="List of Cars" paginator={true} rows={10}
                        responsive={true} selection={this.state.dataTableSelectValue} onSelectionChange={(e) => this.setState({dataTableSelectValue: e.data})}>
                            <Column field="vin" header="Vin" sortable={true}/>
                            <Column field="year" header="Year" sortable={true}/>
                            <Column field="brand" header="Brand" sortable={true}/>
                            <Column field="color" header="Color" sortable={true}/>
                        </DataTable>
                    </div>
                </div>

                <div className="ui-g-12">
                    {/*  Left Side  */}
                    <div className="card card-w-title">
                        <h1>DataView</h1>
                        <DataView ref={(el) => { this.dv = el; }} value={this.state.dataTableValue} filterBy={"brand"} itemTemplate={this.dataViewItemTemplate}
                              paginatorPosition={'both'} paginator={true} rows={9} header={dataViewHeader} sortOrder={this.state.sortOrder} sortField={this.state.sortField}/>
                    </div>
                </div>

                <div className="ui-g-12 ui-md-8">
                    <div className="card card-w-title">
                        <h1>PickList</h1>
                        <PickList source={this.state.picklistSourceCars} target={this.state.picklistTargetCars} sourceHeader="Available" targetHeader="Selected"
                                        responsive={true} itemTemplate={this.pickListTemplate} sourceStyle={{height:250}} targetStyle={{height:250}}
                                        onChange={(e) => this.setState({picklistSourceCars: e.source, picklistTargetCars: e.target})} />
                    </div>
                </div>

                <div className="ui-g-12 ui-md-4">
                    <div className="card card-w-title">
                        <h1>OrderList</h1>
                        <OrderList  value={this.state.orderlistCars} responsive={true} header="OrderList" listStyle={{height:250}}
                                    itemTemplate={this.orderListTemplate} onChange={(e) => this.setState({orderlistCars: e.value})}/>
                    </div>
                </div>

                <div className="ui-g-12">
                    <div className="card card-w-title">
                        <h1>Organization Chart</h1>
                        <OrganizationChart value={organizationValue} selectionMode="single" selectionChange={this.onOrganizationChange}/>
                    </div>
                </div>
                
                <div className="ui-g-12">
                    <div className="card card-w-title">
                        <h1>Tree</h1>
                        <Tree value={this.state.treeData}/>
                    </div>
                </div>

                <div className="ui-g-12">
                    <div className="card card-w-title">
                        <h1>TreeTable</h1>
                        <TreeTable value={this.state.treeTableData} header="Basic" selectionMode="single"  selectionChange={this.onTreeTableChange}>
                            <Column field="name" header="Name"></Column>
                            <Column field="size" header="Size"></Column>
                            <Column field="type" header="Type"></Column>
                        </TreeTable>
                    </div>
                </div>

                <div className="ui-g-12">
                    <div className="card card-w-title">
                        <h1>Schedule</h1>
                        <Schedule header={scheduleHeader} events={this.state.scheduleEvents} defaultDate="2016-01-12"/>
                    </div>
                </div>
            </div>
        );
    }
}