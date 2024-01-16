import AppointmentAPI from 'apis/lich-hen/lich-hen'

export const addAppointment = (body) =>
  AppointmentAPI.addAppointment(body)
    .then((res) => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch((error) => error)

export const getListAppointments = (query) =>
  AppointmentAPI.getListAppointments(query)
    .then((res) => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch((error) => error)
