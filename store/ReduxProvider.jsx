'use client'

import { Provider } from 'react-redux'
import { legacy_createStore as createStore } from 'redux'

import RootReducer from './reducers/RootReducer'

const reduxStore = createStore(RootReducer)

export default function ReduxProvider({ children }) {
  return <Provider store={reduxStore}>{children}</Provider>
}
