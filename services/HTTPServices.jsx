import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

const HTTPService = {
  sendRequest: (method, url, body, { timeout = 60000 } = {}, responseType = 'json') => {
    const headers = {}
    const request = {
      url,
      method,
      timeout,
      headers,
      responseType
    }
    if (!method.match(/get|head|delete/)) {
      request.data = body || {}
    }
    if (method === 'delete') {
      request.params = body
    }
    return new Promise(resolve => {
      axios
        .request(request)
        .then(res => {
          if (res.status >= 200 && res.status < 300) {
            resolve(res)
          } else {
            resolve({ isError: true, ...res.data })
          }
        })
        .catch(err => resolve({ isError: true, err }))
    })
  }
}

export default HTTPService
