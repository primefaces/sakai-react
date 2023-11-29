/* eslint-disable @next/next/no-img-element */
'use client';
import {Button} from 'primereact/button';
import {Column, ColumnEditorOptions} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import {Dialog} from 'primereact/dialog';
import {FileUpload} from 'primereact/fileupload';
import {InputNumber, InputNumberValueChangeEvent} from 'primereact/inputnumber';
import {InputText} from 'primereact/inputtext';
import {Toast} from 'primereact/toast';
import {Toolbar} from 'primereact/toolbar';
import {classNames} from 'primereact/utils';
import React, {useEffect, useRef, useState} from 'react';
import {FinancialService} from '../../../service/FinancialService';
import {Financial} from "../../../service/types/financial/Financial";
import {Company} from "../../../service/types/company/company";
import {TreeTable} from "primereact/treetable";
import {TreeNode} from "primereact/treenode";
import {Nullable} from "primereact/ts-helpers";
import {FinancialLineType} from "../../../service/types/financial/line/FinancialLineType";
import {FinancialLine} from "../../../service/types/financial/line/FinancialLine";
import {FinancialLineService} from "../../../service/FinancialLineService";
import {Card} from "primereact/card";
import {Panel} from "primereact/panel";

const FinancialCrud = () => {

    let emptyFinancial: Financial = new Financial(2000)

    const [financials, setFinancials] = useState<Financial[]>();
    const [company, setCompany] = useState<Company>();
    const [financialLines, setFinancialLines] = useState<TreeNode[]>();
    const [financialDialog, setFinancialDialog] = useState(false);
    const [linesHidden, setLinesHidden] = useState(true);
    const [financialsHidden, setFinancialsHidden] = useState(false);
    const [deleteFinancialDialog, setDeleteFinancialDialog] = useState(false);
    const [deleteFinancialsDialog, setDeleteFinancialsDialog] = useState(false);
    const [financial, setFinancial] = useState<Financial>(emptyFinancial);
    const [selectedFinancials, setSelectedFinancials] = useState<Financial[]>();
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        let companyString = localStorage.getItem("company");

        if (companyString == null) {
            FinancialService.list().then((data) => setFinancials(data.documents as any));
        } else {
            let company = JSON.parse(companyString) as Company;
            setFinancials(company.financials)

            let financial = new Financial(company.financials[0]!.year as number, company.financials[0]!.companyId, company.financials[0]!.period, company.financials[0]!.type, company.financials[0]!.lines)
            let lines = FinancialService.createLines(financial.actualLines, financial.revisedLines);
            setFinancialLines(lines[0] as TreeNode[])
            setCompany(company)
        }
    }, []);

    const openNew = () => {
        setFinancial(emptyFinancial);
        setSubmitted(false);
        setFinancialDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setFinancialDialog(false);
    };
    const hideLines = () => {
        setLinesHidden(true);
        setFinancialsHidden(false);
    };

    const hideDeleteFinancialDialog = () => {
        setDeleteFinancialDialog(false);
    };

    const hideDeleteFinancialsDialog = () => {
        setDeleteFinancialsDialog(false);
    };

    const saveFinancial = () => {
        setSubmitted(true);

        let _financials = [...(financials as any)];
        let _financial = {...financial};
        if (financial.$id) {
            FinancialService.update(financial.$id, _financial as Financial).then(r => {
                let index = findIndexById(financial.$id as string);
                _financials[index] = _financial;
                setFinancials(_financials);
                toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Financial Updated', life: 3000})
            })
            setFinancialDialog(false);
            setFinancial(emptyFinancial);
        } else {
            FinancialService.add(_financial as Financial).then(r => {
                toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Financial Created', life: 3000});
                _financials.push(r as any);
                setFinancials(_financials as any);
                setFinancialDialog(false);
                setFinancial(emptyFinancial);
            }).catch(e => {
                debugger
                console.log(e)
            })
        }
    };

    const editFinancial = (financial: Financial) => {
        setFinancial({...financial} as Financial);
        setFinancialDialog(true);
    };

    const confirmDeleteFinancial = (financial: Financial) => {
        setFinancial(financial);
        setDeleteFinancialDialog(true);
    };

    const deleteFinancial = () => {
        let _financials = (financials as any)?.filter((val: any) => val.id !== financial.$id);
        FinancialService.remove(financial.$id as string).then(r => {
            setFinancials(_financials);
            setDeleteFinancialDialog(false);
            setFinancial(emptyFinancial);
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Financial Deleted', life: 3000});
        })
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (financials as any)?.length; i++) {
            if ((financials as any)[i].$id === id) {
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
        setDeleteFinancialsDialog(true);
    };

    const selectFinancial = () => {
        let _financial = (selectedFinancials as any)[0]

        toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Company Selected', life: 3000});

        let financial = new Financial(_financial!.year as number, _financial!.companyId, _financial!.period, _financial!.type, _financial!.lines)
        let lines = FinancialService.createLines(financial.actualLines, financial.revisedLines);
        setFinancialLines(lines[0] as TreeNode[])
        setFinancialsHidden(true)
        setLinesHidden(false)
    };

    const deleteSelectedFinancials = () => {
        let _financials = (financials as any)?.filter((val: any) => !(selectedFinancials as any)?.includes(val));

        FinancialService.removeAll((selectedFinancials as Financial[]).map((val: any) => val.$id)).then(r => {
            setFinancials(_financials);
            setDeleteFinancialsDialog(false);
            setSelectedFinancials([]);
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Financials Deleted', life: 3000});
        })
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _financial = {...financial};
        (_financial as any)[`${name}`] = val;

        setFinancial(_financial as Financial);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew}/>
                    <Button label="Delete" icon="pi pi-trash" severity="danger" className=" mr-2"
                            onClick={confirmDeleteSelected}
                            disabled={!selectedFinancials || !(selectedFinancials as any).length}/>
                    <Button label="Select Financial" icon="pi pi-plus" severity="success" className=" mr-2"
                            onClick={selectFinancial}
                            disabled={!selectedFinancials || (selectedFinancials as any).length != 1}/>
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import"
                            className="mr-2 inline-block"/>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV}/>
            </React.Fragment>
        );
    };

    const yearBodyTemplate = (rowData: Financial) => {
        return (
            <>
                <span className="p-column-title">Year</span>
                {rowData.year}
            </>
        );
    };

    const periodBodyTemplate = (rowData: Financial) => {
        return (
            <>
                <span className="p-column-title">Period</span>
                {rowData.period}
            </>
        );
    };


    const typeBodyTemplate = (rowData: Financial) => {
        return (
            <>
                <span className="p-column-title">Type</span>
                <span className={`financial-badge status-${rowData.type}`}>{rowData.type}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Financial) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2"
                        onClick={() => editFinancial(rowData)}/>
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteFinancial(rowData)}/>
            </>
        );
    };

    const header = (
        <div className="flex md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Financials</h5>
        </div>
    );

    const linesHeader = (
        <div className="flex md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Financial Lines</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                           placeholder="Search..."/>
            </span>
        </div>
    );

    const linesCardFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={hideLines}/>
        </>
    );

    const financialDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" text onClick={saveFinancial}/>
        </>
    );
    const deleteFinancialDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFinancialDialog}/>
            <Button label="Yes" icon="pi pi-check" text onClick={deleteFinancial}/>
        </>
    );
    const deleteFinancialsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFinancialsDialog}/>
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedFinancials}/>
        </>
    );

    const onEditorValueChange = (options: ColumnEditorOptions, value: Nullable<number>) => {
        let path = (options.rowIndex.toString()).split('_');

        let nodeList: TreeNode[] = []
        let node;
        while (path.length > 0) {
            let list: any = node ? node.children : financialLines;
            node = list[parseInt(path[0], 10)];
            nodeList.push(node);
            path.shift();
        }
        let prevType = FinancialLineType.PLUS
        let prevDiff = value! - options.value
        let financialLine: FinancialLine
        for (let i = nodeList.length - 1; i >= 0; i--) {
            let line = nodeList[i];
            if (prevType == FinancialLineType.MINUS) {
                line.data.revised = line.data.revised - prevDiff;
                prevDiff = prevDiff * -1;
            } else {
                line.data.revised = line.data.revised + prevDiff;
            }
            if (i == nodeList.length - 1) {
                financialLine = new FinancialLine(line.data.key, line.data.value, line.data.revised)
                financialLine.$id = line.data.$id
            }
            prevType = line.data.type
        }
        FinancialLineService.upsert(financialLine!).then(r => {
            toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Line Updated', life: 3000});
            let index = selectedFinancials![0].lines.findIndex(l => l.$id == financialLine!.$id)
            if (index == -1) {
                selectedFinancials![0].lines.push(financialLine as FinancialLine)
            } else {
                selectedFinancials![0].lines[index] = (financialLine as FinancialLine)
            }
            let financial = new Financial(selectedFinancials![0].year as number, selectedFinancials![0].companyId, selectedFinancials![0].period, selectedFinancials![0].type, selectedFinancials![0].lines)
            let lines = FinancialService.createLines(financial.actualLines, financial.revisedLines);
            setFinancialLines(lines[0] as TreeNode[])
            let financialIndex = company?.financials.findIndex(f => f.$id == selectedFinancials![0].$id)
            company!.financials[financialIndex!] = selectedFinancials![0]
            setCompany(company)
            localStorage.setItem("company", JSON.stringify(company));
        })
    };

    const valueEditor = (options: ColumnEditorOptions) => {
        return <InputNumber disabled={options.node.children.length != 0} min={0}
                            value={options.rowData[options.field]} mode="currency" currency="TRY" locale="tr-TR"
                            onValueChange={(e) => onEditorValueChange(options, e.value)}/>;
    };

    const valueBodyTemplate = (rowData: any) => {
        return new Intl.NumberFormat('tr-TR', {style: 'currency', currency: 'TRY'}).format(rowData.data.value);
    };

    const revisedBodyTemplate = (rowData: any) => {
        return new Intl.NumberFormat('tr-TR', {style: 'currency', currency: 'TRY'}).format(rowData.data.revised);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Card hidden={financialsHidden}>
                        <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                        <DataTable ref={dt} value={financials} selection={selectedFinancials}
                                   onSelectionChange={(e) => setSelectedFinancials(e.value as any)}
                                   dataKey="$id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                   className="datatable-responsive"
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} financials"
                                   globalFilter={globalFilter}
                                   emptyMessage="No financials found." header={header} responsiveLayout="scroll">
                            <Column selectionMode="multiple" headerStyle={{width: '4rem'}}></Column>
                            <Column field="year" header="Year" sortable body={yearBodyTemplate}
                                    headerStyle={{minWidth: '15rem'}}></Column>
                            <Column field="period" header="Period" sortable body={periodBodyTemplate}
                                    headerStyle={{minWidth: '15rem'}}></Column>
                            <Column field="type" header="Type" body={typeBodyTemplate} sortable
                                    headerStyle={{minWidth: '10rem'}}></Column>
                            <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>
                        </DataTable>
                    </Card>

                    <Card hidden={linesHidden} footer={linesCardFooter}>
                        <TreeTable value={financialLines} tableStyle={{minWidth: '50rem'}} header={linesHeader}>
                            <Column field="name" header="Name" expander style={{height: '3.5rem'}}></Column>
                            <Column field="value" header="Value" style={{height: '3.5rem'}}
                                    body={valueBodyTemplate}></Column>
                            <Column field="revised" header="Revised" editor={valueEditor} body={revisedBodyTemplate}
                                    style={{height: '3.5rem'}}></Column>
                        </TreeTable>
                    </Card>

                    <Dialog visible={financialDialog} style={{width: '450px'}} header="Financial Details" modal
                            className="p-fluid" footer={financialDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="year">Year</label>
                            <InputNumber id="year" value={financial.year}
                                         onValueChange={(e: InputNumberValueChangeEvent) => onInputNumberChange(e, 'year')}
                                         required autoFocus min={2020} max={2030} useGrouping={false} showButtons
                                         className={classNames({'p-invalid': submitted && !financial.year})}/>
                            {submitted && !financial.year && <small className="p-invalid">Year is required.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteFinancialDialog} style={{width: '450px'}} header="Confirm" modal
                            footer={deleteFinancialDialogFooter} onHide={hideDeleteFinancialDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {financial && (
                                <span>
                                    Are you sure you want to delete <b>{financial.year}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteFinancialsDialog} style={{width: '450px'}} header="Confirm" modal
                            footer={deleteFinancialsDialogFooter} onHide={hideDeleteFinancialsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {financial && <span>Are you sure you want to delete the selected financials?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default FinancialCrud;
