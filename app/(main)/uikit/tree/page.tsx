"use client";
import React, { useState, useEffect } from "react";
import {
  Tree,
  TreeCheckboxSelectionKeys,
  TreeMultipleSelectionKeys,
} from "primereact/tree";
import { TreeTable, TreeTableSelectionKeysType } from "primereact/treetable";
import { Column } from "primereact/column";
import { NodeService } from "../../../../demo/service/NodeService";
import { TreeNode } from "primereact/treenode";

const TreeDemo = () => {
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [selectedTreeNodeKeys, setSelectedTreeNodeKeys] = useState<
    string | TreeMultipleSelectionKeys | TreeCheckboxSelectionKeys | null
  >(null);
  const [treeTableNodes, setTreeTableNodes] = useState<TreeNode[]>([]);
  const [selectedTreeTableNodeKeys, setSelectedTreeTableNodeKeys] =
    useState<TreeTableSelectionKeysType | null>(null);

  useEffect(() => {
    NodeService.getTreeNodes().then((data) => setTreeNodes(data));
    NodeService.getTreeTableNodes().then((data) => setTreeTableNodes(data));
  }, []);

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Tree</h5>
          <Tree
            value={treeNodes}
            selectionMode="checkbox"
            selectionKeys={selectedTreeNodeKeys}
            onSelectionChange={(e) => setSelectedTreeNodeKeys(e.value)}
          />
        </div>
      </div>
      <div className="col-12">
        <div className="card">
          <h5>TreeTable</h5>
          <TreeTable
            value={treeTableNodes}
            header="FileSystem"
            selectionMode="checkbox"
            selectionKeys={selectedTreeTableNodeKeys}
            onSelectionChange={(e) => setSelectedTreeTableNodeKeys(e.value)}
          >
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
