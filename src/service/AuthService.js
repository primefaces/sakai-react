import axios from 'axios';
import config from '../config.json'
import Cookies from 'js-cookie';
import history from '../utils/history';
import authHeader from '../utils/axiosHeader';

export class AuthService {
    async postLogin(payload) {
        try {
            let res = await axios.post(config.BACKEND_API_URL + 'login/token/', payload)
            // res.setHeader('Access-Control-Allow-Credentials', true);
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response); // this is the main part. Use the response property from the error object
            return error.response;
        }
    }

    async refreshToken(userCookie) {
        try {
            const user = JSON.parse(userCookie)
            const authHeader = { Authorization: user.token_type + ' ' + user.refresh_token };
            let res = await axios.get(config.BACKEND_API_URL + 'refresh-token', { headers: authHeader })
            await Cookies.set('user', JSON.stringify(res.data.data))
            console.log('token refreshed')
        } catch (error) {
            // console.log(error.response); // this is the main part. Use the response property from the error object
            await Cookies.remove('user')
            await Cookies.remove('userData')
            await Cookies.remove('companyParent')
            await Cookies.set('login_expired', 'true')
            return history.push('/login')
        }
    }

    async getUserById(id) {
        try {
            let res = await axios.get(config.BACKEND_API_URL + `myco-user/${id}`, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response); // this is the main part. Use the response property from the error object
            return error.response;
        }
    }

}