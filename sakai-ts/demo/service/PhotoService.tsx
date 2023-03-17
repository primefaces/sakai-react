import getConfig from 'next/config';
import { Demo } from '../../types/types';

export class PhotoService {
    contextPath: string;
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getImages() {
        return fetch(this.contextPath + '/demo/data/photos.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Photo[]);
    }
}
