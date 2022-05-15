import { AuthService } from "../service/AuthService";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import moment from "moment";
import history from "./history";

export default class Authentication {
  constructor() {
    this.AuthService = new AuthService()
  }
  checkExpired = async () => {
    const cookie = await Cookies.get('user');
    const currentTime = await moment().unix()
    if (!cookie) {
      window.location.href = '/login'
    } else {
      if (((jwtDecode(JSON.parse(cookie).access_token).exp) - currentTime) <= 900) {
        // refresh the token
        this.AuthService.refreshToken(cookie)
      }
      if (currentTime > (jwtDecode(JSON.parse(cookie).access_token).exp)) {
        await Cookies.remove('user')
        await Cookies.remove('userData')
        await Cookies.remove('companyParent')
        await Cookies.set('login_expired', 'true')
        return history.push('/login')
      }
    }
  }
}