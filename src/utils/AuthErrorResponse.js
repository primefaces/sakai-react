// import config from '../config.json'
import Cookies from 'js-cookie'

export default function authErrorResponse(data) {
  let summary;

  if (data.status === 401) {
    Cookies.remove('user')
    Cookies.remove('userData')
    Cookies.remove('companyParent')
    Cookies.set('unauthorization', 'true')
    return window.location.href = '/'
  }
  if (data.status === 404) {
    summary = data.data.detail
  }
  if (data.status = 400) {
    summary = data.data.message
  }
  return { severity: 'error', sticky: true, summary: summary }

}