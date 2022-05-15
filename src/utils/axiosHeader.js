import Cookies from 'js-cookie'

export default function authHeader() {
  const user = JSON.parse(Cookies.get('user'));

  if (user && user.access_token) {
    return { Authorization: user.token_type + ' ' + user.access_token };
  } else {
    return {};
  }
}