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
import {Contact} from "../../../service/types/contact/Contact";
import {Calendar} from "primereact/calendar";
import {InputTextarea} from "primereact/inputtextarea";
import {InputMask} from "primereact/inputmask";
import {FinancialService} from "../../../service/FinancialService";
import {PartnershipService} from "../../../service/PartnershipService";
import {useUser} from "../../../layout/context/usercontext";
import {useTranslation} from "react-i18next";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const CompanyCrud = () => {

    const router = useRouter();
    let emptyCompany: Company = {
        name: '',
        taxNo: '',
        taxAdministration: '',
        tradeRegisterNo: '',
        contact: new Contact(),
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
    const {t} = useTranslation();

    useEffect(() => {
        if (!user.loadingUser && user.current != null) {
            if (!(user.current as any).labels.includes("admin")) {
                CompanyService.list().then((data) => {
                    setCompanies(data.documents as any)
                });
            } else {
                CompanyService.list(user.current.$id).then((data) => {
                    setCompanies(data.documents as any)
                });
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
        emptyCompany.userId = user.current?.$id
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

    const validate = () => {
        let errors: Map<string, string> = new Map()

        if (!company.name) {
            errors.set("name", t('name.required'))
        }
        if (!company.taxNo) {
            errors.set("taxNo", t('company.taxNo.required'))
        }
        if (!company.taxAdministration) {
            errors.set("taxAdministration", t('company.taxAdministration.required'))
        }
        if (!company.establishmentDate) {
            errors.set("establishmentDate", t('company.establishmentDate.required'))
        }

        if (!company.contact.email) {
            errors.set("email", t('email.required'))
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(company.contact.email)) {
            errors.set("email", t('email.invalid'))
        }
        return errors;
    };

    const saveCompany = () => {
        setSubmitted(true);
        let errors = validate()
        setErrors(errors)
        if (errors.size == 0) {
            let _companies = [...(companies as Company[])];
            let _company = {...company};
            if (company.$id) {
                CompanyService.update(company.$id, _company).then(r => {
                    let index = findIndexById(company.$id as string);
                    _companies[index] = _company;
                    toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_updated'), life: 3000})
                    setCompanies(_companies as any);
                    setCompanyDialog(false);
                    setCompany(emptyCompany);
                })
            } else {
                CompanyService.add(_company).then(r => {
                    _companies.push(r as any);
                    toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_created'), life: 3000});
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
        CompanyService.get(company.$id!).then(c => {
            company = c as any
            setCompany({...company});
            setCompanyDialog(true);
        })
    };

    const confirmDeleteCompany = (company: Company) => {
        company.contact = new Contact()
        setCompany(company);
        setDeleteCompanyDialog(true);
    };

    const deleteCompany = () => {
        let _companies = (companies as any)?.filter((val: any) => val.$id !== company.$id);
        setSubmitted(true)
        CompanyService.remove(company.$id as string).then(r => {
            setCompanies(_companies);
            toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_deleted'), life: 3000});
            setDeleteCompanyDialog(false);
            setCompany(emptyCompany);
        }).finally(() => {
            setSubmitted(false)
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
        toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_selected'), life: 3000});
        user.selectCompany(company)
    };

    const deleteSelectedCompanies = () => {
        let _companies = (companies as any)?.filter((val: any) => !(selectedCompanies as Company[])?.includes(val));
        setSubmitted(true)
        CompanyService.removeAll((selectedCompanies as Company[]).map((val: any) => val.$id)).then(r => {
            setCompanies(_companies);
            setDeleteCompaniesDialog(false);
            setSelectedCompanies([]);
            toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_deleted'), life: 3000});
        }).finally(() => {
            setSubmitted(false)
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
                    <Button label={t('new')} icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew}/>
                    <Button label={t('delete')} icon="pi pi-trash" severity="danger" className=" mr-2"
                            onClick={confirmDeleteSelected}
                            disabled={!selectedCompanies || !(selectedCompanies as any).length}/>
                    <Button label={t('select')} icon="pi pi-plus" severity="success" className=" mr-2"
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
        setSubmitted(true)
        if (e.files && e.files[0]) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const contents = (e.target as FileReader).result;
                const pdf = await pdfjs.getDocument(contents as ArrayBuffer).promise;
                let extracted = await extractLines(pdf);
                let company = CompanyService.extractCompanyInfo(extracted.lines)
                debugger
                company.userId = user.current?.$id
                console.log(`File uploaded, bilanco generating.`)
                let {financial, financialPrev} = CompanyService.extractBilanco(extracted.lines, extracted.bilanco, extracted.gelir)
                console.log(`Bilanco generated, partnership generating.`)
                let partnerships = CompanyService.extractPartnership(extracted.lines, extracted.ortak)
                console.log(`Partnership generated, company saving.`)
                let financials = [financial, financialPrev]
                CompanyService.add(company).then(async r => {
                    companies?.push(r as any)
                    setCompanies(companies);

                    console.log(`Company added, financials saving.`)
                    for (const f of financials) {
                        f.companyId = r.$id
                        await FinancialService.add(f)
                    }
                    console.log(`Financials added, partnerships saving.`)
                    for (const p of partnerships) {
                        p.companyId = r.$id
                        await PartnershipService.add(p)
                    }
                    toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_created'), life: 3000});
                }).catch(e => {
                    debugger
                    console.log(e)
                }).finally(() => {
                    setSubmitted(false)
                })
            };
            reader.readAsArrayBuffer(e.files[0]);
        }
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="pdf" maxFileSize={1000000} chooseLabel={t('import')}
                            className="mr-2 inline-block" onSelect={onSelect} disabled={submitted}/>
                <Button label={t('export')} icon="pi pi-upload" severity="help" onClick={exportCSV}/>
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData: Company) => {
        return (
            <>
                <span className="p-column-title">{t('name')}</span>
                {rowData.name}
            </>
        );
    };

    const establishmentDateBodyTemplate = (rowData: Company) => {
        return (
            <>
                <span className="p-column-title">{t('company.establishmentDate')}</span>
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
            <h5 className="m-0">{t('company.manage')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                           placeholder={t('search' )+ '...'}/>
            </span>
        </div>
    );

    const companyDialogFooter = (
        <>
            <Button label={t('cancel')} icon="pi pi-times" text onClick={hideDialog}/>
            <Button label={t('save')} icon="pi pi-check" text onClick={saveCompany}/>
        </>
    );
    const deleteCompanyDialogFooter = (
        <>
            <Button label={t('no')} icon="pi pi-times" text onClick={hideDeleteCompanyDialog} disabled={submitted}/>
            <Button label={t('yes')} icon="pi pi-check" text onClick={deleteCompany} disabled={submitted}/>
        </>
    );
    const deleteCompaniesDialogFooter = (
        <>
            <Button label={t('no')} icon="pi pi-times" text onClick={hideDeleteCompaniesDialog} disabled={submitted}/>
            <Button label={t('yes')} icon="pi pi-check" text onClick={deleteSelectedCompanies} disabled={submitted}/>
        </>
    );

    const companySelectDialogFooter = (
        <>
            <Button label={t('no')} icon="pi pi-times" text onClick={hideCompanySelectDialog}/>
            <Button label={t('yes')} icon="pi pi-check" text onClick={selectCompany}/>
        </>
    );

    function getCompanyDialog() {
        return <Dialog visible={companyDialog} style={{width: '650px'}} header={t('company.details')} modal
                       className="p-fluid" footer={companyDialogFooter} onHide={hideDialog}>
            <div className="grid p-fluid mt-3">
                <div className="field col-12">
                    <span className="p-float-label">
                        <InputText id="name" value={company.name} required
                                   onChange={(e) => onInputChange(e, 'name')}
                                   className={classNames({'p-invalid': isFormFieldValid('name')})}/>
                        <label htmlFor="name"
                               className={classNames({'p-error': isFormFieldValid('name')})}>{t('name')}*</label>
                    </span>
                    {getFormErrorMessage('name')}
                </div>

                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <Calendar inputId="establishmentDate" value={company.establishmentDate} required
                                  onChange={(e) => onInputChange(e, 'establishmentDate')}
                                  className={classNames({'p-error': isFormFieldValid('establishmentDate')})}/>
                        <label htmlFor="establishmentDate"
                               className={classNames({'p-error': isFormFieldValid('establishmentDate')})}>{t('company.establishmentDate')}*</label>
                    </span>
                    {getFormErrorMessage('establishmentDate')}
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText id="tradeRegisterNo" value={company.tradeRegisterNo}
                                   onChange={(e) => onInputChange(e, 'tradeRegisterNo')}/>
                        <label htmlFor="tradeRegisterNo">{t('company.tradeRegisterNo')}</label>
                    </span>
                </div>

                <div className="field col-12 md:col-6">
                    <span className="p-float-label ">
                        <InputText id="taxAdministration" value={company.taxAdministration} required
                                   onChange={(e) => onInputChange(e, 'taxAdministration')}
                                   className={classNames({'p-error': isFormFieldValid('taxAdministration')})}/>
                        <label htmlFor="taxAdministration"
                               className={classNames({'p-error': isFormFieldValid('taxAdministration')})}>{t('company.taxAdministration')}*</label>
                    </span>
                    {getFormErrorMessage('taxAdministration')}
                </div>

                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText id="taxNo" value={company.taxNo} required
                                   onChange={(e) => onInputChange(e, 'taxNo')}
                                   className={classNames({'p-error': isFormFieldValid('taxNo')})}/>
                        <label htmlFor="taxNo"
                               className={classNames({'p-error': isFormFieldValid('taxNo')})}>{t('company.taxNo')}*</label>
                    </span>
                    {getFormErrorMessage('taxNo')}
                </div>

                <div className="field col-12">
                    <span className="p-float-label">
                        <InputTextarea id="address" value={company.contact.address} rows={4}
                                       onChange={(e) => onContactInputChange(e, 'address')}/>
                        <label htmlFor="address">{t('company.address')}</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText id="city" type="text" value={company.contact.city}
                                   onChange={(e) => onContactInputChange(e, 'city')}/>
                        <label htmlFor="city">{t('company.city')}</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputMask id="tel" mask="(999) 999-9999" value={company.contact.telNo}
                                   onChange={(e) => onContactInputChange(e, 'telNo')}/>
                        <label htmlFor="tel">{t('company.tel')}</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText id="email" type="text" value={company.contact.email}
                                   onChange={(e) => onContactInputChange(e, 'email')}
                                   className={classNames({'p-error': isFormFieldValid('email')})}/>
                        <label htmlFor="email"
                               className={classNames({'p-error': isFormFieldValid('email')})}>{t('email')}*</label>
                    </span>
                    {getFormErrorMessage('email')}
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText id="website" type="text" value={company.contact.website}
                                   onChange={(e) => onContactInputChange(e, 'website')}/>
                        <label htmlFor="website">{t('company.website')}</label>
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
                        currentPageReportTemplate={t('currentPageReportTemplate', {objects: t('company.companies')})}
                        globalFilter={globalFilter}
                        emptyMessage={t('dataNotFound', {objects: t('company.companies')})}
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{width: '4rem'}}></Column>
                        <Column field="name" header={t('name')} sortable body={nameBodyTemplate}
                                headerStyle={{minWidth: '15rem'}}></Column>
                        <Column field="establishmentDate" header={t('company.establishmentDate')} sortable
                                body={establishmentDateBodyTemplate}
                                headerStyle={{minWidth: '10rem'}}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>
                    </DataTable>

                    {getCompanyDialog()}

                    <Dialog visible={deleteCompanyDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={deleteCompanyDialogFooter} onHide={hideDeleteCompanyDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {company && (
                                <span>{t('areSureDelete')} <b>{company.name}</b>?</span>
                            )}
                        </div>
                    </Dialog>


                    <Dialog visible={deleteCompaniesDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={deleteCompaniesDialogFooter} onHide={hideDeleteCompaniesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {company && (
                                <span>{t('company.areSureDelete')}</span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCompaniesDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={deleteCompaniesDialogFooter} onHide={hideDeleteCompaniesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {company && (
                                <span>{t('company.areSureDelete')}</span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={companySelectDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={companySelectDialogFooter} onHide={hideCompanySelectDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {company && <span>{t('company.areSureSelect')}</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CompanyCrud;
