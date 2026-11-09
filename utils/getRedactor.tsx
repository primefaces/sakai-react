import { ConfirmDialogOptions } from '@/types/confirmDialog/ConfirmDialogOptions';
import { confirmDialog } from 'primereact/confirmdialog';

interface RedactorType {
    getConfirmOptions: (id: number, onDelete: (id: number) => void) => ConfirmDialogOptions;
    onEdit: (id: number, type: string) => void;
    onDelete: (id: number) => void;
}

interface redactorValueType {
    id: number;
    type?: string;
}

export const getRedactor = (redactorValues: redactorValueType, handlers: RedactorType, onInBox: (id:number)=> void) => [
    {
        label: '',
        icon: 'pi pi-pencil',
        command: () => {
            handlers.onEdit(redactorValues.id, redactorValues?.type || '');
        }
    },
    {
        label: '',
        icon: 'pi pi-trash',
        command: () => {
            // if(handlers.onDelete){
            const options = handlers.getConfirmOptions(Number(redactorValues.id), handlers.onDelete);
            // if(options){
            confirmDialog(options);
            // }
            // }
        }
    },
    {
        label: '',
        icon: 'pi pi-inbox',
        command: () => {
           onInBox(redactorValues?.id);
        }
    }
];
