import { createSlice } from "@reduxjs/toolkit"

const initialStateDate = { createdDate: "", startDate: 0, dueDate: "" }
const initialStateTimer = { expectedTime: 0, totalTime: 0 }
const initialStateChildren = []
const initialStateDescription = []

export const taskSlice = createSlice({
  name: "task",
  initialState: {
    date: initialStateDate,
    timer: initialStateTimer,
    description: initialStateDescription,
    subTasks: initialStateChildren,
  },
  reducers: {
    login: (state, action) => {
      state.value = action.payload
    },

    logout: (state) => {
      state.value = initialStateValue
    },
  },
})

export const { login, logout } = taskSlice.actions

export default taskSlice.reducer
