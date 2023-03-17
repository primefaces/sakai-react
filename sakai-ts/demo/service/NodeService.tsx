import getConfig from 'next/config';
import TreeNode from 'primereact/treenode';

export class NodeService {
    contextPath: string;

    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getTreeNodes() {
        return fetch(this.contextPath + '/demo/data/treenodes.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.root as TreeNode[]);
    }

    getTreeTableNodes() {
        return fetch(this.contextPath + '/demo/data/treetablenodes.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.root as TreeNode[]);
    }
}
