import { combineReducers } from "redux"
import user from "./reducers/user"
import projects from "./reducers/project"
import task from "./reducers/task"
import tags from "./reducers/tags"
import settings from "./reducers/settings"
import clock from "./reducers/clock"
import status from "./reducers/status"

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
