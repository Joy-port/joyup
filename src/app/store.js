import { configureStore } from "@reduxjs/toolkit"
import clockReducer from "../features/clock"
import taskReducer from "../features/task"

export const store = configureStore({
  reducer: {
    clock: clockReducer,
    task: taskReducer,
  },
})
