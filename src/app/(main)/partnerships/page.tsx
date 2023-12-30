/* eslint-disable @next/next/no-img-element */
'use client';
import {Button} from 'primereact/button';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import {Dialog} from 'primereact/dialog';
import {InputNumber} from 'primereact/inputnumber';
import {InputText} from 'primereact/inputtext';
import {Toast} from 'primereact/toast';
import {Toolbar} from 'primereact/toolbar';
import {classNames} from 'primereact/utils';
import React, {useEffect, useRef, useState} from 'react';
import {PartnershipService} from '../../../service/PartnershipService';
import {Partnership} from "../../../service/types/partnership/Partnership";
import {Slider} from "primereact/slider";
import {MultiSelect} from "primereact/multiselect";
import {Contact} from "../../../service/types/contact/Contact";
import {Chips} from "primereact/chips";
import {InputTextarea} from "primereact/inputtextarea";
import {InputMask} from "primereact/inputmask";
import {useRouter} from "next/navigation";
import {useUser} from "../../../layout/context/usercontext";
import {useTranslation} from "react-i18next";

const PartnershipCrud = () => {

    let emptyPartnership: Partnership = {
        name: "",
        surname: "",
        tckn: "",
        passport: "",
        duties: [],
        contact: new Contact(),
    }

    const [partnerships, setPartnerships] = useState<Partnership[]>();
    const [partnershipDialog, setPartnershipDialog] = useState(false);
    const [deletePartnershipDialog, setDeletePartnershipDialog] = useState(false);
    const [deletePartnershipsDialog, setDeletePartnershipsDialog] = useState(false);
    const [partnership, setPartnership] = useState<Partnership>(emptyPartnership);
    const [selectedPartnerships, setSelectedPartnerships] = useState<Partnership[]>();
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Map<string, string>>(new Map());
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const router = useRouter();
    const user = useUser();
    const {t} = useTranslation();

    useEffect(() => {
        if (!user.loadingUser) {
            if (user.company == null) {
                router.push('/companies')
            } else {
                PartnershipService.listByCompanyId(user.company.$id!).then(result => {
                    setPartnerships(result.documents as any)
                })
            }
        }
    }, [user.current, user.loadingUser]);

    const isFormFieldValid = (name: string) => {
        return !!(submitted && errors.get(name));
    }

    const getFormErrorMessage = (name: string) => {
        return isFormFieldValid(name) && <small className="p-error">{errors.get(name)}</small>;
    };

    const openNew = () => {
        emptyPartnership.companyId = user.company!.$id
        setPartnership(emptyPartnership);
        setSubmitted(false);
        setPartnershipDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPartnershipDialog(false);
    };

    const hideDeletePartnershipDialog = () => {
        setDeletePartnershipDialog(false);
    };

    const hideDeletePartnershipsDialog = () => {
        setDeletePartnershipsDialog(false);
    };

    const validate = () => {
        let errors: Map<string, string> = new Map()

        if (!partnership.name) {
            errors.set("name", t('name.required'))
        }
        if (!partnership.surname) {
            errors.set("surname", t('partnership.surname.required'))
        }
        if (!partnership.shareRatio) {
            errors.set("shareRatio", t('partnership.shareRatio.required'))
        }
        if (!partnership.tckn) {
            errors.set("tckn", t('partnership.tckn.required'))
        }
        if (!partnership.duties || partnership.duties.length == 0) {
            errors.set("duties", t('partnership.duty.required'))
        }
        if (!partnership.contact.email) {
            errors.set("email", t('email.required'))
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(partnership.contact.email)) {
            errors.set("email", t('email.invalid'))
        }
        return errors;
    };

    const savePartnership = () => {
        setSubmitted(true);
        let errors = validate()
        setErrors(errors)
        debugger
        if (errors.size == 0) {
            let _partnerships = [...(partnerships as Partnership[])];
            let _partnership = {...partnership};
            if (partnership.$id) {
                debugger
                PartnershipService.update(partnership.$id, _partnership as Partnership).then(r => {
                    let index = findIndexById(partnership.$id as string);
                    partnerships![index] = _partnership;
                    toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_updated'), life: 3000})
                    setPartnershipDialog(false);
                    setPartnership(emptyPartnership);
                }).catch(e => {
                    debugger
                    console.log(e)
                })
            } else {
                debugger
                PartnershipService.add(_partnership as Partnership).then(r => {
                    toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_created'), life: 3000});
                    _partnerships.push(r as unknown as Partnership);
                    setPartnerships(_partnerships)
                    setPartnershipDialog(false);
                    setPartnership(emptyPartnership);
                }).catch(e => {
                    debugger
                    console.log(e)
                })
            }
        }
    };

    const editPartnership = (partnership: Partnership) => {
        setPartnership({...partnership} as Partnership);
        setPartnershipDialog(true);
    };

    const confirmDeletePartnership = (partnership: Partnership) => {
        setPartnership(partnership);
        setDeletePartnershipDialog(true);
    };

    const deletePartnership = () => {
        let _partnerships = partnerships?.filter((val: Partnership) => val.$id !== partnership.$id);
        PartnershipService.remove(partnership.$id as string).then(r => {
            setPartnerships(_partnerships as Partnership[]);
            setDeletePartnershipDialog(false);
            setPartnership(emptyPartnership);
            toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_deleted'), life: 3000});
        })
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < partnerships!.length; i++) {
            if (partnerships![i].$id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePartnershipsDialog(true);
    };

    const deleteSelectedPartnerships = () => {
        let _partnerships = partnerships?.filter((val: Partnership) => !selectedPartnerships?.includes(val));

        PartnershipService.removeAll(selectedPartnerships!.map((val: Partnership) => val.$id!)).then(r => {
            setPartnerships(_partnerships as Partnership[])
            setDeletePartnershipsDialog(false);
            setSelectedPartnerships([]);
            toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_deleted'), life: 3000});
        })
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || (e.value) || '';
        let _partnership = {...partnership};
        (_partnership as any)[`${name}`] = val;
        setPartnership(_partnership);
    };
    const onContactInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || (e.value) || '';
        let _partnership = {...partnership};
        (_partnership.contact as any)[`${name}`] = val;
        setPartnership(_partnership);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label={t('new')} icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew}/>
                    <Button label={t('delete')} icon="pi pi-trash" severity="danger" className=" mr-2"
                            onClick={confirmDeleteSelected}
                            disabled={!selectedPartnerships || !selectedPartnerships.length}/>
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label={t('export')} icon="pi pi-upload" severity="help" onClick={exportCSV}/>
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData: Partnership) => {
        return (
            <>
                <span className="p-column-title">{t('name')}</span>
                {rowData.name}
            </>
        );
    };
    const surnameBodyTemplate = (rowData: Partnership) => {
        return (
            <>
                <span className="p-column-title">{t('partnership.surname')}</span>
                {rowData.surname}
            </>
        );
    };

    const shareRatioBodyTemplate = (rowData: Partnership) => {
        return (
            <>
                <span className="p-column-title">{t('partnership.shareRatio')}</span>
                {rowData.shareRatio}
            </>
        );
    };


    const dutyBodyTemplate = (rowData: Partnership) => {
        return (
            <>
                <span className="p-column-title">{t('partnership.duty')}</span>
                <MultiSelect value={rowData.duties} options={PartnershipService.getDuties(t)} disabled={true} readOnly={true}
                             placeholder={t('partnership.selectDuty')} display="chip" optionLabel="name" optionValue="code"/>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Partnership) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2"
                        onClick={() => editPartnership(rowData)}/>
                <Button icon="pi pi-trash" rounded severity="warning"
                        onClick={() => confirmDeletePartnership(rowData)}/>
            </>
        );
    };

    const header = (
        <div className="flex md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t('partnership.manage')}</h5>
        </div>
    );

    const partnershipDialogFooter = (
        <>
            <Button label={t('cancel')} icon="pi pi-times" text onClick={hideDialog}/>
            <Button label={t('save')} icon="pi pi-check" text onClick={savePartnership}/>
        </>
    );
    const deletePartnershipDialogFooter = (
        <>
            <Button label={t('no')} icon="pi pi-times" text onClick={hideDeletePartnershipDialog}/>
            <Button label={t('yes')} icon="pi pi-check" text onClick={deletePartnership}/>
        </>
    );
    const deletePartnershipsDialogFooter = (
        <>
            <Button label={t('no')} icon="pi pi-times" text onClick={hideDeletePartnershipsDialog}/>
            <Button label={t('yes')} icon="pi pi-check" text onClick={deleteSelectedPartnerships}/>
        </>
    );

    function getPartnershipDialog() {
        return <Dialog visible={partnershipDialog} style={{width: '650px'}} header={t('partnership.detail')} modal
                       className="p-fluid" footer={partnershipDialogFooter} onHide={hideDialog}>

            <div className="grid p-fluid mt-3">
                <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputText id="name" value={partnership.name} required onChange={(e) => onInputChange(e, 'name')}
                               className={classNames({'p-invalid': isFormFieldValid('name')})}/>
                    <label htmlFor="name"
                           className={classNames({'p-error': isFormFieldValid('name')})}>{t('name')}*</label>
                </span>
                    {getFormErrorMessage('name')}
                </div>
                <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputText id="surname" value={partnership.surname} required
                               onChange={(e) => onInputChange(e, 'surname')}
                               className={classNames({'p-invalid': isFormFieldValid('surname')})}/>
                    <label htmlFor="surname"
                           className={classNames({'p-error': isFormFieldValid('surname')})}>{t('partnership.surname')}*</label>
                </span>
                    {getFormErrorMessage('surname')}
                </div>
                <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputMask id="tckn" value={partnership.tckn} mask="99999999999"
                               onChange={(e) => onInputChange(e, 'tckn')}
                               className={classNames({'p-invalid': isFormFieldValid('tckn')})}/>
                    <label htmlFor="tckn"
                           className={classNames({'p-error': isFormFieldValid('tckn')})}>{t('partnership.tckn')}*</label>
                </span>
                    {getFormErrorMessage('tckn')}
                </div>
                <div className="field col-12 md:col-6">
                <span className="p-float-label ">
                    <InputText id="passport" value={partnership.passport}
                               onChange={(e) => onInputChange(e, 'passport')}
                               className={classNames({'p-invalid': isFormFieldValid('passport')})}/>
                    <label htmlFor="passport"
                           className={classNames({'p-error': isFormFieldValid('passport')})}>{t('partnership.passport')}</label>
                </span>
                    {getFormErrorMessage('passport')}
                </div>
                <div className="field col-12">
                <span className="p-float-label">
                    <InputNumber id="shareRatio" value={partnership.shareRatio} min={0} max={100} inputMode={"numeric"}
                                 onChange={(e) => onInputChange(e, 'shareRatio')}
                                 className={classNames({'p-invalid': isFormFieldValid('shareRatio')})}/>
                    <Slider value={partnership.shareRatio} min={0} max={100}
                            onChange={(e) => onInputChange(e, 'shareRatio')}/>
                    <label htmlFor="shareRatio"
                           className={classNames({'p-error': isFormFieldValid('shareRatio')})}>{t('partnership.shareRatio')}*</label>
                </span>
                    {getFormErrorMessage('shareRatio')}
                </div>
                <div className="field col-12">
                <span className="p-float-label">
                    <MultiSelect id="duties" value={partnership.duties} options={PartnershipService.getDuties(t)}
                                 placeholder={t('partnership.selectDuty')} display="chip" optionLabel="name" optionValue="code"
                                 onChange={(e) => onInputChange(e, 'duties')}
                                 className={classNames({'p-invalid': isFormFieldValid('duties')})}/>
                    <label htmlFor="duties" className={classNames({'p-error': isFormFieldValid('duties')})}>
                        {t('partnership.duty')}*
                    </label>
                </span>
                    {getFormErrorMessage('duties')}
                </div>

                <div className="field col-12">
                <span className="p-float-label">
                    <InputTextarea id="address" value={partnership.contact.address} rows={4}
                                   onChange={(e) => onContactInputChange(e, 'address')}/>
                    <label htmlFor="address">{t('partnership.address')}</label>
                </span>
                </div>
                <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputText id="city" type="text" value={partnership.contact.city}
                               onChange={(e) => onContactInputChange(e, 'city')}/>
                    <label htmlFor="city">{t('partnership.city')}</label>
                </span>
                </div>
                <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputMask id="tel" mask="(999) 999-9999" value={partnership.contact.telNo}
                               onChange={(e) => onContactInputChange(e, 'telNo')}/>
                    <label htmlFor="tel">{t('partnership.telephone')}</label>
                </span>
                </div>
                <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputText id="email" type="text" value={partnership.contact.email}
                               onChange={(e) => onContactInputChange(e, 'email')}
                               className={classNames({'p-error': isFormFieldValid('email')})}/>
                    <label htmlFor="email"
                           className={classNames({'p-error': isFormFieldValid('email')})}>{t('email')}*</label>
                </span>
                    {getFormErrorMessage('email')}
                </div>
                <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputText id="website" type="text" value={partnership.contact.website}
                               onChange={(e) => onContactInputChange(e, 'website')}/>
                    <label htmlFor="website">{t('partnership.website')}</label>
                </span>
                </div>
            </div>

        </Dialog>;
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={partnerships} selection={selectedPartnerships}
                               onSelectionChange={(e) => setSelectedPartnerships(e.value as any)}
                               dataKey="$id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               className="datatable-responsive"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate={t('currentPageReportTemplate', {objects: t('partnership.partnerships')})}
                               globalFilter={globalFilter}
                               emptyMessage={t('dataNotFound', {objects: t('partnership.partnerships')})}
                               header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{width: '4rem'}}></Column>
                        <Column field="name" header={t('name')} sortable body={nameBodyTemplate}
                                headerStyle={{minWidth: '15rem'}}></Column>
                        <Column field="surname" header={t('partnership.surname')} sortable body={surnameBodyTemplate}
                                headerStyle={{minWidth: '15rem'}}></Column>
                        <Column field="shareRatio" header={t('partnership.shareRatio')} sortable
                                body={shareRatioBodyTemplate}
                                headerStyle={{minWidth: '15rem'}}></Column>
                        <Column field="duty" header={t('partnership.duty')} body={dutyBodyTemplate} sortable
                                headerStyle={{minWidth: '10rem'}}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>
                    </DataTable>

                    {getPartnershipDialog()}

                    <Dialog visible={deletePartnershipDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={deletePartnershipDialogFooter} onHide={hideDeletePartnershipDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {partnership && (
                                <span>
                                    {t('areSureDelete')} <b>{partnership.name} {partnership.surname}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePartnershipsDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={deletePartnershipsDialogFooter} onHide={hideDeletePartnershipsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {partnership && <span>{t('partnership.areSureDelete')}</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default PartnershipCrud;
