'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export default function FormModal({children, title, fetchValue, clearValues, visible, setVisible, start}) {

    const footerContent = (
        <div>
            <Button label="Чыгуу" icon="pi pi-times" onClick={() => {
                setVisible(false);
                clearValues();
            }} className="p-button-text" />
            {<Button label="Кийинки кадам" disabled={start} icon="pi pi-check" onClick={() => {
                setVisible(false);
                fetchValue();
            }} autoFocus />}
        </div>
    );

    return (
        <div>
            <Dialog
                header={title}
                visible={visible}
                // style={{ width: '50vw' }}
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                }}
                footer={footerContent}
            >
                {children}
            </Dialog>
        </div>
    );
}
