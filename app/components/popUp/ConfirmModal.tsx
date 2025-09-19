'use client';
import { confirmDialog } from 'primereact/confirmdialog';
type ConfirmDialogOptions = {
  message: string;
  header?: string;
  icon?: string;
  defaultFocus?: 'accept' | 'reject';
  accept?: () => void;
  reject?: () => void;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptClassName?: string;
  rejectClassName?: string;
};
export default function ConfirmModal({confirmVisible}: {confirmVisible: ConfirmDialogOptions}) {
    const handleClick = () => {
        console.log(confirmVisible);
        
        confirmDialog(confirmVisible);
    };

    return (
        <div>
            <i onClick={handleClick} className="pi pi-trash" />
        </div>
    );
}
