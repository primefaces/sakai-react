
import React, { Component } from 'react';
import {CarService} from '../service/CarService';
import {Panel} from 'primereact/components/panel/Panel';
import {Checkbox} from 'primereact/components/checkbox/Checkbox';
import {Button} from 'primereact/components/button/Button';
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Chart} from 'primereact/components/chart/Chart';
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';
import {Schedule} from 'primereact/components/schedule/Schedule';

export class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            tasks: [],
            city: null,
            selectedCar: null,
            lineData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        borderColor: '#007be5'
                    },
                    {
                        label: 'Second Dataset',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        fill: false,
                        borderColor: '#20d077'
                    }
                ]
            }
        };
        this.onTaskChange = this.onTaskChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.carservice = new CarService();
    }

    onTaskChange(e) {
        let selectedTasks = [...this.state.tasks];
        if(e.checked)
            selectedTasks.push(e.value);
        else
            selectedTasks.splice(selectedTasks.indexOf(e.value), 1);

        this.setState({tasks: selectedTasks});
    }

    onCityChange(e) {
        this.setState({city: e.value});
    }

    componentDidMount() {
        this.carservice.getCarsSmall().then(data => this.setState({cars: data}));
    }

    render() {
        let cities = [
            {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
            {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
            {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
            {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
            {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
        ];

        let scheduleHeader = {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		};

        let events = [
			{
				"id": 1,
				"title": "All Day Event",
				"start": "2017-02-01"
			},
			{
				"id": 2,
				"title": "Long Event",
				"start": "2017-02-07",
				"end": "2017-02-10"
			},
			{
				"id": 3,
				"title": "Repeating Event",
				"start": "2017-02-09T16:00:00"
			},
			{
				"id": 4,
				"title": "Repeating Event",
				"start": "2017-02-16T16:00:00"
			},
			{
				"id": 5,
				"title": "Conference",
				"start": "2017-02-11",
				"end": "2017-02-13"
			},
			{
				"id": 6,
				"title": "Meeting",
				"start": "2017-02-12T10:30:00",
				"end": "2017-02-12T12:30:00"
			},
			{
				"id": 7,
				"title": "Lunch",
				"start": "2017-02-12T12:00:00"
			},
			{
				"id": 8,
				"title": "Meeting",
				"start": "2017-02-12T14:30:00"
			},
			{
				"id": 9,
				"title": "Happy Hour",
				"start": "2017-02-12T17:30:00"
			},
			{
				"id": 10,
				"title": "Dinner",
				"start": "2017-02-12T20:00:00"
			},
			{
				"id": 11,
				"title": "Birthday Party",
				"start": "2017-02-13T07:00:00"
			},
			{
				"id": 12,
				"title": "Click for Google",
				"url": "http://google.com/",
				"start": "2017-02-28"
			}
        ];
        
        return <div className="ui-g ui-fluid dashboard">
            <div className="ui-g-12 ui-md-4">
                <div className="card clearfix summary">
                    <span className="title">Users</span>
                    <span className="detail">Number of visitors</span>
                    <span className="count visitors">12</span>
                </div>
            </div>
            <div className="ui-g-12 ui-md-4">
                <div className="card clearfix summary">
                    <span className="title">Sales</span>
                    <span className="detail">Number of purchases</span>
                    <span className="count purchases">534</span>
                </div>
            </div>
            <div className="ui-g-12 ui-md-4">
                <div className="card clearfix summary">
                    <span className="title">Revenue</span>
                    <span className="detail">Income for today</span>
                    <span className="count revenue">$3,200</span>
                </div>
            </div>

            <div className="ui-g-12 ui-md-6 ui-lg-3">
                <div className="highlight-box">
                    <div className="initials" style={{backgroundColor:'#007be5',color:'#00448f'}}>TV</div>
                    <div className="card">
                        <span className="fa fa-eye"/>
                        <span>Total Views</span>
                        <span className="count">523</span>
                    </div>
                </div>
            </div>
            <div className="ui-g-12 ui-md-6 ui-lg-3">
                <div className="highlight-box">
                    <div className="initials" style={{backgroundColor:'#ef6262',color:'#a83d3b'}}>TI</div>
                    <div className="card">
                        <span className="fa fa-question-circle"/>
                        <span>Total Issues</span>
                        <span className="count">81</span>
                    </div>
                </div>
            </div>
            <div className="ui-g-12 ui-md-6 ui-lg-3">
                <div className="highlight-box">
                    <div className="initials" style={{backgroundColor:'#20d077',color:'#038d4a'}}>OI</div>
                    <div className="card">
                        <span className="fa fa-question-circle-o"/>
                        <span>Open Issues</span>
                        <span className="count">21</span>
                    </div>
                </div>
            </div>
            <div className="ui-g-12 ui-md-6 ui-lg-3">
                <div className="highlight-box">
                    <div className="initials" style={{backgroundColor:'#f9c851',color:'#b58c2b'}}>CI</div>
                    <div className="card">
                        <span className="fa fa-check"/>
                        <span>Closed Issues</span>
                        <span className="count">60</span>
                    </div>
                </div>
            </div>
            <div className="ui-g-12 ui-md-6 ui-lg-4">
                <Panel header="Tasks" style={{height: '100%'}}>
                    <ul className='task-list'>
                        <li>
                            <Checkbox value="task1" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task1')>-1?true:false}></Checkbox>
                            <span className="task-name">Sales Reports</span>
                            <Button icon="fa-check"/>
                        </li>
                        <li>
                            <Checkbox value="task2" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task2')>-1?true:false}></Checkbox>
                            <span className="task-name">Pay Invoices</span>
                            <Button icon="fa-check"/>
                        </li>
                        <li>
                            <Checkbox value="task3" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task3')>-1?true:false}></Checkbox>
                            <span className="task-name">Dinner with Tony</span>
                            <Button icon="fa-check"/>
                        </li>
                        <li>
                            <Checkbox value="task4" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task4')>-1?true:false}></Checkbox>
                            <span className="task-name">Client Meeting</span>
                            <Button icon="fa-check"/>
                        </li>
                        <li>
                            <Checkbox value="task5" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task5')>-1?true:false}></Checkbox>
                            <span className="task-name">New Theme</span>
                            <Button icon="fa-check"/>
                        </li>
                        <li>
                            <Checkbox value="task6" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task6')>-1?true:false}></Checkbox>
                            <span className="task-name">Flight Ticket</span>
                            <Button icon="fa-check"/>
                        </li>
                    </ul>
                </Panel>
            </div>
            <div className="ui-g-12 ui-md-6 ui-lg-4 ui-fluid contact-form">
                <Panel header="Contact Us" style={{height: '100%'}}>
                    <div className="ui-g">
                        <div className="ui-g-12">
                            <Dropdown value={this.state.city} options={cities} placeholder="Select a City" onChange={this.onCityChange} autoWidth={false} />
                        </div>
                        <div className="ui-g-12">
                            <InputText type="text" placeholder="Name" />
                        </div>
                        <div className="ui-g-12">
                            <InputText type="text" placeholder="Age" />
                        </div>
                        <div className="ui-g-12">
                            <InputText type="text" placeholder="Message" />
                        </div>
                        <div className="ui-g-12">
                            <Button type="button" label="Send" icon="fa-send"/>
                        </div>
                    </div>
                </Panel>
            </div>

            <div className="ui-g-12 ui-lg-4">
                <Panel header="Contacts">
                    <ul className="contacts">
                        <li>
                            <a>
                            <img src="assets/layout/images/avatar_1.png" width="35" alt="avatar1"/>
                            <span className="name">Claire Williams</span>
                            <span className="email">clare@pf-omega.com</span>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="assets/layout/images/avatar_2.png" width="35" alt="avatar2"/>
                                <span className="name">Jason Dourne</span>
                                <span className="email">jason@pf-omega.com</span>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="assets/layout/images/avatar_3.png" width="35" alt="avatar3"/>
                                <span className="name">Jane Davidson</span>
                                <span className="email">jane@pf-omega.com</span>
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="assets/layout/images/avatar_4.png" width="35" alt="avatar4"/>
                                <span className="name">Tony Corleone</span>
                                <span className="email">tony@pf-omega.com</span>
                            </a>
                        </li>
                    </ul>
                </Panel>
            </div>
            <div className="ui-g-12 ui-md-6">
                <div className="card">
                    <h1 style={{fontSize:'16px'}}>Recent Sales</h1>
                    <DataTable value={this.state.cars}  style={{marginBottom: '20px'}} responsive={true}
                               selectionMode="single" selection={this.state.selectedCar} onSelectionChange={(e) => this.setState({selectedCar: e.data})}>
                        <Column field="vin" header="Vin" sortable={true} />
                        <Column field="year" header="Year" sortable={true} />
                        <Column field="brand" header="Brand" sortable={true} />
                        <Column field="color" header="Color" sortable={true} />
                    </DataTable>
                </div>
            </div>
            <div className="ui-g-12 ui-md-6">
                <div className="card">
                    <Chart type="line" data={this.state.lineData}/>
                </div>
            </div>
            <div className="ui-g-12 ui-md-8">
                <Panel header="Calendar" style={{height: '100%'}}> 
                    <Schedule events={events} header={scheduleHeader} defaultDate="2017-02-01" eventLimit={4}></Schedule>
                </Panel>
            </div>

            <div className="ui-g-12 ui-md-4">
                <Panel header="Activity" style={{height:'100%'}}>
                    <div className="activity-header">
                        <div className="ui-g">
                            <div className="ui-g-6">
                                <span style={{fontWeight:'bold'}}>Last Activity</span>
                                <p>Updated 1 minute ago</p>
                            </div>
                            <div className="ui-g-6" style={{textAlign:'right'}}>
                                <Button label="Refresh" icon="fa-refresh" />
                            </div>
                        </div>
                    </div>
                    <ul className="activity-list">
                        <li>
                            <div className="count">$900</div>
                            <div className="ui-g">
                                <div className="ui-g-6">Income</div>
                                <div className="ui-g-6">95%</div>
                            </div>
                        </li>
                        <li>
                            <div className="count" style={{backgroundColor:'#f9c851'}}>$250</div>
                            <div className="ui-g">
                                <div className="ui-g-6">Tax</div>
                                <div className="ui-g-6">24%</div>
                            </div>
                        </li>
                        <li>
                            <div className="count" style={{backgroundColor:'#20d077'}}>$125</div>
                            <div className="ui-g">
                                <div className="ui-g-6">Invoices</div>
                                <div className="ui-g-6">55%</div>
                            </div>
                        </li>
                        <li>
                            <div className="count" style={{backgroundColor:'#f9c851'}}>$250</div>
                            <div className="ui-g">
                                <div className="ui-g-6">Expenses</div>
                                <div className="ui-g-6">15%</div>
                            </div>
                        </li>
                        <li>
                            <div className="count" style={{backgroundColor:'#007be5'}}>$350</div>
                            <div className="ui-g">
                                <div className="ui-g-6">Bonus</div>
                                <div className="ui-g-6">5%</div>
                            </div>
                        </li>
                        <li>
                            <div className="count" style={{backgroundColor:'#ef6262'}}>$500</div>
                            <div className="ui-g">
                                <div className="ui-g-6">Revenue</div>
                                <div className="ui-g-6">25%</div>
                            </div>
                        </li>
                    </ul>
                </Panel>
            </div>
        </div>
    }
}