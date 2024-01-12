import HTTPService from 'services/HTTPServices'

const KqthnAPI = {
  getListActions: (query) =>
    HTTPService.sendRequest('get', `api/ketquathuhoino${query ? '?' + query : ''}`),
  //   getDetailCustomer: id => HTTPService.sendRequest('get', `api/khachhang/${id}`),
  //   deleteCustomer: id => HTTPService.sendRequest('delete', `api/khachhang/${id}`),
  addDebtRecoveryResult: (body) => HTTPService.sendRequest('post', 'api/ketquathuhoino', body),
  updateDebtRecoveryResult: (id, body) =>
    HTTPService.sendRequest('put', `api/ketquathuhoino/${id}`, body),
}

export default KqthnAPI
