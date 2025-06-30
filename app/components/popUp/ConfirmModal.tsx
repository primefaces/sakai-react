'use client';
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

export default function ConfirmModal({confirmVisible}) {
    const handleClick = () => {
        console.log('hi');
        
        confirmDialog(confirmVisible);
    };

    return (
        <div>
            <i onClick={handleClick} className="pi pi-trash" />
        </div>
    );
}
