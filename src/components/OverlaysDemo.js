import React, {Component} from 'react';
import {CarService} from '../service/CarService';
import {OverlayPanel} from 'primereact/overlaypanel';
import {Dialog} from 'primereact/dialog';
import {Lightbox} from 'primereact/lightbox';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

export class OverlaysDemo extends Component {

    constructor() {
        super();
        this.state = {
            dataTableValue: [],
            display: false,
            images: [
                {source:'assets/demo/images/sopranos/sopranos1.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos1_small.jpg', title:'Sopranos 1'},
                {source:'assets/demo/images/sopranos/sopranos2.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos2_small.jpg', title:'Sopranos 2'},
                {source:'assets/demo/images/sopranos/sopranos3.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos3_small.jpg', title:'Sopranos 3'},
                {source:'assets/demo/images/sopranos/sopranos4.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos4_small.jpg', title:'Sopranos 4'}
            ]
        };

        this.carService = new CarService();
    }

    componentDidMount(){
        this.carService.getCarsSmall().then(data => this.setState({dataTableValue: data.splice(0,5)}));
    }

    render() {
        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={() => this.setState({display:false})} label="Yes" />
                <Button icon="pi pi-times" onClick={() => this.setState({display:false})} label="No" className="p-button-secondary" />
            </div>
        );

        return (
            <div className="p-grid p-fluid">
                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h1>Overlay Panel</h1>
                        <div className="p-grid">
                            <div className="p-col-6">
                                <Button label="Image" onClick={(event) => this.overlayPanel1.toggle(event)} />
                                <OverlayPanel ref={el => this.overlayPanel1 = el}>
                                    <img src="assets/demo/images/nature/nature1.jpg" alt="Nature 1" />
                                </OverlayPanel>
                            </div>
                            <div className="p-col-6">
                                <Button label="DataTable" onClick={(event)=> this.overlayPanel2.toggle(event)} />
                                <OverlayPanel  ref={el => this.overlayPanel2=el} showCloseIcon={true} dismissable={false}>
                                    <DataTable value={this.state.dataTableValue} style={{width:'500px'}}>
                                        <Column field="vin" header="Vin" sortable={true} />
                                        <Column field="year" header="Year" sortable={true} />
                                        <Column field="brand" header="Brand" sortable={true} />
                                        <Column field="color" header="Color" sortable={true} />
                                    </DataTable>
                                </OverlayPanel>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h1>Dialog</h1>
                        <Dialog header="Godfather I" visible={this.state.display} modal={true} width="400px" footer={dialogFooter} onHide={() => this.setState({display:false})}>
                            <p>The story begins as Don Vito Corleone, the head of a New York Mafia family, oversees his daughter's wedding.
                                His beloved son Michael has just come home from the war, but does not intend to become part of his father's business.
                                Through Michael's life the nature of the family business becomes clear. The business of the family is just like the head of the family,
                                kind and benevolent to those who give respect,
                                but given to ruthless violence whenever anything stands against the good of the family.</p>
                        </Dialog>
                        <Button icon="pi pi-external-link" label="Show" onClick={() => this.setState({display: true})} />
                    </div>
                </div>
                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h1>LightBox</h1>
                        <Lightbox images={this.state.images} />
                    </div>
                    <div className="card">
                        <h1>Tooltip</h1>
                        <InputText tooltip="Username" tooltipOptions={{position: 'bottom'}} />
                    </div>
                </div>
            </div>
        )
    }
}