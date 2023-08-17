'use client';
import React, { useState, useEffect } from 'react';
import { Tree, TreeCheckboxSelectionKeys, TreeMultipleSelectionKeys } from 'primereact/tree';
import { TreeTable, TreeTableSelectionKeysType } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { NodeService } from '../../../../demo/service/NodeService';
import { TreeNode } from 'primereact/treenode';

const TreeDemo = () => {
    const [files, setFiles] = useState<TreeNode[]>([]);
    const [files2, setFiles2] = useState<TreeNode[]>([]);
    const [selectedFileKeys, setSelectedFileKeys] = useState<string | TreeMultipleSelectionKeys | TreeCheckboxSelectionKeys | null>(null);
    const [selectedFileKeys2, setSelectedFileKeys2] = useState<TreeTableSelectionKeysType | null>(null);

    useEffect(() => {
        NodeService.getFiles().then((files) => setFiles(files));
        NodeService.getFilesystem().then((files) => setFiles2(files));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Tree</h5>
                    <Tree value={files} selectionMode="checkbox" selectionKeys={selectedFileKeys} onSelectionChange={(e) => setSelectedFileKeys(e.value)} />
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>TreeTable</h5>
                    <TreeTable value={files2} selectionMode="checkbox" selectionKeys={selectedFileKeys2} onSelectionChange={(e) => setSelectedFileKeys2(e.value)}>
                        <Column field="name" header="Name" expander />
                        <Column field="size" header="Size" />
                        <Column field="type" header="Type" />
                    </TreeTable>
                </div>
            </div>
        </div>
    );
};

export default TreeDemo;
