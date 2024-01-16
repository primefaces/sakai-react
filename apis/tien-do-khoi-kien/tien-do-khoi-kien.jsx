import HTTPService from 'services/HTTPServices'

const LawsuitProcessAPI = {
  getListLawsuit: (query) =>
    HTTPService.sendRequest('get', `api/tiendokien${query ? '?' + query : ''}`),
  getDetailLawsuit: (id) => HTTPService.sendRequest('get', `api/tiendokien/${id}`),
  updateLawsuit: (id, body) => HTTPService.sendRequest('patch', `api/tiendokien/${id}`, body),
  //   deleteStaff: id => HTTPService.sendRequest('delete', `api/nhanvien/${id}`),
  addLawsuit: (body) => HTTPService.sendRequest('post', 'api/tiendokien', body),
}

export default LawsuitProcessAPI
