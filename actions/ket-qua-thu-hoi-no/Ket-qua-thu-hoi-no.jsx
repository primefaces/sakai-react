import KqthnAPI from 'apis/ket-qua-thu-hoi-no/ket-qua-thu-hoi-no'

export const addDebtRecoveryResult = (body) =>
  KqthnAPI.addDebtRecoveryResult(body)
    .then((res) => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch((error) => error)

export const getListActions = (query) =>
  KqthnAPI.getListActions(query)
    .then((res) => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch((error) => error)

export const updateDebtRecoveryResult = (query, body) =>
  KqthnAPI.updateDebtRecoveryResult(query, body)
    .then((res) => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch((error) => error)

export const getDebtRecoveryResult = (query) =>
  KqthnAPI.getDebtRecoveryResult(query)
    .then((res) => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch((error) => error)
