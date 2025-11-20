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

export const getConfirmOptions = (id: number, onDelete: (id: number)=> void ): ConfirmDialogOptions => ({
    message: 'Вы действительно хотите удалить?',
    header: 'Удаление',
    icon: 'pi pi-info-circle',
    defaultFocus: 'reject',
    acceptClassName: 'p-button-danger trash-button',
    acceptLabel: 'Удалить',
    rejectLabel: 'Назад',
    rejectClassName: 'p-button-secondary reject-button',
    accept: () => onDelete(id)
});
