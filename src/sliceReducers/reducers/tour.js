import { steps } from "../../helpers/introduction"
const initialTourState = {
  key: new Date(),
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: steps.startTask, //startTask //introTask//introClock
}
const tourReducer = (state = initialTourState, action) => {
  switch (action.type) {
    case "tour/START":
      return { ...state, run: true }
    case "tour/RESET":
      return { ...state, stepIndex: 0 }
    case "tour/STOP":
      return { ...state, run: false }
    case "tour/NEXT_OR_PREV":
      return { ...state, ...action.payload }
    case "tour/RESTART":
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    case "tour/SWITCH_STEPS":
      return {
        ...state,
        steps: action.payload,
      }
    default:
      return state
  }
}

export default tourReducer
