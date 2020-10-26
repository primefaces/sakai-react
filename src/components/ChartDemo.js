import React from 'react';
import { Chart } from 'primereact/chart';

export function ChartDemo() {
    //Linear Chart
    const linearData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860'
            },
            {
                label: 'Second Dataset',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                backgroundColor: '#00bb7e',
                borderColor: '#00bb7e'
            }
        ]
    };

    const linearOptions = {
        legend: {
            labels: {
                fontColor: '#495057'
            }
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontColor: '#495057'
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: '#495057'
                }
            }]
        }
    };


    //Pie Chart
    const pieData = {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }
        ]
    };

    const pieOptions = {
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    };

    //PolarArea Chart
    const polarData = {
        datasets: [{
            data: [
                11,
                16,
                7,
                3,
                14
            ],
            backgroundColor: [
                "#FF6384",
                "#4BC0C0",
                "#FFCE56",
                "#E7E9ED",
                "#36A2EB"
            ],
            label: 'My dataset'
        }],
        labels: [
            "Red",
            "Green",
            "Yellow",
            "Grey",
            "Blue"
        ]
    };

    const polarOptions = {
        legend: {
            labels: {
                fontColor: '#495057'
            }
        },
        scale: {
            gridLines: {
                color: '#ebedef'
            }
        }
    };

    //Bar Chart

    const barData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: '#2f4860',
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                backgroundColor: '#00bb7e',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    const barOptions = {
        legend: {
            labels: {
                fontColor: '#495057'
            }
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontColor: '#495057'
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: '#495057'
                }
            }]
        }
    };


    //Doughnat Chart

    const doughnutData = {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
    };

    const doughnutOptions = {
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    };

    //Radar Chart

    const radarData = {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: 'rgba(179,181,198,0.2)',
                borderColor: 'rgba(179,181,198,1)',
                pointBackgroundColor: 'rgba(179,181,198,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(179,181,198,1)',
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                pointBackgroundColor: 'rgba(255,99,132,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255,99,132,1)',
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };

    const radarOptions = {
        legend: {
            labels: {
                fontColor: '#495057'
            }
        },
        scale: {
            pointLabels: {
                fontColor: '#495057'
            },
            gridLines: {
                color: '#ebedef'
            }
        }
    };

    return (
        <div className="p-grid p-fluid">
            <div className="p-col-12 p-lg-6">
                <div className="card">
                    <h5 className="centerText">Linear Chart</h5>
                    <Chart type="line" data={linearData} options={linearOptions} />
                </div>

                <div className="card">
                    <h5 className="centerText">Pie Chart</h5>
                    <Chart type="pie" data={pieData} options={pieOptions} />
                </div>

                <div className="card">
                    <h5 className="centerText">Polar Area Chart</h5>
                    <Chart type="polarArea" data={polarData} options={polarOptions} />
                </div>
            </div>
            <div className="p-col-12 p-lg-6">
                <div className="card">
                    <h5 className="centerText">Bar Chart</h5>
                    <Chart type="bar" data={barData} options={barOptions} />
                </div>

                <div className="card">
                    <h5 className="centerText">Doughnut Chart</h5>
                    <Chart type="doughnut" data={doughnutData} options={doughnutOptions} />
                </div>

                <div className="card">
                    <h5 className="centerText">Radar Chart</h5>
                    <Chart type="radar" data={radarData} options={radarOptions} />
                </div>
            </div>
        </div>
    )
}