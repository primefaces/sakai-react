import React, { Component } from 'react';
import {FileUpload} from 'primereact/components/fileupload/FileUpload';
import {Growl} from 'primereact/components/growl/Growl';
import {ProgressBar} from 'primereact/components/progressbar/ProgressBar';

export class MiscDemo extends Component {

    constructor() {
        super();
        this.state = {
            value: 0,
            messages: null
        };
        
        this.onUpload = this.onUpload.bind(this);
    }
    
    onUpload(event){
        this.setState({messages:[{severity: 'info', summary: 'Success', detail: 'File Uploaded'}]});
    }

    componentDidMount(){
        this.interval = setInterval(() => {
            let val = this.state.value;
            val += Math.floor(Math.random() * 10) + 1;
            if(val >= 100) {
                val = 100;
                clearInterval(this.interval);
            }
            this.setState({value: val});
        }, 2000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    render() {

        return  <div className="ui-g">
                    <div className="ui-g-12">
                        <div className="card">
                            <h1>Upload</h1>
                            <Growl value={this.state.messages}/>
                    
                            <FileUpload name="demo[]" url="./upload.php" onUpload={this.onUpload} multiple={true} accept="image/*" maxFileSize={1000000} />
                        </div>
                    </div>
                
                    <div className="ui-g-12">
                        <div className="card">
                            <h1>ProgressBar</h1>
                            <ProgressBar value={this.state.value}/>
                        </div>
                    </div>
                </div>;
    }
}