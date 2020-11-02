import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export const MessagesDemo = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const toast = useRef();
    const message = useRef();

    const addSuccessMessage = () => {
        message.current.show({ severity: 'success', content: 'Message Detail' });
    };

    const addInfoMessage = () => {
        message.current.show({ severity: 'info', content: 'Message Detail' });
    };

    const addWarnMessage = () => {
        message.current.show({ severity: 'warn', content: 'Message Detail' });
    };

    const addErrorMessage = () => {
        message.current.show({ severity: 'error', content: 'Message Detail' });
    };

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Message Detail', life: 3000 });
    };

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'Message Detail', life: 3000 });
    };

    const showWarn = () => {
        toast.current.show({ severity: 'warn', summary: 'Warn Message', detail: 'Message Detail', life: 3000 });
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Message Detail', life: 3000 });
    };

    return (
        <div className="p-grid messages-demo">
            <div className="p-col-12 p-lg-6">
                <div className="card">
                    <h5>Toast</h5>

                    <Toast ref={toast} />
                    <Button type="button" onClick={showSuccess} label="Success" className="p-button-success p-mr-2" />
                    <Button type="button" onClick={showInfo} label="Info" className="p-button-info p-mr-2" />
                    <Button type="button" onClick={showWarn} label="Warn" className="p-button-warning p-mr-2" />
                    <Button type="button" onClick={showError} label="Error" className="p-button-danger p-mr-2" />
                </div>
            </div>

            <div className="p-col-12 p-lg-6">
                <div className="card">
                    <h5>Messages</h5>

                    <Button label="Success" type="button" onClick={addSuccessMessage} className="p-button-success p-mr-2" />
                    <Button label="Info" type="button" onClick={addInfoMessage} className="p-button-info p-mr-2" />
                    <Button label="Warn" type="button" onClick={addWarnMessage} className="p-button-warning p-mr-2" />
                    <Button label="Error" type="button" onClick={addErrorMessage} className="p-button-danger p-mr-2" />
                    <Messages ref={message} />
                </div>
            </div>

            <div className="p-col-12 p-lg-8">
                <div className="card">
                    <h5>Inline</h5>
                    <div className="p-field p-grid p-align-start">
                        <label htmlFor="username1" className="p-col-fixed">Username</label>
                        <div className="p-col">
                            <InputText id="username1" value={username} onChange={(e) => setUsername(e.target.value)} required className="p-invalid"></InputText>
                            <Message severity="error" text="Username is required" />
                        </div>
                    </div>
                    <div className="p-field p-grid">
                        <label htmlFor="email" className="p-col-fixed">Email</label>
                        <div className="p-col">
                            <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-invalid"></InputText>
                            <Message severity="error"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-lg-4">
                <div className="card">
                    <h5>Help Text</h5>
                    <div className="p-field p-fluid">
                        <label htmlFor="username2">Username</label>
                        <InputText id="username2" type="text" className="p-error" aria-describedby="username-help" />
                        <small id="username-help" className="p-error">Enter your username to reset your password.</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
