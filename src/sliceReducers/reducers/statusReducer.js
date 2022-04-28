const initialStatus = {
  isLoading: true,
}

function statusReducer(state = initialStatus, action) {
  switch (action.type) {
    case "status/SUCCESS":
      return { ...state, isLoading: false }
    case "status/LOADING":
      return { ...state, isLoading: true }
    case "status/ERROR":
      const err = action.payload
      console.error(err.code, err.message)
      return state
    default:
      return state
  }
}

export default statusReducer
