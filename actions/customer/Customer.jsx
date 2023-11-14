import CustomerAPI from 'apis/customer/Customer'

export const addCustomer = body =>
  CustomerAPI.addCustomer(body)
    .then(res => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch(error => error)

export const deleteCustomer = id =>
  CustomerAPI.deleteCustomer(id)
    .then(res => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch(error => error)

export const getListCustomer = query =>
  CustomerAPI.getListCustomer(query)
    .then(res => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch(error => error)

export const getDetailCustomer = id =>
  CustomerAPI.getDetailCustomer(id)
    .then(res => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch(error => error)

export const updateCustomer = (id, body) =>
  CustomerAPI.updateCustomer(id, body)
    .then(res => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch(error => error)
