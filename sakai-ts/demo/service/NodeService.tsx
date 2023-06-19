import { TreeNode } from 'primereact/treenode';

export const NodeService = {
    getTreeNodes() {
        return fetch('/demo/data/treenodes.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.root as TreeNode[]);
    },

    getTreeTableNodes() {
        return fetch('/demo/data/treetablenodes.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.root as TreeNode[]);
    }
};
