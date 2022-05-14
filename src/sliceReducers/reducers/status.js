const initialStatus = {
  isLoading: true,
  alertText: "",
  alertType: "",
  alertIsShow: false,
}

function statusReducer(state = initialStatus, action) {
  switch (action.type) {
    case "status/SUCCESS":
      return { ...state, isLoading: false }
    case "status/LOADING":
      return { ...state, isLoading: true }
    case "status/ERROR":
      const err = action.payload
      console.error(err.code, err.message, err)
      return state
    case "alert/status":
      console.log(action.payload)
      const { text, type } = action.payload
      return {
        ...state,
        alertText: text,
        alertType: type,
        alertIsShow: true,
      }
    default:
      return state
  }
}

export default statusReducer
