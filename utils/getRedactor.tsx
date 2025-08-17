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

interface RedactorType {
  onEdit: (id: number, type: string) => void;
  getConfirmOptions: (id: number, onDelete: (id: number) => void) => ConfirmDialogOptions;
  onDelete: (id: number) => void;
}

export const getRedactor = (rowData: any, handlers: RedactorType) => [
    {
        label: '',
        icon: 'pi pi-pencil',
        command: () => {
            handlers.onEdit(rowData.id, rowData?.type);
        }
    },
    {
        label: '',
        icon: 'pi pi-trash',
        command: () => {
            const options = handlers.getConfirmOptions(Number(rowData.id), handlers.onDelete );
            if(options){
                confirmDialog(options);
            }
        }
    }
];
