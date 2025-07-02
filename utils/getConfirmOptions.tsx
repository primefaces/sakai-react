export const getConfirmOptions = (id: number, handleDeleteCourse, ) => ({
    message: 'Сиз чын эле өчүрүүнү каалайсызбы?',
    header: 'Өчүрүү',
    icon: 'pi pi-info-circle',
    defaultFocus: 'reject',
    acceptClassName: 'p-button-danger',
    acceptLabel: 'Өчүрүү',
    rejectLabel: 'Артка',
    rejectClassName: 'p-button-secondary reject-button',
    accept: () => handleDeleteCourse(id)
});
