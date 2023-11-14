'use client'

const initState = {
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : {}
}

const RootReducer = (state = initState, action) => {
  switch (action.type) {
    case '':
      break
    case 'SET_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }

  return state
}

export default RootReducer
