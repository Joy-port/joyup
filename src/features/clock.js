import { createSlice } from "@reduxjs/toolkit"

const initialStateSetting = { timeBase: 5, workTime: 9, breakTime: 2 }
const initialStateStatus = {
  isPaused: false,
  mode: "work",
  secondsLeft: 0,
}
const initialStateDuration = { workNumber: 0, breakNumber: 0, totalTime: 0 }

const initialStateTime = {
  percentage: 0,
  minutes: 0,
  seconds: 0,
}

export const clockSlice = createSlice({
  name: "clock",
  initialState: {
    setting: initialStateSetting,
    duration: initialStateDuration,
    status: initialStateStatus,
    time: initialStateTime,
  },
  reducers: {
    increaseNumber: (state, action) => {
      state.duration[action.payload] += 1
    },
    setPauseStatus: (state, action) => {
      state.status.isPaused = action.payload
    },
    // setSecondsLeft: (state, action) => {
    //   state.status.secondsLeft = action.payload
    // },
    // tickSecondsBackward: (state, action) => {
    //   state.status.secondsLeft--
    // },
    setMode: (state, action) => {
      state.status.mode = action.payload
    },
  },
})

export const {
  increaseNumber,
  setPauseStatus,
  // setSecondsLeft,
  // tickSecondsBackward,
  setMode,
} = clockSlice.actions

export default clockSlice.reducer
