import { TreeNode } from 'primereact/treenode';

export const NodeService = {
    getFiles() {
        return fetch('/demo/data/files.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as TreeNode[]);
    },

    getLazyFiles() {
        return fetch('/demo/data/files-lazy.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as TreeNode[]);
    },

    getFilesystem() {
        return fetch('/demo/data/filesystem.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as TreeNode[]);
    },

    getLazyFilesystem() {
        return fetch('/demo/data/filesystem-lazy.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as TreeNode[]);
    }
};
