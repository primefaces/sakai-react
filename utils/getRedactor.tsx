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
    getConfirmOptions: (id: number, onDelete: (id: number) => void) => ConfirmDialogOptions;
    onEdit: (id: number, type: string) => void;
    onDelete: (id: number) => void;
}

export const getRedactor = (status: string, rowData: any, handlers: any) => [
    {
        label: '',
        icon: 'pi pi-pencil',
        command: () => {
            // const checkArg = handlers.onEdit(rowData.id, rowData?.type);
            // if(handlers.onEdit) {
                handlers.onEdit(rowData.id, rowData?.type);
            // }
        }
    },
    {
        label: '',
        icon: 'pi pi-trash',
        command: () => {
            // if(handlers.onDelete){
                const options = handlers.getConfirmOptions(Number(rowData.id), handlers.onDelete );
                // if(options){
                    confirmDialog(options);
                // }
            // }
        }
    }
];
