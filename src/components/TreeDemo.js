import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { TreeTable } from 'primereact/treetable';
import { NodeService } from '../service/NodeService';
import { Column } from 'primereact/column';


export function TreeDemo() {

    const nodeService = new NodeService();

    const [treeNodes, setTreeNodes] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState(null);
   

    const [treeTableNodes, setTreeTableNodes] = useState([]);
    const [selectedNodeKeys2, setSelectedNodeKeys2] = useState([]);
  
    useEffect(() => {
        nodeService.getTreeNodes().then(data => setTreeNodes(data));
        nodeService.getTreeTableNodes().then(data => setTreeTableNodes(data));
    }, []); 

    return (
        <div class="p-grid">
            <div class="p-col-12">
                <div class="card">
                    <h5>Tree</h5>
                    <Tree value={treeNodes} selectionMode="checkbox" selectionKeys={selectedKeys} onSelectionChange={e => setSelectedKeys(e.value)} />
                </div>
            </div>
            <div class="p-col-12">
                <div class="card">
                    <h5>TreeTable</h5>
                    <TreeTable value={treeTableNodes} selectionMode="checkbox" selectionKeys={selectedNodeKeys2} onSelectionChange={e => setSelectedNodeKeys2(e.value)}>
                        <Column field="name" header="Name" expander></Column>
                        <Column field="size" header="Size"></Column>
                        <Column field="type" header="Type"></Column>
                    </TreeTable>
                </div>
            </div >
        </div >
    )
}