import axios from "axios";
import config from '../config.json';
import authHeader from '../utils/axiosHeader';

export class ApplicantService {

    async getApplicant(urlParam){
        if (urlParam){
            try {
                let res = await axios.get(config.BACKEND_API_URL + 'applicant/' + urlParam, {headers: authHeader()})
                let data = res.data;
                return data
            } catch (error){
                return error.response;
            }
        } else {
            try {
                let res = await axios.get(config.BACKEND_API_URL + 'applicant/', { headers: authHeader() })
                let data = res.data;
                return data
            } catch (error) {
                return error.response
            }
        }
    }

    async postApplicant(payload) {
        try {
            let res = await axios.post(config.BACKEND_API_URL + 'applicant/', payload, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }

    async updateApplicant(id, payload) {
        try {
            let res = await axios.put(config.BACKEND_API_URL + `applicant/${id}`, payload, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }

    async deleteTbUrl(id) {
        try {
            let res = await axios.delete(config.BACKEND_API_URL + `applicant/${id}`, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }
}