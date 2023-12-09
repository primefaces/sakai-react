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
import {Company} from "../../../service/types/company/Company";
import {Partnership} from "../../../service/types/company/partnership/Partnership";
import {Slider} from "primereact/slider";
import {MultiSelect} from "primereact/multiselect";
import {Contact} from "../../../service/types/contact/Contact";
import {Chips} from "primereact/chips";
import {InputTextarea} from "primereact/inputtextarea";
import {InputMask} from "primereact/inputmask";

const PartnershipCrud = () => {

    let emptyPartnership: Partnership = {
        name: "",
        surname: "",
        tckn: "",
        passport: "",
        duties : [],
        contact : new Contact(),
    }

    const [company, setCompany] = useState<Company>();
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

    useEffect(() => {
        let companyString = localStorage.getItem("company");

        if (companyString == null) {
            let company = new Company()
            PartnershipService.list().then((data) => company.partnerships = data.documents as unknown as Partnership[]);
        } else {
            let company = JSON.parse(companyString) as Company;
            setCompany(company)
        }
    }, []);

    const isFormFieldValid = (name: string) => {
        return !!(submitted && errors.get(name));
    }

    const getFormErrorMessage = (name: string) => {
        return isFormFieldValid(name) && <small className="p-error">{errors.get(name)}</small>;
    };

    const openNew = () => {
        emptyPartnership.company = company?.$id
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

    const validate= () => {
        let errors: Map<string,string> = new Map()

        if (!partnership.name) {
            errors.set("name",'Name is required.')
        }
        if (!partnership.surname) {
            errors.set("surname",'Surname is required.')
        }
        if (!partnership.shareRatio) {
            errors.set("shareRatio",'Share Ratio is required.')
        }
        if (!partnership.tckn ) {
            errors.set("tckn",'T.C No is required.')
        }
        if (!partnership.duties || partnership.duties.length == 0 ) {
            errors.set("duties",'Duty is required.')
        }
        if (!partnership.contact.email) {
            errors.set("email",'Email is required.')
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(partnership.contact.email)) {
            errors.set("email",'Invalid email address. E.g. example@email.com')
        }
        return errors;
    };

    const savePartnership = () => {
        setSubmitted(true);
        let errors = validate()
        setErrors(errors)
        debugger
        if (errors.size == 0) {
            let _partnerships = [...(company!.partnerships as Partnership[])];
            let _partnership = {...partnership};
            if (partnership.$id) {
                PartnershipService.update(partnership.$id, _partnership as Partnership).then(r => {
                    let index = findIndexById(partnership.$id as string);
                    company!.partnerships[index] = _partnership;
                    toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Partnership Updated', life: 3000})
                    setPartnershipDialog(false);
                    setPartnership(emptyPartnership);
                    localStorage.setItem("company", JSON.stringify(company));
                }).catch(e => {
                    debugger
                    console.log(e)
                })
            } else {
                PartnershipService.add(_partnership as Partnership).then(r => {
                    toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Partnership Created', life: 3000});
                    _partnerships.push(r as unknown as Partnership);
                    company!.partnerships = _partnerships;
                    setPartnershipDialog(false);
                    setPartnership(emptyPartnership);
                    localStorage.setItem("company", JSON.stringify(company));
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
        localStorage.setItem("company", JSON.stringify(company));
    };

    const deletePartnership = () => {
        let _partnerships = company?.partnerships?.filter((val: Partnership) => val.$id !== partnership.$id);
        PartnershipService.remove(partnership.$id as string).then(r => {
            company!.partnerships = _partnerships as Partnership[];
            setDeletePartnershipDialog(false);
            setPartnership(emptyPartnership);
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Partnership Deleted', life: 3000});

            setCompany(company)
            localStorage.setItem("company", JSON.stringify(company));

        })
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < company!.partnerships.length; i++) {
            if (company?.partnerships[i].$id === id) {
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
        let _partnerships = company?.partnerships?.filter((val: Partnership) => !selectedPartnerships?.includes(val));

        PartnershipService.removeAll(selectedPartnerships!.map((val: Partnership) => val.$id!)).then(r => {
            company!.partnerships = _partnerships as Partnership[];
            setDeletePartnershipsDialog(false);
            setSelectedPartnerships([]);
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Partnerships Deleted', life: 3000});
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
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew}/>
                    <Button label="Delete" icon="pi pi-trash" severity="danger" className=" mr-2"
                            onClick={confirmDeleteSelected}
                            disabled={!selectedPartnerships || !selectedPartnerships.length}/>
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV}/>
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData: Partnership) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };
    const surnameBodyTemplate = (rowData: Partnership) => {
        return (
            <>
                <span className="p-column-title">Surname</span>
                {rowData.surname}
            </>
        );
    };

    const shareRatioBodyTemplate = (rowData: Partnership) => {
        return (
            <>
                <span className="p-column-title">Share Ratio</span>
                {rowData.shareRatio}
            </>
        );
    };


    const dutyBodyTemplate = (rowData: Partnership) => {
        return (
            <>
                <span className="p-column-title">Duty</span>
                <Chips disabled value={rowData.duties}/>
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
            <h5 className="m-0">Manage Partnerships</h5>
        </div>
    );

    const partnershipDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" text onClick={savePartnership}/>
        </>
    );
    const deletePartnershipDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePartnershipDialog}/>
            <Button label="Yes" icon="pi pi-check" text onClick={deletePartnership}/>
        </>
    );
    const deletePartnershipsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePartnershipsDialog}/>
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedPartnerships}/>
        </>
    );

    function getPartnershipDialog() {
        return <Dialog visible={partnershipDialog} style={{width: '650px'}} header="Partnership Details" modal
                       className="p-fluid" footer={partnershipDialogFooter} onHide={hideDialog}>

            <div className="grid p-fluid mt-3">
            <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputText id="name" value={partnership.name} required
                               onChange={(e) => onInputChange(e, 'name')}
                               className={classNames({'p-invalid': isFormFieldValid('name')})}/>
                    <label htmlFor="name"
                           className={classNames({'p-error': isFormFieldValid('name')})}>Name*</label>
                </span>
                {getFormErrorMessage('name')}
            </div>
            <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputText id="surname" value={partnership.surname} required
                               onChange={(e) => onInputChange(e, 'surname')}
                               className={classNames({'p-invalid': isFormFieldValid('surname')})}/>
                    <label htmlFor="surname"
                           className={classNames({'p-error': isFormFieldValid('surname')})}>Surname*</label>
                </span>
                {getFormErrorMessage('surname')}
            </div>
            <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputMask id="tckn" value={partnership.tckn} mask="99999999999"
                               onChange={(e) => onInputChange(e, 'tckn')}
                               className={classNames({'p-invalid': isFormFieldValid('tckn')})}/>
                    <label htmlFor="tckn" className={classNames({'p-error': isFormFieldValid('tckn')})}>TC Kimlik No*</label>
                </span>
                {getFormErrorMessage('tckn')}
            </div>
            <div className="field col-12 md:col-6">
                <span className="p-float-label ">
                    <InputText id="passport" value={partnership.passport}
                               onChange={(e) => onInputChange(e, 'passport')}
                               className={classNames({'p-invalid': isFormFieldValid('passport')})}/>
                    <label htmlFor="passport"
                           className={classNames({'p-error': isFormFieldValid('passport')})}>Passport No</label>
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
                           className={classNames({'p-error': isFormFieldValid('shareRatio')})}>Share Ratio*</label>
                </span>
                {getFormErrorMessage('shareRatio')}
            </div>
            <div className="field col-12">
                <span className="p-float-label">
                    <MultiSelect id="duties" value={partnership.duties} options={PartnershipService.getDuties()} placeholder="Select Duty" display="chip"
                                 onChange={(e) => onInputChange(e, 'duties')}
                                 className={classNames({'p-invalid': isFormFieldValid('duties')})}/>
                    <label htmlFor="duties"
                           className={classNames({'p-error': isFormFieldValid('duties')})}>Duty*</label>
                </span>
                {getFormErrorMessage('duties')}
            </div>

            <div className="field col-12">
                <span className="p-float-label">
                    <InputTextarea id="address" value={partnership.contact.address} rows={4}
                                   onChange={(e) => onContactInputChange(e, 'address')}/>
                    <label htmlFor="address">Address</label>
                </span>
            </div>
            <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputText id="city" type="text" value={partnership.contact.city} onChange={(e) => onContactInputChange(e, 'city')}/>
                    <label htmlFor="city">City</label>
                </span>
            </div>
            <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputMask id="tel" mask="(999) 999-9999" value={partnership.contact.telNo} onChange={(e) => onContactInputChange(e, 'telNo')}/>
                    <label htmlFor="tel">Telephone</label>
                </span>
            </div>
            <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputText id="email" type="text" value={partnership.contact.email} onChange={(e) => onContactInputChange(e, 'email')}
                               className={classNames({'p-error': isFormFieldValid('email')})}/>
                    <label htmlFor="email" className={classNames({'p-error': isFormFieldValid('email')})}>Email*</label>
                </span>
                {getFormErrorMessage('email')}
            </div>
            <div className="field col-12 md:col-6">
                <span className="p-float-label">
                    <InputText id="website" type="text" value={partnership.contact.website} onChange={(e) => onContactInputChange(e, 'website')}/>
                    <label htmlFor="website">Website</label>
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

                    <DataTable ref={dt} value={company?.partnerships} selection={selectedPartnerships}
                               onSelectionChange={(e) => setSelectedPartnerships(e.value as any)}
                               dataKey="$id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               className="datatable-responsive"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} partnerships"
                               globalFilter={globalFilter}
                               emptyMessage="No partnerships found." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{width: '4rem'}}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate}
                                headerStyle={{minWidth: '15rem'}}></Column>
                        <Column field="surname" header="Surname" sortable body={surnameBodyTemplate}
                                headerStyle={{minWidth: '15rem'}}></Column>
                        <Column field="shareRatio" header="Share Ratio" sortable body={shareRatioBodyTemplate}
                                headerStyle={{minWidth: '15rem'}}></Column>
                        <Column field="duty" header="Duty" body={dutyBodyTemplate} sortable
                                headerStyle={{minWidth: '10rem'}}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>
                    </DataTable>

                    {getPartnershipDialog()}

                    <Dialog visible={deletePartnershipDialog} style={{width: '450px'}} header="Confirm" modal
                            footer={deletePartnershipDialogFooter} onHide={hideDeletePartnershipDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {partnership && (
                                <span>
                                    Are you sure you want to delete <b>{partnership.name} {partnership.surname}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePartnershipsDialog} style={{width: '450px'}} header="Confirm" modal
                            footer={deletePartnershipsDialogFooter} onHide={hideDeletePartnershipsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {partnership && <span>Are you sure you want to delete the selected partnerships?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default PartnershipCrud;
