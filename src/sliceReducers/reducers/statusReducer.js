const initialStatus = {
  isLoading: false,
}

function statusReducer(state = initialStatus, action) {
  switch (action.type) {
    case "status/SUCCESS":
      return { ...state, isLoading: false }
    case "status/LOADING":
      return { ...state, isLoading: true }
    case "status/ERROR":
      const { code, message } = action.payload
      console.error("error code", code, "error message", message)
      return state
    default:
      return state
  }
}

export default statusReducer
