import React, { Component } from 'react';
import {CarService} from '../service/CarService';
import {Panel} from 'primereact/panel';
import {Checkbox} from 'primereact/checkbox';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {Chart} from 'primereact/chart';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FullCalendar} from 'primereact/fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

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
            },
            cities: [
                {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
                {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
                {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
                {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
                {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
            ],
            fullcalendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                defaultDate: '2017-02-01',
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                editable: true
            },
            events: [
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
            ]
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
        return (
            <div className="p-grid p-fluid dashboard">
                <div className="p-col-12 p-lg-4">
                    <div className="card summary">
                        <span className="title">Users</span>
                        <span className="detail">Number of visitors</span>
                        <span className="count visitors">12</span>
                    </div>
                </div>
                <div className="p-col-12 p-lg-4">
                    <div className="card summary">
                        <span className="title">Sales</span>
                        <span className="detail">Number of purchases</span>
                        <span className="count purchases">534</span>
                    </div>
                </div>
                <div className="p-col-12 p-lg-4">
                    <div className="card summary">
                        <span className="title">Revenue</span>
                        <span className="detail">Income for today</span>
                        <span className="count revenue">$3,200</span>
                    </div>
                </div>

                <div className="p-col-12 p-md-6 p-xl-3">
                    <div className="highlight-box">
                        <div className="initials" style={{backgroundColor:'#007be5',color:'#00448f'}}><span>TV</span></div>
                        <div className="highlight-details ">
                            <i className="pi pi-search"/>
                            <span>Total Queries</span>
                            <span className="count">523</span>
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-md-6 p-xl-3">
                    <div className="highlight-box">
                        <div className="initials" style={{backgroundColor:'#ef6262',color:'#a83d3b'}}><span>TI</span></div>
                        <div className="highlight-details ">
                            <i className="pi pi-question-circle"/>
                            <span>Total Issues</span>
                            <span className="count">81</span>
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-md-6 p-xl-3">
                    <div className="highlight-box">
                        <div className="initials" style={{backgroundColor:'#20d077',color:'#038d4a'}}><span>OI</span></div>
                        <div className="highlight-details ">
                            <i className="pi pi-filter"/>
                            <span>Open Issues</span>
                            <span className="count">21</span>
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-md-6 p-xl-3">
                    <div className="highlight-box">
                        <div className="initials" style={{backgroundColor:'#f9c851',color:'#b58c2b'}}><span>CI</span></div>
                        <div className="highlight-details ">
                            <i className="pi pi-check"/>
                            <span>Closed Issues</span>
                            <span className="count">60</span>
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-md-6 p-lg-4">
                    <Panel header="Tasks" style={{height: '100%'}}>
                        <ul className='task-list'>
                            <li>
                                <Checkbox value="task1" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task1')>-1?true:false}></Checkbox>
                                <span className="task-name">Sales Reports</span>
                                <i className="pi pi-chart-bar" />
                            </li>
                            <li>
                                <Checkbox value="task2" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task2')>-1?true:false}></Checkbox>
                                <span className="task-name">Pay Invoices</span>
                                <i className="pi pi-dollar" />
                            </li>
                            <li>
                                <Checkbox value="task3" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task3')>-1?true:false}></Checkbox>
                                <span className="task-name">Dinner with Tony</span>
                                <i className="pi pi-user" />
                            </li>
                            <li>
                                <Checkbox value="task4" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task4')>-1?true:false}></Checkbox>
                                <span className="task-name">Client Meeting</span>
                                <i className="pi pi-users" />
                            </li>
                            <li>
                                <Checkbox value="task5" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task5')>-1?true:false}></Checkbox>
                                <span className="task-name">New Theme</span>
                                <i className="pi pi-briefcase" />
                            </li>
                            <li>
                                <Checkbox value="task6" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task6')>-1?true:false}></Checkbox>
                                <span className="task-name">Flight Ticket</span>
                                <i className="pi pi-briefcase" />
                            </li>
                        </ul>
                    </Panel>
                </div>
                <div className="p-col-12 p-md-6 p-lg-4 p-fluid contact-form">
                    <Panel header="Contact Us">
                        <div className="p-grid">
                            <div className="p-col-12">
                                <Dropdown value={this.state.city} options={this.state.cities} placeholder="Select a City" onChange={this.onCityChange} autoWidth={false} />
                            </div>
                            <div className="p-col-12">
                                <InputText type="text" placeholder="Name" />
                            </div>
                            <div className="p-col-12">
                                <InputText type="text" placeholder="Age" />
                            </div>
                            <div className="p-col-12">
                                <InputText type="text" placeholder="Message" />
                            </div>
                            <div className="p-col-12">
                                <Button type="button" label="Send" icon="fa-send"/>
                            </div>
                        </div>
                    </Panel>
                </div>

                <div className="p-col-12 p-lg-4 contacts">
                    <Panel header="Contacts">
                        <ul>
                            <li>
                                <button className="p-link">
                                    <img src="assets/layout/images/avatar_1.png" width="35" alt="avatar1"/>
                                    <span className="name">Claire Williams</span>
                                    <span className="email">clare@pf-sigma.com</span>
                                </button>
                            </li>
                            <li>
                                <button className="p-link">
                                    <img src="assets/layout/images/avatar_2.png" width="35" alt="avatar2"/>
                                    <span className="name">Jason Dourne</span>
                                    <span className="email">jason@pf-sigma.com</span>
                                </button>
                            </li>
                            <li>
                                <button className="p-link">
                                    <img src="assets/layout/images/avatar_3.png" width="35" alt="avatar3"/>
                                    <span className="name">Jane Davidson</span>
                                    <span className="email">jane@pf-sigma.com</span>
                                </button>
                            </li>
                            <li>
                                <button className="p-link">
                                    <img src="assets/layout/images/avatar_4.png" width="35" alt="avatar4"/>
                                    <span className="name">Tony Corleone</span>
                                    <span className="email">tony@pf-sigma.com</span>
                                </button>
                            </li>
                        </ul>
                    </Panel>
                </div>
                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h1 style={{fontSize:'16px'}}>Recent Sales</h1>
                        <DataTable value={this.state.cars}  style={{marginBottom: '20px'}} responsive={true}
                                selectionMode="single" selection={this.state.selectedCar} onSelectionChange={(e) => this.setState({selectedCar: e.value})}>
                            <Column field="vin" header="Vin" sortable={true} />
                            <Column field="year" header="Year" sortable={true} />
                            <Column field="brand" header="Brand" sortable={true} />
                            <Column field="color" header="Color" sortable={true} />
                        </DataTable>
                    </div>
                </div>
                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <Chart type="line" data={this.state.lineData}/>
                    </div>
                </div>
                <div className="p-col-12 p-lg-8">
                    <Panel header="Calendar" style={{height: '100%'}}> 
                        <FullCalendar events={this.state.events} options={this.state.fullcalendarOptions}></FullCalendar>
                    </Panel>
                </div>

                <div className="p-col-12 p-lg-4">
                    <Panel header="Activity" style={{height:'100%'}}>
                        <div className="activity-header">
                            <div className="p-grid">
                                <div className="p-col-6">
                                    <span style={{fontWeight:'bold'}}>Last Activity</span>
                                    <p>Updated 1 minute ago</p>
                                </div>
                                <div className="p-col-6" style={{textAlign:'right'}}>
                                    <Button label="Refresh" icon="pi pi-refresh" />
                                </div>
                            </div>
                        </div>

                        <ul className="activity-list">
                            <li>
                                <div className="count">$900</div>
                                <div className="p-grid">
                                    <div className="p-col-6">Income</div>
                                    <div className="p-col-6">95%</div>
                                </div>
                            </li>
                            <li>
                                <div className="count" style={{backgroundColor:'#f9c851'}}>$250</div>
                                <div className="p-grid">
                                    <div className="p-col-6">Tax</div>
                                    <div className="p-col-6">24%</div>
                                </div>
                            </li>
                            <li>
                                <div className="count" style={{backgroundColor:'#20d077'}}>$125</div>
                                <div className="p-grid">
                                    <div className="p-col-6">Invoices</div>
                                    <div className="p-col-6">55%</div>
                                </div>
                            </li>
                            <li>
                                <div className="count" style={{backgroundColor:'#f9c851'}}>$250</div>
                                <div className="p-grid">
                                    <div className="p-col-6">Expenses</div>
                                    <div className="p-col-6">15%</div>
                                </div>
                            </li>
                            <li>
                                <div className="count" style={{backgroundColor:'#007be5'}}>$350</div>
                                <div className="p-grid">
                                    <div className="p-col-6">Bonus</div>
                                    <div className="p-col-6">5%</div>
                                </div>
                            </li>
                            <li>
                                <div className="count" style={{backgroundColor:'#ef6262'}}>$500</div>
                                <div className="p-grid">
                                    <div className="p-col-6">Revenue</div>
                                    <div className="p-col-6">25%</div>
                                </div>
                            </li>
                        </ul>
                    </Panel>
                </div>
            </div>
        );
    }
}