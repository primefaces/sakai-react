import HTTPService from 'services/HTTPServices'

const AppointmentAPI = {
  getListAppointments: (query) =>
    HTTPService.sendRequest('get', `api/lichhen${query ? '?' + query : ''}`),
  //   getDetailLawsuit: (id) => HTTPService.sendRequest('get', `api/tiendokien/${id}`),
  //   updateLawsuit: (id, body) => HTTPService.sendRequest('patch', `api/tiendokien/${id}`, body),
  //   deleteStaff: id => HTTPService.sendRequest('delete', `api/nhanvien/${id}`),
  addAppointment: (body) => HTTPService.sendRequest('post', 'api/lichhen', body),
}

export default AppointmentAPI
