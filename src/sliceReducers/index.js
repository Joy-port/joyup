import { combineReducers } from "redux"
import user from "./reducers/userReducer"
import projects from "./reducers/projectReducer"
import task from "./reducers/taskReducer"
import tags from "./reducers/tagsReducer"
import settings from "./reducers/settingsReducer"
import clock from "./reducers/clockReducer"
import status from "./reducers/statusReducer"

const rootReducer = combineReducers({
  user,
  projects,
  task,
  tags,
  clock,
  settings,
  status,
})

export default rootReducer
