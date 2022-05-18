export const status = {
  openConfirmModal: function (confirmText) {
    return async (dispatch, getState) => {
      const { isConfirm } = getState().status
      dispatch({
        type: "confirm/status",
        payload: { ...confirmText },
      })
      //   if (isConfirm) {
      //     console.log("do it")
      //     callback && callback()
      //   } else {
      //     console.log("do nothing")
      //   }
    }
  },
}
