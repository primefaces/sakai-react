import axios from 'axios'

export class CustomerService {
    getCustomersMedium() {
        return axios.get('assets/demo/data/customers-medium.json')
            .then(res => res.data.data);
    }

    getCustomersLarge() {
        return axios.get('assets/demo/data/customers-large.json')
                .then(res => res.data.data);
    }
    
}