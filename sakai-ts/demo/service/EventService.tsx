import getConfig from 'next/config';
import { Demo } from '../../types/types';

export class EventService {
    contextPath: string;
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getEvents() {
        return fetch('/demo/data/events.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Event);
    }
}
