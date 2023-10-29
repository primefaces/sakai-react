
export const CompanyService = {
    getCompanies() {
        return fetch('/demo/data/companies.json', {headers: {'Cache-Control': 'no-cache'}})
            .then((res) => res.json())
            .then((d) => d.data as CompanyModule.Company[]);
    },

}


