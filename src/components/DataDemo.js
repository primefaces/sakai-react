import React, { Component } from 'react';
import {CarService} from '../service/CarService';
import {NodeService} from '../service/NodeService';
import {EventService} from '../service/EventService';
import {OrganizationChart} from 'primereact/components/organizationchart/OrganizationChart';
import {DataTable} from 'primereact/components/datatable/DataTable';
import {DataGrid} from 'primereact/components/datagrid/DataGrid';
import {Tree} from 'primereact/components/tree/Tree';
import {TreeTable} from 'primereact/components/treetable/TreeTable';
import {Column} from 'primereact/components/column/Column'
import {DataList} from 'primereact/components/datalist/DataList';
import {PickList} from 'primereact/components/picklist/PickList';
import {OrderList} from 'primereact/components/orderlist/OrderList';
import {Schedule} from 'primereact/components/schedule/Schedule';
import {Panel} from 'primereact/components/panel/Panel';
import {Button} from 'primereact/components/button/Button';

export class DataDemo extends Component {

    constructor() {
        super();
        this.state = {
            dataTableValue: [],
            dataGridValue: [],
            dataListValue: [],
            treeData: [],
            treeTableData: [],
            picklistSourceCars: [],
            picklistTargetCars: [],
            orderlistCars: [],
            scheduleEvents: []
        };
        this.carService = new CarService();
        this.nodeService = new NodeService();
        this.eventService = new EventService();
        this.dataGridTemplate = this.dataGridTemplate.bind(this);
        this.pickListTemplate = this.pickListTemplate.bind(this);
        this.orderListTemplate = this.orderListTemplate.bind(this);
        this.onOrganizationChange = this.onOrganizationChange.bind(this);
        this.onTreeTableChange = this.onTreeTableChange.bind(this);
        this.dataListTemplate = this.dataListTemplate.bind(this);
    }

    componentDidMount() {
        this.carService.getCarsMedium().then(data => this.setState({dataTableValue: data}));
        this.carService.getCarsMedium().then(data => this.setState({dataGridValue: data}));
        this.carService.getCarsMedium().then(data => this.setState({dataListValue: data}));
        this.nodeService.getFiles(this).then(files => this.setState({treeData: files}));
        this.nodeService.getFilesystem(this).then(files => this.setState({treeTableData: files}));
        this.carService.getCarsMedium().then(data => this.setState({picklistSourceCars: data}));
        this.carService.getCarsSmall().then(data => this.setState({orderlistCars: data}));
        this.eventService.getEvents().then(events => this.setState({scheduleEvents: events}));
    }

    dataGridTemplate(car) {
        if (!car) {
            return;
        }

        return (
            <div style={{ padding: '3px' }} className="ui-g-12 ui-md-4">
                <Panel header={car.vin} style={{ textAlign: 'center' }}>
                    <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} />
                    <div className="car-detail">{car.year} - {car.color}</div>
                </Panel>
            </div>
        );
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

    dataListTemplate(car){

        if (!car) {
            return;
        }

        return (
        <div style={{borderBottom: '1px solid #bdbdbd'}} className="clearfix car-item">
            <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} style={{display:'inline-block', margin:'24px',verticalAlign:'middle', width:48}}/>
            <div className="car-details" style={{display:'inline-block', verticalAlign:'middle'}}>
                <p>{car.brand}</p>
                <p style={{color:'#757575'}}>{car.year} - {car.color}</p>
            </div>
            <Button icon="fa-search" style={{margin:'24px 24px 0 0', float:'right'}}/>
        </div>);
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
                        <h1>DataGrid</h1>
                        <DataGrid paginator={true} rows={9} header='Grid of Cars' value={this.state.dataGridValue} itemTemplate={this.dataGridTemplate}/>
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
                        <h1>DataList - Paginator</h1>
                        <DataList value={this.state.dataListValue} paginator={true} rows={5} className="cars-datalist" header="List of Cars"
                                  itemTemplate={this.dataListTemplate}
                        />
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