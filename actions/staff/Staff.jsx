import StaffAPI from 'apis/staff/Staff'

export const getListStaff = query =>
  StaffAPI.getListStaff(query)
    .then(res => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch(error => error)

export const deleteStaff = id =>
  StaffAPI.deleteStaff(id)
    .then(res => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch(error => error)

export const addStaff = body =>
  StaffAPI.addStaff(body)
    .then(res => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch(error => error)
