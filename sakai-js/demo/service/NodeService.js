export const NodeService = {
    getTreeNodes() {
        return fetch('/demo/data/treenodes.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.root);
    },

    getTreeTableNodes() {
        return fetch('/demo/data/treetablenodes.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.root);
    }
};
