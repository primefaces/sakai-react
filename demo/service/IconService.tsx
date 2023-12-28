import { Demo } from '@/types';

let icons: Demo.Icon[] = [];
let selectedIcon: Demo.Icon | undefined;
export const IconService = {
    getIcons() {
        return fetch('/demo/data/icons.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.icons as Demo.Icon[]);
    },

    getIcon(id: number) {
        if (icons) {
            selectedIcon = icons.find((x: Demo.Icon) => x.properties?.id === id);
            return selectedIcon;
        }
    }
};
