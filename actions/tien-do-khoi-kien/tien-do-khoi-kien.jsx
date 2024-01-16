import LawsuitProcessAPI from 'apis/tien-do-khoi-kien/tien-do-khoi-kien'

export const addLawsuit = (body) =>
  LawsuitProcessAPI.addLawsuit(body)
    .then((res) => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch((error) => error)

export const getListLawsuit = (query) =>
  LawsuitProcessAPI.getListLawsuit(query)
    .then((res) => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch((error) => error)

export const getDetailLawsuit = (id) =>
  LawsuitProcessAPI.getDetailLawsuit(id)
    .then((res) => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch((error) => error)

export const updateLawsuit = (id, body) =>
  LawsuitProcessAPI.updateLawsuit(id, body)
    .then((res) => {
      const { isError, data, err } = res
      return isError ? err : data
    })
    .catch((error) => error)
