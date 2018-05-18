import React, { Component } from 'react';
import {CarService} from '../service/CarService';
import {OverlayPanel} from 'primereact/components/overlaypanel/OverlayPanel';
import {Dialog} from 'primereact/components/dialog/Dialog';
import {Lightbox} from 'primereact/components/lightbox/Lightbox';
import {Button} from 'primereact/components/button/Button';
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';

export class OverlaysDemo extends Component {

    constructor() {
        super();
        this.state = {
            dataTableValue: [],
            display: false
        };

        this.carService = new CarService();
    }

    componentDidMount(){
        this.carService.getCarsSmall().then(data => this.setState({dataTableValue: data.splice(0,5)}));
    }

    render(){

        let dialogFooter = <div className="ui-dialog-buttonpane ui-helper-clearfix">
            <Button icon="fa-close" onClick={()=>this.setState({display:false})} label="No"/>
            <Button icon="fa-check" onClick={()=>this.setState({display:false})} label="Yes"/>
        </div>;

        let images = [];
        images.push({source:'assets/demo/images/sopranos/sopranos1.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos1_small.jpg', title:'Nature 1'});
        images.push({source:'assets/demo/images/sopranos/sopranos2.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos2_small.jpg', title:'Nature 2'});
        images.push({source:'assets/demo/images/sopranos/sopranos3.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos3_small.jpg', title:'Nature 3'});
        images.push({source:'assets/demo/images/sopranos/sopranos4.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos4_small.jpg', title:'Nature 4'});

        return(
            <div className="ui-g ui-fluid">
                <div className="ui-g-12 ui-lg-6">
                    {/* Left Side */}
                    <div className="card">
                        <h1>Overlay Panel</h1>
                        <div className="ui-g">
                            <div className="ui-g-6">
                                <Button label="Image" onClick={(event)=> this.overlayPanel1.toggle(event)}/>
                                <OverlayPanel ref={el => this.overlayPanel1=el}>
                                    <img src="assets/demo/images/nature/nature1.jpg" alt="Nature 1" />
                                </OverlayPanel>
                            </div>
                            <div className="ui-g-6">
                                <Button label="DataTable" onClick={(event)=> this.overlayPanel2.toggle(event)}/>
                                <OverlayPanel  ref={el => this.overlayPanel2=el} showCloseIcon={true} dismissable={false}>
                                    <DataTable value={this.state.dataTableValue} style={{width:'500px'}}>
                                        <Column field="vin" header="Vin" sortable={true}/>
                                        <Column field="year" header="Year" sortable={true}/>
                                        <Column field="brand" header="Brand" sortable={true}/>
                                        <Column field="color" header="Color" sortable={true}/>
                                    </DataTable>
                                </OverlayPanel>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h1>Dialog</h1>
                        <Dialog header="Godfather I" visible={this.state.display} modal={true} width="400px" footer={dialogFooter} onHide={()=>this.setState({display:false})}>
                            <p>The story begins as Don Vito Corleone, the head of a New York Mafia family, oversees his daughter's wedding.
                                His beloved son Michael has just come home from the war, but does not intend to become part of his father's business.
                                Through Michael's life the nature of the family business becomes clear. The business of the family is just like the head of the family,
                                kind and benevolent to those who give respect,
                                but given to ruthless violence whenever anything stands against the good of the family.</p>
                        </Dialog>
                        <Button icon="fa-external-link-square" label="Show" onClick={()=> this.setState({display: true})}/>
                    </div>
                </div>
                <div className="ui-g-12 ui-lg-6">
                    {/* Right Side */}
                    <div className="card">
                        <h1>LightBox</h1>
                        <Lightbox images={images}/>
                    </div>
                </div>
            </div>
        )
    }
}