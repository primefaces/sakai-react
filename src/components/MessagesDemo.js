import React, { Component } from 'react';
import {Messages} from 'primereact/components/messages/Messages';
import {Growl} from 'primereact/components/growl/Growl';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Button} from 'primereact/components/button/Button';

export class MessagesDemo extends Component {

    constructor() {
        super();

        this.showInfo = this.showInfo.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showWarn = this.showWarn.bind(this);
        this.showError = this.showError.bind(this);
    }

    showSuccess() {
        let msg = { severity: 'success', summary: 'Success Message', detail: 'Order submitted' };
        this.growl.show(msg);
        this.messages.show(msg);
    }

    showInfo() {
        let msg = { severity: 'info', summary: 'Info Message', detail: 'PrimeReact rocks' };
        this.growl.show(msg);
        this.messages.show(msg);
    }

    showWarn() {
        let msg = { severity: 'warn', summary: 'Warn Message', detail: 'There are unsaved changes' };
        this.growl.show(msg);
        this.messages.show(msg);
    }

    showError() {
        let msg = { severity: 'error', summary: 'Error Message', detail: 'Validation failed' };
        this.growl.show(msg);
        this.messages.show(msg);
    }

    render() {
        return(
            <div className="ui-g">
                <div className="ui-g-12">
                    <div className="card">
                        <h1>Messages and Growl</h1>
                        <Messages ref={(el) => this.messages = el} />
                        <Growl ref={(el) => this.growl = el} />
            
                        <Button onClick={this.showInfo} label="Info" style={{width:'100px'}} className="info-btn"/>
                        <Button onClick={this.showSuccess} label="Success" style={{width:'100px'}} className="green-button" />
                        <Button onClick={this.showWarn} label="Warn" className="yellow-button" style={{width:'100px'}}/>
                        <Button onClick={this.showError} label="Error" className="red-button" style={{width:'100px'}}/>
                    </div>

                    <div className="card">
                        <h1>Invalid Field</h1>
                        <span className="md-inputfield">
                            <InputText className="ui-state-error" placeholder="Invalid"/>
                            <div className="ui-message ui-messages-error ui-corner-all">
                                This field is required
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}