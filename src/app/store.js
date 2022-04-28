import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import rootReducer from "../sliceReducers"
const composedEnhancer = composeWithDevTools(applyMiddleware(thunk))

export const store = createStore(rootReducer, composedEnhancer)
