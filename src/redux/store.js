import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import * as reducers from './reducers.js'

const rootReducer = combineReducers(reducers)
const store = createStore(rootReducer, applyMiddleware(thunk))
export default store
