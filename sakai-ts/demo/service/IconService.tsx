import getConfig from 'next/config';
import { Demo } from '../../types/types';

export class IconService {
    icons: Demo.Icon[];
    selectedIcon: Demo.Icon | undefined;
    contextPath: string;
    constructor() {
        this.icons = [];
        this.selectedIcon = {};
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getIcons() {
        return fetch(this.contextPath + '/demo/data/icons.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.icons as Demo.Icon[]);
    }

    getIcon(id: number) {
        if (this.icons) {
            this.selectedIcon = this.icons.find((x: Demo.Icon) => x.properties?.id === id);
            return this.selectedIcon;
        }
    }
}
