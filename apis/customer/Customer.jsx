import HTTPService from 'services/HTTPServices'

const CustomerAPI = {
  getListCustomer: query => HTTPService.sendRequest('get', `api/khachhang?${query}`),
  getDetailCustomer: id => HTTPService.sendRequest('get', `api/khachhang/${id}`),
  deleteCustomer: id => HTTPService.sendRequest('delete', `api/khachhang/${id}`),
  addCustomer: body => HTTPService.sendRequest('post', 'api/khachhang', body),
  updateCustomer: (id, body) => HTTPService.sendRequest('put', `api/khachhang/${id}`, body)
}

export default CustomerAPI
