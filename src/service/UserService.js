import axios from "axios";
import config from '../config.json';
import authHeader from '../utils/axiosHeader';

export class UserService {

    async getUser(urlParam){
        if (urlParam){
            try {
                let res = await axios.get(config.BACKEND_API_URL + 'users/' + urlParam, {headers: authHeader()})
                let data = res.data;
                return data
            } catch (error){
                return error.response;
            }
        } else {
            try {
                let res = await axios.get(config.BACKEND_API_URL + 'users/', { headers: authHeader() })
                let data = res.data;
                return data
            } catch (error) {
                return error.response
            }
        }
    }

    async postUser(payload) {
        try {
            let res = await axios.post(config.BACKEND_API_URL + 'users/', payload, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }

    async updateUser(id, payload) {
        try {
            let res = await axios.put(config.BACKEND_API_URL + `users/${id}`, payload, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }

    async deleteTbUrl(id) {
        try {
            let res = await axios.delete(config.BACKEND_API_URL + `users/${id}`, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }
}