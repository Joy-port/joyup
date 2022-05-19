import { steps } from "../../utils/introduction"
const initialTourState = {
  key: new Date(),
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: steps.startTask,
}
const tourReducer = (state = initialTourState, action) => {
  switch (action.type) {
    case "tour/stop":
      return { ...state, run: false }
    case "tour/toNextOrToPrevious":
      return { ...state, ...action.payload }
    case "tour/restart":
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    case "tour/switchSteps":
      return {
        ...state,
        steps: action.payload,
      }
    default:
      return state
  }
}

export default tourReducer
