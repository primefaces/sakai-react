import axios from "axios";
import config from '../config.json';
import authHeader from '../utils/axiosHeader';

export class JobapplicationService {

    async getJobapplication(urlParam){
        if (urlParam){
            try {
                let res = await axios.get(config.BACKEND_API_URL + 'jobapplication/' + urlParam, {headers: authHeader()})
                let data = res.data;
                return data
            } catch (error){
                return error.response;
            }
        } else {
            try {
                let res = await axios.get(config.BACKEND_API_URL + 'jobapplication/', { headers: authHeader() })
                let data = res.data;
                return data
            } catch (error) {
                return error.response
            }
        }
    }

    async postJobapplication(payload) {
        try {
            let res = await axios.post(config.BACKEND_API_URL + 'jobapplication/', payload, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }

    async updateJobapplication(id, payload) {
        try {
            let res = await axios.put(config.BACKEND_API_URL + `jobapplication/${id}`, payload, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }

    async deleteTbUrl(id) {
        try {
            let res = await axios.delete(config.BACKEND_API_URL + `jobapplication/${id}`, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }
}