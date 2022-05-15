const initialStatus = {
  isLoading: true,
  alertText: "",
  alertType: "",
  alertIsShow: false,
  confirmText: "",
  openConfirm: false,
  isConfirm: false,
  confirmActionText: "",
  action: () => {},
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
    case "alert/hide":
      return {
        ...state,
        alertIsShow: false,
      }
    case "confirm/status":
      const { context, confirm, callback } = action.payload
      return {
        ...state,
        confirmText: context,
        openConfirm: true,
        confirmActionText: confirm,
        action: callback,
      }
    case "confirm/return":
      return {
        ...state,
        openConfirm: false,
        isConfirm: action.payload,
      }
    case "alert/hide":
      return {
        ...state,
        alertIsShow: false,
      }
    default:
      return state
  }
}

export default statusReducer
