import getConfig from 'next/config';
import { Demo } from '../../types/types';

export class CustomerService {
    contextPath: string;
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getCustomersMedium() {
        return fetch(this.contextPath + '/demo/data/customers-medium.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Customer[]);
    }

    getCustomersLarge() {
        return fetch(this.contextPath + '/demo/data/customers-large.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Customer[]);
    }
}
