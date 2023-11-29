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
import {Company} from "../../../service/types/company/company";
import {FileUpload, FileUploadSelectEvent} from "primereact/fileupload";
import {pdfjs} from "react-pdf";
import {PDFDocumentProxy} from "pdfjs-dist";
import {useUser} from "../../../layout/context/usercontext";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const CompanyCrud = () => {

    const router = useRouter();
    let emptyCompany: Company = {
        financials: [],
        name: '',
        taxNo: ''
    };

    const [companies, setCompanies] = useState<Company[]>();
    const [companyDialog, setCompanyDialog] = useState(false);
    const [deleteCompanyDialog, setDeleteCompanyDialog] = useState(false);
    const [deleteCompaniesDialog, setDeleteCompaniesDialog] = useState(false);
    const [companySelectDialog, setCompanySelectDialog] = useState(false);
    const [company, setCompany] = useState<Company>(emptyCompany);
    const [selectedCompanies, setSelectedCompanies] = useState<Company[]>();
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const user = useUser();

    useEffect(() => {
        CompanyService.list().then((data) => {
            setCompanies(data.documents as any)
        });
    }, []);

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

    const saveCompany = () => {
        setSubmitted(true);

        if (company.name.trim()) {
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

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _company = {...company};
        (_company as any)[`${name}`] = val;
        setCompany(_company);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew}/>
                    <Button label="Delete" icon="pi pi-trash" severity="danger" className=" mr-2"
                            onClick={confirmDeleteSelected} disabled={!selectedCompanies || !(selectedCompanies as any).length}/>
                    <Button label="Select Company" icon="pi pi-plus" severity="success" className=" mr-2"
                            onClick={openSelectCompany} disabled={!selectedCompanies || (selectedCompanies as any).length != 1}/>
                </div>
            </React.Fragment>
        );
    };

    async function extractLines(pdf: PDFDocumentProxy) {
        let extractedText = '';
        let lines = []
        let bilancoStart = 0, bilancoFinish = 0
        let gelirStart = 0, gelirFinish = 0
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
                            gelirStart = lines.length + 7
                        } else {
                            gelirFinish = lines.length - 1
                        }
                    }

                    lines.push(extractedText)
                    extractedText = ""
                }
            }
        }
        return {bilancoStart, bilancoFinish, gelirStart, gelirFinish, lines};
    }

    const onSelect = async (e: FileUploadSelectEvent) => {

        if (e.files && e.files[0]) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const contents = (e.target as FileReader).result;
                const pdf = await pdfjs.getDocument(contents as ArrayBuffer).promise;
                let {bilancoStart, gelirStart, gelirFinish, lines} = await extractLines(pdf);
                let company = CompanyService.extractCompanyInfo(lines)
                let {financial, financialPrev} = CompanyService.extractBilanco(lines, bilancoStart, gelirStart, gelirFinish)
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

    const taxNoBodyTemplate = (rowData: Company) => {
        return (
            <>
                <span className="p-column-title">Tax No</span>
                {rowData.taxNo}
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
                        <Column field="taxNo" header="Tax No" sortable body={taxNoBodyTemplate}
                                headerStyle={{minWidth: '10rem'}}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>
                    </DataTable>

                    <Dialog visible={companyDialog} style={{width: '450px'}} header="Company Details" modal
                            className="p-fluid" footer={companyDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={company.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !company.name
                                })}
                            />
                            {submitted && !company.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="taxNo">Tax No</label>
                            <InputText
                                id="taxNo"
                                value={company.taxNo}
                                onChange={(e) => onInputChange(e, 'taxNo')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !company.taxNo
                                })}
                            />
                        </div>

                    </Dialog>

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
