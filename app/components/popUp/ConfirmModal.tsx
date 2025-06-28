'use client';
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

export default function ConfirmModal({confirmVisible}) {
    const handleClick = () => {
        confirmDialog(confirmVisible);
    };

    return (
        <div>
            <Button onClick={handleClick} className="p-button-rounded p-button-danger" icon="pi pi-trash" />
        </div>
    );
}
