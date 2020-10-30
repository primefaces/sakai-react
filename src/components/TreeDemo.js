import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { NodeService } from '../service/NodeService';

export const TreeDemo = () => {

    const [treeNodes, setTreeNodes] = useState([]);
    const [selectedTreeNodeKeys, setSelectedTreeNodeKeys] = useState(null);
    const [treeTableNodes, setTreeTableNodes] = useState([]);
    const [selectedTreeTableNodeKeys, setSelectedTreeTableNodeKeys] = useState([]);

    useEffect(() => {
        const nodeService = new NodeService();
        nodeService.getTreeNodes().then(data => setTreeNodes(data));
        nodeService.getTreeTableNodes().then(data => setTreeTableNodes(data));
    }, []);

    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card">
                    <h5>Tree</h5>
                    <Tree value={treeNodes} selectionMode="checkbox" selectionKeys={selectedTreeNodeKeys} onSelectionChange={(e) => setSelectedTreeNodeKeys(e.value)}></Tree>
                </div>
            </div>
            <div className="p-col-12">
                <div className="card">
                    <h5>TreeTable</h5>
                    <TreeTable value={treeTableNodes} header="FileSystem" selectionMode="checkbox" selectionKeys={selectedTreeTableNodeKeys} onSelectionChange={(e) => setSelectedTreeTableNodeKeys(e.value)}>
                        <Column field="name" header="Name" expander></Column>
                        <Column field="size" header="Size"></Column>
                        <Column field="type" header="Type"></Column>
                    </TreeTable>
                </div>
            </div>
        </div>
    )
}
