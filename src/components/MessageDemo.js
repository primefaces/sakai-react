import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './MessageDemo.scss'


export function MessageDemo() {
    const toast = useRef();
    const message = useRef();

    const showMessage = (_severity) => {
        message.current.show({ severity: _severity, detail: 'Message Content' })
    }

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Message Content', life: 3000 });
    }

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'Message Content', life: 3000 });
    }

    const showWarn = () => {
        toast.current.show({ severity: 'warn', summary: 'Warn Message', detail: 'Message Content', life: 3000 });
    }

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Message Content', life: 3000 });
    }


    return (
        <div className="message-demo">
            <Toast ref={toast} />

            <div className="p-grid">
                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h5>Toast</h5>
                        <Button label="Success" className="p-button-success p-mr-2" onClick={showSuccess} />
                        <Button label="Info" className="p-button-info p-mr-2" onClick={showInfo} />
                        <Button label="Warn" className="p-button-warning p-mr-2" onClick={showWarn} />
                        <Button label="Error" className="p-button-danger" onClick={showError} />
                    </div>
                </div>
                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h5>Messages</h5>
                        <Button label="Success" className="p-button-success p-mr-2" onClick={() => showMessage('success')} />
                        <Button label="Info" className="p-button-info p-mr-2" onClick={() => showMessage('info')} />
                        <Button label="Warn" className="p-button-warning p-mr-2" onClick={() => showMessage('warn')} />
                        <Button label="Error" className="p-button-danger" onClick={() => showMessage('error')} />
                        <Messages ref={message} />
                    </div>
                </div>
                <div className="p-col-12 p-lg-8">
                    <div className="card">
                        <h5>Inline</h5>
                        <div className="p-field p-grid p-align-start">
                            <label htmlFor="username1" className="p-col-fixed">Username</label>
                            <div className="p-col">
                                <InputText id="username1" required className="p-invalid"></InputText>
                                <Message severity="error" text="Username is required" />
                            </div>
                        </div>
                        <div className="p-field p-grid">
                            <label htmlFor="email" className="p-col-fixed">Email</label>
                            <div className="p-col">
                                <InputText id="email" required className="p-invalid" />
                                <Message severity="error" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-lg-4">
                    <div className="card">
                        <h5>Help Text</h5>
                        <div className="p-field p-fluid">
                            <label htmlFor="username2">Username</label>
                            <InputText id="username2" aria-describedby="username-help" className="p-invalid p-mr-2" />
                            <small id="username-help" className="p-invalid">Enter your username to reset your password.</small>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}