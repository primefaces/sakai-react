/* eslint-disable @next/next/no-img-element */
'use client';
import {Button} from 'primereact/button';
import {Column, ColumnEditorOptions} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import {Toast} from 'primereact/toast';
import {Toolbar} from 'primereact/toolbar';
import React, {useEffect, useRef, useState} from 'react';
import {TreeNode} from "primereact/treenode";
import {TreeTable} from "primereact/treetable";
import {FinancialService} from "../../../../service/FinancialService";
import {InputNumber} from "primereact/inputnumber";
import {Nullable} from "primereact/ts-helpers";
import {FinancialLineType} from "../../../../service/types/financial/line/FinancialLineType";
import {FinancialLineService} from "../../../../service/FinancialLineService";
import {FinancialLine} from "../../../../service/types/financial/line/FinancialLine";
import {Company} from "../../../../service/types/company/company";
import {Financial} from "../../../../service/types/financial/Financial";


const FinancialLineCrud = () => {

    const [financialLines, setFinancialLines] = useState<TreeNode[]>();
    const [company, setCompany] = useState<Company>();
    const [financial, setFinancial] = useState<Financial>();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        let companyString = localStorage.getItem("company");
        if (companyString == null) {
            FinancialService.list().then((data) => setFinancialLines(data.documents as TreeNode[]));
        } else {
            let company = JSON.parse(companyString) as Company;
            const urlParams = new URLSearchParams(window.location.search);
            const financialId = urlParams.get('financialId');
            let _financial = company.financials.find(f => f.$id == financialId)

            if(_financial == null){
                toast.current?.show({severity: 'error', summary: 'Error', detail: 'Financial is not found', life: 3000});
            }
            let financial = new Financial(_financial!.year as number, _financial!.companyId, _financial!.period, _financial!.type, _financial!.lines)
            let lines = FinancialService.createLines(financial.actualLines, financial.revisedLines);
            setFinancial(financial)
            setCompany(company)
            setFinancialLines(lines[0] as TreeNode[])
        }
    }, []);

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV}/>
            </React.Fragment>
        );
    };

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
        let financialLine = null
        for (let i = nodeList.length -1; i >= 0; i--) {
            let line = nodeList[i];
            if(prevType == FinancialLineType.MINUS){
                line.data.revised = line.data.revised - prevDiff;
                prevDiff = prevDiff * -1;
            }else{
                line.data.revised = line.data.revised + prevDiff;
            }
            if(financialLine == null){
                financialLine = new FinancialLine(line.data.key, line.data.value, line.data.revised)
                financialLine.$id = line.data.$id
            }
            prevType = line.data.type
        }
        if(financialLine != null){
            FinancialLineService.upsert( financialLine).then(r => {
                toast.current?.show({severity: 'success', summary: 'Successful', detail: 'Line Updated', life: 3000});
                let index  = financial?.lines.findIndex(l => l.$id == financialLine!.$id)
            })
        }
    };

    const valueEditor = (options: ColumnEditorOptions) => {
        return <InputNumber disabled={options.node.children.length != 0} min={0}
                            value={options.rowData[options.field]} mode="currency" currency="TRY" locale="tr-TR"
                            onValueChange={(e) => onEditorValueChange(options, e.value)}/>;
    };

    const valueBodyTemplate = (rowData: any) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY'  }).format(rowData.data.value);
    };

    const revisedBodyTemplate = (rowData: any) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY'  }).format(rowData.data.revised);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>

                    <TreeTable value={financialLines} tableStyle={{minWidth: '50rem'}}>
                        <Column field="name" header="Name" expander style={{height: '3.5rem'}}></Column>
                        <Column field="value" header="Value" style={{height: '3.5rem'}} body={valueBodyTemplate} ></Column>
                        <Column field="revised" header="Revised" editor={valueEditor} body={revisedBodyTemplate} style={{height: '3.5rem'}} ></Column>
                    </TreeTable>
                </div>
            </div>
        </div>
    );
};

export default FinancialLineCrud;
