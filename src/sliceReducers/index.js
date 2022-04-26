import { combineReducers } from "redux"
import clock from "./reducers/clockReducer"
import settings from "./reducers/settingsReducer"
import task from "./reducers/taskReducer"
import tags from "./reducers/tagsReducer"
import status from "./reducers/statusReducer"

const rootReducer = combineReducers({
  settings,
  clock,
  task,
  tags,
  status,
})

export default rootReducer
