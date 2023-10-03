import getConfig from 'next/config';

export class CountryService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getCountries() {
        return fetch(this.contextPath + '/demo/data/countries.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
