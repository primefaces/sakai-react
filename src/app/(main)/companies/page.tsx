/* eslint-disable @next/next/no-img-element */
'use client';
import {Button} from 'primereact/button';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Toast} from 'primereact/toast';
import {Toolbar} from 'primereact/toolbar';
import {classNames} from 'primereact/utils';
import React, {useEffect, useRef, useState} from 'react';
import {CompanyService} from '../../../service/CompanyService';
import {useRouter} from "next/navigation";
import {Company} from "../../../service/types/company/Company";
import {FileUpload, FileUploadSelectEvent} from "primereact/fileupload";
import {pdfjs} from "react-pdf";
import {PDFDocumentProxy} from "pdfjs-dist";
import {useUser} from "../../../layout/context/usercontext";
import {Contact} from "../../../service/types/contact/Contact";
import {Calendar} from "primereact/calendar";
import {InputTextarea} from "primereact/inputtextarea";
import {InputMask} from "primereact/inputmask";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const CompanyCrud = () => {

    const router = useRouter();
    let emptyCompany: Company = {
        financials: [],
        name: '',
        taxNo: '',
        taxAdministration: '',
        tradeRegisterNo: '',
        contact: new Contact(),
        partnerships: []
    };

    const [companies, setCompanies] = useState<Company[]>();
    const [companyDialog, setCompanyDialog] = useState(false);
    const [deleteCompanyDialog, setDeleteCompanyDialog] = useState(false);
    const [deleteCompaniesDialog, setDeleteCompaniesDialog] = useState(false);
    const [companySelectDialog, setCompanySelectDialog] = useState(false);
    const [company, setCompany] = useState<Company>(emptyCompany);
    const [selectedCompanies, setSelectedCompanies] = useState<Company[]>();
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Map<string, string>>(new Map());
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const user = useUser();

    useEffect(() => {
        CompanyService.list().then((data) => {
            setCompanies(data.documents as any)
        });
    }, []);

    const isFormFieldValid = (name: string) => {
        return !!(submitted && errors.get(name));
    }

    const getFormErrorMessage = (name: string) => {
        return isFormFieldValid(name) && <small className="p-error">{errors.get(name)}</small>;
    };

    const openNew = () => {
        setCompany(emptyCompany);
        setSubmitted(false);
        setCompanyDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCompanyDialog(false);
    };

    const hideDeleteCompanyDialog = () => {
        setDeleteCompanyDialog(false);
    };

    const hideDeleteCompaniesDialog = () => {
        setDeleteCompaniesDialog(false);
    };

    const hideCompanySelectDialog = () => {
        setCompanySelectDialog(false);
    };


    const validate= () => {
        let errors: Map<string,string> = new Map()

        if (!company.name) {
            errors.set("name",'Name is required.')
        }
        if (!company.taxNo) {
            errors.set("taxNo",'Tax No is required.')
        }
        if (!company.taxAdministration) {
            errors.set("taxAdministration",'Tax Administration is required.')
        }
        if (!company.establishmentDate) {
            errors.set("establishmentDate",'Establishment Date is required.')
        }

        if (!company.contact.email) {
            errors.set("email",'Email is required.')
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(company.contact.email)) {
            errors.set("email",'Invalid email address. E.g. example@email.com')
        }
        return errors;
    };

    const saveCompany = () => {
        setSubmitted(true);
        let errors = validate()
        setErrors(errors)
        debugger
        if (errors.size == 0) {
            let _companies = [...(companies as Company[])];
            let _company = {...company};
            if (company.$id) {
                CompanyService.update(company.$id, _company).then(r => {
                    let index = findIndexById(company.$id as string);
                    _companies[index] = _company;
                    toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Company Updated', life: 3000})
                    setCompanies(_companies as any);
                    setCompanyDialog(false);
                    setCompany(emptyCompany);
                })
            } else {
                debugger
                CompanyService.add(_company).then(r => {
                    _companies.push(r as any);
                    toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000});
                    setCompanies(_companies as any);
                    setCompanyDialog(false);
                    setCompany(emptyCompany);
                }).catch(e => {
                    debugger
                    console.log(e)
                })
            }
        }
    };

    const editCompany = (company: Company) => {
        setCompany({...company});
        setCompanyDialog(true);
    };

    const confirmDeleteCompany = (company: Company) => {
        setCompany(company);
        setDeleteCompanyDialog(true);
    };

    const deleteCompany = () => {
        let _companies = (companies as any)?.filter((val: any) => val.$id !== company.$id);
        CompanyService.remove(company.$id as string).then(r => {
            setCompanies(_companies);
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Company Deleted', life: 3000});
            setDeleteCompanyDialog(false);
            setCompany(emptyCompany);
        })
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (companies as any)?.length; i++) {
            if ((companies as any)[i].$id === id) {
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
        setDeleteCompaniesDialog(true);
    };

    const openSelectCompany = () => {
        setCompanySelectDialog(true);
    };

    const selectCompany = () => {
        let company = (selectedCompanies as Company[])[0]
        setCompanySelectDialog(false);
        setSelectedCompanies([]);
        toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Company Selected', life: 3000});

        localStorage.setItem("company", JSON.stringify(company));
        router.push('/financials?companyId=' + company.$id);
    };

    const deleteSelectedCompanies = () => {
        let _companies = (companies as any)?.filter((val: any) => !(selectedCompanies as Company[])?.includes(val));

        CompanyService.removeAll((selectedCompanies as Company[]).map((val: any) => val.$id)).then(r => {
            setCompanies(_companies);
            setDeleteCompaniesDialog(false);
            setSelectedCompanies([]);
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Companies Deleted', life: 3000});
        })
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _company = {...company};
        (_company as any)[`${name}`] = val;
        setCompany(_company);
    };
    const onContactInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _company = {...company};
        (_company.contact as any)[`${name}`] = val;
        setCompany(_company);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew}/>
                    <Button label="Delete" icon="pi pi-trash" severity="danger" className=" mr-2"
                            onClick={confirmDeleteSelected}
                            disabled={!selectedCompanies || !(selectedCompanies as any).length}/>
                    <Button label="Select Company" icon="pi pi-plus" severity="success" className=" mr-2"
                            onClick={openSelectCompany}
                            disabled={!selectedCompanies || (selectedCompanies as any).length != 1}/>
                </div>
            </React.Fragment>
        );
    };

    async function extractLines(pdf: PDFDocumentProxy) {
        let extractedText = '';
        let lines = []
        let bilancoStart = 0, bilancoFinish = 0
        let gelirStart = 0, gelirFinish = 0
        let ortaklarStart = 0, ortaklarFinish = 0
        for (let i = 0; i < pdf.numPages; i++) {
            let page = await pdf.getPage(i + 1)
            const textContent = await page.getTextContent()
            for (let i = 0; i < textContent.items.length; i++) {
                let item = (textContent.items[i] as any)
                let text = item.str.trim()
                if (text != "" && extractedText != "" && extractedText != ".") {
                    extractedText += "|" + text
                } else {
                    extractedText += text
                }
                if (item.hasEOL) {
                    if (extractedText == "E K L E R") {
                        bilancoStart = lines.length + 6
                    } else if (extractedText == "DİPNOT") {
                        if (bilancoFinish == 0) {
                            bilancoFinish = lines.length - 1
                        } else if (gelirFinish == 0) {
                            gelirFinish = lines.length - 1
                        }
                    } else if (extractedText == "GELİR TABLOSU") {
                        gelirStart = lines.length + 3
                    } else if (extractedText == "KURUM ORTAKLARINA VE YÖNETİM KURULU ÜYELERİNE İLİŞKİN LİSTE") {
                        ortaklarStart = lines.length + 25
                    } else if (ortaklarFinish == 0 && (extractedText == "YABANCI PARA POZİSYONUNA İLİŞKİN BİLGİLER" ||
                        extractedText == "TRANSFER FİYATLANDIRMASI KAPSAMINDAKİ İLİŞKİLİ KİŞİLERE İLİŞKİN BİLGİLER" ||
                        extractedText == "TRANSFER FİYATLANDIRMASINA KONU OLAN İŞLEMLERDE KULLANILAN YÖNTEMLER")) {
                        ortaklarFinish = lines.length - 1
                    }
                    lines.push(extractedText)
                    extractedText = ""
                }
            }
        }
        return {
            "bilanco": {
                "start": bilancoStart,
                "finish": bilancoFinish,
            },
            "gelir": {
                "start": gelirStart,
                "finish": gelirFinish,
            },
            "ortak": {
                "start": ortaklarStart,
                "finish": ortaklarFinish,
            },
            "lines": lines
        }
    }

    const onSelect = async (e: FileUploadSelectEvent) => {

        if (e.files && e.files[0]) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const contents = (e.target as FileReader).result;
                const pdf = await pdfjs.getDocument(contents as ArrayBuffer).promise;
                let extracted = await extractLines(pdf);
                let company = CompanyService.extractCompanyInfo(extracted.lines)
                let {financial, financialPrev} = CompanyService.extractBilanco(extracted.lines, extracted.bilanco, extracted.gelir)
                company.partnerships = CompanyService.extractPartnership(extracted.lines, extracted.ortak)
                company.financials.push(financial, financialPrev)
                debugger
                CompanyService.add(company).then(r => {
                    companies?.push(company)
                    setCompanies(companies);
                    setSubmitted(true)
                    toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000});
                }).catch(e => {
                    debugger
                    console.log(e)
                })
            };
            reader.readAsArrayBuffer(e.files[0]);
        }
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="pdf" maxFileSize={1000000} chooseLabel="Import"
                            className="mr-2 inline-block" onSelect={onSelect}/>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV}/>
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData: Company) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const establishmentDateBodyTemplate = (rowData: Company) => {
        return (
            <>
                <span className="p-column-title">Establishment Date</span>
                {rowData.establishmentDate}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Company) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2"
                        onClick={() => editCompany(rowData)}/>
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteCompany(rowData)}/>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Companies</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                           placeholder="Search..."/>
            </span>
        </div>
    );

    const companyDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" text onClick={saveCompany}/>
        </>
    );
    const deleteCompanyDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCompanyDialog}/>
            <Button label="Yes" icon="pi pi-check" text onClick={deleteCompany}/>
        </>
    );
    const deleteCompaniesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCompaniesDialog}/>
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedCompanies}/>
        </>
    );

    const companySelectDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideCompanySelectDialog}/>
            <Button label="Yes" icon="pi pi-check" text onClick={selectCompany}/>
        </>
    );

    function getCompanyDialog() {
        return <Dialog visible={companyDialog} style={{width: '650px'}} header="Company Details" modal
                       className="p-fluid" footer={companyDialogFooter} onHide={hideDialog}>
            <div className="grid p-fluid mt-3">
                <div className="field col-12">
                    <span className="p-float-label">
                        <InputText id="name" value={company.name} required
                                   onChange={(e) => onInputChange(e, 'name')}
                                   className={classNames({'p-invalid': isFormFieldValid('name')})}/>
                        <label htmlFor="name" className={classNames({'p-error': isFormFieldValid('name')})}>Name*</label>
                    </span>
                    {getFormErrorMessage('name')}
                </div>

                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <Calendar inputId="establishmentDate" value={company.establishmentDate} required
                                  onChange={(e) => onInputChange(e, 'establishmentDate')}
                                  className={classNames({'p-error': isFormFieldValid('establishmentDate')})}/>
                        <label htmlFor="establishmentDate" className={classNames({'p-error': isFormFieldValid('establishmentDate')})}>Establishment Date*</label>
                    </span>
                    {getFormErrorMessage('establishmentDate')}
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText id="tradeRegisterNo" value={company.tradeRegisterNo}
                                   onChange={(e) => onInputChange(e, 'tradeRegisterNo')}/>
                        <label htmlFor="tradeRegisterNo">Trade Register No</label>
                    </span>
                </div>

                <div className="field col-12 md:col-6">
                    <span className="p-float-label ">
                        <InputText id="taxAdministration" value={company.taxAdministration} required
                                   onChange={(e) => onInputChange(e, 'taxAdministration')}
                                   className={classNames({'p-error': isFormFieldValid('taxAdministration')})}/>
                        <label htmlFor="taxAdministration" className={classNames({'p-error': isFormFieldValid('taxAdministration')})}>Tax Administration*</label>
                    </span>
                    {getFormErrorMessage('taxAdministration')}
                </div>

                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText id="taxNo" value={company.taxNo} required
                                   onChange={(e) => onInputChange(e, 'taxNo')}
                                   className={classNames({'p-error': isFormFieldValid('taxNo')})}/>
                        <label htmlFor="taxNo" className={classNames({'p-error': isFormFieldValid('taxNo')})}>Tax No*</label>
                    </span>
                    {getFormErrorMessage('taxNo')}
                </div>

                <div className="field col-12">
                    <span className="p-float-label">
                        <InputTextarea id="address" value={company.contact.address} rows={4}
                                   onChange={(e) => onContactInputChange(e, 'address')}/>
                        <label htmlFor="address">Address</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText id="city" type="text" value={company.contact.city} onChange={(e) => onContactInputChange(e, 'city')}/>
                        <label htmlFor="city">City</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputMask id="tel" mask="(999) 999-9999" value={company.contact.telNo} onChange={(e) => onContactInputChange(e, 'telNo')}/>
                        <label htmlFor="tel">Telephone</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText id="email" type="text" value={company.contact.email} onChange={(e) => onContactInputChange(e, 'email')}
                                   className={classNames({'p-error': isFormFieldValid('email')})}/>
                        <label htmlFor="email" className={classNames({'p-error': isFormFieldValid('email')})}>Email*</label>
                    </span>
                    {getFormErrorMessage('email')}
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText id="website" type="text" value={company.contact.website} onChange={(e) => onContactInputChange(e, 'website')}/>
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
                    <DataTable
                        ref={dt}
                        value={companies}
                        selection={selectedCompanies}
                        onSelectionChange={(e) => setSelectedCompanies(e.value as any)}
                        dataKey="$id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} companies"
                        globalFilter={globalFilter}
                        emptyMessage="No companies found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{width: '4rem'}}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate}
                                headerStyle={{minWidth: '15rem'}}></Column>
                        <Column field="establishmentDate" header="Establishment Date" sortable
                                body={establishmentDateBodyTemplate}
                                headerStyle={{minWidth: '10rem'}}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>
                    </DataTable>

                    {getCompanyDialog()}

                    <Dialog visible={deleteCompanyDialog} style={{width: '450px'}} header="Confirm" modal
                            footer={deleteCompanyDialogFooter} onHide={hideDeleteCompanyDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {company && (
                                <span>
                                    Are you sure you want to delete <b>{company.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCompaniesDialog} style={{width: '450px'}} header="Confirm" modal
                            footer={deleteCompaniesDialogFooter} onHide={hideDeleteCompaniesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {company && <span>Are you sure you want to delete the selected companies?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={companySelectDialog} style={{width: '450px'}} header="Confirm" modal
                            footer={companySelectDialogFooter} onHide={hideCompanySelectDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {company && <span>Are you sure you want to select company?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CompanyCrud;
