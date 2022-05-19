import { combineReducers } from "redux"
import user from "./reducers/user"
import projects from "./reducers/project"
import task from "./reducers/task"
import tags from "./reducers/tags"
import clock from "./reducers/clock"
import status from "./reducers/status"
import modals from "./reducers/modals"
import tour from "./reducers/tour"

const rootReducer = combineReducers({
  user,
  projects,
  task,
  tags,
  clock,
  status,
  modals,
  tour,
})

export default rootReducer
