import getConfig from 'next/config';

export class NodeService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getTreeNodes() {
        return fetch(this.contextPath + '/demo/data/treenodes.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.root);
    }

    getTreeTableNodes() {
        return fetch(this.contextPath + '/demo/data/treetablenodes.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.root);
    }
}
