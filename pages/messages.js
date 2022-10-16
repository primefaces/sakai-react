import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const MessagesDemo = () => {
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
        <div className="grid">
            <div className="col-12 lg:col-6">
                <div className="card">
                    <h5>Toast</h5>

                    <Toast ref={toast} />
                    <Button type="button" onClick={showSuccess} label="Success" className="p-button-success mr-2" />
                    <Button type="button" onClick={showInfo} label="Info" className="p-button-info mr-2" />
                    <Button type="button" onClick={showWarn} label="Warn" className="p-button-warning mr-2" />
                    <Button type="button" onClick={showError} label="Error" className="p-button-danger mr-2" />
                </div>
            </div>

            <div className="col-12 lg:col-6">
                <div className="card">
                    <h5>Messages</h5>

                    <Button label="Success" type="button" onClick={addSuccessMessage} className="p-button-success mr-2" />
                    <Button label="Info" type="button" onClick={addInfoMessage} className="p-button-info mr-2" />
                    <Button label="Warn" type="button" onClick={addWarnMessage} className="p-button-warning mr-2" />
                    <Button label="Error" type="button" onClick={addErrorMessage} className="p-button-danger mr-2" />
                    <Messages ref={message} />
                </div>
            </div>

            <div className="col-12 lg:col-8">
                <div className="card">
                    <h5>Inline</h5>
                    <div className="field grid">
                        <label htmlFor="username1" className="col-fixed w-9rem">Username</label>
                        <div className="col">
                            <InputText id="username1" value={username} onChange={(e) => setUsername(e.target.value)} required className="p-invalid mr-2"/>
                            <Message severity="error" text="Username is required" />
                        </div>
                    </div>
                    <div className="field grid">
                        <label htmlFor="email" className="col-fixed w-9rem">Email</label>
                        <div className="col">
                            <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-invalid mr-2"/>
                            <Message severity="error"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-4">
                <div className="card">
                    <h5>Help Text</h5>
                    <div className="field p-fluid">
                        <label htmlFor="username2">Username</label>
                        <InputText id="username2" type="text" className="p-invalid" aria-describedby="username-help" />
                        <small id="username-help" className="p-error">Enter your username to reset your password.</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(MessagesDemo, comparisonFn);
