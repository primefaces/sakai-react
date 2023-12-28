'use client';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import type { ChartDataState, ChartOptionsState } from '@/types';

const ChartDemo = () => {
    const [options, setOptions] = useState<ChartOptionsState>({});
    const [data, setChartData] = useState<ChartDataState>({});
    const { layoutConfig } = useContext(LayoutContext);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';
        const barData: ChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                    borderColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200') || '#bcbdf9',
                    borderColor: documentStyle.getPropertyValue('--primary-200') || '#bcbdf9',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        const barOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: '500'
                        }
                    },
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                }
            }
        };

        const pieData: ChartData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle.getPropertyValue('--indigo-500') || '#6366f1', documentStyle.getPropertyValue('--purple-500') || '#a855f7', documentStyle.getPropertyValue('--teal-500') || '#14b8a6'],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400') || '#8183f4', documentStyle.getPropertyValue('--purple-400') || '#b975f9', documentStyle.getPropertyValue('--teal-400') || '#41c5b7']
                }
            ]
        };

        const pieOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };

        const lineData: ChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                    borderColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                    tension: 0.4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-200') || '#bcbdf9',
                    borderColor: documentStyle.getPropertyValue('--primary-200') || '#bcbdf9',
                    tension: 0.4
                }
            ]
        };

        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                }
            }
        };

        const polarData: ChartData = {
            datasets: [
                {
                    data: [11, 16, 7, 3],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500') || '#6366f1',
                        documentStyle.getPropertyValue('--purple-500') || '#a855f7',
                        documentStyle.getPropertyValue('--teal-500') || '#14b8a6',
                        documentStyle.getPropertyValue('--orange-500') || '#f97316'
                    ],
                    label: 'My dataset'
                }
            ],
            labels: ['Indigo', 'Purple', 'Teal', 'Orange']
        };

        const polarOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        const radarData: ChartData = {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
                {
                    label: 'My First dataset',
                    borderColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
                    pointBackgroundColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
                    pointBorderColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    borderColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
                    pointBackgroundColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
                    pointBorderColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };

        const radarOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: textColorSecondary
                    }
                }
            }
        };

        setOptions({
            barOptions,
            pieOptions,
            lineOptions,
            polarOptions,
            radarOptions
        });
        setChartData({
            barData,
            pieData,
            lineData,
            polarData,
            radarData
        });
    }, [layoutConfig]);

    return (
        <div className="grid p-fluid">
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Linear Chart</h5>
                    <Chart type="line" data={data.lineData} options={options.lineOptions}></Chart>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Bar Chart</h5>
                    <Chart type="bar" data={data.barData} options={options.barOptions}></Chart>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Pie Chart</h5>
                    <Chart type="pie" data={data.pieData} options={options.pieOptions}></Chart>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Doughnut Chart</h5>
                    <Chart type="doughnut" data={data.pieData} options={options.pieOptions}></Chart>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Polar Area Chart</h5>
                    <Chart type="polarArea" data={data.polarData} options={options.polarOptions}></Chart>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Radar Chart</h5>
                    <Chart type="radar" data={data.radarData} options={options.radarOptions}></Chart>
                </div>
            </div>
        </div>
    );
};

export default ChartDemo;
